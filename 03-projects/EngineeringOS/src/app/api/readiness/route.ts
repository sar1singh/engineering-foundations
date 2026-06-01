import { NextResponse } from "next/server";

import { withApiLogging } from "@/lib/observability/logger";
import { appServices } from "@/lib/providers";
import { getAssessmentReadiness } from "@/lib/services/assessment-readiness-service";
import { getProductQualityStatus } from "@/lib/services/product-quality-service";
import { getDomainReadiness, getRoleReadiness } from "@/lib/services/role-readiness-service";
import { defaultLearningPreferences } from "@/types/learning-preferences";

export async function GET() {
  return withApiLogging("/api/readiness", async () => {
    const syllabusDomains = appServices.syllabusService.getDomains();
    const progress = await appServices.repositories.progressRepository.getCurrentProgress();
    const learnerState = await appServices.learnerStateService.getLearnerState(defaultLearningPreferences);
    const roles = getRoleReadiness(syllabusDomains, progress);
    const domains = getDomainReadiness(syllabusDomains, progress);
    const assessment = getAssessmentReadiness({
      roleReadiness: roles,
      domainReadiness: domains,
      productQuality: getProductQualityStatus(),
      preferences: learnerState.preferences
    });

    return NextResponse.json({
      ok: true,
      data: {
        assessment,
        roles,
        domains
      }
    });
  });
}
