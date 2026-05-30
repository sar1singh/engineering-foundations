import type { ProgressRepository } from "@/lib/repositories/progress-repository";
import type { ProgressOperationResult, UserWeakArea } from "@/types/progress";

export class ReadinessScoreService {
  constructor(private readonly progressRepository: ProgressRepository) {}

  async getReadinessScore(): Promise<number> {
    const progress = await this.progressRepository.getCurrentProgress();
    return progress.readinessScore;
  }

  async getInterviewReadinessPercent(): Promise<number> {
    const progress = await this.progressRepository.getCurrentProgress();
    return progress.interviewReadinessPercent;
  }

  async recordWeakAreaUpdate(topicId: string, reason: string): Promise<ProgressOperationResult> {
    const weakArea: UserWeakArea = {
      id: `weak-area-${topicId}`,
      userId: "engineeringos-local-user",
      topicId,
      reason,
      source: "manual",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return this.progressRepository.updateWeakAreas([weakArea]);
  }
}
