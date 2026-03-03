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

Use-case intent & naming:
- We keep **user-story verbs** to express intent (e.g., `reserveMachine`, `browseMachines`, `viewMachineDetails`).
- We distinguish **command** vs **query** by file suffix: `*.command.ts` / `*.query.ts`.
- Use-cases are exported from `packages/application/src/machines/usecases/` and represent intent, not CRUD.

Use-cases as orchestrators:
- Use-cases **orchestrate**: they fetch data from repositories, call domain policies/aggregates, and map to VM/VO.
- Domain stays **pure** (no I/O) and owns invariants; repositories stay **thin** (data access only).
- When a use-case grows, extract pure logic into domain policies/services instead of duplicating rules in application.

Command vs query mapping (CQRS-lite):
- **Commands (write path)**: repositories **rehydrate domain aggregates**. Use-cases call domain rules and persist changes.
- **Queries (read path)**: repositories return **read models/DTOs**. Presenters map DTOs to View Models for UI.
- Domain types are required on the command path; they are optional on the query path.

Constraints / pragmatic choices:
- Avoid leaking Prisma types upward; expose stable DTOs (query path) or domain aggregates (command path).
- Next actions call only use-cases; they transform FormData to DTO and manage redirect/feedback but never touch repos directly.
- Seeds provide known admin users and coherent data (badges, machines) to avoid FK issues in demo/test.
- Mocks stay available but are not the default path for final pages.
- The shared form package (@repo/form) owns reusable form state and hooks.
- Pragmatic rule: Prisma entities may be treated as domain objects when needed.

UI ownership:
- `apps/web` should contain route files (`page.tsx`, `layout.tsx`, parallel-route files), server-action wiring, and thin route-specific wrappers.
- `packages/ui` should contain reusable presentational and client components, including generic admin/list/form widgets.
- A component should stay in `apps/web` only when it directly depends on route params, route navigation, page-specific data assembly, or web-only action orchestration.
- When a component becomes route-agnostic or reusable across pages, move it out of `apps/web` into `packages/ui`.

Related ADRs:
- ADR-008 (Form handling and validation strategy)
- ADR-009 (Access control and role rules)
- ADR-012 (Seed and demo data strategy)

## Consequences
- New features must add an Application use-case instead of calling repos from Web.
- Introduce light VO (BadgeId, BadgeLevel, UserRef, etc.) to encode invariants.
- Update repos to return stable DTO/VO; UI mappers consume homogeneous VM.
- Seeds must stay aligned with use-case expectations (badges/machines/admins present).
