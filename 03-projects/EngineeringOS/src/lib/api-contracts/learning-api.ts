import type { AssessmentReadiness } from "@/lib/services/assessment-readiness-service";
import type { ProductQualityStatus } from "@/lib/services/product-quality-service";
import type { DomainReadiness, RoleReadiness } from "@/lib/services/role-readiness-service";
import type { LearningPreferences } from "@/types/learning-preferences";
import type { UserProgress } from "@/types/progress";

export type ApiEnvelope<T> = {
  ok: boolean;
  data: T;
};

export type LearnerProfileResponse = ApiEnvelope<{
  userId: string;
  isAuthenticated: boolean;
  preferenceSource: "repository" | "fallback";
  preferences: LearningPreferences;
}>;

export type LearnerProfileUpdateRequest = LearningPreferences;

export type ProgressSummaryResponse = ApiEnvelope<{
  progress: UserProgress;
  completedTopicCount: number;
  completedTaskCount: number;
  weakAreaCount: number;
}>;

export type ReadinessResponse = ApiEnvelope<{
  assessment: AssessmentReadiness;
  roles: RoleReadiness[];
  domains: DomainReadiness[];
}>;

export type QualityStatusResponse = ApiEnvelope<ProductQualityStatus>;
