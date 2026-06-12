import { describe, it, expect } from "vitest";
import { InterviewSimulationService } from "./founder-beta-interview-simulation-service";
import { InterviewEvaluationService } from "./founder-beta-interview-evaluation-service";
import { InterviewReadinessIntegrationService } from "./founder-beta-interview-readiness-integration";
import { founderBetaInterviewQuestions, getInterviewQuestionById } from "@/data/founder-beta/interview-questions";
import { founderBetaInterviewRubrics } from "@/data/founder-beta/interview-rubrics";
import { ReadinessRollupService } from "./founder-beta-readiness-rollup-service";
import type {
  InterviewSession,
  InterviewSessionType,
  ProofRecord,
  RubricScore
} from "@/types/founder-beta";

const simulation = new InterviewSimulationService();
const evaluation = new InterviewEvaluationService();
const integration = new InterviewReadinessIntegrationService();
const rollup = new ReadinessRollupService();

function makeSession(overrides: Partial<InterviewSession> & { sessionType: InterviewSessionType }): InterviewSession {
  return {
    id: "test-session-1",
    sessionType: overrides.sessionType,
    status: overrides.status ?? "pending",
    questionIds: overrides.questionIds ?? [],
    currentQuestionIndex: overrides.currentQuestionIndex ?? 0,
    startedAt: overrides.startedAt ?? null,
    completedAt: overrides.completedAt ?? null,
    timeLimitMinutes: overrides.timeLimitMinutes ?? 60,
    responses: overrides.responses ?? []
  };
}

// ============================================================
// Part B: Interview Simulation Service
// ============================================================

