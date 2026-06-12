import { describe, it, expect } from "vitest";
import { runMockAgent, runAllMockAgents } from "./agent-runner-service";
import type { AgentRunType } from "@/types/agent-runner";
import type { MasterTopic } from "@/types/founder-beta";
import { simulateAllCandidates } from "./content-ingestion-simulator";
import { MOCK_INGESTION_CANDIDATES } from "@/data/founder-beta/ingestion-mock-candidates";
import {
  createInitialReviewState,
  approveCandidate,
  rejectCandidate,
  needsChangesCandidate,
  resetDecision,
  computeReviewSummary
} from "./content-ingestion-review-session";
import { DEFAULT_AGENT_RUNNER_CONFIG } from "@/types/agent-runner";
import { FounderBetaService } from "./founder-beta-service";

const service = new FounderBetaService();
const capabilities = service.getFounderBetaCapabilities();
const topics = service.getFounderBetaTopics();
const missions = service.getFounderBetaDailyMissions();

// ============================================================
// Part A: Agent Runner → Boundary Assertions → Gate Enforcement
// ============================================================

describe("Phase 8G Part A: Agent Runner → Boundary → Gate Integration", () => {
  it("completes topic-mapping dry-run with valid boundary and pass gate", () => {
    const result = runMockAgent({ agentType: "topic-mapping" });
    expect(result.status).toBe("completed");
    expect(result.boundaryResult.valid).toBe(true);
    expect(result.gateStatus).toBe("pass");
    expect(result.trace.agentType).toBe("topic-mapping");
    expect(result.trace.traceId).toBeTruthy();
    expect(result.trace.steps.length).toBeGreaterThan(0);
  });

  it("completes resource-discovery dry-run with valid boundary and blocked gate", () => {
    const result = runMockAgent({ agentType: "resource-discovery" });
    expect(result.status).toBe("completed");
    expect(result.boundaryResult.valid).toBe(true);
    expect(result.gateStatus).toBe("blocked");
    expect(result.output.candidates.length).toBeGreaterThan(0);
  });

  it("completes quality-review dry-run with valid boundary and pass gate", () => {
    const result = runMockAgent({ agentType: "quality-review" });
    expect(result.status).toBe("completed");
    expect(result.boundaryResult.valid).toBe(true);
    expect(result.gateStatus).toBe("pass");
    expect(result.output.reviews.length).toBeGreaterThan(0);
  });

  it("completes duplicate-detection dry-run with valid boundary and pass gate", () => {
    const result = runMockAgent({ agentType: "duplicate-detection" });
    expect(result.status).toBe("completed");
    expect(result.boundaryResult.valid).toBe(true);
    expect(result.gateStatus).toBe("pass");
    expect(result.output.duplicateAssessments.length).toBeGreaterThan(0);
  });

  it("runAllMockAgents produces all 4 agent results with valid boundaries", () => {
    const results = runAllMockAgents();
    const agentTypes: AgentRunType[] = ["resource-discovery", "topic-mapping", "quality-review", "duplicate-detection"];
    for (const agentType of agentTypes) {
      const result = results[agentType];
      expect(result).toBeDefined();
      expect(result.status).toBe("completed");
      expect(result.boundaryResult.valid).toBe(true);
    }
  });

  it("failOnMissingTopicHint makes resource-discovery fail without topic hint, other agents unaffected", () => {
    const config = { ...DEFAULT_AGENT_RUNNER_CONFIG, failOnMissingTopicHint: true };
    const rd = runMockAgent({ agentType: "resource-discovery" }, config);
    expect(rd.status).toBe("failed");
    const tm = runMockAgent({ agentType: "topic-mapping" }, config);
    expect(tm.status).toBe("completed");
    const qr = runMockAgent({ agentType: "quality-review" }, config);
    expect(qr.status).toBe("completed");
    const dd = runMockAgent({ agentType: "duplicate-detection" }, config);
    expect(dd.status).toBe("completed");
  });

  it("produces deterministic results for same inputs (except traceId)", () => {
    const first = runMockAgent({ agentType: "topic-mapping", topicHint: "aws-architecture", categoryHint: "aws" });
    const second = runMockAgent({ agentType: "topic-mapping", topicHint: "aws-architecture", categoryHint: "aws" });
    expect(first.output.topicMappings[0].topicId).toBe(second.output.topicMappings[0].topicId);
    expect(first.output.topicMappings[0].relevanceScore).toBe(second.output.topicMappings[0].relevanceScore);
  });

  it("output shape matches expected types for all agent types", () => {
    const results = runAllMockAgents();
    expect(results["resource-discovery"].output.candidates.length).toBeGreaterThan(0);
    expect(results["resource-discovery"].output.normalizedItems.length).toBeGreaterThan(0);
    expect(results["topic-mapping"].output.topicMappings.length).toBeGreaterThan(0);
    expect(results["quality-review"].output.reviews.length).toBeGreaterThan(0);
    expect(results["duplicate-detection"].output.duplicateAssessments.length).toBeGreaterThan(0);
  });
});

// ============================================================
// Part B: Ingestion Simulation → Review Session → State Transitions
// ============================================================

