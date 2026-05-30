import type { ProgressRepository } from "@/lib/repositories/progress-repository";
import type { RevisionPromptRepository } from "@/lib/repositories/revision-prompt-repository";
import type { RevisionPrompt } from "@/types/topic";

export class RevisionService {
  constructor(
    private readonly revisionPromptRepository: RevisionPromptRepository,
    private readonly progressRepository: ProgressRepository
  ) {}

  async getRevisionQueue(): Promise<RevisionPrompt[]> {
    const weakAreas = await this.progressRepository.getWeakAreas();
    return this.revisionPromptRepository.getPromptsForTopics(weakAreas);
  }
}
