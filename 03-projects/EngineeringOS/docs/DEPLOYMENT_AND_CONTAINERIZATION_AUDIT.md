# Deployment and Containerization Audit

## Verdict

Docker compatibility: possible, and the app now has the main local foundations for a single-service container path.

The app is a standard Next.js App Router project with Prisma and SQLite local mode. Later phases added a Dockerfile, `.dockerignore`, runtime health/config checks, API adapters, and beta/prod guardrails. It is still not production-turnkey until real auth, managed PostgreSQL, external monitoring, and manual beta validation are completed.

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

## Remaining for Production Containerization

- Production DB provider decision and managed PostgreSQL verification.
- Migration command strategy against the selected Postgres target.
- External observability provider setup.
- Real auth/session provider setup.
- Non-root container user and image-hardening review.
- Public code execution disabled or isolated.
- Founder manual testing week before beta.

## Phase 64 Update

- API-backed learner/profile, progress, readiness, and quality surfaces now exist.
- Stronger syllabus filters make labs, capstones, runnable practice, enriched content, and time-boxed lessons discoverable.
- Dashboard now exposes founder outcome metrics for job-switch readiness.

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
