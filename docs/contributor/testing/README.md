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

## Vocabulary (user journey vs usecase)

### Usecase (business / application)

A `usecase` is an application-level business action or query (often a command/query in `@repo/application`).

Examples:
- `reserveMachine`
- `setOpenBadgeStatus`
- `viewUserProfile`

Characteristics:
- can be executed without the UI
- orchestrates domain rules, repositories, and policies
- should be tested primarily with unit/integration tests (`Vitest` / `Jest`)

### User journey (end-to-end)

A `user journey` is a user-visible flow across screens, forms, dialogs, and actions.
It usually triggers one or more usecases.

Examples:
- sign in and reach `/hub/profile`
- open admin list, use quick actions, and toggle an open badge status
- open machine modal, fill reservation form, and confirm reservation

Characteristics:
- includes UI, routing, client/server actions, application layer, and persistence
- validated with `Playwright` end-to-end tests

### Practical rule

- Test the **usecase logic** in `Vitest` / `Jest`.
- Test the **user journey** in `Playwright`.
- When we say "test the usecase in full", we mean validating the user journey that exercises that usecase
  end-to-end (`UI + app + DB`).

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
- `pnpm test:e2e:parallel` (runs `journeys` and `a11y` in parallel, isolated DB schemas)
- `pnpm test:e2e:workers` (worker-level parallelism, isolated schema + Next server per worker)

From `apps/web`:
- `pnpm test:e2e`
- `pnpm test:e2e:journeys`
- `pnpm test:e2e:a11y`
- `pnpm test:e2e:journeys:isolated` (`PLAYWRIGHT_DB_SLOT=journeys`, `PORT=3001`)
- `pnpm test:e2e:a11y:isolated` (`PLAYWRIGHT_DB_SLOT=a11y`, `PORT=3002`)
- `pnpm test:e2e:parallel` (process-level parallelism with isolated schemas)
- `pnpm test:e2e:workers` (all projects, worker-level parallelism)
- `pnpm test:e2e:journeys:workers` (journeys only, worker-level parallelism)
- `pnpm test:e2e:a11y:workers` (a11y only, worker-level parallelism)
- `pnpm test:e2e:smoke`

## Current constraints

- Playwright runs with `workers: 1` by default because the suite currently uses a shared reset/seeded DB.
- This favors stability for mutation-heavy admin flows.
- We now support **process-level parallelism** (`journeys` + `a11y`) by running separate Playwright
  processes with different `PLAYWRIGHT_DB_SLOT` values (separate Postgres schemas) and different ports.
- We now also support an **opt-in worker-level parallel mode** (`PLAYWRIGHT_WORKER_PARALLEL=1`).
- In this mode, each worker starts its own Next dev server and uses its own DB schema.
- This is heavier (multiple resets/seeds + multiple dev servers), but allows true worker concurrency.

## E2E DB isolation (Playwright processes)

- `PLAYWRIGHT_DB_SLOT` selects a dedicated Prisma/Postgres schema for Playwright setup/teardown
  (schema name pattern: `e2e_<slot>`).
- The app server process inherits the same `DATABASE_URL` override, so UI actions and setup use the same schema.
- `NEXT_DIST_DIR` should also be unique per parallel process to avoid Next.js dev lock collisions.
- Example:
  - `PLAYWRIGHT_DB_SLOT=journeys PORT=3001 NEXT_DIST_DIR=.next-e2e-journeys pnpm --filter web test:e2e:journeys`
  - `PLAYWRIGHT_DB_SLOT=a11y PORT=3002 NEXT_DIST_DIR=.next-e2e-a11y pnpm --filter web test:e2e:a11y`

## E2E worker isolation (Playwright workers)

- Enable with `PLAYWRIGHT_WORKER_PARALLEL=1`.
- `webServer` and shared setup/teardown are disabled in this mode.
- A worker-scoped fixture performs:
  - DB reset/seed on a worker-specific schema
  - Next dev server boot on a worker-specific port and `NEXT_DIST_DIR`
  - worker cleanup on teardown
- Worker schema pattern:
  - `e2e_<PLAYWRIGHT_DB_SLOT>-<project>-w<parallelIndex>`
- Example:
  - `PLAYWRIGHT_WORKER_PARALLEL=1 PLAYWRIGHT_WORKERS=2 PLAYWRIGHT_DB_SLOT=workers pnpm --filter web test:e2e:journeys:workers`

## Related ADRs

- `docs/contributor/adr/ADR-011-lint-typecheck-test-policy.md`
- `docs/contributor/adr/ADR-014-accessibility-target-and-audit-approach.md`
