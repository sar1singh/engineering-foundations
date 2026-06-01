import { NextResponse } from "next/server";

import { withApiLogging } from "@/lib/observability/logger";
import { appServices } from "@/lib/providers";

export async function GET() {
  return withApiLogging("/api/progress/summary", async () => {
    const progress = await appServices.repositories.progressRepository.getCurrentProgress();

    return NextResponse.json({
      ok: true,
      data: {
        progress,
        completedTopicCount: progress.completedTopicIds.length,
        completedTaskCount: progress.completedTaskIds.length,
        weakAreaCount: progress.weakAreas.length
      }
    });
  });
}
