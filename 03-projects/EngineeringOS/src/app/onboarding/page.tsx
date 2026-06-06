import { cookies } from "next/headers";
import Link from "next/link";

import { ApiLearnerProfileStatus } from "@/components/onboarding/ApiLearnerProfileStatus";
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
      <section className="eo-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-indigo-700">Founder Beta</p>
            <h2 className="mt-1 text-xl font-semibold">Initialize local Founder Beta progress</h2>
            <p className="mt-2 max-w-3xl text-sm text-[var(--muted)]">
              Use the Founder Beta initializer to preview available time, weak areas, and readiness estimates before saving local progress.
              It saves normalized progress input only; Today Plan and readiness are recalculated.
            </p>
          </div>
          <Link
            className="rounded-md bg-indigo-700 px-3 py-2 text-sm font-semibold text-white"
            href="/founder-beta"
          >
            Open Founder Beta initializer
          </Link>
        </div>
      </section>
      <ApiLearnerProfileStatus />
      <OnboardingWizardForm preferences={preferences} />
    </section>
  );
}
