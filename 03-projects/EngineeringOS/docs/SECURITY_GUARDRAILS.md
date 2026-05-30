# EngineeringOS Security Guardrails

## Current Rule

EngineeringOS is local-first and mock-first. No production, paid, cloud, real AI, or real auth integration should be added until explicitly approved.

## Guardrails

- Do not commit secrets.
- Do not commit `.env`, `.env.local`, or environment-specific local files.
- Do not hardcode API keys.
- Do not put secrets in frontend code.
- Do not run delete commands without explicit approval.
- Do not deploy to production.
- Do not create paid infrastructure.
- Do not add real AI API calls.
- Do not add Supabase yet.
- Do not add real auth yet.
- Do not add billing.
- Do not run additional DB migrations without approval.
- Do not initialize or change Prisma/SQLite beyond the approved local Phase 12 scope without approval.
- Do not add cloud storage or external sync without approval.

## Allowed In Current Phase

- Mock auth abstraction
- Mock AI abstraction
- Mock DB abstraction
- Mock storage abstraction
- Local TypeScript types
- Local mock data
- Repository interfaces
- Mock repository implementations
- Service aggregation
- Documentation updates

## Required Checks

After meaningful changes run:

```bash
npm run typecheck
npm run lint
npm run build
```

If any check fails, fix the issue before continuing.
