# Quality Contract Remediation Plan

## Purpose

This plan tracks the work needed to turn the intentional red QA contracts in `src/lib/quality/` into a systematic product/content backlog.

EngineeringOS must pass three gates:

- Coverage Gate: every master-roadmap domain exists as a first-class syllabus domain.
- Readiness Gate: every target role has a credible 80/20, depth, and expert path.
- Experience Gate: the UI feels like a serious SaaS learning operating system, not a content dump.

## Phase 1 - Fix Red QA Coverage

Add first-class syllabus domains for:

- `foundations`: CS basics, OS, networking, HTTP, APIs, Big-O, debugging.
- `security`: auth, OAuth/OIDC, JWT, sessions, CSRF, XSS, SSRF, secrets, IAM, threat modeling.
- `performance`: profiling, caching, load testing, latency, memory, DB bottlenecks, Node performance, observability.
- `tradeoffs`: consistency vs availability, sync vs async, SQL vs NoSQL, cache strategies, cost vs reliability.
- `interviews`: coding rounds, system design rounds, behavioral, recruiter screens, mock loops, calibration.
- `career-assets`: resume, LinkedIn, GitHub, portfolio, proof-of-work, promotion packet, STAR stories.
- `case-studies`: WhatsApp, Netflix, Uber, Stripe/payment, booking, feed, notification, URL shortener variants.
- `ai-expansion`: later track for AI-assisted learning, evaluators, prompt workflows, AI product/system design.

Current status:

- Done: `security`
- Done: `performance`
- Done: `interviews`
- Done: `foundations`
- Done: `tradeoffs`
- Done: `case-studies`
- Done: `career-assets`
- Done: `ai-expansion`
- Done: `senior-skills` is now represented as a first-class router domain while `staff-em` remains the role-focused view.
- Done: `testing-quality` was added to satisfy strategic quality coverage and future QA workflow needs.

## Phase 2 - Strengthen Role Paths

Expand every role roadmap to at least 12-18 meaningful topics.

Senior Backend should explicitly include JavaScript, Node.js, DSA, Databases, System Design, API design, Testing/Quality, Observability, and Security basics.

Engineering Manager should expand into roadmap execution, incident leadership, hiring calibration, stakeholder communication, delivery health, performance management, architecture review, team topology, planning/risk management, technical strategy, escalation handling, and behavioral interview stories.

Solution Architect should include AWS Well-Architected pillars, security, reliability, performance, cost, operations, DR, networking, and HLD case studies.

Staff/Principal should include tradeoff analysis, architecture reviews, RFC writing, strategy docs, migration plans, incident/systemic learning, cross-team influence, and platform thinking.

## Phase 3 - Fix Topic Quality Failures

Every topic must have:

- Short definition
- Strong mental model
- Theory section
- Practical example
- 8+ practice problems
- 8+ interview questions
- Review/rubric prompt
- Common mistakes
- Production use cases
- References

Immediate fixes:

- Done: deepen `recursion-backtracking`.
- Done: add stronger Security/Auth content.
- Done: add Testing/Quality topic coverage.
- Done: Observability is covered under Performance through `observability-slo-tracing`.

## Phase 4 - Better QA Architecture

Split quality commands later:

```txt
npm run test              -> normal engineering tests
npm run test:quality      -> product/CEO/CTO contract tests
npm run test:content      -> syllabus/content quality tests
npm run test:roadmap      -> roadmap coverage tests
```

This keeps intentional red product tests visible without confusing them with ordinary regressions.

## Phase 5 - UI/UX Product Upgrade

Move the UI from content browsing to learning operations.

Detailed Phase 44/45 implementation plan: `docs/PHASE_44_45_IMPLEMENTATION_PLAN.md`.

Highest ROI upgrades:

- Started: role onboarding panel on dashboard with role path entry points.
- Started: role-readiness dashboard v2 with DSA, Backend, System Design, AWS, Security, LLD, and Staff/EM scores.
- Started: syllabus command center with table-first default, filters, QA health, and 80/20 controls.
- Started: topic page tabs/anchors for Learn, Code, Practice, Interview, Review, and References.
- Started: sticky topic progress/checklist sidebar.
- Started: Product QA screen at `/quality` for contract health, missing router domains, thin role paths, shallow topics, and strategic content areas.
- Done: full local onboarding wizard with saved target role, current level, hours/week, deadline, weak areas, and learning mode.
- Done: rubric scoring history through mock evaluation results on syllabus topic pages.
- Done: interactive timed mock interview session mode on syllabus topic pages.
- Done: local JavaScript runner for topic examples and practice starter code.
- Done: mock evaluator scoring for syllabus responses.
- Done: weighted assessment readiness model using role completion, core-domain balance, QA health, and saved study pace.
- Daily learning flow: start lesson, continue role path, review weak area, do one mock question, update readiness.

Remaining production hardening:

- Persist onboarding preferences and evaluation history against authenticated users.
- Add visual/mobile QA automation for the upgraded SaaS learning flows.
- Calibrate evaluator rubrics and produce full mock interview reports.
- Harden local code execution before any production-style deployment.

