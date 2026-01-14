# ADR-002 — Import Ordering Convention

## Status
Accepted

## Date
2026-01-15

## Deciders
Frontend team (developers & integrators)

---

## Context

The codebase spans Next.js apps, MUI, and shared monorepo packages. Inconsistent import ordering makes files harder to scan, complicates reviews, and increases merge conflicts.

We need a simple, stable convention that:
- improves readability and onboarding
- supports automatic formatting
- stays compatible with the styling ADR

---

## Decision

Adopt a deterministic import ordering rule based on source origin, with no blank lines required between groups.

Order of groups:
1) React
2) Next.js (`next/*`)
3) Next ecosystem packages (e.g. `next-intl`, `next-auth`)
4) Third‑party packages
5) Monorepo packages (`@repo/*`)
6) Relative imports
7) Stylesheets (`.css`, `.module.css`)

Within each group, sort alphabetically by module path.

---

## Example

```tsx
import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import Link from '@repo/ui/link';
import type { Foo } from './types';
import { bar } from './utils';
import styles from './page.module.css';
```

---

## Consequences

- Files are faster to scan and review.
- Merge conflicts decrease because imports stay in predictable positions.
- Linters/formatters can enforce ordering reliably.
