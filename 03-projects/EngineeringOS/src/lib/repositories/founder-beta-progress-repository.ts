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
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
    return progress;
  }

  async clearProgress(userId: string): Promise<void> {
    const store = await this.readStore();
    delete store.progressByUserId[userId];
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  }

  private async readStore(): Promise<FounderBetaProgressStore> {
    try {
      const raw = await fs.readFile(this.filePath, "utf8");
      const parsed = JSON.parse(raw) as Partial<FounderBetaProgressStore>;
      return {
        progressByUserId: parsed.progressByUserId ?? {}
      };
    } catch (error) {
      if (isFileMissingError(error)) {
        return { progressByUserId: {} };
      }

      throw error;
    }
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

function isFileMissingError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}
