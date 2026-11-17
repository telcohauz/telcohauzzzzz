# Test results — 2026-11-17

Evidence is local execution, not cloud integration. All fixture data is clearly SYNTHETIC, uses example.invalid source references and temporary databases, and is deleted after tests.

`PYTHONPATH=/tmp/telcohauz-media AUTOPILOT_TEST_MEDIA=1 python -m unittest discover -s tests -v`: **20 tests passed, no skips**. Real Pillow 13.0.0 + FFmpeg produced an 18-second 720×1280 MP4; FFprobe verified dimensions. Log: `evidence/tests.txt`.

| Required area | Evidence and limit |
|---|---|
| Unit | Input validation, freshness, bilingual generation, retention |
| Database | Repeated migration, foreign keys, atomic financial rollback |
| Integration | Actual private HTTP API + SQLite; actual FFmpeg/Pillow/FFprobe |
| Scheduler | Repeat slot, concurrency, initial pause, usage cap |
| Duplicate prevention | Product IDs, script fingerprints, financial IDs, render hash |
| Recovery | Bounded exponential retries, lease recovery, sanitized error text |
| Security | Bandit 0 unsuppressed findings; pinned Pillow audit 0 known findings |
| Permissions | Unauthorized HTTP denied, account gate, explicit content transitions |
| Quotas | Zero job budget and zero rendering budget block processing |
| Finance | Pending/approved/rejected separated; receipt-minus-cost; no metrics-to-money; conflicts rejected |
| Dashboard | Actual HTTP data + actual Chromium desktop/mobile login, pause/resume and layout |
| End to end | Synthetic import → draft → validate → approve → schedule → gated manual publication evidence → analyzed; media rendered separately |

`node tests/dashboard.cjs`: PASS with system Chromium. Screenshots saved locally in `evidence/dashboard-mobile.png` and `evidence/dashboard-desktop.png`; screenshots are development evidence, not live deployment. Browser tooling is optional developer tooling and not part of runtime requirements. The attempted browser CDN download was blocked; the successful check used installed /usr/bin/chromium.

Python compileall, web/app.js syntax, and tools/security_check.py passed. See SECURITY_AUDIT.md for precise audit scope.

Not tested: real affiliate exports/eligibility/APIs, real publication, cloud scheduler, Supabase persistence/RLS, free cloud quotas, external notification delivery, production deployment, backup restore, live multi-user security, paid/unpaid allocation or actual earnings. GitHub Actions is not claimed as executed.
