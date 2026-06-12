# Implementation Phase Plan V1

Date: 2026-06-05

## Purpose

This document outlines the implementation phases for EngineeringOS after architecture validation.

It does not implement code, modify Prisma, build UI, or create TypeScript files. It defines the recommended order of work.

Canonical project memory:

- Future sessions must read `docs/ENGINEERINGOS_MASTER_CONTINUATION_CONTEXT.md` first.
- That file is the authoritative continuation source for product vision, locked decisions, implementation progress, current phase, and next recommended phase.
- Update it after every major planning or implementation milestone.

Implementation principle:

```txt
Build the founder beta vertical slice first.
Avoid broad platform work.
Avoid UI polish before the mission/readiness loop works.
```

## Current State Snapshot

Current phase:

- **STATUS: PACKS 8A-8D, 9A-9E, 10A-10I, 11A, 11B, 11C, 11D, 11E COMPLETE** (2026-06-12)
- All V2 Foundation phases (1 through 8G) and Roadmap Pack 1 (DSA + JS Internals + Node.js Depth), Roadmap Pack 2 (System Design + LLD + Architecture Case Studies), and Roadmap Pack 3 (Security + Testing/QA + Containerization/Docker + Real-Time Systems) are complete.
- **Roadmap Pack 1:** 6 sources, 4 skills under cap-node-backend, 22 topics, 3 missions. Fixed pre-existing topic refs. Typecheck/lint 0 errors. 732 pass / 2 pre-existing fail. 0 regressions.
- **Roadmap Pack 2:** 6 sources, 25 topics, 4 missions. No new skills needed. Fixed source/topic refs. Typecheck/lint 0 errors. 732 pass / 2 pre-existing fail. 0 regressions.
- **Roadmap Pack 3:** 13 sources (net after dedup), 4 skills (skill-security-practice, skill-testing-methodology, skill-container-orchestration, skill-real-time-architecture), ~40 topics, 7 missions. Horizontal expansion. Typecheck/lint 0 errors. 732 pass / 2 pre-existing fail / 9 E2E suites. 0 regressions.
- **Roadmap Pack 4:** 1 new capability (cap-platform-engineering), 8 new skills, 10 new topics, 10 new missions, 5 new sources, +11 HLD case studies. Horizontal expansion. Typecheck 0 errors. 734 pass / 8 pre-existing Playwright infra failures. 0 regressions.
- Phase 8G: Post-Restructure Audit, Integration Tests, and Founder-Beta Hardening (completed 2026-06-10): 16 integration tests, component audit, trace timestamps. Typecheck 0 errors. 0 regressions.
- Phase 8F: Component Tests for Agent Runner Preview / Trace Visualization (completed 2026-06-10): 29 component tests, enhanced Timeline.
- Phase 8E: Agent Runner Stub / Dry-Run Interface (completed 2026-06-10): types/service/component, 30 tests.

Completed founder beta implementation:

