import { promises as fs } from "node:fs";
import path from "node:path";

import type {
  FounderBetaManualReadinessScores,
  FounderBetaProgressInput
} from "@/lib/services/founder-beta-progress-adapter-service";
import type { MissionSelectionMode } from "@/lib/services/founder-beta-mission-selection-service";
import type { MissionType, ProofScore } from "@/types/founder-beta";

export const FOUNDER_BETA_PROGRESS_SCHEMA_VERSION = 1;
export const FOUNDER_BETA_LOCAL_USER_ID = "founder-local";

export type FounderBetaPersistedProgress = {
  schemaVersion: typeof FOUNDER_BETA_PROGRESS_SCHEMA_VERSION;
  userId: string;
  completedMissionIds: string[];
  skippedMissionIds: string[];
  completedTopicIds: string[];
  weakAreaCapabilityIds: string[];
  weakAreaTopicIds: string[];
  manualReadinessScores: FounderBetaManualReadinessScores;
  proofScores: Record<string, ProofScore>;
  availableMinutes?: number;
  dayMode: MissionSelectionMode;
  preferredMissionTypes: MissionType[];
  createdAt: string;
  updatedAt: string;
};

export type SaveFounderBetaProgressInput = Omit<FounderBetaPersistedProgress, "createdAt" | "updatedAt"> & {
  createdAt?: string;
  updatedAt?: string;
};

export interface FounderBetaProgressRepository {
  getProgress(userId: string): Promise<FounderBetaPersistedProgress | null>;
  saveProgress(input: SaveFounderBetaProgressInput): Promise<FounderBetaPersistedProgress>;
  clearProgress(userId: string): Promise<void>;
}

type FounderBetaProgressStore = {
  progressByUserId: Record<string, FounderBetaPersistedProgress>;
};

export class FileFounderBetaProgressRepository implements FounderBetaProgressRepository {
  constructor(private readonly filePath = path.join(process.cwd(), ".engineeringos", "founder-beta-progress.json")) {}

  async getProgress(userId: string): Promise<FounderBetaPersistedProgress | null> {
    const store = await this.readStore();
    return store.progressByUserId[userId] ?? null;
  }

  async saveProgress(input: SaveFounderBetaProgressInput): Promise<FounderBetaPersistedProgress> {
    const store = await this.readStore();
    const existing = store.progressByUserId[input.userId];
    const now = new Date().toISOString();
    const progress: FounderBetaPersistedProgress = {
      ...input,
      createdAt: input.createdAt ?? existing?.createdAt ?? now,
      updatedAt: input.updatedAt ?? now
    };

    store.progressByUserId[input.userId] = progress;
    await this.writeStore(store);
    return progress;
  }

  async clearProgress(userId: string): Promise<void> {
    const store = await this.readStore();
    delete store.progressByUserId[userId];
    await this.writeStore(store);
  }

  private async readStore(): Promise<FounderBetaProgressStore> {
    try {
      const raw = await fs.readFile(this.filePath, "utf8");
      if (!raw.trim()) {
        return { progressByUserId: {} };
      }

      return normalizeStore(JSON.parse(raw));
    } catch (error) {
      if (isFileMissingError(error) || error instanceof SyntaxError) {
        return { progressByUserId: {} };
      }

      throw error;
    }
  }

  private async writeStore(store: FounderBetaProgressStore): Promise<void> {
    const directory = path.dirname(this.filePath);
    const tempFilePath = path.join(directory, `${path.basename(this.filePath)}.${process.pid}.tmp`);

    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(tempFilePath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
    await fs.rename(tempFilePath, this.filePath);
  }
}

export class InMemoryFounderBetaProgressRepository implements FounderBetaProgressRepository {
  private readonly progressByUserId = new Map<string, FounderBetaPersistedProgress>();

  async getProgress(userId: string): Promise<FounderBetaPersistedProgress | null> {
    return this.progressByUserId.get(userId) ?? null;
  }

  async saveProgress(input: SaveFounderBetaProgressInput): Promise<FounderBetaPersistedProgress> {
    const existing = this.progressByUserId.get(input.userId);
    const now = new Date().toISOString();
    const progress: FounderBetaPersistedProgress = {
      ...input,
      createdAt: input.createdAt ?? existing?.createdAt ?? now,
      updatedAt: input.updatedAt ?? now
    };

    this.progressByUserId.set(input.userId, progress);
    return progress;
  }