describe("InterviewSimulationService", () => {
  describe("createSession", () => {
    it("creates a dsa session with 3 questions", () => {
      const session = simulation.createSession("dsa");
      expect(session.sessionType).toBe("dsa");
      expect(session.status).toBe("pending");
      expect(session.questionIds.length).toBe(3);
      expect(session.timeLimitMinutes).toBe(45);
      expect(session.startedAt).toBeNull();
      expect(session.responses.length).toBe(0);
    });

    it("creates an hld session with 2 questions and 75 min limit", () => {
      const session = simulation.createSession("hld");
      expect(session.questionIds.length).toBe(2);
      expect(session.timeLimitMinutes).toBe(75);
    });

    it("creates a behavioral session with 3 questions and 30 min limit", () => {
      const session = simulation.createSession("behavioral");
      expect(session.questionIds.length).toBe(3);
      expect(session.timeLimitMinutes).toBe(30);
    });

    it("creates a mixed-architect session with 3 questions", () => {
      const session = simulation.createSession("mixed-architect");
      expect(session.questionIds.length).toBe(3);
      expect(session.timeLimitMinutes).toBe(90);
    });

    it("accepts overrides for questionIds and timeLimit", () => {
      const qs = ["iq-dsa-1", "iq-dsa-2"];
      const session = simulation.createSession("dsa", {
        questionIds: qs,
        timeLimitMinutes: 30
      });
      expect(session.questionIds).toEqual(qs);
      expect(session.timeLimitMinutes).toBe(30);
    });

    it("selects only dsa category questions for dsa sessions", () => {
      const session = simulation.createSession("dsa");
      for (const qid of session.questionIds) {
        const q = getInterviewQuestionById(qid);
        expect(q).toBeDefined();
        expect(q!.category === "dsa" || q!.category === "problem-solving").toBe(true);
      }
    });

    it("selects only lld questions for lld sessions", () => {
      const session = simulation.createSession("lld");
      for (const qid of session.questionIds) {
        const q = getInterviewQuestionById(qid);
        expect(q).toBeDefined();
        expect(q!.category).toBe("lld");
      }
    });

    it("selects only behavioral/leadership questions for behavioral sessions", () => {
      const session = simulation.createSession("behavioral");
      for (const qid of session.questionIds) {
        const q = getInterviewQuestionById(qid);
        expect(q).toBeDefined();
        expect(q!.category === "behavioral" || q!.category === "leadership").toBe(true);
      }
    });
  });

  describe("startSession", () => {
    it("transitions pending to in-progress and sets startedAt", () => {
      const session = simulation.createSession("dsa");
      const started = simulation.startSession(session);
      expect(started.status).toBe("in-progress");
      expect(started.startedAt).not.toBeNull();
    });

    it("does not transition if already in-progress", () => {
      const session = simulation.createSession("dsa");
      const started = simulation.startSession(session);
      const again = simulation.startSession(started);
      expect(again.startedAt).toBe(started.startedAt);
    });
  });

  describe("addResponse", () => {
    it("adds a response and advances currentQuestionIndex", () => {
      const session = simulation.createSession("dsa");
      const started = simulation.startSession(session);
      const qid = started.questionIds[0];
      const updated = simulation.addResponse(started, qid, "My answer", 300);
      expect(updated.responses.length).toBe(1);
      expect(updated.responses[0].questionId).toBe(qid);
      expect(updated.responses[0].responseText).toBe("My answer");
      expect(updated.currentQuestionIndex).toBe(1);
    });

    it("does not add response for unknown questionId", () => {
      const session = simulation.createSession("dsa");
      const started = simulation.startSession(session);
      const updated = simulation.addResponse(started, "nonexistent", "test", 100);
      expect(updated.responses.length).toBe(0);
    });

    it("does not add duplicate response for same question", () => {
      const session = simulation.createSession("dsa");
      const started = simulation.startSession(session);
      const qid = started.questionIds[0];
      const first = simulation.addResponse(started, qid, "first", 300);
      const second = simulation.addResponse(first, qid, "second", 200);
      expect(second.responses.length).toBe(1);
      expect(second.responses[0].responseText).toBe("first");
    });

    it("does not add response to a non-in-progress session", () => {
      const session = simulation.createSession("dsa");
      const qid = session.questionIds[0];
      const updated = simulation.addResponse(session, qid, "test", 100);
      expect(updated.responses.length).toBe(0);
    });
  });

  describe("completeSession", () => {
    it("marks session as completed and sets completedAt", () => {
      const session = simulation.createSession("dsa");
      const started = simulation.startSession(session);
      const completed = simulation.completeSession(started);
      expect(completed.status).toBe("completed");
      expect(completed.completedAt).not.toBeNull();
    });

    it("does not complete a non-in-progress session", () => {
      const session = simulation.createSession("dsa");
      const completed = simulation.completeSession(session);
      expect(completed.status).toBe("pending");
    });
  });

  describe("timeoutSession", () => {
    it("marks session as timed-out", () => {
      const session = simulation.createSession("dsa");
      const started = simulation.startSession(session);
      const timedOut = simulation.timeoutSession(started);
      expect(timedOut.status).toBe("timed-out");
    });
  });

  describe("getSessionProgress", () => {
    it("returns correct progress for empty session", () => {
      const session = simulation.createSession("dsa");
      const progress = simulation.getSessionProgress(session);
      expect(progress.totalQuestions).toBe(3);
      expect(progress.answeredQuestions).toBe(0);
      expect(progress.isComplete).toBe(false);
      expect(progress.currentQuestionId).toBe(session.questionIds[0]);
    });

    it("returns correct progress after partial answers", () => {
      const session = simulation.createSession("dsa");
      const started = simulation.startSession(session);
      const qid = started.questionIds[0];
      const partial = simulation.addResponse(started, qid, "answer", 200);
      const progress = simulation.getSessionProgress(partial);
      expect(progress.answeredQuestions).toBe(1);
      expect(progress.remainingQuestions).toBe(2);
    });
  });

  describe("selectQuestions with filters", () => {
    it("respects difficulty filter", () => {
      const ids = simulation.selectQuestions("dsa", 5, "easy");
      for (const qid of ids) {
        const q = getInterviewQuestionById(qid);
        expect(q).toBeDefined();
        expect(q!.difficulty).toBe("easy");
      }
    });

    it("respects tag filter", () => {
      const ids = simulation.selectQuestions("dsa", 5, undefined, ["arrays"]);
      for (const qid of ids) {
        const q = getInterviewQuestionById(qid);
        expect(q).toBeDefined();
        expect(q!.tags).toContain("arrays");
      }
    });

    it("returns fewer questions if pool is insufficient", () => {
      const ids = simulation.selectQuestions("dsa", 100);
      expect(ids.length).toBeLessThanOrEqual(20);
    });
  });
});

// ============================================================
// Part C: Interview Evaluation Service
// ============================================================

