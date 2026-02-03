# ADR-011 — Lint / typecheck / test policy

## Status
Accepted

## Date
2026-02-03

## Context

We run linting, typechecks, and tests across a monorepo.
Without explicit rules, it is unclear what is required locally vs pre-merge.

---

## Decision

Policy:
- Pre-commit runs lint-staged (format + lint on touched files).
- Developers should run `check-types` for affected packages before PR.
- CI must run `lint`, `check-types`, and `test` for all relevant packages.
- Failing tests block merge.

---

## Related ADRs

- ADR-004 (Conventional commits)
- ADR-003 (e18e general rules)

---

## Consequences

- Local workflow stays fast while CI enforces full coverage.
- Broken typechecks or tests are caught before merge.
