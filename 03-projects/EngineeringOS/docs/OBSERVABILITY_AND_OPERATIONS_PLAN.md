# Observability and Operations Plan

## Required Before Beta

- `/api/health` for liveness.
- Readiness/config checks.
- Structured request/error logs.
- Error reporting tool.
- Uptime check.
- Rollback checklist.
- Incident mini-playbook.

## Runtime Config

Beta/production deployments must provide:

- `ENGINEERINGOS_ERROR_MONITORING_DSN`
- `ENGINEERINGOS_UPTIME_CHECK_URL`

The runtime config report fails beta/production if these are missing.

## Incident Mini-playbook

1. Confirm health endpoint.
2. Check recent deploy.
3. Inspect logs/errors.
4. Identify affected flow.
5. Roll back if user-facing learning flow is broken.
6. Add regression test.
7. Update AI session log and implementation status.

## Rollback Checklist

- Know last good build.
- Keep migrations backward-compatible.
- Do not auto-run destructive migrations on app boot.
- Confirm smoke routes after rollback.
