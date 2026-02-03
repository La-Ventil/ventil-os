# ADR-009 — Access control and role rules

## Status
Accepted

## Date
2026-02-03

## Context

The app has role-based access with:
- global admin
- pedagogical admin
- derived permissions (canManageUsers, canManageBadges, etc.)

We need a single place to define rules and a consistent enforcement strategy.

---

## Decision

Rules:
- Role checks live in **Application** use-cases (not in UI).
- Web pages may hide UI, but **do not** enforce rules.
- Actions and routes must call the relevant permission helpers.

Visibility rules (UI only):
- Admin sections are visible only when `isAdminUser` is true.
- Admin sub-sections are visible only when the related permission is true.

---

## Related ADRs

- ADR-006 (Layers, data flow, and pragmatic rules)

---

## Consequences

- UI reflects permissions but does not replace enforcement.
- All sensitive operations must be protected in Application.
- Route-level redirects remain a UX improvement, not a security boundary.
