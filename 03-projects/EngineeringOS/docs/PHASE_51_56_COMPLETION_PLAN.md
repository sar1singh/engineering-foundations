# Phase 51-56 Completion Plan

## Goal

Complete phases 51-56 to a beta-ready infrastructure and product-testing baseline.

Beta-ready means:

- UI/backend separation capability exists through API adapters and API client adoption.
- Database can run on managed PostgreSQL.
- Real auth owns learner data.
- Repository reads/writes are scoped to authenticated users.
- Observability can catch and diagnose failures.
- Code execution is safe for public users.
- Founder manual testing validates whether the product actually improves interview readiness.

## Non-negotiable Product Success Test

EngineeringOS succeeds only if the founder can personally use the app, learn the roadmap end to end, become interview-ready, and get a job.

All technical completion must support this outcome.

## Completion Workstreams

## Phase 51 - API Adapter Boundary Completion

Current status: mostly implemented.

Remaining tasks:

- Adopt API client in selected UI flows:
  - Dashboard readiness data.
  - Progress summary.
  - Learner profile/onboarding.
  - Product quality status.
- Add API integration tests for:
  - `GET /api/learner/profile`
  - `PUT /api/learner/profile`
  - `GET /api/progress/summary`
  - `GET /api/readiness`
  - `GET /api/quality/status`
- Document API response contracts with examples.
- Keep business logic in services/repositories, not route handlers or React components.

Acceptance criteria:

- At least dashboard or onboarding consumes API client where server/client boundary makes sense.
- All API routes have tests and smoke coverage.
- API contracts are stable enough for future separate backend hosting.

## Phase 52 - Managed PostgreSQL Completion

Current status: planned and guarded, not fully implemented.

Remaining tasks:

- Decide provider:
  - Neon, Supabase Postgres, RDS Postgres, or another managed Postgres.
- Decide migration path:
  - Keep SQLite for local dev and create a separate Postgres schema path, or switch Prisma provider to Postgres and use local Postgres for dev.
- Add beta/prod env template:
  - `DATABASE_URL=postgresql://...`
  - `ENGINEERINGOS_DEPLOY_MODE=beta`
  - `NEXT_PUBLIC_ENGINEERINGOS_DATA_SOURCE=prisma`
- Run migration verification against a managed or local Postgres database.
- Validate learner profile, progress, explain-back attempts, evaluations, revision queue, and weak areas.
- Add backup/restore and migration rollback runbook.

Acceptance criteria:

- Prisma schema and migrations are verified against Postgres.
- SQLite remains explicitly local-only.
- Beta/prod startup fails if Prisma uses SQLite.
- Migration runbook exists.

## Phase 53 - Real Auth and User Ownership Completion

Current status: guardrails started, no real auth provider.

Recommended auth decision:

- Shortest beta path: Clerk or Auth.js.
- AWS-first path: Cognito.

Remaining tasks:

- Select auth provider.
- Add auth provider integration.
- Replace mock current-user lookup in beta/prod.
- Create session user service:
  - local mock user in local mode.
  - authenticated provider user in beta/prod.
- Update repositories/actions to use session user ID.
- Remove fixed local user ID from beta/prod write paths.
- Add access-control tests:
  - user A cannot read user B preferences.
  - user A cannot read user B progress.
  - unauthenticated beta write is rejected.

Implemented since plan creation:

- Repository user guard added.
- Learner preferences, explain-back attempts, and evaluation result repositories now call the guard before learner-owned persistence.

Acceptance criteria:

- Beta mode requires authenticated user.
- All learner-owned reads/writes are scoped by session user ID.
- Fixed local user IDs are only used in local/mock mode.

## Phase 54 - Backend Extraction Readiness Completion

Current status: API contracts/client exist.

Remaining tasks:

- Move selected UI flows through API client:
  - Onboarding save/read.
  - Progress summary widget.
  - Quality status widget.

Implemented since plan creation:

- Dashboard now includes an API-client readiness/quality strip.
- Phase 64 added API-client-backed onboarding profile status and dashboard progress summary.
- Add `src/lib/api-contracts` examples and versioning notes.
- Add backend extraction map:
  - learner service first.
  - progress/readiness service second.
  - evaluation service third.
  - content/search service later.
