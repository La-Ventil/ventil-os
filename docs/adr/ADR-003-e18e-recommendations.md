# ADR-003 — e18e General Rules

## Status
Proposed

## Date
2026-01-22

## Deciders
Frontend team (developers & integrators)

---

## Why e18e

The e18e project brings together people focused on improving JavaScript ecosystem performance. It promotes visibility of dependency choices and shares techniques across the community.

Three areas of focus:
- **cleanup**: reduce/modernize dependency trees.
- **speedup**: improve runtime performance of tools and apps.
- **levelup**: promote modern, lighter alternatives.

---

## Cleanup

**Goal:** clean up dependency trees and modernize packages across the ecosystem.

Targets:
- Bloated, redundant, inactive, outdated, slow, or unused packages.

Actions:
- Modernize existing packages.
- Migrate from redundant/inactive packages.
- Move to lighter and/or faster alternatives.

Discovery tools:
- `npmgraph`, `pkg-size`, and rollup visualizers.

Key checks:
- Large subtrees and duplicated functionality.
- Large dependencies by install size.

---

## Levelup

**Goal:** modern, lighter alternatives to established tools.

Notes:
- Modern runtimes allow smaller, focused packages.
- Ecosystem initiatives: **tinylibs**, **unjs**, **es-tooling**.

---

## Speedup

**Goal:** profiling and improving performance of popular projects.

Tooling signals:
- ESLint: `eslint-plugin-depend`, `eslint-plugin-barrel-files`.
- Biome: `noBarrelFile`, `noReExportAll`.
- Oxlint: `oxc/no-barrel-file`.

Coding tips:
- Avoid generators on hot paths.
- Avoid chaining array methods in hot paths (prefer loops or single pass).
