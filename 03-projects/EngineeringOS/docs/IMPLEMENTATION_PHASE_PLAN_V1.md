# Implementation Phase Plan V1

Date: 2026-06-05

## Purpose

This document outlines the implementation phases for EngineeringOS after architecture validation.

It does not implement code, modify Prisma, build UI, or create TypeScript files. It defines the recommended order of work.

Implementation principle:

```txt
Build the founder beta vertical slice first.
Avoid broad platform work.
Avoid UI polish before the mission/readiness loop works.
```

## Phase 0: Implementation Guardrails

Before code changes:

- Treat V2 docs as authoritative.
- Preserve existing working routes.
- Do not remove old data paths until replacements work.
- Prefer static/file-based seed data first.
- Do not start with Prisma migrations.
- Do not build scraping or AI evaluation.
- Do not expand beyond the Architect-first founder beta.

Success criteria:

- The first code task has a narrow scope.
- The task maps directly to the validated architecture.

## Phase 1: Canonical Types And Static Data

Goal:

- Establish the data contracts for the new model.

Status:

- Started on 2026-06-05 with founder beta TypeScript contracts and deterministic static seed data for capabilities, sources, topics, roadmap projection, daily missions, and readiness rules.
- Deterministic founder beta query/service layer implemented on 2026-06-05 over the static data. No UI, Prisma, network, scraping, or AI integration was added.
- Thin founder beta readiness calculation service implemented on 2026-06-05 using static weights, proof labels, hard gates, and deterministic typed inputs.
- Deterministic founder beta mission selection service implemented on 2026-06-05 for Today's Primary Mission plus optional revision/weak-area work from static roadmap, mission, readiness, hard-gate, weak-area, and time-budget inputs.
- Deterministic founder beta orchestration service implemented on 2026-06-05 to combine static path/query data, readiness snapshots, hard-gate status, mission selection, weak areas, offer-readiness signals, and next recommended actions into one Today Plan.
- Thin founder beta progress/state input adapter implemented on 2026-06-05 to normalize manual mission/topic progress, weak areas, proof scores, readiness scores, available time, day mode, current mission, and preferred mission types for the orchestration service without persistence.
- Tiny founder beta facade service implemented on 2026-06-05 to expose a single public entrypoint from manual progress input to normalized input, validation warnings, Today Plan, readiness snapshot, missions, and next actions.
- Founder beta facade contract test added on 2026-06-05 to lock the static vertical slice from manual progress input through adapter, orchestration, readiness, mission selection, static data, and Today Plan output before UI or persistence integration.
- Read-only founder beta Today API boundary added on 2026-06-05 at `GET /api/founder-beta/today`, exposing the default facade plan for future UI or persistence integration without POST, Prisma, persistence, scraping, AI, auth, payment, deployment, or UI changes.
- Minimal read-only founder beta UI surface added on 2026-06-05 at `/founder-beta`, showing the default facade Today Plan without modifying `/today`, adding forms, persistence, Prisma, scraping, AI, auth, payment, deployment, or dependencies.
- Targeted `/founder-beta` Playwright smoke check added on 2026-06-05 to verify the page renders the default Today Plan, primary mission, readiness section, hard-gate status, and next actions before adding navigation.
- Small app-shell navigation exposure added on 2026-06-05 with a `Founder Beta` link in the existing Mission route matrix and mobile navigation, without redesigning navigation or changing `/today`.
- Founder beta manual-progress demo fixtures added on 2026-06-05 for empty, non-zero demo, and weak-area progress states compatible with the facade, without wiring them into UI or persistence.
- Read-only founder beta demo query-param toggle added on 2026-06-05 so `/founder-beta?demo=1` uses `founderBetaDemoProgress` while `/founder-beta` keeps the default empty plan.
- Read-only founder beta weak-area demo toggle added on 2026-06-05 so `/founder-beta?demo=weak-area` uses `founderBetaWeakAreaProgress` for internal visual validation.
- Minimal local-only manual progress UI added on 2026-06-05 through `FounderBetaManualProgressPanel`, allowing draft changes to available minutes, day mode, readiness scores, weak capabilities, and completed missions without persistence, POST, server actions, Prisma, AI, scraping, auth, payment, deployment, or redesign.
- Local-only manual progress UX clarification added on 2026-06-05 with Communication Readiness and helper copy stating readiness values are manual draft estimates, not persisted or final evaluated scores.
- Founder Beta local manual progress panel grouping and labels improved on 2026-06-05 into Session Settings, Manual Readiness Estimates, Weak Areas, and Completed Work. Persistence still deferred.
- Founder Beta persistence implementation plan added on 2026-06-05. The plan locks persistence to normalized progress input only, keeps Today Plan/readiness/gates/roadmaps derived, and confirms persistence can begin as the next narrow phase while onboarding, dynamic roadmaps, AI evaluation, and source ingestion remain deferred.
- Founder Beta Persistence Phase 1 implemented on 2026-06-05 with a file-backed local repository abstraction, in-memory test repository, and persistence service for normalized founder beta progress input only. Prisma remains deferred; derived Today Plan, readiness output, hard gates, roadmap projection, and mission recommendations are not persisted.
- Founder Beta Persistence Phase 1 UI wiring added on 2026-06-05. `/founder-beta` now loads saved local founder progress when present, otherwise falls back to default/demo/weak-area fixtures, and exposes an explicit `Save local progress` action that persists normalized progress input only.

