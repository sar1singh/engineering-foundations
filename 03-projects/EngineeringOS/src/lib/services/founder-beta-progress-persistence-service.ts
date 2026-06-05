import {
  fileFounderBetaProgressRepository,
  FOUNDER_BETA_LOCAL_USER_ID,
  FOUNDER_BETA_PROGRESS_SCHEMA_VERSION,
  toFounderBetaProgressInput,
  type FounderBetaPersistedProgress,
  type FounderBetaProgressRepository
} from "@/lib/repositories/founder-beta-progress-repository";
import {
  founderBetaFacadeService,
  type FounderBetaFacadePlan,
  type FounderBetaFacadeService
} from "@/lib/services/founder-beta-facade-service";
import {
  FounderBetaProgressAdapterService,
  type FounderBetaProgressInput
} from "@/lib/services/founder-beta-progress-adapter-service";

export type FounderBetaProgressPersistenceResult = {
  progress: FounderBetaPersistedProgress;
  validationWarnings: string[];
};

export class FounderBetaProgressPersistenceService {
  constructor(
    private readonly repository: FounderBetaProgressRepository = fileFounderBetaProgressRepository,
    private readonly adapter = new FounderBetaProgressAdapterService(),
    private readonly facade: FounderBetaFacadeService = founderBetaFacadeService
  ) {}

  async getFounderBetaProgress(userId = FOUNDER_BETA_LOCAL_USER_ID): Promise<FounderBetaPersistedProgress> {
    const stored = await this.repository.getProgress(userId);

    if (stored) {
      return stored;
    }

    return this.buildPersistedProgress({}, userId);
  }

  async getStoredFounderBetaProgress(userId = FOUNDER_BETA_LOCAL_USER_ID): Promise<FounderBetaPersistedProgress | null> {
    return this.repository.getProgress(userId);
  }

  async saveFounderBetaProgress(
    input: FounderBetaProgressInput = {},
    userId = FOUNDER_BETA_LOCAL_USER_ID
  ): Promise<FounderBetaProgressPersistenceResult> {
    const progress = this.buildPersistedProgress(input, userId);
    const saved = await this.repository.saveProgress(progress);

    return {
      progress: saved,
      validationWarnings: this.adapter.normalizeFounderBetaProgressInput(input).validationWarnings
    };
  }

  async updateFounderBetaProgress(
    patch: FounderBetaProgressInput = {},
    userId = FOUNDER_BETA_LOCAL_USER_ID
  ): Promise<FounderBetaProgressPersistenceResult> {
    const current = await this.repository.getProgress(userId);
    const merged: FounderBetaProgressInput = {
      ...toFounderBetaProgressInput(current),
      ...patch
    };

    return this.saveFounderBetaProgress(merged, userId);
  }

  async getFounderBetaPlanFromPersistedProgress(userId = FOUNDER_BETA_LOCAL_USER_ID): Promise<FounderBetaFacadePlan> {
    const progress = await this.repository.getProgress(userId);
    return this.facade.getFounderBetaPlanFromProgress(toFounderBetaProgressInput(progress));
  }

  async clearFounderBetaProgress(userId = FOUNDER_BETA_LOCAL_USER_ID): Promise<void> {
    await this.repository.clearProgress(userId);
  }

  buildPersistedProgress(input: FounderBetaProgressInput = {}, userId = FOUNDER_BETA_LOCAL_USER_ID): FounderBetaPersistedProgress {
    const normalized = this.adapter.normalizeFounderBetaProgressInput(input);

    return {
      schemaVersion: FOUNDER_BETA_PROGRESS_SCHEMA_VERSION,
      userId,
      completedMissionIds: normalized.completedMissionIds,
      skippedMissionIds: normalized.skippedMissionIds,
      completedTopicIds: normalized.completedTopicIds,
      weakAreaCapabilityIds: normalized.weakAreaCapabilityIds,
      weakAreaTopicIds: normalized.weakAreaTopicIds,
      manualReadinessScores: normalized.manualReadinessScores,
      proofScores: this.adapter.normalizeProofScores(input),
      availableMinutes: normalized.availableMinutes,
      dayMode: normalized.dayMode,
      preferredMissionTypes: normalized.preferredMissionTypes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}

export const founderBetaProgressPersistenceService = new FounderBetaProgressPersistenceService();
