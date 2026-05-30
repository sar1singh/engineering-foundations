export type AuthUser = {
  id: string;
  name: string;
  email?: string;
  role: "guest" | "local-user";
};

export type SignInResult = {
  ok: boolean;
  user: AuthUser | null;
  message: string;
};

export interface AuthService {
  getCurrentUser(): Promise<AuthUser | null>;
  isAuthenticated(): Promise<boolean>;
  signIn(): Promise<SignInResult>;
  signOut(): Promise<{ ok: boolean; message: string }>;
}
