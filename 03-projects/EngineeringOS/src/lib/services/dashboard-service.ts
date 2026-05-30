import type { PracticeRepository } from "@/lib/repositories/practice-repository";
import type { ProgressRepository } from "@/lib/repositories/progress-repository";
import type { TopicRepository } from "@/lib/repositories/topic-repository";
import type { ReadinessScoreService } from "@/lib/services/readiness-score-service";
import type { RevisionService } from "@/lib/services/revision-service";
import type { RoadmapTreeService } from "@/lib/services/roadmap-tree-service";
import type { PracticeTask } from "@/types/practice";
import type { RoadmapTree } from "@/types/roadmap";
import type { RevisionPrompt, Topic } from "@/types/topic";

export type DashboardData = {
  roadmapTree: RoadmapTree | null;
  currentTopic: Topic | null;
  todayMission: PracticeTask | null;
  weakAreas: string[];
  revisionQueue: RevisionPrompt[];
  readinessScore: number;
};

export class DashboardService {
  constructor(
    private readonly roadmapTreeService: RoadmapTreeService,
    private readonly topicRepository: TopicRepository,
    private readonly practiceRepository: PracticeRepository,
    private readonly progressRepository: ProgressRepository,
    private readonly revisionService: RevisionService,
    private readonly readinessScoreService: ReadinessScoreService
  ) {}

  async getDashboard(): Promise<DashboardData> {
    const [roadmapTree, progress, revisionQueue, readinessScore] = await Promise.all([
      this.roadmapTreeService.getActiveRoadmapTree(),
      this.progressRepository.getCurrentProgress(),
      this.revisionService.getRevisionQueue(),
      this.readinessScoreService.getReadinessScore()
    ]);

    const allTopics = await this.topicRepository.getAllTopics();
    const currentTopic =
      allTopics.find((topic) => !progress.completedTopicIds.includes(topic.id)) ?? allTopics[0] ?? null;
    const todayMission = currentTopic
      ? (await this.practiceRepository.getTasksByTopicId(currentTopic.id))[0] ?? null
      : null;

    return {
      roadmapTree,
      currentTopic,
      todayMission,
      weakAreas: progress.weakAreas,
      revisionQueue,
      readinessScore
    };
  }
}
