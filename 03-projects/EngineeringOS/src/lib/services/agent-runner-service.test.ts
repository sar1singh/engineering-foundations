import { describe, it, expect } from "vitest";
import { runMockAgent, runAllMockAgents } from "./agent-runner-service";
import type { AgentRunRequest } from "@/types/agent-runner";

describe("agent-runner-service", () => {
  describe("runMockAgent - resource-discovery", () => {
    const request: AgentRunRequest = {
      agentType: "resource-discovery",
      topicHint: "aws-architecture",
      categoryHint: "aws"
    };

    const result = runMockAgent(request);

    it("completes successfully", () => {
      expect(result.status).toBe("completed");
    });

    it("returns a trace with traceId and steps", () => {
      expect(result.trace.traceId).toBeTruthy();
      expect(result.trace.agentType).toBe("resource-discovery");
      expect(result.trace.steps.length).toBeGreaterThan(0);
      expect(result.trace.durationMs).toBeGreaterThanOrEqual(0);
    });

    it("generates mock candidates with attribution", () => {
      expect(result.output.candidates.length).toBe(2);
      for (const c of result.output.candidates) {
        expect(c.attribution).toBeTruthy();
        expect(c.attribution!.agentId).toBe("mock-discovery-agent-v1");
        expect(c.discoveryMethod).toBe("agent-discovery");
      }
    });

    it("generates normalized items", () => {
      expect(result.output.normalizedItems.length).toBe(2);
      expect(result.output.normalizedItems[0].rawCandidateId).toBe(result.output.candidates[0].id);
    });

    it("passes structural boundary assertions", () => {
      expect(result.boundaryResult.valid).toBe(true);
    });

    it("publish gate is blocked (discovered -> published)", () => {
      expect(result.gateStatus).toBe("blocked");
    });

    it("includes topicHint in candidate tags", () => {
      expect(result.output.candidates[0].tags).toContain("aws-architecture");
    });
  });

  describe("runMockAgent - topic-mapping", () => {
    const result = runMockAgent({ agentType: "topic-mapping" });

    it("completes successfully", () => {
      expect(result.status).toBe("completed");
    });

    it("generates topic mappings", () => {
      expect(result.output.topicMappings.length).toBe(1);
      expect(result.output.topicMappings[0].topicId).toBe("topic-hld-fundamentals");
    });

    it("has valid topic mapping candidates", () => {
      const mapping = result.output.topicMappings[0];
      expect(mapping.capabilityIds.length).toBeGreaterThan(0);
      expect(mapping.skillIds.length).toBeGreaterThan(0);
      expect(mapping.relevanceScore).toBeGreaterThan(0);
    });

    it("passes structural boundary assertions", () => {
      expect(result.boundaryResult.valid).toBe(true);
    });

    it("has no candidates (topic-mapping does not discover)", () => {
      expect(result.output.candidates.length).toBe(0);
    });

    it("publish gate passes (no candidates to publish)", () => {
      expect(result.gateStatus).toBe("pass");
    });
  });

  describe("runMockAgent - quality-review", () => {
    const result = runMockAgent({ agentType: "quality-review" });

    it("completes successfully", () => {
      expect(result.status).toBe("completed");
    });

    it("generates a quality review", () => {
      expect(result.output.reviews.length).toBe(1);
      expect(result.output.reviews[0].passed).toBe(true);
      expect(result.output.reviews[0].overallScore).toBeGreaterThan(0);
    });

    it("passes structural boundary assertions", () => {
      expect(result.boundaryResult.valid).toBe(true);
    });
  });

  describe("runMockAgent - duplicate-detection", () => {
    const result = runMockAgent({ agentType: "duplicate-detection" });

    it("completes successfully", () => {
      expect(result.status).toBe("completed");
    });

    it("generates a duplicate assessment", () => {
      expect(result.output.duplicateAssessments.length).toBe(1);
      expect(result.output.duplicateAssessments[0].similarityScore).toBeLessThan(0.5);
    });

    it("passes structural boundary assertions", () => {
      expect(result.boundaryResult.valid).toBe(true);
    });
  });

  describe("runAllMockAgents", () => {
    const results = runAllMockAgents("system-design", "hld");

    it("returns results for all four agent types", () => {
      expect(Object.keys(results).sort()).toEqual([
        "duplicate-detection",
        "quality-review",
        "resource-discovery",
        "topic-mapping"
      ]);
    });

    it("each result completes", () => {
      for (const [type, result] of Object.entries(results)) {
        expect(result.status).toBe("completed");
        expect(result.trace.agentType).toBe(type);
      }
    });

    it("resource-discovery receives topic hint", () => {
      const rd = results["resource-discovery"];
      expect(rd.output.candidates[0].tags).toContain("system-design");
    });

    it("all traces have unique traceIds", () => {
      const traceIds = Object.values(results).map((r) => r.trace.traceId);
      expect(new Set(traceIds).size).toBe(4);
    });

    it("only resource-discovery has blocked gate", () => {
      expect(results["resource-discovery"].gateStatus).toBe("blocked");
      expect(results["topic-mapping"].gateStatus).toBe("pass");
      expect(results["quality-review"].gateStatus).toBe("pass");
      expect(results["duplicate-detection"].gateStatus).toBe("pass");
    });
  });

  describe("config - failOnMissingTopicHint", () => {
    it("fails resource-discovery when topicHint is missing and config requires it", () => {
      const result = runMockAgent(
        { agentType: "resource-discovery" },
        { simulateLatencyMs: 0, failOnMissingTopicHint: true }
      );
      expect(result.status).toBe("failed");
      expect(result.trace.steps.some((s) => s.includes("topicHint"))).toBe(true);
    });

    it("does not fail for non-discovery agents with failOnMissingTopicHint", () => {
      for (const agentType of ["topic-mapping", "quality-review", "duplicate-detection"] as const) {
        const result = runMockAgent(
          { agentType },
          { simulateLatencyMs: 0, failOnMissingTopicHint: true }
        );
        expect(result.status).toBe("completed");
      }
    });
  });

  describe("publish gate enforcement", () => {
    it("blocks when candidates exist (discovered -> published)", () => {
      const result = runMockAgent({ agentType: "resource-discovery", topicHint: "testing" });
      expect(result.gateStatus).toBe("blocked");
      expect(result.boundaryResult.valid).toBe(true);
    });

    it("passes when no candidates exist", () => {
      const result = runMockAgent({ agentType: "quality-review" });
      expect(result.gateStatus).toBe("pass");
    });
  });

  describe("edge cases", () => {
    it("generates warnings when no topicHint is provided for resource-discovery", () => {
      const result = runMockAgent({ agentType: "resource-discovery" });
      expect(result.output.warnings.length).toBeGreaterThan(0);
      expect(result.output.warnings[0].toLowerCase()).toContain("topic hint");
    });

    it("empty output arrays for non-matching agent types", () => {
      const result = runMockAgent({ agentType: "quality-review" });
      expect(result.output.candidates).toEqual([]);
      expect(result.output.normalizedItems).toEqual([]);
      expect(result.output.topicMappings).toEqual([]);
      expect(result.output.duplicateAssessments).toEqual([]);
    });
  });
});
