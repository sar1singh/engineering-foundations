export type DbHealth = {
  connected: boolean;
  provider: "mock";
  message: string;
};

export interface DbClient {
  getHealth(): Promise<DbHealth>;
}
