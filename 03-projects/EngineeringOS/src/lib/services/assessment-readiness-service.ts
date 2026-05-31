import type { DomainReadiness, RoleReadiness } from "@/lib/services/role-readiness-service";
import type { ProductQualityStatus } from "@/lib/services/product-quality-service";
import type { LearningPreferences } from "@/types/learning-preferences";

export type AssessmentReadiness = {
  score: number;
  label: "starting" | "building" | "interview-ready" | "offer-ready";
  factors: Array<{ label: string; value: number; weight: number }>;
  nextActions: string[];
};

export function getAssessmentReadiness(input: {
  roleReadiness: RoleReadiness[];
  domainReadiness: DomainReadiness[];
  productQuality: ProductQualityStatus;
  preferences: LearningPreferences;
}): AssessmentReadiness {
  const targetRole = input.roleReadiness.find((role) => role.slug === input.preferences.targetRole) ?? input.roleReadiness[0];
  const coreDomains = ["dsa", "nodejs", "databases", "system-design", "aws", "security", "performance"];
  const coreDomainReadiness = input.domainReadiness.filter((domain) => coreDomains.includes(domain.slug));
  const corePercent =
    coreDomainReadiness.length > 0
      ? Math.round(coreDomainReadiness.reduce((sum, domain) => sum + domain.percent, 0) / coreDomainReadiness.length)
      : 0;
  const paceScore = Math.min(100, Math.round((input.preferences.hoursPerWeek / 10) * 70 + (input.preferences.deadlineWeeks <= 16 ? 20 : 10)));
  const factors = [
    { label: "Target role completion", value: targetRole?.percent ?? 0, weight: 0.35 },
    { label: "Core domain balance", value: corePercent, weight: 0.25 },
    { label: "Product QA health", value: input.productQuality.coveragePercent, weight: 0.2 },
    { label: "Study plan pace", value: paceScore, weight: 0.2 }
  ];
  const score = Math.round(factors.reduce((sum, factor) => sum + factor.value * factor.weight, 0));

  return {
    score,
    label: score >= 85 ? "offer-ready" : score >= 70 ? "interview-ready" : score >= 35 ? "building" : "starting",
    factors,
    nextActions: [
      targetRole?.nextTopic ? `Complete ${targetRole.nextTopic.title}` : "Pick the next role-path topic",
      "Submit one rubric-scored answer",
      "Run one timed mock interview question",
      input.preferences.weakAreas.length > 0 ? `Review weak area: ${input.preferences.weakAreas[0]}` : "Add weak areas in onboarding"
    ]
  };
}
