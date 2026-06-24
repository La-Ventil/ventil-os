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

## Form feedback helpers (`@repo/form`)

`@repo/form` now has two distinct client-facing concerns:

- `@repo/form/form-errors`
  - field-level helpers for inline rendering
  - examples:
    - `fieldErrorsFor(...)` to read all messages for one field
    - `fieldErrorMessage(...)` to choose an explicit field strategy (`first` or `join`)
- `@repo/form/form-feedback`
  - aggregated feedback helpers for banners, dialogs, toasts, and action responses
  - example: derive one user-facing success/error message from a whole `FormState`

Practical rule:

- use `form-errors` when the UI is rendering a message under one specific field
- use `form-feedback` when the UI needs one normalized message for an action result

This keeps per-field rendering separate from "global feedback" orchestration and avoids
re-implementing ad hoc `first field error wins` logic in `apps/web`.

## Playwright suite structure (`apps/web/e2e`)

- `fixtures/`: shared `test.extend(...)` fixtures (seed users, `loginAs`)
- `helpers/`: reusable helpers, split by concern whenever possible
- `journeys/`: full end-to-end critical journeys
- `a11y/`: accessibility-focused journey checks
- `smoke/`: lightweight smoke checks

### Canonical locale

- E2E journeys use `en` as the canonical locale.
- This aligns Playwright with the runtime fallback locale and the translation coverage source of truth.
- New journey specs should prefer English locators and assertions.
- French coverage should remain via targeted smoke checks or dedicated locale runs, not via bilingual regex everywhere.
- Override locally only when needed with `PLAYWRIGHT_APP_LOCALE=<locale>`.

### E2E helper conventions

Prefer this layering order when adding new Playwright code:

- `helpers/widgets/` style helpers
  - encapsulate fragile UI primitives (`Autocomplete`, date picker, menu, dialog close behavior)
  - should know how the widget works, but not why the journey uses it
- `helpers/journeys/` style helpers
  - encapsulate an intent such as "open reservation composer" or "submit reservation update"
  - may compose several widget helpers
- `helpers/fixtures/` style helpers
  - create business-ready database state such as `givenUpcomingReservation(...)`
  - should describe state in domain terms, not "latest row then mutate it"
- repository helpers
  - lowest level, Prisma-oriented setup/readback only
  - should stay out of specs unless the spec really needs persistence-level detail

Practical rules:

- a `journey` spec should prefer journey helpers and fixture builders
- an `a11y` spec should start from a prepared state and assert accessibility, not recreate a long flow unless the flow itself is the accessibility target
- when several specs repeat `page.addInitScript(...)` time mocking, create a shared helper instead of copying `MockDate`
- if a spec mostly manipulates widget details, move that logic into a widget helper first
- if a spec mostly manipulates test data shape, move that logic into a fixture builder first

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

## Local prerequisites for Playwright

Before running shared-DB Playwright locally, make sure the repo services are actually running:

```bash
docker compose up -d ventilos_postgres mailpit
```

Expected local endpoints:

- PostgreSQL: `localhost:5433`
- Mailpit SMTP: `localhost:1025`
- Mailpit UI/API: `localhost:8025`

Quick diagnostics:

```bash
pg_isready -h 127.0.0.1 -p 5433
docker compose ps
```

Important:

- `apps/web/.env` points Playwright setup/teardown to `localhost:5433`
- if only a system PostgreSQL is running on `5432`, E2E setup fails before the first test
- this failure can look like a Prisma or shell issue, but is usually just a missing Docker service in the current session

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
