import { describe, it, expect } from "vitest";
import { runAdaptiveDomainAgent, runMultiDomainAdaptiveDiscovery } from "./adaptive-domain-agent-runner";
import type { SyllabusGap } from "@/types/gap-driven-ingestion";
import type { GapCluster } from "@/types/adaptive-discovery";
import { backendDiscoveryPack } from "@/data/discovery-packs/backend-discovery-pack";

const mockGaps: SyllabusGap[] = [
  {
    id: "gap-1", type: "low-source-topic", severity: "high", score: 80,
    target: { entityType: "topic", entityId: "topic-nodejs", entityName: "Node.js Runtime" },
    reason: "Topic has only 1 source(s)", detail: "Node.js Runtime has 1 sources.",
    category: "backend",
  },
];

const mockClusters: GapCluster[] = [
  {
    id: "cluster-backend", category: "backend-depth", label: "Backend Depth",
    gapIds: ["gap-1"], gapCount: 1, avgSeverityScore: 80,
    domain: "backend", primaryGapType: "low-source-topic",
    recommendation: "Add backend-depth sources.",
  },
];

describe("adaptive-domain-agent-runner", () => {
  describe("runAdaptiveDomainAgent", () => {
    it("generates candidates from gaps using packs", () => {
      const result = runAdaptiveDomainAgent(
        "backend-adaptive-agent", "backend", mockGaps, mockClusters,
        backendDiscoveryPack, new Set()
      );
      expect(result.candidates.length).toBeGreaterThan(0);
      expect(result.trace.graphWrites).toBe(0);
    });

    it("returns confidence scores for each candidate", () => {
      const result = runAdaptiveDomainAgent(
        "backend-adaptive-agent", "backend", mockGaps, mockClusters,
        backendDiscoveryPack, new Set()
      );
      for (const candidate of result.candidates) {
        expect(result.confidenceScores[candidate.id]).toBeDefined();
      }
    });

    it("records trace metadata", () => {
      const result = runAdaptiveDomainAgent(
        "backend-adaptive-agent", "backend", mockGaps, mockClusters,
        backendDiscoveryPack, new Set()
      );
      expect(result.trace.agentType).toBe("backend-adaptive-agent");
      expect(result.trace.domain).toBe("backend");
      expect(result.trace.gapsConsidered).toBeGreaterThan(0);
      expect(result.trace.packUsed).toBeTruthy();
    });

    it("includes no-write warnings", () => {
      const result = runAdaptiveDomainAgent(
        "backend-adaptive-agent", "backend", mockGaps, mockClusters,
        backendDiscoveryPack, new Set()
      );
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe("runMultiDomainAdaptiveDiscovery", () => {
    it("aggregates results from multiple domains", () => {
      const result = runMultiDomainAdaptiveDiscovery(
        mockGaps, mockClusters,
        [{ domain: "backend", pack: backendDiscoveryPack }],
        new Set()
      );
      expect(result.results.length).toBeGreaterThan(0);
      expect(result.allCandidates.length).toBeGreaterThan(0);
    });

    it("deduplicates across domains", () => {
      const result = runMultiDomainAdaptiveDiscovery(
        mockGaps, mockClusters,
        [
          { domain: "backend", pack: backendDiscoveryPack },
          { domain: "backend", pack: backendDiscoveryPack },
        ],
        new Set()
      );
      const urls = result.allCandidates.map((c) => c.url);
      expect(new Set(urls).size).toBe(urls.length);
    });

    it("sorts candidates by confidence score descending", () => {
      const result = runMultiDomainAdaptiveDiscovery(
        mockGaps, mockClusters,
        [{ domain: "backend", pack: backendDiscoveryPack }],
        new Set()
      );
      for (let i = 1; i < result.allCandidates.length; i++) {
        expect(result.allCandidates[i - 1].confidenceScore)
          .toBeGreaterThanOrEqual(result.allCandidates[i].confidenceScore);
      }
    });
  });
});