describe("InterviewEvaluationService", () => {
  describe("evaluate", () => {
    it("throws for non-completed session", () => {
      const session = makeSession({ sessionType: "dsa", status: "in-progress" });
      expect(() => evaluation.evaluate(session, [])).toThrow();
    });

    it("evaluates a completed dsa session with rubric scores", () => {
      const session = simulation.createSession("dsa");
      const started = simulation.startSession(session);
      const completed = simulation.completeSession(started);

      const rubricScores: RubricScore[] = [
        { criterionId: "dsa-correct-approach", score: 4, rationale: "Good approach" },
        { criterionId: "dsa-correct-implementation", score: 3, rationale: "Mostly correct" },
        { criterionId: "dsa-correct-edge-cases", score: 5, rationale: "Handled all edge cases" },
        { criterionId: "dsa-complexity-time", score: 4, rationale: "Correct time analysis" },
        { criterionId: "dsa-complexity-space", score: 3, rationale: "Basic space analysis" },
        { criterionId: "dsa-complexity-optimization", score: 5, rationale: "Optimized iteratively" },
        { criterionId: "dsa-comm-clarity", score: 5, rationale: "Very clear" },
        { criterionId: "dsa-comm-interaction", score: 4, rationale: "Good interaction" },
        { criterionId: "dsa-comm-testing", score: 3, rationale: "Basic testing" }
      ];

      const result = evaluation.evaluate(completed, rubricScores);
      expect(result.sessionId).toBe(completed.id);
      expect(result.sessionType).toBe("dsa");
      expect(result.totalScore).toBeGreaterThan(0);
      expect(result.maxScore).toBeGreaterThan(0);
      expect(result.percentage).toBeGreaterThanOrEqual(0);
      expect(result.categoryScores.length).toBeGreaterThanOrEqual(1);
      expect(result.strengths.length).toBeGreaterThanOrEqual(1);
    });

    it("computes correct percentage for perfect scores", () => {
      const session = makeSession({
        sessionType: "dsa",
        status: "completed",
        questionIds: ["iq-dsa-1"],
        completedAt: "2026-06-01T00:00:00.000Z",
        responses: []
      });

      const rubricScores: RubricScore[] = [
        { criterionId: "dsa-correct-approach", score: 5, rationale: "" },
        { criterionId: "dsa-correct-implementation", score: 5, rationale: "" },
        { criterionId: "dsa-correct-edge-cases", score: 5, rationale: "" },
        { criterionId: "dsa-complexity-time", score: 5, rationale: "" },
        { criterionId: "dsa-complexity-space", score: 5, rationale: "" },
        { criterionId: "dsa-complexity-optimization", score: 5, rationale: "" },
        { criterionId: "dsa-comm-clarity", score: 5, rationale: "" },
        { criterionId: "dsa-comm-interaction", score: 5, rationale: "" },
        { criterionId: "dsa-comm-testing", score: 5, rationale: "" }
      ];

      const result = evaluation.evaluate(session, rubricScores);
      expect(result.percentage).toBe(100);
      expect(result.strengths.length).toBeGreaterThanOrEqual(5);
      expect(result.weaknesses.length).toBe(0);
    });

    it("detects weaknesses for low scores", () => {
      const session = makeSession({
        sessionType: "dsa",
        status: "completed",
        questionIds: ["iq-dsa-1"],
        completedAt: "2026-06-01T00:00:00.000Z",
        responses: []
      });

      const rubricScores: RubricScore[] = [
        { criterionId: "dsa-correct-approach", score: 1, rationale: "" },
        { criterionId: "dsa-correct-implementation", score: 1, rationale: "" },
        { criterionId: "dsa-correct-edge-cases", score: 1, rationale: "" },
        { criterionId: "dsa-complexity-time", score: 1, rationale: "" },
        { criterionId: "dsa-complexity-space", score: 1, rationale: "" },
        { criterionId: "dsa-complexity-optimization", score: 1, rationale: "" },
        { criterionId: "dsa-comm-clarity", score: 1, rationale: "" },
        { criterionId: "dsa-comm-interaction", score: 1, rationale: "" },
        { criterionId: "dsa-comm-testing", score: 1, rationale: "" }
      ];

      const result = evaluation.evaluate(session, rubricScores);
      expect(result.percentage).toBeLessThan(50);
      expect(result.weaknesses.length).toBeGreaterThanOrEqual(5);
    });

    it("ignores rubric scores for criteria not in the session rubrics", () => {
      const session = makeSession({
        sessionType: "dsa",
        status: "completed",
        questionIds: ["iq-dsa-1"],
        completedAt: "2026-06-01T00:00:00.000Z",
        responses: []
      });

      const rubricScores: RubricScore[] = [
        { criterionId: "nonexistent-criterion", score: 5, rationale: "" }
      ];

      const result = evaluation.evaluate(session, rubricScores);
      expect(result.percentage).toBe(0);
      expect(result.rubricScores.length).toBe(0);
    });
  });
});

