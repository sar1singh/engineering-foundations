import type { DbClient, DbHealth } from "@/lib/db/db-client";

export class MockDbClient implements DbClient {
  async getHealth(): Promise<DbHealth> {
    return {
      connected: false,
      provider: "mock",
      message: "Database is disabled. Mock repositories are the active data source."
    };
  }
}

export const mockDbClient = new MockDbClient();
