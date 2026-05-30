import type { AuthService, AuthUser, SignInResult } from "@/lib/auth/auth-service";

const guestUser: AuthUser = {
  id: "local-guest",
  name: "Local Guest",
  role: "guest"
};

export class MockAuthService implements AuthService {
  async getCurrentUser(): Promise<AuthUser | null> {
    return guestUser;
  }

  async isAuthenticated(): Promise<boolean> {
    return false;
  }

  async signIn(): Promise<SignInResult> {
    return {
      ok: false,
      user: guestUser,
      message: "Auth is disabled in the local mock phase."
    };
  }

  async signOut(): Promise<{ ok: boolean; message: string }> {
    return {
      ok: true,
      message: "No remote session exists in the local mock phase."
    };
  }
}

export const mockAuthService = new MockAuthService();
