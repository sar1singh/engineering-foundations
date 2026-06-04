import { founderBetaService } from "@/lib/services/founder-beta-service";
import type { DailyMission } from "@/types/founder-beta";

export type MissionSelectionMode = "weekday" | "weekend";

export type MissionSelectionInput = {
  availableMinutes?: number;
  mode?: MissionSelectionMode;
  completedMissionIds?: string[];
  completedTopicIds?: string[];
  previousMissionId?: string;
  previousTopicId?: string;
  weakAreaCapabilityIds?: string[];
  weakAreaTopicIds?: string[];
  revisionTopicIds?: string[];
  capabilityReadinessById?: Record<string, number | undefined>;
  hardGateReadiness?: {
    architectReadiness?: number;
    awsReadiness?: number;
    behavioralReadiness?: number;
    communicationReadiness?: number;
    resumeReadiness?: number;
    completedArchitectureCaseStudies?: number;
  };
};

export type MissionSelectionReason =
  | "hard-blocker"
  | "incomplete-previous"
  | "readiness-gap"
  | "roadmap-critical-path"
  | "weak-area"
  | "revision"
  | "optional-enrichment";

export type PrioritizedMission = {
  mission: DailyMission;
  score: number;
  reason: MissionSelectionReason;
};

export type TodayMissionSelection = {
  primaryMission: DailyMission | null;
  optionalMissions: DailyMission[];
  prioritizedMissions: PrioritizedMission[];
};

const missionPriority: Record<MissionSelectionReason, number> = {
  "hard-blocker": 700,
  "incomplete-previous": 600,
  "readiness-gap": 500,
  "roadmap-critical-path": 400,
  "weak-area": 300,
  revision: 200,
  "optional-enrichment": 100
};

export class FounderBetaMissionSelectionService {
  selectTodayMission(input: MissionSelectionInput = {}): TodayMissionSelection {
    const primaryMission = this.selectPrimaryMission(input);
    const optionalMissions = this.selectOptionalMissions(input, primaryMission?.id);

    return {
      primaryMission,
      optionalMissions,
      prioritizedMissions: this.prioritizeMissions(input)
    };
  }

  selectPrimaryMission(input: MissionSelectionInput = {}): DailyMission | null {
    const prioritized = this.prioritizeMissions(input);
    const availableMinutes = getAvailableMinutes(input);
    const fitting = prioritized.find(({ mission }) => mission.estimatedMinutes <= availableMinutes);

    return (fitting ?? prioritized[0])?.mission ?? null;
  }

  selectOptionalMissions(input: MissionSelectionInput = {}, primaryMissionId?: string): DailyMission[] {
    const availableMinutes = getAvailableMinutes(input);
    const primaryMission = primaryMissionId ? founderBetaService.getMissionById(primaryMissionId) : null;
    const remainingMinutes = Math.max(0, availableMinutes - (primaryMission?.estimatedMinutes ?? 0));

    if (remainingMinutes === 0) {
      return [];
    }

    return this.prioritizeMissions(input)
      .filter(({ mission }) => mission.id !== primaryMissionId)
      .filter(({ mission }) => !isCompletedMission(mission, input))
      .filter(({ mission }) => isOptionalCandidate(mission, input))
      .filter(({ mission }) => mission.estimatedMinutes <= remainingMinutes)
      .sort((left, right) => getOptionalMissionScore(right.mission, input) - getOptionalMissionScore(left.mission, input))
      .slice(0, 2)
      .map(({ mission }) => mission);
  }

  getMissionsForTimeBudget(minutes: number): DailyMission[] {
    const availableMinutes = clampMinutes(minutes);

    return founderBetaService
      .getFounderBetaDailyMissions()
      .filter((mission) => mission.estimatedMinutes <= availableMinutes);
  }

  prioritizeMissions(input: MissionSelectionInput = {}): PrioritizedMission[] {
    const roadmap = founderBetaService.getFounderBetaRoadmapProjection();
    const roadmapOrder = new Map(roadmap.missionIds.map((missionId, index) => [missionId, index]));

    return founderBetaService
      .getFounderBetaDailyMissions()
      .filter((mission) => !isCompletedMission(mission, input))
      .map((mission) => {
        const reason = this.getMissionSelectionReason(mission, input);
        const score = missionPriority[reason] + getRoadmapOrderBonus(mission, roadmapOrder);

        return { mission, score, reason };
      })
      .sort((left, right) => {
        if (right.score !== left.score) {
          return right.score - left.score;
        }

        return (roadmapOrder.get(left.mission.id) ?? Number.MAX_SAFE_INTEGER) - (roadmapOrder.get(right.mission.id) ?? Number.MAX_SAFE_INTEGER);
      });
  }

