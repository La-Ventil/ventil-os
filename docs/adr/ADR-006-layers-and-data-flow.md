# ADR-006 – Layers, data flow, and pragmatic rules

## Decision
We keep a simple 3-layer rule:
- **Web (Next.js / actions / UI)**: never talk to DB. Pages/actions call Application use-cases and consume View Models (VM). UI permissions (e.g., “Assign” button) are provided by Application.
- **Application (use-cases)**: owns access control, validation, orchestration of repositories, and mapping to VM/VO. Critical ops (e.g., award open badge) must go through a use-case.
- **DB (Prisma repositories)**: data access + transactions only. Not imported in Web. Should expose DTO/VO, not raw Prisma types.
- **Mocks**: kept for demo; same contract as real use-cases.

Constraints / pragmatic choices:
- Single mapping DB → VM/VO in Application; avoid leaking Prisma schemas upward.
- Access checks (canManageBadges, canManageUsers, etc.) live in Application and run inside use-cases, not in pages.
- Next actions call only use-cases; they transform FormData to DTO and manage redirect/feedback but never touch repos directly.
- Seeds provide known admin users and coherent data (badges, machines) to avoid FK issues in demo/test.
- Mocks stay available but are not the default path for final pages.

## Status
Accepted (rolling out)

## Consequences
- New features must add an Application use-case instead of calling repos from Web.
- Introduce light VO (BadgeId, BadgeLevel, UserRef, etc.) to encode invariants.
- Update repos to return stable DTO/VO; UI mappers consume homogeneous VM.
- Seeds must stay aligned with use-case expectations (badges/machines/admins present).
