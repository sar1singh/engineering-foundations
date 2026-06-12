# Runtime Agent Boundary Plan V1

Date: 2026-06-10

## Purpose

Define the hard boundaries and guardrails for any future runtime agent execution in EngineeringOS. This is a **pure planning document** — no runtime agents are implemented. All boundary rules are enforced by deterministic, side-effect-free validation helpers that can be tested independently of any agent runtime.

## Core Principle

**Agents produce typed outputs. Humans make publish decisions. The boundary between them is enforced by contract, not by trust.**

## 1. What Runtime Agents May Do Later

When runtime agents are eventually implemented, they will be permitted to:

| Activity | Condition | Validation Gate |
|----------|-----------|-----------------|
| Discover URLs from approved sources | Source must be in the catalog with `tier-1` or `tier-2` trust level | `validateAgentDiscoveryOutput` |
| Produce `RawContentCandidate[]` at `discovered` status | Must include `AgentAttribution` when `discoveryMethod === "agent-discovery"` | `validateAttribution` |
| Assess duplicate risk | Must produce valid `DuplicateRiskAssessment` with score in 0-1 range and agent identity | `validateDuplicateRisk` |
| Propose topic mappings | Must pass `validateTopicMappingCandidate` against the capability/skill registry | `validateTopicMappingCandidate` |
| Produce source mappings | Must reference known catalog source IDs or flag new sources | `validateSourceMappingCandidate` |
| Score content quality | Must produce `ContentQualityReview` with all 4 dimension scores and overall | `evaluateContentQuality` |
| Read the source catalog | Read-only access to existing seed data and registry | N/A (read is safe) |
| Read the capability/skill registry | Read-only access for mapping validation | N/A (read is safe) |

All outputs must be **deterministic, typed, and validatable** before entering the human review queue.

## 2. What Runtime Agents Must Never Do

### Hard Prohibitions (enforced by `assertValidAgentBoundary`)

| Prohibition | Rationale | Enforcement |
|-------------|-----------|-------------|
| Never create a `ContentApprovalDecision` | Only human reviewers can approve or reject | `assertNoAutonomousWrite` |
| Never transition to `published` status | The publish boundary is a hard human gate | `assertAgentCannotPublish` |
| Never transition directly from `discovered`/`normalized`/`mapped` to `published` | Must pass through human review | `assertAgentCannotPublish` |
| Never skip the quality review stage | Quality review must produce a `passed` result before human approval | `determineApprovalReadiness` |
| Never write to the content registry | Agents are stateless producers, not persistence writers | Architectural constraint |
| Never modify existing published content | Publishing is a human-only action with audit trail | Architectural constraint |
| Never access the file system or database | Agents have no persistence access | Architectural constraint |
| Never execute external API calls autonomously | All external calls must be triggered by a human-initiated batch | Architectural constraint |
| Never deploy, migrate, or change infrastructure | Infrastructure changes are out-of-scope for all agent types | Architectural constraint |

### Soft Prohibitions (enforced by warnings)

| Prohibition | Rationale |
|-------------|-----------|
| Never produce empty tags | Tagless candidates always require human approval |
| Never bypass attribution for agent-discovered candidates | Attribution is required for audit traceability |
| Never set `passed: true` when `overallScore < 0.6` | Quality review consistency rule |

## 3. Allowed Inputs

Runtime agents may read from:

| Input | Access Pattern | Example |
|-------|---------------|---------|
| Source catalog | In-memory seed data import | `founderBetaSourceCatalog` |
| Capability/skill registry | In-memory seed data import | `founderBetaCapabilities`, `founderBetaSkills` |
| Candidate URL content | HTTP fetch (batch-triggered, not autonomous) | Blog post URL for quality scoring |
| Existing content index | Read-only in-memory set of published item checksums | Duplicate detection |
| Agent configuration | Static JSON/config passed at invocation time | Agent version, trace ID, thresholds |

## 4. Allowed Outputs

Runtime agents may produce:

| Output | Type | Destination |
|--------|------|-------------|
| Discovered candidates | `RawContentCandidate[]` | Human review queue (in-memory) |
| Duplicate risk assessments | `DuplicateRiskAssessment` | Attached to candidate (in-memory) |
| Topic mapping proposals | `TopicMappingCandidate[]` | Human review queue (in-memory) |
| Source mapping proposals | `SourceMappingCandidate[]` | Human review queue (in-memory) |
| Quality reviews | `ContentQualityReview` | Human review queue (in-memory) |
| Validation errors/warnings | `ValidationResult` | Returned to caller for UI display |

## 5. Human Approval Gate

The human approval gate is defined by `assertHumanApprovalRequired` and `validateHumanApprovalRequired`:

### Conditions Requiring Human Approval

A candidate **requires** human approval when ANY of these are true:

1. `estimatedConfidence < 0.4` — low confidence in agent discovery
2. `duplicateRisk.similarityScore >= 0.7` — high overlap with existing content
3. `tags.length === 0` — no classification tags assigned

### Human Approval Flow

```
discovered → normalized → mapped → reviewed → [HUMAN GATE] → approved → published
```

The human reviewer:
1. Reviews the candidate, mappings, and quality scores
2. Makes a decision via `ContentApprovalDecision`
3. Must provide a `reason` when rejecting
4. May add mapping overrides (topic/source type/field/value)

