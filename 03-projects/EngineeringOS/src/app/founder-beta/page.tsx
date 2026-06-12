import Link from "next/link";
import {
  FounderBetaManualProgressPanel,
  type FounderBetaInitialMode
} from "@/components/founder-beta/FounderBetaManualProgressPanel";
import { FounderBetaOnboardingInitializationPreview } from "@/components/founder-beta/FounderBetaOnboardingInitializationPreview";
import {
  founderBetaDemoProgress,
  founderBetaWeakAreaProgress
} from "@/data/founder-beta";
import {
  founderBetaProgressPersistenceService
} from "@/lib/services/founder-beta-progress-persistence-service";
import { founderBetaService } from "@/lib/services/founder-beta-service";
import type { FounderBetaProgressInput } from "@/lib/services/founder-beta-progress-adapter-service";
import { toFounderBetaProgressInput } from "@/lib/repositories/founder-beta-progress-repository";

export default async function FounderBetaPage({ searchParams }: { searchParams?: Promise<{ demo?: string }> }) {
  const params = await searchParams;
  const initialMode = getInitialMode(params?.demo);
  const persistedProgress = await founderBetaProgressPersistenceService.getStoredFounderBetaProgress();
  const initialProgress = persistedProgress ? toFounderBetaProgressInput(persistedProgress) : getFallbackProgress(initialMode);

  const missions = founderBetaService.getFounderBetaDailyMissions();
  const capabilities = founderBetaService.getFounderBetaCapabilities();

  return (
    <div className="space-y-6">
      <FounderBetaOnboardingInitializationPreview hasSavedProgress={Boolean(persistedProgress)} />

      {/* Mission Workspace */}
      <div className="eo-card p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-teal-700">Mission Workspace</p>
            <h2 className="mt-1 text-xl font-semibold">Today&apos;s Missions &amp; Topics</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {missions.length} available missions — click a topic to open its learning view
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {missions.slice(0, 6).map((mission) => {
            const cap = capabilities.find((c) => c.id === mission.capabilityId);
            return (
              <div key={mission.id} className="rounded border border-gray-200 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-block rounded bg-teal-100 px-1.5 py-0.5 text-xs font-medium text-teal-800">
                    {mission.missionType}
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    {mission.estimatedMinutes} min — {mission.mode}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium">{mission.objective}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <Link
                    href={`/founder-beta/topic/${mission.topicId}`}
                    className="rounded bg-teal-50 px-2 py-1 font-medium text-teal-700 underline hover:bg-teal-100"
                  >
                    View Topic →
                  </Link>
                  {cap && <span className="text-[var(--muted)]">{cap.name}</span>}
                </div>
                {mission.readinessImpact.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {mission.readinessImpact.map((impact) => (
                      <span
                        key={impact}
                        className="inline-block rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-800"
                      >
                        {impact}
                      </span>
                    ))}
                  </div>
                )}
                {mission.proofRequirements.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {mission.proofRequirements.map((proof) => (
                      <span
                        key={proof.id}
                        className="inline-block rounded border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-800"
                      >
                        {proof.proofType}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="eo-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-teal-700">Interview Simulation</p>
            <h2 className="mt-1 text-xl font-semibold">Practice interviews</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Run DSA, LLD, HLD, Behavioral, or Mixed-Architect interview sessions
            </p>
          </div>
          <Link
            className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
            href="/founder-beta/interview"
          >
            Open Interview Simulator
          </Link>
        </div>
      </div>
      <div className="eo-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-teal-700">Resource Explorer</p>
            <h2 className="mt-1 text-xl font-semibold">Browse curated sources</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Explore 158 sources across 40+ categories — filter by capability, topic, tier, and reliability
            </p>
          </div>
          <Link
            className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
            href="/founder-beta/resources"
          >
            Browse Resources
          </Link>
        </div>
      </div>
      <div className="eo-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-teal-700">Ingestion Preview</p>
            <h2 className="mt-1 text-xl font-semibold">Content ingestion simulation</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Simulate content ingestion review workflow — state machine from discovered through to published/rejected
            </p>
          </div>
          <Link
            className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
            href="/founder-beta/ingestion-preview"
          >
            Open Ingestion Preview
          </Link>
        </div>
      </div>
      <div className="eo-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-teal-700">Agent Discovery Preview</p>
            <h2 className="mt-1 text-xl font-semibold">Agent discovery simulation</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Manual review of agent-discovered candidates with dry-run agent runner — preview only, no runtime agents
            </p>
          </div>
          <Link
            className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
            href="/founder-beta/agent-discovery-preview"
          >
            Open Discovery Preview
          </Link>
        </div>
      </div>
      <div className="eo-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-teal-700">Runtime Fetch Preview</p>
            <h2 className="mt-1 text-xl font-semibold">Manual URL fetch</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Dry-run fetch over manually submitted URLs — validate, preview, and send candidates for manual review
            </p>
          </div>
          <Link
            className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
            href="/founder-beta/runtime-fetch-preview"
          >
            Open Runtime Fetch
          </Link>
        </div>
      </div>
      <FounderBetaManualProgressPanel
        initialMode={initialMode}
        initialProgress={initialProgress}
        isPersistedInitialProgress={Boolean(persistedProgress)}
      />
    </div>
  );
}

function getInitialMode(demo: string | undefined): FounderBetaInitialMode {
  if (demo === "1") {
    return "demo";
  }

  if (demo === "weak-area") {
    return "weak-area";
  }

  return "default";
}

function getFallbackProgress(mode: FounderBetaInitialMode): FounderBetaProgressInput {
  if (mode === "demo") {
    return founderBetaDemoProgress;
  }

  if (mode === "weak-area") {
    return founderBetaWeakAreaProgress;
  }

  return {
    completedMissionIds: [],
    completedTopicIds: [],
    weakAreaCapabilityIds: [],
    weakAreaTopicIds: [],
    manualReadinessScores: {},
    availableMinutes: 60,
    dayMode: "weekday"
  };
}
