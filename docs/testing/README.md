# Testing Strategy (Monorepo)

## Why the test stack is mixed

The suite is not fully unified by runner, and this is currently intentional.

- `Vitest` is used for fast unit tests and lightweight integration tests in ESM-first packages
  (`@repo/application`, `@repo/form`).
- `Jest` is kept in packages with existing presets or older setup
  (`@repo/db`, `@repo/logger`, `apps/sms`).
- `Playwright` is used for end-to-end user journeys and accessibility smoke checks in `apps/web`.

The goal is to unify **testing levels and conventions** first, then migrate runners only when it has
clear ROI.

## Test levels (what goes where)

### Domain / application rules (`Vitest` / `Jest`)

Use for:
- domain rules and policies
- application usecases (commands/queries) in isolation
- error mapping and edge cases

Do not use `Playwright` for this level unless the behavior must be validated through the full UI flow.

### Repository / DB integration (`Jest` today)

Use for:
- Prisma mappings and normalization
- repository behavior
- persistence constraints

### Full user journeys (`Playwright`)

Use for:
- "usecase in full" validation (`UI + app + DB`)
- auth flows
- admin quick actions and mutations
- critical workflows across routing/modals/forms

### Accessibility checks (`Playwright` + manual audit)

Use `Playwright` for:
- keyboard navigation
- dialogs/menus behavior (`Esc`, focus, labels)
- ARIA regressions
- `axe` smoke checks

Keep manual checks for:
- screen readers (`NVDA` / `VoiceOver`)
- zoom/reflow (`200%` to `400%`)
- RGAA-inspired human review

## Playwright suite structure (`apps/web/e2e`)

- `fixtures/`: shared `test.extend(...)` fixtures (seed users, `loginAs`)
- `helpers/`: reusable helpers (auth, keyboard, dialogs, quick actions, a11y)
- `journeys/`: full end-to-end critical journeys
- `a11y/`: accessibility-focused journey checks
- `smoke/`: lightweight smoke checks

## Scripts

From repo root:
- `pnpm test:e2e`
- `pnpm test:e2e:journeys`
- `pnpm test:e2e:a11y`

From `apps/web`:
- `pnpm test:e2e`
- `pnpm test:e2e:journeys`
- `pnpm test:e2e:a11y`
- `pnpm test:e2e:smoke`

## Current constraints

- Playwright runs with `workers: 1` by default because the suite currently uses a shared reset/seeded DB.
- This favors stability for mutation-heavy admin flows.
- If we later isolate data per worker, parallelization can be reintroduced safely.

## Related ADRs

- `docs/adr/ADR-011-lint-typecheck-test-policy.md`
- `docs/adr/ADR-014-accessibility-target-and-audit-approach.md`
