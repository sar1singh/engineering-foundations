import {
  FounderBetaOrchestrationService,
  type FounderBetaTodayPlan
} from "@/lib/services/founder-beta-orchestration-service";
import {
  FounderBetaProgressAdapterService,
  type FounderBetaNormalizedProgressInput,
  type FounderBetaProgressInput
} from "@/lib/services/founder-beta-progress-adapter-service";
import type { DailyMission } from "@/types/founder-beta";

export type FounderBetaFacadePlan = {
  normalizedInput: FounderBetaNormalizedProgressInput;
  validationWarnings: string[];
  todayPlan: FounderBetaTodayPlan;
  readinessSnapshot: FounderBetaTodayPlan["readinessSnapshot"];
  primaryMission: DailyMission | null;
  optionalMissions: DailyMission[];
  nextActions: FounderBetaTodayPlan["nextRecommendedActions"];
};

export class FounderBetaFacadeService {
  constructor(
    private readonly progressAdapter = new FounderBetaProgressAdapterService(),
    private readonly orchestration = new FounderBetaOrchestrationService()
  ) {}

  getFounderBetaPlanFromProgress(input: FounderBetaProgressInput = {}): FounderBetaFacadePlan {
    const normalizedInput = this.progressAdapter.normalizeFounderBetaProgressInput(input);
    const todayPlanInput = this.progressAdapter.buildFounderBetaTodayPlanInput(input);
    const todayPlan = this.orchestration.getFounderBetaTodayPlan(todayPlanInput);

    return {
      normalizedInput,
      validationWarnings: normalizedInput.validationWarnings,
      todayPlan,
      readinessSnapshot: todayPlan.readinessSnapshot,
      primaryMission: todayPlan.primaryMission,
      optionalMissions: todayPlan.optionalMissions,
      nextActions: todayPlan.nextRecommendedActions
    };
  }

  getFounderBetaDefaultPlan(): FounderBetaFacadePlan {
    return this.getFounderBetaPlanFromProgress();
  }
}

export const founderBetaFacadeService = new FounderBetaFacadeService();
