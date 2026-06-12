import Link from "next/link";
import { founderBetaService } from "@/lib/services/founder-beta-service";
import { ResourceExplorerPanel } from "@/components/founder-beta/ResourceExplorerPanel";
import type { MasterTopic } from "@/types/founder-beta";

export default function FounderBetaResourcesPage() {
  const allSources = founderBetaService.getAllSources();
  const capabilities = founderBetaService.getFounderBetaCapabilities();
  const categories = founderBetaService.getSourceCategories();
  const allTopics = founderBetaService.getFounderBetaTopics();

  const topicNamesByCapability: Record<string, Array<{ id: string; name: string; sourceIds: string[] }>> = {
    __all: allTopics.map((t: MasterTopic) => ({ id: t.id, name: t.name, sourceIds: t.sourceIds }))
  };

  for (const cap of capabilities) {
    const topics = founderBetaService.getTopicsByCapabilityId(cap.id);
    topicNamesByCapability[cap.id] = topics.map((t: MasterTopic) => ({ id: t.id, name: t.name, sourceIds: t.sourceIds }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-teal-700">Founder Beta</p>
          <h1 className="mt-1 text-xl font-semibold">Resource & Source Explorer</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Browse {allSources.length} curated sources across {categories.length} categories and {allTopics.length} topics
          </p>
        </div>
        <Link
          className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
          href="/founder-beta"
        >
          Back to Dashboard
        </Link>
      </div>

      <ResourceExplorerPanel
        sources={allSources}
        capabilities={capabilities}
        categories={categories}
        topicNamesByCapability={topicNamesByCapability}
      />
    </div>
  );
}
