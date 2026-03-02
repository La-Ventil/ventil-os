# Contributing

This is the canonical contribution guide for the repository.

## Before You Start

Useful references:

- Project overview and local setup: [`README.md`](../../README.md)
- Release notes: [`CHANGELOG.md`](../../CHANGELOG.md)
- ADRs: [`docs/contributor/adr/README.md`](./adr/README.md)
- Testing strategy: [`docs/contributor/testing/README.md`](./testing/README.md)
- Accessibility process: [`docs/contributor/accessibility/README.md`](./accessibility/README.md)

## Contribution Scope

Contributions are welcome across:

- frontend and UI
- accessibility
- i18n and content
- testing and documentation

## Expected Quality Checks

Run at least:

```bash
pnpm lint
pnpm --filter web check-types
```

Useful targeted commands:

```bash
timeout 5m pnpm lint:dev
pnpm --filter web test
```

## Documentation Rule

- `docs/` is the documentation source of truth
- `apps/docs` is a presentation layer only
- contributor-facing documentation belongs under `docs/contributor/`

## Pull Requests

Before opening a pull request:

- keep changes scoped and coherent
- update documentation when behavior or conventions change
- follow the ADRs and testing guidance when your change touches those areas
