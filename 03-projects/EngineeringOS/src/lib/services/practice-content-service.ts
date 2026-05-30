import type { EvaluationRubricRepository } from "@/lib/repositories/evaluation-rubric-repository";
import type { PracticeRepository } from "@/lib/repositories/practice-repository";
import type { ProblemRepository } from "@/lib/repositories/problem-repository";
import type { TopicRepository } from "@/lib/repositories/topic-repository";
import type { EvaluationRubric } from "@/types/evaluation";
import type { PracticeTask } from "@/types/practice";
import type { ProblemStatement } from "@/types/problem";
import type { Topic } from "@/types/topic";

export type PracticeContent = {
  task: PracticeTask;
  topic: Topic | null;
  problemStatement: ProblemStatement | null;
  evaluationRubric: EvaluationRubric | null;
};

export class PracticeContentService {
  constructor(
    private readonly practiceRepository: PracticeRepository,
    private readonly topicRepository: TopicRepository,
    private readonly problemRepository: ProblemRepository,
    private readonly evaluationRubricRepository: EvaluationRubricRepository
  ) {}

  async getPracticeContentById(taskId: string): Promise<PracticeContent | null> {
    const task = await this.practiceRepository.getTaskById(taskId);
    return task ? this.getPracticeContent(task) : null;
  }

  async getPracticeContentBySlug(slug: string): Promise<PracticeContent | null> {
    const task = await this.practiceRepository.getTaskBySlug(slug);
    return task ? this.getPracticeContent(task) : null;
  }

  private async getPracticeContent(task: PracticeTask): Promise<PracticeContent> {
    const [topic, problemStatement, taskRubric, topicRubric] = await Promise.all([
      this.topicRepository.getTopicById(task.topicId),
      task.problemStatementId ? this.problemRepository.getProblemById(task.problemStatementId) : Promise.resolve(null),
      this.evaluationRubricRepository.getRubricByTaskId(task.id),
      this.evaluationRubricRepository.getRubricByTopicId(task.topicId)
    ]);

    return {
      task,
      topic,
      problemStatement,
      evaluationRubric: taskRubric ?? topicRubric
    };
  }
}