Build order:

1. Capability and skill types.
2. Topic and topic relationship types.
3. Source catalog and source mapping types.
4. Roadmap projection types.
5. Mission types.
6. Proof and readiness types.
7. Offer readiness types.

Seed only:

- Founder beta capabilities.
- Architect-first capability weights.
- 3 case studies.
- High-priority source IDs.
- Small P0 topic subset.

Exit criteria:

- Static data can represent the founder beta path without UI changes.

## Phase 2: Founder Beta Seed Content

Goal:

- Create the smallest useful beta path.

Seed:

- 10-15 core capabilities.
- 30-50 topics.
- 20-40 source mappings.
- 10-20 diagnostic questions.
- Proof rubrics for:
  - HLD.
  - LLD.
  - AWS Design.
  - Architecture Review.
  - Behavioral Answer.
  - Resume Review.
  - Case Study.
- Initial missions for:
  - Weekday mode.
  - Weekend mode.
  - Revision.
  - Weak Area Repair.

Exit criteria:

- A service can read the seed and explain the path without relying on old course data.

## Phase 3: Capability And Syllabus Services

Goal:

- Make the Capability Graph and Master Syllabus queryable.

Build:

1. Capability graph service.
2. Capability dependency lookup.
3. Topic lookup service.
4. Topic-source mapping lookup.
5. Topic-to-capability lookup.

Exit criteria:

- The app can ask:
  - What capabilities matter for Solution Architect?
  - Which topics support this capability?
  - Which sources validate this topic?
  - Which proof types are required?

## Phase 4: Roadmap Projection Service

Goal:

- Generate a founder beta roadmap from canonical data.

Build:

1. Founder beta default projection.
2. Timeline mode metadata:
   - 4-week Interview Sprint.
   - 8-week Accelerated.
   - 16-week Founder Beta Default.
   - 24-week Comprehensive.
3. Confidence gate:
   - Confidence `< 0.75` cannot enter Architect Fast Track.
4. Priority rules:
   - Hard blockers.
   - Interview-critical topics.
   - Capability gaps.
   - Weak areas.
   - Nice-to-have topics.

Exit criteria:

- A roadmap can be generated without duplicating topic content.

## Phase 5: Readiness Engine Service

Goal:

- Replace completion-based readiness with evidence-backed readiness.

Build:

