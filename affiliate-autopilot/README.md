# TELCOHAUZ AFFILIATE AUTOPILOT

A working single-owner assisted-operations foundation, isolated from the existing Telcohauz digital-audit app. **Not a deployed commercial autopilot.** No affiliate account, paid API, publisher, external notification channel or cloud database is connected. New databases start paused and contain no products or financial records.

## Run

Python 3.12+, SQLite (standard library). No third-party Python packages are needed for the backend.

```sh
cd affiliate-autopilot
python -m autopilot init
# Set a new random secret in your process/host secret manager; do not commit it.
export AUTOPILOT_OWNER_TOKEN="$(python -c 'import secrets; print(secrets.token_urlsafe(48))')"
python -m autopilot serve --port 8080
```

Open http://127.0.0.1:8080 on the same machine and enter the token. Routine cloud operation requires an approved persistent cloud host and HTTPS reverse proxy; this workspace is not such a deployment. Never expose this Python HTTP server directly to the public internet. Configuration is read from the process environment; `.env` files are not automatically loaded. Keep dev, test and production DB paths, tokens and asset folders separate.

Optional rendering: install the exact Pillow version in `requirements-media.txt`, FFmpeg with libx264, and DejaVu Sans fonts. The test environment has these tools. No speech engine is configured. Videos are silent original text cards with burned-in captions and affiliate disclosure, not verified physical product demonstrations.

## Assisted workflow

1. Import a genuine authorized product export. JSON array, at most 1000 products per adapter batch. Direct CLI product imports are trusted operator input. Prices use **integer sen**, rates use basis points. All source dates require time zones; unknown commission rates are null.
2. Generate Bahasa Melayu (`ms`) or English (`en`) drafts. Products must be available, compliance-verified by the operator, and sourced within 24 hours. Source URLs and timestamps document provenance; the system cannot independently authenticate exported data.
3. Validate and approve scripts after factual, rights and disclosure review. Script editing/revision is not implemented; reject an unsuitable draft by leaving it unapproved.
4. Render original 9:16 assets. Rendering is limited to 10 recorded assets per month by default, with 120 seconds per invocation. This is a local guard, not a guarantee about hosting quotas. Schedule a manual upload and use the official platform interface only after account eligibility is verified.
5. Record publication URL and dated source evidence. The state changes to PUBLISHED only after this evidence and an enabled, verified assisted account are present. Recording a URL is operator attestation, not a platform API verification.
6. Import authorized metrics, commissions, payouts and expenses. Reconcile platform reports independently. No projected amounts are recorded as receipts.

Product input contract (field names only; **not actual product data**):

```json
{
  "platform_id": "shopee-my",
  "product_identifier": "OWNER_SUPPLIED_PLATFORM_ID",
  "name": "OWNER_VERIFIED_NAME",
  "category": "OWNER_VERIFIED_CATEGORY",
  "price_sen": 0,
  "commission_bps": null,
  "available": false,
  "source_ref": "https://OWNER_AUTHORIZED_SOURCE",
  "source_at": "2026-11-17T08:00:00+08:00",
  "compliance": "PENDING",
  "affiliate_url": "https://OWNER_APPROVED_AFFILIATE_LINK"
}
```

Replace every value with authorized evidence. Zero is a schema example, not a verified price.

```sh
python -m autopilot import-products /private/authorized-products.json
python -m autopilot rank
python -m autopilot draft PRODUCT_ID --language ms
python -m autopilot transition QUEUE_ID VALIDATED
python -m autopilot transition QUEUE_ID APPROVED
python -m autopilot render SCRIPT_ID
python -m autopilot transition QUEUE_ID SCHEDULED --schedule 2026-11-18T10:00:00+08:00
# After actual manual publication, evidence JSON has url, source_ref, published_at.
python -m autopilot transition QUEUE_ID PUBLISHED --evidence-file /private/publication.json
```

