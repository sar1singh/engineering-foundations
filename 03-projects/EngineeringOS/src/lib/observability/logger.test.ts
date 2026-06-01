import { describe, expect, it, vi } from "vitest";

import { withApiLogging, writeStructuredLog } from "@/lib/observability/logger";

describe("structured logger", () => {
  it("writes JSON log lines", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => undefined);

    writeStructuredLog({ level: "info", event: "test.event", route: "/api/test", status: 200 });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(JSON.parse(String(spy.mock.calls[0][0]))).toMatchObject({ service: "engineeringos", event: "test.event" });
    spy.mockRestore();
  });

  it("wraps API operations with success logging", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const result = await withApiLogging("/api/test", () => "ok");

    expect(result).toBe("ok");
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
