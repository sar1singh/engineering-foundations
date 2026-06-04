import { founderBetaService } from "@/lib/services/founder-beta-service";
import type { FounderBetaTodayPlanInput } from "@/lib/services/founder-beta-orchestration-service";
import type { MissionSelectionMode } from "@/lib/services/founder-beta-mission-selection-service";
import type { MissionType, ProofScore } from "@/types/founder-beta";

export type FounderBetaProgressInput = {
  completedMissionIds?: string[];
  skippedMissionIds?: string[];
  completedTopicIds?: string[];
  weakAreaCapabilityIds?: string[];
  weakAreaTopicIds?: string[];
  manualProofScores?: Record<string, number | undefined>;
  manualReadinessScores?: FounderBetaManualReadinessScores;
  availableMinutes?: number;
  dayMode?: MissionSelectionMode;
  currentMissionId?: string;
  preferredMissionTypes?: MissionType[];
};

export type FounderBetaManualReadinessScores = {
  architectReadiness?: number;
  awsReadiness?: number;
  behavioralReadiness?: number;
  communicationReadiness?: number;
  resumeReadiness?: number;
  linkedInReadiness?: number;
  githubReadiness?: number;
  portfolioReadiness?: number;
  interviewPipelineReadiness?: number;
  compensationReadiness?: number;
  capabilityReadinessById?: Record<string, number | undefined>;
  topicReadinessById?: Record<string, number | undefined>;
};

export type FounderBetaNormalizedProgressInput = Required<
  Pick<
    FounderBetaProgressInput,
    | "completedMissionIds"
    | "skippedMissionIds"
    | "completedTopicIds"
    | "weakAreaCapabilityIds"
    | "weakAreaTopicIds"
    | "manualProofScores"
    | "preferredMissionTypes"
  >
> & {
  manualReadinessScores: Required<Omit<FounderBetaManualReadinessScores, "capabilityReadinessById" | "topicReadinessById">> & {
    capabilityReadinessById: Record<string, number>;
    topicReadinessById: Record<string, number>;
  };
  availableMinutes?: number;
  dayMode: MissionSelectionMode;
  currentMissionId?: string;
  validationWarnings: string[];
};

export class FounderBetaProgressAdapterService {
  getDefaultFounderBetaProgressInput(): FounderBetaNormalizedProgressInput {
    return {
      completedMissionIds: [],
      skippedMissionIds: [],
      completedTopicIds: [],
      weakAreaCapabilityIds: [],
      weakAreaTopicIds: [],
      manualProofScores: {},
      manualReadinessScores: getDefaultReadinessScores(),
      dayMode: "weekday",
      preferredMissionTypes: [],
      validationWarnings: []
    };
  }

  normalizeFounderBetaProgressInput(input: FounderBetaProgressInput = {}): FounderBetaNormalizedProgressInput {
    const warnings: string[] = [];
    const completedMissionIds = normalizeKnownIds(input.completedMissionIds, getKnownMissionIds(), "mission", warnings);
    const skippedMissionIds = normalizeKnownIds(input.skippedMissionIds, getKnownMissionIds(), "mission", warnings);
    const completedTopicIds = normalizeKnownIds(input.completedTopicIds, getKnownTopicIds(), "topic", warnings);
    const explicitWeakCapabilities = normalizeKnownIds(input.weakAreaCapabilityIds, getKnownCapabilityIds(), "capability", warnings);
    const explicitWeakTopics = normalizeKnownIds(input.weakAreaTopicIds, getKnownTopicIds(), "topic", warnings);
    const manualReadinessScores = this.mergeManualReadinessScores(input);
    const derivedWeakAreas = this.deriveWeakAreas({
      weakAreaCapabilityIds: explicitWeakCapabilities,
      weakAreaTopicIds: explicitWeakTopics,
      manualReadinessScores
    });

    return {
      completedMissionIds,
      skippedMissionIds,
      completedTopicIds,
      weakAreaCapabilityIds: derivedWeakAreas.capabilityIds,
      weakAreaTopicIds: derivedWeakAreas.topicIds,
      manualProofScores: this.normalizeProofScores(input, warnings),
      manualReadinessScores,
      availableMinutes: normalizeOptionalMinutes(input.availableMinutes),
      dayMode: input.dayMode === "weekend" ? "weekend" : "weekday",
      currentMissionId: normalizeOptionalKnownId(input.currentMissionId, getKnownMissionIds(), "mission", warnings),
      preferredMissionTypes: normalizeMissionTypes(input.preferredMissionTypes),
      validationWarnings: warnings
    };
  }

