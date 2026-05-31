import { roleLearningRoadmaps } from "@/data/syllabus/role-learning-roadmaps";
import type { SyllabusDomain, SyllabusTopic } from "@/types/syllabus";
import type { UserProgress } from "@/types/progress";

export type RoleReadiness = {
  slug: string;
  title: string;
  completed: number;
  total: number;
  percent: number;
  nextTopic: SyllabusTopic | null;
};

export type DomainReadiness = {
  slug: string;
  title: string;
  completed: number;
  total: number;
  percent: number;
};

export function getRoleReadiness(domains: SyllabusDomain[], progress: UserProgress): RoleReadiness[] {
  const topicBySlug = new Map(flattenTopics(domains).map((topic) => [topic.slug, topic]));
  const completed = new Set(progress.completedTopicIds);

  return roleLearningRoadmaps.map((roadmap) => {
    const topics = roadmap.topicSlugs.map((slug) => topicBySlug.get(slug)).filter((topic): topic is SyllabusTopic => Boolean(topic));
    const completedCount = topics.filter((topic) => completed.has(topic.id)).length;

    return {
      slug: roadmap.slug,
      title: roadmap.title,
      completed: completedCount,
      total: topics.length,
      percent: topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0,
      nextTopic: topics.find((topic) => !completed.has(topic.id)) ?? topics[0] ?? null
    };
  });
}

export function getDomainReadiness(domains: SyllabusDomain[], progress: UserProgress): DomainReadiness[] {
  const completed = new Set(progress.completedTopicIds);

  return domains.map((domain) => {
    const topics = domain.modules.flatMap((module) => module.topics);
    const completedCount = topics.filter((topic) => completed.has(topic.id)).length;

    return {
      slug: domain.slug,
      title: domain.title,
      completed: completedCount,
      total: topics.length,
      percent: topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0
    };
  });
}

function flattenTopics(domains: SyllabusDomain[]): SyllabusTopic[] {
  return domains.flatMap((domain) => domain.modules.flatMap((module) => module.topics));
}
