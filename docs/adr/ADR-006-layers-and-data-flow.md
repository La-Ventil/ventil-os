# ADR-006 – Layers, data flow, and pragmatic rules

## Status
Accepted (rolling out)

## Date
2026-02-03

## Context

We want a clear layering rule across the monorepo to prevent direct DB usage in Web
and to keep access control and mapping centralized.
We also introduced a shared form package and a pragmatic approach to domain modeling.

---

## Decision

We keep a simple 3-layer rule:
- **Web (Next.js / actions / UI)**: never talk to DB. Pages/actions call Application use-cases and consume View Models (VM). UI permissions (e.g., “Assign” button) are provided by Application.
- **Application (use-cases)**: owns access control, validation, orchestration of repositories, and mapping to VM/VO. Critical ops (e.g., award open badge) must go through a use-case.
- **DB (Prisma repositories)**: data access + transactions only. Not imported in Web. Should expose DTO/VO, not raw Prisma types.
- **Mocks**: kept for demo; same contract as real use-cases.

Constraints / pragmatic choices:
- Single mapping DB → VM/VO in Application; avoid leaking Prisma schemas upward.
- Next actions call only use-cases; they transform FormData to DTO and manage redirect/feedback but never touch repos directly.
- Seeds provide known admin users and coherent data (badges, machines) to avoid FK issues in demo/test.
- Mocks stay available but are not the default path for final pages.
- The shared form package (@repo/form) owns reusable form state and hooks.
- Pragmatic rule: Prisma entities may be treated as domain objects when needed.

Related ADRs:
- ADR-008 (Form handling and validation strategy)
- ADR-009 (Access control and role rules)
- ADR-012 (Seed and demo data strategy)

## Consequences
- New features must add an Application use-case instead of calling repos from Web.
- Introduce light VO (BadgeId, BadgeLevel, UserRef, etc.) to encode invariants.
- Update repos to return stable DTO/VO; UI mappers consume homogeneous VM.
- Seeds must stay aligned with use-case expectations (badges/machines/admins present).
