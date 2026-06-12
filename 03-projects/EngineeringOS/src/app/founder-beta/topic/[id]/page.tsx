import { notFound } from "next/navigation";
import { founderBetaService } from "@/lib/services/founder-beta-service";
import { TopicLearningView } from "@/components/founder-beta/TopicLearningView";
import type { Capability } from "@/types/founder-beta";

export default async function FounderBetaTopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = founderBetaService.getTopicById(id);

  if (!topic) {
    notFound();
  }

  const capabilities = topic.capabilityIds
    .map((cid) => founderBetaService.getCapabilityById(cid))
    .filter((c): c is Capability => c !== null);

  const skills = topic.skillIds
    .map((sid) => founderBetaService.getSkillById(sid))
    .filter((s) => s !== null);

  const sources = founderBetaService.getSourcesForTopic(id);

  const missions = founderBetaService.getMissionsByTopicId(id);

  const prerequisiteTopics = topic.prerequisiteTopicIds
    .map((tid) => founderBetaService.getTopicById(tid))
    .filter((t) => t !== null);

  const relatedTopics = topic.relatedTopicIds
    .map((tid) => founderBetaService.getTopicById(tid))
    .filter((t) => t !== null);

  const successorTopics = topic.successorTopicIds
    .map((tid) => founderBetaService.getTopicById(tid))
    .filter((t) => t !== null);

  return (
    <div className="space-y-6">
      <TopicLearningView
        topic={topic}
        capabilities={capabilities}
        skills={skills.map((s) => ({ id: s.id, name: s.name }))}
        sources={sources}
        missions={missions}
        prerequisiteTopics={prerequisiteTopics.map((t) => ({ id: t.id, name: t.name }))}
        relatedTopics={relatedTopics.map((t) => ({ id: t.id, name: t.name }))}
        successorTopics={successorTopics.map((t) => ({ id: t.id, name: t.name }))}
      />
    </div>
  );
}
