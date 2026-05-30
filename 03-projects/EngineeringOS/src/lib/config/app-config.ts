export type AppEnvironment = "development" | "test" | "production";
export type AppDataSource = "mock" | "prisma";

export type AppConfig = {
  appName: "EngineeringOS";
  appVersion: string;
  environment: AppEnvironment;
  dataSource: AppDataSource;
  features: {
    enableAuth: boolean;
    enableRealAI: boolean;
    enableSupabase: boolean;
    enablePrisma: boolean;
    enableGithubSync: boolean;
    enableLeetCodeSync: boolean;
    enableBilling: boolean;
    enableDeployment: boolean;
  };
};

const environment = (process.env.NODE_ENV ?? "development") as AppEnvironment;
const dataSource = parseDataSource(process.env.NEXT_PUBLIC_ENGINEERINGOS_DATA_SOURCE);

function parseDataSource(value: string | undefined): AppDataSource {
  return value === "prisma" ? "prisma" : "mock";
}

export const appConfig: AppConfig = {
  appName: "EngineeringOS",
  appVersion: "0.1.0",
  environment,
  dataSource,
  features: {
    enableAuth: false,
    enableRealAI: false,
    enableSupabase: false,
    enablePrisma: false,
    enableGithubSync: false,
    enableLeetCodeSync: false,
    enableBilling: false,
    enableDeployment: false
  }
};
