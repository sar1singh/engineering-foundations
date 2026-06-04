import Link from "next/link";
import { ArrowRight, ClipboardCheck, MessageSquareText } from "lucide-react";
import { answerBuilders } from "@/data/founder-success-experience";
import { appServices } from "@/lib/providers";

const builderTracks = [
  {
    title: "System design rounds",
    tone: "border-fuchsia-300/60 bg-fuchsia-400/10",
    builderTitle: "HLD answer builder",
    topicSlugs: ["hld-payment-system", "hld-booking-system", "hld-url-shortener", "hld-chat-system"]
  },
  {
    title: "LLD machine coding",
    tone: "border-cyan-300/60 bg-cyan-400/10",
    builderTitle: "LLD answer builder",
    topicSlugs: ["rate-limiter-lld", "cache-lld", "workflow-engine-lld", "api-design-contracts"]
  },
  {
    title: "Staff and EM judgment",
    tone: "border-violet-300/60 bg-violet-400/10",
    builderTitle: "Staff/EM strategy builder",
    topicSlugs: ["architecture-review", "incident-leadership", "technical-strategy", "stakeholder-communication"]
  },
  {
    title: "Recruiter and closing loop",
    tone: "border-amber-300/60 bg-amber-400/10",
    builderTitle: "Behavioral STAR+impact builder",
    topicSlugs: ["resume-linkedin-github", "behavioral-star-stories", "mock-interview-calibration", "coding-round-strategy"]
  }
];

export default function AnswerBuildersPage() {
  const topicBySlug = new Map(
    appServices.syllabusService
      .getDomains()
      .flatMap((domain) => domain.modules.flatMap((module) => module.topics))
      .map((topic) => [topic.slug, topic])
  );

  return (
    <section className="space-y-6">
      <div className="eo-glow-card p-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--accent-strong)]">Answer builders</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Structure beats panic.</h1>
        <p className="mt-3 max-w-3xl text-[var(--muted)]">
          Pick a round, open a topic, and use the framework to produce a crisp answer outline. This page is for practice output, not passive reading.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {builderTracks.map((track) => {
          const builder = answerBuilders.find((item) => item.title === track.builderTitle) ?? answerBuilders[0];
          const topics = track.topicSlugs.map((slug) => topicBySlug.get(slug)).filter(Boolean);
          return (
            <article key={track.title} className={`rounded-2xl border p-5 ${track.tone}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-strong)]">Practice track</p>
                  <h2 className="mt-1 text-2xl font-semibold">{track.title}</h2>
                </div>
                <MessageSquareText className="h-6 w-6 text-[var(--accent-strong)]" aria-hidden="true" />
              </div>

              <div className="mt-4 grid gap-2">
                {topics.map((topic) => (
                  topic ? (
                    <Link key={topic.slug} className="eo-panel flex items-center justify-between gap-3 p-3 transition hover:-translate-y-1 hover:border-[var(--accent)]" href={`/syllabus/${topic.slug}?section=interview`}>
                      <span>
                        <span className="block font-semibold">{topic.title}</span>
                        <span className="block text-sm text-[var(--muted)]">{topic.interviewQuestions.length} interview prompts / {topic.reviewPrompts.length} rubrics</span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </Link>
                  ) : null
                ))}
              </div>

              <details className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4" open={track.builderTitle === "HLD answer builder"}>
                <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-bold">
                  <ClipboardCheck className="h-4 w-4" /> View framework: {builder.title}
                </summary>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <Info title="Answer sections" items={builder.sections} />
                  <Info title="Prompt questions" items={builder.prompts} />
                  <Info title="Scoring rubric" items={builder.rubric} />
                  <div className="eo-panel p-3">
                    <p className="text-xs font-semibold uppercase text-[var(--accent-strong)]">Example outline</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">{builder.example}</p>
                  </div>
                </div>
              </details>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Info({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="eo-panel p-3">
      <p className="text-xs font-semibold uppercase text-[var(--accent-strong)]">{title}</p>
      <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
