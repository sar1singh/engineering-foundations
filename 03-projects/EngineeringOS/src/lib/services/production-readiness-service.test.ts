import { describe, expect, it } from "vitest";

import { getProductionReadinessReport } from "@/lib/services/production-readiness-service";

describe("production readiness service", () => {
  it("allows controlled alpha while blocking beta and production honestly", () => {
    const report = getProductionReadinessReport();

    expect(report.alphaVerdict).toBe("ready");
    expect(report.betaVerdict).toBe("blocked");
    expect(report.productionVerdict).toBe("blocked");
    expect(report.checks.map((check) => check.area)).toEqual(
      expect.arrayContaining(["Authentication", "Database-backed learner state", "Observability", "Safe code execution", "Evaluator calibration", "Deployment operations"])
    );
  });
});
