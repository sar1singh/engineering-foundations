import Link from "next/link";
import { founderBetaService } from "@/lib/services/founder-beta-service";
import { contentRegistry } from "@/lib/services/content-registry";
import { ContentExplorer } from "@/components/founder-beta/ContentExplorer";
import type { Skill } from "@/types/founder-beta";

export default function FounderBetaContentPage() {
  const capabilities = founderBetaService.getFounderBetaCapabilities();
  const skills = founderBetaService.getFounderBetaSkills();
  const allTopics = founderBetaService.getFounderBetaTopics();
  const allSources = founderBetaService.getAllSources();
  const coverage = contentRegistry.computeCoverageSummary();
  const gaps = contentRegistry.detectGaps();
  const registry = contentRegistry.buildRegistry();

  const topicsByCapabilityId = registry.topicsByCapabilityId;
  const topicsBySkillId = registry.topicsBySkillId;
  const sourcesByCapabilityId = registry.sourcesByCapabilityId;

  const skillsByCapabilityId: Record<string, Skill[]> = {};
  for (const cap of capabilities) {
    skillsByCapabilityId[cap.id] = skills.filter((s: Skill) => s.capabilityId === cap.id);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-teal-700">Founder Beta</p>
          <h1 className="mt-1 text-xl font-semibold">Content Registry & Coverage</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {registry.totalCapabilities} capabilities, {registry.totalSkills} skills, {registry.totalTopics} topics, {registry.totalSources} sources &mdash; {gaps.totalGaps} gap{gaps.totalGaps !== 1 ? "s" : ""} detected
          </p>
        </div>
        <Link
          className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
          href="/founder-beta"
        >
          Back to Dashboard
        </Link>
      </div>

      <ContentExplorer
        capabilities={capabilities}
        skillsByCapabilityId={skillsByCapabilityId}
        allTopics={allTopics}
        allSources={allSources}
        topicsByCapabilityId={topicsByCapabilityId}
        topicsBySkillId={topicsBySkillId}
        sourcesByCapabilityId={sourcesByCapabilityId}
        coverage={coverage}
        gaps={gaps}
      />
    </div>
  );
}
