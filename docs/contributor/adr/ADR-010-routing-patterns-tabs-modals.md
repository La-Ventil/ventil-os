# ADR-010 — Routing patterns for tabs and modals

## Status
Accepted

## Date
2026-02-03

## Context

We use Next.js App Router and have UI patterns with:
- tabbed views
- modal dialogs driven by routes

We need a clear routing strategy so pages remain deep-linkable and consistent.

---

## Decision

Rules:
- Tabs are represented by route segments (e.g. `/open-badges/[tab]`).
- Default tab is enforced by redirect to a canonical route.
- Modals use parallel routes (`@modal`) to remain deep-linkable.
- Modals must not break base navigation or SSR.

---

## Related ADRs

- ADR-006 (Layers, data flow, and pragmatic rules)

---

## Consequences

- Each tab has its own URL for sharing and reload.
- Modals can be opened via direct links.
- UI state is reflected in routing, not hidden in client state.
