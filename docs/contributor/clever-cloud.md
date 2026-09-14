# Clever Cloud Operations

Everything this project knows about its hosting platform: what runs where, how a deployment
actually happens, and the failure modes we have already paid for.

Deployment policy itself lives in [`ADR-013`](./adr/ADR-013-release-process.md); this document is
the operational counterpart.

## Applications

Both applications belong to the `La VENTIL` organisation
(`orga_77516503-9582-49b1-8869-f10368797b15`) and are Node runtimes in the `par` zone.

|                   | Production                                 | Staging                                    |
| ----------------- | ------------------------------------------ | ------------------------------------------ |
| Name              | `ventil-os-production`                     | `ventil-os`                                |
| Application ID    | `app_5963036e-5e2e-49ce-be50-66960856d321` | `app_be5631a0-f1c3-476f-8edc-c275aa97ca4e` |
| URL               | https://os.la-ventil.org/                  | https://staging-os.la-ventil.org/          |
| Deployment branch | `main`                                     | `dev`                                      |
| Runtime flavor    | nano, scaling up to XS                     | pico, fixed                                |
| Instances         | 1                                          | 1                                          |
| Build flavor      | M (4 GiB, 4 vCPU), dedicated container     | M, dedicated container                     |

Scaling is **vertical only**: the platform resizes the single instance under load, it never adds a
second one. That keeps the application free of shared-state concerns. Indicative cost, in Clever
credits per month: pico ≈ 4.5, nano ≈ 6, XS ≈ 16; build containers are billed per build minute.

## How a deployment happens

Both applications deploy through Clever Cloud's **GitHub integration**. Pushing the deployment
branch is the normal path — a git release to `main` ([`ADR-013`](./adr/ADR-013-release-process.md))
deploys production, and any push to `dev` deploys staging.

**`clever deploy` does not work here.** Because the integration makes the deployment repository the
GitHub HTTPS URL, the CLI tries to push there without credentials and fails with
`HTTP Error: 401 Unauthorized`. This is expected, not a permissions problem to work around.

To deploy an arbitrary commit by hand:

```sh
clever link <app-id> --alias staging
clever restart --alias staging --commit <full-sha> --exit-on deploy-end
clever unlink staging && rm -f .clever.json   # the link file is not gitignored
```

Add `--without-cache` to force a full rebuild. A failed deployment leaves the previous instance
serving traffic, so a broken build does not take the environment down.

Changing the deployment branch is only reachable through the API:

```sh
clever curl -X PUT -H "Content-Type: application/json" -d '{"branch":"dev"}' \
  https://api.clever-cloud.com/v2/organisations/<org-id>/applications/<app-id>
```

## Node version

Clever Cloud resolves the Node version from `engines.node` in the root `package.json`, taking the
**highest** release that satisfies the range. A loose range is therefore a silent choice: `>=20.19.0`
had production running on Node 26 (_Current_), not on an LTS. The repository now pins the active LTS
in six places that must stay in sync — `engines`, `.nvmrc`, `.node-version`, both `Dockerfile`s and
`node-version:` in the GitHub workflows.

`CC_NODE_VERSION` overrides `engines` when set. It is deliberately **not** set on either application;
check with `clever env --app <app-id> | grep -c '^CC_NODE_VERSION='` (expect `0`) before assuming
`engines` is in charge. The authoritative proof of what actually ran is the deploy log's
`Starting with Node.js vX` line.

## Memory and the heap cap

**Never set `NODE_OPTIONS` on these applications.** The platform already injects a heap cap sized for
each container, and prints it in the deploy log:

```
Add NODE_OPTIONS=--max-old-space-size=2684 to env…   # M build container
Add NODE_OPTIONS=--max-old-space-size=120 to env…    # pico runtime
```

Observed caps: 2684 MiB on the M build container, 120 MiB on pico, 268 MiB on nano, 644 MiB on XS.

An application-level `NODE_OPTIONS` overrides **both** the build and the runtime cap. Setting it to
256 MiB on staging (2026-09-14) left the build with less memory than it needs and killed it with
`FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory`. Moving the same
flag into `CC_RUN_COMMAND` is worse than useless: a command-line flag takes precedence over the
environment variable, so it _raises_ the runtime cap above the value the platform tuned for the
flavor. Both attempts were reverted.