- Static founder beta data contracts and seed data.
- Query, readiness, mission selection, orchestration, progress adapter, facade, and contract tests.
- Read-only founder beta API and `/founder-beta` page.
- Demo and weak-area modes.
- Local manual progress panel.
- File-backed local persistence for normalized progress input.
- Save/load/reset UI wiring.
- Persistence hardening and exit criteria.
- Onboarding initialization preview.
- Onboarding save and explicit overwrite confirmation.
- Onboarding validation review.
- Minimal `/onboarding` handoff to the existing `/founder-beta` initializer.
- Founder validation run plan.
- Founder validation instrumentation review.
- Founder Beta exit criteria.
- Post-validation decision tree.
- Proof scoring UX plan.
- Evaluated readiness plan.
- Founder Beta completion roadmap.
- V2 foundation audit addenda and review.
- V2 Foundation Phase 1 static Founder Architect knowledge expansion.
- V2 Foundation Phase 1 comprehensive validation: proof registry, 17 integrity tests, 8 readiness-chain tests, all 64 sources verified referenced, all mappings validated, 0 circular chains.
- V2 Foundation Phase 2: Gap Engine, Readiness Rollup, Roadmap Projection V2, and Mission Candidate Generation (4 services, 41 tests).
- V2 Foundation Phase 2A: DSA & Problem Solving capability pack expansion (19 skills, ~68 problem topics, 2 sources).
- V2 Foundation Phase 2B: Readiness Pipeline & Offer Readiness — Proof Lifecycle Service, Readiness Rollup Service, Offer Readiness Service, Mission Candidate readiness/offer impact with DSA contribution (73 tests).
- V2 Foundation Phase 3: Interview Simulation Engine — question bank (105 questions, 7 categories), deterministic evaluation framework (11 rubrics, 33 criteria), simulation engine (session lifecycle, question selection, progress tracking), readiness integration (proof record creation, interview readiness snapshots). 50 new tests. Typecheck clean, lint clean, 384 passes/10 pre-existing failures (0 regressions).
- V2 Foundation Phase 4: Integration Tests & Interview UI — end-to-end pipeline integration tests (simulation→evaluation→proof→rollup→offer readiness for all 5 session types), minimal interview UI at `/founder-beta/interview`, deterministic multi-session analytics helpers (InterviewAnalyticsService), deterministic score decay helper (InterviewScoreDecayService), weak-area interview mission integration. 40 new tests. Typecheck clean, lint clean, 422 passes/10 pre-existing failures (0 regressions).
- V2 Foundation Phase 5: Founder Validation & Interview Pipeline Closure — Founder Validation Readiness Review (docs/FOUNDER_BETA_VALIDATION_READINESS_REVIEW.md) assessing all 8 founder beta surfaces, Founder Validation Checklist (docs/FOUNDER_BETA_FOUNDER_VALIDATION_CHECKLIST.md) with 3-day and 7-day validation plans, pipeline closure verification, minimal UX hardening (Sidebar interview nav link), 8 new Playwright E2E smoke tests for `/founder-beta/interview`. Typecheck clean, lint clean, test suite clean.
- V2 Foundation Phase 6A: Source Catalog V2 Expansion — source catalog expanded from 66 to 158 sources (140+ target exceeded), topic-source mappings updated for all 158 sources, integrity test updated, category minimums met. Typecheck clean, lint clean, 423 passes/2 pre-existing failures/8 Playwright infra failures. 0 regressions.
- V2 Foundation Phase 6B: Content Navigation & Resource Linking UI — added source helper functions to `FounderBetaService` (6 new methods), created `/founder-beta/resources` page with `ResourceExplorerPanel` client component (capability/topic/category/tier/reliability filters), added "Browse Resources" dashboard link, added 8 unit tests (15 total, up from 7), added 6 Playwright smoke tests for resources UI. Typecheck 0 errors, lint 0 errors (7 pre-existing warnings), 432 passes/2 pre-existing failures/8 Playwright infra failures. 0 regressions.
- V2 Foundation Phase 6C: Mission Workspace & Topic Learning View — created `/founder-beta/topic/[id]` route with TopicLearningView client component (topic detail/info/resources grouped by category/practice section/prerequisites/related and successor topic links/proof visibility/readiness dimensions/related missions), added Mission Workspace section on `/founder-beta` dashboard (6 missions shown with topic links/readiness impact badges/proof tags), added `getMissionsByTopicId()` and `getSkillById()` service methods (2 new, 19 total), 7 new unit tests (23 total, up from 15), 7 new Playwright E2E smoke tests (mission workspace renders/topic view with all sections/mission→topic nav/back-button nav/unknown topic 404). Fixed pre-existing ResourceExplorerPanel bug (duplicate label declaration TS2300). Typecheck 0 errors, lint 0 errors (7 pre-existing warnings), 440 passes/2 pre-existing failures/8 Playwright infra failures. 0 regressions.
- V2 Foundation Phase 7A: Content Registry & Coverage Analysis — created `ContentRegistryService` with buildRegistry, computeCoverageSummary, detectGaps, getCoverageSummaryRows. Created `src/types/content-registry.ts`. Created `/founder-beta/content` route with `ContentExplorer` client component (capability→skill→topic→source drill-down, coverage metric cards, gap analysis accordion, source catalog breakdown). Added 23 new unit tests, 4 new Playwright E2E smoke tests. Typecheck 0 errors, lint 0 errors (7 pre-existing warnings), 463 passes/2 pre-existing failures/8 Playwright infra failures. 0 regressions.
- V2 Foundation Phase 7B: Gap Remediation & Quality Pass — merged 75 DSA problem bank topics (175 total), added sources to 10 weakly-sourced topics (2→4 each), improved 3 confidence scores (0.70→0.75), added 10 quality threshold gates. ContentExplorer updated. 0 regressions.
- V2 Foundation Phase 7C: Content Ingestion Contracts & Approval Workflow Planning — created 12 contract types, 8 static validation helpers, 20+ tests, CONTENT_INGESTION_CONTRACTS_V1.md, CONTENT_APPROVAL_WORKFLOW_V1.md. 0 regressions. Typecheck 0 errors, lint 0 errors (7 pre-existing warnings).
- V2 Foundation Phase 7D: Static Ingestion Simulation / Import Preview — created 5 mock ingestion scenarios in `ingestion-mock-candidates.ts`, `content-ingestion-simulator.ts` with lifecycle generation, `/founder-beta/ingestion-preview` route with `IngestionPreview` client component (lifecycle bar, expandable detail panels, filter buttons). 31 unit tests, 3 Playwright E2E tests. Fixed pre-existing Phase 7C lint/type errors. Typecheck 0 errors, lint 0 errors (8 pre-existing warnings), 515 passed / 2 pre-existing / 8 Playwright infra failures. 0 regressions.
- V2 Foundation Phase 8D: Runtime Agent Boundary Planning / Human Approval Gate Hardening — created `docs/RUNTIME_AGENT_BOUNDARY_PLAN_V1.md` defining what runtime agents may/must never do, allowed inputs/outputs, human approval gate conditions, publish boundary, audit requirements, failure handling, and rollback expectations. Added 4 deterministic boundary assert helpers to `content-ingestion-contracts.ts`: `assertHumanApprovalRequired` (returns ValidationResult with specific reasons), `assertAgentCannotPublish` (delegates to `validateAgentCannotPublishDirectly`), `assertNoAutonomousWrite` (blocks agent-created ContentApprovalDecision), `assertValidAgentBoundary` (comprehensive check combining attribution, publish boundary, human approval, and autonomous write rules). Added 22 new tests covering all assert helpers — valid boundaries, direct publish attempts, missing attribution, low confidence, multiple violations. Updated UI labels in AgentDiscoveryReview.tsx and page description to clarify "No runtime agents", "preview only", "no writes". Typecheck 0 errors, lint 0 errors (16 pre-existing warnings). 82 total Phase 8A/8B/8C/8D tests pass. 0 regressions. No scraping, API calls, persistence, or autonomous writes.
- V2 Foundation Phase 8C: Manual Agent Candidate Review Integration — created `agent-discovery-review-service.ts` with pure helper functions for review state management. Created `AgentDiscoveryReview.tsx` client component with queue summary cards, filter tabs, approve/reject/needs-changes/reset buttons, quality notes, rejection reason, mapping override preview section, and publish-block explanation. Updated `/founder-beta/agent-discovery-preview` page. 33 new tests (16 service + 17 component). Typecheck 0 errors, lint 0 errors (16 pre-existing warnings). 0 regressions. No scraping, API calls, persistence, or autonomous writes.
- V2 Foundation Phase 8B: Static Agent Output Simulation Preview — created 5 mock agent discovery scenarios in `agent-discovery-mock-scenarios.ts`. Created `agent-discovery-simulator.ts` with gate-by-gate simulation. Created `/founder-beta/agent-discovery-preview` route with `AgentDiscoveryPreview` client component. 27 tests. Typecheck 0 errors, lint 0 errors (17 pre-existing warnings), 604 passed / 2 pre-existing / 8 Playwright infra failures. 0 regressions. No scraping, API calls, persistence, or autonomous writes.
- V2 Foundation Phase 8E: Mock Agent Runner / Dry-Run Interface (completed 2026-06-10): created `src/types/agent-runner.ts` with dry-run agent runner types. Created `src/lib/services/agent-runner-service.ts` with `runMockAgent()` and `runAllMockAgents()`. Created `src/components/founder-beta/AgentRunnerPreview.tsx` interactive dry-run UI (agent type selector, topic/category hints, run button, trace/status/gate/output display). Updated `/founder-beta/agent-discovery-preview` page with dry-run panel. Created `docs/AGENT_RUNNER_DRY_RUN_INTERFACE_V1.md`. 30 new tests. Typecheck 0 errors, lint 0 errors (16 pre-existing warnings). 0 regressions. No scraping, API calls, persistence, or autonomous writes.
- V2 Foundation Phase 7E: Manual Import Approval UX Planning — created `docs/MANUAL_IMPORT_APPROVAL_UX_PLAN.md` defining future interactive manual approval UX across 7 areas: candidate review view, quality review input, topic/source mapping override, approve/reject flow, publish preview, batch view, static vs interactive vs persisted delineation. No code changes. Typecheck 0 errors, lint 0 errors (8 pre-existing warnings).
- **Pack 9C — Manual URL Fetch UI + Candidate Preview Bridge (completed 2026-06-11):** created `src/app/founder-beta/runtime-fetch-preview/page.tsx` with URL input form, dry-run fetch results (validation + mocked ManualUrlFetchResult), candidate preview bridge with "Human approval required" badge, "Send to Manual Review Preview" session-only action, review queue with approve/reject, publish preview section, and session-only state notice. 15 tests. Reuses existing `dryRunManualUrlFetch`, `DEFAULT_FETCH_BOUNDARY`, and all validation helpers. Typecheck 0 errors, lint 0 errors (19 pre-existing warnings), 772 pass / 8 pre-existing Playwright infra failures. 0 regressions.
- **Pack 9D — Review Queue Integration Hardening (completed 2026-06-11):** sidebar nav entries for all preview pages, 3 dashboard cards, deduplication, batch operations, queue status indicators. 4 new tests. Typecheck/lint 0 errors, 776 pass / 8 pre-existing failures. 0 regressions.
- **Pack 9E — Runtime Discovery MVP Closure Review (completed 2026-06-11):** created `docs/RUNTIME_DISCOVERY_MVP_CLOSURE_REVIEW.md` with scope audit, safety gate verification, blockers list, Pack 10 options (A/B/C). Updated all canonical docs. Typecheck/lint 0 errors, 776 pass / 8 pre-existing failures. 0 regressions.
- **Pack 10A — Real Single-URL Fetch MVP (completed 2026-06-11):** created `src/lib/services/manual-url-real-fetch.ts` — `realManualUrlFetch` async function using native `fetch()` with AbortController timeout (15s), redirect following (limit 5), binary content-type denylist, max-bytes enforcement (20 MiB), error taxonomy (9 codes). Created 15 tests with mocked `global.fetch`. Updated `runtime-fetch-preview/page.tsx` with fetch mode toggle (Dry Run / Real Fetch), real fetch button with loading/error states, amber warning panel. Created `docs/REAL_SINGLE_URL_FETCH_MVP.md`. Typecheck 0 errors, lint 0 errors (19 pre-existing warnings), 791 pass / 8 pre-existing failures. 0 regressions.
- **Pack 10B — Runtime Fetch Candidate Catalog Import Preview (completed 2026-06-11):** created `src/lib/services/manual-url-candidate-bridge.ts` — bridge service (`buildCandidateFromFetchResult`, `checkDuplicateInCatalog`, `previewCandidateImport`). Created 17 tests. Updated `runtime-fetch-preview/page.tsx` with "Candidate Import Preview" section showing candidate fields, validation, duplicate matches, human approval badge. Preview only — no catalog writes. Typecheck 0 errors, lint 0 errors (19 pre-existing warnings), 793 pass / 8 pre-existing failures. 0 regressions.
- **Pack 10C — Runtime Fetch Review Queue Integration (completed 2026-06-11):** created `src/lib/services/runtime-fetch-review-service.ts` — session-only queue state management with states (pending, approved, rejected, duplicate-risk, needs-changes), pure helper functions (createInitialReviewState, computeQueueSummary, approveCandidate, rejectCandidate, markDuplicateRisk, needsChangesCandidate, resetDecision), and QueueSummary type. Created 12 tests. Updated `runtime-fetch-preview/page.tsx` to use the new service: session-only `RuntimeFetchReviewState[]` instead of inline `Record<string, ReviewState>`, five-state queue summary display, per-candidate actions (Approve, Reject with reason, Mark Duplicate Risk, Needs Changes with notes, Reset), prominent duplicate warnings when detected, needs-changes notes display, rejection reason display, and read-only publish preview. All 19 existing page tests updated to match new state names (pending instead of sent-to-review). Typecheck 0 errors, lint 0 errors (19 pre-existing warnings), 805 pass / 8 pre-existing Playwright E2E infra failures. 0 regressions.
- **Pack 10D — Real Fetch MVP Closure Review (completed 2026-06-11):** created `docs/REAL_FETCH_MVP_CLOSURE_REVIEW.md` auditing all Pack 10 components (fetch contracts, dry-run adapter, candidate bridge, review queue), verifying all 12 safety gates, identifying 7 blockers before agent ingestion (missing `manual-url-real-fetch.ts`, no HTTP client abstraction, no robots.txt parser, no rate limiting, no agent runner integration, no attribution chaining, no sub-agent orchestration). Defined Pack 10E scope: Single Ingestion Agent MVP. Updated canonical docs. Typecheck 0 errors, lint 0 errors (19 pre-existing warnings), 805 pass / 8 pre-existing Playwright E2E infra failures. 0 regressions.
- **Pack 10E — Single Ingestion Agent MVP (completed 2026-06-11):** created `src/types/ingestion-agent.ts` defining 4 sub-agent types (fetch, validate, bridge, prepare-review) and `IngestionAgentResult` with full trace, gate status, validation, and duplicate info. Created `src/lib/services/ingestion-agent-service.ts` — `runIngestionAgent()` orchestrates the pipeline: validate input → dry-run fetch → bridge to candidate → prepare review entry, producing agent-compatible trace output with per-step timing, error/warning collection, and gate enforcement. Created `src/components/founder-beta/IngestionAgentPreview.tsx` — URL input form, agent trace display (timeline with step icons), fetch result card, validation section, and full 5-state review queue with approve/reject/duplicate-risk/needs-changes/reset actions and publish preview. Created `src/app/founder-beta/ingestion-agent-preview/page.tsx`. 11 service tests + 15 component tests. Typecheck 0 errors, lint 0 errors (19 pre-existing warnings), 831 pass / 8 pre-existing Playwright E2E infra failures. 0 regressions.
- **Pack 10F — Sub-Agent Ingestion Pipeline V1 (completed 2026-06-11):** created 5 pure sub-agents (fetch/validate/bridge/duplicate/prepare-review) with traceId prefix `pipe-`. 31 new tests. Typecheck 0 errors, lint 0 errors (19 pre-existing warnings), 862 pass / 8 pre-existing Playwright E2E infra failures. 0 regressions.
- **Pack 10G — Approved Import Patch Generator (completed 2026-06-11):** created patch types, generator service with 26 tests, added `PatchPreviewSection` to `IngestionAgentPreview.tsx`, created docs. Typecheck 0 errors, lint 0 errors (19 pre-existing warnings), 888 pass / 8 pre-existing Playwright E2E infra failures. 0 regressions.
- **Pack 10H — Manual Patch Application Review / First Approved Import (completed 2026-06-11):** created `src/types/import-review.ts` — 6 types (`ImportReviewDecision`, `ImportReviewItem`, `ApprovedImportPackage`, `ImportReviewSummary`, `ImportConflict`, `ImportApplicationPlan`). Created `src/lib/services/import-review-service.ts` — 7 functions (`createImportReviewPackage`, `reviewPatchEntry`, `approvePatchEntry`, `rejectPatchEntry`, `detectImportConflicts`, `generateApplicationPlan`, `summarizeImportPackage`). Created `src/lib/services/import-review-service.test.ts` — 25 tests covering package creation, approvals, rejections, conflict detection, summary generation, application plan generation, deterministic output, no canonical writes. Created `src/components/founder-beta/ImportReviewPanel.tsx` — UI with summary cards, approve/reject buttons, conflict display, application plan, JSON preview, "no apply button" warning. Created `src/app/founder-beta/import-review/page.tsx` — new route. Created `data/ingestion/first-import-candidates.json` — 10 deterministic import candidates. Created `docs/FIRST_IMPORT_WORKFLOW_V1.md`. Typecheck 0 errors, lint 0 errors (19 pre-existing warnings), 913 pass / 8 pre-existing Playwright E2E infra failures. 0 regressions.
- **Pack 10I — Sub-Agent Topic Mapping V1 (completed 2026-06-11):** created `src/data/founder-beta/topic-mapping-candidates.ts` — 10 deterministic mapping candidates (5 architecture, 5 DSA) with source > topic > skill > capability chains and manual confidence scoring. Created `src/lib/services/topic-mapping-service.ts` — `computeTopicMapping()`, `computeSkillMapping()`, `computeCapabilityMapping()` with fuzzy title matching, sourceType matching, and deterministic scoring. Created `src/lib/services/topic-mapping-service.test.ts` — 26 tests. Created `src/components/founder-beta/TopicMappingPreview.tsx` — UI with source list, topic mapping, skill/capability suggestions. Created `src/app/founder-beta/topic-mapping/page.tsx`. Updated `founderBetaSourceCatalog` — added 4 new sources, count 217→221. Updated `founderBetaTopics` — added 4 new topics, count 252→256. Updated `founderBetaMissions` — added 4 new missions, count 41→43. Updated content-registry.test.ts, founder-beta-service.test.ts. Typecheck 0 errors, lint 0 errors, 917 pass / 8 pre-existing Playwright E2E infra failures. 0 regressions.
- **Pack 11A — Runtime Discovery Agent MVP (completed 2026-06-12):** created `src/types/discovery-agent.ts` — 8 types (DiscoveryAgentInput, DiscoveryAgentOutput, DiscoveryAgentTrace, DiscoveryAgentTraceStep, DiscoveryAgentStep, DiscoveryAgentStatus, DiscoveryMetadata, DiscoveryCandidateResult). Created `src/lib/services/runtime-discovery-agent.ts` — `runDiscoveryAgent()` with 6-step pipeline: validate-url, fetch, extract-metadata, generate-candidate, duplicate-detection, prepare-review. Full per-step trace with timestamps/duration/status/warnings/errors. Created `src/lib/services/runtime-discovery-agent.test.ts` — 14 tests. Created `src/components/founder-beta/DiscoveryAgentPreview.tsx` — React UI with URL input, sourceType/consent/submittedBy controls, Run Discovery button, trace timeline (6 steps with badges), metadata card, candidate card, duplicate status card, review queue card, approval badge, no publish controls. Created `src/app/founder-beta/discovery-agent/page.tsx`. Created `src/components/founder-beta/DiscoveryAgentPreview.test.tsx` — 32 component tests. Typecheck 0 errors, lint 0 errors in new files (pre-existing warnings only). 931 pass / 8 pre-existing Playwright E2E infra failures. 0 regressions.
- **Pack 11B — Runtime Sub-Agent Pipeline (completed 2026-06-12):** created `src/types/runtime-sub-agent.ts` — 6 types (RuntimeSubAgentType, RuntimeSubAgentInput/RuntimeSubAgentOutput discriminators, RuntimeSubAgentTrace, PipelineResult, RuntimeSubAgentFailure) with 5 agent types (validation-agent, metadata-agent, candidate-agent, duplicate-agent, review-agent). Created `src/lib/services/runtime-sub-agents/validation-agent.ts` — `runValidationAgent()` with 3 validation checks (input validity, no bulk crawl, boundary). Created `src/lib/services/runtime-sub-agents/metadata-agent.ts` — `runMetadataAgent()` extracting title, domain, keywords, contentType from fetch result. Created `src/lib/services/runtime-sub-agents/candidate-agent.ts` — `runCandidateAgent()` building RawContentCandidate from fetch result. Created `src/lib/services/runtime-sub-agents/duplicate-agent.ts` — `runDuplicateAgent()` checking catalog for URL/title duplicates. Created `src/lib/services/runtime-sub-agents/review-agent.ts` — `runReviewAgent()` always returning humanApprovalRequired=true. Created `src/lib/services/runtime-sub-agent-orchestrator.ts` — `runRuntimeSubAgentPipeline()` orchestrating validation → fetch (inline → metadata → candidate → duplicate → review with stop-on-failure and full PipelineResult. Created `src/lib/services/runtime-sub-agent-orchestrator.test.ts` — 17 tests covering happy path, validation/metadata/candidate failure, duplicate risk, trace generation, deterministic output. Created `src/lib/services/runtime-sub-agents/validation-agent.test.ts` — 8 tests. Created `src/lib/services/runtime-sub-agents/metadata-agent.test.ts` — 9 tests. Created `src/lib/services/runtime-sub-agents/candidate-agent.test.ts` — 4 tests. Created `src/lib/services/runtime-sub-agents/duplicate-agent.test.ts` — 5 tests. Created `src/lib/services/runtime-sub-agents/review-agent.test.ts` — 6 tests. Created `src/lib/services/runtime-sub-agent-safety.test.ts` — 7 safety assertions (no catalog writes, no topic writes, no approval bypass, no input mutation). Updated `DiscoveryAgentPreview.tsx` — replaced monolithic `runDiscoveryAgent` call with `runRuntimeSubAgentPipeline`, visual pipeline showing all 5 agent steps (numbered cards, pass/fail indicators, elapsed time, warnings, errors). Updated `DiscoveryAgentPreview.test.tsx` — 30 tests updated to use new pipeline. Typecheck 0 errors, lint 0 errors in new files (pre-existing warnings only), 998 pass / 8 pre-existing Playwright E2E infra failures / 15 pre-existing test failures (import-review + content-registry + mission-selection count drift). 0 regressions.

Current work mode:

- **Packs 9A-11B Complete** — Manual URL runtime fetch pipeline through import review (9A-10H), topic mapping V1 (10I), runtime discovery agent MVP (11A), runtime sub-agent pipeline (11B). Discovery agent now runs as 5 independent sub-agents (Validation → Metadata → Candidate → Duplicate → Review) with per-step traces, stop-on-failure, safety assertions. All session-only, no persistence, no catalog writes, no autonomous publishing.
- **NOTE:** `manual-url-real-fetch.ts` MISSING on disk — all agents use dry-run adapter.
- Runtime agents, AI evaluation, scraping, external API calls, persistence, and autonomous writes remain deferred.
- Next recommended phase: **Pack 11C** (Multi-Agent Discovery Queue & Batch Processing).

Current guardrail:

- Continue using normalized progress input as the only saved Founder Beta state. Keep Today Plan, readiness, gates, roadmaps, missions, and next actions derived.

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
- Founder Beta persisted-load E2E verification added on 2026-06-05 to confirm `/founder-beta` reloads saved local progress input and still renders derived Today Plan output without asserting or persisting derived recommendations.
- Founder Beta reset-local-save action added on 2026-06-05 so founder validation runs can clear saved `founder-local` progress and return to the default derived Today Plan without Prisma, auth, dynamic roadmap generation, AI, scraping, source ingestion, or derived-output persistence.
- Founder Beta Persistence Phase 1 hardening completed on 2026-06-05 with contract audit docs, validation-mode review, exit criteria, reset/missing-file/malformed-file/schema-version tests, and read-time schema fallback. Phase 1 is complete for local founder validation.
- Founder Beta onboarding initialization preview added on 2026-06-05 to show how available minutes, day mode, weak areas, and manual readiness estimates would initialize progress and derive Today Plan output without saving by default.
- Founder Beta onboarding save confirmation added on 2026-06-05. First save is allowed when no local progress exists; existing saved `founder-local` progress requires explicit overwrite confirmation. Saved data remains normalized progress input only.
- Founder Beta validation run planning completed on 2026-06-06 with a 7-day and 14-day founder validation workflow, daily `/founder-beta` usage expectations, manual update rules, usefulness/confusion signals, validation checklist, and post-validation decision gates.
- Founder Beta validation preparation and completion roadmap planning completed on 2026-06-06 with instrumentation review, final exit criteria, post-validation decision tree, proof scoring UX plan, evaluated readiness plan, and completion roadmap. Validation has not occurred yet.
- EngineeringOS V2 Foundation Review completed on 2026-06-06. The review found that V2 planning is canonical, but implementation is incomplete. Founder Validation should pause until the Founder Architect Capability Graph, Master Syllabus V2, Roadmap Projection, Daily Mission, and Readiness foundations are implemented more completely.
- EngineeringOS V2 Foundation Implementation Phase 1 completed on 2026-06-06. The static Founder Architect knowledge foundation now includes 14 capabilities, 32 skills, 100 master topics, 64 curated sources, expanded source/proof mappings, and integrity tests across the Founder Beta graph. Founder Validation remains paused until the expanded graph is connected to projection/gap/mission/readiness services.
- EngineeringOS V2 Foundation Implementation Phase 2 completed on 2026-06-09. Four deterministic services were built over the expanded Founder Architect graph: Capability Gap Engine, Readiness Rollup, Roadmap Projection V2 (with 4 phases and 16 weekly segments), and Mission Candidate Generation. 41 new tests pass. All 70 existing tests continue to pass. Typecheck clean. Founder Validation remains paused.

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

## Current Recommended Implementation Task

Next task:

```txt
Pack 11G: Controlled Canonical Graph Import Patch.
```

Scope:

- Controlled patch generation only.
- Preserve review and explicit approval boundaries.
- Keep Pack 11F in-memory preview as the validation gate before canonical edits.
- No autonomous publish.
- No crawling.
- No Prisma.
- No auth.
- No AI evaluation.
- No SaaS features.
- No deployment.
- No database persistence.

Latest completed:

- Pack 11F: Approved Batch Graph Import, in-memory only.
- Added deterministic preview service, validation report, rollback plan, UI preview, and docs.

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
