# Service Segregation and SaaS Scaling Plan

## Goal

EngineeringOS should support a path from local MVP to SaaS deployment without forcing a premature rewrite.

Target capability:

- UI can be hosted independently.
- Backend/API can be hosted independently later.
- Database can be hosted independently.
- The current monolith can still run as one deployable unit for MVP speed.

## Current Architecture

Current runtime:

- Next.js App Router handles UI, server-rendered pages, and server actions.
- Services and repositories already separate application logic from data access.
- Prisma supports local SQLite today.
- Mock mode remains default.

This is a modular monolith. That is acceptable for a prod-ready MVP if deployment gates are explicit.

## Target Architecture Stages

### Stage 1 - Modular Monolith

One deployable Next.js service:

- UI pages.
- Server actions.
- API health endpoints.
- Services/repositories.
- Managed DB outside the app.

Recommended for alpha and first private beta.

### Stage 2 - Backend API Boundary

Split backend capabilities behind route handlers or a separate API service:

- `/api/learner/*`
- `/api/progress/*`
- `/api/evaluation/*`
- `/api/content/*`
- `/api/admin/*`

UI can call this API via typed client adapters.

### Stage 3 - Separated Services

Potential services:

- Web UI service.
- Learner/profile service.
- Curriculum/content service.
- Assessment/evaluator service.
- Code-execution service.
- Worker service for async jobs.

This should happen only when scaling or security needs justify it.

## Database Plan

Current:

- SQLite for local Prisma mode.
- Good for local development and demos.
- Not suitable for horizontally scaled SaaS.

Recommended beta/prod:

- Managed PostgreSQL.
- Prisma provider migration from `sqlite` to `postgresql`.
- Explicit migration release step.
- Backups and point-in-time recovery.
- Connection pooling for serverless/container deployments.

## Containerization Plan

Minimum container capability:

- `Dockerfile`.
- `.dockerignore`.
- Health endpoint.
- Runtime env validation.
- Non-root runtime user.
- `next build` in image build.
- `prisma generate` during image build.

Production hardening:

- Decide whether to use Next standalone output.
- Run migrations outside app startup.
- Add readiness/liveness probes.
- Externalize DB.
- Add log aggregation and error monitoring.

## UI/Backend Split Plan

Current server actions are convenient but couple UI and backend runtime.

To split later:

1. Keep domain logic in `src/lib/services`.
2. Keep data access behind repository interfaces.
3. Add route handlers as API adapters.
4. Add typed client functions for UI calls.
5. Move API adapters into a separate service when needed.

Do not move business logic into React components.

## SaaS Scaling Capabilities Needed

Required before public beta:

- Authenticated user identity.
- Database-backed user profile/preferences/progress/evaluations.
- Managed PostgreSQL.
- Runtime config validation.
- Health endpoint.
- Deployment migration strategy.
- Observability.
- Rate limiting and abuse controls.
- Safe code execution policy.

## Actionable Beta Roadmap

The actionable beta-blocking plan now lives in `docs/BETA_SEGREGATION_AND_SCALE_ACTION_PLAN.md`.

Priority sequence:

1. API Adapter Boundary.
2. Database Provider Upgrade Plan.
3. Auth and User Ownership.
4. Observability and Operations.
5. Backend Extraction Readiness.
6. Beta Manual Testing Program.

Product success is defined by one concrete outcome: the founder can personally use EngineeringOS to learn the roadmap end to end, become interview-ready, and get a job.

## Phase 50 Scope

Phase 50 should add:

- Docker foundation.
- `.dockerignore`.
- Health endpoint.
- Runtime config validation.
- Deployment foundation docs.
- Quality contract tests for deployment readiness.

Phase 50 should not yet:

- Split the backend into a separate service.
- Migrate SQLite to Postgres.
- Add real auth provider.
- Add cloud deployment-specific secrets.
