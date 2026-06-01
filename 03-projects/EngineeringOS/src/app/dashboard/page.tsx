import Link from "next/link";
import { cookies } from "next/headers";
import { ApiProgressSummaryCard } from "@/components/dashboard/ApiProgressSummaryCard";
import { ApiReadinessStrip } from "@/components/dashboard/ApiReadinessStrip";
import { MissionReadinessChart } from "@/components/dashboard/MissionReadinessChart";
import { GuidedNextSteps } from "@/components/learning/GuidedNextSteps";
import { appServices } from "@/lib/providers";
import { getAssessmentReadiness } from "@/lib/services/assessment-readiness-service";
import { learningPreferencesCookieName, parseLearningPreferences } from "@/lib/services/onboarding-service";
import { getProductQualityStatus } from "@/lib/services/product-quality-service";
import { getDomainReadiness, getRoleReadiness } from "@/lib/services/role-readiness-service";

export default async function DashboardPage() {
  const dashboard = await appServices.dashboardService.getDashboard();
  const cookieStore = await cookies();
  const fallbackPreferences = parseLearningPreferences(cookieStore.get(learningPreferencesCookieName)?.value);
  const learnerState = await appServices.learnerStateService.getLearnerState(fallbackPreferences);
  const preferences = learnerState.preferences;
  const syllabusDomains = appServices.syllabusService.getDomains();
  const progress = await appServices.repositories.progressRepository.getCurrentProgress();
  const roleReadiness = getRoleReadiness(syllabusDomains, progress);
  const domainReadiness = getDomainReadiness(syllabusDomains, progress);
  const qualityStatus = getProductQualityStatus();
  const assessmentReadiness = getAssessmentReadiness({ roleReadiness, domainReadiness, productQuality: qualityStatus, preferences });
  const recommendedRole = roleReadiness.find((role) => role.slug === preferences.targetRole) ?? roleReadiness[0];
  const todaysLesson = recommendedRole?.nextTopic;
  const readinessGroups = [
    { label: "DSA", slugs: ["dsa", "algorithms"] },
    { label: "Backend", slugs: ["javascript", "nodejs", "databases"] },
    { label: "System Design", slugs: ["system-design", "case-studies", "tradeoffs"] },
    { label: "AWS", slugs: ["aws"] },
    { label: "Security", slugs: ["security"] },
    { label: "LLD", slugs: ["lld"] },
    { label: "Staff/EM", slugs: ["staff-em", "senior-skills"] }
  ].map((group) => {
    const domainsInGroup = domainReadiness.filter((domain) => group.slugs.includes(domain.slug));
    const total = domainsInGroup.reduce((sum, domain) => sum + domain.total, 0);
    const completed = domainsInGroup.reduce((sum, domain) => sum + domain.completed, 0);
    return { ...group, percent: total > 0 ? Math.round((completed / total) * 100) : 0, subtitle: `${completed}/${total} topics` };
  });
  const activeRoadmap = dashboard.roadmapTree?.roadmap;
  const activeDomains = dashboard.roadmapTree?.domains.slice(0, 6) ?? [];
  const allSyllabusTopics = syllabusDomains.flatMap((domain) => domain.modules.flatMap((module) => module.topics));
  const handsOnLabTopics = allSyllabusTopics.filter((topic) => (topic.enrichedContent?.handsOnLabs?.length ?? 0) > 0);
  const capstoneTopics = allSyllabusTopics.filter((topic) => (topic.enrichedContent?.designCapstones.length ?? 0) > 0);
  const enrichedDsaTopics = allSyllabusTopics.filter((topic) => (topic.enrichedContent?.enrichedProblems.length ?? 0) > 0);
  const founderOutcomeMetrics = [
    { label: "Runnable DSA patterns", value: enrichedDsaTopics.length, href: "/syllabus?content=runnable", note: "coding interview reps" },
    { label: "HLD/LLD capstones", value: capstoneTopics.length, href: "/syllabus?content=capstones", note: "design review reps" },
    { label: "AWS hands-on labs", value: handsOnLabTopics.length, href: "/syllabus?content=labs", note: "solution architect proof" },
    { label: "Interview rounds", value: 12, href: "/interview-rounds", note: "loop coverage" }
  ];
  const nextSteps = [
    dashboard.currentTopic
      ? {
          href: `/topics/${dashboard.currentTopic.slug}`,
          label: `Study ${dashboard.currentTopic.title}`,
          description: "Review the theory, mental model, and explain-back prompt."
        }
      : null,
    dashboard.todayMission
      ? {
          href: `/practice/${dashboard.todayMission.slug}`,
          label: "Open today's practice",
          description: "Turn the active topic into a focused coding or design rep."
        }
      : null,
    {
      href: "/progress",
      label: "Review progress",
      description: "Check completion, weak areas, and local readiness signals."
    },
    todaysLesson
      ? {
          href: `/syllabus/${todaysLesson.slug}`,
          label: "Start today's lesson",
          description: `Continue the ${recommendedRole.title} 80/20 path with ${todaysLesson.title}.`
        }
      : null,
    {
      href: `/syllabus?role=${preferences.targetRole}&priority=${preferences.learningMode === "deep-mastery" ? "depth" : "core-80-20"}`,
      label: "Open saved role path",
      description: "Use the saved onboarding preferences for focused preparation."
    }
  ].filter((step): step is { href: string; label: string; description: string } => step !== null);

  return (
    <section className="space-y-8">
      <div className="eo-glow-card p-6">
        <div className="relative z-[1] flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Mission control</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">Today&apos;s Mission</h1>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">
              {activeRoadmap?.title ?? "EngineeringOS"} is your guided, role-based interview readiness cockpit.
            </p>
          </div>
          {todaysLesson ? (
            <Link className="eo-primary-action px-4 py-2.5 text-sm" href={`/syllabus/${todaysLesson.slug}`}>
              Start today&apos;s lesson
            </Link>
          ) : null}
        </div>
      </div>
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="eo-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Role onboarding</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Saved target: {preferences.targetRole.replaceAll("-", " ")} / {preferences.hoursPerWeek}h weekly / {preferences.deadlineWeeks} weeks / {preferences.learningMode.replaceAll("-", " ")}.
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Learner state: {learnerState.preferenceSource} / {learnerState.isAuthenticated ? "authenticated" : "local guest"}.
              </p>
            </div>
            <Link className="rounded-md border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--muted)] hover:border-teal-700" href="/onboarding">
              Edit plan
            </Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {roleReadiness.map((role) => (
              <Link key={role.slug} className="rounded-md bg-slate-50 p-3 hover:bg-teal-50" href={`/syllabus?role=${role.slug}&priority=core-80-20`}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{role.title}</p>
                  <span className="rounded-md bg-white px-2 py-1 text-xs text-teal-800">{role.percent}%</span>
                </div>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {role.nextTopic ? `Next: ${role.nextTopic.title}` : "Path complete"}
                </p>
              </Link>
            ))}
          </div>
        </div>
        <div className="eo-gradient-border p-5">
          <h2 className="text-xl font-semibold">Assessment readiness</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Weighted from role progress, core domains, QA health, and saved study pace.</p>
          <p className="mt-4 text-4xl font-semibold text-teal-700">{assessmentReadiness.score}%</p>
          <p className="mt-1 text-sm font-medium capitalize text-teal-800">{assessmentReadiness.label.replace("-", " ")}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {qualityStatus.missingRouterDomains.length === 0 ? "Master roadmap coverage is green." : `${qualityStatus.missingRouterDomains.length} router domains need attention.`}
          </p>
          <Link className="mt-4 inline-block rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white" href="/quality">
            Open QA dashboard
          </Link>
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="eo-card p-4">
          <p className="text-sm text-[var(--muted)]">Current topic</p>
          <p className="mt-2 font-semibold">{dashboard.currentTopic?.title ?? "No active topic"}</p>
        </div>
        <div className="eo-card p-4">
          <p className="text-sm text-[var(--muted)]">Readiness score</p>
          <p className="mt-2 font-semibold">{dashboard.readinessScore}%</p>
        </div>
        <div className="eo-card p-4">
          <p className="text-sm text-[var(--muted)]">Revision queue</p>
          <p className="mt-2 font-semibold">{dashboard.revisionQueue.length} prompts</p>
        </div>
        <div className="eo-card p-4">
          <p className="text-sm text-[var(--muted)]">Weak areas</p>
          <p className="mt-2 font-semibold">{dashboard.weakAreas.length} tracked</p>
        </div>
      </div>
      <MissionReadinessChart domains={domainReadiness} roles={roleReadiness} />
      <section className="eo-card p-5">
        <h2 className="text-xl font-semibold">Readiness breakdown</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {readinessGroups.map((group) => (
            <ReadinessCard key={group.label} title={group.label} percent={group.percent} subtitle={group.subtitle} />
          ))}
        </div>
      </section>
      <ApiReadinessStrip />
      <ApiProgressSummaryCard />
      <section className="rounded-lg border border-[var(--border)] bg-white p-5">
        <h2 className="text-xl font-semibold">Founder outcome metrics</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">These are product-readiness signals for the real goal: learn, interview well, and switch jobs.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {founderOutcomeMetrics.map((metric) => (
            <Link key={metric.label} className="rounded-md border border-[var(--border)] p-3 hover:border-teal-700" href={metric.href}>
              <p className="text-sm text-[var(--muted)]">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold text-teal-700">{metric.value}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{metric.note}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="eo-card p-5">
          <h2 className="text-xl font-semibold">Assessment factors</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {assessmentReadiness.factors.map((factor) => (
              <ReadinessCard key={factor.label} title={factor.label} percent={factor.value} subtitle={`${Math.round(factor.weight * 100)}% weight`} />
            ))}
          </div>
        </div>
        <div className="eo-card p-5">
          <h2 className="text-xl font-semibold">Next assessment actions</h2>
          <div className="mt-4 space-y-2">
            {assessmentReadiness.nextActions.map((action) => (
              <p key={action} className="rounded-md bg-slate-50 p-3 text-sm text-[var(--muted)]">
                {action}
              </p>
            ))}
          </div>
        </div>
      </section>
      <section className="eo-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Role readiness</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Readiness is estimated from completion across each targeted role roadmap.</p>
          </div>
          {todaysLesson ? (
            <Link className="rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white" href={`/syllabus/${todaysLesson.slug}`}>
              Start today&apos;s lesson
            </Link>
          ) : null}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {roleReadiness.map((role) => (
            <ReadinessCard key={role.slug} title={role.title} percent={role.percent} subtitle={`${role.completed}/${role.total} topics`} />
          ))}
        </div>
      </section>
      <section className="eo-card p-5">
        <h2 className="text-xl font-semibold">Domain readiness</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {domainReadiness.map((domain) => (
            <ReadinessCard key={domain.slug} title={domain.title} percent={domain.percent} subtitle={`${domain.completed}/${domain.total} topics`} />
          ))}
        </div>
      </section>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-lg border border-[var(--border)] bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--muted)]">Next practice task</p>
              <h2 className="mt-1 text-xl font-semibold">{dashboard.todayMission?.title ?? "No task queued"}</h2>
            </div>
            {dashboard.todayMission ? (
              <Link
                className="rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white"
                href={`/practice/${dashboard.todayMission.slug}`}
              >
                Open task
              </Link>
            ) : null}
          </div>
          <p className="mt-4 text-[var(--muted)]">
            {dashboard.todayMission?.statement ?? "Complete more roadmap data to generate a mission."}
          </p>
          {dashboard.currentTopic ? (
            <Link className="mt-4 inline-block text-sm font-medium text-teal-700" href={`/topics/${dashboard.currentTopic.slug}`}>
              Study {dashboard.currentTopic.title}
            </Link>
          ) : null}
        </section>
        <section className="rounded-lg border border-[var(--border)] bg-white p-5">
          <h2 className="text-xl font-semibold">Revision Queue</h2>
          <div className="mt-4 space-y-3">
            {dashboard.revisionQueue.length > 0 ? (
              dashboard.revisionQueue.map((prompt) => (
                <div key={prompt.id} className="rounded-md bg-slate-50 p-3">
                  <p className="text-sm text-[var(--muted)]">{prompt.frequency}</p>
                  <p className="mt-1 text-sm">{prompt.prompt}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--muted)]">No revision prompts are queued.</p>
            )}
          </div>
        </section>
      </div>
      <section className="rounded-lg border border-[var(--border)] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Current Learning Path</h2>
          <Link className="text-sm font-medium text-teal-700" href="/graph">
            View graph
          </Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {activeDomains.map(({ domain, categories }) => (
            <div key={domain.id} className="rounded-md border border-[var(--border)] p-3">
              <p className="font-medium">{domain.title}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {categories.reduce((count, category) => count + category.modules.reduce((total, module) => total + module.topics.length, 0), 0)} topics
              </p>
            </div>
          ))}
        </div>
      </section>
      <GuidedNextSteps steps={nextSteps} title="Continue the loop" />
    </section>
  );
}

function ReadinessCard({ title, percent, subtitle }: { title: string; percent: number; subtitle: string }) {
  return (
    <div className="rounded-md border border-[var(--border)] p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium">{title}</p>
        <p className="text-sm font-semibold text-teal-700">{percent}%</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-teal-700" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-sm text-[var(--muted)]">{subtitle}</p>
    </div>
  );
}
