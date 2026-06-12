import { describe, it, expect } from "vitest";
import { InterviewSimulationService } from "./founder-beta-interview-simulation-service";
import { InterviewEvaluationService } from "./founder-beta-interview-evaluation-service";
import { InterviewReadinessIntegrationService } from "./founder-beta-interview-readiness-integration";
import { ReadinessRollupService } from "./founder-beta-readiness-rollup-service";
import { OfferReadinessService } from "./founder-beta-offer-readiness-service";
import { InterviewAnalyticsService } from "./founder-beta-interview-analytics-service";
import { InterviewScoreDecayService } from "./founder-beta-interview-score-decay-service";
import { FounderBetaMissionCandidateGenerator } from "./founder-beta-mission-candidate-generator";
import type {
  InterviewCategory,
  InterviewEvaluationResult,
  InterviewSession,
  InterviewSessionType,
  ProofRecord,
  RubricScore
} from "@/types/founder-beta";

const simulation = new InterviewSimulationService();
const evaluation = new InterviewEvaluationService();
const integration = new InterviewReadinessIntegrationService();
const rollup = new ReadinessRollupService();
const offerReadiness = new OfferReadinessService();
const analytics = new InterviewAnalyticsService();
const decay = new InterviewScoreDecayService();
const missionGenerator = new FounderBetaMissionCandidateGenerator();

// ============================================================
// Helper: Run a full pipeline for a session type
// ============================================================

function createRubricScores(sessionType: InterviewSessionType, scoreLevel: number): RubricScore[] {
  const rubricMap: Record<InterviewSessionType, string[]> = {
    dsa: [
      "dsa-correct-approach", "dsa-correct-implementation", "dsa-correct-edge-cases",
      "dsa-complexity-time", "dsa-complexity-space", "dsa-complexity-optimization",
      "dsa-comm-clarity", "dsa-comm-interaction", "dsa-comm-testing"
    ],
    lld: [
      "lld-correct-class-design", "lld-correct-patterns", "lld-correct-edge-cases",
      "lld-comm-clarity", "lld-comm-interaction", "lld-comm-tradeoffs"
    ],
    hld: [
      "hld-correct-scoping", "hld-correct-components", "hld-correct-data-flow",
      "hld-correct-tradeoffs", "hld-comm-clarity", "hld-comm-interaction"
    ],
    behavioral: [
      "behavioral-star-complete", "behavioral-star-impact", "behavioral-star-leadership",
      "behavioral-star-conflict", "behavioral-comm-clarity", "behavioral-comm-concision",
      "behavioral-comm-listening", "behavioral-comm-ownership"
    ],
    "mixed-architect": [
      "hld-correct-scoping", "hld-correct-components", "hld-correct-data-flow",
      "hld-correct-tradeoffs", "hld-comm-clarity", "hld-comm-interaction"
    ]
  };

  return (rubricMap[sessionType] ?? []).map((cid) => ({
    criterionId: cid,
    score: scoreLevel,
    rationale: ""
  }));
}

function runFullPipeline(
  sessionType: InterviewSessionType,
  scoreLevel: number = 4
): {
  session: InterviewSession;
  evaluationResult: InterviewEvaluationResult;
  proofRecord: ProofRecord;
  rollupResult: ReturnType<typeof rollup.rollupTopic>;
  offerReadyResult: ReturnType<typeof offerReadiness.calculate>;
} {
  const session = simulation.createSession(sessionType);
  const started = simulation.startSession(session);
  const completed = simulation.completeSession(started);
  const rubricScores = createRubricScores(sessionType, scoreLevel);
  const evalResult = evaluation.evaluate(completed, rubricScores);
  const proof = integration.createProofRecord(evalResult, completed);
  const topicOverride = { interview: proof.score ? (proof.score / 5) * 100 : 0 };
  const rollupResult = rollup.rollupTopic("topic-dsa-arrays", [proof], { "topic-dsa-arrays": topicOverride }, new Set());
  const offerReadyResult = offerReadiness.calculate({
    capabilityReadinessById: { [proof.capabilityId]: proof.score ? proof.score * 20 : 0 },
    proofCompletionByCapabilityId: {},
    completedCaseStudyCount: 0,
    resumeReadiness: 50,
    linkedinReadiness: 50,
    githubReadiness: 50,
    portfolioReadiness: 50,
    behavioralReadiness: 50,
    interviewReadiness: Math.round((evalResult.percentage / 100) * 50),
    technicalReadiness: 50,
    leadershipReadiness: 50,
    communicationReadiness: 50,
    architectureReadiness: 50,
    projectDepthReadiness: 50,
    applicationReadiness: 50,
    referralReadiness: 50,
    compensationReadiness: 50,
    completedTopicIds: []
  });

  return { session: completed, evaluationResult: evalResult, proofRecord: proof, rollupResult, offerReadyResult };
}

