# ADR-013: Git Release Process (Dev → Main)

## Status
Accepted

## Date
2026-04-14

## Context
We use a two-branch model with `dev` and `main`.
We need a release process that stays explicit about what is a git publication versus what is a real production deployment.
We also want a changelog generated from conventional commits with `standard-version`.

---

## Decision
Use `dev` as the integration branch and `main` as the git release branch.

Terminology:
- `release` means git publication only
- `deploy` means a real production deployment

No `staging` branch is part of the release model.

Release cycle:
1. Merge feature work into `dev`.
2. Run the PR gate on changes proposed to `dev`.
3. Publish a git release by fast-forwarding `main` from `dev`.
4. Generate the release commit and changelog on `main`.
5. Push `main` and the tag.
6. Fast-forward `dev` from `main` to keep both branches aligned.

Quality gates:
- Pull request gate:
  - `pnpm lint:dev`
  - `pnpm check-types`
  - targeted tests for the changed surface
- Git release gate:
  - clean worktree
  - current branch must be `dev`
  - `pnpm test`
  - `pnpm build`
- Deploy gate:
  - production deployment is separate from git publication
  - production deployment is triggered automatically by a push on `main`
  - the production Clever Cloud application must be connected to this GitHub repository and configured to deploy the `main` branch
  - production smoke is mandatory after deploy

Changelog configuration:
- Source of truth: `.versionrc.cjs` (standard-version).
- Sections shown: `feat` (Features), `fix` (Bug Fixes), `perf` (Performance), `style` (Styles), `docs` (Docs).
- Hidden from changelog: `refactor`, `test`, `build`, `ci`, `revert`, `chore`.
- Commit body is included when present (rendered as an indented line under the entry).

Commands (from repo root):
- `pnpm release:git`

CI integration:
- PRs: run lint, typecheck, and targeted tests.
- main push: run build validation for the published git release.
- docs changes on main may also publish GitHub Pages.
- production deployment is handled outside this repository by Clever Cloud's GitHub integration.
- reference:
  - https://www.clever.cloud/developers/doc/ci-cd/github/
  - https://www.clever.cloud/developers/doc/quickstart/

Designer workflow:
1. Create a feature branch from `dev`.
2. Stage changes manually (VS Code “Stage All” or `git add -A`).
3. Commit with `pnpm commit` (commitizen).
4. Push and open a PR to `dev`.
5. If CI fails, fix and push updates to the same branch.

## Consequences
- `main` remains the git release branch with a single release commit per cycle.
- `dev` remains the only integration branch in the release model.
- If `main` diverges from `dev`, the git release fast-forward fails and must be resolved explicitly.
- `release` and `deploy` are no longer overloaded terms.
- Production deploy remains platform-managed by Clever Cloud after each push to `main`.
- Requires standard-version installed at the repo root.

## Related ADRs
- ADR-004-conventional-commits.md
- ADR-005-git-history-hygiene.md
- ADR-011-lint-typecheck-test-policy.md
