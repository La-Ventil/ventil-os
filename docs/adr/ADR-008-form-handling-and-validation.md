# ADR-008 — Form handling and validation strategy

## Status
Accepted

## Date
2026-02-03

## Context

We use server actions with FormData and Zod for validation.
We also support progressive enhancement and client-side validation with retry on network errors.
We need a single, consistent form contract across the app.

---

## Decision

We standardize on:
- **Server actions** as the source of truth for validation and persistence.
- **Client validation** (optional) using the same Zod schemas for early feedback.
- **FormState** contract with `success`, `valid`, `message`, `fieldErrors`, `values`.
- **zod-form-data** for parsing FormData (arrays, checkboxes, files).
- **Retry on network errors** handled in a generic hook (`useFormActionState`).

Rules:
- Server actions validate with Zod and return FormState.
- Client validation runs only when JS is enabled (progressive enhancement).
- Values returned are meant for UI rehydration; files are not re-populated.

---

## Related ADRs

- ADR-006 (Layers, data flow, and pragmatic rules)
- ADR-011 (Lint / typecheck / test policy)

---

## Consequences

- Forms behave consistently across the app.
- Client-side UX improves without breaking non-JS fallback.
- File inputs must be reselected after failed submits (browser constraint).