1. Proof scoring model `0-5`.
2. Topic readiness dimensions:
   - Knowledge 20%.
   - Practice 25%.
   - Interview 25%.
   - Implementation 30%.
3. Capability readiness rollup.
4. Role readiness rollup.
5. Interview readiness categories.
6. Offer readiness categories.
7. Hard gates:
   - Architect `>= 75`.
   - AWS `>= 70`.
   - Behavioral `>= 70`.
   - Communication `>= 70`.
   - Resume `>= 80`.
   - 3 completed case studies.
8. Confidence score separate from readiness score.

Exit criteria:

- The system can explain why the founder is or is not application-ready.

## Phase 6: Daily Mission Service

Goal:

- Generate Today's Primary Mission from roadmap and readiness state.

Build:

1. Mission queue generation.
2. Primary mission selection.
3. Optional Revision / Weak Area Repair selection.
4. Weekday mission mode.
5. Weekend mission mode.
6. Mission completion impact rules.
7. Failed mission behavior:
   - Inject repair mission.
   - Add revision task.
   - Reduce readiness confidence.

Exit criteria:

- The system can produce:

```txt
Today's Primary Mission
Optional Revision
Optional Weak Area Repair
```

## Phase 7: Minimal UI Integration

Goal:

- Connect existing surfaces to the new model without broad redesign.

Update order:

1. `/today`
   - Show Today's Primary Mission.
   - Show optional revision/repair.
   - Show proof requirement.
2. `/onboarding`
   - Capture target role, weak areas, experience, hours, and diagnostic answers.
3. `/syllabus`
   - Show canonical topics and sources.
4. `/graph`
   - Show capabilities rather than course-like graph.
5. `/progress`
   - Show readiness and hard gates.
6. Career/offer surfaces
   - Show resume/case-study/application readiness.

Exit criteria:

- Founder can start from `/today` and execute one mission.

## Phase 8: Persistence

Goal:

- Persist founder beta state after the model works.

Persist:

- Profile and diagnostic answers.
- Readiness scores.
- Proof submissions.
- Mission history.
- Revision queue.
- Weak areas.
- Offer readiness artifacts.

Do not start with persistence if static/local state is enough to validate the loop.

Exit criteria:

- Founder progress survives sessions.

## Phase 9: Founder Manual Beta Tooling

Goal:

- Support 2-4 weeks of real founder beta usage.

Build:

- Manual recompute readiness.
- Export status snapshot.
- Weekly beta review note.
- Hard-gate inspection.
- Missed/failed mission review.
- Source mapping review.

Exit criteria:

- Founder can run the system daily and review weekly progress.

## Phase 10: Stabilization Before Expansion

Goal:

- Improve the loop before adding breadth.

Stabilize:

- Mission selection accuracy.
- Proof rubrics.
- Readiness explanations.
- Source mapping quality.
- Case-study flow.
- Offer-readiness hard gates.

Do not expand to:

- Full EM roadmap.
- Public SaaS.
- Billing.
- Community.
- Scraping.
- AI evaluation.
- Large syllabus expansion.

## Recommended First Implementation Task

Start with:

```txt
Create founder beta canonical data contracts and static seed data.
```

Scope:

- No UI.
- No Prisma.
- No route changes.
- No scraping.
- No AI.

Expected files later:

```txt
src/data/capabilities/
src/data/syllabus/
src/data/sources/
src/data/roadmaps/
src/data/missions/
src/data/readiness/
```

These should be created only when implementation is explicitly requested.

## Success Definition For First Vertical Slice

The first implementation slice succeeds when EngineeringOS can:

1. Load founder beta capability data.
2. Load canonical topics and source mappings.
3. Generate the 16-week Architect roadmap projection.
4. Compute basic readiness and hard gates.
5. Select Today's Primary Mission.
6. Record proof score manually.
7. Update readiness from the mission.

No polish required.

No public SaaS features required.

No DB migration required.
