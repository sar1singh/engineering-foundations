export type AppEnvironment = "development" | "test" | "production";
export type AppDataSource = "mock" | "prisma";
export type AppDeployMode = "local" | "alpha" | "beta" | "production";

export type AppConfig = {
  appName: "EngineeringOS";
  appVersion: string;
  environment: AppEnvironment;
  dataSource: AppDataSource;
  deployMode: AppDeployMode;
  monitoring: {
    errorMonitoringDsn?: string;
    uptimeCheckUrl?: string;
  };
  features: {
    enableAuth: boolean;
    enableRealAI: boolean;
    enableSupabase: boolean;
    enablePrisma: boolean;
    enableGithubSync: boolean;
    enableLeetCodeSync: boolean;
    enableBilling: boolean;
    enableDeployment: boolean;
    enableCodeRunner: boolean;
  };
};

const environment = (process.env.NODE_ENV ?? "development") as AppEnvironment;
const dataSource = parseDataSource(process.env.NEXT_PUBLIC_ENGINEERINGOS_DATA_SOURCE);
const deployMode = parseDeployMode(process.env.ENGINEERINGOS_DEPLOY_MODE);

function parseDataSource(value: string | undefined): AppDataSource {
  return value === "prisma" ? "prisma" : "mock";
}

function parseDeployMode(value: string | undefined): AppDeployMode {
  if (value === "alpha" || value === "beta" || value === "production") {
    return value;
  }

  return "local";
}

export const appConfig: AppConfig = {
  appName: "EngineeringOS",
  appVersion: "0.1.0",
  environment,
  dataSource,
  deployMode,
  monitoring: {
    errorMonitoringDsn: process.env.ENGINEERINGOS_ERROR_MONITORING_DSN,
    uptimeCheckUrl: process.env.ENGINEERINGOS_UPTIME_CHECK_URL
  },
  features: {
    enableAuth: false,
    enableRealAI: false,
    enableSupabase: false,
    enablePrisma: false,
    enableGithubSync: false,
    enableLeetCodeSync: false,
    enableBilling: false,
    enableDeployment: false,
    enableCodeRunner: process.env.ENGINEERINGOS_ENABLE_CODE_RUNNER === "true" || deployMode === "local" || deployMode === "alpha"
  }
};
