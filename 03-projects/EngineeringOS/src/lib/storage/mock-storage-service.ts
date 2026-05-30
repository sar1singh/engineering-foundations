import type { StorageService } from "@/lib/storage/storage-service";

export class MockStorageService implements StorageService {
  private readonly store = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }
}

export const mockStorageService = new MockStorageService();
