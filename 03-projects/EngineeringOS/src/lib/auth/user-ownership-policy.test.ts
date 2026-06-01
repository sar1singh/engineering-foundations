import { describe, expect, it } from "vitest";

import { getUserOwnershipPolicyReport } from "@/lib/auth/user-ownership-policy";

describe("user ownership policy", () => {
  it("allows local user ids in local mode", () => {
    const report = getUserOwnershipPolicyReport("engineeringos-local-user");

    expect(report.mode).toBe("local");
    expect(report.ok).toBe(true);
  });
});
