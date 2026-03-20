# ADR-015 — Validation strategy and Playwright scope

## Status
Accepted

## Date
2026-03-20

## Context

The repo mixes:
- shared packages
- server actions
- route-driven modals
- expensive end-to-end journeys backed by a shared seeded database

Full Playwright runs are slow because they include:
- database reset, migrate, and seed
- Next.js web server startup
- serial execution in shared-DB mode

Without a validation policy, we waste time by:
- rerunning the full E2E suite for local changes that only affect one domain
- running overlapping Playwright sessions against the same port and schema
- debugging stale selectors with the same strategy used for real behavior regressions

---

## Decision

We adopt a validation ladder.

### Validation ladder

Run the smallest validation that can provide meaningful signal first:
1. `lint`
2. `check-types`
3. package tests / unit tests / integration tests
4. targeted Playwright specs or domain folders
5. full Playwright suite once at the end

### Full Playwright is not the default local check

During iteration, prefer targeted runs such as:
- a single spec
- a single domain folder
- a single Playwright project, usually `journeys-chromium`

Run the full Playwright suite only when:
- routing or modal behavior changes across domains
- shared auth/session behavior changes
- shared form primitives or shared UI interaction patterns change
- a release or final confidence pass is required

### Change categories and expected validation

#### UI-only change
Examples:
- copy
- styling
- selector drift
- non-behavioral component markup

Run:
- `pnpm lint`
- `turbo run check-types`
- targeted Playwright only if selectors or interactions changed

#### Hook / reducer / local workflow change
Examples:
- local modal state
- client-side URL sync
- reducer transitions
- local orchestration inside a feature

Run:
- `pnpm lint`
- `turbo run check-types`
- relevant package tests if they exist
- targeted Playwright for the affected feature domain

#### Server action change
Examples:
- reservation submit/update actions
- admin user update actions

Run:
- `pnpm lint`
- `turbo run check-types`
- `pnpm test`
- targeted Playwright specs covering the affected action flow

#### Routing / modal change
Examples:
- intercepted routes
- route-driven modal close/reopen behavior
- URL-driven workflow changes

Run:
- `pnpm lint`
- `turbo run check-types`
- targeted Playwright for the affected modal family
- full Playwright only if the behavior is shared across multiple modal families

#### Shared package change
Examples:
- `packages/ui`
- `packages/application`
- `packages/form`

Run:
- `pnpm lint`
- `turbo run check-types`
- `pnpm test`
- targeted E2E consumers for the changed shared behavior

### Playwright execution rules

- Do not run overlapping shared-DB Playwright sessions locally.
- Prefer `--project=journeys-chromium` during iteration unless the change specifically affects a11y coverage.
- Prefer folder-level domain runs over full-suite reruns.
- Run one full Playwright pass only after targeted validation is green.

### Selector strategy

When a failure is caused by stale UI selectors:
- update helpers first when possible
- avoid treating selector drift like a routing or behavior regression
- rerun only the affected spec or domain slice

---

## Consequences

- Local feedback loops are faster.
- Shared-DB Playwright becomes more reliable because concurrent runs are avoided.
- Full-suite E2E is reserved for moments where it adds real confidence.
- More confidence should move into smaller tests for reducers, hooks, and pure workflow helpers, reducing dependence on expensive browser runs.

## Related ADRs

- ADR-010 (Routing patterns: tabs, modals, parallel routes)
- ADR-011 (Lint / typecheck / test policy)
- ADR-014 (Accessibility target and audit approach)
