# Belle Binette

`belle-binette` is a small Vite playground for the shared avatar system.

It is intentionally simple:

- static `index.html`
- one `script.ts`
- one `style.less`
- shared avatar assets and renderer CSS from `@repo/avatar-system`

## Commands

Run in dev:

```bash
pnpm --filter belle-binette dev
```

Build:

```bash
pnpm --filter belle-binette build
```

Serve the last build:

```bash
pnpm --filter belle-binette serve
```

## Files

Main files:

- `apps/belle-binette/index.html`
- `apps/belle-binette/script.ts`
- `apps/belle-binette/style.less`
- `apps/belle-binette/vite.config.ts`

Shared avatar source:

- `packages/avatar-system/src/avatar.json`
- `packages/avatar-system/src/avatar.less`
- `packages/avatar-system/src/editor-controls.less`
- `packages/avatar-system/src/images/renderer/...`
- `packages/avatar-system/src/images/editor/categories/...`
- `packages/avatar-system/src/images/editor/previews/...`

## How It Works

`index.html` contains the static controls and preview layout.

`script.ts`:

- loads `avatar.json` through the built URL exposed by `@repo/avatar-system`
- creates the initial selection from the loaded catalog
- binds button clicks from `data-selection-key`
- randomizes groups marked with `data-randomizable="true"`
- rebuilds the avatar class name with `buildAvatarClassName(...)`

`style.less` contains only Belle Binette UI styles:

- page layout
- tabs
- control grids
- spacing and presentation

Avatar rendering and editor preview mappings come from `@repo/avatar-system`:

```ts
import '@repo/avatar-system/avatar.css';
import '@repo/avatar-system/editor-controls.css';
import './style.less';
```

## Build Output

The build output is written to:

- `apps/belle-binette/dist/index.html`
- `apps/belle-binette/dist/script.js`
- `apps/belle-binette/dist/index.css`
- `apps/belle-binette/dist/images/...`
- `apps/belle-binette/dist/avatar.json`

Current build choices:

- no minification
- no hashed filenames for JS
- modern ESM output
- source maps enabled
- avatar images kept as separate files in `dist/images/...`

## Notes

- `belle-binette` is a consumer of `@repo/avatar-system`, not the source of truth for avatar assets.
- The renderer and editor preview assets live in `packages/avatar-system`.
