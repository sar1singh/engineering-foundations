import { cookies } from "next/headers";
import { OnboardingWizardForm } from "@/components/onboarding/OnboardingWizardForm";
import { appServices } from "@/lib/providers";
import { learningPreferencesCookieName, parseLearningPreferences } from "@/lib/services/onboarding-service";

export default async function OnboardingPage() {
  const cookieStore = await cookies();
  const fallbackPreferences = parseLearningPreferences(cookieStore.get(learningPreferencesCookieName)?.value);
  const learnerState = await appServices.learnerStateService.getLearnerState(fallbackPreferences);
  const preferences = learnerState.preferences;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-teal-700">Onboarding</p>
        <h1 className="text-3xl font-semibold">Configure your learning plan</h1>
        <p className="mt-2 max-w-3xl text-[var(--muted)]">
          Save your role target, available time, weak areas, and learning mode so EngineeringOS can bias the daily flow.
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Preference source: {learnerState.preferenceSource}. User: {learnerState.userId}.
        </p>
      </div>
      <OnboardingWizardForm preferences={preferences} />
    </section>
  );
}
