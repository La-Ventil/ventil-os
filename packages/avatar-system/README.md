# `@repo/avatar-system`

Internal avatar system for Ventil O.S.

This package is the source of truth for shared avatar rendering, catalog data, and editor assets.

## Scope

`@repo/avatar-system` owns:

- avatar catalog data
- avatar selection helpers
- renderer CSS and markup helpers
- editor preview assets and category icons
- public package exports used by apps

Consumers include:

- `apps/web`
- `apps/belle-binette`
- `packages/ui`

## Source Of Truth

Canonical files live here:

- `packages/avatar-system/src/avatar.json`
- `packages/avatar-system/src/avatar.less`
- `packages/avatar-system/src/editor-controls.less`
- `packages/avatar-system/src/images/renderer/...`
- `packages/avatar-system/src/images/editor/categories/...`
- `packages/avatar-system/src/images/editor/previews/...`

Apps should consume this package instead of re-declaring avatar catalog rules locally.

## Public Exports

Main runtime exports:

- `@repo/avatar-system`
- `@repo/avatar-system/react`
- `@repo/avatar-system/config`
- `@repo/avatar-system/editor-assets`
- `@repo/avatar-system/avatar.css`
- `@repo/avatar-system/editor-controls.css`
- `@repo/avatar-system/avatar.json`
- `@repo/avatar-system/images/*`

## Key Rules

### Stable selection keys

Avatar color selection keys are based on stable ids, not on array order.

Examples:

- `hair-color`
- `glasses-frame-color`
- `glasses-tiles-color`

If category or color-group ordering changes, persisted keys must remain stable.

### Full catalog categories

The catalog is the source of truth for available categories.

There is no local `visible` flag contract anymore for editor exposure in this package.

### Shared package neutrality

This package does not own app-specific public routes.

Apps may build public URLs from package exports or helpers, but route topology stays in the app layer.

## Main APIs

- `createInitialAvatarSelection()`
- `createInitialAvatarSelectionFromConfig(...)`
- `resolveAvatarSelection(...)`
- `buildAvatarClassName(...)`
- `getAvatarColorSelectionKey(...)`
- `getAvatarCatalogColorSelectionKey(...)`
- `getAvatarOptionPreviewPublicPath(...)`
- `loadAvatarConfig(...)`

## Build Notes

Styles are built to:

- `dist/avatar.css`
- `dist/editor-controls.css`

Catalog and images are copied to:

- `dist/avatar.json`
- `dist/images/...`

## Consumer Rule

If a consumer needs:

- a runtime route
- a base path
- a public URL prefix

that value should be injected or resolved by the app, not hardcoded into this package.
