export type LogLevel = "info" | "warn" | "error";

export type LogEvent = {
  level: LogLevel;
  event: string;
  route?: string;
  status?: number;
  durationMs?: number;
  message?: string;
  meta?: Record<string, unknown>;
};

export function writeStructuredLog(event: LogEvent) {
  const payload = {
    timestamp: new Date().toISOString(),
    service: "engineeringos",
    ...event
  };

  const line = JSON.stringify(payload);

  if (event.level === "error") {
    console.error(line);
    return;
  }

  if (event.level === "warn") {
    console.warn(line);
    return;
  }

  console.log(line);
}

export async function withApiLogging<T>(route: string, operation: () => Promise<T> | T): Promise<T> {
  const startedAt = Date.now();

  try {
    const result = await operation();
    writeStructuredLog({ level: "info", event: "api.request", route, status: 200, durationMs: Date.now() - startedAt });
    return result;
  } catch (error) {
    writeStructuredLog({
      level: "error",
      event: "api.request.failed",
      route,
      status: 500,
      durationMs: Date.now() - startedAt,
      message: error instanceof Error ? error.message : "Unknown error"
    });
    throw error;
  }
}
