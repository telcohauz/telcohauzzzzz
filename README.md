# Telcohauz — Dokumen & Audit BOZ

Public catalogue and internal audit workspace. Install with `npm ci`, run
`npm run dev`, or `npm run build && npm start` for production.

Internal APIs require a verified, non-revoked Firebase ID token and an explicit
server-managed organization grant: `telcohauz_audit: true` with `audit_role`
`owner`, `admin` or `auditor`. Auditors are read-only. An authorized operator can
bootstrap an owner by setting `AUDIT_ADMIN_UIDS` to verified Firebase UIDs in
server configuration. No anonymous, preview-token or automatic owner fallback.

Configure Firebase Application Default Credentials and SQL connection variables
in the deployment environment. Signing in alone does not grant access. The
client sends refreshed Firebase tokens on internal requests. Public content
does not require login. Enquiry administration remains private.

Demo seeding never runs on user requests. Existing data is not changed by this
patch. `npm test` checks access denial and reader/writer boundaries; `npm run
lint` typechecks and `npm run build` compiles the application.

This is a BOZ module. Catalogue consolidation lives in
https://github.com/telcohauz/telcohauz under `packages/catalog`; the Firebase audit
identity remains isolated until a tested identity migration is available.
