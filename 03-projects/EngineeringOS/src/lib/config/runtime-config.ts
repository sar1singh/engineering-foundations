import { appConfig } from "@/lib/config/app-config";

export type RuntimeConfigCheck = {
  name: string;
  ok: boolean;
  message: string;
};

export type RuntimeConfigReport = {
  ok: boolean;
  mode: string;
  checks: RuntimeConfigCheck[];
};

export function getRuntimeConfigReport(env: NodeJS.ProcessEnv = process.env): RuntimeConfigReport {
  const isBetaOrProduction = appConfig.deployMode === "beta" || appConfig.deployMode === "production";
  const checks: RuntimeConfigCheck[] = [
    {
      name: "data-source",
      ok: appConfig.dataSource === "mock" || appConfig.dataSource === "prisma",
      message: `Data source is ${appConfig.dataSource}.`
    },
    {
      name: "database-url",
      ok: appConfig.dataSource === "mock" || Boolean(env.DATABASE_URL),
      message: appConfig.dataSource === "mock" ? "DATABASE_URL is optional in mock mode." : "DATABASE_URL is required in Prisma mode."
    },
    {
      name: "production-database",
      ok: appConfig.deployMode !== "production" || appConfig.dataSource !== "prisma" || !String(env.DATABASE_URL ?? "").startsWith("file:"),
      message: "Production deployment mode with Prisma should use managed Postgres, not SQLite."
    },
    {
      name: "beta-database-provider",
      ok: !isBetaOrProduction || (appConfig.dataSource === "prisma" && String(env.DATABASE_URL ?? "").startsWith("postgresql://")),
      message: "Beta/production mode requires Prisma with managed PostgreSQL."
    },
    {
      name: "beta-auth",
      ok: !isBetaOrProduction || appConfig.features.enableAuth,
      message: "Beta/production mode requires real auth to be enabled."
    },
    {
      name: "public-code-runner",
      ok: !isBetaOrProduction || !appConfig.features.enableCodeRunner,
      message: "Beta/production mode should disable local browser code execution unless an isolated service exists."
    },
    {
      name: "error-monitoring",
      ok: !isBetaOrProduction || Boolean(appConfig.monitoring.errorMonitoringDsn),
      message: "Beta/production mode requires external error monitoring DSN/config."
    },
    {
      name: "uptime-check",
      ok: !isBetaOrProduction || Boolean(appConfig.monitoring.uptimeCheckUrl),
      message: "Beta/production mode requires an uptime check URL/config."
    }
  ];

  return {
    ok: checks.every((check) => check.ok),
    mode: appConfig.environment,
    checks
  };
}
