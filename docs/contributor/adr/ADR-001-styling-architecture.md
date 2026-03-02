# ADR-001 — Styling Architecture and Section Themes
(Next.js App Router + MUI + Section Themes)

## Status
Accepted

## Date
2026-01-14

## Context

The project uses:
- Next.js (App Router)
- Material UI (MUI)
- A shared design system (@repo/ui/theme)
- Functional sections reflected by URLs:
  - /fabLab/...
  - /openBadge/...
  - /event/...
  - /user/...
  - /support/...
  - /admin/...
  - /repair/...

Each section must:
- have a clear visual identity
- be consistent across its subtree
- differ primarily by **secondary color**

Constraints:
- Automatic theme propagation to all children
- No conditional styling logic inside UI components
- SSR/hydration compatibility
- Architecture readable by humans and applicable by AI

---

## Global Decision

We adopt a **layered styling architecture** with **section themes**:

- The **MUI theme is the single source of truth for tokens**, including colors.
- **Global CSS applies only reset and DOM structure.**
- **Application sections apply a derived theme** at layout level.
- Components consume values via the theme (palette, typography, etc.).
- **CSS Modules only** for shared/local styling. **No `sx` or `styled` in shared components.**
  - Exceptions must be explicitly justified and documented (ADR or inline comment).
  - Global overrides must go through `theme.components.*`.

Core principle:
- Breakpoints define *when* something changes.
- Tokens define *what* changes.
- Section is determined by the URL.
- The section theme is applied at the layout level.

---

## Architecture and Responsibilities

### 1. Theme (@repo/ui/theme) — Source of truth

Responsibilities:
- Define all design tokens:
  - colors (primary, secondary, etc.)
  - typography
  - spacing
  - shape
- Define breakpoints (numeric values)
- Configure MUI components

Allowed:
- palette, typography, spacing, shape, breakpoints
- components.*.styleOverrides and components.*.variants

Forbidden:
- Styles on html or body
- Global CSS reset
- Global layout
- CSS media queries inside typography

Rules:
- Colors are defined **in the theme**
- The theme is the **single source of truth**
- Breakpoints are JS constants

---

### 2. Breakpoints — Critical rule (anti‑bug)

Explicit decision:
- Breakpoints are **JS‑owned**
- They **must not** use CSS variables
- They **must not** be dynamic

Allowed:
- theme.breakpoints.up('md')
- useMediaQuery(theme.breakpoints.up('lg'))

Forbidden:
- var(--bp-md) in breakpoints
- Conflicting responsive rules (JS + CSS)

Contract:
- Theme breakpoints are the only reference
- Global CSS does not define business‑logic responsiveness

---

### 3. Section themes (inner themes)

Decision:
- Each section has a **derived theme** from the global theme
- Section themes express domain identity
- The main variation is the **secondary color**

Sections:
- fabLab
- openBadge
- event
- user
- support
- admin
- repair

Rules:
- Section themes are created via createTheme(baseTheme, …)
- Themes are defined at module level (not inside renders)
- Section themes remain close to the global theme
- Any extra divergence must be **intentional and justified** (UX/design)

---

### 4. Applying section themes (Next.js App Router)

Decision:
- The section theme is applied **at the layout level**
- The section is determined by the URL
- ThemeProvider is used as an inner theme

Implementation:
- One layout per section:
  - app/fabLab/layout.tsx
  - app/openBadge/layout.tsx
  - app/event/layout.tsx
  - etc.

Rules:
- No theme selection inside UI components
- No runtime path‑based logic inside components
- Layout is the single decision point

---

### 5. Global CSS (app/globals.css)

Responsibilities:
- CSS reset
- Global DOM styles (html, body)
- Minimal structure (height, margins, base font)

Allowed:
- reset
- non‑business global styles

Forbidden:
- Color tokens
- Theme or section logic
- App‑specific styling
- `sx` or `styled` usage

Key rule:
- Global CSS is **not** the source of truth for colors
- It applies only structural rules

---

### 6. Layouts — CSS Modules

Responsibilities:
- Page structure (flex, grid, wrappers)
- Local spatial organization

Rules:
- No tokens defined here
- Consume tokens only via the theme

---

### 7. UI Components — CSS Modules

Decision:
- Shared UI components **must** be styled with CSS Modules only
- `sx`/`styled` are forbidden in shared UI (unless explicitly justified)

Icon guidance:
- Custom icons must follow Material UI icon spacing and a 24×24 viewBox.
- Keep consistent padding/alignment with MUI icons so they match baseline sizing.
- Use MUI's SvgIcon conventions (24×24 viewBox, optical alignment) when adding new custom icons.

---

## Consequences

- Shared UI stays theme-consistent and easy to audit.
- Section theming remains SSR-safe and predictable.
- Styling ownership is clear (Theme > Layout > CSS Modules).