Account activation is a sensitive **local owner command**, deliberately absent from HTTP. Do not run it until the owner authorizes that specific connection and evidence is verified. `activate-assisted FILE` requires `platform_id`, `country: MY`, `owner_approval: ACTIVATE_ASSISTED_OPERATIONS`, an officially verified integer `official_minimum_age` of at least 18, `holder_meets_minimum_age: true`, `policy_source`, `policy_checked_at`, `eligibility_evidence`, `enrollment_evidence`, and `payment_evidence`. Use private access-controlled evidence references without URL tokens; never store identity documents, DOB or bank credentials here. The conservative adult gate does not claim either platform's current official minimum. Official policy review expires after seven days. No real account has been activated.

## Financial records and measured metrics

`import-finance FILE` expects an object with `platform_id`, `attestation: AUTHORIZED_PLATFORM_EXPORT`, and `records`. Each record has `kind`, `external_id`, integer `amount_sen`, HTTPS `source_ref`, and `source_at`.

- `kind: commission` also requires `campaign_id`, `sales_sen` and `status: PENDING|APPROVED|REJECTED`.
- `kind: payout` is an actual platform-confirmed receipt record, not a projected payout.
- `kind: EXPENSE|PLATFORM_CHARGE` records verified costs. This records existing expenses only; it never executes payments.

Financial imports require an enabled eligible account and run atomically. Stable platform/external IDs deduplicate imports. Older commission exports and conflicting payout amounts are rejected. Payout allocation and automatic bank reconciliation are **not implemented**; the report labels payout records UNRECONCILED. Paid/unpaid commissions per conversion cannot yet be reliably calculated. Net realized income = imported actual payouts − imported verified costs. No data is shown as **No source data**, not verified RM0 earnings.

`import-metrics FILE` requires the same attestation and a records array with `campaign_id`, `kind: clicks|views`, integer `value`, `source_ref`, `source_at`, and optional `content_id`, `product_id`, `link_id`. Import **non-overlapping reporting windows/deltas**, not overlapping lifetime snapshots. Exact repeated records deduplicate; overlapping windows cannot currently be detected. Clicks and views never create sales or commissions.

```sh
python -m autopilot import-finance /private/platform-export.json
python -m autopilot import-metrics /private/measured-metrics.json
python -m autopilot report
python -m autopilot report --start 2026-10-01T00:00:00+08:00 --end 2026-11-01T00:00:00+08:00
python -m autopilot recommend
```

Date-bounded reporting uses half-open intervals, normalized to UTC. Generate daily, weekly and monthly reports by providing the relevant Malaysia-midnight bounds. Source references and dates accompany results. Recommendations are descriptive; no sufficient-data model, causal attribution or automatic campaign optimization is claimed.

## Job operations

```sh
python -m autopilot control RESUME
python -m autopilot run health
python -m autopilot run daily
python -m autopilot run weekly
python -m autopilot run monthly
python -m autopilot control PAUSE
python -m autopilot status
```

Repeated cadence/slot combinations reuse one job. Workers claim transactionally, recover expired leases, use exponential backoff and disable after three failed attempts. Batches are capped at 20. Default monthly limit is 100 handler executions; verify host quotas before changing it. Paused quota jobs require an explicit operator DB-reviewed recovery; RESUME only resumes the global switch. A retry control only accepts FAILED jobs below their retry ceiling and never resets their count. Maintenance currently checks queue state, creates local notifications and reports available financial records. It does **not** research the web, refresh products, generate daily drafts, render on schedule or publish externally.

Do not run the scheduler on ephemeral GitHub Actions SQLite storage. The schedule workflow is an explicit readiness blocker, manual only. Proposed cron expressions and dependencies are documented in `docs/DEPLOYMENT.md`.

## Tests and security

```sh
python -m unittest discover -s tests -v
AUTOPILOT_TEST_MEDIA=1 python -m unittest discover -s tests -v
python tools/security_check.py
node --check web/app.js
# Optional developer environment: Playwright installed, system Chromium available
node tests/dashboard.cjs
```

All test records use `example.invalid` and synthetic labels in temporary databases. None establishes revenue or live integration. The browser test writes screenshots under `docs/evidence`. Production has no test seed command.

See `OPERATIONS_STATUS.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY_AUDIT.md`, `docs/OPERATIONS.md`, `docs/DEPLOYMENT.md` and `docs/INTEGRATION_CHECKLIST.md` for evidence, gaps and activation requirements.
