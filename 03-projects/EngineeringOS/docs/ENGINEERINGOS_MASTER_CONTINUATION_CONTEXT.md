# EngineeringOS Master Continuation Context

Date: 2026-06-06

## Purpose

This is the canonical project memory and handoff document for future EngineeringOS ChatGPT/Codex sessions.

Future sessions should read this file first, treat it as authoritative, and continue from the latest state captured here instead of re-deriving strategy from old chats or scattered planning notes.

Maintenance rule:

- Update this file after every major planning milestone, implementation phase completion, architecture change, persistence change, onboarding phase, roadmap phase, AI evaluation phase, or source ingestion phase.
- If this file conflicts with older planning documents, this file wins unless a newer explicit decision updates it.

## Current State Snapshot

Current phase:

- EngineeringOS V2 Foundation Implementation Phase 1 is complete.
- The active product surface is `/founder-beta`.
- The active implementation area is V2 foundation service preparation: connecting the expanded Founder Architect Capability Graph and Master Syllabus to roadmap projection, gap analysis, mission generation, and readiness rollups before resuming Founder Validation.

Completed phases:

- Revised product strategy and founder beta planning.
- Founder beta static vertical slice.
- Founder beta query/readiness/mission/orchestration/facade services.
- Read-only founder beta API and `/founder-beta` surface.
- Local-only manual progress panel.
- Founder Beta Persistence Phase 1 with file-backed local storage.
- Persistence Phase 1 hardening and exit criteria.
- Onboarding initialization planning.
- Onboarding initialization preview.
- Onboarding save/overwrite rules.
- Onboarding save confirmation with overwrite protection.
- Onboarding validation review.
- Minimal `/onboarding` handoff to the existing Founder Beta initializer.
- Founder validation run planning.
- Founder validation instrumentation review.
- Founder Beta final exit criteria.
- Post-validation decision tree.
- Proof scoring UX planning.
- Evaluated readiness planning.
- Founder Beta completion roadmap.
- V2 foundation audit across Capability Graph, Master Syllabus, Roadmap Projection, Daily Mission, and Readiness Engine.
- V2 Foundation Phase 1 static Founder Architect knowledge expansion.

Next recommended phase:

- EngineeringOS V2 Foundation Implementation Phase 2.
- Start with static projection/gap/mission/readiness services over the expanded Founder Architect graph before resuming Founder Validation.

Major constraints:

- Do not persist derived outputs.
- Do not add Prisma migrations for founder beta yet.
- Do not add auth, multi-user SaaS, payments, AI evaluation, scraping, dynamic roadmap generation, or runtime source ingestion.
- Keep `founder-beta` naming.
- Keep file-backed local storage for founder validation until a clear Prisma/auth migration reason exists.
- Keep readiness values presented as manual draft estimates unless evaluated by a future proof/evaluation system.

## 1. Product Vision

EngineeringOS is a Career Transformation Operating System for Engineers.

It is not primarily a course app, roadmap app, notes app, dashboard, or LeetCode clone. It is an execution system that helps an experienced engineer move from current state to offer readiness through capability modeling, daily missions, proof of competency, readiness scoring, and career asset preparation.

Target user:

- Founder first: Sarwan.
- Broader persona later: 5-15 YOE software engineers who are currently Software Engineer, Senior Engineer, or Lead Engineer and want to reach Senior, Staff, Principal, Architect, or Engineering Manager outcomes.

Primary success metric:

- The founder progresses from 10+ YOE Senior/Lead Backend level and approximately 40 LPA current compensation toward Solution Architect readiness and a 70-80+ LPA product/GCC outcome, with 90+ LPA as stretch.

Long-term vision:

- A role-aware career operating system that combines canonical syllabus content, capability graphs, roadmap projections, daily execution, interview readiness, offer readiness, proof artifacts, source-backed learning, and eventually AI-assisted evaluation.

## 2. Locked Strategic Decisions

These decisions should not be re-debated unless the user explicitly asks to revise strategy.

