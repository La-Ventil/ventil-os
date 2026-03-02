# Docs App

`apps/docs` is the presentation layer for repository documentation.

The canonical content lives in:

- `docs/user/`
- `docs/admin/`
- `docs/contributor/`

This app reads those files directly and renders them for browsing.

## Local Development

```bash
pnpm --filter docs dev
```

## Type Checking

```bash
pnpm --filter docs check-types
```

## GitHub Pages Build

Use the static export build when targeting GitHub Pages:

```bash
pnpm --filter docs build:gh-pages
```

This enables:

- `output: 'export'`
- `trailingSlash: true`
- static generation for dynamic docs routes

## Base Path

GitHub Pages usually serves the site from a repository subpath.

The docs app supports:

- `DOCS_BASE_PATH`

Example:

```bash
DOCS_BASE_PATH=/ventil-os pnpm --filter docs build:gh-pages
```

When running in GitHub Actions, the app can also infer the base path from `GITHUB_REPOSITORY`.

## Output

The static export is written to:

- `apps/docs/out/`

## Current Scope

The app currently exposes:

- audience sections (`user`, `admin`, `contributor`)
- root repository references (`README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`)
- source file views for canonical markdown and product assets
