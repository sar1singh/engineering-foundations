export type ContentSourceDomain = "dsa" | "system-design" | "lld" | "aws" | "staff-em" | "career" | "ai" | "foundations";

export type ContentUsagePolicy = {
  reuse: "reference-only" | "open-source-reference" | "public-practice-reference";
  note: string;
};

export type SourceCatalogEntry = {
  id: string;
  title: string;
  url: string;
  sourceType: "github-repo" | "platform" | "docs" | "course" | "topic-index";
  domains: ContentSourceDomain[];
  licenseNote: string;
  usagePolicy: ContentUsagePolicy;
  whyUseful: string;
};

export type SourceTopicMapping = {
  sourceId: string;
  topicSlugs: string[];
  usage: string;
  priority: "primary" | "supporting" | "verification";
};

export type EnrichedPracticeProblem = {
  id: string;
  title: string;
  sourceRefs: string[];
  originalStatement: string;
  pattern: string;
  difficulty: "easy" | "medium" | "hard";
  hints: string[];
  approach: string[];
  solutionLanguage: "typescript" | "javascript";
  solution: string;
  complexity: {
    time: string;
    space: string;
  };
  testCases: string[];
  commonMistakes: string[];
  interviewNarration: string;
};

export type EnrichedDesignCapstone = {
  id: string;
  prompt: string;
  sourceRefs: string[];
  requirements: string[];
  approach: string[];
  designBreakdown: string[];
  tradeoffs: string[];
  failureModes: string[];
  security: string[];
  observability: string[];
  awsVariant?: string[];
  rubric: string[];
  expectedSeniorSignals: string[];
};

export type EnrichedHandsOnLab = {
  id: string;
  title: string;
  goal: string;
  sourceRefs: string[];
  scenario: string;
  steps: string[];
  iacSnippet: string;
  validation: string[];
  cleanup: string[];
  safetyNotes: string[];
};

export type EnrichedTopicContent = {
  topicSlug: string;
  sourceRefs: string[];
  beginnerExplanation: string;
  deepExplanation: string;
  whyInterviewersAsk: string;
  prerequisites: string[];
  skipForNow: string[];
  roleRelevance: string[];
  estimatedTimeMinutes: number;
  interviewFrequency: "low" | "medium" | "high" | "very-high";
  lineByLineExplanation?: string[];
  enrichedProblems: EnrichedPracticeProblem[];
  designCapstones: EnrichedDesignCapstone[];
  handsOnLabs?: EnrichedHandsOnLab[];
};
