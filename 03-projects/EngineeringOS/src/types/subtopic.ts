import type { CodeExample } from "@/types/topic";

export type Subtopic = {
  id: string;
  topicId: string;
  title: string;
  slug: string;
  summary: string;
  order: number;
  theory: string;
  examples: CodeExample[];
  practiceTaskIds: string[];
  completionCriteria: string[];
};
