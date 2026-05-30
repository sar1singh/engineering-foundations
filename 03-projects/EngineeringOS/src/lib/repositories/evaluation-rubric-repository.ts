import type { EvaluationRubric } from "@/types/evaluation";

export interface EvaluationRubricRepository {
  getRubricById(id: string): Promise<EvaluationRubric | null>;
  getRubricByTopicId(topicId: string): Promise<EvaluationRubric | null>;
  getRubricByTaskId(taskId: string): Promise<EvaluationRubric | null>;
}
