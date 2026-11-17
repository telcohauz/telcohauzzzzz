# Deployment record and cloud runbook

No live Autopilot deployment exists. Existing cloud applications were not changed. Source delivery on a GitHub feature branch is not an application deployment.

## Required before release

1. Owner chooses and authorizes an existing cloud destination. Verify published free-tier quotas, current usage, commercial-use terms and hard spending limits. Do not enable paid overage or a trial.
2. Establish durable storage. Current backend requires persistent disk. A Supabase target requires a new, tested Postgres adapter and non-destructive migrations; all discovered projects currently report INACTIVE.
3. Configure a random owner token directly in the host secret manager. Run as a dedicated unprivileged user, protect data and asset directories, bind backend to loopback, terminate TLS at a hardened reverse proxy, set request/time/concurrency limits and restrict operator access. The standard-library server alone is not a hardened public production server.
4. Use separate staging/production DBs and secrets. Run integration, restore, HTTP/browser, media and permission tests on staging; check real resource usage. Owner approval is required before new account connections and sensitive activation.
5. Add owner-approved monitoring and notifications. Deploy exactly the tested commit and record URL, deployment ID, commit, test results and response evidence in OPERATIONS_STATUS.
6. Activate scheduled maintenance only after persistence and quota tests. Keep unsupported publishing and revenue adapters disabled.

## Scheduling design (inactive)

| Cadence | Suggested UTC cron | Malaysia time | Current handler |
|---|---|---|---|
| 6 hours | `17 */6 * * *` | 02:17/08:17/14:17/20:17 | Queue health + local notice |
| Daily | `27 16 * * *` | 00:27 | Queue + available financial summary |
| Weekly | `37 16 * * 0` | Monday 00:37 | Queue + manual policy/security review notice |
| Monthly | `47 16 1 * *` | 2nd day 00:47 | Available financial summary; use explicit bounds for prior month |

The default 100-execution monthly budget will not support every proposed cadence (roughly 160 executions/month). Keep a lower cadence, consolidate maintenance, or verify free quota before increasing the cap. Do not silently raise it.

The checked-in Actions schedule file intentionally has only workflow_dispatch and exits with a blocker. It does not create disposable databases or pretend to run commercial automation. GitHub-hosted runner execution and artifacts require verified applicable quotas before enabling CI; CI is manual-only in this delivery to avoid spending assumptions. Add remote scheduled invocation only after a durable authenticated backend exists. Never expose owner credentials to unreviewed pull-request jobs.

Rollback: pause globally, disable the cloud trigger, restore the previous tested application revision, and retain the DB. The module is additive and requires no change to the original site's server or database. Back up and test restore before future schema upgrades; never drop existing tables to roll back.