// ============================================================
// Part D: Interview Readiness Integration
// ============================================================

describe("InterviewReadinessIntegrationService", () => {
  describe("sessionTypeToProofType", () => {
    it("maps dsa to dsa-interview", () => {
      expect(integration.sessionTypeToProofType("dsa")).toBe("dsa-interview");
    });

    it("maps lld to lld-interview", () => {
      expect(integration.sessionTypeToProofType("lld")).toBe("lld-interview");
    });

    it("maps hld to hld-interview", () => {
      expect(integration.sessionTypeToProofType("hld")).toBe("hld-interview");
    });

    it("maps behavioral to behavioral-interview", () => {
      expect(integration.sessionTypeToProofType("behavioral")).toBe("behavioral-interview");
    });

    it("maps mixed-architect to hld-interview", () => {
      expect(integration.sessionTypeToProofType("mixed-architect")).toBe("hld-interview");
    });
  });

  describe("createProofRecord", () => {
    it("creates a completed proof record from evaluation", () => {
      const session = simulation.createSession("dsa");
      const started = simulation.startSession(session);
      const completed = simulation.completeSession(started);

      const rubricScores: RubricScore[] = [
        { criterionId: "dsa-correct-approach", score: 4, rationale: "" },
        { criterionId: "dsa-correct-implementation", score: 3, rationale: "" },
        { criterionId: "dsa-correct-edge-cases", score: 4, rationale: "" },
        { criterionId: "dsa-complexity-time", score: 4, rationale: "" },
        { criterionId: "dsa-complexity-space", score: 3, rationale: "" },
        { criterionId: "dsa-complexity-optimization", score: 5, rationale: "" },
        { criterionId: "dsa-comm-clarity", score: 4, rationale: "" },
        { criterionId: "dsa-comm-interaction", score: 4, rationale: "" },
        { criterionId: "dsa-comm-testing", score: 3, rationale: "" }
      ];

      const result = evaluation.evaluate(completed, rubricScores);
      const proof = integration.createProofRecord(result, completed);

      expect(proof.proofType).toBe("dsa-interview");
      expect(proof.state).toBe("completed");
      expect(proof.score).toBeGreaterThanOrEqual(0);
      expect(proof.score).toBeLessThanOrEqual(5);
      expect(proof.artifactRef).toContain("evaluation:");
    });

    it("converts percentage to proof score correctly", () => {
      const makeEval = (percentage: number) => ({
        sessionId: "s1",
        sessionType: "dsa" as const,
        totalScore: 0,
        maxScore: 1,
        percentage,
        categoryScores: [],
        rubricScores: [],
        strengths: [],
        weaknesses: [],
        improvementAreas: [],
        completedAt: "2026-06-01T00:00:00.000Z"
      });

      const session = makeSession({
        sessionType: "dsa",
        status: "completed",
        completedAt: "2026-06-01T00:00:00.000Z"
      });

      expect(integration.createProofRecord(makeEval(95), session).score).toBe(5);
      expect(integration.createProofRecord(makeEval(80), session).score).toBe(4);
      expect(integration.createProofRecord(makeEval(60), session).score).toBe(3);
      expect(integration.createProofRecord(makeEval(40), session).score).toBe(2);
      expect(integration.createProofRecord(makeEval(20), session).score).toBe(1);
      expect(integration.createProofRecord(makeEval(5), session).score).toBe(0);
    });
  });

  describe("createProofRecordsByCategory", () => {
    it("creates proof records for each category in evaluation", () => {
      const evaluation = {
        sessionId: "s1",
        sessionType: "dsa" as const,
        totalScore: 0,
        maxScore: 1,
        percentage: 75,
        categoryScores: [
          { category: "dsa" as const, score: 30, maxScore: 40, percentage: 75 },
          { category: "behavioral" as const, score: 20, maxScore: 25, percentage: 80 }
        ],
        rubricScores: [],
        strengths: [],
        weaknesses: [],
        improvementAreas: [],
        completedAt: "2026-06-01T00:00:00.000Z"
      };

      const proofs = integration.createProofRecordsByCategory(evaluation);
      expect(proofs.length).toBe(2);
      expect(proofs[0].proofType).toBe("dsa-interview");
      expect(proofs[1].proofType).toBe("behavioral-interview");
    });
  });

  describe("buildReadinessSnapshot", () => {
    it("builds snapshot from single evaluation", () => {
      const evaluations = [{
        sessionId: "s1",
        sessionType: "dsa" as const,
        totalScore: 0,
        maxScore: 1,
        percentage: 75,
        categoryScores: [],
        rubricScores: [],
        strengths: [],
        weaknesses: [],
        improvementAreas: [],
        completedAt: "2026-06-01T00:00:00.000Z"
      }];

      const snapshot = integration.buildReadinessSnapshot(evaluations);
      expect(snapshot.dsaInterviewScore).toBe(75);
      expect(snapshot.lldInterviewScore).toBe(0);
      expect(snapshot.hldInterviewScore).toBe(0);
      expect(snapshot.behavioralInterviewScore).toBe(0);
      expect(snapshot.overallInterviewReadiness).toBeGreaterThan(0);
    });

    it("identifies weak categories below 60", () => {
      const evaluations = [
        { sessionId: "s1", sessionType: "dsa" as const, totalScore: 0, maxScore: 1, percentage: 45, categoryScores: [], rubricScores: [], strengths: [], weaknesses: [], improvementAreas: [], completedAt: "2026-06-01T00:00:00.000Z" },
        { sessionId: "s2", sessionType: "hld" as const, totalScore: 0, maxScore: 1, percentage: 80, categoryScores: [], rubricScores: [], strengths: [], weaknesses: [], improvementAreas: [], completedAt: "2026-06-01T00:00:00.000Z" },
        { sessionId: "s3", sessionType: "behavioral" as const, totalScore: 0, maxScore: 1, percentage: 55, categoryScores: [], rubricScores: [], strengths: [], weaknesses: [], improvementAreas: [], completedAt: "2026-06-01T00:00:00.000Z" }
      ];

      const snapshot = integration.buildReadinessSnapshot(evaluations);
      expect(snapshot.weakCategories).toContain("dsa");
      expect(snapshot.weakCategories).not.toContain("hld");
      expect(snapshot.weakCategories).toContain("behavioral");
      expect(snapshot.recommendedPracticeAreas.length).toBeGreaterThanOrEqual(2);
    });

    it("averages multiple evaluations of same type", () => {
      const evaluations = [
        { sessionId: "s1", sessionType: "dsa" as const, totalScore: 0, maxScore: 1, percentage: 60, categoryScores: [], rubricScores: [], strengths: [], weaknesses: [], improvementAreas: [], completedAt: "2026-06-01T00:00:00.000Z" },
        { sessionId: "s2", sessionType: "dsa" as const, totalScore: 0, maxScore: 1, percentage: 80, categoryScores: [], rubricScores: [], strengths: [], weaknesses: [], improvementAreas: [], completedAt: "2026-06-01T00:00:00.000Z" }
      ];

      const snapshot = integration.buildReadinessSnapshot(evaluations);
      expect(snapshot.dsaInterviewScore).toBe(70);
    });
  });
});

