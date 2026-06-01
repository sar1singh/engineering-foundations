import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();

function readProjectFile(relativePath: string) {
  return readFileSync(join(projectRoot, relativePath), "utf8");
}

describe("Phase 48 learner state contract", () => {
  it("keeps learner preferences behind repository and service boundaries", () => {
    const repository = readProjectFile("src/lib/repositories/learner-preferences-repository.ts");
    const service = readProjectFile("src/lib/services/learner-state-service.ts");
    const providers = readProjectFile("src/lib/providers/app-services.ts");

    expect(repository).toContain("LearnerPreferencesRepository");
    expect(service).toContain("LearnerStateService");
    expect(service).toContain("getLearnerState");
    expect(service).toContain("savePreferences");
    expect(providers).toContain("learnerPreferencesRepository");
    expect(providers).toContain("learnerStateService");
  });

  it("keeps onboarding and dashboard reading learner state through the service", () => {
    const onboardingPage = readProjectFile("src/app/onboarding/page.tsx");
    const dashboardPage = readProjectFile("src/app/dashboard/page.tsx");
    const actions = readProjectFile("src/lib/actions/progress-actions.ts");

    expect(onboardingPage).toContain("learnerStateService.getLearnerState");
    expect(dashboardPage).toContain("learnerStateService.getLearnerState");
    expect(actions).toContain("learnerStateService.savePreferences");
  });

  it("documents that Phase 48 is a bridge, not full production auth", () => {
    const plan = readProjectFile("docs/PHASE_48_AUTH_AND_PERSISTENT_LEARNER_STATE.md");

    expect(plan).toContain("bridge");
    expect(plan).toContain("not full production auth");
    expect(plan).toContain("repository boundary");
    expect(plan).toContain("cookie fallback");
  });
});
