import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();

function readProjectFile(relativePath: string) {
  return readFileSync(join(projectRoot, relativePath), "utf8");
}

describe("Phase 46 final audit and hardening contract", () => {
  it("keeps route smoke coverage aligned with SaaS learning flows", () => {
    const smokeScript = readProjectFile("scripts/smoke-routes.mjs");

    expect(smokeScript).toContain("/dashboard");
    expect(smokeScript).toContain("/onboarding");
    expect(smokeScript).toContain("/syllabus");
    expect(smokeScript).toContain("/syllabus/graph-bfs");
    expect(smokeScript).toContain("/practice/practice-javascript");
    expect(smokeScript).toContain("/quality");
  });

  it("keeps code runner safety guardrails visible in code", () => {
    const runner = readProjectFile("src/components/practice/LocalCodeRunner.tsx");

    expect(runner).toContain("getLocalRunnerSafetyError");
    expect(runner).toContain("Network calls are disabled");
    expect(runner).toContain("Browser storage access is disabled");
    expect(runner).toContain("DOM and global object access are disabled");
    expect(runner).toContain("Dynamic evaluation is disabled");
    expect(runner).toContain("Obvious infinite loops are blocked");
  });

  it("documents production, alpha, and beta readiness honestly", () => {
    const audit = readProjectFile("docs/PHASE_46_FINAL_AUDIT_AND_HARDENING.md");

    expect(audit).toContain("Production verdict: not ready");
    expect(audit).toContain("Alpha verdict: ready for controlled local/internal alpha");
    expect(audit).toContain("Beta verdict: not ready");
    expect(audit).toContain("auth");
    expect(audit).toContain("database-backed");
    expect(audit).toContain("safe code execution");
    expect(audit).toContain("visual QA");
  });

  it("keeps Product QA wired to production readiness signals", () => {
    const qualityPage = readProjectFile("src/app/quality/page.tsx");
    const readinessService = readProjectFile("src/lib/services/production-readiness-service.ts");

    expect(qualityPage).toContain("Production readiness");
    expect(qualityPage).toContain("getProductionReadinessReport");
    expect(readinessService).toContain("alphaVerdict");
    expect(readinessService).toContain("betaVerdict");
    expect(readinessService).toContain("productionVerdict");
  });
});
