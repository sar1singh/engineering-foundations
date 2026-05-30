# EngineeringOS Local Database

## Purpose

EngineeringOS uses Prisma + SQLite in Phase 12 to validate the structured content model locally before any production backend exists.

This is not the production backend. Supabase Postgres remains the future production candidate, and Vercel remains the future deployment candidate. No Supabase, Vercel, OpenAI, auth, billing, cloud database, or paid infrastructure is required for this phase.

## Why SQLite + Prisma

- Validates roadmap/content relationships locally.
- Gives the project a real schema before a SaaS backend.
- Keeps development fast and offline-friendly.
- Preserves the repository interface boundary already used by the app.
- Makes a later PostgreSQL/Supabase migration easier.

## Files

- `prisma/schema.prisma`: SQLite-compatible content schema.
- `prisma/migrations/20260530000000_init_engineeringos_content_schema/migration.sql`: initial local schema SQL.
- `prisma/seed.ts`: idempotent seed script using existing mock data.
- `src/lib/db/prisma.ts`: server-side Prisma Client singleton.
- `src/lib/repositories/prisma-*.ts`: Prisma-backed repository implementations.

## Commands

Install dependencies:

```bash
npm install @prisma/client@5.22.0
npm install -D prisma@5.22.0 tsx
```

Validate schema:

```bash
npx prisma validate
```

Generate Prisma Client:

```bash
npx prisma generate
```

Apply the local schema:

```bash
npx prisma migrate dev --name init_engineeringos_content_schema
```

If the local Prisma schema engine fails on Windows/Node compatibility, the checked-in migration SQL can be applied locally with:

```bash
npx prisma db execute --file prisma/migrations/20260530000000_init_engineeringos_content_schema/migration.sql --schema prisma/schema.prisma
```

Seed local data:

```bash
npx prisma db seed
```

## Mock Data vs Prisma Data

Mock data remains the default app data source. Prisma data exists to validate schema and future repository behavior.

Current default:

```ts
dataSource: "mock"
```

Phase 13 adds an opt-in local Prisma read mode without changing the default.

Enable Prisma-backed reads locally with:

```powershell
$env:NEXT_PUBLIC_ENGINEERINGOS_DATA_SOURCE="prisma"
npm run dev
```

For a one-off Prisma-mode build:

```powershell
$env:NEXT_PUBLIC_ENGINEERINGOS_DATA_SOURCE="prisma"
npm run build
```

The env value is intentionally public and non-sensitive. Supported values are:

- `mock`
- `prisma`

Missing or invalid values fall back to `mock`.

## Phase 13 Read-only Boundary

- Prisma mode is opt-in only.
- Mock mode remains stable and default.
- Prisma repositories are selected through `appServices`; React components do not import Prisma directly.
- Prisma read failures return safe null or empty collection fallbacks through provider wiring so pages can render useful empty states instead of crashing.
- Progress still uses local/mock-backed behavior and is not written to Prisma yet.
- No Supabase, OpenAI, auth, billing, deployment, production database, or cloud infrastructure is part of this phase.

The next phase should choose either local Prisma write/persistence planning or Supabase planning. Do not combine both in one phase.

## Safety Notes

- Do not commit `.env`, `.env.local`, or real secrets.
- `.env.example` may contain only safe local placeholders.
- Do not point `DATABASE_URL` at production.
- Do not run destructive reset commands without approval.
- Do not add Supabase yet.
- Do not deploy.
- Do not add OpenAI or real auth in this phase.