describe("Phase 8G Part B: Ingestion Simulation → Review Session → State Transitions", () => {
  const results = simulateAllCandidates(MOCK_INGESTION_CANDIDATES);
  const candidateIds = results.map((r) => r.candidateId);

  it("simulateAllCandidates produces 5 results with valid lifecycle", () => {
    expect(results.length).toBe(5);
    for (const result of results) {
      expect(result.candidateId).toBeTruthy();
      expect(result.lifecycleSteps.length).toBeGreaterThan(0);
      expect(result.label).toBeTruthy();
      expect(result.finalStatus).toBeTruthy();
    }
  });

  it("createInitialReviewState creates null-decision state for all candidates", () => {
    const state = createInitialReviewState(candidateIds);
    for (const id of candidateIds) {
      expect(state[id]).toBeDefined();
      expect(state[id].decision).toBeNull();
    }
  });

  it("approveCandidate transitions state to approved", () => {
    const state = createInitialReviewState(candidateIds);
    const id = candidateIds[0];
    const updated = approveCandidate(state, id);
    expect(updated[id].decision).toBe("approved");
  });

  it("rejectCandidate transitions state with rejection reason", () => {
    const state = createInitialReviewState(candidateIds);
    const id = candidateIds[0];
    const reason = "Duplicate content";
    const updated = rejectCandidate(state, id, reason);
    expect(updated[id].decision).toBe("rejected");
    expect(updated[id].rejectionReason).toBe(reason);
  });

  it("needsChangesCandidate transitions state to needs-changes", () => {
    const state = createInitialReviewState(candidateIds);
    const id = candidateIds[0];
    const updated = needsChangesCandidate(state, id);
    expect(updated[id].decision).toBe("needs-changes");
  });

  it("resetDecision reverts to null-decision after approve", () => {
    const state = createInitialReviewState(candidateIds);
    const id = candidateIds[0];
    const approved = approveCandidate(state, id);
    const reset = resetDecision(approved, id);
    expect(reset[id].decision).toBeNull();
    expect(reset[id].rejectionReason).toBe("");
  });

  it("computeReviewSummary reflects all decisions", () => {
    const state = createInitialReviewState(candidateIds);
    const a = approveCandidate(state, candidateIds[0]);
    const b = rejectCandidate(a, candidateIds[1], "Low quality");
    const c = needsChangesCandidate(b, candidateIds[2]);
    const summary = computeReviewSummary(c);
    expect(summary.total).toBe(5);
    expect(summary.approved).toBe(1);
    expect(summary.rejected).toBe(1);
    expect(summary.needsChanges).toBe(1);
    expect(summary.pending).toBe(2);
  });

  it("initial review summary has all pending", () => {
    const state = createInitialReviewState(candidateIds);
    const summary = computeReviewSummary(state);
    expect(summary.total).toBe(5);
    expect(summary.pending).toBe(5);
    expect(summary.approved).toBe(0);
    expect(summary.rejected).toBe(0);
    expect(summary.needsChanges).toBe(0);
  });
});

// ============================================================
// Part C: Topic → Resources → Missions Data Pipeline
// ============================================================

describe("Phase 8G Part C: Topic → Resources → Missions Data Pipeline", () => {
  const firstCap = capabilities[0];
  const capTopics: MasterTopic[] = firstCap.id
    ? service.getTopicsByCapabilityId(firstCap.id)
    : [];

  it("getTopicsByCapabilityId returns topics with source mappings", () => {
    const tid0 = capabilities[0].id;
    expect(tid0).toBeTruthy();
    const topics = service.getTopicsByCapabilityId(tid0);
    expect(topics.length).toBeGreaterThan(0);
    for (const topic of topics) {
      expect(topic.sourceIds.length).toBeGreaterThan(0);
      const sources = service.getSourcesForTopic(topic.id);
      expect(sources.length).toBeGreaterThan(0);
    }
  });

  it("getSourcesForTopic returns valid sources with metadata", () => {
    if (capTopics.length > 0) {
      const topic = capTopics[0];
      const sources = service.getSourcesForTopic(topic.id);
      for (const source of sources) {
        expect(source.id).toBeTruthy();
        expect(source.title).toBeTruthy();
        expect(source.sourceType).toBeTruthy();
        expect(source.tier).toBeTruthy();
      }
    }
  });

  it("getMissionsByTopicId returns missions with readiness impact", () => {
    if (capTopics.length > 0) {
      const topic = capTopics[0];
      const topicMissions = service.getMissionsByTopicId(topic.id);
      for (const mission of topicMissions) {
        expect(mission.id).toBeTruthy();
        expect(mission.objective).toBeTruthy();
        expect(mission.missionType).toBeTruthy();
      }
    }
  });

  it("topic data flows through capability → skill → topic → sources chain deterministically", () => {
    for (const cap of capabilities) {
      if (!cap.id) continue;
      const skillIds = service.getSkillsByCapabilityId(cap.id);
      const topics = service.getTopicsByCapabilityId(cap.id);
      expect(skillIds.length).toBeGreaterThanOrEqual(1);
      expect(topics.length).toBeGreaterThanOrEqual(1);
      for (const topic of topics) {
        const sources = service.getSourcesForTopic(topic.id);
        expect(sources.length).toBeGreaterThanOrEqual(1);
      }
    }
  });
});
