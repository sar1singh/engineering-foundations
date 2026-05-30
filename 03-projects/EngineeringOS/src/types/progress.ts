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
