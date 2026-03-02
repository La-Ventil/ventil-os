# ADRs

This directory contains the project's Architectural Decision Records.

## Purpose

ADRs preserve architectural context for humans and automated agents.
They document stable technical decisions, not temporary tasks or audit backlogs.

## When To Write An ADR

Write an ADR when a decision:

- changes architecture or data flow
- sets a long-lived technical convention
- introduces a meaningful tradeoff that should stay understandable later
- is likely to affect future implementation choices

Do not use an ADR for:

- temporary work tracking
- feature backlog items
- test reports
- generic documentation housekeeping

## Writing Rules

- Use the standard sections: `Status`, `Date`, `Context`, `Decision`, `Consequences`
- Keep sentences short and explicit
- Prefer lists over long paragraphs when describing rules
- Link related ADRs when useful

## Conventions

- ADR files use `ADR-XXX-short-title.md`
- Numbering is incremental and stable
- This `README.md` replaces the former `ADR-000` policy file

## Why This Matters

- Onboarding is faster
- Reviews are easier
- Agents can parse decisions consistently and use them to guide future changes
