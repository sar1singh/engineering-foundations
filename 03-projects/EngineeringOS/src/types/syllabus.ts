export type SyllabusDifficulty = "easy" | "medium" | "hard";

export type SyllabusProgressSignal =
  | "read_definition"
  | "read_theory"
  | "studied_code_example"
  | "ran_code_example"
  | "solved_easy_problem"
  | "solved_medium_problem"
  | "solved_hard_problem"
  | "submitted_explain_back"
  | "completed_mock_review"
  | "scheduled_revision";

export type SyllabusCodeExample = {
  id: string;
  title: string;
  language: "javascript" | "typescript" | "sql" | "python" | "text";
  code: string;
  explanation: string;
  runnable: boolean;
};

export type SyllabusPracticeProblem = {
  id: string;
  title: string;
  difficulty: SyllabusDifficulty;
  tags: string[];
  prompt: string;
  starterCode?: string;
  expectedSignals: string[];
};

export type SyllabusReviewPrompt = {
  id: string;
  reviewerRole: "self" | "mock-ai-auditor" | "mentor";
  prompt: string;
  rubric: string[];
};

export type SyllabusReference = {
  id: string;
  title: string;
  url: string;
  sourceType: "article" | "docs" | "practice" | "video" | "roadmap";
  usage: string;
};

export type SyllabusTopic = {
  id: string;
  slug: string;
  title: string;
  order: number;
  sourcePath: string;
  definition: string;
  whyItMatters: string;
  mentalModel: string;
  theory: string;
  codeExamples: SyllabusCodeExample[];
  practiceProblems: SyllabusPracticeProblem[];
  interviewQuestions: string[];
  commonMistakes: string[];
  productionUseCases: string[];
  revisionPrompts: string[];
  reviewPrompts: SyllabusReviewPrompt[];
  references: SyllabusReference[];
  progressSignals: SyllabusProgressSignal[];
};

export type SyllabusModule = {
  id: string;
  slug: string;
  title: string;
  order: number;
  sourcePath: string;
  goal: string;
  topics: SyllabusTopic[];
};

export type SyllabusDomain = {
  id: string;
  slug: string;
  title: string;
  order: number;
  sourcePath: string;
  goal: string;
  modules: SyllabusModule[];
};

export type MockSyllabusCatalog = {
  id: string;
  title: string;
  sourceRoots: string[];
  importNotes: string[];
  domains: SyllabusDomain[];
};
