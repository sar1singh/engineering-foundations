# EngineeringOS Local MVP Release Checklist

## Release Scope

This checklist is for a local-only EngineeringOS MVP checkpoint.

It is not a production release. It does not include Supabase, OpenAI, auth, billing, deployment, cloud storage, or production database work.

## Required Safety State

- [ ] Default data source is `mock`.
- [ ] Prisma mode is opt-in only through `NEXT_PUBLIC_ENGINEERINGOS_DATA_SOURCE=prisma`.
- [ ] `.env` and `.env.local` are not committed.
- [ ] No secrets exist in frontend code.
- [ ] No destructive DB commands are required.
- [ ] Seeded roadmap, topic, practice, problem, prompt, reference, and rubric content remains read-only.
- [ ] Local persistence uses fixed local user ID `engineeringos-local-user`.

## Required Validation

Run:

```bash
npm run test
npm run typecheck
npm run lint
npm run build
npm run smoke:mock
npm run smoke:prisma
```

Expected result:

- [ ] Tests pass.
- [ ] Typecheck passes.
- [ ] Lint passes.
- [ ] Build passes.
- [ ] Mock route smoke passes.
- [ ] Prisma route smoke passes.

## Feature Checklist

- [ ] Dashboard loads from service layer.
- [ ] Learning Graph loads roadmap tree.
- [ ] Topic Studio loads complete topic content.
- [ ] Topic Studio can mark topic complete.
- [ ] Topic Studio can save explain-back attempts.
- [ ] Topic Studio shows explain-back history and empty state.
- [ ] Practice Lab loads task content.
- [ ] Practice Lab can mark task complete.
- [ ] Practice Lab can save mock evaluation notes.
- [ ] Practice Lab shows mock evaluation history and empty state.
- [ ] Progress page shows local progress summary.
- [ ] Progress page can reset local progress.
- [ ] Content search loads service-backed results.
- [ ] Settings documents mock default and Prisma opt-in mode.

## Local Database Checklist

- [ ] `prisma/schema.prisma` validates.
- [ ] Prisma Client generates.
- [ ] Local SQLite schema includes persistence tables.
- [ ] Prisma repository persistence verification has passed.
- [ ] `prisma migrate dev` is not required for this local checkpoint.
- [ ] The known Windows/Node Prisma schema-engine issue remains documented.

## Audit Checklist

- [ ] `npm audit --json` findings are documented.
- [ ] No automatic audit fixes were applied without approval.
- [ ] Next/PostCSS remediation is deferred until a compatible Next path exists.
- [ ] Monaco/DOMPurify remediation is deferred until a dedicated dependency phase or Monaco usage decision.

## Out Of Scope

- Supabase.
- PostgreSQL production database.
- Auth.
- Billing.
- OpenAI or real AI evaluation.
- Deployment.
- Production user data.
- Public SaaS release.

## Release Decision

Current recommendation:

```txt
Ready for local MVP checkpoint after required validation passes.
Not ready for production deployment.
```
