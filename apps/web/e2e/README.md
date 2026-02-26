# E2E Test Suite (Playwright)

This directory is organized by user journeys and accessibility checks.

## Structure

- `fixtures/`: shared Playwright fixtures (`test.extend`)
- `helpers/`: reusable interaction/assertion helpers
- `journeys/`: full end-to-end user journey tests (critical use cases)
- `a11y/`: accessibility-focused checks for critical journeys
- `smoke/`: lightweight smoke tests (API/routing/non-critical)

## Testing philosophy

- Journey specs validate user-visible behavior end-to-end (`UI + app + DB`).
- Accessibility specs validate keyboard, dialog/menu behavior, and ARIA semantics.
- Domain/application rules still belong to unit/integration tests (`Vitest` / `Jest`).
