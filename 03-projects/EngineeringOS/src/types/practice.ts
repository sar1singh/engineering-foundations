export type PracticeTask = {
  id: string;
  topicId: string;
  subtopicId?: string;
  title: string;
  slug: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedMinutes: number;
  taskType: "concept" | "coding" | "debugging" | "design" | "explain-back" | "revision";
  statement: string;
  subtasks: PracticeSubtask[];
  problemStatementId?: string;
  starterCode?: string;
  solutionApproach?: string;
  hints: string[];
  edgeCases: string[];
  completionCriteria: string[];
};

export type PracticeSubtask = {
  id: string;
  title: string;
  description: string;
  order: number;
  isRequired: boolean;
};