- First customer is the founder.
- Founder Beta optimizes for Solution Architect readiness.
- Secondary support is EM-aware Lead Backend. Engineering Manager remains support coverage, not a full EM roadmap.
- The product optimizes for offer readiness, not course completion, topic completion, or hours studied.
- Capability Graph is the core engine.
- Master Syllabus is the canonical source of truth.
- Roadmaps are projections from the Master Syllabus and Capability Graph. Roadmaps must never own duplicate content.
- Today's Mission is the daily entry point.
- Daily execution uses 1 Primary Mission plus 0-2 Optional Missions.
- Optional missions prefer revision and weak-area repair.
- Failed missions are readiness signals, not punishment.
- Weekday missions target 30-90 minutes.
- Weekend missions target 2-6 hours and can include case studies, HLD, LLD, projects, behavioral story workshops, and resume reviews.
- Topic readiness uses Knowledge 20%, Practice 25%, Interview 25%, and Implementation 30%.
- Proof scores use 0 Not Attempted, 1 Attempted, 2 Partial, 3 Acceptable, 4 Strong, 5 Interview Ready.
- Hard gates are Architect Readiness >= 75, AWS Readiness >= 70, Behavioral Readiness >= 70, Communication Readiness >= 70, Resume Readiness >= 80, and at least 3 completed architecture case studies.
- If any hard gate is below threshold, application is not recommended.
- Referral outreach before gates is allowed, but tracked separately from Offer Readiness.
- DSA depth is senior backend interview-focused, not competitive programming.
- DSA focus is Arrays, Strings, Hashing, Two Pointers, Sliding Window, Trees, Graphs, Heap, Greedy, and selective DP.
- Roadmap timelines are 4-week Interview Sprint, 8-week Accelerated, 16-week Founder Beta Default, and 24-week Comprehensive.
- Confidence below 0.75 cannot enter the Architect Fast Track roadmap, but can still exist in the Master Syllabus.
- Sarwan is the human reviewer for beta-critical source mappings.
- Topic-driven resource discovery is required before final topic extraction.
- Source metadata and source catalog decisions are separate from learning content.
- Public SaaS, billing, auth expansion, community, AI evaluation, dynamic roadmap generation, and runtime source ingestion are deferred.

Founder Beta case studies:

1. EngineeringOS Architecture.
2. Agent-OS Architecture.
3. Large Scale Learning Platform, as a hypothetical production-scale system.

## 3. Planning Artifacts

Completed and active planning documents:

