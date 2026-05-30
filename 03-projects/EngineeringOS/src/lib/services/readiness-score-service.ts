import type { ProgressRepository } from "@/lib/repositories/progress-repository";

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
}
