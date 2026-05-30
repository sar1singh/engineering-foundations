import type { TopicRelation } from "@/types/topic";
import { topics } from "@/data/topics";

export const topicRelations: TopicRelation[] = topics.flatMap((topic) => [
  ...topic.prerequisites.map((targetTopicId) => ({
    id: `relation-${targetTopicId}-${topic.id}-prerequisite`,
    sourceTopicId: targetTopicId,
    targetTopicId: topic.id,
    relationType: "prerequisite" as const
  })),
  ...topic.relatedTopics.map((targetTopicId) => ({
    id: `relation-${topic.id}-${targetTopicId}-related`,
    sourceTopicId: topic.id,
    targetTopicId,
    relationType: "related" as const
  }))
]);
