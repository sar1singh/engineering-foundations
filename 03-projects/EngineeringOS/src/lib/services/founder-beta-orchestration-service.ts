import {
  FounderBetaReadinessService,
  type HardGateInput,
  type OfferReadinessInput,
  type OfferReadinessResult,
  type RoleReadinessInput
} from "@/lib/services/founder-beta-readiness-service";
import {
  FounderBetaMissionSelectionService,
  type MissionSelectionInput
} from "@/lib/services/founder-beta-mission-selection-service";
import { FounderBetaService } from "@/lib/services/founder-beta-service";
import type {
  DailyMission,
  FounderBetaPath,
  OfferReadinessSignal,
  ReadinessScore,
  RoadmapProjection
} from "@/types/founder-beta";

export type FounderBetaTodayPlanInput = MissionSelectionInput &
  HardGateInput &
  OfferReadinessInput & {
    roleReadinessInput?: RoleReadinessInput;
  };

export type FounderBetaRoadmapSummary = {
  id: string;
  target: string;
  timelineWeeks: number;
  hoursPerWeek: number;
  primaryRole: string;
  secondaryRole: string;
  capabilityCount: number;
  topicCount: number;
  missionCount: number;
};

export type FounderBetaReadinessSnapshot = {
  architectReadiness: number;
  roleReadiness: number;
  offerReadiness: OfferReadinessResult;
  hardGates: OfferReadinessResult["hardGates"];
  hardGatesPassed: boolean;
  readinessScores: ReadinessScore[];
};

export type FounderBetaNextAction = {
  id: string;
  label: string;
  reason: string;
  missionId?: string;
};

export type FounderBetaTodayPlan = {
  path: FounderBetaPath;
  roadmap: RoadmapProjection;
  roadmapSummary: FounderBetaRoadmapSummary;
  readinessSnapshot: FounderBetaReadinessSnapshot;
  primaryMission: DailyMission | null;
  optionalMissions: DailyMission[];
  weakAreas: {
    capabilityIds: string[];
    topicIds: string[];
  };
  offerReadinessSignals: OfferReadinessSignal[];
  nextRecommendedActions: FounderBetaNextAction[];
};

export class FounderBetaOrchestrationService {
  constructor(
    private readonly founderBeta = new FounderBetaService(),
    private readonly readiness = new FounderBetaReadinessService(),
    private readonly missionSelection = new FounderBetaMissionSelectionService()
  ) {}

  getFounderBetaTodayPlan(input: FounderBetaTodayPlanInput = {}): FounderBetaTodayPlan {
    const missionInput = this.getMissionSelectionInput(input);
    const missionSelection = this.missionSelection.selectTodayMission(missionInput);
    const readinessSnapshot = this.getFounderBetaReadinessSnapshot(input);

    return {
      path: this.founderBeta.getFounderBetaPath(),
      roadmap: this.founderBeta.getFounderBetaRoadmapProjection(),
      roadmapSummary: this.getFounderBetaRoadmapSummary(),
      readinessSnapshot,
      primaryMission: missionSelection.primaryMission,
      optionalMissions: missionSelection.optionalMissions,
      weakAreas: {
        capabilityIds: input.weakAreaCapabilityIds ?? [],
        topicIds: input.weakAreaTopicIds ?? []
      },
      offerReadinessSignals: this.founderBeta.getOfferReadinessSignals(),
      nextRecommendedActions: this.getFounderBetaNextActions(input, missionSelection, readinessSnapshot)
    };
  }

  getFounderBetaReadinessSnapshot(input: FounderBetaTodayPlanInput = {}): FounderBetaReadinessSnapshot {
    const roleReadiness = this.readiness.calculateRoleReadiness(input.roleReadinessInput ?? {});
    const architectReadiness = input.architectReadiness ?? roleReadiness;
    const offerReadiness = this.readiness.calculateOfferReadiness({
      ...input,
      architectReadiness
    });

    return {
      architectReadiness,
      roleReadiness,
      offerReadiness,
      hardGates: offerReadiness.hardGates,
      hardGatesPassed: offerReadiness.hardGatesPassed,
      readinessScores: [
        {
          id: "readiness-architect",
          label: "Architect Readiness",
          score: architectReadiness,
          confidence: architectReadiness > 0 ? 70 : 0,
          status: offerReadiness.hardGates.find((gate) => gate.id === "rule-architect-readiness")?.passed
            ? "ready"
            : "blocked"
        },
        {
          id: "readiness-offer",
          label: "Offer Readiness",
          score: offerReadiness.score,
          confidence: offerReadiness.score > 0 ? 65 : 0,
          status: offerReadiness.hardGatesPassed ? "ready" : "blocked"
        }
      ]
    };
  }

  getFounderBetaRoadmapSummary(): FounderBetaRoadmapSummary {
    const roadmap = this.founderBeta.getFounderBetaRoadmapProjection();

    return {
      id: roadmap.id,
      target: roadmap.target,
      timelineWeeks: roadmap.timelineWeeks,
      hoursPerWeek: roadmap.hoursPerWeek,
      primaryRole: roadmap.primaryRole,
      secondaryRole: roadmap.secondaryRole,
      capabilityCount: roadmap.capabilityIds.length,
      topicCount: roadmap.topicIds.length,
      missionCount: roadmap.missionIds.length
    };
  }

  getFounderBetaNextActions(
    input: FounderBetaTodayPlanInput = {},
    missionSelection = this.missionSelection.selectTodayMission(input),
    readinessSnapshot = this.getFounderBetaReadinessSnapshot(input)
  ): FounderBetaNextAction[] {
    const actions: FounderBetaNextAction[] = [];

    if (missionSelection.primaryMission) {
      actions.push({
        id: "action-start-primary-mission",
        label: "Start today's primary mission",
        reason: "Primary mission is the highest-ranked deterministic next step.",
        missionId: missionSelection.primaryMission.id
      });
    }

    const failedGate = readinessSnapshot.hardGates.find((gate) => !gate.passed);
    if (failedGate) {
      actions.push({
        id: `action-repair-${failedGate.id}`,
        label: `Repair ${failedGate.label}`,
        reason: `${failedGate.label} is below threshold (${failedGate.actual}/${failedGate.threshold}).`
      });
    }

    if ((input.weakAreaCapabilityIds?.length ?? 0) > 0 || (input.weakAreaTopicIds?.length ?? 0) > 0) {
      actions.push({
        id: "action-address-weak-area",
        label: "Address active weak area",
        reason: "Weak areas should be repaired before optional enrichment."
      });
    }

    return actions.slice(0, 3);
  }

  private getMissionSelectionInput(input: FounderBetaTodayPlanInput): MissionSelectionInput {
    return {
      ...input,
      hardGateReadiness: input.hardGateReadiness ?? {
        architectReadiness: input.architectReadiness,
        awsReadiness: input.awsReadiness,
        behavioralReadiness: input.behavioralReadiness,
        communicationReadiness: input.communicationReadiness,
        resumeReadiness: input.resumeReadiness,
        completedArchitectureCaseStudies: input.completedArchitectureCaseStudies
      }
    };
  }
}

export const founderBetaOrchestrationService = new FounderBetaOrchestrationService();
