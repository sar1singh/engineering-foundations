import { NextResponse } from "next/server";

import { withApiLogging } from "@/lib/observability/logger";
import { getProductQualityStatus } from "@/lib/services/product-quality-service";

export function GET() {
  return withApiLogging("/api/quality/status", () => {
    return NextResponse.json({
      ok: true,
      data: getProductQualityStatus()
    });
  });
}
