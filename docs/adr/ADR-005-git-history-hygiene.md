# ADR-005: Git History Hygiene

## Status
Accepted

## Date
2026-02-03

## Context
We want a clean, traceable history that is easy for humans and machines (including AI) to read and reason about.

---

## Decision
We will prefer operations that preserve file history and keep commits focused and readable.

## Rules
- Use `git mv` for renames/moves (avoid delete + recreate).
- Prefer small, focused commits with clear intent.
- Use `git commit --amend` to fix the last commit when appropriate.
- Use `git rebase` to keep branch history linear and tidy before merging.
- Avoid mixing unrelated changes in one commit.
- Keep commit messages aligned with `ADR-004-conventional-commits`.
- The agent must not commit unless explicitly asked.
- When DB commands are needed, the agent must provide the exact command to run (relative to the project root) and must not execute it automatically.
- When new dependencies are introduced, the agent must provide the `pnpm install` command to run (relative to the project root).
- For verification/formatting commands (prettier, check, lint, test), the agent must run them, fix issues, and iterate until there are no errors.

## Automation/Checks
- Reviews should flag delete+recreate patterns when a move is intended.
- CI/lint output should not be committed unless explicitly required.

---

## Related ADRs

- ADR-004 (Conventional commits)

---

## Consequences

- History stays readable and traceable.
- Reviewers can reason about changes faster.
