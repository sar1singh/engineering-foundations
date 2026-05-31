export type LearningMode = "core-80-20" | "balanced" | "deep-mastery";

export type LearningPreferences = {
  targetRole: string;
  currentLevel: "junior" | "mid" | "senior" | "staff-em";
  hoursPerWeek: number;
  deadlineWeeks: number;
  weakAreas: string[];
  learningMode: LearningMode;
};

export const defaultLearningPreferences: LearningPreferences = {
  targetRole: "solution-architect",
  currentLevel: "senior",
  hoursPerWeek: 8,
  deadlineWeeks: 16,
  weakAreas: ["system-design", "aws"],
  learningMode: "core-80-20"
};
