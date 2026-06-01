import Link from "next/link";
import { Cloud, Code2, Crown, MessageSquareText, Network, Rocket, Server, Users } from "lucide-react";
import { guidedCourses } from "@/data/guided-courses";
import { appServices } from "@/lib/providers";

const iconMap = {
  server: Server,
  cloud: Cloud,
  strategy: Crown,
  manager: Users,
  code: Code2,
  diagram: Network,
  rocket: Rocket,
  message: MessageSquareText
};

export default async function CoursesPage() {
  const progress = await appServices.repositories.progressRepository.getCurrentProgress();
  const completed = new Set(progress.completedTopicIds);
  const topicBySlug = new Map(
    appServices.syllabusService
      .getDomains()
      .flatMap((domain) => domain.modules.flatMap((module) => module.topics))
      .map((topic) => [topic.slug, topic])
  );

  const courses = guidedCourses.map((course) => {
    const topics = course.topicSlugs.map((slug) => topicBySlug.get(slug)).filter(Boolean);
    const done = topics.filter((topic) => topic && completed.has(topic.id)).length;
    return { ...course, total: topics.length, completed: done, percent: topics.length > 0 ? Math.round((done / topics.length) * 100) : 0 };
  });

  return (
    <section className="space-y-8">
      <div className="eo-glow-card p-6">
        <div className="relative z-[1] max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Guided roadmaps</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Choose a mission, not a menu.</h1>
          <p className="mt-4 text-lg text-[var(--muted)]">
            Prebuilt role paths turn the full syllabus into focused courses with stages, completion signals, and interview-ready outcomes.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["80/20 first", "role based", "capstone backed", "AWS first", "interview ready"].map((item) => (
              <span key={item} className="eo-chip">{item}</span>
            ))}
          </div>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {courses.map((course) => {
          const Icon = iconMap[course.icon];
          return (
            <Link key={course.slug} className="eo-gradient-border group flex min-h-80 flex-col p-4 transition hover:-translate-y-1" href={`/courses#${course.slug}`}>
              <div className={`rounded-2xl bg-gradient-to-br ${course.gradient} p-4 text-white shadow-lg`}>
                <div className="flex items-start justify-between gap-3">
                  <Icon className="h-8 w-8" aria-hidden="true" />
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur">{course.duration}</span>
                </div>
                <h2 className="mt-6 text-xl font-semibold">{course.title}</h2>
                <p className="mt-2 text-sm text-white/85">{course.level}</p>
              </div>
              <p className="mt-4 text-sm text-[var(--muted)]">{course.promise}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {course.skills.slice(0, 4).map((skill) => (
                  <span key={skill} className="rounded-full bg-slate-50 px-2 py-1 text-xs font-semibold text-[var(--muted)]">{skill}</span>
                ))}
              </div>
              <div className="mt-auto pt-5">
                <div className="eo-progress"><span style={{ width: `${course.percent}%` }} /></div>
                <p className="mt-2 text-sm text-[var(--muted)]">{course.completed}/{course.total} topics complete</p>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="space-y-5">
        {courses.map((course) => (
          <article key={course.slug} id={course.slug} className="eo-card scroll-mt-24 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">{course.level}</p>
                <h2 className="mt-1 text-2xl font-semibold">{course.title}</h2>
                <p className="mt-2 max-w-3xl text-sm text-[var(--muted)]">{course.audience}</p>
              </div>
              <Link className="eo-primary-action px-4 py-2 text-sm" href={`/syllabus?role=${roleSlugForCourse(course.slug)}&priority=core-80-20`}>
                Start course
              </Link>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {course.stages.map((stage, index) => (
                <div key={stage.title} className="eo-panel p-4">
                  <p className="text-xs font-bold uppercase text-teal-700">Stage {index + 1}</p>
                  <h3 className="mt-1 font-semibold">{stage.title}</h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">{stage.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {stage.topicSlugs.slice(0, 4).map((slug) => (
                      <Link key={slug} className="rounded-full bg-slate-50 px-2 py-1 text-xs text-[var(--muted)] hover:text-teal-700" href={`/syllabus/${slug}`}>
                        {slug}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </section>
  );
}

function roleSlugForCourse(courseSlug: string): string {
  const map: Record<string, string> = {
    "senior-backend-engineer": "backend-senior-engineer",
    "aws-solution-architect": "solution-architect",
    "staff-principal-engineer": "staff-principal-engineer",
    "engineering-manager": "engineering-manager"
  };
  return map[courseSlug] ?? "backend-senior-engineer";
}
