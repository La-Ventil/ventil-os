# E2E Test Suite (Playwright)

This directory is organized by user journeys and accessibility checks.

## Structure

- `fixtures/`: shared Playwright fixtures (`test.extend`)
- `helpers/`: reusable helpers
- `journeys/`: full end-to-end user journey tests (critical use cases)
- `a11y/`: accessibility-focused checks for critical journeys
- `smoke/`: lightweight smoke tests (API/routing/non-critical)

## Helper boundaries

Keep helpers at the right level:

- widget helpers: encapsulate fragile UI components (`Autocomplete`, date picker, dialog controls)
- journey helpers: express user intent (`openReservationComposerForMachine`, `submitReservationUpdate`)
- fixture builders: prepare business state in DB (`givenUpcomingReservation`, `givenCancelledReservation`)
- repositories: lowest-level Prisma access, used by fixture builders rather than directly by most specs

As a rule, specs should read like user behavior plus business assertions, not like a sequence of MUI-specific locators.

## Testing philosophy

- Journey specs validate user-visible behavior end-to-end (`UI + app + DB`).
- Accessibility specs validate keyboard, dialog/menu behavior, and ARIA semantics.
- Domain/application rules still belong to unit/integration tests (`Vitest` / `Jest`).

## Local runtime prerequisites

See the canonical contributor doc:

- `docs/contributor/testing/README.md`

Short version:

- shared-DB Playwright expects the repo-local Postgres on `5433`
- if `localhost:5433` is down, global setup fails before any spec runs

## Canonical locale

- The canonical E2E locale is `en`.
- Playwright starts the app with `APP_LOCALE=en` by default.
- Prefer English locators in new journey specs.
- Use `PLAYWRIGHT_APP_LOCALE=<locale>` only for explicit alternate-locale runs.
