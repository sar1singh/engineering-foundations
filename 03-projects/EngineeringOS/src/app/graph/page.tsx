import Link from "next/link";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { CheckCircle2, Circle, FlaskConical, GitBranch, RadioTower, Sparkles } from "lucide-react";
import { guidedCourses } from "@/data/guided-courses";
import { appServices } from "@/lib/providers";
import { learningPreferencesCookieName, parseLearningPreferences } from "@/lib/services/onboarding-service";

export default async function GraphPage() {
  const domains = appServices.syllabusService.getDomains();
  const progress = await appServices.repositories.progressRepository.getCurrentProgress();
  const cookieStore = await cookies();
  const preferences = parseLearningPreferences(cookieStore.get(learningPreferencesCookieName)?.value);
  const completed = new Set(progress.completedTopicIds);
  const topicBySlug = new Map(domains.flatMap((domain) => domain.modules.flatMap((module) => module.topics)).map((topic) => [topic.slug, topic]));
  const targetCourse = courseSlugForRole(preferences.targetRole);
  const sortedCourses = [...guidedCourses].sort((a, b) => (a.slug === targetCourse ? -1 : b.slug === targetCourse ? 1 : 0));
  const primaryCourses = sortedCourses.slice(0, 1);
  const branchCourses = sortedCourses.slice(1, 8);

  return (
    <section className="space-y-8">
      <div className="eo-glow-card p-6">
        <div className="relative z-[1] flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-teal-700">BLUEPRINT_MODULE // ROLE PATH</p>
            <h1 className="mt-2 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">Blueprint roadmap canvas.</h1>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">
              The saved target role appears first. Adjacent paths stay collapsed so the graph remains a map, not another syllabus wall.
            </p>
          </div>
          <div className="eo-panel grid gap-2 p-3 text-sm">
            <Legend icon={<CheckCircle2 className="h-4 w-4 text-teal-700" />} label="completed/current" />
            <Legend icon={<FlaskConical className="h-4 w-4 text-amber-400" />} label="hands-on lab" />
            <Legend icon={<RadioTower className="h-4 w-4 text-fuchsia-400" />} label="capstone" />
            <Legend icon={<Circle className="h-4 w-4 text-[var(--muted)]" />} label="optional/next" />
          </div>
        </div>
      </div>

      <section className="eo-command-panel overflow-hidden p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-white">
            <GitBranch className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Role roadmap canvas</h2>
            <p className="text-sm text-[var(--muted)]">Branch lanes show how each role path moves from foundation to expert simulation.</p>
          </div>
        </div>

        <div className="eo-scroll mt-8 overflow-x-auto pb-4">
          <div className="eo-blueprint-canvas min-w-[820px] p-6">
            <div className="absolute left-12 right-12 top-28 h-px bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400" />
            <div className="absolute right-6 top-6 z-[1] hidden border border-[var(--accent)] bg-[var(--surface)] p-4 md:block">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-strong)]">ACTIVE SESSION</p>
              <p className="mt-1 font-semibold">{primaryCourses[0]?.title ?? "EngineeringOS"}</p>
              <Link className="mt-3 inline-flex text-sm font-bold text-[var(--accent-strong)]" href={`/courses/${primaryCourses[0]?.slug ?? "senior-backend-engineer"}`}>Resume module</Link>
            </div>
            <div className="grid gap-5">
              {primaryCourses.map((course, courseIndex) => (
                <div key={course.slug} className="relative">
                  <Link className={`eo-blueprint-node block bg-gradient-to-br ${course.gradient} p-4 text-white shadow-lg`} href={`/courses/${course.slug}`}>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/75">Branch {courseIndex + 1}</p>
                    <h3 className="mt-2 text-lg font-semibold">{course.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-white/80">{course.promise}</p>
                  </Link>
                  <div className="mx-auto h-8 w-px bg-gradient-to-b from-cyan-400 to-transparent" />
                  <div className="space-y-4">
                    {course.stages.map((stage, stageIndex) => (
                      <div key={stage.title} className="eo-blueprint-node p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold uppercase text-teal-700">Stage {stageIndex + 1}</p>
                          <span className="rounded-full bg-slate-50 px-2 py-1 text-xs text-[var(--muted)]">{stageIndex < 2 ? "core" : "advanced"}</span>
                        </div>
                        <h4 className="mt-1 font-semibold">{stage.title}</h4>
                        <div className="mt-3 space-y-3">
                          {groupStageTopics(stage.topicSlugs, topicBySlug).map((group) => (
                            <div key={group.label}>
                              <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{group.label}</p>
                              <div className="flex flex-wrap gap-2">
                                {group.slugs.slice(0, 5).map((slug, topicIndex) => {
                                  const topic = topicBySlug.get(slug);
                            const status = topic && completed.has(topic.id) ? "done" : courseIndex === 0 && stageIndex === 0 && topicIndex === 0 ? "current" : "next";
                            return (
                              <RoadmapNode
                                key={slug}
                                href={`/syllabus/${slug}?fromCourse=${course.slug}`}
                                label={topic?.title ?? slug}
                                status={status}
                                hasLab={(topic?.enrichedContent?.handsOnLabs?.length ?? 0) > 0}
                                hasCapstone={(topic?.enrichedContent?.designCapstones.length ?? 0) > 0}
                                tone={topic ? contentLabel(topic) : "learn"}
                              />
                            );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <details className="eo-card p-5">
        <summary className="cursor-pointer text-xl font-semibold">Adjacent paths</summary>
        <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {branchCourses.map((item) => (
          <Link key={item.slug} className="eo-card block p-4 hover:-translate-y-1 hover:border-teal-700" href={`/courses/${item.slug}`}>
            <Sparkles className="h-5 w-5 text-teal-700" aria-hidden="true" />
            <h3 className="mt-3 font-semibold">{item.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">{item.promise}</p>
          </Link>
        ))}
        </section>
      </details>
    </section>
  );
}

function RoadmapNode({ href, label, status, hasLab, hasCapstone, tone }: { href: string; label: string; status: "done" | "current" | "next"; hasLab: boolean; hasCapstone: boolean; tone: string }) {
  return (
    <Link
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold transition hover:-translate-y-0.5 ${toneClass(tone)} ${
        status === "done"
          ? "ring-1 ring-cyan-300"
          : status === "current"
            ? "ring-2 ring-fuchsia-300"
            : ""
      }`}
      href={href}
    >
      {status === "done" ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> : <Circle className="h-3.5 w-3.5" aria-hidden="true" />}
      <span>{label}</span>
      {hasLab ? <FlaskConical className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" /> : null}
      {hasCapstone ? <RadioTower className="h-3.5 w-3.5 text-fuchsia-300" aria-hidden="true" /> : null}
    </Link>
  );
}

function groupStageTopics(slugs: string[], topicBySlug: Map<string, NonNullable<ReturnType<typeof appServices.syllabusService.getTopicBySlug>>>) {
  const groups = new Map<string, string[]>();
  for (const slug of slugs) {
    const topic = topicBySlug.get(slug);
    const label = topic ? contentLabel(topic) : "learn";
    groups.set(label, [...(groups.get(label) ?? []), slug]);
  }
  return Array.from(groups.entries()).map(([label, groupedSlugs]) => ({ label, slugs: groupedSlugs }));
}

function contentLabel(topic: NonNullable<ReturnType<typeof appServices.syllabusService.getTopicBySlug>>) {
  if ((topic.enrichedContent?.handsOnLabs?.length ?? 0) > 0) return "lab";
  if ((topic.enrichedContent?.designCapstones.length ?? 0) > 0) return "design";
  if ((topic.enrichedContent?.enrichedProblems.length ?? 0) > 0 || topic.practiceProblems.some((problem) => problem.starterCode)) return "coding";
  if (topic.slug.includes("interview") || topic.slug.includes("behavioral")) return "interview";
  return "learn";
}

function toneClass(tone: string) {
  if (tone === "lab") return "border-amber-300/60 bg-amber-400/15 text-amber-100";
  if (tone === "design") return "border-fuchsia-300/60 bg-fuchsia-400/15 text-fuchsia-100";
  if (tone === "coding") return "border-cyan-300/60 bg-cyan-400/15 text-cyan-100";
  if (tone === "interview") return "border-violet-300/60 bg-violet-400/15 text-violet-100";
  return "border-[var(--border)] bg-slate-50 text-[var(--foreground)]";
}

function courseSlugForRole(roleSlug: string) {
  const map: Record<string, string> = {
    "backend-senior-engineer": "senior-backend-engineer",
    "solution-architect": "aws-solution-architect",
    "staff-principal-engineer": "staff-principal-engineer",
    "engineering-manager": "engineering-manager"
  };
  return map[roleSlug] ?? "senior-backend-engineer";
}

function Legend({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-[var(--muted)]">
      {icon}
      <span>{label}</span>
    </div>
  );
}
