import { NextResponse } from "next/server";

import { founderBetaFacadeService } from "@/lib/services/founder-beta-facade-service";
import { withApiLogging } from "@/lib/observability/logger";

export function GET() {
  return withApiLogging("/api/founder-beta/today", () => {
    const plan = founderBetaFacadeService.getFounderBetaDefaultPlan();

    return NextResponse.json({
      ok: true,
      data: plan
    });
  });
}
