# Phase 47 Production Foundation

## Purpose

Phase 47 creates the production-readiness foundation after the Phase 46 audit.

This phase does not claim production readiness. It makes the blockers explicit, visible in Product QA, and enforceable through tests.

## Implemented

- Added `ProductionReadinessService`.
- Added production readiness cards to `/quality`.
- Added alpha, beta, and production verdicts.
- Added checks for auth, database-backed learner state, observability, safe code execution, evaluator calibration, visual/journey QA, and deployment operations.
- Added tests for the readiness verdict.
- Extended the Phase 46 quality contract so Product QA must stay wired to production readiness signals.

## Current Verdict

- Alpha: ready for controlled local/internal alpha.
- Beta: blocked.
- Production: blocked.

## Beta Blockers

- Production authentication.
- Database-backed learner preferences, progress, responses, and evaluations.
- Production observability: logs, metrics, traces, errors, uptime checks, and alert routing.
- Playwright journey tests and screenshot-based mobile/desktop visual QA.
- Calibrated evaluator reports for DSA, HLD, LLD, AWS, Staff/EM, and behavioral interviews.
- Public-user decision for code execution: disable it or replace it with isolated execution.

## Production Blockers

- Deployment environment checklist.
- Migration strategy.
- Backup and restore plan.
- Rollback plan.
- Rate limiting and abuse prevention.
- Incident response playbook.
- Security review for auth, cookies, user data, evaluator data, and code execution.

## Phase 48 Recommendation

Phase 48 should implement Auth and Persistent Learner State:

- Add a real user profile model.
- Move onboarding preferences from cookie-only state into a repository/service boundary.
- Persist user preferences through Prisma in local mode.
- Keep mock mode supported for local demos.
- Update dashboard/onboarding to read from the learner-state service.
- Add tests for preference persistence and fallback behavior.
