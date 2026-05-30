export type EvaluationRubric = {
  id: string;
  topicId?: string;
  taskId?: string;
  criteria: EvaluationCriterion[];
};

export type EvaluationCriterion = {
  id: string;
  title: string;
  description: string;
  maxScore: number;
};
