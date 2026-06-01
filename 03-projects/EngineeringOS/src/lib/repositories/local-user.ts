import { appConfig } from "@/lib/config";

export const ENGINEERINGOS_LOCAL_USER_ID = "engineeringos-local-user";

export function getRepositoryUserId() {
  if ((appConfig.deployMode === "beta" || appConfig.deployMode === "production") && !appConfig.features.enableAuth) {
    throw new Error("Authenticated user ownership is required in beta/production mode.");
  }

  return ENGINEERINGOS_LOCAL_USER_ID;
}
