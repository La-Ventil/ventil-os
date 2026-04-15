# ADR-016 — App Router colocation and private folders

## Status
Accepted

## Date
2026-04-15

## Context

We use Next.js App Router in `apps/web/app`.

Next.js allows colocating non-routable files inside route segments. It also documents private folders (`_folder`) as the explicit convention for internal implementation files inside `app/`.

Our current tree is mixed:
- some route-coupled internals already live in private folders such as `hub/_avatar-editor` and `hub/fab-lab/_machine-modal`
- other route-coupled internals are colocated directly next to route files such as `signup-page.client.tsx`, `machine-create-form.client.tsx`, or `user-quick-actions.tsx`

This is valid in Next.js, but it is not consistent enough for a team and for coding agents. It also increases the risk of future naming conflicts with Next.js file conventions.

## Decision

Rules for `apps/web/app`:

- Only Next.js route convention files stay directly under a route segment:
  `page.tsx`, `layout.tsx`, `template.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `default.tsx`, `route.ts`, metadata files, and route-segment config exports.
- Route-coupled files that are not route convention files must live in a private folder prefixed with `_`.
- Prefer intent-based private folders over filename suffix sprawl:
  `_components`, `_actions`, `_queries`, `_lib`, `_view`, `_forms`, `_modals`.
- If a route has only one or two private implementation files, a single local private folder is still preferred over colocating those files directly under the segment.
- Files reused across multiple unrelated route segments should not be duplicated in `app/`; they should move to `packages/ui`, `packages/application`, or another appropriate shared package.
- Root-level support files under `apps/web/app` that are part of app wiring but not route segments may stay at the root when they apply to the whole app, for example `providers.tsx`.

Naming guidance:

- Use private folders to mark route-internal code, not only filename suffixes such as `*.client.tsx`.
- A file being a Client Component does not justify bypassing the private-folder rule.
- A file being imported by only one route segment is a strong signal that it belongs in that segment's private folder.

## Consequences

- The `app/` tree stays readable as routing structure first, implementation details second.
- Future Next.js file convention additions are less likely to collide with our internal filenames.
- Reviews become easier because route files and route-internal helpers are separated consistently.
- Existing direct-colocation exceptions in `apps/web/app` should be migrated progressively when touched; no large rename-only refactor is required immediately.

## Related ADRs

- ADR-006 (Layers, data flow, and pragmatic rules)
- ADR-010 (Routing patterns for tabs and modals)
