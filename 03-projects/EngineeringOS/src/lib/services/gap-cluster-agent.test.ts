import { describe, it, expect } from "vitest";
import { clusterKnowledgeGraphGaps, scoreGapCluster, prioritizeGapClusters } from "./gap-cluster-agent";
import type { SyllabusGap } from "@/types/gap-driven-ingestion";

const mockGaps: SyllabusGap[] = [
  {
    id: "gap-test-1", type: "low-source-topic", severity: "high", score: 80,
    target: { entityType: "topic", entityId: "topic-observability", entityName: "Observability" },
    reason: "Topic has only 1 source(s)", detail: "Observability has 1 sources. Minimum 2 recommended.",
    category: "system-design",
  },
  {
    id: "gap-test-2", type: "weak-skill-coverage", severity: "high", score: 75,
    target: { entityType: "skill", entityId: "skill-distributed-systems", entityName: "Distributed Systems" },
    reason: "Skill has only 1 topic(s)", detail: "Distributed Systems has 1 topics. Minimum 2 recommended.",
  },
  {
    id: "gap-test-3", type: "low-source-topic", severity: "high", score: 80,
    target: { entityType: "topic", entityId: "topic-vpc-networking", entityName: "VPC Networking" },
    reason: "Topic has only 1 source(s)", detail: "VPC Networking has 1 sources. Minimum 2 recommended.",
    category: "aws",
  },
  {
    id: "gap-test-4", type: "missing-proof-path", severity: "medium", score: 50,
    target: { entityType: "topic", entityId: "topic-circuit-breaker", entityName: "Circuit Breaker" },
    reason: "Topic has only 1 proof type(s)", detail: "Circuit Breaker has 1 proof types.",
  },
  {
    id: "gap-test-5", type: "missing-mission-path", severity: "medium", score: 40,
    target: { entityType: "topic", entityId: "topic-career-planning", entityName: "Career Planning" },
    reason: "Topic has no mission", detail: "Career Planning has no associated daily mission.",
  },
  {
    id: "gap-test-6", type: "weak-source-diversity", severity: "medium", score: 60,
    target: { entityType: "topic", entityId: "topic-test-coverage", entityName: "Test Coverage" },
    reason: "Topic sources come from only 1 source type(s)", detail: "Test Coverage sources are all from: official-docs.",
  },
];

describe("gap-cluster-agent", () => {
  it("clusters gaps by category", () => {
    const clusters = clusterKnowledgeGraphGaps(mockGaps);
    expect(clusters.length).toBeGreaterThanOrEqual(3);
  });

  it("assigns each cluster a domain and recommendation", () => {
    const clusters = clusterKnowledgeGraphGaps(mockGaps);
    for (const cluster of clusters) {
      expect(cluster.domain).toBeTruthy();
      expect(cluster.recommendation).toBeTruthy();
      expect(cluster.gapCount).toBeGreaterThan(0);
    }
  });

  it("clusters observability-related gaps", () => {
    const clusters = clusterKnowledgeGraphGaps(mockGaps);
    const obsCluster = clusters.find((c) => c.category === "observability");
    expect(obsCluster).toBeDefined();
    expect(obsCluster!.domain).toBe("system-design");
  });

  it("clusters aws-networking gaps", () => {
    const clusters = clusterKnowledgeGraphGaps(mockGaps);
    const awsCluster = clusters.find((c) => c.category === "aws-networking");
    expect(awsCluster).toBeDefined();
    expect(awsCluster!.domain).toBe("aws");
  });

  it("scores clusters by severity and count", () => {
    const clusters = clusterKnowledgeGraphGaps(mockGaps);
    const scores = clusters.map((c) => scoreGapCluster(c));
    for (const s of scores) {
      expect(s).toBeGreaterThan(0);
    }
  });

  it("prioritizes clusters by score descending", () => {
    const clusters = clusterKnowledgeGraphGaps(mockGaps);
    const prioritized = prioritizeGapClusters(clusters);
    expect(prioritized.length).toBe(clusters.length);
    for (let i = 1; i < prioritized.length; i++) {
      expect(prioritized[i - 1].priorityScore).toBeGreaterThanOrEqual(prioritized[i].priorityScore);
    }
  });

  it("returns empty for no gaps", () => {
    const clusters = clusterKnowledgeGraphGaps([]);
    expect(clusters).toEqual([]);
  });

  it("classifies proof gaps correctly", () => {
    const proofGaps: SyllabusGap[] = [{
      id: "gap-prf-1", type: "missing-proof-path", severity: "medium", score: 50,
      target: { entityType: "topic", entityId: "topic-db", entityName: "Database" },
      reason: "Topic has only 1 proof type(s)", detail: "Database has 1 proof types.",
    }];
    const clusters = clusterKnowledgeGraphGaps(proofGaps);
    expect(clusters.some((c) => c.category === "proof-gaps")).toBe(true);
  });



  it("classifies mission gaps correctly", () => {
    const missionGaps: SyllabusGap[] = [{
      id: "gap-msn-1", type: "missing-mission-path", severity: "medium", score: 40,
      target: { entityType: "topic", entityId: "topic-x", entityName: "Topic X" },
      reason: "Topic has no mission", detail: "Topic X has no associated daily mission.",
    }];
    const clusters = clusterKnowledgeGraphGaps(missionGaps);
    expect(clusters.some((c) => c.category === "mission-coverage")).toBe(true);
  });
});
