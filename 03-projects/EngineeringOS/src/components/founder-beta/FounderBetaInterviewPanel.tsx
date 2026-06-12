"use client";

import { useCallback, useMemo, useState } from "react";
import { InterviewSimulationService } from "@/lib/services/founder-beta-interview-simulation-service";
import { InterviewEvaluationService } from "@/lib/services/founder-beta-interview-evaluation-service";
import { InterviewReadinessIntegrationService } from "@/lib/services/founder-beta-interview-readiness-integration";
import { ReadinessRollupService } from "@/lib/services/founder-beta-readiness-rollup-service";
import { OfferReadinessService } from "@/lib/services/founder-beta-offer-readiness-service";
import { getInterviewQuestionById } from "@/data/founder-beta/interview-questions";
import { founderBetaInterviewRubrics } from "@/data/founder-beta/interview-rubrics";
import type {
  InterviewEvaluationResult,
  InterviewSession,
  InterviewSessionType,
  RubricScore
} from "@/types/founder-beta";

const simulation = new InterviewSimulationService();
const evaluation = new InterviewEvaluationService();
const integration = new InterviewReadinessIntegrationService();
const rollup = new ReadinessRollupService();
const offerReadiness = new OfferReadinessService();

type InterviewStep = "select-type" | "in-progress" | "completed" | "timed-out";

function generateSampleRubricScores(session: InterviewSession): RubricScore[] {
  const usedIds = new Set<string>();
  for (const qid of session.questionIds) {
    const q = getInterviewQuestionById(qid);
    if (q) {
      for (const rid of q.rubricIds) {
        usedIds.add(rid);
      }
    }
  }
  const rubrics = founderBetaInterviewRubrics.filter((r) => usedIds.has(r.id));
  const scores: RubricScore[] = [];
  for (const rubric of rubrics) {
    for (const criterion of rubric.criteria) {
      scores.push({
        criterionId: criterion.id,
        score: 3,
        rationale: "Sample score — replace with actual evaluation"
      });
    }
  }
  return scores;
}