## Phase 6 - Content Priority Order

Recommended execution:

1. Add `security`.
2. Add `performance`.
3. Add `interviews`.
4. Add `career-assets`.
5. Add `foundations` and `tradeoffs`.
6. Add `testing-quality` and `observability`.
7. Expand Engineering Manager and Senior Backend paths.
8. Add Product QA dashboard/UI.

## Phase 46 - Final Audit and Hardening

Status: local/mock hardening complete.

Delivered:

- Added `docs/PHASE_46_FINAL_AUDIT_AND_HARDENING.md`.
- Expanded smoke routes to include onboarding, syllabus, a deep syllabus topic, and Product QA.
- Added local code-runner safety guardrails.
- Added `src/lib/quality/phase-46-readiness-contract.test.ts`.
- Added `npm run test:quality` for the executive/product contract suite.

Verdict:

- Production: not ready.
- Alpha: ready for controlled local/internal alpha.
- Beta: not ready until auth, database-backed state, deployment observability, visual QA, calibrated evaluator reports, and hardened code execution are complete.

## Phase 47 - Production Foundation

Status: production gate implemented; production platform still blocked.

Delivered:

- Added `docs/PHASE_47_PRODUCTION_FOUNDATION.md`.
- Added `src/lib/services/production-readiness-service.ts`.
- Added production readiness cards to `/quality`.
- Added tests that keep alpha/beta/production readiness honest.

Verdict:

- Alpha: ready for controlled local/internal alpha.
- Beta: blocked.
- Production: blocked.

Next:

- Phase 48 should implement auth and persistent learner state.

## Phase 48 - Auth and Persistent Learner State

Status: bridge implemented; real production auth still blocked.

Delivered:

- Added `docs/PHASE_48_AUTH_AND_PERSISTENT_LEARNER_STATE.md`.
- Added `LearnerPreferencesRepository`.
- Added `MockLearnerPreferencesRepository`.
- Added `LearnerStateService`.
- Wired learner state into `appServices`.
- Updated dashboard and onboarding pages to read through the learner-state service.
- Updated onboarding save action to write through the learner-state service.
- Kept cookie fallback for local continuity.

Verdict:

- This is a real architecture step toward production learner state.
- It is not full production auth.
- Phase 49 should add database-backed learner profile/preferences schema and Prisma repository implementation.

## Phase 49 - Database-backed Learner Profile

Status: local Prisma foundation implemented.

Delivered:

- Added `docs/PHASE_49_DATABASE_BACKED_LEARNER_PROFILE.md`.
- Added `docs/DEPLOYMENT_AND_CONTAINERIZATION_AUDIT.md`.
- Added Prisma `LearnerProfile` model.
- Added additive SQL migration `20260531010000_add_learner_profile`.
- Added Prisma learner preferences repository.
- Wired Prisma mode to use database-backed learner preferences.
- Applied the additive SQL locally with `prisma db execute`.
- Regenerated Prisma Client.
- Verified local learner profile upsert/read through Prisma Client.

Verdict:

- Local Prisma learner profile persistence is ready.
- Production deployment is still blocked until auth, Postgres, migration strategy, health checks, observability, and container/deployment hardening are implemented.

## Phase 50 - Deployment Foundation

Status: deployment foundation implemented; production remains blocked.

Delivered:

- Added `docs/SERVICE_SEGREGATION_AND_SAAS_SCALING_PLAN.md`.
- Added `docs/PHASE_50_DEPLOYMENT_FOUNDATION.md`.
- Added `Dockerfile`.
- Added `.dockerignore`.
- Added `/api/health`.
- Added runtime config validation.
- Added deployment quality contract tests.
- Expanded smoke routes to include `/api/health`.

Verdict:

- Modular monolith deployment is the recommended MVP path.
- UI/backend split should start with API adapter boundaries in Phase 51.
- Managed Postgres is required before serious beta/prod SaaS scaling.

## Phases 51-56 - Beta Segregation and Scale Execution

Status: first parallel slice implemented.

Delivered:

- API contracts and API client.
- API adapters for learner profile, progress summary, readiness, and quality status.
- Database provider upgrade plan.
- Auth and user ownership plan.
- Observability and operations plan.
- Beta manual testing program.
- Expanded smoke routes for API adapters.
- Deploy mode config and beta/prod runtime guards.
- User ownership policy guard.
- Structured API logging helper.
- Beta manual testing tracker.

Remaining beta blockers:

- Real auth provider and session user ownership.
- Managed Postgres migration strategy and verification.
- External error monitoring/uptime checks.
- API client adoption in selected UI flows.
- Full founder manual testing week.

## Tracking Rule

After each tranche:

- Update `docs/AI_SESSION_LOG.md`.
- Update `docs/IMPLEMENTATION_STATUS.md`.
- Update this file.
- Run `npm run typecheck`, `npm run lint`, and the relevant quality tests.