  buildFounderBetaTodayPlanInput(input: FounderBetaProgressInput = {}): FounderBetaTodayPlanInput {
    const normalized = this.normalizeFounderBetaProgressInput(input);
    const readiness = normalized.manualReadinessScores;
    const completedArchitectureCaseStudies = countCompletedArchitectureCaseStudies(normalized.completedMissionIds);

    return {
      availableMinutes: normalized.availableMinutes,
      mode: normalized.dayMode,
      completedMissionIds: normalized.completedMissionIds,
      completedTopicIds: normalized.completedTopicIds,
      previousMissionId: normalized.currentMissionId,
      weakAreaCapabilityIds: normalized.weakAreaCapabilityIds,
      weakAreaTopicIds: normalized.weakAreaTopicIds,
      capabilityReadinessById: readiness.capabilityReadinessById,
      architectReadiness: readiness.architectReadiness,
      awsReadiness: readiness.awsReadiness,
      behavioralReadiness: readiness.behavioralReadiness,
      communicationReadiness: readiness.communicationReadiness,
      resumeReadiness: readiness.resumeReadiness,
      linkedInReadiness: readiness.linkedInReadiness,
      githubReadiness: readiness.githubReadiness,
      portfolioReadiness: readiness.portfolioReadiness,
      interviewPipelineReadiness: readiness.interviewPipelineReadiness,
      compensationReadiness: readiness.compensationReadiness,
      completedArchitectureCaseStudies,
      hardGateReadiness: {
        architectReadiness: readiness.architectReadiness,
        awsReadiness: readiness.awsReadiness,
        behavioralReadiness: readiness.behavioralReadiness,
        communicationReadiness: readiness.communicationReadiness,
        resumeReadiness: readiness.resumeReadiness,
        completedArchitectureCaseStudies
      }
    };
  }

  mergeManualReadinessScores(input: FounderBetaProgressInput = {}): FounderBetaNormalizedProgressInput["manualReadinessScores"] {
    const scores = input.manualReadinessScores ?? {};

    return {
      architectReadiness: clampReadiness(scores.architectReadiness),
      awsReadiness: clampReadiness(scores.awsReadiness),
      behavioralReadiness: clampReadiness(scores.behavioralReadiness),
      communicationReadiness: clampReadiness(scores.communicationReadiness),
      resumeReadiness: clampReadiness(scores.resumeReadiness),
      linkedInReadiness: clampReadiness(scores.linkedInReadiness),
      githubReadiness: clampReadiness(scores.githubReadiness),
      portfolioReadiness: clampReadiness(scores.portfolioReadiness),
      interviewPipelineReadiness: clampReadiness(scores.interviewPipelineReadiness),
      compensationReadiness: clampReadiness(scores.compensationReadiness),
      capabilityReadinessById: normalizeReadinessMap(scores.capabilityReadinessById, getKnownCapabilityIds()),
      topicReadinessById: normalizeReadinessMap(scores.topicReadinessById, getKnownTopicIds())
    };
  }

  normalizeProofScores(input: FounderBetaProgressInput = {}, warnings: string[] = []): Record<string, ProofScore> {
    const knownProofIds = getKnownProofIds();

    return Object.entries(input.manualProofScores ?? {}).reduce<Record<string, ProofScore>>((result, [proofId, score]) => {
      if (!knownProofIds.has(proofId)) {
        warnings.push(`Unknown proof id ignored: ${proofId}`);
        return result;
      }

      result[proofId] = clampProofScore(score);
      return result;
    }, {});
  }

