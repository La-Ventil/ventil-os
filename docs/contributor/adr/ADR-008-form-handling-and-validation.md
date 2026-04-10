# ADR-008 — Form handling and validation strategy

## Status
Accepted

## Date
2026-02-03

## Context

We use server actions with FormData and Zod for validation.
We also support progressive enhancement and client-side validation with retry on network errors.
We need a single, consistent form contract across the app.

Implementation package:

- `packages/form`
- runtime import path: `@repo/form/*`
- package-local reference: `packages/form/README.md`

---

## Decision

We standardize on:
- **Server actions** as the source of truth for validation and persistence.
- **Client validation** (optional) using the same Zod schemas for early feedback.
- **FormState** contract with `success`, `valid`, `message`, `fieldErrors`, `values`, optional `errorCode`.
- **zod-form-data** for parsing FormData (arrays, checkboxes, files).
- **Retry on network errors** handled in a generic hook (`useFormActionState`).
- **Nested field paths** are first-class and may use keys such as `levels.0.title`.
- **Field-level errors** and **aggregated form feedback** are separate concerns.

Rules:
- Server actions validate with Zod and return FormState.
- Client validation runs only when JS is enabled (progressive enhancement).
- Values returned are meant for UI rehydration; files are not re-populated.
- `@repo/form/form-errors` is used for inline field rendering.
- `@repo/form/form-feedback` is used for banners, dialogs, toasts, and action-level feedback.
- `@repo/form/form-state-builders` is the canonical way to build `FormState` results.
- Client-side validation must preserve nested field paths instead of flattening them away.
- Embedded and repeatable subforms are expected to render inline field errors near their actual field.

For package-local API details, module boundaries, and conventions, prefer:

- `packages/form/README.md`

---

## Related ADRs

- ADR-006 (Layers, data flow, and pragmatic rules)
- ADR-011 (Lint / typecheck / test policy)

---

## Consequences

- Forms behave consistently across the app.
- Client-side UX improves without breaking non-JS fallback.
- File inputs must be reselected after failed submits (browser constraint).
- Embedded and repeatable form structures can report inline errors using nested field paths.
- Reviewers should reject changes that collapse nested validation into generic aggregate messages when field-level rendering is possible.
