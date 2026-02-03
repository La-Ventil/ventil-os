# ADR-000: ADR Writing Policy (Human + Machine Readable)

## Status
Accepted

## Date
2026-02-03

## Context
We use ADRs to preserve architectural context for humans and automated agents.
Different contributors and chatbots need a consistent, structured format.

---

## Decision
All ADRs must be concise, structured, and machine‑readable.
The goal is to keep history understandable regardless of the agent used.

---

## Rules
- Use the standard sections: Status, Date, Context, Decision, Consequences.
- Keep sentences short and explicit; avoid ambiguous wording.
- Prefer lists over paragraphs when describing rules.
- Include links to related ADRs when relevant.

## Consequences
- Onboarding and reviews are faster.
- Agents can parse ADRs reliably to guide future changes.
