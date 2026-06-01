# Beta Segregation and Scale Action Plan

## Product Success Definition

EngineeringOS succeeds only if the founder can personally use the web app to learn the roadmap end to end, become interview-ready, and get a job.

That is the primary product acceptance test.

Every infrastructure, UI, syllabus, assessment, and roadmap decision must support that outcome.

## Current Segregation Verdict

The app is currently a modular monolith:

- UI, server actions, backend services, and repository wiring live inside the Next.js app.
- Database can be externalized, but local SQLite is still the current Prisma provider.
- A future UI/backend split is possible because services and repositories already exist.
- It is not yet cleanly split for separate UI/backend hosting.

This is acceptable for local alpha, but not enough for beta SaaS scaling.

## Beta Scaling Goal

Before beta, EngineeringOS must support:

- UI deployable independently or as part of one app.
- Backend capability exposed through API adapters.
- Database hosted separately as managed PostgreSQL.
- Runtime health and config checks.
- Authenticated learner-owned state.
- Observability and deployment rollback basics.

The product can still ship beta as a modular monolith if the API boundaries are real and the DB/auth/observability foundation is production-shaped.

## Phase 51 - API Adapter Boundary

Purpose: prepare UI/backend separation without moving business logic into React components.

Implement route handlers:

- `GET /api/learner/profile`
- `PUT /api/learner/profile`
- `GET /api/progress/summary`
- `GET /api/readiness`
- `GET /api/quality/status`

Rules:

- API routes call services only.
- API routes do not directly access mock data or Prisma.
- UI pages may still use services directly during this phase.
- Add typed response contracts.
- Add tests that API routes exist and call service boundaries.

Acceptance criteria:

- API smoke tests pass.
- API response contracts are documented.
- UI/backend split has a clear adapter layer.

Current implementation status:

- Done: API contracts module.
- Done: API client module.
- Done: `GET /api/learner/profile`.
- Done: `PUT /api/learner/profile`.
- Done: `GET /api/progress/summary`.
- Done: `GET /api/readiness`.
- Done: `GET /api/quality/status`.
- Done: smoke route coverage.

## Phase 52 - Database Provider Upgrade Plan

Purpose: make database hosting beta-capable.

Decide and document:

- Local dev: SQLite or local Postgres.
- Beta/prod: managed PostgreSQL.
- Prisma provider migration path from SQLite to PostgreSQL.
- Migration release process.
- Backup/restore plan.
- Connection pooling approach.

Implementation:

- Add Postgres-ready `.env.example` values.
- Add DB provider decision doc.
- Add migration checklist.
- Add tests/contracts that production Prisma must not use `file:` SQLite URL.

Acceptance criteria:

- Beta DB target is managed Postgres.
- SQLite is explicitly local-only.
- Migration workflow is documented.

Current implementation status:

- Done: `docs/DATABASE_PROVIDER_UPGRADE_PLAN.md`.
- Done: `.env.example` includes managed Postgres direction.
- Done: runtime config guard blocks production Prisma with SQLite-style `file:` URL.

## Phase 53 - Auth and User Ownership

Purpose: make learner data safe and user-owned.

Implement:

- Real auth provider decision.
- User identity abstraction.
- Session user ID used by learner profile/preferences/progress/evaluations.
- No fixed local user ID in beta mode.
- Access-control tests for user-owned state.

Acceptance criteria:

- Learner profile is scoped by authenticated user.
- Progress/evaluations cannot be read across users.
- Mock auth remains available for local demos.

Current implementation status:

- Done: `docs/AUTH_AND_USER_OWNERSHIP_PLAN.md`.
- Pending: choose provider.
- Pending: implement real session user ID.
- Pending: enforce no fixed local user ID in beta mode.
- Done: user ownership policy guard exists for beta/production mode.
- Done: learner preferences, explain-back attempts, and evaluation repositories now use a repository user guard.

## Phase 54 - Backend Extraction Readiness

