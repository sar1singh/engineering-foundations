# Deployment and Containerization Audit

## Verdict

Docker compatibility: possible, but not turnkey.

The app is a standard Next.js App Router project with Prisma and SQLite local mode. It can be containerized, but the current repo does not yet include a `Dockerfile`, `.dockerignore`, standalone Next output, runtime migration strategy, or production database target.

## Current Shape

- UI/backend runtime: Next.js server-rendered app.
- Backend boundary: server components, server actions, services, repositories.
- Local DB: Prisma with SQLite.
- Default data mode: mock.
- Prisma mode: opt-in with `NEXT_PUBLIC_ENGINEERINGOS_DATA_SOURCE=prisma`.
- Auth: mock only.
- AI/evaluator: mock only.

## Hosting Options

Easiest:

- Vercel for UI/server actions.
- Hosted PostgreSQL later for production Prisma.
- Keep mock mode for demos.

Moderate:

- Single Docker container running Next.js.
- External managed Postgres.
- Run migrations as a release step or one-off job.

Harder:

- Separate UI and backend services, because the current app combines UI and backend logic inside Next server actions/services.
- This would require extracting APIs or a backend service boundary.

Not recommended for production:

- SQLite inside an ephemeral container. It is acceptable for local demos only unless backed by durable mounted storage and a single-writer deployment model.

## Missing for Containerization

- `Dockerfile`.
- `.dockerignore`.
- `next.config.ts` `output: "standalone"` decision.
- Runtime env validation.
- Production DB provider decision.
- Migration command strategy.
- Health endpoint.
- Observability setup.
- Non-root container user and image hardening.

## Difficulty

- UI + server actions on one service: easy to moderate.
- UI on one service and DB managed separately: moderate.
- UI and backend split into separate services: moderate to hard.
- Production-grade public deployment with auth, DB, observability, and safe code execution: hard until Phase 49+ blockers are closed.

## Recommendation

For alpha:

- Use local mock or local Prisma.
- Do not containerize unless needed for repeatable demos.

For beta:

- Use hosted Next.js or a single container.
- Move Prisma to PostgreSQL.
- Add auth.
- Add health checks, logs, migrations, rollback, and backups.

For production:

- Treat code execution as disabled or isolated.
- Use managed Postgres.
- Add monitoring and alerting.
- Run migrations through CI/CD release gates.
