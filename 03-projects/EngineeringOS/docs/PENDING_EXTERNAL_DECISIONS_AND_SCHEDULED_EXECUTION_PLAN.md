# Pending External Decisions and Scheduled Execution Plan

## Purpose

These items are intentionally not fully completed yet because they require external service choices, credentials, a real database target, or manual usage time.

This plan keeps them ready for scheduled execution.

## 1. Real Auth Provider Implementation

Decision needed:

- Choose one:
  - Clerk: fastest SaaS onboarding.
  - Auth.js: more self-owned and flexible.
  - AWS Cognito: best AWS-first alignment.

Inputs required:

- Provider choice.
- App/client credentials.
- Redirect URLs.
- Session strategy.

Implementation tasks:

- Add provider SDK/dependencies.
- Implement real auth service adapter.
- Replace mock auth in beta/prod mode.
- Use authenticated session user ID for learner profile, progress, responses, evaluations, weak areas, and revision queue.
- Add tests for unauthenticated beta write rejection and cross-user data isolation.

Acceptance criteria:

- Beta mode requires login.
- Local/mock mode still works.
- Fixed local user ID is impossible in beta/prod writes.
- User A cannot read or mutate User B data.

## 2. Managed PostgreSQL Migration Execution

Decision needed:

- Choose managed Postgres:
  - Neon.
  - Supabase Postgres.
  - AWS RDS Postgres.
  - Other managed Postgres.

Inputs required:

- `DATABASE_URL=postgresql://...`
- Migration permissions.
- Backup/PITR settings.
- Connection pooling decision.

Implementation tasks:

- Verify Prisma schema against Postgres.
- Run migrations on staging/beta DB.
- Seed or import curriculum content.
- Verify learner profile, progress, attempts, evaluations, weak areas, and revision queue.
- Run `npm run db:verify-target`.
- Run route smoke in Prisma mode against Postgres.

Acceptance criteria:

- App runs in Prisma mode against managed Postgres.
- SQLite is local-only.
- Migration rollback plan exists.
- Backup/restore plan exists.

## 3. External Error Monitoring and Uptime Checks

Decision needed:

- Choose monitoring:
  - Sentry for app errors.
  - Axiom/Datadog/Logtail for logs.
  - UptimeRobot/Better Stack/provider-native uptime checks.

Inputs required:

- Error monitoring DSN.
- Uptime check URL.
- Alert email/channel.

Implementation tasks:

- Add provider SDK or HTTP reporting adapter.
- Configure `ENGINEERINGOS_ERROR_MONITORING_DSN`.
- Configure `ENGINEERINGOS_UPTIME_CHECK_URL`.
- Monitor:
  - `/api/health`
  - `/dashboard`
  - `/api/readiness`
- Document alert triage.

Acceptance criteria:

- Beta/prod runtime config passes monitoring checks.
- Errors are visible outside server console.
- Uptime alert fires on health failure.

## 4. More API Client Adoption

Decision needed:

- Decide how aggressively to move UI flows through API adapters before beta.

Recommended scope:

- Onboarding read/write.
- Progress summary.
- Readiness widgets.
- Product quality status.

Implementation tasks:

- Add client components where interactivity benefits from API client.
- Keep server-rendered pages where SEO/performance is simpler.
- Do not move business logic into React components.

Acceptance criteria:

- UI/backend split is practical for learner and progress flows.
- API contracts remain typed.
- Existing server-rendered flows still work.

## 5. Founder Manual Testing Week

Decision needed:

- Schedule one uninterrupted week for real product use.

Inputs required:

- Target role path.
- Daily time block.
- Feedback notes location.

Execution tasks:

- Use dashboard daily.
- Complete lessons.
- Submit answers.
- Attempt practice problems.
- Use mock interview mode.
- Track weak areas.
- Update readiness confidence.
- Record friction and missing content.

Acceptance criteria:

- Founder can continue learning for one week without code changes.
- App clearly identifies next lesson and weak areas.
- Feedback improves interview answers.
- Manual findings become a prioritized product backlog.

## 6. Optional Isolated Code Execution Service

Decision needed:

- For public beta:
  - Disable browser code runner, or
  - Build isolated execution service.

Recommendation:

- Disable for public beta unless code execution is essential.
- Build isolated execution after beta if needed.

If isolated service is required:

- Separate service/container.
- CPU/memory/time limits.
- No network by default.
- Queue/rate limits.
- Audit logs.
- Abuse controls.

Acceptance criteria:

- Public users cannot execute arbitrary code in the main web app.
- Any public execution runs in an isolated environment.

## Scheduling Checklist

- [ ] Pick auth provider.
- [ ] Pick Postgres provider.
- [ ] Pick monitoring/uptime provider.
- [ ] Decide public code runner policy.
- [ ] Schedule founder testing week.
- [ ] Allocate implementation block for API client adoption.

## Current Default Until Decisions Are Made

- Auth: mock/local only.
- DB: SQLite local, Postgres planned for beta/prod.
- Monitoring: runtime config placeholders only.
- Code runner: enabled local/alpha, disabled beta/prod by default.
- Manual testing: tracker exists, week not yet run.