export function FounderBetaInterviewPanel() {
  const [step, setStep] = useState<InterviewStep>("select-type");
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [responseText, setResponseText] = useState("");
  const [timeSpent, setTimeSpent] = useState(120);
  const [evalResult, setEvalResult] = useState<InterviewEvaluationResult | null>(null);
  const [sessionType, setSessionType] = useState<InterviewSessionType>("dsa");

  const currentQuestion = useMemo(() => {
    if (!session || step !== "in-progress") return null;
    const qid = session.questionIds[session.currentQuestionIndex];
    return qid ? getInterviewQuestionById(qid) ?? null : null;
  }, [session, step]);

  const questionProgress = useMemo(() => {
    if (!session) return { current: 0, total: 0 };
    return {
      current: session.currentQuestionIndex + 1,
      total: session.questionIds.length
    };
  }, [session]);

  const handleStartSession = useCallback(() => {
    const newSession = simulation.createSession(sessionType);
    const started = simulation.startSession(newSession);
    setSession(started);
    setStep("in-progress");
    setResponseText("");
    setTimeSpent(120);
    setEvalResult(null);
  }, [sessionType]);

  const handleSubmitResponse = useCallback(() => {
    if (!session || !currentQuestion) return;
    const updated = simulation.addResponse(session, currentQuestion.id, responseText, timeSpent);
    setSession(updated);
    setResponseText("");
    setTimeSpent(120);
    if (updated.currentQuestionIndex >= updated.questionIds.length) {
      const completed = simulation.completeSession(updated);
      setSession(completed);
      const scores = generateSampleRubricScores(completed);
      const result = evaluation.evaluate(completed, scores);
      setEvalResult(result);
      setStep("completed");
    }
  }, [session, currentQuestion, responseText, timeSpent]);

  const handleCompleteSession = useCallback(() => {
    if (!session) return;
    const completed = simulation.completeSession(session);
    setSession(completed);
    const scores = generateSampleRubricScores(completed);
    const result = evaluation.evaluate(completed, scores);
    setEvalResult(result);
    setStep("completed");
  }, [session]);

  const handleTimeoutSession = useCallback(() => {
    if (!session) return;
    const timedOut = simulation.timeoutSession(session);
    setSession(timedOut);
    const scores = generateSampleRubricScores(timedOut);
    const result = evaluation.evaluate(timedOut, scores);
    setEvalResult(result);
    setStep("timed-out");
  }, [session]);

  const handleReset = useCallback(() => {
    setStep("select-type");
    setSession(null);
    setEvalResult(null);
    setResponseText("");
  }, []);

  const readyQuestions = useMemo(() => {
    if (!session) return [];
    return session.questionIds.map((qid) => getInterviewQuestionById(qid)).filter((q): q is NonNullable<typeof q> => q != null);
  }, [session]);

  const proofRecord = useMemo(() => {
    if (!evalResult || !session) return null;
    return integration.createProofRecord(evalResult, session);
  }, [evalResult, session]);

  const readinessImpact = useMemo(() => {
    if (!proofRecord) return null;
    const topicResult = rollup.rollupTopic(proofRecord.topicId || "topic-dsa-arrays", [proofRecord], {}, new Set());
    return topicResult.interview;
  }, [proofRecord]);

  const offerImpact = useMemo(() => {
    if (!proofRecord || !evalResult) return null;
    return offerReadiness.calculate({
      capabilityReadinessById: { [proofRecord.capabilityId]: proofRecord.score ? proofRecord.score * 20 : 0 },
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
  }, [proofRecord, evalResult]);

  return (
    <section className="space-y-6">
      <div className="eo-card p-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-teal-700">Founder Beta Interview</p>
          <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs font-semibold text-[var(--muted)]">
            Local only — no persistence
          </span>
        </div>
        <h1 className="mt-2 text-2xl font-semibold">Interview Simulation</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Practice DSA, LLD, HLD, Behavioral, or Mixed-Architect interviews. Sample rubric scores are applied (replace with real evaluation).
        </p>
      </div>

      {step === "select-type" && (
        <div className="eo-card p-5">
          <h2 className="text-lg font-semibold">Select Interview Type</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Choose a session type to begin a timed practice interview.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {(["dsa", "lld", "hld", "behavioral", "mixed-architect"] as const).map((type) => (
              <button
                key={type}
                className={`rounded-md border p-4 text-left transition-colors ${
                  sessionType === type
                    ? "border-teal-700 bg-teal-700/10"
                    : "border-[var(--border)] hover:border-teal-700/50"
                }`}
                type="button"
                onClick={() => setSessionType(type)}
              >
                <p className="font-semibold capitalize">{type.replace("-", " ")}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {simulation.createSession(type).questionIds.length} questions /{" "}
                  {simulation.createSession(type).timeLimitMinutes} min
                </p>
              </button>
            ))}
          </div>
          <button
            className="mt-4 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
            type="button"
            onClick={handleStartSession}
          >
            Start {sessionType.replace("-", " ")} session
          </button>
          {session && (
            <div className="mt-4">
              <p className="text-sm font-semibold">Questions in this session:</p>
              <ul className="mt-2 space-y-1">
                {readyQuestions.map((q, i) => (
                  <li key={q.id} className="rounded-md border border-[var(--border)] p-2 text-sm">
                    <span className="font-medium">Q{i + 1}:</span> {q.prompt.slice(0, 100)}...
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {step === "in-progress" && currentQuestion && (
        <div className="eo-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Question {questionProgress.current} of {questionProgress.total}
            </h2>
            <span className="text-sm text-[var(--muted)]">
              {currentQuestion.category} / {currentQuestion.difficulty}
            </span>
          </div>
          <div className="mt-4 rounded-md border border-[var(--border)] p-4">
            <p className="text-sm font-medium">{currentQuestion.prompt}</p>
            {currentQuestion.context && (
              <p className="mt-2 text-sm text-[var(--muted)]">{currentQuestion.context}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {currentQuestion.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm font-semibold" htmlFor="response">
              Your response
            </label>
            <textarea
              className="mt-2 min-h-[120px] w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-sm text-[var(--foreground)]"
              id="response"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Type your response here..."
            />
          </div>
          <div className="mt-3">
            <label className="text-sm font-semibold" htmlFor="timeSpent">
              Time spent (seconds)
            </label>
            <input
              className="mt-1 w-24 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm text-[var(--foreground)]"
              id="timeSpent"
              min={0}
              type="number"
              value={timeSpent}
              onChange={(e) => setTimeSpent(Number(e.target.value))}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!responseText.trim()}
              type="button"
              onClick={handleSubmitResponse}
            >
              {questionProgress.current < questionProgress.total
                ? "Submit & Next Question"
                : "Submit & Complete"}
            </button>
            <button
              className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-semibold"
              type="button"
              onClick={handleCompleteSession}
            >
              Complete session
            </button>
            <button
              className="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-700"
              type="button"
              onClick={handleTimeoutSession}
            >
              Timeout session
            </button>
          </div>
          <div className="mt-4">
            <p className="text-sm text-[var(--muted)]">
              Answered: {session?.responses.length ?? 0} / {session?.questionIds.length ?? 0}
            </p>
          </div>
        </div>
      )}

      {(step === "completed" || step === "timed-out") && evalResult && (
        <div className="space-y-5">
          <div className="eo-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Session {step === "completed" ? "Completed" : "Timed Out"}
              </h2>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  step === "completed"
                    ? "bg-teal-100 text-teal-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {step === "completed" ? "Completed" : "Timed Out"}
              </span>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-md border border-[var(--border)] p-3">
                <p className="text-sm text-[var(--muted)]">Overall Score</p>
                <p className="mt-1 text-2xl font-semibold">{evalResult.percentage}%</p>
              </div>
              <div className="rounded-md border border-[var(--border)] p-3">
                <p className="text-sm text-[var(--muted)]">Proof Score</p>
                <p className="mt-1 text-2xl font-semibold">{proofRecord?.score ?? "—"}/5</p>
              </div>
              <div className="rounded-md border border-[var(--border)] p-3">
                <p className="text-sm text-[var(--muted)]">Readiness Impact</p>
                <p className="mt-1 text-2xl font-semibold">{readinessImpact ?? "—"}/100</p>
              </div>
            </div>
            {proofRecord && (
              <div className="mt-4 rounded-md border border-[var(--border)] p-3">
                <p className="text-sm font-semibold">Proof Record</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Type: {proofRecord.proofType} | State: {proofRecord.state} | Score: {proofRecord.score}/5
                </p>
              </div>
            )}
            {offerImpact && (
              <div className="mt-4 rounded-md border border-[var(--border)] p-3">
                <p className="text-sm font-semibold">Offer Readiness Impact</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Overall: {offerImpact.overallScore}% | Band: {offerImpact.overallBand}
                </p>
              </div>
            )}
          </div>

          {evalResult.strengths.length > 0 && (
            <div className="eo-card p-5">
              <h3 className="text-sm font-semibold text-teal-700">Strengths</h3>
              <ul className="mt-2 space-y-1">
                {evalResult.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-[var(--muted)]">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {evalResult.weaknesses.length > 0 && (
            <div className="eo-card p-5">
              <h3 className="text-sm font-semibold text-red-700">Weaknesses</h3>
              <ul className="mt-2 space-y-1">
                {evalResult.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-[var(--muted)]">
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {evalResult.improvementAreas.length > 0 && (
            <div className="eo-card p-5">
              <h3 className="text-sm font-semibold text-amber-700">Improvement Areas</h3>
              <ul className="mt-2 space-y-1">
                {evalResult.improvementAreas.map((a, i) => (
                  <li key={i} className="text-sm text-[var(--muted)]">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {evalResult.categoryScores.length > 0 && (
            <div className="eo-card p-5">
              <h3 className="text-sm font-semibold">Category Breakdown</h3>
              <div className="mt-3 space-y-2">
                {evalResult.categoryScores.map((cs) => (
                  <div key={cs.category}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize">{cs.category.replace("-", " ")}</span>
                      <span>{cs.percentage}%</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-teal-700"
                        style={{ width: `${Math.max(0, Math.min(100, cs.percentage))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-semibold"
            type="button"
            onClick={handleReset}
          >
            Start New Session
          </button>
        </div>
      )}
    </section>
  );
}
