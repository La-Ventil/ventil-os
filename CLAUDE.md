# CLAUDE.md — ventil-os

Project context for AI agents. Read this before exploring the codebase.

## Stack

- **pnpm monorepo** with Turborepo
- **Next.js 16 App Router** (`apps/web`) — server actions, parallel routes
- **Prisma** (`packages/db`) — PostgreSQL
- **Vitest** for domain tests, **Playwright** for e2e
- **TypeScript** throughout

## Monorepo packages

| Package | Role |
|---|---|
| `apps/web` | Next.js app — routes, server actions, UI |
| `apps/sms` | Serial port SMS modem listener |
| `packages/application` | Use-cases (commands/queries) |
| `packages/domain` | Pure domain logic — no I/O |
| `packages/db` | Prisma repositories + selects |
| `packages/crypto` | Password hashing (PBKDF2), token hashing (SHA-256) |
| `packages/ui` | Reusable presentational components |
| `packages/form` | Shared form state and hooks |
| `packages/storage` | File upload abstraction |

## Architecture (ADR-006)

Three strict layers — **never skip a layer**:

```
Web (Next.js)  →  Application (use-cases)  →  DB (Prisma repos)
```

- **Web**: calls use-cases only, never imports `@repo/db` directly
- **Application**: orchestrates repos + domain, owns access control and mapping
- **Domain**: pure functions/types, no I/O — owns all invariants and business rules
- **DB**: thin repos, expose stable DTOs not raw Prisma types

CQRS-lite by file suffix: `*.command.ts` (write) / `*.query.ts` (read).

Domain aggregates follow the namespace-object pattern:
```ts
export const Machine = { assertCanReserve(...), reserve(...), ... }
export type Machine = { ... }
```

Domain policies use `assert*` (throws) or `can*` (returns boolean) naming.

## Conventions

**Commits (ADR-004):** `feat | fix | perf | style | docs | refactor | test | build | ci | revert | chore`
- `refactor` and `test` are hidden from changelog
- Subject line ≤ 72 chars, imperative mood

**Import ordering (ADR-002):**
1. React → 2. Next.js → 3. Next ecosystem → 4. Third-party → 5. `@repo/*` → 6. Relative → 7. Stylesheets

## Agent rules (ADR-005)

- **Never commit** unless explicitly asked
- **Never run `pnpm install`** — provide the command, let the user run it
- **Never run DB migration commands** — provide them for the user
- Run **targeted typecheck** for affected packages only (`pnpm --filter @repo/domain check-types`)
- Full typecheck (`turbo run check-types`) only when explicitly asked or pre-commit
- Run **lint-staged** after file modifications
- Work on `dev` branch or a feature branch

## Testing

Domain tests live in `packages/domain/__tests__/` — run with:
```sh
pnpm --filter @repo/domain test
```

Typecheck per package:
```sh
pnpm --filter @repo/application check-types
```

## ADRs

Full decisions in `docs/contributor/adr/`. Key ones:
- `ADR-002` — Import ordering
- `ADR-004` — Conventional commits
- `ADR-005` — Git history hygiene + agent rules
- `ADR-006` — Layers and data flow (DDD)
- `ADR-009` — Access control and roles
- `ADR-011` — Lint, typecheck, test policy
