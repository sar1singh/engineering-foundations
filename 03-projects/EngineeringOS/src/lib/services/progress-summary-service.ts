import type { PracticeRepository } from "@/lib/repositories/practice-repository";
import type { ProgressRepository } from "@/lib/repositories/progress-repository";
import type { TopicRepository } from "@/lib/repositories/topic-repository";
import type { PracticeTask } from "@/types/practice";
import type { UserProgress } from "@/types/progress";
import type { Topic } from "@/types/topic";

export type ProgressSummary = {
  progress: UserProgress;
  completedTopics: Topic[];
  completedTasks: PracticeTask[];
  weakTopics: Topic[];
  totalTopics: number;
  totalTasks: number;
};

export class ProgressSummaryService {
  constructor(
    private readonly progressRepository: ProgressRepository,
    private readonly topicRepository: TopicRepository,
    private readonly practiceRepository: PracticeRepository
  ) {}

  async getProgressSummary(): Promise<ProgressSummary> {
    const [progress, topics, tasks] = await Promise.all([
      this.progressRepository.getCurrentProgress(),
      this.topicRepository.getAllTopics(),
      this.practiceRepository.getAllTasks()
    ]);

    return {
      progress,
      completedTopics: topics.filter((topic) => progress.completedTopicIds.includes(topic.id)),
      completedTasks: tasks.filter((task) => progress.completedTaskIds.includes(task.id)),
      weakTopics: topics.filter((topic) => progress.weakAreas.includes(topic.id)),
      totalTopics: topics.length,
      totalTasks: tasks.length
    };
  }
}