- Add tests that route handlers do not import raw data files.

Acceptance criteria:

- UI can be pointed at API adapters for key learner/progress/readiness data.
- Backend extraction can start without changing business logic.

Phase 64 status:

- Learner profile, progress summary, readiness, and quality now have visible API-client-backed surfaces.
- Remaining API adoption is now incremental polish rather than a hard local-code blocker.

## Phase 55 - Observability and Operations Completion

Current status: health endpoint and structured API logging exist.

Remaining tasks:

- Choose external error monitoring:
  - Sentry, Axiom, Datadog, OpenTelemetry collector, or provider-native logs.
- Add error reporting wrapper or integration plan.
- Add uptime monitor plan:
  - `/api/health`
  - `/dashboard`
  - `/api/readiness`

Implemented since plan creation:

- Runtime config requires external error monitoring DSN and uptime check URL in beta/production modes.
- Add deployment checklist:
  - env validation.
  - migration status.
  - smoke routes.
  - rollback version.
- Add incident templates:
  - broken login.
  - DB unavailable.
  - migration failed.
  - content route broken.
  - evaluator failure.

Acceptance criteria:

- Beta deploy can be monitored.
- Failed deploy can be rolled back.
- Production issue has a triage path.

## Phase 56 - Founder Manual Testing Completion

Current status: program and tracker created, not executed.

Remaining tasks:

- Run one full founder testing week.
- Use the product daily for the selected role path.
- Capture:
  - unclear next steps.
  - shallow content.
  - confusing UI.
  - broken progress.
  - weak feedback.
  - missing interview prep.
- Update syllabus/UI/assessment based on findings.
- Record weekly outcome:
  - topics completed.
  - problems solved.
  - mock interviews attempted.
  - weak areas reduced.
  - confidence changes.

Acceptance criteria:

- Founder can continue learning without code changes for one week.
- Product gives useful next lesson, practice, and review flow.
- Founder can identify whether readiness score matches actual confidence.

## Public-safe Code Execution Decision

Current status: local runner has guardrails, not a hardened sandbox.

Implemented since plan creation:

- Browser runner is enabled in local/alpha by default.
- Browser runner is disabled in beta/production deployment modes by default.
- Runtime config checks fail beta/production if local browser code execution is enabled without an isolated service decision.

Decision options:

### Option A - Disable for public beta

Fastest and safest.

Tasks:

- Add feature flag: `ENGINEERINGOS_ENABLE_CODE_RUNNER=false`.
- Hide runner in beta/prod by default.
- Keep code examples visible as read-only.

### Option B - Isolate as separate execution service

More powerful, slower.

Tasks:

- Separate code execution service.
- Container/worker isolation.
- CPU/memory/time limits.
- No network by default.
- Request queue and rate limits.
- Audit logs.

Recommendation:

- Use Option A for beta.
- Plan Option B after beta if code execution is a core differentiator.

Acceptance criteria:

- Public users cannot execute arbitrary code in the web app unless isolated execution exists.

## Recommended Execution Order

1. Decide auth provider and code-runner policy.
2. Implement beta auth/session user service.
3. Enforce user ownership in repositories/actions.
4. Verify Postgres migrations.
5. Adopt API client in learner/progress/readiness UI surfaces.
6. Add external error monitoring and uptime checks.
7. Run one full founder manual testing week.

## Beta Exit Checklist

- [ ] API adapters complete and tested.
- [ ] API client adopted in selected UI flows.
- [ ] Managed Postgres verified.
- [ ] Real auth implemented.
- [ ] User-owned state enforced.
- [ ] External error monitoring chosen and wired or documented as deploy requirement.
- [ ] Uptime checks configured.
- [ ] Code runner disabled in public beta or isolated.
- [ ] Founder manual testing week completed.
- [ ] Product feedback from manual testing converted into a fix backlog.

## Remaining Bottleneck Map

- Scaling bottleneck: SQLite and no managed DB verification.
- Security bottleneck: no real auth and fixed local user identity.
- Deployment bottleneck: no external monitoring or uptime checks.
- Segregation bottleneck: UI does not yet consume API client broadly.
- Product validation bottleneck: founder manual testing week has not run.
- Safety bottleneck: public code execution decision still open.