| Document | Purpose | Status |
| --- | --- | --- |
| `docs/PRODUCT_STRATEGY.md` | Revised product definition and strategic positioning | Complete |
| `docs/BETA_MVP_STRATEGY.md` | Founder beta MVP scope and non-goals | Complete |
| `docs/CURRENT_CODE_ALIGNMENT_AUDIT.md` | Current codebase alignment against revised strategy | Complete |
| `docs/CONTENT_INGESTION_AND_SOURCE_MODEL.md` | Source ingestion, source catalog, and topic discovery model | Complete |
| `docs/CONTENT_INGESTION_DECISIONS.md` | Locked source priority, confidence, reviewer, and discovery decisions | Complete |
| `docs/SOURCE_CATALOG_SEED_V1.md` | Initial approved/candidate source catalog seeds | Complete |
| `docs/FIRST_BETA_PATH_MODEL.md` | First founder beta path model | Complete |
| `docs/CAPABILITY_GRAPH_MODEL_V2.md` | Authoritative Capability Graph model | Complete |
| `docs/MASTER_SYLLABUS_MODEL_V2.md` | Authoritative Master Syllabus model | Complete |
| `docs/ROADMAP_PROJECTION_MODEL_V2.md` | Authoritative Roadmap Projection model | Complete |
| `docs/DAILY_MISSION_MODEL_V2.md` | Authoritative Daily Mission model | Complete |
| `docs/READINESS_ENGINE_MODEL_V2.md` | Authoritative Readiness Engine model | Complete |
| `docs/IMPLEMENTATION_READINESS_REVIEW.md` | Architecture validation before implementation | Complete |
| `docs/IMPLEMENTATION_PHASE_PLAN_V1.md` | Implementation phase order and guardrails | Active |
| `docs/IMPLEMENTATION_STATUS.md` | Detailed running implementation status | Active |
| `docs/FOUNDER_BETA_READ_ONLY_SLICE_REVIEW.md` | Read-only founder beta slice review | Complete |
| `docs/FOUNDER_BETA_MANUAL_PROGRESS_UI_PLAN.md` | Local-only manual progress UI plan | Complete |
| `docs/FOUNDER_BETA_MANUAL_PROGRESS_UX_REVIEW.md` | Manual progress UX review before persistence | Complete |
| `docs/FOUNDER_BETA_MANUAL_PROGRESS_INTERNAL_UX_PASS.md` | Internal UX pass across default/demo modes | Complete |
| `docs/FOUNDER_BETA_MANUAL_PROGRESS_PERSISTENCE_PLAN.md` | Persistence planning for manual progress data | Complete |
| `docs/FOUNDER_BETA_PERSISTENCE_IMPLEMENTATION_PLAN.md` | Persistence implementation preparation | Complete |
| `docs/FOUNDER_BETA_LOCAL_PERSISTENCE_REVIEW.md` | File-backed persistence review | Complete |
| `docs/FOUNDER_BETA_VALIDATION_MODE_REVIEW.md` | Current founder validation mode review | Complete |
| `docs/FOUNDER_BETA_PERSISTENCE_EXIT_CRITERIA.md` | Persistence Phase 1 exit criteria | Complete |
| `docs/FOUNDER_BETA_ONBOARDING_PROGRESS_INITIALIZATION_PLAN.md` | Plan for initializing founder profile, progress, readiness estimates, weak areas, and Today Plan | Complete |
| `docs/FOUNDER_BETA_ONBOARDING_SAVE_OVERWRITE_RULES.md` | Explicit rules for onboarding save, overwrite, reset, and preview behavior | Complete |
| `docs/FOUNDER_BETA_ONBOARDING_VALIDATION_REVIEW.md` | Review of onboarding preview/save behavior and minimal onboarding integration decision | Complete |
| `docs/FOUNDER_BETA_VALIDATION_RUN_PLAN.md` | 7-day and 14-day founder validation run plan for `/founder-beta` | Complete |
| `docs/FOUNDER_BETA_VALIDATION_INSTRUMENTATION_REVIEW.md` | Review of observable/manual validation signals and metrics | Complete |
| `docs/FOUNDER_BETA_EXIT_CRITERIA_FINAL.md` | Final conditions required to declare Founder Beta complete | Complete |
| `docs/FOUNDER_BETA_POST_VALIDATION_DECISION_TREE.md` | Decision paths after validation succeeds, partially succeeds, or fails | Complete |
| `docs/FOUNDER_BETA_PROOF_SCORING_UX_PLAN.md` | Future proof scoring UX plan, pending validation evidence | Complete |
| `docs/FOUNDER_BETA_EVALUATED_READINESS_PLAN.md` | Future evaluated-readiness evolution plan, pending proof evidence | Complete |
| `docs/FOUNDER_BETA_COMPLETION_ROADMAP.md` | Roadmap from current state to Founder Beta Complete | Complete |
| `docs/ENGINEERINGOS_V2_FOUNDATION_REVIEW.md` | Audit of V2 foundation completeness and implementation sequence | Complete |
| `docs/ENGINEERINGOS_MASTER_CONTINUATION_CONTEXT.md` | Canonical project memory and future-session handoff | Active |

Older non-V2 planning docs may still contain useful context, but V2 docs and this continuation context are authoritative when there is a conflict.

## 4. Architecture Summary

Capability Graph:

- Models target roles as weighted capabilities.
- Uses Role -> Capability -> Skill -> Topic -> Task -> Proof.
- Drives gap analysis, roadmap projection, daily mission selection, and readiness rollups.

Master Syllabus:

- Canonical source of learning content and topic metadata.
- Owns topics, relationships, source mappings, task/proof links, and readiness dimensions.
- Roadmaps, missions, interview prep, and offer readiness project from it.

