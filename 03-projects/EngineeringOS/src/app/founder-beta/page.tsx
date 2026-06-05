import {
  FounderBetaManualProgressPanel,
  type FounderBetaInitialMode
} from "@/components/founder-beta/FounderBetaManualProgressPanel";
import {
  founderBetaDemoProgress,
  founderBetaWeakAreaProgress
} from "@/data/founder-beta";
import {
  founderBetaProgressPersistenceService
} from "@/lib/services/founder-beta-progress-persistence-service";
import type { FounderBetaProgressInput } from "@/lib/services/founder-beta-progress-adapter-service";
import { toFounderBetaProgressInput } from "@/lib/repositories/founder-beta-progress-repository";

export default async function FounderBetaPage({ searchParams }: { searchParams?: Promise<{ demo?: string }> }) {
  const params = await searchParams;
  const initialMode = getInitialMode(params?.demo);
  const persistedProgress = await founderBetaProgressPersistenceService.getStoredFounderBetaProgress();
  const initialProgress = persistedProgress ? toFounderBetaProgressInput(persistedProgress) : getFallbackProgress(initialMode);

  return (
    <FounderBetaManualProgressPanel
      initialMode={initialMode}
      initialProgress={initialProgress}
      isPersistedInitialProgress={Boolean(persistedProgress)}
    />
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