  async clearProgress(userId: string): Promise<void> {
    this.progressByUserId.delete(userId);
  }
}

export const fileFounderBetaProgressRepository = new FileFounderBetaProgressRepository();

export function toFounderBetaProgressInput(progress: FounderBetaPersistedProgress | null): FounderBetaProgressInput {
  if (!progress) {
    return {};
  }

  return {
    completedMissionIds: progress.completedMissionIds,
    skippedMissionIds: progress.skippedMissionIds,
    completedTopicIds: progress.completedTopicIds,
    weakAreaCapabilityIds: progress.weakAreaCapabilityIds,
    weakAreaTopicIds: progress.weakAreaTopicIds,
    manualReadinessScores: progress.manualReadinessScores,
    manualProofScores: progress.proofScores,
    availableMinutes: progress.availableMinutes,
    dayMode: progress.dayMode,
    preferredMissionTypes: progress.preferredMissionTypes
  };
}

function normalizeStore(input: unknown): FounderBetaProgressStore {
  if (!isRecord(input)) {
    return { progressByUserId: {} };
  }

  const progressByUserIdInput = input.progressByUserId;
  if (!isRecord(progressByUserIdInput)) {
    return { progressByUserId: {} };
  }

  const progressByUserId = Object.entries(progressByUserIdInput).reduce<Record<string, FounderBetaPersistedProgress>>(
    (result, [userId, progress]) => {
      const normalized = normalizeStoredProgress(userId, progress);

      if (normalized) {
        result[userId] = normalized;
      }

      return result;
    },
    {}
  );

  return { progressByUserId };
}

function normalizeStoredProgress(userId: string, input: unknown): FounderBetaPersistedProgress | null {
  if (!isRecord(input)) {
    return null;
  }

  const schemaVersion = typeof input.schemaVersion === "number" ? input.schemaVersion : FOUNDER_BETA_PROGRESS_SCHEMA_VERSION;

  // Future schema versions should be migrated explicitly here before being accepted.
  if (schemaVersion > FOUNDER_BETA_PROGRESS_SCHEMA_VERSION) {
    return null;
  }

  return {
    schemaVersion: FOUNDER_BETA_PROGRESS_SCHEMA_VERSION,
    userId: typeof input.userId === "string" ? input.userId : userId,
    completedMissionIds: normalizeStringArray(input.completedMissionIds),
    skippedMissionIds: normalizeStringArray(input.skippedMissionIds),
    completedTopicIds: normalizeStringArray(input.completedTopicIds),
    weakAreaCapabilityIds: normalizeStringArray(input.weakAreaCapabilityIds),
    weakAreaTopicIds: normalizeStringArray(input.weakAreaTopicIds),
    manualReadinessScores: isRecord(input.manualReadinessScores) ? input.manualReadinessScores : {},
    proofScores: normalizeProofScoreRecord(input.proofScores),
    availableMinutes: typeof input.availableMinutes === "number" ? input.availableMinutes : undefined,
    dayMode: input.dayMode === "weekend" ? "weekend" : "weekday",
    preferredMissionTypes: normalizeStringArray(input.preferredMissionTypes).filter(isMissionType),
    createdAt: typeof input.createdAt === "string" ? input.createdAt : new Date(0).toISOString(),
    updatedAt: typeof input.updatedAt === "string" ? input.updatedAt : new Date(0).toISOString()
  };
}

function normalizeStringArray(input: unknown): string[] {
  return Array.isArray(input) ? input.filter((item): item is string => typeof item === "string") : [];
}

function normalizeProofScoreRecord(input: unknown): Record<string, ProofScore> {
  if (!isRecord(input)) {
    return {};
  }

  return Object.entries(input).reduce<Record<string, ProofScore>>((result, [proofId, score]) => {
    if (typeof score === "number" && Number.isInteger(score) && score >= 0 && score <= 5) {
      result[proofId] = score as ProofScore;
    }

    return result;
  }, {});
}

function isMissionType(input: string): input is MissionType {
  return [
    "learn",
    "practice",
    "implement",
    "interview",
    "behavioral",
    "career-asset",
    "revision",
    "weak-area-repair",
    "architecture-case-study"
  ].includes(input);
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null;
}

function isFileMissingError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}
