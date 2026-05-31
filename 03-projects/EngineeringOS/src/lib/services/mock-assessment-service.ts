export type MockAssessmentInput = {
  answer: string;
  promptType: string;
  expectedSignals?: string[];
  rubric?: string[];
};

export type MockAssessment = {
  score: number;
  maxScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
};

export function evaluateMockAnswer(input: MockAssessmentInput): MockAssessment {
  const answer = input.answer.trim();
  const wordCount = answer.split(/\s+/).filter(Boolean).length;
  const hasExample = /example|for instance|e\.g\.|scenario|case/i.test(answer);
  const hasTradeoff = /trade-?off|cost|risk|alternative|because|however/i.test(answer);
  const hasVerification = /test|metric|verify|validate|measure|monitor|signal/i.test(answer);
  const expectedSignals = [...(input.expectedSignals ?? []), ...(input.rubric ?? [])];
  const signalHits = expectedSignals.filter((signal) => answer.toLowerCase().includes(signal.split(" ")[0].toLowerCase())).length;
  const score = Math.min(
    10,
    Math.max(
      2,
      (wordCount >= 60 ? 3 : wordCount >= 25 ? 2 : 1) +
        (hasExample ? 2 : 0) +
        (hasTradeoff ? 2 : 0) +
        (hasVerification ? 2 : 0) +
        Math.min(1, signalHits)
    )
  );
  const strengths = [
    wordCount >= 60 ? "Detailed answer with enough substance for review" : "Answer captured a starting point",
    hasExample ? "Includes a concrete example or scenario" : "Can be extended with a concrete example",
    hasTradeoff ? "Names risk, cost, alternative, or trade-off" : "Can add trade-off reasoning"
  ];
  const improvements = [
    hasVerification ? "Keep tying answers to measurable verification signals" : "Add a metric, test, or monitoring signal",
    wordCount >= 60 ? "Tighten the structure for interview delivery" : "Add definition, example, trade-off, and verification",
    input.promptType.includes("Mock") ? "Close with a concise interviewer-ready summary" : "Map the answer to the topic rubric"
  ];

  return {
    score,
    maxScore: 10,
    summary: `${input.promptType} mock evaluation: ${score}/10 based on structure, example, trade-off, and verification signal.`,
    strengths,
    improvements
  };
}
