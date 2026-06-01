import { appConfig } from "@/lib/config";
import { ENGINEERINGOS_LOCAL_USER_ID } from "@/lib/repositories/local-user";

export type UserOwnershipPolicyReport = {
  ok: boolean;
  mode: string;
  message: string;
};

export function getUserOwnershipPolicyReport(userId: string): UserOwnershipPolicyReport {
  const betaLike = appConfig.deployMode === "beta" || appConfig.deployMode === "production";
  const usesLocalUser = userId === ENGINEERINGOS_LOCAL_USER_ID || userId === "local-guest" || userId === "anonymous-local-user";
  const ok = !betaLike || (appConfig.features.enableAuth && !usesLocalUser);

  return {
    ok,
    mode: appConfig.deployMode,
    message: ok
      ? "User ownership policy passed for the current deployment mode."
      : "Beta/production mode must use authenticated non-local user IDs for learner-owned state."
  };
}
