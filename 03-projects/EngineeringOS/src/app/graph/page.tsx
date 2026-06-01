import Link from "next/link";
import { CheckCircle2, Circle, FlaskConical, GitBranch, RadioTower, Sparkles } from "lucide-react";
import { guidedCourses } from "@/data/guided-courses";
import { appServices } from "@/lib/providers";

export default async function GraphPage() {
  const domains = appServices.syllabusService.getDomains();
  const progress = await appServices.repositories.progressRepository.getCurrentProgress();
  const completed = new Set(progress.completedTopicIds);
  const topicBySlug = new Map(domains.flatMap((domain) => domain.modules.flatMap((module) => module.topics)).map((topic) => [topic.slug, topic]));
  const course = guidedCourses[0];
  const branchCourses = guidedCourses.slice(0, 4);

  return (
    <section className="space-y-8">
      <div className="eo-glow-card p-6">
        <div className="relative z-[1] flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Visual learning graph</p>
            <h1 className="mt-2 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">A roadmap-style map of your next moves.</h1>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">
              Branches group role paths into clickable phases. Nodes open syllabus content directly, with visual states for current, completed, capstone, and lab work.
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

      <section className="eo-card overflow-hidden p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-white">
            <GitBranch className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Primary branch: {course.title}</h2>
            <p className="text-sm text-[var(--muted)]">{course.promise}</p>
          </div>
        </div>

        <div className="relative mt-8 space-y-8 before:absolute before:left-5 before:top-4 before:h-[calc(100%-2rem)] before:w-px before:bg-gradient-to-b before:from-cyan-400 before:via-indigo-400 before:to-fuchsia-400 md:before:left-1/2">
          {course.stages.map((stage, stageIndex) => (
            <div key={stage.title} className={`relative grid gap-4 md:grid-cols-[1fr_64px_1fr] ${stageIndex % 2 === 1 ? "md:[&>*:first-child]:col-start-3" : ""}`}>
              <div className={`eo-gradient-border p-4 ${stageIndex % 2 === 1 ? "md:col-start-3" : ""}`}>
                <p className="text-xs font-bold uppercase text-teal-700">Stage {stageIndex + 1}</p>
                <h3 className="mt-1 text-xl font-semibold">{stage.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{stage.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {stage.topicSlugs.map((slug, topicIndex) => {
                    const topic = topicBySlug.get(slug);
                    const status = topic && completed.has(topic.id) ? "done" : stageIndex === 0 && topicIndex === 0 ? "current" : "next";
                    return (
                      <RoadmapNode
                        key={slug}
                        href={`/syllabus/${slug}`}
                        label={topic?.title ?? slug}
                        status={status}
                        hasLab={(topic?.enrichedContent?.handsOnLabs?.length ?? 0) > 0}
                        hasCapstone={(topic?.enrichedContent?.designCapstones.length ?? 0) > 0}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="absolute left-0 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-sm font-bold text-white shadow-lg md:static md:col-start-2 md:mx-auto">
                {stageIndex + 1}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {branchCourses.map((item) => (
          <Link key={item.slug} className="eo-card block p-4 hover:-translate-y-1 hover:border-teal-700" href={`/courses#${item.slug}`}>
            <Sparkles className="h-5 w-5 text-teal-700" aria-hidden="true" />
            <h3 className="mt-3 font-semibold">{item.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">{item.promise}</p>
          </Link>
        ))}
      </section>
    </section>
  );
}

function RoadmapNode({ href, label, status, hasLab, hasCapstone }: { href: string; label: string; status: "done" | "current" | "next"; hasLab: boolean; hasCapstone: boolean }) {
  return (
    <Link
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold transition hover:-translate-y-0.5 ${
        status === "done"
          ? "border-cyan-300 bg-cyan-400/15 text-cyan-100"
          : status === "current"
            ? "border-fuchsia-300 bg-fuchsia-400/15 text-fuchsia-100"
            : "border-[var(--border)] bg-slate-50 text-[var(--foreground)]"
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

function Legend({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-[var(--muted)]">
      {icon}
      <span>{label}</span>
    </div>
  );
}