  getMissionSelectionReason(mission: DailyMission, input: MissionSelectionInput = {}): MissionSelectionReason {
    if (matchesHardBlocker(mission, input)) {
      return "hard-blocker";
    }

    if (matchesIncompletePrevious(mission, input)) {
      return "incomplete-previous";
    }

    if (matchesReadinessGap(mission, input)) {
      return "readiness-gap";
    }

    if (isRoadmapCriticalPath(mission)) {
      return "roadmap-critical-path";
    }

    if (matchesWeakArea(mission, input)) {
      return "weak-area";
    }

    if (matchesRevision(mission, input)) {
      return "revision";
    }

    return "optional-enrichment";
  }
}

export const founderBetaMissionSelectionService = new FounderBetaMissionSelectionService();

function matchesHardBlocker(mission: DailyMission, input: MissionSelectionInput): boolean {
  const gates = input.hardGateReadiness;

  if (!gates) {
    return false;
  }

  return (
    ((gates.architectReadiness ?? 100) < 75 && ["cap-system-design-hld", "cap-aws-cloud-architecture", "cap-career-assets"].includes(mission.capabilityId)) ||
    ((gates.awsReadiness ?? 100) < 70 && mission.capabilityId === "cap-aws-cloud-architecture") ||
    ((gates.behavioralReadiness ?? 100) < 70 && mission.capabilityId === "cap-behavioral-communication") ||
    ((gates.communicationReadiness ?? 100) < 70 && ["cap-behavioral-communication", "cap-system-design-hld"].includes(mission.capabilityId)) ||
    ((gates.resumeReadiness ?? 100) < 80 && mission.topicId === "topic-resume-positioning") ||
    ((gates.completedArchitectureCaseStudies ?? 3) < 3 && mission.missionType === "architecture-case-study")
  );
}

function matchesIncompletePrevious(mission: DailyMission, input: MissionSelectionInput): boolean {
  return (
    (input.previousMissionId === mission.id && !isCompletedMission(mission, input)) ||
    (input.previousTopicId === mission.topicId && !(input.completedTopicIds ?? []).includes(mission.topicId))
  );
}

function matchesReadinessGap(mission: DailyMission, input: MissionSelectionInput): boolean {
  const readiness = input.capabilityReadinessById?.[mission.capabilityId];

  return readiness !== undefined && readiness < 70;
}

function isRoadmapCriticalPath(mission: DailyMission): boolean {
  return founderBetaService.getFounderBetaRoadmapProjection().missionIds.includes(mission.id);
}

function matchesWeakArea(mission: DailyMission, input: MissionSelectionInput): boolean {
  return (
    (input.weakAreaCapabilityIds ?? []).includes(mission.capabilityId) ||
    (input.weakAreaTopicIds ?? []).includes(mission.topicId)
  );
}

function matchesRevision(mission: DailyMission, input: MissionSelectionInput): boolean {
  return mission.missionType === "revision" || (input.revisionTopicIds ?? []).includes(mission.topicId);
}

function isOptionalCandidate(mission: DailyMission, input: MissionSelectionInput): boolean {
  return mission.missionType === "revision" || mission.missionType === "weak-area-repair" || matchesRevision(mission, input) || matchesWeakArea(mission, input);
}

function isCompletedMission(mission: DailyMission, input: MissionSelectionInput): boolean {
  return (input.completedMissionIds ?? []).includes(mission.id);
}

function getAvailableMinutes(input: MissionSelectionInput): number {
  if (input.availableMinutes !== undefined) {
    return clampMinutes(input.availableMinutes);
  }

  return input.mode === "weekend" ? 180 : 60;
}

function clampMinutes(minutes: number): number {
  if (!Number.isFinite(minutes)) {
    return 0;
  }

  return Math.max(0, minutes);
}

function getRoadmapOrderBonus(mission: DailyMission, roadmapOrder: Map<string, number>): number {
  const order = roadmapOrder.get(mission.id);

  if (order === undefined) {
    return 0;
  }

  return Math.max(0, 50 - order);
}

function getOptionalMissionScore(mission: DailyMission, input: MissionSelectionInput): number {
  let score = 0;

  if (mission.missionType === "revision" || matchesRevision(mission, input)) {
    score += 300;
  }

  if (mission.missionType === "weak-area-repair") {
    score += 250;
  }

  if (matchesWeakArea(mission, input)) {
    score += 200;
  }

  score += Math.max(0, 120 - mission.estimatedMinutes);

  return score;
}
