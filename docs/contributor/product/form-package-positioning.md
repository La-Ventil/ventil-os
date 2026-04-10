# Form Package Positioning

Snapshot date: 2026-04-09

This note captures a quick market scan for `packages/form` and a recommendation on whether it should be published as a public npm package.

## Current Package

Internal package:

- `packages/form/package.json`
- `packages/form/src/form-state.ts`
- `packages/form/src/use-form-action-state.ts`
- `packages/form/src/form-data.ts`
- `packages/form/src/form-errors.ts`
- `packages/form/src/feedback/form-feedback.ts`
- `packages/form/src/zod-errors.ts`

Current strengths:

- typed `FormState` contract shared between client and server
- `useActionState` wrapper with client validation and retry handling
- Zod error mapping to inline field errors, including nested paths
- best-effort `FormData` to redisplay values reconstruction
- separation between inline field errors and aggregated form feedback
- support for nested field paths such as `levels.0.title`

Current limitations for public npm publication:

- package is private
- package exports point to source files, not a public build output
- no public README or examples
- package API is still shaped by Ventil O.S. conventions
- current naming (`@repo/form`) is workspace-only

## Market Scan

This package should not be evaluated against the whole “React form library” market unless it is intentionally repositioned that way.

The general market is already crowded:

- `react-hook-form` is the dominant default choice and is extremely popular, with 21.6M weekly downloads in the latest PkgPulse snapshot.
- `formik` is still very widely used, with 3.8M weekly downloads in the latest PkgPulse snapshot.
- `@tanstack/react-form` already covers the “headless, typed, modern React form state” segment.
- `Conform` already covers the “web standards, nested fields, server actions, progressive enhancement” segment.

Sources:

- React Hook Form: https://react-hook-form.com/
- React Hook Form stats: https://www.pkgpulse.com/packages/react-hook-form
- Formik stats: https://www.pkgpulse.com/packages/formik
- TanStack Form docs: https://tanstack.com/form/latest/docs/framework/react
- TanStack Form npm stats page: https://tanstack.com/form/latest/docs/npm-stats
- Conform Next.js integration: https://conform.guide/integration/nextjs
- Conform React: https://www.npmjs.com/package/%40conform-to/react
- Conform Zod: https://www.npmjs.com/package/%40conform-to/zod

## Positioning Analysis

### Low-value positioning

Do not publish this as:

- a generic React form library
- a React Hook Form alternative
- a Formik replacement

Reason:

- the package does not currently have enough breadth, ecosystem surface, or brand differentiation for that fight
- it would be compared directly against mature incumbents with stronger docs, adoption, integrations, and community support

### Better positioning

If published, the package should be positioned as a narrow tool for:

- React 19
- Next.js App Router
- Server Actions
- Zod-backed validation
- inline + aggregate error handling
- nested `FormData` redisplay

This is a narrower and more honest claim:

- not “a new form library”
- but “a thin form-state and validation bridge for server-action-first apps”

That is the part where the package has some real value.

## Where It Brings Value

The strongest distinctives today are:

1. Shared client/server state contract

- `FormState<T>` is simple and explicit.
- It maps well to server action returns.

2. Server-action-first ergonomics

- `useFormActionState(...)` wraps `useActionState(...)` with client-side validation, retry behavior, and error translation.
- This is a pragmatic integration point for App Router forms.

3. Nested field error support

- `FormFieldPath<TValues>` and `FormFieldErrors<TValues>` cover nested keys.
- `zodErrorToFieldErrors(...)` preserves nested paths instead of flattening them away.

4. Redisplay after failed submit

- `formDataToRedisplayValues(...)` is useful when validation fails and the UI must preserve typed input without storing raw `FormData`.

5. Clear separation of concerns

- `form-errors` handles inline field rendering.
- `form-feedback` handles banner/toast/dialog style aggregation.

## Where It Is Still Weak

Compared with mature public libraries, this package is still weak on:

- public documentation
- examples
- adapters/integrations
- ecosystem compatibility story
- package build and publishing setup
- API stabilization
- naming

It is also still tightly coupled to:

- React
- Zod
- `zod-form-data`
- the project’s translation and error-key conventions

That is acceptable internally. It is a product constraint publicly.

## Recommendation

Short version:

- keep the full package private for now
- do not publish it as a general-purpose React form library
- only consider publication if it is intentionally reduced and repositioned

Recommended publishable scope:

- `FormState`
- `form-state-builders`
- `zodErrorToFieldErrors`
- `formDataToRedisplayValues`
- `useFormActionState`
- `form-errors`
- `form-feedback`

Recommended message:

- “Helpers for React 19 / Next.js Server Actions forms with Zod and nested field errors.”

Not:

- “A React form library”

## Go / No-Go

### No-go for now

Do not publish yet if the goal is:

- general adoption
- competing with RHF / Formik / TanStack Form
- broad ecosystem reach

### Go later, under conditions

Consider publication later if all of this is done:

- public package name chosen
- package build output stabilized
- README with 2 complete examples
- explicit comparison against React Hook Form and Conform
- API surface reduced to the server-action-first core
- at least one external consumer outside Ventil O.S.

## Working Conclusion

The package does have value, but mostly as a focused server-action form toolkit.

Its market value is not:

- breadth
- ecosystem dominance
- novelty as a full form library

Its potential value is:

- narrow correctness
- pragmatic App Router integration
- nested validation ergonomics
- a clear client/server form-state contract
