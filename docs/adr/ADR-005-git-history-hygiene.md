# ADR-005: Git History Hygiene

## Status
Accepted

## Context
We want a clean, traceable history that is easy for humans and machines (including AI) to read and reason about.

## Decision
We will prefer operations that preserve file history and keep commits focused and readable.

## Rules
- Use `git mv` for renames/moves (avoid delete + recreate).
- Prefer small, focused commits with clear intent.
- Use `git commit --amend` to fix the last commit when appropriate.
- Use `git rebase` to keep branch history linear and tidy before merging.
- Avoid mixing unrelated changes in one commit.
- Keep commit messages aligned with `ADR-004-conventional-commits`.

## Automation/Checks
- Reviews should flag delete+recreate patterns when a move is intended.
- CI/lint output should not be committed unless explicitly required.
