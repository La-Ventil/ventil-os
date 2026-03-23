# Avatar Playground

This playground is the current source material for the future shared avatar system.

## Goal of this normalization pass

The goal of the changes below was **not** to change the avatar's visual direction, but there was real cleanup work on structure, naming, and asset organization.
The goal was to make the playground internally consistent so it can be extracted into a reusable package without carrying naming drift and stale references.

## What was normalized

### 1. Naming was aligned with the actual renderer DOM and CSS

The renderer currently uses these layer names:
- `face`
- `hair`
- `eyes`
- `eyebrows`
- `glasses`
- `nose`
- `mouth`
- `face-details`
- `facial-hair`
- `cheeks`
- `earrings`
- `clothes`

The JSON config was normalized to follow the same editor-facing vocabulary.

Note:
- category keys, option ids, and renderer CSS classes now all use `earrings` consistently

### 2. Config keys were aligned with the actual option ids used by the playground

The following ids are now treated as canonical in the playground:
- face shapes: `face-shape-*`
- face details: `face-details-*`
- earrings: `earrings-*`

This matches the HTML controls and the CSS classes already used by the renderer.

### 3. Optional choices now clear explicitly

For optional parts such as:
- facial hair
- glasses
- face details
- cheeks
- earrings

The `none` buttons now use `data-value=""`.

This prevents the editor from relying on accidental values such as:
- `null`
- missing `id`
- fake ids like `earrings-null`

The effect is simple:
- selecting `no` now always removes the corresponding class cleanly

### 4. Stale playground UI asset references were corrected

The playground UI referenced some interface icons that do not exist with those names.
These references were aligned to the existing files in `images/ui/categories/`.

Concrete corrections:
- `images/ui/categories/face-shape.svg` -> `images/ui/categories/face.svg`
- `images/ui/categories/eyes-style.svg` -> `images/ui/categories/eyes.svg`
- `images/ui/categories/nose-style.svg` -> `images/ui/categories/nose.svg`
- `images/ui/categories/mouth-style.svg` -> `images/ui/categories/mouth.svg`

### 5. A few stale preview button mappings were corrected

The preview buttons for some hair options had stale image references.
Those mappings were corrected to match the actual asset names.

## Concrete naming changes

### Category/config naming

Changed in `avatar.json`:
- `facial-details` -> `face-details`
- `earring` -> `earrings`
- category display name for `glasses` fixed from `eyebrows` to `glasses`
- category display name for `cheeks` fixed from `clothes` to `cheeks`

### Face option ids

Changed in `avatar.json`:
- `face-1`, `face-2`, `face-3`, `face-4`

to the actual ids used by the playground:
- `face-shape-1`
- `face-shape-2`
- `face-shape-5`
- `face-shape-6`

### Face details option ids

Changed in `avatar.json`:
- `facial-details-*`

to:
- `face-details-*`

### Earrings key naming

Changed consistently across config, HTML controls, and renderer CSS:
- `earring`

to:
- `earrings`

## Options intentionally removed from the config

These entries existed in the JSON but are not currently exposed consistently by the playground UI and were removed from the normalized config:
- `hair-102`
- `hair-202`
- `eyes-15`
- `earrings-8`
- legacy `lips` color config

This does **not** mean these options are forbidden forever.
It means they are not part of the current consistent contract of the playground.
If they should exist, they should be added back deliberately across:
- config
- assets
- UI controls
- renderer CSS

### Options added back to the config because they do exist in the current playground

These options existed in the UI/assets but were missing from the config and were added back:
- `hair-210`
- `hair-218`
- `hair-403`

## What did not change

These changes were not meant to alter the avatar's visual direction, but they did affect the system's technical structure:
- no change to the avatar style or artistic intent
- no change to the renderer layering model
- no redraw of the SVG assets themselves
- naming and asset-directory cleanup
- no editor architecture rewrite yet

## Current recommended source-of-truth conventions

## Naming Rule

Use one canonical kebab-case name for each avatar feature, and reuse it everywhere: config keys, editor ids and `data-type` values, renderer CSS classes, and asset directories.

Plain rule:
- choose one feature name
- keep it in kebab-case
- do not mix singular and plural variants
- do not keep a camelCase version alongside a kebab-case version
- use the same name in code, markup, styles, and directories

Examples:
- `face-details` everywhere
- `facial-hair` everywhere
- `earrings` everywhere

### Why these names

#### Why `face-details` and not `facial-details`
- `face details` is the more natural product/editor phrase
- `facial details` sounds more technical and less idiomatic
- the rule is to prefer the clearest natural English phrase, not forced symmetry

#### Why `facial-hair` and not `face-hair`
- `facial hair` is the established English term
- `face hair` sounds wrong in normal English

#### Why `earrings`
- this feature is handled as a family of options
- plural reads better here and fits the rest of the editor vocabulary
- once chosen, it should be reused everywhere instead of keeping `earring` and `earrings` side by side

#### Why `ui/previews` and not `buttons`
- these assets are preview images shown inside option controls
- `buttons` only describes the current HTML usage
- `previews` better describes the actual role of the assets

#### Why `ui/categories` and not `interface`
- `interface` is too vague
- these files are specifically category/tab icons for the editor

#### Why `renderer/` and `ui/`
- `renderer/` contains assets used to build the avatar itself
- `ui/` contains assets only used by the editor/playground interface
- this separation will make the future package extraction cleaner


If new options are added, they should follow these rules:

1. The same naming must be used across:
- JSON config
- HTML/editor controls
- CSS class names
- asset directories

2. Optional choices should clear with an explicit empty value
- use `data-value=""`
- do not rely on missing ids or placeholder ids

3. The config should only describe options that are actually supported by the playground
- no hidden stale entries
- no orphan ids

## Next extraction step

The normalized playground is now ready to be split into:
- a reusable avatar renderer/editor package
- a playground app consuming that package
