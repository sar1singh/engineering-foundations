import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();

function readProjectFile(relativePath: string) {
  return readFileSync(join(projectRoot, relativePath), "utf8");
}

describe("Phase 50 deployment foundation contract", () => {
  it("documents service segregation and SaaS scaling strategy", () => {
    const plan = readProjectFile("docs/SERVICE_SEGREGATION_AND_SAAS_SCALING_PLAN.md");

    expect(plan).toContain("UI can be hosted independently");
    expect(plan).toContain("Backend/API can be hosted independently");
    expect(plan).toContain("Managed PostgreSQL");
    expect(plan).toContain("Stage 1 - Modular Monolith");
  });

  it("keeps containerization foundation files in place", () => {
    expect(existsSync(join(projectRoot, "Dockerfile"))).toBe(true);
    expect(existsSync(join(projectRoot, ".dockerignore"))).toBe(true);

    const dockerfile = readProjectFile("Dockerfile");
    const dockerignore = readProjectFile(".dockerignore");

    expect(dockerfile).toContain("npm ci");
    expect(dockerfile).toContain("npm run build");
    expect(dockerfile).toContain("nextjs");
    expect(dockerignore).toContain("node_modules");
    expect(dockerignore).toContain("prisma/*.db");
  });

  it("keeps health and runtime config checks available", () => {
    const healthRoute = readProjectFile("src/app/api/health/route.ts");
    const runtimeConfig = readProjectFile("src/lib/config/runtime-config.ts");

    expect(healthRoute).toContain("getRuntimeConfigReport");
    expect(runtimeConfig).toContain("production-database");
    expect(runtimeConfig).toContain("DATABASE_URL");
  });
});
