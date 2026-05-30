import type { ReferenceLink } from "@/types/reference";

export interface ReferenceRepository {
  getAllReferences(): Promise<ReferenceLink[]>;
  getReferencesByTopicId(topicId: string): Promise<ReferenceLink[]>;
  getPrimaryReferencesByTopicId(topicId: string): Promise<ReferenceLink[]>;
}
