# ADR-004 - Conventional Commits

## Status
Accepted

## Date
2026-01-22

## Context

We need consistent commit messages to improve changelog generation, review clarity, and automated release tooling. The current commit history mixes styles, which makes it harder to understand intent and extract meaningful release notes.

---

## Decision

Adopt the Conventional Commits specification for all commits in this repository.

Format:
`<type>[optional scope]: <description>`

Rules:
- Use a short, imperative description in the subject line.
- Keep the subject line under 72 characters when possible.
- Use optional body/footer to add context.
- Mark breaking changes with `!` in the type or with a `BREAKING CHANGE:` footer.
- Use `pnpm commit` (commitizen) to generate compliant messages when unsure.

Common types:
- `feat`: new feature
- `fix`: bug fix
- `perf`: performance
- `style`: styles
- `docs`: documentation
- `refactor`: refactoring with no behavior change (hidden in changelog)
- `test`: adding or updating tests (hidden in changelog)
- `build`: build tooling (hidden in changelog)
- `ci`: CI configuration or scripts (hidden in changelog)
- `revert`: revert commits (hidden in changelog)
- `chore`: maintenance tasks (hidden in changelog)

Examples:
- `feat(ui): add open badge modal`
- `fix(api): handle empty response`
- `refactor: simplify tab config`

---

## Consequences

- Commit history becomes predictable and easier to scan.
- Release automation can generate changelogs reliably.
- Reviewers can quickly understand the intent of each change.
