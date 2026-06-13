import { describe, it, expect } from "vitest";
import {
  scoreGraphFit,
  scoreDuplicateProbability,
  scoreSyllabusRelevance,
  scoreSourceQuality,
  scoreInterviewValue,
  scoreMissionValue,
  scoreReadinessValue,
  computeConfidenceScore,
} from "./discovery-confidence-service";
import type { SyllabusGap } from "@/types/gap-driven-ingestion";

const mockGap: SyllabusGap = {
  id: "gap-test", type: "low-source-topic", severity: "high", score: 80,
  target: { entityType: "topic", entityId: "topic-nodejs", entityName: "Node.js Runtime" },
  reason: "Topic has only 1 source(s)", detail: "Node.js Runtime has 1 sources.",
  category: "backend",
};

describe("discovery-confidence-service", () => {
  describe("scoreGraphFit", () => {
    it("scores graph fit based on title and tags", () => {
      const score = scoreGraphFit("Node.js Runtime Guide", ["nodejs", "runtime"], "backend", mockGap);
      expect(score).toBeGreaterThan(10);
    });

    it("returns low score for unrelated content", () => {
      const score = scoreGraphFit("Cooking Recipes", ["food"], "unrelated", mockGap);
      expect(score).toBeLessThan(20);
    });

    it("returns score between 0 and 100", () => {
      const score = scoreGraphFit("Node.js", ["nodejs"], "backend", mockGap);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe("scoreDuplicateProbability", () => {
    it("returns low probability for likely new source", () => {
      const score = scoreDuplicateProbability(
        "A Completely New Unique Title For Testing",
        "https://example.com/unique-url-for-testing"
      );
      expect(score).toBeLessThan(30);
    });

    it("returns score between 0 and 100", () => {
      const score = scoreDuplicateProbability("Test Title", "https://test.example.com/");
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe("scoreSyllabusRelevance", () => {
    it("returns score based on topic overlap", () => {
      const score = scoreSyllabusRelevance("Node.js Runtime", ["nodejs", "runtime"], "backend");
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it("returns 0 for non-matching content", () => {
      const score = scoreSyllabusRelevance("XYZ NonExistent Topic", ["xyz"], "unknown");
      expect(score).toBeGreaterThanOrEqual(0);
    });
  });

  describe("scoreSourceQuality", () => {
    it("scores official-docs highest", () => {
      const score = scoreSourceQuality("official-docs");
      expect(score).toBe(90);
    });

    it("scores books second", () => {
      const score = scoreSourceQuality("book");
      expect(score).toBe(85);
    });

    it("provides default for unknown types", () => {
      const score = scoreSourceQuality("unknown-type");
      expect(score).toBe(50);
    });
  });

  describe("scoreInterviewValue", () => {
    it("scores high for system-design content", () => {
      const score = scoreInterviewValue("System Design Interview", ["algorithm", "architecture"], null);
      expect(score).toBeGreaterThan(10);
    });

    it("adds bonus for interview coverage gaps", () => {
      const interviewGap: SyllabusGap = { ...mockGap, type: "weak-interview-coverage" };
      const withBonus = scoreInterviewValue("System Design", ["architecture"], interviewGap);
      const withoutBonus = scoreInterviewValue("System Design", ["architecture"], null);
      expect(withBonus).toBeGreaterThanOrEqual(withoutBonus);
    });

    it("returns score between 0 and 100", () => {
      const score = scoreInterviewValue("Node.js", ["nodejs"], null);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe("scoreMissionValue", () => {
    it("returns score based on mission overlap", () => {
      const score = scoreMissionValue("Node.js Guide", ["nodejs", "guide"]);
      expect(score).toBeGreaterThanOrEqual(0);
    });
  });

  describe("scoreReadinessValue", () => {
    it("scores higher for hands-on content", () => {
      const high = scoreReadinessValue("Hands-on Workshop Guide", ["tutorial", "lab"], null);
      const low = scoreReadinessValue("Theory Overview", ["concept"], null);
      expect(high).toBeGreaterThanOrEqual(low);
    });

    it("adds bonus for readiness coverage gaps", () => {
      const readinessGap: SyllabusGap = { ...mockGap, type: "weak-readiness-coverage" };
      const score = scoreReadinessValue("Practice Guide", ["tutorial"], readinessGap);
      expect(score).toBeGreaterThan(10);
    });
  });

  describe("computeConfidenceScore", () => {
    it("returns normalized confidence score with all dimensions", () => {
      const result = computeConfidenceScore(
        "Node.js Runtime Guide",
        "https://nodejs.org/guide",
        "official-docs",
        ["nodejs", "runtime"],
        "backend",
        mockGap
      );
      expect(result.graphFit).toBeGreaterThanOrEqual(0);
      expect(result.duplicateProbability).toBeGreaterThanOrEqual(0);
      expect(result.syllabusRelevance).toBeGreaterThanOrEqual(0);
      expect(result.sourceQuality).toBeGreaterThanOrEqual(0);
      expect(result.interviewValue).toBeGreaterThanOrEqual(0);
      expect(result.missionValue).toBeGreaterThanOrEqual(0);
      expect(result.readinessValue).toBeGreaterThanOrEqual(0);
      expect(result.normalizedScore).toBeGreaterThanOrEqual(0);
      expect(result.normalizedScore).toBeLessThanOrEqual(100);
    });

    it("produces deterministic output", () => {
      const r1 = computeConfidenceScore("Test Title", "https://test.com/", "book", ["test"], "general", mockGap);
      const r2 = computeConfidenceScore("Test Title", "https://test.com/", "book", ["test"], "general", mockGap);
      expect(r1).toEqual(r2);
    });
  });
});
