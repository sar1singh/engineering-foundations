export type Difficulty = "easy" | "medium" | "hard" | "expert";

export type LearningModeContent = {
  summary: string;
  mustKnow: string[];
  skipForNow: string[];
  practiceFocus: string[];
  passCriteria: string[];
};

export type CodeExample = {
  title: string;
  language: "javascript" | "typescript" | "sql" | "python" | "text";
  code: string;
  explanation: string;
};

export type Topic = {
  id: string;
  moduleId: string;
  title: string;
  slug: string;
  summary: string;
  whyItMatters: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  tags: string[];
  prerequisites: string[];
  relatedTopics: string[];
  advancedTopics: string[];
  roleRelevance: string[];
  companyRelevance: string[];
  interviewRelevance: number;
  learningModes: {
    fastTrack: LearningModeContent;
    deepMastery: LearningModeContent;
  };
  theory: string;
  mentalModel: string;
  codeExamples: CodeExample[];
  productionUseCases: string[];
  commonMistakes: string[];
  subtopicIds: string[];
  practiceTaskIds: string[];
  interviewQuestionIds: string[];
  referenceLinkIds: string[];
  revisionPromptIds: string[];
  explainBackPrompt: string;
  evaluationRubricId: string;
  completionCriteria: string[];
  createdAt: string;
  updatedAt: string;
};

export type InterviewQuestion = {
  id: string;
  topicId: string;
  question: string;
  answer?: string;
  level: "easy" | "medium" | "hard";
};

export type RevisionPrompt = {
  id: string;
  topicId: string;
  prompt: string;
  frequency: "daily" | "weekly" | "monthly";
};

export type TopicRelation = {
  id: string;
  sourceTopicId: string;
  targetTopicId: string;
  relationType: "prerequisite" | "related" | "advanced";
};
