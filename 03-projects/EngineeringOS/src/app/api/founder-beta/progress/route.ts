import { NextResponse } from "next/server";

import { founderBetaProgressPersistenceService } from "@/lib/services/founder-beta-progress-persistence-service";
import type { FounderBetaProgressInput } from "@/lib/services/founder-beta-progress-adapter-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const input = (await request.json()) as FounderBetaProgressInput;
  const result = await founderBetaProgressPersistenceService.saveFounderBetaProgress(input);
  const plan = await founderBetaProgressPersistenceService.getFounderBetaPlanFromPersistedProgress();

  return NextResponse.json({
    progress: result.progress,
    validationWarnings: result.validationWarnings,
    todayPlan: plan.todayPlan,
    readinessSnapshot: plan.readinessSnapshot,
    primaryMission: plan.primaryMission,
    optionalMissions: plan.optionalMissions,
    nextActions: plan.nextActions
  });
}
