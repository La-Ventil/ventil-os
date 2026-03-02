# ADR-014: Accessibility Target and Audit Approach (RGAA-Inspired)

## Status
Accepted

## Date
2026-02-26

## Context
The product will be used in an official educational environment.
Accessibility and inclusivity are core quality requirements, especially on critical user journeys.

We want a pragmatic, actionable approach inspired by the French public-sector accessibility framework (RGAA 4.1.2), without adopting the full `.gouv.fr` compliance process.

We also want a shared testing approach that combines automated checks, manual verification, and targeted audits.

---

## Decision
Use an accessibility target inspired by `RGAA 4.1.2` at `AA` level for the product scope `Auth + Hub + Admin`.

Apply a pragmatic approach:
- Quick wins first (focus, dialog semantics, labels, keyboard support, obvious contrast issues).
- Targeted accessibility audits on critical flows.
- Iterative fixes prioritized as `P0` / `P1` / `P2`.

Accessibility fixes are part of the Definition of Done for critical user journeys.

Critical journeys include:
1. Login / signup / reset password
2. Machine reservation (modal + form)
3. Admin open badges (create, edit, assign)
4. Admin machines (list, edit)
5. Admin users (list, edit)

Scope and governance limits:
- No multi-year accessibility scheme
- No annual action plan

---

## How We Test (RGAA-Inspired)

Use multiple validation methods. No single tool is sufficient.

Automated checks:
- `Lighthouse` on critical pages
- `axe` checks on critical pages and dialogs
- `Playwright` for critical user journeys (keyboard flows, ARIA regressions, modal/menu behavior)

Manual checks:
- Keyboard-only navigation (`Tab`, `Shift+Tab`, `Enter`, `Esc`)
- Screen reader checks (`NVDA` and/or `VoiceOver`)
- Zoom and reflow checks at `200%` to `400%`

Targeted audit process:
- Use the RGAA-inspired audit checklist in `docs/contributor/accessibility/`
- Produce a report (`OK` / `KO` / `NA`)
- Maintain a prioritized backlog (`P0` / `P1` / `P2`)

Notes:
- `Playwright` is useful for end-to-end user journeys and accessibility smoke tests.
- `Playwright` does not replace manual screen reader testing or a human RGAA-style audit.

---

## Audit Documentation

- `docs/contributor/accessibility/README.md`
- `docs/contributor/accessibility/rgaa-4.1.2-audit-checklist.md`
- `docs/contributor/accessibility/rgaa-4.1.2-report-template.md`
- `docs/contributor/accessibility/rgaa-4.1.2-backlog-template.md`
- `docs/contributor/accessibility/accessibility-declaration-template.md`

---

## Consequences
- Accessibility becomes an explicit quality gate on critical journeys.
- Teams can iterate quickly with quick wins, audits, and prioritized fixes.
- The project has a documented accessibility testing method without adopting heavy administrative process.

## Related ADRs
- docs/contributor/adr/README.md
- ADR-011-lint-typecheck-test-policy.md