Roadmap Projection:

- Converts current state, target role, compensation goal, timeline, weak areas, readiness scores, source confidence, and topic dependencies into a personalized roadmap.
- Supports Fast Track, Comprehensive, Interview Sprint, Architect Track, and EM-Aware Architect Track.
- Maintains a 100% coverage map while generating 80/20 execution roadmaps.

Daily Missions:

- Selects Today's Primary Mission and 0-2 optional missions.
- Inputs include roadmap position, hard gates, readiness gaps, weak areas, completed work, time budget, and day mode.
- Failure generates repair/revision signals rather than penalties.

Readiness Engine:

- Measures readiness through proof, topic readiness, capability readiness, role readiness, interview readiness, and offer readiness.
- Keeps readiness score separate from confidence score.
- Uses hard gates before recommending applications.

Progress Tracking:

- Current implementation stores normalized founder beta progress input only.
- Derived plans, recommendations, readiness outputs, gates, and roadmap summaries remain recomputed from persisted input plus static seed data.

Source Catalog:

- Separates source metadata from content.
- Source tiers prioritize official/high-trust sources, market validation, interview/practical prep, and Staff/EM leadership references.
- Sarwan approves beta-critical mappings.

Content Ingestion:

- Planning supports source-first and topic-driven discovery.
- Runtime scraping, automated ingestion, and discovery agents are deferred.

## 5. Founder Beta Status

Current founder beta scope:

- Primary role: Solution Architect.
- Secondary framing: EM-aware Lead Backend.
- Timeline: 16-week Founder Beta Default.
- Weekly commitment seed: 10 hours per week.
- Current UI surface: `/founder-beta`.
- Current persistence identity: `founder-local`.

Completed implementation work:

- Founder beta TypeScript contracts.
- Static seed data for capabilities, source catalog, master topics, roadmap projection, daily missions, readiness rules, and demo progress fixtures.
- Deterministic query service.
- Deterministic readiness calculation service.
- Deterministic mission selection service.
- Orchestration service.
- Progress adapter.
- Facade service.
- Contract test over the full static vertical slice.
- Read-only Today API endpoint.
- `/founder-beta` page.
- App-shell navigation link.
- Default, demo, and weak-area query-param modes.
- Local-only manual progress panel.
- File-backed local persistence for normalized progress input.
- Save, load, and reset UI wiring.
- Persistence hardening for missing, empty, malformed, and missing-version records.
- Local-only onboarding initialization preview on `/founder-beta` for available minutes, day mode, weak areas, manual readiness estimates, and derived Today Plan preview without saving or overwriting persisted progress.
- Onboarding initialization save confirmation on `/founder-beta`, allowing first save when no local progress exists and requiring explicit confirmation before overwriting saved `founder-local` progress.
- Minimal `/onboarding` handoff section that points to the existing `/founder-beta` initializer without duplicating progress state or persistence logic.

Completed tests/checks:

- Focused founder beta unit tests for services.
- Founder beta facade contract test.
- Founder beta persistence service tests.
- Founder beta Playwright E2E tests covering render, demo modes, manual panel, save/load, and reset.
- Latest known focused checks passed: `npm run typecheck`, `npm run lint`, focused founder beta service tests, and `npm run test:e2e -- tests/e2e/founder-beta.spec.ts`.

Current limitations:

- Manual readiness inputs are draft estimates, not evaluated readiness.
- Progress is local-only and file-backed.
- Onboarding-to-progress initialization is available only through the existing `/founder-beta` preview/save flow and minimal `/onboarding` handoff.
- Real founder validation has not occurred yet.
- V2 Foundation Phase 1 expanded the static Founder Architect knowledge base, but generated roadmap projection, gap analysis, mission candidate generation, and graph-backed readiness services still need deeper implementation.
- No AI evaluation.
- No dynamic roadmap generation.
- No runtime source ingestion.
- No multi-user support.
- Mobile E2E persistence coverage is intentionally skipped where a shared file-backed store would create cross-project interference.

## 6. Persistence Status

Current repository pattern:

