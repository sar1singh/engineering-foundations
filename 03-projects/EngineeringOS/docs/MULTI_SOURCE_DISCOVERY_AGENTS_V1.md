# Multi-Source Discovery Agents V1

Status: Pack 12B complete.

Date: 2026-06-13

## Purpose

Pack 12B splits autonomous discovery into source-specific deterministic agents with independent traces.

The agents do not scrape, crawl, call external APIs, approve candidates, publish content, write graph files, or persist state.

## Agents

- AWS Discovery Agent: reads `awsSeeds`.
- System Design Discovery Agent: reads `systemDesignSeeds`.
- Backend Discovery Agent: reads `backendSeeds`.
- Career/Staff Engineering Discovery Agent: reads `careerSeeds`.

Each agent:

- reads only its static seed pack;
- runs candidates through the existing Pack 11B runtime sub-agent pipeline;
- emits an independent source-agent trace;
- returns review-required candidates only;
- reports zero graph writes and zero publish actions.

## Orchestrator

`src/lib/services/multi-source-discovery-orchestrator.ts` exports:

- `runSingleSourceDiscoveryAgent()`
- `runSelectedDiscoveryAgents()`
- `summarizeMultiSourceDiscovery()`
- `deduplicateAcrossAgents()`

The orchestrator runs selected agents deterministically, aggregates per-agent candidates, reports cross-agent duplicate URL warnings, and keeps all graph changes blocked.

## UI

`/founder-beta/autonomous-discovery` now shows:

- source-agent selector;
- Run Selected Agents;
- per-agent candidate counts;
- per-agent independent trace summary;
- cross-agent duplicate warnings;
- review-required candidate cards;
- graph-write count fixed at 0.

No Apply button, approval button, publish button, crawler, browser automation, or persistence path was added.

## Verification

- Focused Pack 12B tests: 24/24 passing.
- `npm run typecheck`: passed.
- `npm run lint`: passed with warnings only.
- `npm run test`: 1131 tests passed; 8 accepted Playwright/Vitest collection failures remain.

## Next

Pack 12C: Autonomous Discovery Review Queue + Batch Patch Bridge.
