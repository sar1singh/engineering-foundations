import Link from "next/link";
import { cookies } from "next/headers";
import { guidedCourses } from "@/data/guided-courses";
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
  const allSyllabusTopics = syllabusDomains.flatMap((domain) => domain.modules.flatMap((module) => module.topics));
  const activeCourse = guidedCourses.find((course) => course.slug === courseSlugForRole(preferences.targetRole)) ?? guidedCourses[0];
  const activeCourseTopics = activeCourse.topicSlugs.map((slug) => allSyllabusTopics.find((topic) => topic.slug === slug)).filter(Boolean);
  const activeCourseCompleted = activeCourseTopics.filter((topic) => topic && progress.completedTopicIds.includes(topic.id)).length;
  const activeCourseResumeTopic = activeCourseTopics.find((topic) => topic && !progress.completedTopicIds.includes(topic.id)) ?? activeCourseTopics[0] ?? null;
  const activeCoursePercent = activeCourseTopics.length > 0 ? Math.round((activeCourseCompleted / activeCourseTopics.length) * 100) : 0;
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
    return { ...group, href: `/syllabus?domain=${group.slugs[0]}`, percent: total > 0 ? Math.round((completed / total) * 100) : 0, subtitle: `${completed}/${total} topics` };
  });
  const activeRoadmap = dashboard.roadmapTree?.roadmap;
  const activeDomains = dashboard.roadmapTree?.domains.slice(0, 6) ?? [];
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
            <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-teal-700">MISSION_CONTROL // ACTIVE</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">Mission in progress</h1>
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
      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="eo-command-panel p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent-strong)]">TODAY&apos;S PROTOCOL</p>
              <h2 className="mt-2 text-2xl font-semibold">{todaysLesson?.title ?? dashboard.currentTopic?.title ?? "Choose the next lesson"}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                Execute one focused loop: learn the mental model, run or review the example, complete one practice rep, and submit an explain-back answer.
              </p>
            </div>
            <span className="eo-chip">68% complete</span>
          </div>
          <div className="mt-5 grid gap-3">
            {["Architectural review of the current topic", "Stress-test implementation or case prompt", "Telemetry sync: save progress and weak area"].map((item, index) => (
              <div key={item} className="eo-panel flex items-center justify-between gap-3 p-3">
                <span className="font-mono text-xs text-[var(--muted)]">{String(index + 1).padStart(2, "0")}_STEP</span>
                <span className="flex-1 font-semibold">{item}</span>
                <span className={index === 0 ? "text-[var(--success)]" : "text-[var(--muted)]"}>{index === 0 ? "queued" : "pending"}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
          <div className="eo-telemetry-card p-5">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent-strong)]">READINESS TELEMETRY</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {readinessGroups.slice(0, 4).map((group) => (
                <Link key={group.label} className="rounded-md border border-[var(--border)] p-3 text-center hover:border-[var(--accent)]" href={group.href}>
                  <p className="text-2xl font-semibold">{group.percent}%</p>
                  <p className="mt-1 font-mono text-xs uppercase text-[var(--muted)]">{group.label}</p>
                </Link>
              ))}
            </div>
          </div>
          <div className="eo-danger-card p-5">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[var(--danger)]">VULNERABILITY DETECTED</p>
            <h2 className="mt-3 text-xl font-semibold">Weak-area repair queue</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {dashboard.weakAreas.length} weak areas are tracked. Use the repair queue before adding more syllabus breadth.
            </p>
            <Link className="eo-secondary-action mt-4 px-4 py-2 text-sm" href="/weak-areas">
              Initiate remediation
            </Link>
          </div>
        </div>
      </section>
      <section className="eo-gradient-border p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--accent-strong)]">Resume course</p>
            <h2 className="mt-1 text-2xl font-semibold">{activeCourse.title}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {activeCourseResumeTopic ? `Next lesson: ${activeCourseResumeTopic.title}` : "Roadmap complete. Move into mock interviews or deeper revision."}
            </p>
            <div className="mt-3 max-w-md">
              <div className="eo-progress"><span style={{ width: `${activeCoursePercent}%` }} /></div>
              <p className="mt-2 text-xs text-[var(--muted)]">{activeCourseCompleted}/{activeCourseTopics.length} lessons complete</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className="eo-primary-action px-4 py-2 text-sm" href={`/courses/${activeCourse.slug}${activeCourseResumeTopic ? `?topic=${activeCourseResumeTopic.slug}` : ""}`}>
              Resume course
            </Link>
            {activeCourseResumeTopic ? (
              <Link className="eo-secondary-action px-4 py-2 text-sm" href={`/syllabus/${activeCourseResumeTopic.slug}?fromCourse=${activeCourse.slug}`}>
                Open next lesson
              </Link>
            ) : null}
          </div>
        </div>
      </section>
      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="eo-gradient-border p-5">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">Start here</p>
          <h2 className="mt-2 text-2xl font-semibold">{todaysLesson?.title ?? dashboard.currentTopic?.title ?? "Choose today's lesson"}</h2>
          <p className="mt-2 text-[var(--muted)]">
            {todaysLesson?.definition ?? (dashboard.currentTopic ? `Continue with ${dashboard.currentTopic.title} and convert it into one focused practice rep.` : "Use the guided role path to pick the highest-ROI topic for today.")}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {todaysLesson ? <Link className="eo-primary-action px-4 py-2 text-sm" href={`/syllabus/${todaysLesson.slug}`}>Open lesson</Link> : null}
            {dashboard.todayMission ? <Link className="eo-secondary-action px-4 py-2 text-sm" href={`/practice/${dashboard.todayMission.slug}`}>Open practice</Link> : null}
            <Link className="eo-secondary-action px-4 py-2 text-sm" href={`/syllabus?role=${preferences.targetRole}&priority=core-80-20`}>Role path</Link>
          </div>
        </div>
        <div className="eo-card p-5">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">Mission status</p>
          <div className="mt-4 grid gap-3">
            <MissionStat label="Readiness" value={`${assessmentReadiness.score}%`} />
            <MissionStat label="Study pace" value={`${preferences.hoursPerWeek}h/week`} />
            <MissionStat label="Deadline" value={`${preferences.deadlineWeeks} weeks`} />
            <MissionStat label="Weak areas" value={`${dashboard.weakAreas.length} tracked`} />
          </div>
        </div>
      </section>
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
      <details className="eo-card p-5">
        <summary className="cursor-pointer text-xl font-semibold">Analytics and readiness details</summary>
        <div className="mt-5 space-y-6">
      <MissionReadinessChart domains={domainReadiness} roles={roleReadiness} />
      <section className="eo-panel p-5">
        <h2 className="text-xl font-semibold">Readiness breakdown</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {readinessGroups.map((group) => (
            <ReadinessCard key={group.label} href={group.href} title={group.label} percent={group.percent} subtitle={group.subtitle} />
          ))}
        </div>
      </section>
      <ApiReadinessStrip />
      <ApiProgressSummaryCard />
      <section className="eo-panel p-5">
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
      <section className="eo-panel p-5">
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
            <ReadinessCard key={role.slug} href={`/syllabus?role=${role.slug}&priority=core-80-20`} title={role.title} percent={role.percent} subtitle={`${role.completed}/${role.total} topics`} />
          ))}
        </div>
      </section>
      <section className="eo-panel p-5">
        <h2 className="text-xl font-semibold">Domain readiness</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {domainReadiness.map((domain) => (
            <ReadinessCard key={domain.slug} href={`/syllabus?domain=${domain.slug}`} title={domain.title} percent={domain.percent} subtitle={`${domain.completed}/${domain.total} topics`} />
          ))}
        </div>
      </section>
        </div>
      </details>
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

function ReadinessCard({ href, title, percent, subtitle }: { href?: string; title: string; percent: number; subtitle: string }) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium">{title}</p>
        <p className="text-sm font-semibold text-teal-700">{percent}%</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-teal-700" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-sm text-[var(--muted)]">{subtitle}</p>
    </>
  );
  const className = "group rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3 transition hover:-translate-y-1 hover:border-[var(--accent)]";
  return href ? (
    <Link className={className} href={href}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

function MissionStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-slate-50 px-3 py-2">
      <span className="text-sm text-[var(--muted)]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function courseSlugForRole(roleSlug: string): string {
  const map: Record<string, string> = {
    "backend-senior-engineer": "senior-backend-engineer",
    "solution-architect": "aws-solution-architect",
    "staff-principal-engineer": "staff-principal-engineer",
    "engineering-manager": "engineering-manager"
  };
  return map[roleSlug] ?? "senior-backend-engineer";
}
