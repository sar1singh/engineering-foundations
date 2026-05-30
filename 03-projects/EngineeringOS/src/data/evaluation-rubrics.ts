import type { EvaluationRubric } from "@/types/evaluation";
import { topics } from "@/data/topics";

export const evaluationRubrics: EvaluationRubric[] = topics.map((topic) => ({
  id: `rubric-${topic.id}-core`,
  topicId: topic.id,
  criteria: [
    {
      id: `criterion-${topic.id}-clarity`,
      title: "Clarity",
      description: `Explains ${topic.title} in direct language.`,
      maxScore: 5
    },
    {
      id: `criterion-${topic.id}-application`,
      title: "Application",
      description: `Applies ${topic.title} to a practical task or design case.`,
      maxScore: 5
    }
  ]
}));
