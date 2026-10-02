# Contributing

This is the canonical contribution guide for the repository.

## Before You Start

Useful references:

- Project overview and local setup: [`README.md`](../../README.md)
- Release notes: [`CHANGELOG.md`](../../CHANGELOG.md)
- ADRs: [`docs/contributor/adr/README.md`](./adr/README.md)
- Testing strategy: [`docs/contributor/testing/README.md`](./testing/README.md)
- Accessibility process: [`docs/contributor/accessibility/README.md`](./accessibility/README.md)

## Local Email Capture (Mailpit)

Local development uses `Mailpit` to capture transactional emails sent by `apps/web`.

- `docker compose up` starts Mailpit alongside Postgres
- SMTP is available on `localhost:1025`
- the Mailpit web UI is available on `http://localhost:8025`
- use it to inspect emails triggered by local flows such as sign up, email verification, email change verification, and password reset

For local SMTP defaults, see [`apps/web/.env.example`](../../apps/web/.env.example).

Playwright auth helpers also read emails from Mailpit.

- default base URL: `http://127.0.0.1:8025`
- override with `MAILPIT_BASE_URL` only if Mailpit is not running on the default local address

## Contribution Scope

Contributions are welcome across:

- frontend and UI
- accessibility
- i18n and content
- testing and documentation

## Expected Quality Checks

Run at least:

```bash
pnpm lint
pnpm --filter web check-types
```

Useful targeted commands:

```bash
timeout 5m pnpm lint:dev
pnpm --filter web test
```

A client component must not import a barrel that reaches `@repo/db` (the `@repo/application` root, `lib/auth`):
the Prisma 7 driver adapter pulls in `pg`, and the Turbopack build fails with
"Can't resolve 'dns'" (or `net`, `tls`). Import the specific module instead.

## Common Pitfalls

**Postgres won't start: "in 18+, these Docker images are configured to store database data
in a format…"** The volume holds data from the old mount on `/var/lib/postgresql/data`;
Postgres 18 expects one mount on `/var/lib/postgresql`. Pull, then recreate the local
volume (this drops the local database) and run migrate and seed again:

```bash
docker compose down
docker volume ls | grep postgres_data_ventilos   # find its name
docker volume rm <volume_name>
docker compose up -d
```

**`check-types` fails on `.next/types/validator.ts` with "Cannot find module
'../../app/…/page.js'".** The generated route types still list routes that were renamed
or removed. `pnpm --filter web check-types` regenerates them; to fix a checkout by hand:

```bash
pnpm --filter web exec next typegen   # or: rm -rf apps/web/.next/types
```

## Change Gates

Use the smallest gate that matches the lifecycle stage.

- Pull request gate: `lint` + `check-types` + targeted tests for the changed surface
- Git release gate: clean worktree on `dev`, then `pnpm test`, `pnpm build`, and `pnpm release:git`
- Deploy gate: separate from git release, triggered automatically by a push on `main` via Clever Cloud, and requires a production smoke check

Terminology:

- `release` means git publication (`dev` -> `main`, version bump, changelog, tag)
- `deploy` means a real production deployment

Production deploy process:

- `pnpm release:git` pushes the git release to `main`
- Clever Cloud deploys `main` automatically through its GitHub integration
- after deployment, run the mandatory production smoke check (`/api/smoke`)

Everything else about the platform — applications, scaling, environment variables, manual
deployments and known failure modes — is in [`clever-cloud.md`](./clever-cloud.md).

## Documentation Rule

- `docs/` is the documentation source of truth
- `apps/docs` is a presentation layer only
- contributor-facing documentation belongs under `docs/contributor/`

Documentation priority:

- Use ADRs for transversal architectural rules.
- Use package or app `README.md` files for local contracts and conventions.
- If documents diverge, prefer the relevant ADR first, then the relevant package/app README, then the root `README.md`.
- The root `README.md` is an overview and setup guide, not the canonical source for package-level conventions.

## Pull Requests

Before opening a pull request:

- keep changes scoped and coherent
- update documentation when behavior or conventions change
- follow the ADRs and testing guidance when your change touches those areas
