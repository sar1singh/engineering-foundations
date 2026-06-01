import { describe, expect, it } from "vitest";

import { getRuntimeConfigReport } from "@/lib/config/runtime-config";

describe("runtime config report", () => {
  it("returns structured deployment checks", () => {
    const report = getRuntimeConfigReport({ NODE_ENV: "test" });

    expect(report.checks.map((check) => check.name)).toEqual(expect.arrayContaining(["data-source", "database-url", "production-database"]));
    expect(typeof report.ok).toBe("boolean");
  });
});
