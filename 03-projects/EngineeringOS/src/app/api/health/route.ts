import { NextResponse } from "next/server";

import { appConfig } from "@/lib/config";
import { getRuntimeConfigReport } from "@/lib/config/runtime-config";

export function GET() {
  const runtime = getRuntimeConfigReport();
  const status = runtime.ok ? 200 : 503;

  return NextResponse.json(
    {
      ok: runtime.ok,
      app: appConfig.appName,
      version: appConfig.appVersion,
      environment: appConfig.environment,
      dataSource: appConfig.dataSource,
      checks: runtime.checks
    },
    { status }
  );
}
