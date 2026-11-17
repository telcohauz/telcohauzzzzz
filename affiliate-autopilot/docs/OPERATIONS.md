# Operations and troubleshooting

## Daily operator work

Review the dashboard, failures and pending approvals. Refresh product prices and availability through an authorized export, review the original source and check content claims before approval. Use official publishing tools. Record publication evidence only after observing a real publication. Import non-overlapping measured metrics and authorized financial records; archive source exports privately with access controls and retention appropriate to the business. Never put exports or identity records in Git.

Local inbox notifications cover pending manual upload, workflow failure, configured job quota, financial import and policy review. Expiring-credential detection, real commission/payout notifications and external delivery are not implemented. The application stores no affiliate credentials.

## Pause and recovery

Use PAUSE to stop new worker claims. An already running render or handler may complete; PAUSE is not a process kill. DISABLE also disables accounts/platforms and unfinished jobs. RESUME does not re-enable accounts, retry-exhausted jobs or quota-paused jobs. Investigate before restoring any disabled item. Retry is available for failed jobs below the retry cap; it never resets the counter. Expired RUNNING leases are reclaimed and consume a retry.

If a job is PAUSED due to usage: keep it paused until the reporting month resets or capacity is verified. With the service stopped and a backup made, the owner can review and requeue the specific job in SQLite without changing counters. There is no broad reset command. Keep the monthly execution budget below actual available cloud capacity. Media budget is separate; concurrent renderer reservation and host disk quotas remain production work.

## Backup and restore

Stop workers/rendering, use Python sqlite3 connection `.backup()` to an access-controlled destination, copy approved media, calculate checksums and record a backup timestamp privately. Never copy a live DB file without a consistent snapshot. Validate the backup using `PRAGMA integrity_check` and `PRAGMA foreign_key_check`, restore to a separate staging path, and run status/report checks. No backup/restore cloud integration has been tested. Do not overwrite the original database during restore testing.

## Credentials

Token rotation: PAUSE jobs, stop the service, replace AUTOPILOT_OWNER_TOKEN with a new random secret in the host secret manager, restart, test unauthorized requests and owner login. Existing browser memory tokens immediately fail after restart. Use separate secrets per environment, private HTTPS and a host firewall. Do not paste credentials in chat, source exports, URLs, logs or Git. No keys are required for local maintenance/content generation.

## Retention

`Store.retain(days)` removes only read notifications older than the configured 30..3650 day limit, retaining financial/audit evidence. Notification read marking and retention scheduling are not wired to the UI. Asset expiration, legal financial retention policies and backups require owner configuration; do not automatically delete commercial records. Dashboard queries currently cap lists at 200 entries without pagination; use DB/CLI access for a complete archive.

## Troubleshooting

| Symptom | Action |
|---|---|
| UNAUTHORIZED | Enter current owner token; verify secret manager and TLS route. Never log tokens. |
| Product cannot draft | Check VERIFIED compliance, available=true, and a source within 24 hours. |
| Cannot publish | Verify eligible account/enrollment/payment, current official policy review and actual manual publication evidence. |
| FAILED job | Inspect sanitized error code; reproduce with synthetic data, fix cause, retry below cap. |
| DISABLED job | Retry budget exhausted; preserve evidence and investigate. Do not loop resets. |
| No source data | No authorized records exist; do not interpret as verified zero revenue. |
| Financial conflict | Reconcile original platform reports. Do not change external IDs merely to bypass deduplication. |
| Video render fails | Confirm Pillow 13, /usr/bin/ffmpeg, DejaVu font, writable disk, 120-second timeout and media budget. |
| Cloud schedule inactive | Expected until durable hosting, quota and integration gates are resolved. |

## Next actions

1. Approve a durable cloud destination with verified RM0 capacity, or authorize a tested Postgres port for an existing eligible database.
2. Harden and test staging TLS/rate limiting/backups, then deploy and record evidence.
3. Independently check current official Shopee/TikTok MY age/country/enrollment/payment requirements. No eligibility is established by this build.
4. Obtain owner authorization for each sensitive affiliate/notification connection; configure only permitted assisted imports or official APIs.
5. Verify genuine data end to end, reconcile payouts, and implement allocation of paid/unpaid commissions before relying on per-conversion paid balances.
6. Enable finite cloud schedules only after the above, then measure actual usage. Add AI research, automated draft/render orchestration and publishing only where free and officially supported.