  deriveWeakAreas(input: {
    weakAreaCapabilityIds?: string[];
    weakAreaTopicIds?: string[];
    manualReadinessScores?: FounderBetaNormalizedProgressInput["manualReadinessScores"];
  }): { capabilityIds: string[]; topicIds: string[] } {
    const readiness = input.manualReadinessScores ?? getDefaultReadinessScores();
    const weakCapabilityIds = Object.entries(readiness.capabilityReadinessById)
      .filter(([, score]) => score > 0 && score < 70)
      .map(([capabilityId]) => capabilityId);
    const weakTopicIds = Object.entries(readiness.topicReadinessById)
      .filter(([, score]) => score > 0 && score < 70)
      .map(([topicId]) => topicId);

    return {
      capabilityIds: dedupe([...(input.weakAreaCapabilityIds ?? []), ...weakCapabilityIds]),
      topicIds: dedupe([...(input.weakAreaTopicIds ?? []), ...weakTopicIds])
    };
  }
}

export const founderBetaProgressAdapterService = new FounderBetaProgressAdapterService();

function getDefaultReadinessScores(): FounderBetaNormalizedProgressInput["manualReadinessScores"] {
  return {
    architectReadiness: 0,
    awsReadiness: 0,
    behavioralReadiness: 0,
    communicationReadiness: 0,
    resumeReadiness: 0,
    linkedInReadiness: 0,
    githubReadiness: 0,
    portfolioReadiness: 0,
    interviewPipelineReadiness: 0,
    compensationReadiness: 0,
    capabilityReadinessById: {},
    topicReadinessById: {}
  };
}

function normalizeKnownIds(ids: string[] | undefined, knownIds: Set<string>, label: string, warnings: string[]): string[] {
  return dedupe(ids ?? []).filter((id) => {
    const known = knownIds.has(id);

    if (!known) {
      warnings.push(`Unknown ${label} id ignored: ${id}`);
    }

    return known;
  });
}

function normalizeOptionalKnownId(id: string | undefined, knownIds: Set<string>, label: string, warnings: string[]): string | undefined {
  if (id === undefined) {
    return undefined;
  }

  if (!knownIds.has(id)) {
    warnings.push(`Unknown ${label} id ignored: ${id}`);
    return undefined;
  }

  return id;
}

function normalizeReadinessMap(scores: Record<string, number | undefined> | undefined, knownIds: Set<string>): Record<string, number> {
  return Object.entries(scores ?? {}).reduce<Record<string, number>>((result, [id, score]) => {
    if (knownIds.has(id)) {
      result[id] = clampReadiness(score);
    }

    return result;
  }, {});
}

function normalizeMissionTypes(types: MissionType[] | undefined): MissionType[] {
  const knownTypes: MissionType[] = [
    "learn",
    "practice",
    "implement",
    "interview",
    "behavioral",
    "career-asset",
    "revision",
    "weak-area-repair",
    "architecture-case-study"
  ];
  const knownTypeSet = new Set(knownTypes);

  return dedupe(types ?? []).filter((type) => knownTypeSet.has(type));
}

function countCompletedArchitectureCaseStudies(completedMissionIds: string[]): number {
  const completed = new Set(completedMissionIds);

  return founderBetaService
    .getFounderBetaDailyMissions()
    .filter((mission) => completed.has(mission.id) && mission.missionType === "architecture-case-study").length;
}

function getKnownMissionIds(): Set<string> {
  return new Set(founderBetaService.getFounderBetaDailyMissions().map((mission) => mission.id));
}

function getKnownTopicIds(): Set<string> {
  return new Set(founderBetaService.getFounderBetaTopics().map((topic) => topic.id));
}

function getKnownCapabilityIds(): Set<string> {
  return new Set(founderBetaService.getFounderBetaCapabilities().map((capability) => capability.id));
}

function getKnownProofIds(): Set<string> {
  return new Set(
    founderBetaService
      .getFounderBetaDailyMissions()
      .flatMap((mission) => mission.proofRequirements.map((proof) => proof.id))
  );
}

function dedupe<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function normalizeOptionalMinutes(minutes: number | undefined): number | undefined {
  if (minutes === undefined) {
    return undefined;
  }

  if (!Number.isFinite(minutes)) {
    return 0;
  }

  return Math.max(0, Math.round(minutes));
}

function clampReadiness(score: number | undefined): number {
  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round((score ?? 0) * 100) / 100));
}

function clampProofScore(score: number | undefined): ProofScore {
  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.max(0, Math.min(5, Math.round(score ?? 0))) as ProofScore;
}
