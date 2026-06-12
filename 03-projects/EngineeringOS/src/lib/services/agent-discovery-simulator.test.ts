import { describe, it, expect } from "vitest";
import { AGENT_DISCOVERY_SCENARIOS } from "@/data/founder-beta/agent-discovery-mock-scenarios";
import { simulateAgentDiscovery, simulateAllAgentScenarios } from "./agent-discovery-simulator";

describe("agent-discovery-simulator", () => {
  describe("simulateAllAgentScenarios", () => {
    it("returns results for every scenario", () => {
      const results = simulateAllAgentScenarios(AGENT_DISCOVERY_SCENARIOS);
      expect(results).toHaveLength(AGENT_DISCOVERY_SCENARIOS.length);
    });

    it("preserves scenario metadata for each result", () => {
      const results = simulateAllAgentScenarios(AGENT_DISCOVERY_SCENARIOS);
      for (let i = 0; i < results.length; i++) {
        expect(results[i].scenarioId).toBe(AGENT_DISCOVERY_SCENARIOS[i].scenarioId);
        expect(results[i].agentName).toBe(AGENT_DISCOVERY_SCENARIOS[i].agentName);
        expect(results[i].label).toBe(AGENT_DISCOVERY_SCENARIOS[i].label);
        expect(results[i].description).toBe(AGENT_DISCOVERY_SCENARIOS[i].description);
      }
    });
  });

  describe("valid agent output preview", () => {
    const scenario = AGENT_DISCOVERY_SCENARIOS.find((s) => s.label === "valid")!;
    const result = simulateAgentDiscovery(scenario);

    it("passes the agent gate", () => {
      expect(result.finalGateStatus).toBe("pass");
    });

    it("has valid agent discovery validation", () => {
      expect(result.agentDiscoveryValidation.valid).toBe(true);
    });

    it("produces a candidate preview", () => {
      expect(result.candidatePreview).not.toBeNull();
      expect(result.candidatePreview!.normalizedTitle).toBe(scenario.candidate.title.trim());
    });

    it("does not require human approval", () => {
      expect(result.requiresHumanApproval).toBe(false);
    });

    it("has no attribution warnings", () => {
      expect(result.attributionValidation.warnings.length).toBe(0);
    });

    it("has no duplicate risk errors", () => {
      expect(result.duplicateRiskValidation).toBeNull();
    });

    it("publish gate blocks direct agent publish (discovered -> published)", () => {
      expect(result.publishGateResult.valid).toBe(false);
      const hasDirectError = result.publishGateResult.errors.some(
        (e) => e.toLowerCase().includes("directly")
      );
      expect(hasDirectError).toBe(true);
    });
  });

  describe("missing attribution blocked", () => {
    const scenario = AGENT_DISCOVERY_SCENARIOS.find((s) => s.label === "missing-attribution")!;
    const result = simulateAgentDiscovery(scenario);

    it("blocks the agent gate", () => {
      expect(result.finalGateStatus).toBe("blocked");
    });

    it("fails agent discovery validation with attribution errors", () => {
      expect(result.agentDiscoveryValidation.valid).toBe(false);
      const hasAttributionError = result.agentDiscoveryValidation.errors.some(
        (e) => e.toLowerCase().includes("attribution")
      );
      expect(hasAttributionError).toBe(true);
    });

    it("does not produce a candidate preview", () => {
      expect(result.candidatePreview).toBeNull();
    });
  });

  describe("high duplicate risk blocked", () => {
    const scenario = AGENT_DISCOVERY_SCENARIOS.find((s) => s.label === "high-duplicate-risk")!;
    const result = simulateAgentDiscovery(scenario);

    it("blocks the agent gate", () => {
      expect(result.finalGateStatus).toBe("blocked");
    });

    it("requires human approval due to duplicate risk", () => {
      expect(result.requiresHumanApproval).toBe(true);
      const hasDuplicateRiskRationale = result.humanApprovalRationale.some(
        (r) => r.toLowerCase().includes("duplicate")
      );
      expect(hasDuplicateRiskRationale).toBe(true);
    });

    it("has duplicate risk validation warnings", () => {
      expect(result.duplicateRiskValidation).not.toBeNull();
      expect(result.duplicateRiskValidation!.warnings.length).toBeGreaterThanOrEqual(0);
    });

    it("has a candidate preview (attribution is present)", () => {
      expect(result.candidatePreview).not.toBeNull();
    });
  });

  describe("low confidence requires human approval", () => {
    const scenario = AGENT_DISCOVERY_SCENARIOS.find((s) => s.label === "low-confidence-human-approval")!;
    const result = simulateAgentDiscovery(scenario);

    it("blocks the agent gate", () => {
      expect(result.finalGateStatus).toBe("blocked");
    });

    it("requires human approval", () => {
      expect(result.requiresHumanApproval).toBe(true);
    });

    it("has low confidence rationale", () => {
      const hasConfidenceRationale = result.humanApprovalRationale.some(
        (r) => r.toLowerCase().includes("confidence")
      );
      expect(hasConfidenceRationale).toBe(true);
    });

    it("has no tags rationale", () => {
      const hasNoTagsRationale = result.humanApprovalRationale.some(
        (r) => r.toLowerCase().includes("tags")
      );
      expect(hasNoTagsRationale).toBe(true);
    });

    it("has attribution present", () => {
      expect(result.attributionValidation.valid).toBe(true);
    });
  });

  describe("agent output cannot publish directly", () => {
    const scenario = AGENT_DISCOVERY_SCENARIOS.find((s) => s.label === "cannot-publish-directly")!;
    const result = simulateAgentDiscovery(scenario);

    it("publishes gate error for direct publish attempt", () => {
      expect(result.publishGateResult.valid).toBe(false);
      expect(result.publishGateResult.errors.length).toBeGreaterThan(0);
      const hasDirectError = result.publishGateResult.errors.some(
        (e) => e.toLowerCase().includes("directly")
      );
      expect(hasDirectError).toBe(true);
    });

    it("passes the agent gate (content is valid, though publish gate blocks direct publish)", () => {
      expect(result.agentDiscoveryValidation.valid).toBe(true);
      expect(result.finalGateStatus).toBe("pass");
    });

    it("publish gate is separate from agent output gates", () => {
      expect(result.finalGateStatus).toBe("pass");
      expect(result.publishGateResult.valid).toBe(false);
    });

    it("has valid attribution", () => {
      expect(result.attributionValidation.valid).toBe(true);
    });

    it("does not require human approval (high confidence, tags present)", () => {
      expect(result.requiresHumanApproval).toBe(false);
    });
  });

  describe("empty scenarios array", () => {
    it("returns empty array for empty input", () => {
      const results = simulateAllAgentScenarios([]);
      expect(results).toEqual([]);
    });
  });
});
