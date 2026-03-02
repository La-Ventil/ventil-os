# Documentation

`docs/` is the documentation source of truth for the repository.

## Structure

- `docs/user/`: end-user guides and help content
- `docs/admin/`: admin workflows and operational guides
- `docs/contributor/`: project-maintenance, engineering, and product reference material

## Source Of Truth

- Write documentation content in `docs/`
- Keep `apps/docs` as a presentation layer only
- Do not duplicate canonical content in both places

In practice:

- `docs/` owns the content
- `apps/docs` may render that content later, but should not become a second source of truth

## Entry Points

- User docs: `docs/user/README.md`
- Admin docs: `docs/admin/README.md`
- Contributor docs: `docs/contributor/README.md`
- ADRs: `docs/contributor/adr/README.md`
- Accessibility: `docs/contributor/accessibility/README.md`
- Testing: `docs/contributor/testing/README.md`
- Product references: `docs/contributor/product/README.md`
- Product raw data: `docs/contributor/product/Ventil O.S. - liste des fonctionnalités - RAW DATA.csv`

## Repository References

- Project overview and setup: [`README.md`](../README.md)
- Release notes: [`CHANGELOG.md`](../CHANGELOG.md)
- Contribution guide: [`CONTRIBUTING.md`](../CONTRIBUTING.md)
