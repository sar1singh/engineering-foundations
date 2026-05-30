export type UserProgress = {
  id: string;
  userId: string;
  completedTopicIds: string[];
  completedTaskIds: string[];
  weakAreas: string[];
  streakCount: number;
  lastActiveDate?: string;
  readinessScore: number;
  interviewReadinessPercent: number;
  createdAt: string;
  updatedAt: string;
};

export type ProgressOperationResult = {
  ok: boolean;
  progress: UserProgress;
  message?: string;
};

export type TopicProgressStatus = "not-started" | "in-progress" | "completed";
export type TaskProgressStatus = "not-started" | "in-progress" | "completed";
export type RevisionQueueStatus = "queued" | "completed" | "deferred";

export type UserTopicProgress = {
  id: string;
  userId: string;
  topicId: string;
  status: TopicProgressStatus;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type UserTaskProgress = {
  id: string;
  userId: string;
  taskId: string;
  status: TaskProgressStatus;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type ExplainBackAttempt = {
  id: string;
  userId: string;
  topicId: string;
  taskId?: string;
  answer: string;
  createdAt: string;
};

export type SavedEvaluationResult = {
  id: string;
  userId: string;
  topicId?: string;
  taskId?: string;
  explainBackAttemptId?: string;
  score: number;
  maxScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  evaluationSource: "mock" | "ai";
  createdAt: string;
};

export type RevisionQueueItem = {
  id: string;
  userId: string;
  topicId: string;
  revisionPromptId?: string;
  status: RevisionQueueStatus;
  nextReviewAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type UserWeakArea = {
  id: string;
  userId: string;
  topicId: string;
  reason: string;
  source: "manual" | "evaluation" | "practice";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
