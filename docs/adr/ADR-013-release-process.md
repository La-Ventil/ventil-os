# ADR-013: Release Process (Staging → Main)

## Status
Proposed

## Date
2026-02-05

## Context
We have two main branches (dev and main) and a designer working on a separate branch.
We want a simple release flow, a clean history, and low friction for non‑technical contributors.
We also want to generate a changelog using standard-version.

---

## Decision
Use a staging branch to validate changes, release on main, then fast‑forward staging.
This keeps the designer flow simple and preserves a clean, readable history.

Release cycle:
1. Merge or fast‑forward `staging` → `main`.
2. Run `pnpm release` on `main` to create the release commit and changelog.
3. Fast‑forward `staging` → `main` to realign branches.
4. Return to `dev` for continued work.

Commands (from repo root):
- `git fetch origin`
- `git checkout main`
- `git merge --ff-only origin/staging` (or a normal merge if needed)
- `pnpm release`
- `git push origin main`
- `git checkout staging`
- `git merge --ff-only origin/main`
- `git push origin staging`
- `git checkout dev`

CI integration:
- PRs: run lint, typecheck, tests.
- main: deploy and publish release artifacts (if configured).
- staging: deploy for review.

Designer workflow:
1. Create a feature branch from `dev`.
2. Stage changes manually (VS Code “Stage All” or `git add -A`).
3. Commit with `pnpm commit` (commitizen).
4. Push and open a PR to `dev`.
5. If CI fails, fix and push updates to the same branch.

## Consequences
- `main` remains the production release branch with a single release commit per cycle.
- `staging` is always realigned after release, keeping the designer flow simple.
- If `staging` diverges, fast‑forward will fail and a merge is required.
- Requires standard-version installed at the repo root.

## Related ADRs
- ADR-004-conventional-commits.md
- ADR-005-git-history-hygiene.md
- ADR-011-lint-typecheck-test-policy.md