// ============================================================
// Readiness Rollup Integration: new interview proof types
// ============================================================

describe("ReadinessRollupService with interview proof types", () => {
  it("contributes dsa-interview proofs to interview dimension", () => {
    const proofs: ProofRecord[] = [
      {
        id: "p1",
        proofType: "dsa-interview",
        capabilityId: "cap-dsa-problem-solving",
        skillId: "",
        topicId: "topic-array-two-sum",
        state: "completed",
        score: 4,
        artifactRef: null,
        submittedAt: "2026-06-01",
        completedAt: "2026-06-01",
        validatedAt: null,
        attemptCount: 1
      }
    ];

    const result = rollup.rollupTopic(
      "topic-array-two-sum",
      proofs,
      {},
      new Set()
    );

    expect(result.interview).toBeGreaterThan(0);
    expect(result.overall).toBeGreaterThan(0);
  });

  it("aggregates multiple interview proof types into interview dimension", () => {
    const proofs: ProofRecord[] = [
      {
        id: "p1", proofType: "dsa-interview",
        capabilityId: "cap-dsa-problem-solving", skillId: "", topicId: "topic-dsa-arrays",
        state: "completed", score: 4,
        artifactRef: null, submittedAt: "2026-06-01", completedAt: "2026-06-01", validatedAt: null, attemptCount: 1
      },
      {
        id: "p2", proofType: "lld-interview",
        capabilityId: "cap-low-level-design", skillId: "", topicId: "topic-lld-class-design",
        state: "completed", score: 3,
        artifactRef: null, submittedAt: "2026-06-01", completedAt: "2026-06-01", validatedAt: null, attemptCount: 1
      },
      {
        id: "p3", proofType: "behavioral-interview",
        capabilityId: "cap-behavioral-communication", skillId: "", topicId: "topic-behavioral-communication",
        state: "completed", score: 5,
        artifactRef: null, submittedAt: "2026-06-01", completedAt: "2026-06-01", validatedAt: null, attemptCount: 1
      }
    ];

    const dsa = rollup.rollupTopic("topic-dsa-arrays", proofs, {}, new Set());
    expect(dsa.interview).toBeGreaterThan(0);

    const lld = rollup.rollupTopic("topic-lld-class-design", proofs, {}, new Set());
    expect(lld.interview).toBeGreaterThan(0);

    const beh = rollup.rollupTopic("topic-behavioral-communication", proofs, {}, new Set());
    expect(beh.interview).toBeGreaterThan(0);
  });
});

