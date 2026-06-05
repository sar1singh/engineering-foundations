# Founder Beta Read-Only Slice Review

Date: 2026-06-05

## Purpose

This review checks whether the current founder beta read-only vertical slice is complete enough before adding manual-progress UI, persistence, forms, or Prisma-backed state.

Verdict:

```txt
Read-only slice is complete enough to proceed to manual-progress UI planning.
Do not add persistence yet.
```

## 1. What Is Complete

The read-only founder beta slice now covers the full static path from data to visible page:

- Static founder beta data exists for capabilities, skills, topics, sources, roadmap projection, daily missions, readiness rules, offer-readiness signals, and demo progress fixtures.
- Query service exposes deterministic access to founder beta path, capabilities, topics, sources, missions, roadmap projection, readiness rules, hard gates, and offer-readiness signals.
- Readiness service calculates topic, capability, role, hard-gate, and offer readiness with locked weights and proof score labels.
- Mission selection service selects Today's Primary Mission plus 0-2 optional missions from roadmap, readiness, hard gates, weak areas, current mission, and time budget.
- Orchestration service combines query, readiness, mission selection, weak areas, offer signals, and next actions into a Today Plan.
- Progress adapter normalizes manual progress input, clamps scores, deduplicates IDs, derives weak areas, and returns validation warnings.
- Facade service exposes the public integration point: `getFounderBetaPlanFromProgress(input)` and `getFounderBetaDefaultPlan()`.
- Read-only API route exists at `GET /api/founder-beta/today`.
- Read-only `/founder-beta` page renders the facade output.
- `/founder-beta`, `/founder-beta?demo=1`, and `/founder-beta?demo=weak-area` are supported.
- App shell navigation exposes `Founder Beta`.
- Contract tests lock the facade-level vertical slice.
- Playwright smoke tests verify the `/founder-beta` page renders default, demo, and weak-area modes.

## 2. What Is Still Mock/Static

The current slice is intentionally static:

- User progress is not persisted.
- Manual proof scores exist only as input fixture data.
- Readiness scores are supplied as static/manual inputs, not calculated from real mission completion history.
- Mission completion is not saved.
- Weak areas are derived from fixture/manual input, not from real attempts.
- Offer-readiness signals are static and not connected to resume, LinkedIn, GitHub, applications, referrals, or compensation workflows.
- API route returns only the default plan; demo modes are page-only query-param views.
- `/founder-beta` is an internal read-only validation surface, not the final daily user workflow.

## 3. What Is Intentionally Deferred

Do not build these yet:

- POST endpoints.
- Forms.
- Prisma schema changes.
- Persistence repositories.
- Auth/user ownership integration.
- AI evaluation.
- Scraping/source ingestion.
- Public beta workflows.
- `/today` migration.
- Full UI redesign.
- Offer pipeline tracker.
- Case-study submission/review workflow.

These should wait until the manual-progress input model is validated in the read-only surface.

## 4. Risks Before Adding Manual Input

Main risks:

- Manual-progress UI could create a second state model if it bypasses `founder-beta-progress-adapter-service`.
- Proof scoring could feel arbitrary until proof rubrics are made visible beside input controls.
- Readiness values may be mistaken as authoritative despite still being manually supplied.
- Demo fixtures may overfit the current tiny topic/mission set.
- `/today` still uses the older founder-success cockpit, so users may see two mission concepts until a migration decision is made.
- Persistence added too early could harden the wrong schema.

Mitigations:

- All manual UI should call the facade through the progress adapter.
- Keep manual inputs local/read-only or in-memory first.
- Show validation warnings clearly before saving anything.
- Add persistence only after the manual input shape is proven.
- Keep `/founder-beta` separate until it is clear how it should merge with `/today`.

## 5. Recommended Next Implementation Step

Recommended next task:

```txt
Add a minimal manual-progress draft UI on /founder-beta that is local-only and non-persistent.
```

Scope:

- Use the existing progress adapter and facade.
- Allow editing a small subset only:
  - completed mission IDs
  - weak-area capability IDs
  - weak-area topic IDs
  - key readiness scores
  - available minutes
  - day mode
- No save button.
- No POST.
- No Prisma.
- No route changes.
- No auth.
- No AI.

Success criterion:

The founder can change manual inputs in the browser and see the Today Plan update, while the underlying data model remains deterministic and persistence-free.
