# Database Provider Upgrade Plan

## Decision

- Local development: SQLite is acceptable.
- Alpha demos: SQLite or mock mode is acceptable.
- Beta and production: use managed PostgreSQL.

## Why Postgres

- Supports concurrent SaaS traffic better than SQLite.
- Works with managed backups and point-in-time recovery.
- Supports connection pooling.
- Aligns with Prisma production deployment patterns.

## Required Before Beta

- Change production Prisma datasource provider strategy to PostgreSQL.
- Provision managed Postgres.
- Add migration release command.
- Add backup/restore runbook.
- Add connection pooling guidance.
- Verify all learner-state tables work on Postgres.

## Guardrail

Production Prisma mode must not use `file:` SQLite URLs.

## Verification Command

Use:

```txt
npm run db:verify-target
```

For beta/production, run with:

```txt
ENGINEERINGOS_DEPLOY_MODE=beta
DATABASE_URL=postgresql://...
npm run db:verify-target
```

This validates the target DB URL shape. Actual migration verification must still be run against the managed Postgres database before beta.
