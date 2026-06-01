# Phase 51-56 Parallel Execution Plan

## Purpose

Phases 51-56 run as parallel beta-readiness workstreams. The goal is to remove the segregation and scaling bottlenecks before beta while keeping the current modular monolith stable.

## Workstreams

### Phase 51 - API Adapter Boundary

Goal: make UI/backend separation practical.

Deliver:

- API contracts.
- `/api/learner/profile`
- `/api/progress/summary`
- `/api/readiness`
- `/api/quality/status`
- Route smoke coverage.

### Phase 52 - Database Provider Upgrade Plan

Goal: make DB hosting SaaS-capable.

Deliver:

- PostgreSQL beta/prod decision.
- SQLite local-only rule.
- Migration checklist.
- Env examples for local SQLite and managed Postgres.
- Production guardrails that block SQLite in production Prisma mode.

### Phase 53 - Auth and User Ownership

Goal: make learner state user-owned before beta.

Deliver:

- Auth provider decision plan.
- User ownership checklist.
- Contracts requiring no fixed local user ID in beta mode.
- Mock auth remains local-only.

### Phase 54 - Backend Extraction Readiness

Goal: prepare backend extraction without rewriting the product.

Deliver:

- API contracts module.
- API client module.
- Backend extraction order.
- Rule that business logic remains in services/repositories.

### Phase 55 - Observability and Operations

Goal: make beta deploys debuggable and recoverable.

Deliver:

- Health endpoint.
- Operational readiness checklist.
- Structured logging plan.
- Rollback checklist.
- Incident mini-playbook.

### Phase 56 - Beta Manual Testing Program

Goal: validate the real product outcome.

Deliver:

- Founder manual testing checklist.
- Daily learning loop.
- Interview-readiness evidence checklist.
- Failure feedback capture.

## Global Success Metric

EngineeringOS succeeds only if the founder can personally use the app, learn the roadmap end to end, become interview-ready, and get a job.

## Execution Rule

Implement API and infrastructure boundaries first, then continue UI/UX and feature capability once beta scaling risks are controlled.
