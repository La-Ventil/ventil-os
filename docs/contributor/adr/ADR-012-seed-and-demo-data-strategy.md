# ADR-012 — Seed and demo data strategy

## Status
Accepted

## Date
2026-02-03

## Context

We rely on seeds for local development and demo data.
Seeds must be deterministic, easy to reset, and aligned with use-case expectations.

---

## Decision

Rules:
- Seeds are the source of truth for demo data.
- Seeds must include known admin users.
- Seeds must include coherent badges/machines to avoid FK errors.
- Reset is done via database reset + seed run.

---

## Related ADRs

- ADR-006 (Layers, data flow, and pragmatic rules)

---

## Consequences

- Dev environments are reproducible.
- Admin/demo flows work without manual setup.
- Seed changes should be reviewed like schema changes.
