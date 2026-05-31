import { appConfig } from "@/lib/config";

export type ProductionReadinessStatus = "pass" | "blocked" | "watch";

export type ProductionReadinessCheck = {
  area: string;
  status: ProductionReadinessStatus;
  evidence: string;
  requiredFor: "alpha" | "beta" | "production";
};

export type ProductionReadinessReport = {
  alphaVerdict: "ready" | "blocked";
  betaVerdict: "ready" | "blocked";
  productionVerdict: "ready" | "blocked";
  checks: ProductionReadinessCheck[];
  nextPhase: string;
};

export function getProductionReadinessReport(): ProductionReadinessReport {
  const checks: ProductionReadinessCheck[] = [
    {
      area: "Controlled local/internal alpha",
      status: "pass",
      evidence: "Mock and local Prisma smoke routes pass; app remains local-first and feature-limited.",
      requiredFor: "alpha"
    },
    {
      area: "Authentication",
      status: appConfig.features.enableAuth ? "pass" : "blocked",
      evidence: appConfig.features.enableAuth ? "Auth feature flag is enabled." : "Only mock guest auth exists; no production identity provider is wired.",
      requiredFor: "beta"
    },
    {
      area: "Database-backed learner state",
      status: appConfig.dataSource === "prisma" ? "watch" : "blocked",
      evidence:
        appConfig.dataSource === "prisma"
          ? "Local Prisma can persist progress, but onboarding preferences are still cookie-backed and user identity is fixed."
          : "Mock is the default data source; onboarding preferences are cookie-backed.",
      requiredFor: "beta"
    },
    {
      area: "Observability",
      status: "blocked",
      evidence: "No production logging, metrics, tracing, error monitoring, uptime checks, or alert routing is configured.",
      requiredFor: "beta"
    },
    {
      area: "Safe code execution",
      status: "watch",
      evidence: "The local runner has learning guardrails, but production execution still needs an isolated sandbox or public-user disablement.",
      requiredFor: "beta"
    },
    {
      area: "Evaluator calibration",
      status: "blocked",
      evidence: "Mock scoring is heuristic and not calibrated against human review or role-specific interview rubrics.",
      requiredFor: "beta"
    },
    {
      area: "Visual and journey QA",
      status: "blocked",
      evidence: "Route smoke exists, but Playwright journey tests and screenshot-based mobile/desktop QA are not implemented.",
      requiredFor: "beta"
    },
    {
      area: "Deployment operations",
      status: "blocked",
      evidence: "No production deployment checklist has been executed for env vars, migrations, backups, rollback, rate limits, and incident playbooks.",
      requiredFor: "production"
    }
  ];

  return {
    alphaVerdict: checks.some((check) => check.requiredFor === "alpha" && check.status === "blocked") ? "blocked" : "ready",
    betaVerdict: checks.some((check) => (check.requiredFor === "beta" || check.requiredFor === "production") && check.status === "blocked") ? "blocked" : "ready",
    productionVerdict: checks.some((check) => check.requiredFor !== "alpha" && check.status !== "pass") ? "blocked" : "ready",
    checks,
    nextPhase: "Phase 48 - Auth and Persistent Learner State"
  };
}
