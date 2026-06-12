# Agent Runner Dry-Run Interface V1

Date: 2026-06-10

## Purpose

Define the dry-run mock agent runner interface (`src/types/agent-runner.ts` + `src/lib/services/agent-runner-service.ts`) that simulates agent execution without any runtime. The runner produces typed mock output, runs boundary assertions against it, and reports gate status — all in a single synchronous, side-effect-free call.

## Design Principles

1. **No runtime execution.** The mock agent runner generates deterministic mock output. No URLs are fetched, no content is scraped, no autonomous decisions are made.
2. **Boundary assertions always run.** Every dry-run result includes a `boundaryResult` (structural validation) and `gateStatus` (publish gate enforcement).
3. **Session-only.** No writes, no persistence, no side effects.
4. **Deterministic per input.** Given the same `AgentRunRequest`, the runner produces the same `AgentRunResult` (trace IDs and timestamps vary by design).

## Type Definitions

See `src/types/agent-runner.ts`:

| Type | Description |
|------|-------------|
| `AgentRunType` | `"resource-discovery"`, `"topic-mapping"`, `"quality-review"`, `"duplicate-detection"` |
| `AgentRunRequest` | Input: `agentType`, optional `topicHint`, optional `categoryHint` |
| `AgentRunResult` | Output: `trace`, `status`, `boundaryResult`, `gateStatus`, `output` |
| `AgentRunTrace` | Execution metadata: `traceId`, `agentType`, `startedAt`, `completedAt`, `durationMs`, `steps` |
| `AgentRunOutput` | Typed output container: `candidates[]`, `topicMappings[]`, `reviews[]`, `duplicateAssessments[]`, `normalizedItems[]`, `warnings[]` |
| `AgentRunnerConfig` | Configuration: `simulateLatencyMs`, `failOnMissingTopicHint` |
| `AgentRunStatus` | `"pending"`, `"running"`, `"completed"`, `"failed"` |

## Exported Functions

### `runMockAgent(request, config?)`

Runs a single mock agent and returns a typed `AgentRunResult`.

Behavior by agent type:

| Agent Type | Output Produced | Boundary Assertions | Publish Gate |
|------------|----------------|-------------------|--------------|
| `resource-discovery` | 2 `RawContentCandidate[]` with full `AgentAttribution`, 2 `NormalizedContentItem[]` | Candidate structure, attribution, human-approval check | Blocked (candidates must pass review) |
| `topic-mapping` | 1 `TopicMappingCandidate[]` | None (no candidates to validate) | Pass |
| `quality-review` | 1 `ContentQualityReview` | Review structure and score bounds | Pass |
| `duplicate-detection` | 1 `DuplicateRiskAssessment` | Assessment structure and score bounds | Pass |

### `runAllMockAgents(topicHint?, categoryHint?, config?)`

Runs all four agent types in sequence. Returns a `Record<AgentRunType, AgentRunResult>`.

## Boundary Assertions

The `runBoundaryAssertions` internal function separates two concerns:

1. **Structural validation** (returned as `boundaryResult`): Checks candidate format, attribution metadata, review scores, duplicate risk format. If any structural check fails, `boundaryResult.valid` is `false`.
2. **Publish gate** (returned as `gateStatus`): Checks whether the output can proceed directly to `published`. Always `"blocked"` when candidates exist (agent-discovered content must pass through human review).

## Integration

The dry-run UI is rendered by the `AgentRunnerPreview` component (`src/components/founder-beta/AgentRunnerPreview.tsx`) on the agent-discovery-preview page. Users select an agent type, optionally provide topic/category hints, and click "Run" to see:

- Execution trace (steps, duration)
- Status (completed / failed)
- Publish gate result (pass / blocked)
- Structure validation result (errors / warnings)
- Typed output per agent type (candidates, mappings, reviews, assessments)

## Configuration

`AgentRunnerConfig` fields:

| Field | Default | Description |
|-------|---------|-------------|
| `simulateLatencyMs` | `0` | Simulated execution delay (not implemented — reserved for future use) |
| `failOnMissingTopicHint` | `false` | If `true`, `resource-discovery` fails when `topicHint` is not provided |

## Testing

30 tests in `src/lib/services/agent-runner-service.test.ts` covering:

- Each agent type runs and produces correct output
- Structural boundary assertions pass for valid output
- Publish gate is blocked when candidates exist, passes when none
- `failOnMissingTopicHint` config works correctly (only for `resource-discovery`)
- `runAllMockAgents` returns all four types with unique traces
- Edge cases (missing hints, empty output arrays)
