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
- the production Clever Cloud application is linked to this GitHub repository
- Clever Cloud deploys automatically when the configured deployment branch receives a push
- for this repository, the production deployment branch is `main`
- after deployment, run the mandatory production smoke check

Reference:

- Clever Cloud docs: https://www.clever.cloud/developers/doc/ci-cd/github/

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
