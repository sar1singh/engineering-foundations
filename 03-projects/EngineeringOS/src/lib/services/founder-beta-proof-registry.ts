import {
  founderBetaCapabilities,
  founderBetaSkills
} from "@/data/founder-beta/capabilities";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";
import type { ProofType } from "@/types/founder-beta";

export const validProofTypes: ProofType[] = [
  "coding-solution",
  "hld",
  "lld",
  "architecture-review",
  "aws-design",
  "incident-analysis",
  "behavioral-answer",
  "resume-review",
  "github-project",
  "case-study"
];

export const validProofTypeSet = new Set<ProofType>(validProofTypes);

export type ProofRegistryEntry = {
  capabilityId: string;
  capabilityName: string;
  capabilityProofTypes: ProofType[];
  skills: { id: string; name: string; proofTypes: ProofType[] }[];
  topicCount: number;
};

export const proofRegistry: ProofRegistryEntry[] = founderBetaCapabilities.map((cap) => {
  const capSkills = founderBetaSkills.filter((s) => s.capabilityId === cap.id);
  const capTopicCount = founderBetaMasterTopics.filter((t) =>
    t.capabilityIds.includes(cap.id)
  ).length;
  return {
    capabilityId: cap.id,
    capabilityName: cap.name,
    capabilityProofTypes: cap.proofTypes,
    skills: capSkills.map((s) => ({ id: s.id, name: s.name, proofTypes: s.proofTypes })),
    topicCount: capTopicCount
  };
});

export type ProofValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateAllProofTypes(): ProofValidationResult {
  const errors: string[] = [];

  for (const topic of founderBetaMasterTopics) {
    if (topic.proofTypes.length === 0) {
      errors.push(`topic ${topic.id} has no proofTypes`);
    }
    for (const pt of topic.proofTypes) {
      if (!validProofTypeSet.has(pt as ProofType)) {
        errors.push(`topic ${topic.id} has unknown proof type: ${pt}`);
      }
    }
  }

  for (const skill of founderBetaSkills) {
    if (skill.proofTypes.length === 0) {
      errors.push(`skill ${skill.id} has no proofTypes`);
    }
    for (const pt of skill.proofTypes) {
      if (!validProofTypeSet.has(pt as ProofType)) {
        errors.push(`skill ${skill.id} has unknown proof type: ${pt}`);
      }
    }
  }

  for (const cap of founderBetaCapabilities) {
    if (cap.proofTypes.length === 0) {
      errors.push(`capability ${cap.id} has no proofTypes`);
    }
    for (const pt of cap.proofTypes) {
      if (!validProofTypeSet.has(pt as ProofType)) {
        errors.push(`capability ${cap.id} has unknown proof type: ${pt}`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
