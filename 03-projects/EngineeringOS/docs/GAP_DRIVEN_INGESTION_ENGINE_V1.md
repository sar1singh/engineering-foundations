# Gap-Driven Ingestion Engine V1

**Pack 13A — Gap-Driven Ingestion Engine + Syllabus Gap Sub-Agents** (2026-06-13)

## Purpose

Agents should stop importing arbitrary content. They should first detect syllabus gaps, rank them, and decide what content should be ingested next.

This engine provides the gap detection, scoring, prioritization, agent routing, seed matching, and plan building infrastructure. It performs no writes and requires human approval for every candidate.

## Architecture

### Gap Types (10 types)

| Type | Description |
|------|-------------|
| `low-source-topic` | Topic has fewer than 2 source references |
| `no-source-topic` | Topic has zero source references |
| `weak-skill-coverage` | Skill has fewer than 2 associated topics |
| `weak-capability-coverage` | Capability has fewer than 2 associated skills |
| `missing-proof-path` | Topic or capability has insufficient proof types |
| `missing-mission-path` | Topic has no associated daily mission |
| `weak-interview-coverage` | High-interview-importance topic has low confidence |
| `weak-readiness-coverage` | Topic missing readiness dimensions |
| `weak-source-diversity` | Topic sources come from too few source types |
| `stale-or-low-confidence-topic` | Topic confidence score below 0.7 |

### Sub-Agents (6 agents)

Each agent lives in `src/lib/services/gap-agents/` and follows a pure function pattern:

1. **Coverage Gap Agent** (`coverage-gap-agent.ts`) — Detects weak topic/skill/capability coverage
2. **Source Diversity Agent** (`source-diversity-agent.ts`) — Detects topics relying on too few source types
3. **Proof Coverage Agent** (`proof-coverage-agent.ts`) — Detects missing proofTypes or weak proof paths
4. **Mission Coverage Agent** (`mission-coverage-agent.ts`) — Detects topics with no mission path
5. **Interview Coverage Agent** (`interview-coverage-agent.ts`) — Detects weak interview readiness coverage
6. **Readiness Coverage Agent** (`readiness-coverage-agent.ts`) — Detects weak readiness mapping and low confidence

### Orchestrator Functions

All functions in `src/lib/services/gap-driven-ingestion-engine.ts`:

- `runGapSubAgents()` — Runs all 6 sub-agents, returns combined results + traces
- `discoverKnowledgeGraphGaps()` — Convenience wrapper for all gaps
- `scoreKnowledgeGraphGap()` — Assigns priority score to a single gap
- `prioritizeKnowledgeGraphGaps()` — Sorts gaps by priority score descending
- `routeGapToDiscoveryAgent()` — Routes a gap to the appropriate discovery agent (AWS, System Design, Backend, Career, Security)
- `matchSeedsToGap()` — Finds matching discovery seeds for a gap using tag/keyword scoring
- `buildGapDrivenIngestionPlan()` — Builds a complete ingestion plan from prioritized gaps and seed matches
- `summarizeGapDrivenPlan()` — Produces a human-readable summary of the plan

### Agent Routing

| Gap Domain | Recommended Agent |
|------------|-------------------|
| AWS / Cloud | AWS Discovery Agent |
| System Design / HLD / Architecture | System Design Discovery Agent |
| Backend / Node / Database | Backend Discovery Agent |
| Career / Behavioral / Leadership | Career Discovery Agent |
| Security | Security Discovery Agent (Backend fallback) |
| Unknown | Backend Discovery Agent |

### Seed Matching

Uses existing discovery seed packs from `src/data/discovery-seeds/`:
- Tag-based matching (seed tags vs gap keywords)
- Title overlap scoring
- Category domain bonus scores
- Minimum match score threshold of 5

### Safety Rules

- All candidates have `reviewRequired: true`
- No canonical graph writes
- No autonomous approval
- No persistence
- No API calls

## Files Created

- `src/types/gap-driven-ingestion.ts` — 7 types/10 gap type constants
- `src/lib/services/gap-agents/coverage-gap-agent.ts` — Coverage gap detection
- `src/lib/services/gap-agents/source-diversity-agent.ts` — Source diversity gap detection
- `src/lib/services/gap-agents/proof-coverage-agent.ts` — Proof gap detection
- `src/lib/services/gap-agents/mission-coverage-agent.ts` — Mission gap detection
- `src/lib/services/gap-agents/interview-coverage-agent.ts` — Interview gap detection
- `src/lib/services/gap-agents/readiness-coverage-agent.ts` — Readiness/low-confidence gap detection
- `src/lib/services/gap-driven-ingestion-engine.ts` — Orchestrator with 8 exported functions
- `src/components/founder-beta/GapDrivenIngestionPreview.tsx` — Preview UI component
- `src/app/founder-beta/gap-driven-ingestion/page.tsx` — Route page
- `src/lib/services/gap-driven-ingestion-engine.test.ts` — 24 engine tests
- `src/components/founder-beta/GapDrivenIngestionPreview.test.tsx` — 10 component tests

## Test Counts

- 24 engine tests (5 sub-agent, 2 discovery, 2 scoring, 3 prioritization, 3 routing, 3 seed matching, 6 plan building, 2 summary, 2 no-write)
- 10 component tests (heading, warning, traces, summary, stats, agents, gaps, badges, description)
- Total new: 34 tests
- 0 regressions

## Verification

- `npm run typecheck` — 0 errors
- `npm run lint` — 0 errors in new files
- `npm run test` — All 34 new tests pass

## Next Phase (Recommended)

**Pack 13B — Autonomous Gap Resolution Wave 1**

Take top-ranked gaps from this engine and perform a small approved import batch.
