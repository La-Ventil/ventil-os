# ADR-007 — File uploads and storage policy

## Status
Accepted

## Date
2026-02-03

## Context

We now support image uploads for entities like Open Badges and Machines.
Uploads are stored locally during development and the database stores only a filename or URL.
We need a clear, shared policy for:
- storage location
- file validation rules
- public access exposure
- retention/reset behavior

---

## Decision

We adopt a pragmatic local storage strategy for now:
- Uploaded files are written under `apps/web/uploads` relative to the web application runtime root.
- The database stores only the relative public path (e.g. `/uploads/open-badges/<filename>`).
- Upload validation is enforced server-side:
  - allowed MIME types: `image/png`, `image/jpeg`, `image/gif`, `image/webp`
  - max size: 5 MB
- Upload directory is git-ignored.
- No automatic retention/purge in dev. Reset is manual (delete folder).

---

## Related ADRs

- ADR-006 (Layers, data flow, and pragmatic rules)
- ADR-008 (Form handling and validation strategy)

---

## Consequences

- Uploads are served at runtime through the `/uploads/...` route, backed by the upload root on disk.
- Dev reset requires manual cleanup of `apps/web/uploads` (and any domain subfolders under it).
- Domain-specific subfolders under `apps/web/uploads` are supported (for example `machines/` and `open-badges/`).
- Security relies on strict MIME/size validation and filename randomization.
