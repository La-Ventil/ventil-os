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
- Uploaded files are written to `apps/web/public/uploads`.
- The database stores only the relative public path (e.g. `/uploads/<filename>`).
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

- Uploads are public by default (served from `/public`).
- Dev reset requires manual cleanup of `public/uploads`.
- Production should migrate to object storage (S3/MinIO) later, without changing the DB shape.
- Security relies on strict MIME/size validation and filename randomization.
