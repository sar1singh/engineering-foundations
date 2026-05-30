import { referenceLinks } from "@/data/reference-links";
import type { ReferenceRepository } from "@/lib/repositories/reference-repository";

export const mockReferenceRepository: ReferenceRepository = {
  async getAllReferences() {
    return referenceLinks;
  },
  async getReferencesByTopicId(topicId) {
    return referenceLinks.filter((reference) => reference.topicIds.includes(topicId));
  },
  async getPrimaryReferencesByTopicId(topicId) {
    return referenceLinks.filter((reference) => reference.topicIds.includes(topicId) && reference.priority === "primary");
  }
};
