import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();

function readProjectFile(relativePath: string) {
  return readFileSync(join(projectRoot, relativePath), "utf8");
}

describe("Phase 51-56 beta segregation contracts", () => {
  it("keeps API adapter routes available for future UI/backend split", () => {
    const routes = [
      "src/app/api/learner/profile/route.ts",
      "src/app/api/progress/summary/route.ts",
      "src/app/api/readiness/route.ts",
      "src/app/api/quality/status/route.ts"
    ];

    for (const route of routes) {
      expect(existsSync(join(projectRoot, route))).toBe(true);
      expect(readProjectFile(route)).toContain("NextResponse");
    }
  });

  it("keeps API contracts and client adapters separate from React pages", () => {
    const contracts = readProjectFile("src/lib/api-contracts/learning-api.ts");
    const client = readProjectFile("src/lib/api-client/learning-api-client.ts");

    expect(contracts).toContain("LearnerProfileResponse");
    expect(contracts).toContain("ProgressSummaryResponse");
    expect(contracts).toContain("ReadinessResponse");
    expect(contracts).toContain("QualityStatusResponse");
    expect(client).toContain("getLearnerProfile");
    expect(client).toContain("getReadiness");
  });

  it("keeps selected UI flows using the API client boundary", () => {
    const dashboardStrip = readProjectFile("src/components/dashboard/ApiReadinessStrip.tsx");
    const dashboardPage = readProjectFile("src/app/dashboard/page.tsx");

    expect(dashboardStrip).toContain("learningApiClient");
    expect(dashboardStrip).toContain("getReadiness");
    expect(dashboardStrip).toContain("getQualityStatus");
    expect(dashboardPage).toContain("ApiReadinessStrip");
  });

  it("documents DB, auth, observability, extraction, and manual beta testing blockers", () => {
    expect(readProjectFile("docs/DATABASE_PROVIDER_UPGRADE_PLAN.md")).toContain("managed PostgreSQL");
    expect(readProjectFile("docs/AUTH_AND_USER_OWNERSHIP_PLAN.md")).toContain("authenticated user");
    expect(readProjectFile("docs/OBSERVABILITY_AND_OPERATIONS_PLAN.md")).toContain("Rollback Checklist");
    expect(readProjectFile("docs/BETA_MANUAL_TESTING_PROGRAM.md")).toContain("get a job");
  });

  it("keeps beta safety guardrails for DB, auth, monitoring, and code execution", () => {
    const runtimeConfig = readProjectFile("src/lib/config/runtime-config.ts");
    const localUser = readProjectFile("src/lib/repositories/local-user.ts");
    const packageJson = readProjectFile("package.json");

    expect(runtimeConfig).toContain("beta-database-provider");
    expect(runtimeConfig).toContain("beta-auth");
    expect(runtimeConfig).toContain("error-monitoring");
    expect(runtimeConfig).toContain("uptime-check");
    expect(runtimeConfig).toContain("public-code-runner");
    expect(localUser).toContain("getRepositoryUserId");
    expect(packageJson).toContain("db:verify-target");
  });
});
