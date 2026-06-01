import { NextResponse } from "next/server";

import type { LearnerProfileUpdateRequest } from "@/lib/api-contracts/learning-api";
import { getLearnerProfileApi, updateLearnerProfileApi } from "@/lib/api-services/learning-api-service";
import { withApiLogging } from "@/lib/observability/logger";

export async function GET() {
  return withApiLogging("/api/learner/profile", async () => {
    const learnerState = await getLearnerProfileApi();

    return NextResponse.json({
      ok: true,
      data: learnerState
    });
  });
}

export async function PUT(request: Request) {
  return withApiLogging("/api/learner/profile", async () => {
    const input = (await request.json()) as LearnerProfileUpdateRequest;
    const learnerState = await updateLearnerProfileApi(input);

    return NextResponse.json({
      ok: true,
      data: learnerState
    });
  });
}