### Auto-Approval Path

A candidate may skip the human gate (auto-approved) when ALL of these are true:

1. `estimatedConfidence >= 0.4`
2. No duplicate risk or `similarityScore < 0.7`
3. At least one tag assigned
4. `determineApprovalReadiness` returns `valid: true`

Even auto-approved candidates still pass through the publish boundary gate.

## 6. Publish Boundary

The publish boundary is defined by `assertAgentCannotPublish` and `validateAgentCannotPublishDirectly`:

### Blocked Transitions

| From | To | Reason |
|------|----|--------|
| `discovered` | `published` | Skips all validation and review |
| `discovered` | `approved` | Skips normalization, mapping, and review |
| `normalized` | `published` | Skips mapping and review |
| `mapped` | `published` | Skips review |

### Allowed Transition Path

```
discovered → normalized → mapped → reviewed → approved → published
```

### Enforcement

Every transition attempt from any agent output must pass `assertAgentCannotPublish(from, to)`. If the transition is in the blocked set, the agent output is rejected with an error message specifying which boundary was violated.

## 7. Audit Requirements

Every agent action must be traceable:

| Audit Field | Source | Required For |
|-------------|--------|-------------|
| `agentId` | AgentAttribution | All agent-discovered candidates |
| `agentVersion` | AgentAttribution | All agent-discovered candidates |
| `agentTraceId` | AgentAttribution → RawContentCandidate | End-to-end trace through pipeline |
| `discoveredAt` | AgentAttribution | Timestamp of discovery |
| `sourceUrl` | AgentAttribution | Source of the discovered content |
| `extractionMethod` | AgentAttribution | How content was sourced |
| `rawMetadata` | AgentAttribution | Free-form discovery context |

## 8. Failure Handling

### Validation Failures

When a boundary assertion fails:

1. The agent output is rejected with a `ValidationResult` containing specific error messages
2. The candidate does not enter the review queue
3. The error is returned to the caller (simulator or batch runner)
4. No partial state is persisted

### Transition Failures

When an invalid transition is attempted:

1. `assertAgentCannotPublish` returns `valid: false` with error description
2. The candidate status is not changed
3. The agent must correct its output before retrying

### Quality Review Failures

When quality review scores are inconsistent:

1. `evaluateContentQuality` returns warnings for score/passed mismatches
2. `determineApprovalReadiness` returns `valid: false` if minimum thresholds are not met
3. The candidate stays in `reviewed` status until issues are resolved

## 9. Rollback Expectations

Since no agent output is ever persisted autonomously:

| Scenario | Rollback Action |
|----------|----------------|
| Agent produced bad output | Reject candidate, clear from review queue |
| Duplicate risk assessment was wrong | Re-assess with corrected parameters |
| Topic mapping was incorrect | Human adds mapping override in review UI |
| Quality score was inaccurate | Human can override by rejecting or requesting changes |
| Candidate should not have been discovered | Remove from review queue, no further action needed |

Rollback is inherent in the in-memory review queue — there is no persistence to undo.

## 10. Architectural Impact Summary

### Components That Do NOT Need Changes

- Content registry (no agent writes to it)
- Source catalog seed data (agents only read it)
- Capability/skill registry (agents only read it)
- Persistence layer (agents never access it)
- Approval workflow state machine (already enforces valid transitions)

### Components That Would Need Changes WHEN Agents Are Built

- A batch runner to invoke agents on a schedule or trigger
- An agent configuration store (static config files or env vars)
- A read-only content index for duplicate detection (in-memory set of checksums)
- An error/retry mechanism for transient failures

## 11. Boundary Assertion Reference

| Assertion | File | Purpose |
|-----------|------|---------|
| `assertHumanApprovalRequired` | `content-ingestion-contracts.ts` | Returns ValidationResult explaining why human approval is needed |
| `assertAgentCannotPublish` | `content-ingestion-contracts.ts` | Blocks direct transitions to published/approved from early states |
| `assertNoAutonomousWrite` | `content-ingestion-contracts.ts` | Prevents agents from creating approval decisions |
| `assertValidAgentBoundary` | `content-ingestion-contracts.ts` | Comprehensive check combining all boundary rules |

## 12. Relevant Files

- `src/types/content-ingestion.ts` — All agent-related types (AgentAttribution, DuplicateRiskAssessment, RawContentCandidate extensions)
- `src/lib/services/content-ingestion-contracts.ts` — Boundary assertion helpers (assertHumanApprovalRequired, assertAgentCannotPublish, assertNoAutonomousWrite, assertValidAgentBoundary)
- `src/lib/services/content-ingestion-contracts.ts` — Existing validation helpers (validateAgentDiscoveryOutput, validateDuplicateRisk, validateHumanApprovalRequired, validateAttribution, validateAgentCannotPublishDirectly)
- `src/lib/services/content-ingestion-agent-validation.test.ts` — Tests for all agent boundary assertions and validations
- `docs/AGENT_DISCOVERY_ARCHITECTURE_V1.md` — Agent architecture reference
- `docs/AGENT_CONTENT_DISCOVERY_CONTRACTS_V1.md` — Agent output contract reference
- `docs/CONTENT_APPROVAL_WORKFLOW_V1.md` — State machine and approval gates