Advertised flavor memory is not usable memory. The metrics report what the system actually sees:
**275.4 MiB on pico**, **516.4 MiB on nano**.

## Environment variables

[`apps/web/.env.production.example`](../../apps/web/.env.production.example) is the reference list.
The ones with non-obvious semantics:

| Variable                   | Why it matters                                                                                                                                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CC_POST_BUILD_HOOK`       | Must be `pnpm db:seed && pnpm exec turbo run build --filter=web...`. A plain `pnpm build` runs all eight workspace builds in parallel on the build container, each with the full heap cap, and the web build gets killed (exit 137).        |
| `CC_RUN_COMMAND`           | `node apps/web/scripts/start-standalone.mjs` — serves the Next standalone output directly. Wrapping it in `pnpm` adds process layers worth tens of MiB.                                                                                     |
| `UPLOADS_DIR`              | Must be the **absolute** mount path (`/home/bas/app_<id>/apps/web/uploads`). The standalone server changes its working directory, so a relative path silently moves and uploads land on the ephemeral disk, to be wiped by the next deploy. |
| `CC_FS_BUCKET`             | Maps the persistent bucket onto that path. Check it points at the environment's _own_ bucket.                                                                                                                                               |
| `CC_HEALTH_CHECK_PATH`     | `/api/health`.                                                                                                                                                                                                                              |
| `CC_NODE_DEV_DEPENDENCIES` | `ignore`, so development dependencies stay out of the runtime image.                                                                                                                                                                        |

Environment variables are injected into the build container as well as the runtime — that is exactly
why an application-level `NODE_OPTIONS` breaks builds.

Setting a value that starts with `--` needs an argument separator, otherwise the CLI parses it as one
of its own options:

```sh
clever env set --app <app-id> -- MY_VAR "--some-flag=value"
```

## Health and metrics

| Endpoint      | Checks                                                                                    |
| ------------- | ----------------------------------------------------------------------------------------- |
| `/api/health` | Process liveness. Used by `CC_HEALTH_CHECK_PATH`.                                         |
| `/api/smoke`  | Liveness **and** a database round-trip, with its latency. Returns 503 when a check fails. |

Both return the deployed `commitId`, which is the quickest way to confirm what a given environment is
actually serving.

Host metrics are not in the repository; fetch them with the Warp 10 token in `apps/web/.env`:

```sh
CLEVER_APP_ID=<app-id> pnpm metrics --hours 24
```

The window is aggregated per host, so a window spanning a deployment reports each release separately —
a convenient before/after comparison. Reference figures from 2026-09-14: production 45.9 % of
516.4 MiB with no upscale event in 22 h; staging 75.8 % of 275.4 MiB, which leaves little headroom and
explains the upscales it used to trigger a few minutes after each deployment.

## Known failure modes

| Symptom                                  | Cause                                                                   | Fix                                                 |
| ---------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------- |
| Build killed, exit 137                   | `CC_POST_BUILD_HOOK` builds all workspaces in parallel on one container | Filter the build: `turbo run build --filter=web...` |
| Build dies with `Reached heap limit`     | An application-level `NODE_OPTIONS` overrode the platform's build cap   | Remove it; never set it                             |
| `clever deploy` returns 401              | The deployment repository is the GitHub URL                             | Use `clever restart --commit`                       |
| Uploaded files 404 after a deploy        | `UPLOADS_DIR` is relative and the standalone server changed directory   | Use the absolute mount path                         |
| Runtime on an unexpected Node version    | `engines.node` is loose, the platform picks the highest match           | Pin the range; verify in the deploy log             |
| Instance sized differently than expected | Autoscaling redeploys appear in `clever activity` as UPSCALE/DOWNSCALE  | Read the activity log before diagnosing a restart   |

## Related documents

- [`ADR-013`](./adr/ADR-013-release-process.md) — release and deploy gates
- [`ADR-007`](./adr/ADR-007-file-uploads-and-storage.md) — file uploads and storage
- [`contributing.md`](./contributing.md) — contribution workflow and quality gates
- Clever Cloud GitHub integration: https://www.clever.cloud/developers/doc/ci-cd/github/