// ============================================================
// Question Bank helpers
// ============================================================

describe("Interview Question Bank", () => {
  it("has at least 20 dsa questions", () => {
    const dsa = founderBetaInterviewQuestions.filter((q) => q.category === "dsa");
    expect(dsa.length).toBeGreaterThanOrEqual(20);
  });

  it("has at least 20 lld questions", () => {
    const lld = founderBetaInterviewQuestions.filter((q) => q.category === "lld");
    expect(lld.length).toBeGreaterThanOrEqual(20);
  });

  it("has at least 20 hld/system-design questions", () => {
    const hld = founderBetaInterviewQuestions.filter(
      (q) => q.category === "hld" || q.category === "system-design"
    );
    expect(hld.length).toBeGreaterThanOrEqual(20);
  });

  it("has at least 10 aws questions", () => {
    const aws = founderBetaInterviewQuestions.filter((q) => q.category === "aws");
    expect(aws.length).toBeGreaterThanOrEqual(10);
  });

  it("has at least 15 behavioral questions", () => {
    const beh = founderBetaInterviewQuestions.filter((q) => q.category === "behavioral");
    expect(beh.length).toBeGreaterThanOrEqual(15);
  });

  it("has at least 10 leadership questions", () => {
    const lead = founderBetaInterviewQuestions.filter((q) => q.category === "leadership");
    expect(lead.length).toBeGreaterThanOrEqual(10);
  });

  it("has at least 10 resume/project questions", () => {
    const resume = founderBetaInterviewQuestions.filter(
      (q) => q.category === "resume-deep-dive" || q.category === "project-deep-dive"
    );
    expect(resume.length).toBeGreaterThanOrEqual(10);
  });

  it("each question has required fields", () => {
    for (const q of founderBetaInterviewQuestions) {
      expect(q.id).toBeTruthy();
      expect(q.category).toBeTruthy();
      expect(q.capabilityId).toBeTruthy();
      expect(q.skillId).toBeTruthy();
      expect(q.topicId).toBeTruthy();
      expect(q.difficulty).toMatch(/^(easy|medium|hard)$/);
      expect(q.estimatedMinutes).toBeGreaterThan(0);
      expect(q.tags.length).toBeGreaterThan(0);
      expect(q.rubricIds.length).toBeGreaterThan(0);
      expect(q.prompt).toBeTruthy();
    }
  });
});

// ============================================================
// Rubric data integrity
// ============================================================

describe("Interview Rubrics", () => {
  it("all rubricIds in questions reference existing rubrics", () => {
    const rubricIds = new Set(founderBetaInterviewRubrics.map((r) => r.id));
    for (const q of founderBetaInterviewQuestions) {
      for (const rid of q.rubricIds) {
        expect(rubricIds.has(rid)).toBe(true);
      }
    }
  });

  it("each rubric has at least one criterion with weights and score levels", () => {
    for (const rubric of founderBetaInterviewRubrics) {
      expect(rubric.criteria.length).toBeGreaterThan(0);
      for (const criterion of rubric.criteria) {
        expect(criterion.maxScore).toBeGreaterThan(0);
        expect(criterion.weight).toBeGreaterThan(0);
        expect(criterion.scoreLevels.length).toBeGreaterThanOrEqual(3);
      }
    }
  });
});
