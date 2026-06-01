import Link from "next/link";
import { cookies } from "next/headers";
import { Award, CalendarClock, Gauge, Target, UserCircle } from "lucide-react";
import { appServices } from "@/lib/providers";
import { learningPreferencesCookieName, parseLearningPreferences } from "@/lib/services/onboarding-service";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const fallbackPreferences = parseLearningPreferences(cookieStore.get(learningPreferencesCookieName)?.value);
  const learnerState = await appServices.learnerStateService.getLearnerState(fallbackPreferences);
  const summary = await appServices.progressSummaryService.getProgressSummary();
  const prefs = learnerState.preferences;

  const stats = [
    { label: "Readiness", value: `${summary.progress.readinessScore}%`, icon: Gauge },
    { label: "Weekly commitment", value: `${prefs.hoursPerWeek}h`, icon: CalendarClock },
    { label: "Deadline", value: `${prefs.deadlineWeeks} weeks`, icon: Target },
    { label: "Completed tasks", value: summary.completedTasks.length, icon: Award }
  ];

  return (
    <section className="space-y-6">
      <div className="eo-glow-card p-6">
        <div className="relative z-[1] flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 text-white">
              <UserCircle className="h-9 w-9" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">Local learner profile</p>
              <h1 className="mt-1 text-3xl font-semibold">Your interview mission profile</h1>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {learnerState.isAuthenticated ? "Authenticated learner" : "Local guest"} / {learnerState.preferenceSource}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className="eo-primary-action px-4 py-2 text-sm" href="/onboarding">Edit goal</Link>
            <Link className="eo-secondary-action px-4 py-2 text-sm" href="/signin">Sign in later</Link>
          </div>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="eo-card p-4">
              <Icon className="h-5 w-5 text-teal-700" aria-hidden="true" />
              <p className="mt-3 text-sm text-[var(--muted)]">{stat.label}</p>
              <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="eo-card p-5">
          <h2 className="text-xl font-semibold">Active goal</h2>
          <p className="mt-3 text-2xl font-semibold capitalize">{prefs.targetRole.replaceAll("-", " ")}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Current level: {prefs.currentLevel}. Learning mode: {prefs.learningMode.replaceAll("-", " ")}.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {prefs.weakAreas.map((area) => (
              <span key={area} className="eo-chip">{area}</span>
            ))}
          </div>
        </div>
        <div className="eo-card p-5">
          <h2 className="text-xl font-semibold">Recent activity</h2>
          <div className="mt-4 space-y-3">
            <p className="eo-panel p-3 text-sm text-[var(--muted)]">{summary.completedTopics.length} topics completed.</p>
            <p className="eo-panel p-3 text-sm text-[var(--muted)]">{summary.weakTopics.length} weak areas currently tracked.</p>
            <p className="eo-panel p-3 text-sm text-[var(--muted)]">{summary.progress.streakCount} day streak signal.</p>
          </div>
        </div>
      </section>
    </section>
  );
}
