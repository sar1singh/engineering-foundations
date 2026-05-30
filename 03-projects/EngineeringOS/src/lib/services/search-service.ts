import type { PracticeRepository } from "@/lib/repositories/practice-repository";
import type { ReferenceRepository } from "@/lib/repositories/reference-repository";
import type { RoadmapRepository } from "@/lib/repositories/roadmap-repository";
import type { TopicRepository } from "@/lib/repositories/topic-repository";
import type { PracticeTask } from "@/types/practice";
import type { ReferenceLink } from "@/types/reference";
import type { Roadmap } from "@/types/roadmap";
import type { Topic } from "@/types/topic";

export type SearchResults = {
  roadmaps: Roadmap[];
  topics: Topic[];
  tasks: PracticeTask[];
  references: ReferenceLink[];
};

export class SearchService {
  constructor(
    private readonly roadmapRepository: RoadmapRepository,
    private readonly topicRepository: TopicRepository,
    private readonly practiceRepository: PracticeRepository,
    private readonly referenceRepository: ReferenceRepository
  ) {}

  async search(query: string): Promise<SearchResults> {
    const normalized = query.trim().toLowerCase();
    const [roadmaps, topics, tasks, references] = await Promise.all([
      this.roadmapRepository.getAllRoadmaps(),
      this.topicRepository.searchTopics(query),
      this.practiceRepository.getAllTasks(),
      this.referenceRepository.getAllReferences()
    ]);

    if (!normalized) {
      return { roadmaps, topics, tasks, references };
    }

    return {
      roadmaps: roadmaps.filter((roadmap) => roadmap.title.toLowerCase().includes(normalized)),
      topics,
      tasks: tasks.filter((task) => task.title.toLowerCase().includes(normalized) || task.slug.includes(normalized)),
      references: references.filter((reference) => reference.title.toLowerCase().includes(normalized))
    };
  }
}