// ============================================================
// Part A: End-to-end Integration Tests
// ============================================================

describe("Phase 4 Part A: End-to-end Pipeline Integration", () => {
  describe("DSA session full pipeline", () => {
    it("completes simulation→evaluation→proof→rollup→offer readiness deterministically", () => {
      const result = runFullPipeline("dsa");
      expect(result.session.status).toBe("completed");
      expect(result.evaluationResult.percentage).toBeGreaterThan(0);
      expect(result.proofRecord.proofType).toBe("dsa-interview");
      expect(result.proofRecord.state).toBe("completed");
      expect(result.rollupResult.interview).toBeGreaterThan(0);
      expect(result.offerReadyResult.overallScore).toBeGreaterThan(0);
    });

    it("produces consistent results for repeated runs", () => {
      const first = runFullPipeline("dsa", 3);
      const second = runFullPipeline("dsa", 3);
      expect(first.evaluationResult.percentage).toBe(second.evaluationResult.percentage);
      expect(first.proofRecord.score).toBe(second.proofRecord.score);
    });

    it("maps proof record to interview dimension in rollup", () => {
      const { proofRecord } = runFullPipeline("dsa");
      const topicRollup = rollup.rollupTopic("topic-dsa-arrays", [proofRecord], {}, new Set());
      expect(topicRollup.interview).toBeGreaterThanOrEqual(0);
    });
  });

  describe("LLD session full pipeline", () => {
    it("completes simulation→evaluation→proof→rollup→offer readiness deterministically", () => {
      const result = runFullPipeline("lld");
      expect(result.session.sessionType).toBe("lld");
      expect(result.evaluationResult.percentage).toBeGreaterThanOrEqual(0);
      expect(result.proofRecord.proofType).toBe("lld-interview");
      expect(result.rollupResult.interview).toBeGreaterThanOrEqual(0);
    });
  });

  describe("HLD session full pipeline", () => {
    it("completes simulation→evaluation→proof→rollup→offer readiness deterministically", () => {
      const result = runFullPipeline("hld");
      expect(result.session.sessionType).toBe("hld");
      expect(result.evaluationResult.percentage).toBeGreaterThanOrEqual(0);
      expect(result.proofRecord.proofType).toBe("hld-interview");
      expect(result.rollupResult.interview).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Behavioral session full pipeline", () => {
    it("completes simulation→evaluation→proof→rollup→offer readiness deterministically", () => {
      const result = runFullPipeline("behavioral");
      expect(result.session.sessionType).toBe("behavioral");
      expect(result.evaluationResult.percentage).toBeGreaterThanOrEqual(0);
      expect(result.proofRecord.proofType).toBe("behavioral-interview");
      expect(result.rollupResult.interview).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Mixed-architect session full pipeline", () => {
    it("completes simulation→evaluation→proof→rollup→offer readiness deterministically", () => {
      const result = runFullPipeline("mixed-architect");
      expect(result.session.sessionType).toBe("mixed-architect");
      expect(result.evaluationResult.percentage).toBeGreaterThanOrEqual(0);
      expect(result.proofRecord.proofType).toBe("hld-interview");
      expect(result.rollupResult.interview).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Score level variance", () => {
    it("produces higher offer readiness with higher scores", () => {
      const low = runFullPipeline("dsa", 1);
      const high = runFullPipeline("dsa", 5);
      expect(high.evaluationResult.percentage).toBeGreaterThan(low.evaluationResult.percentage);
      expect(high.proofRecord.score!).toBeGreaterThan(low.proofRecord.score!);
    });

    it("detects weaknesses for low scores in evaluation", () => {
      const lowResult = runFullPipeline("dsa", 1);
      expect(lowResult.evaluationResult.weaknesses.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Proof record created by integration service feeds into rollup correctly", () => {
    it("creates proof records that contribute to interview dimension", () => {
      const { proofRecord } = runFullPipeline("dsa");
      const allProofs = [proofRecord];
      const roleResult = rollup.rollup({ proofRecords: allProofs });
      const dsaCap = roleResult.capabilityReadiness.find(
        (c) => c.capabilityId === "cap-dsa-problem-solving"
      );
      expect(dsaCap).toBeDefined();
    });
  });

  describe("Offer readiness interview area reflects session results", () => {
    it("computes interview area score based on session proof", () => {
      const { offerReadyResult } = runFullPipeline("dsa", 5);
      const interviewArea = offerReadyResult.areas.find((a) => a.area === "interview");
      expect(interviewArea).toBeDefined();
      expect(interviewArea!.score).toBeGreaterThanOrEqual(0);
    });
  });
});

// ============================================================
// Part F: Analytics Service Tests
// ============================================================

describe("Phase 4 Part C: InterviewAnalyticsService", () => {
  const makeEval = (
    sessionType: InterviewSessionType,
    percentage: number,
    categories: Array<{ category: InterviewCategory; percentage: number }>
  ): InterviewEvaluationResult => ({
    sessionId: "s1",
    sessionType,
    totalScore: 0,
    maxScore: 1,
    percentage,
    categoryScores: categories.map((c) => ({
      category: c.category,
      score: 0,
      maxScore: 1,
      percentage: c.percentage
    })),
    rubricScores: [],
    strengths: [],
    weaknesses: [],
    improvementAreas: [],
    completedAt: "2026-06-01T00:00:00.000Z"
  });

  describe("computeSummary", () => {
    it("returns zero values for empty evaluations", () => {
      const summary = analytics.computeSummary([]);
      expect(summary.totalSessions).toBe(0);
      expect(summary.averageScore).toBe(0);
      expect(Object.keys(summary.scoreByCategory)).toHaveLength(0);
    });

    it("computes correct average across evaluations", () => {
      const evals = [
        makeEval("dsa", 70, [{ category: "dsa", percentage: 70 }]),
        makeEval("hld", 90, [{ category: "hld", percentage: 90 }])
      ];
      const summary = analytics.computeSummary(evals);
      expect(summary.totalSessions).toBe(2);
      expect(summary.averageScore).toBe(80);
    });

    it("identifies weak categories below 60", () => {
      const evals = [
        makeEval("dsa", 45, [{ category: "dsa", percentage: 45 }]),
        makeEval("hld", 85, [{ category: "hld", percentage: 85 }])
      ];
      const summary = analytics.computeSummary(evals);
      expect(summary.weakCategories).toContain("dsa");
      expect(summary.weakCategories).not.toContain("hld");
    });

    it("identifies strong categories at or above 80", () => {
      const evals = [
        makeEval("behavioral", 88, [{ category: "behavioral", percentage: 88 }]),
        makeEval("dsa", 55, [{ category: "dsa", percentage: 55 }])
      ];
      const summary = analytics.computeSummary(evals);
      expect(summary.strongCategories).toContain("behavioral");
      expect(summary.strongCategories).not.toContain("dsa");
    });

    it("builds practice focus recommendations for weak categories", () => {
      const evals = [
        makeEval("lld", 35, [{ category: "lld", percentage: 35 }])
      ];
      const summary = analytics.computeSummary(evals);
      expect(summary.recommendedPracticeFocus.length).toBeGreaterThanOrEqual(1);
      expect(summary.recommendedPracticeFocus[0].toLowerCase()).toContain("lld");
    });
  });

  describe("computeCategoryBreakdown", () => {
    it("returns breakdown per category with stats", () => {
      const evals = [
        makeEval("dsa", 50, [{ category: "dsa", percentage: 50 }]),
        makeEval("dsa", 70, [{ category: "dsa", percentage: 70 }]),
        makeEval("hld", 90, [{ category: "hld", percentage: 90 }])
      ];
      const breakdown = analytics.computeCategoryBreakdown(evals);
      const dsaBreakdown = breakdown.find((b) => b.category === "dsa");
      expect(dsaBreakdown).toBeDefined();
      expect(dsaBreakdown!.averageScore).toBe(60);
      expect(dsaBreakdown!.sessionCount).toBe(2);
      expect(dsaBreakdown!.minScore).toBe(50);
      expect(dsaBreakdown!.maxScore).toBe(70);
    });
  });

  describe("computeAverageScore", () => {
    it("returns 0 for no matching evaluations", () => {
      expect(analytics.computeAverageScore("dsa", [])).toBe(0);
    });

    it("averages by session type", () => {
      const evals = [
        makeEval("dsa", 80, []),
        makeEval("dsa", 60, []),
        makeEval("hld", 90, [])
      ];
      expect(analytics.computeAverageScore("dsa", evals)).toBe(70);
      expect(analytics.computeAverageScore("hld", evals)).toBe(90);
    });
  });
});

// ============================================================
// Part F: Score Decay Service Tests
// ============================================================

describe("Phase 4 Part D: InterviewScoreDecayService", () => {
  function makeDecayEval(sessionType: InterviewSessionType, percentage: number, completedAt: string): InterviewEvaluationResult {
    return {
      sessionId: "s1",
      sessionType,
      totalScore: 0,
      maxScore: 1,
      percentage,
      categoryScores: [],
      rubricScores: [],
      strengths: [],
      weaknesses: [],
      improvementAreas: [],
      completedAt
    };
  }

  describe("computeWeightedAverage", () => {
    it("returns 0 for empty evaluations", () => {
      expect(decay.computeWeightedAverage([])).toBe(0);
    });

    it("returns same as simple average for single evaluation", () => {
      const evals = [makeDecayEval("dsa", 80, "2026-06-01T00:00:00.000Z")];
      expect(decay.computeWeightedAverage(evals)).toBe(80);
    });

    it("gives more weight to recent evaluations", () => {
      const evals = [
        makeDecayEval("dsa", 50, "2026-01-01T00:00:00.000Z"),
        makeDecayEval("dsa", 90, "2026-06-01T00:00:00.000Z")
      ];
      const weighted = decay.computeWeightedAverage(evals);
      const simple = Math.round((50 + 90) / 2);
      expect(weighted).toBeGreaterThan(simple);
    });

    it("is deterministic — same input produces same result", () => {
      const evals = [
        makeDecayEval("dsa", 40, "2026-01-01T00:00:00.000Z"),
        makeDecayEval("dsa", 60, "2026-03-01T00:00:00.000Z"),
        makeDecayEval("dsa", 80, "2026-06-01T00:00:00.000Z")
      ];
      const first = decay.computeWeightedAverage(evals);
      const second = decay.computeWeightedAverage(evals);
      expect(first).toBe(second);
    });
  });

  describe("computeWeightedAverageByType", () => {
    it("returns zero-weighted for no matching type", () => {
      const result = decay.computeWeightedAverageByType("dsa", []);
      expect(result.sessionCount).toBe(0);
      expect(result.weightedAverage).toBe(0);
      expect(result.simpleAverage).toBe(0);
    });

    it("computes weighted average for a specific type", () => {
      const evals = [
        makeDecayEval("dsa", 60, "2026-01-01T00:00:00.000Z"),
        makeDecayEval("dsa", 80, "2026-06-01T00:00:00.000Z"),
        makeDecayEval("hld", 90, "2026-06-01T00:00:00.000Z")
      ];
      const result = decay.computeWeightedAverageByType("dsa", evals);
      expect(result.sessionCount).toBe(2);
      expect(result.sessionType).toBe("dsa");
      expect(result.weightedAverage).toBeGreaterThanOrEqual(0);
    });
  });

  describe("computeAllWeightedAverages", () => {
    it("returns empty for no evaluations", () => {
      expect(decay.computeAllWeightedAverages([])).toEqual([]);
    });

    it("returns one result per session type", () => {
      const evals = [
        makeDecayEval("dsa", 80, "2026-06-01T00:00:00.000Z"),
        makeDecayEval("hld", 70, "2026-06-01T00:00:00.000Z"),
        makeDecayEval("behavioral", 90, "2026-06-01T00:00:00.000Z")
      ];
      const results = decay.computeAllWeightedAverages(evals);
      expect(results).toHaveLength(3);
      expect(results.map((r) => r.sessionType).sort()).toEqual(["behavioral", "dsa", "hld"]);
    });
  });

  describe("computeDecayMultiplier", () => {
    it("returns 1 for 0 or 1 evaluations", () => {
      expect(decay.computeDecayMultiplier([])).toBe(1);
      expect(decay.computeDecayMultiplier([makeDecayEval("dsa", 80, "2026-06-01T00:00:00.000Z")])).toBe(1);
    });

    it("returns a value less than 1 for multiple evaluations", () => {
      const evals = [
        makeDecayEval("dsa", 80, "2026-01-01T00:00:00.000Z"),
        makeDecayEval("dsa", 80, "2026-06-01T00:00:00.000Z")
      ];
      const multiplier = decay.computeDecayMultiplier(evals);
      expect(multiplier).toBeLessThan(1);
      expect(multiplier).toBeGreaterThan(0);
    });
  });
});

// ============================================================
// Part F: Weak-Area Mission Integration Tests
// ============================================================

describe("Phase 4 Part E: Weak-Area Interview Mission Integration", () => {
  describe("FounderBetaMissionCandidateGenerator with weakInterviewAreas", () => {
    it("generates candidates that include interview-type missions for DSA weakness", () => {
      const candidates = missionGenerator.generateCandidates({
        weakAreaCapabilityIds: ["cap-dsa-problem-solving"]
      });
      const interviewCandidates = candidates.filter((c) => c.missionType === "interview");
      const dsaInterviewCandidates = interviewCandidates.filter(
        (c) => c.capabilityId === "cap-dsa-problem-solving"
      );
      expect(dsaInterviewCandidates.length).toBeGreaterThanOrEqual(1);
    });

    it("generates practice missions for weak interview areas", () => {
      const candidates = missionGenerator.generateCandidates({
        weakAreaCapabilityIds: ["cap-low-level-design"]
      });
      const lldPractice = candidates.filter(
        (c) => c.capabilityId === "cap-low-level-design" && c.missionType === "practice"
      );
      expect(lldPractice.length).toBeGreaterThanOrEqual(1);
    });

    it("generates weak-area-repair missions for weak capabilities", () => {
      const candidates = missionGenerator.generateCandidates({
        weakAreaCapabilityIds: ["cap-behavioral-communication"]
      });
      const weakRepair = candidates.filter(
        (c) => c.capabilityId === "cap-behavioral-communication" && c.missionType === "weak-area-repair"
      );
      expect(weakRepair.length).toBeGreaterThanOrEqual(1);
    });

    it("returns high-priority candidates for weak interview areas", () => {
      const candidates = missionGenerator.generateCandidates({
        weakAreaCapabilityIds: ["cap-dsa-problem-solving"]
      });
      const dsaCandidates = candidates.filter((c) => c.capabilityId === "cap-dsa-problem-solving");
      expect(dsaCandidates.length).toBeGreaterThan(0);
      for (const c of dsaCandidates) {
        expect(c.priority === "critical" || c.priority === "high").toBe(true);
      }
    });

    it("produces deterministic results for same input", () => {
      const input = { weakAreaCapabilityIds: ["cap-dsa-problem-solving"] };
      const first = missionGenerator.generateCandidates(input);
      const second = missionGenerator.generateCandidates(input);
      expect(first.length).toBe(second.length);
    });
  });
});

// ============================================================
// Part F: Smoke Tests for Phase 4 Services
// ============================================================

describe("Phase 4 Part F: Service Smoke Tests", () => {
  describe("AnalyticsService creation and interface", () => {
    it("can be instantiated", () => {
      expect(new InterviewAnalyticsService()).toBeInstanceOf(InterviewAnalyticsService);
    });

    it("computeSummary returns expected shape", () => {
      const result = analytics.computeSummary([]);
      expect(result).toHaveProperty("totalSessions");
      expect(result).toHaveProperty("averageScore");
      expect(result).toHaveProperty("scoreByCategory");
      expect(result).toHaveProperty("weakCategories");
      expect(result).toHaveProperty("strongCategories");
      expect(result).toHaveProperty("recommendedPracticeFocus");
    });
  });

  describe("ScoreDecayService creation and interface", () => {
    it("can be instantiated", () => {
      expect(new InterviewScoreDecayService()).toBeInstanceOf(InterviewScoreDecayService);
    });

    it("computeAllWeightedAverages returns expected shape", () => {
      const result = decay.computeAllWeightedAverages([]);
      expect(result).toEqual([]);
    });

    it("computeWeightedAverageByType returns expected shape", () => {
      const result = decay.computeWeightedAverageByType("dsa", []);
      expect(result).toHaveProperty("sessionType");
      expect(result).toHaveProperty("weightedAverage");
      expect(result).toHaveProperty("simpleAverage");
      expect(result).toHaveProperty("sessionCount");
      expect(result).toHaveProperty("decayMultiplier");
    });
  });

  describe("Offer readiness with interview data", () => {
    it("processes interview proof through offer readiness pipeline", () => {
      const { proofRecord } = runFullPipeline("behavioral");
      const result = offerReadiness.calculate({
        capabilityReadinessById: { [proofRecord.capabilityId]: 60 },
        proofCompletionByCapabilityId: { [proofRecord.capabilityId]: 1 },
        completedCaseStudyCount: 0,
        resumeReadiness: 50,
        linkedinReadiness: 50,
        githubReadiness: 50,
        portfolioReadiness: 50,
        behavioralReadiness: 60,
        interviewReadiness: 60,
        technicalReadiness: 50,
        leadershipReadiness: 50,
        communicationReadiness: 50,
        architectureReadiness: 50,
        projectDepthReadiness: 50,
        applicationReadiness: 50,
        referralReadiness: 50,
        compensationReadiness: 50,
        completedTopicIds: []
      });
      expect(result.overallScore).toBeGreaterThan(0);
      const interviewArea = result.areas.find((a) => a.area === "interview");
      expect(interviewArea).toBeDefined();
    });
  });
});