- Repository boundary exists for founder beta progress.
- File-backed local repository is used for founder validation.
- In-memory repository exists for focused tests.
- Fixed local identity is `founder-local`.
- Current local storage file is `.engineeringos/founder-beta-progress.json`.

Persisted fields:

- `schemaVersion`
- `userId`
- `completedMissionIds`
- `skippedMissionIds`
- `completedTopicIds`
- `weakAreaCapabilityIds`
- `weakAreaTopicIds`
- `manualReadinessScores`
- `proofScores`
- `availableMinutes`
- `dayMode`
- `preferredMissionTypes`
- `createdAt`
- `updatedAt`

Derived fields that must not be persisted:

- Today Plan.
- Readiness snapshot.
- Hard gate status.
- Roadmap projection output.
- Primary mission.
- Optional missions.
- Next actions.
- Mission recommendations.
- Static founder beta data.
- Capability definitions.
- Source catalog.

File-backed storage decision:

- Keep file-backed storage for founder validation.
- It is intentionally simple, local, inspectable, reversible, and low-risk.
- It is not a multi-user or production SaaS persistence strategy.

Prisma status:

- Prisma exists elsewhere in the app, but founder beta persistence intentionally did not add Prisma migrations.
- Reconsider Prisma only after founder validation requires multi-user ownership, auth-linked identity, relational querying, or production deployment needs.

## 7. Deferred Work

Onboarding:

- Onboarding initialization planning, preview, save, and overwrite protection are complete for `/founder-beta`.
- A minimal `/onboarding` handoff section now links into the existing `/founder-beta` initializer.
- The Founder Beta preview form remains inside `/founder-beta`; it was not duplicated into `/onboarding`.
- Next work should validate the flow through real founder usage before adding richer onboarding fields or evaluated diagnostics.

Dynamic roadmaps:

- Deferred because the static founder beta projection is enough to validate the loop.
- Dynamic generation should come after persisted progress and onboarding are stable.

AI evaluation:

- Deferred to avoid fake authority around readiness scores.
- Proof rubrics and manual signals come first.

Source ingestion runtime:

- Deferred because source strategy and catalog planning are complete, but runtime ingestion is not required for founder workflow validation.

Discovery agents:

- Planned conceptually through the Resource Discovery Agent.
- Runtime implementation is deferred until source ingestion becomes a product priority.

Multi-user SaaS:

- Deferred until founder validation proves the core loop.
- Auth, payments, admin, billing, community, and deployment expansion should not be added during founder beta core-loop work.

## 8. Current Phase

Current phase:

- EngineeringOS V2 Foundation Implementation Phase 1 is complete.

Completed phase:

- Local file-backed persistence, save/load/reset UI wiring, persistence hardening, onboarding initialization preview, onboarding save/overwrite confirmation, onboarding validation review, minimal `/onboarding` handoff, founder validation run planning, instrumentation review, exit criteria, decision tree, proof scoring/evaluated readiness planning, completion roadmap, V2 foundation review, and V2 Foundation Phase 1 static Founder Architect knowledge expansion.

Next recommended phase:

- EngineeringOS V2 Foundation Implementation Phase 2.

Recommended implementation start point:

- Do not continue Founder Validation yet.
- Implement Founder Architect projection, gap, mission, and readiness services over the expanded static graph.
- Continue saving only normalized progress input; keep Today Plan, readiness, gates, missions, and recommendations derived.

## 9. Implementation Progress Log

2026-06-04:

- Revised product strategy and beta MVP docs.
- Repositioned EngineeringOS as a Career Transformation Operating System for Engineers.
- Completed current-code alignment audit.
- Locked source ingestion, confidence scoring, source tiers, topic-driven discovery, and Sarwan reviewer rules.

2026-06-05 planning:

- Completed first beta path model.
- Completed V2 Capability Graph, Master Syllabus, Roadmap Projection, Daily Mission, and Readiness Engine models.
- Completed implementation readiness review and phase plan.

2026-06-05 founder beta static vertical slice:

- Added founder beta contracts and static seed data.
- Added query, readiness, mission selection, orchestration, progress adapter, facade, and contract tests.
- Added read-only API boundary and `/founder-beta` internal page.

