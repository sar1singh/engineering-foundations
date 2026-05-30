import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EvaluationHistory } from "@/components/persistence/EvaluationHistory";
import { ExplainBackHistory } from "@/components/persistence/ExplainBackHistory";

describe("persistence history panels", () => {
  it("renders compact explain-back history", () => {
    render(
      <ExplainBackHistory
        attempts={[
          {
            id: "attempt-1",
            userId: "engineeringos-local-user",
            topicId: "js-fundamentals",
            answer: "Closures keep lexical scope.",
            createdAt: "2026-05-30T10:00:00.000Z"
          }
        ]}
      />
    );

    expect(screen.getByText("Saved attempts")).toBeInTheDocument();
    expect(screen.getByText("Closures keep lexical scope.")).toBeInTheDocument();
  });

  it("renders compact evaluation history", () => {
    render(
      <EvaluationHistory
        results={[
          {
            id: "evaluation-1",
            userId: "engineeringos-local-user",
            taskId: "task-js-fundamentals-core",
            score: 8,
            maxScore: 10,
            summary: "Strong solution.",
            strengths: ["Clear"],
            improvements: ["More edge cases"],
            evaluationSource: "mock",
            createdAt: "2026-05-30T10:00:00.000Z"
          }
        ]}
      />
    );

    expect(screen.getByText("Saved mock evaluations")).toBeInTheDocument();
    expect(screen.getByText("8/10 pts")).toBeInTheDocument();
    expect(screen.getByText("Strong solution.")).toBeInTheDocument();
  });
});