Purpose: make it possible to deploy backend separately later.

Implement:

- `src/lib/api-contracts` for request/response types.
- `src/lib/api-client` for frontend calls.
- Server pages can gradually move from direct service calls to API client calls where useful.
- Document which modules can be extracted first.

Recommended extraction order:

1. Learner/profile API.
2. Progress/readiness API.
3. Evaluation API.
4. Content/search API.
5. Code execution service as a separate isolated service.

Acceptance criteria:

- UI can call at least learner/profile and readiness through API client.
- Business logic remains in services.

Current implementation status:

- Done: API contracts module.
- Done: API client module.
- Done: route adapters call services/repositories instead of raw mock data.
- Done: dashboard includes an API-client readiness/quality strip.
- Pending: expand API client adoption to onboarding and progress flows.

## Phase 55 - Observability and Operations

Purpose: make beta behavior debuggable.

Implement:

- Structured request logs.
- Error boundary/reporting plan.
- Health/readiness endpoints.
- Basic uptime check.
- Deployment rollback checklist.
- Incident response mini-playbook.

Acceptance criteria:

- Failed deploy can be rolled back.
- Production issue can be triaged with logs and health checks.
- Product QA page reflects operational readiness.

Current implementation status:

- Done: `/api/health`.
- Done: `docs/OBSERVABILITY_AND_OPERATIONS_PLAN.md`.
- Pending: structured production logs.
- Done: structured API logging helper exists.
- Pending: external error monitoring.
- Pending: uptime checks.
- Done: runtime config now requires error monitoring and uptime config in beta/production.

## Phase 56 - Beta Manual Testing Program

Purpose: validate the real product outcome.

Manual testing mission:

- Use EngineeringOS as the only learning hub.
- Follow a selected role path.
- Complete daily lessons.
- Submit answers.
- Run practice problems.
- Use mock interview mode.
- Track weak areas.
- Improve readiness score.
- Validate whether the app actually helps interview preparation.

Success evidence:

- Founder can explain core topics clearly.
- Founder can solve practice problems.
- Founder can answer HLD/LLD/AWS/staff-style questions.
- Founder can build interview-ready career assets.
- Founder gets interviews and converts to an offer.

Failure evidence:

- Roadmap feels confusing.
- Daily lesson flow is unclear.
- Content is shallow for interview performance.
- Assessments do not help improve answers.
- Progress/readiness scores do not match actual confidence.
- The app does not improve job-search outcomes.

Current implementation status:

- Done: `docs/BETA_MANUAL_TESTING_PROGRAM.md`.
- Pending: run one full founder testing week.
- Pending: capture daily learning friction and interview-readiness evidence.
- Done: beta manual testing tracker exists.
- Done: local browser code runner is disabled by default in beta/production deployment modes unless explicitly isolated/enabled later.

## Priority Order

1. Phase 51 API Adapter Boundary.
2. Phase 52 Database Provider Upgrade Plan.
3. Phase 53 Auth and User Ownership.
4. Phase 55 Observability and Operations.
5. Phase 54 Backend Extraction Readiness.
6. Phase 56 Beta Manual Testing Program.

## Beta Gate

Do not call EngineeringOS beta-ready until:

- API adapters exist for learner/profile, progress, readiness, and quality.
- Managed Postgres plan is implemented or ready to execute.
- Real auth decision is made and user-owned state is enforced.
- Health/config checks pass.
- Manual testing loop can run for at least one full week.
- The founder can use the app daily without needing code changes to continue learning.

## Completion Plan

The detailed 100% completion plan for phases 51-56 now lives in `docs/PHASE_51_56_COMPLETION_PLAN.md`.

Highest priority decisions:

- Auth provider.
- Managed Postgres provider and migration path.
- Public code execution policy.

Highest priority implementation:

- Session user service.
- Repository-level user ownership.
- API client adoption in selected UI flows.
- External error monitoring and uptime checks.
- Founder manual testing week.