2026-06-05 validation UI:

- Added navigation link.
- Added demo progress fixtures.
- Added default, demo, and weak-area modes.
- Added local-only manual progress panel.
- Improved labels, grouping, and readiness helper copy.

2026-06-05 persistence planning:

- Completed manual progress persistence plan.
- Completed persistence implementation plan.
- Locked persistence to normalized progress input only.

2026-06-05 persistence implementation:

- Added file-backed founder beta progress repository and in-memory test repository.
- Added persistence service.
- Added save/load/update/reset tests.
- Added POST/DELETE progress API route.
- Wired `/founder-beta` save, persisted load, and reset actions.

2026-06-05 persistence hardening:

- Added local persistence review.
- Added validation mode review.
- Added persistence exit criteria.
- Hardened missing, empty, malformed, and missing-version file handling.
- Confirmed Persistence Phase 1 complete for founder validation.

2026-06-05 continuation:

- Added this master continuation context as the canonical project memory.

2026-06-05 onboarding initialization planning:

- Added Founder Beta onboarding progress initialization plan.
- Locked onboarding to initialize normalized progress input, readiness estimates, weak areas, available time, target role context, and derived Today Plan preview without overwriting saved progress silently.
- Recommended next step is a local draft onboarding preview that reuses the existing progress adapter and facade.

2026-06-05 onboarding initialization preview:

- Added a local-only `/founder-beta` onboarding initialization preview section.
- Preview accepts available minutes, day mode, weak areas, and manual readiness estimates.
- Preview derives Today Plan output through the existing founder beta facade without saving, overwriting, Prisma, auth, AI, scraping, or dynamic roadmap generation.

2026-06-05 onboarding save/overwrite planning:

- Added Founder Beta onboarding save overwrite rules.
- Locked default behavior to no overwrite.
- Onboarding may save only normalized progress input.
- Existing saved progress requires explicit overwrite confirmation.
- Preview, save, reset, and overwrite are separate behaviors.

2026-06-05 onboarding save confirmation:

- Implemented explicit save behavior for onboarding initialization preview.
- First save is allowed when no saved progress exists.
- Existing saved progress requires confirmation before overwrite.
- Saved data remains normalized progress input only; Today Plan, readiness, gates, and missions remain derived.

2026-06-06 onboarding validation review and minimal integration:

- Added Founder Beta onboarding validation review.
- Confirmed overwrite protection is correct for founder validation.
- Confirmed saved local progress remains normalized input only.
- Confirmed Today Plan, readiness, gates, missions, and next actions remain derived.
- Added a minimal `/onboarding` handoff section linking to `/founder-beta`.
- Did not duplicate progress state, persistence logic, Prisma, auth, AI, source ingestion, dynamic roadmaps, or derived-output persistence.

2026-06-06 founder validation run planning:

- Added Founder Beta validation run plan.
- Defined 7-day and 14-day founder validation workflows for `/founder-beta`.
- Locked daily manual update expectations, usefulness signals, confusion/prematurity signals, validation checklist, and post-validation decision gates.
- Reconfirmed Prisma, AI evaluation, source ingestion, dynamic roadmaps, auth, payments, deployment, multi-user SaaS, and derived-output persistence remain deferred until validation produces evidence.

2026-06-06 founder validation preparation and completion roadmap:

- Added validation instrumentation review defining observable signals, missing signals, manual metrics, and instrumentation non-goals.
- Added final Founder Beta exit criteria.
- Added post-validation decision tree for success, partial success, and failure paths.
- Added future proof scoring UX plan.
- Added future evaluated readiness plan.
- Added completion roadmap from current state to Founder Beta Complete.
- Reconfirmed validation has not occurred yet and results must not be fabricated.

2026-06-06 EngineeringOS V2 foundation review:

- Audited Capability Graph V2, Master Syllabus V2, Roadmap Projection V2, Daily Mission V2, and Readiness Engine V2 against current implementation.
- Added audit addenda to all five V2 model docs.
- Created `docs/ENGINEERINGOS_V2_FOUNDATION_REVIEW.md`.
- Concluded the Founder Beta framework exists, but the underlying EngineeringOS knowledge system is only partially implemented.
- Estimated original EngineeringOS vision implementation at approximately 35%.
- Determined Founder Validation is premature if treated as validation of the full vision.
- Set next recommended phase to EngineeringOS V2 Foundation Implementation Phase 1: Founder Architect Capability Graph Completion.

2026-06-06 EngineeringOS V2 Foundation Implementation Phase 1:

- Expanded the Founder Architect static capability graph to 14 capabilities and 32 skills.
- Expanded the Founder Architect Master Syllabus V2 static map to 100 topics across backend engineering, Node.js production backend, security, HLD, distributed systems, databases, reliability/observability, AWS/cloud architecture, LLD, senior-backend DSA, behavioral/communication, delivery/leadership, architecture case studies, career assets, and offer readiness.
- Expanded the static source catalog to 64 curated sources.
- Updated roadmap projection inputs to use the expanded static capability/topic set.
- Added integrity tests for capability, skill, topic, source, roadmap, mission, proof, and hard-gate references.
- Founder Validation remains paused until Phase 2 connects the expanded graph to projection, gap, mission, and readiness services.

## 10. Constraints

Must not do without explicit user direction:

- Restart the architecture from scratch.
- Re-debate locked strategy.
- Treat courses as the product center.
- Duplicate state models.
- Persist derived outputs.
- Persist Today Plan, readiness snapshot, hard gates, roadmap projection output, or mission recommendations.
- Add premature SaaS features.
- Add auth, billing, community, admin, or production deployment work during founder beta core-loop phases.
- Add scraping, AI evaluation, dynamic roadmap generation, or source ingestion runtime before the persisted founder workflow is stable.
- Replace file-backed founder validation storage with Prisma before the project has a clear migration reason.
- Rename major folders or remove old planning/code paths unless the user explicitly asks.

## 11. Future Session Instructions

When a future AI session starts:

1. Read `docs/ENGINEERINGOS_MASTER_CONTINUATION_CONTEXT.md` first.
2. Treat this file as the authoritative project memory.
3. Continue from the latest implementation state captured here.
4. Inspect local code before editing because the worktree may contain user or generated changes.
5. Preserve founder-beta naming unless the user explicitly requests a rename.
6. Keep derived outputs derived.
7. Run focused checks for the files touched, plus `npm run typecheck` and `npm run lint` when practical.
8. Update this file after every major planning or implementation milestone.
9. Update `docs/IMPLEMENTATION_STATUS.md` and `docs/IMPLEMENTATION_PHASE_PLAN_V1.md` when phase status changes.

Known local artifact note:

- E2E and local persistence work can generate `.engineeringos/founder-beta-progress.json`.
- Next.js and Playwright runs can modify generated artifacts such as `next-env.d.ts` or `test-results`.
- Do not treat generated artifacts as product changes unless the task explicitly requires them.

## 12. How To Continue In New Chat

Use this exact order for future Codex sessions:

1. Read `docs/ENGINEERINGOS_MASTER_CONTINUATION_CONTEXT.md`.
2. Read `docs/IMPLEMENTATION_STATUS.md` for detailed running status.
3. Read `docs/IMPLEMENTATION_PHASE_PLAN_V1.md` for current guardrails and phase order.
4. Inspect local `git status --short` before editing.
5. If working on Founder Beta, inspect `/founder-beta`, the founder beta services, the progress repository/service, and `tests/e2e/founder-beta.spec.ts`.
6. Continue from the current phase: EngineeringOS V2 Foundation Implementation Phase 2.
7. Do not restart architecture or replace the founder beta model.
8. Keep persisted state limited to normalized progress input.
9. Run focused tests for touched code plus `npm run typecheck` and `npm run lint` when practical.
10. After any milestone, update this file, `docs/IMPLEMENTATION_STATUS.md`, `docs/IMPLEMENTATION_PHASE_PLAN_V1.md`, and `docs/AI_SESSION_LOG.md`.
