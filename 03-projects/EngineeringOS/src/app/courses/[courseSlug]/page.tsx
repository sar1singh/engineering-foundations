import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, FlaskConical, RadioTower } from "lucide-react";
import { guidedCourses } from "@/data/guided-courses";
import { appServices } from "@/lib/providers";

type CourseJourneyPageProps = {
  params: Promise<{ courseSlug: string }>;
  searchParams: Promise<{ topic?: string }>;
};

export default async function CourseJourneyPage({ params, searchParams }: CourseJourneyPageProps) {
  const [{ courseSlug }, query] = await Promise.all([params, searchParams]);
  const course = guidedCourses.find((item) => item.slug === courseSlug);
  if (!course) notFound();

  const progress = await appServices.repositories.progressRepository.getCurrentProgress();
  const completed = new Set(progress.completedTopicIds);
  const topicBySlug = new Map(
    appServices.syllabusService
      .getDomains()
      .flatMap((domain) => domain.modules.flatMap((module) => module.topics))
      .map((topic) => [topic.slug, topic])
  );
  const courseTopics = course.topicSlugs.map((slug) => topicBySlug.get(slug)).filter(Boolean);
  const activeSlug = query.topic && course.topicSlugs.includes(query.topic) ? query.topic : course.topicSlugs[0];
  const activeIndex = course.topicSlugs.findIndex((slug) => slug === activeSlug);
  const activeTopic = activeSlug ? topicBySlug.get(activeSlug) : null;
  const previousSlug = activeIndex > 0 ? course.topicSlugs[activeIndex - 1] : null;
  const nextSlug = activeIndex >= 0 ? course.topicSlugs[activeIndex + 1] : null;
  const completedCount = courseTopics.filter((topic) => topic && completed.has(topic.id)).length;
  const percent = courseTopics.length ? Math.round((completedCount / courseTopics.length) * 100) : 0;

  return (
    <section className="space-y-6">
      <div className="eo-glow-card p-6">
        <div className="relative z-[1] flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-4xl">
            <Link className="text-sm font-bold text-[var(--accent-strong)]" href="/courses">
              <ArrowLeft className="mr-1 inline h-4 w-4" /> Courses
            </Link>
            <p className="mt-4 font-mono text-sm font-bold uppercase tracking-[0.18em] text-[var(--accent-strong)]">BLUEPRINT JOURNEY // {course.level}</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">{course.title}</h1>
            <p className="mt-3 text-base leading-7 text-[var(--muted)]">{course.promise}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {course.skills.map((skill) => <span key={skill} className="eo-chip">{skill}</span>)}
            </div>
          </div>
          <div className="eo-card min-w-64 p-4">
            <p className="text-sm font-bold">Course progress</p>
            <div className="mt-3 eo-progress"><span style={{ width: `${percent}%` }} /></div>
            <p className="mt-2 text-sm text-[var(--muted)]">{completedCount}/{courseTopics.length} lessons complete</p>
            {activeTopic ? (
              <Link className="eo-primary-action mt-4 w-full px-4 py-2 text-sm" href={`/syllabus/${activeTopic.slug}?fromCourse=${course.slug}`}>
                Open current lesson
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <section className="eo-blueprint-canvas space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">Roadmap stages</h2>
          <div className="flex flex-wrap gap-2">
            {previousSlug ? <Link className="eo-secondary-action px-3 py-2 text-sm" href={`/courses/${course.slug}?topic=${previousSlug}`}><ArrowLeft className="h-4 w-4" />Previous state</Link> : null}
            {nextSlug ? <Link className="eo-secondary-action px-3 py-2 text-sm" href={`/courses/${course.slug}?topic=${nextSlug}`}>Next state<ArrowRight className="h-4 w-4" /></Link> : null}
          </div>
        </div>
        <div className="space-y-4">
          {course.stages.map((stage, index) => {
            const stageTopics = stage.topicSlugs.map((slug) => topicBySlug.get(slug)).filter(Boolean);
            const firstStageTopic = stageTopics[0];
            const stageDone = stageTopics.filter((topic) => topic && completed.has(topic.id)).length;
            return (
              <details key={stage.title} className="eo-blueprint-node p-5" open={index === 0 || stage.topicSlugs.includes(activeSlug ?? "")}>
                <summary className="cursor-pointer list-none">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-strong)]">Stage {index + 1}</p>
                      <h3 className="mt-1 text-xl font-semibold">{stage.title}</h3>
                      <p className="mt-2 text-sm text-[var(--muted)]">{stage.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="eo-chip">{stageDone}/{stageTopics.length}</span>
                      {firstStageTopic ? <Link className="eo-secondary-action px-3 py-2 text-sm" href={`/syllabus/${firstStageTopic.slug}?fromCourse=${course.slug}`}>Start stage</Link> : null}
                    </div>
                  </div>
                </summary>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {stageTopics.map((topic) => (
                    topic ? (
                      <Link
                        key={topic.slug}
                        className={`flex min-h-28 items-start justify-between gap-3 rounded-md border p-4 transition hover:-translate-y-1 ${
                          topicTone(topic)
                        } ${
                          topic.slug === activeSlug ? "border-[var(--accent)]" : ""
                        }`}
                        href={`/syllabus/${topic.slug}?fromCourse=${course.slug}`}
                      >
                        <span className="flex items-center gap-3">
                          {completed.has(topic.id) ? <CheckCircle2 className="h-5 w-5 text-cyan-300" /> : <Circle className="h-5 w-5 text-[var(--muted)]" />}
                          <span>
                            <span className="block font-semibold">{topic.title}</span>
                            <span className="mt-1 block line-clamp-2 text-sm text-[var(--muted)]">{topic.definition}</span>
                            <span className="mt-2 flex flex-wrap gap-1">
                              {(topic.enrichedContent?.handsOnLabs?.length ?? 0) > 0 ? <span className="eo-chip"><FlaskConical className="h-3.5 w-3.5" />Lab</span> : null}
                              {(topic.enrichedContent?.designCapstones.length ?? 0) > 0 ? <span className="eo-chip"><RadioTower className="h-3.5 w-3.5" />Capstone</span> : null}
                              <span className="eo-chip">{contentLabel(topic)}</span>
                            </span>
                          </span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0" />
                      </Link>
                    ) : null
                  ))}
                </div>
              </details>
            );
          })}
        </div>
      </section>
    </section>
  );
}

function contentLabel(topic: NonNullable<ReturnType<typeof appServices.syllabusService.getTopicBySlug>>) {
  if ((topic.enrichedContent?.handsOnLabs?.length ?? 0) > 0) return "lab";
  if ((topic.enrichedContent?.designCapstones.length ?? 0) > 0) return "design";
  if ((topic.enrichedContent?.enrichedProblems.length ?? 0) > 0 || topic.practiceProblems.some((problem) => problem.starterCode)) return "coding";
  if (topic.slug.includes("interview") || topic.slug.includes("behavioral")) return "interview";
  return "learn";
}

function topicTone(topic: NonNullable<ReturnType<typeof appServices.syllabusService.getTopicBySlug>>) {
  const label = contentLabel(topic);
  if (label === "lab") return "border-amber-300/50 bg-amber-400/10";
  if (label === "design") return "border-fuchsia-300/50 bg-fuchsia-400/10";
  if (label === "coding") return "border-cyan-300/50 bg-cyan-400/10";
  if (label === "interview") return "border-violet-300/50 bg-violet-400/10";
  return "border-[var(--border)] bg-[var(--surface-soft)]";
}
