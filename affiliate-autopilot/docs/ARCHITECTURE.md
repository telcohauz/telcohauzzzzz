# Architecture and discovery

Discovery date: 2026-11-17 UTC. GitHub connector returned 13 accessible repositories owned by telcohauz. Local clean checkouts: Telcohauzmap (mapping/mobile app) and telcohauzzzzz (React/TypeScript digital-audit app, Express backend, Drizzle/Postgres and Firebase modules). Agenttelco package.json probe returned 404; no reuse is claimed for it. Reuse the existing telcohauzzzzz repository, existing GitHub permissions and standard Python/FFmpeg tools. No new repository, account or hosted service was created.

The latest remote main at discovery was `4c5602b93f455feaed2b392cfe11237be5d33976`, newer than local `52e61bf`. Deliver only additive module/workflow paths on a branch based on remote main; preserve the original app, auth, schema, credentials and hosting config.

Vercel read-only discovery returned four projects: telcohauz-boz-pos-admin-preview, heng2-catalog-staging, heng2-entertainment-staging, telcohauz-phone-eligibility. No resource capacity or commercial hosting eligibility was established. Supabase discovery across both linked accounts returned HENG2 Entertainment Prototype, telcohauzzzzz and TELCOHAUZ VERIFY, all INACTIVE. No tables or credentials were read and no projects were resumed or modified.

## Components

- Owner dashboard: responsive plain JavaScript/CSS, no frontend dependency installation or tracking. Existing React app remains untouched. Deliberate MVP stack deviation from React/Tailwind reduces dependencies and isolates deployment.
- Private backend: Python 3.12 standard-library HTTP API and CLI. Constant-time bearer authentication on data/actions; random owner token supplied externally. Single owner only.
- State: SQLite additive, repeatable initial migration, foreign keys, indexes, unique IDs and integer monetary amounts. This schema is **not** a Supabase/Postgres migration. No RLS claim is made for a local SQLite file.
- Content: deterministic original bilingual informational scripts with source links and disclosures; exact duplicate prevention. No external LLM or copyright assets.
- Media: original Pillow cards, bounded FFmpeg encoding, SHA-256 evidence, preview PNG, captions and storyboard/voiceover text. Silent 18-second 720×1280 MP4.
- Assisted adapters: independent Shopee and TikTok adapter classes, automatic features false. No API availability or current account eligibility presumed.
- Maintenance queue: finite claims, retry budgets, leases, monthly usage and audit records; no uncontrolled loop.
- Accounting: separate conversions, commission states, payouts, expenses and measured metrics. Net receipts use payouts, never views or pending commissions.
- Notifications: local database inbox. No Slack/email/webhook connection exists.

## Data relationships

Platform → accounts/products; product → links/scripts/ideas; script → media and publishing queue; queue → publication; publications/products/links → measured campaign metrics. Platform → conversions → commission records; platform → payout records. Reserved payout allocation table is not yet wired into a reconciliation service. Jobs → executions; approvals and audit references track owner actions. Notifications and integration status are independent operational records.

## Production path

Choose an existing authorized active durable service only after verifying quotas and account terms. Either use a persistent single-owner container/VM with a protected SQLite volume, TLS proxy, backups and host-level rate limits, or implement and test a Postgres storage adapter plus tenant policies and a serverless API. The current Python sqlite3 queries cannot be redirected to Supabase by changing an environment variable. Never deploy a disposable SQLite DB to Vercel functions or Actions and call it persistence.

Rendering and browser tests run separately from recurring tasks. Cloud host quotas, lock contention, multi-process rendering reservations, cleanup and telemetry need production verification. This is an operational foundation with explicit production blockers.
