# `@repo/form`

Internal form primitives for Ventil O.S.

This package is the shared form layer used by `apps/web` and `packages/ui`.

Reference ADR:

- `docs/contributor/adr/ADR-008-form-handling-and-validation.md`

## Scope

`@repo/form` is not a generic public form framework.

It provides a shared contract and a small set of helpers for:

- server actions returning a consistent `FormState`
- Zod-backed validation
- inline field errors
- aggregated form feedback
- redisplay values after failed submit
- optional client-side validation around `useActionState(...)`

## Main modules

- `@repo/form/form-state`
  - `FormState`
  - `FormFieldPath`
  - `FormFieldErrors`
  - `createFormState(...)`

- `@repo/form/form-state-builders`
  - `formSuccess(...)`
  - `formError(...)`
  - `formValidationError(...)`

- `@repo/form/form-errors`
  - field-level accessors for inline rendering

- `@repo/form/form-feedback`
  - aggregated feedback helpers for banners, dialogs, and toasts

- `@repo/form/zod-errors`
  - mapping from Zod issues to field errors

- `@repo/form/use-form-action-state`
  - wrapper around React `useActionState(...)`
  - client validation
  - retry / offline behavior
  - redisplay values from `FormData`

## Current conventions

- Server actions are the source of truth for validation and persistence.
- `FormState.valid` is the canonical validation flag.
- `FormState.isValid` is legacy compatibility only and should not be used for new code.
- Nested field paths are supported, for example:
  - `levels.0.title`
  - `levels.0.description`
- Inline errors and global feedback are separate concerns by design.

## Practical rule

Use:

- `form-errors` when rendering a message next to one field
- `form-feedback` when rendering one normalized message for the whole action result

## Validation note

When client-side validation fails:

- field errors should stay attached to their actual field path
- redisplay values should be preserved from `FormData`
- file inputs are not rehydrated and must be reselected
