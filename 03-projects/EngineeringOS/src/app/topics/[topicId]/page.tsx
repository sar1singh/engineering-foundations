import Link from "next/link";
import { appServices } from "@/lib/providers";

type TopicPageProps = {
  params: Promise<{ topicId: string }>;
};

export default async function TopicPage({ params }: TopicPageProps) {
  const { topicId } = await params;
  const content = await appServices.topicContentService.getTopicContentBySlug(topicId);

  if (!content) {
    return (
      <section className="space-y-4">
        <p className="text-sm font-medium text-teal-700">Topic Studio</p>
        <h1 className="text-3xl font-semibold">Topic not found</h1>
        <p className="text-[var(--muted)]">No topic exists for route parameter {topicId}.</p>
        <Link className="text-sm font-medium text-teal-700" href="/content">
          Browse available content
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-teal-700">Topic Studio</p>
        <h1 className="text-3xl font-semibold">{content.topic.title}</h1>
        <p className="mt-2 max-w-3xl text-[var(--muted)]">{content.topic.summary}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Difficulty" value={content.topic.difficulty} />
        <Metric label="Estimated time" value={`${content.topic.estimatedMinutes} min`} />
        <Metric label="Interview relevance" value={`${content.topic.interviewRelevance}/10`} />
      </div>
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-[var(--border)] bg-white p-5">
          <h2 className="text-xl font-semibold">Theory and mental model</h2>
          <p className="mt-3 text-[var(--muted)]">{content.topic.theory}</p>
          <div className="mt-4 rounded-md bg-slate-50 p-4">
            <p className="text-sm font-medium">Mental model</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{content.topic.mentalModel}</p>
          </div>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-white p-5">
          <h2 className="text-xl font-semibold">Learning modes</h2>
          <div className="mt-4 space-y-4">
            <Mode title="Fast Track" summary={content.topic.learningModes.fastTrack.summary} items={content.topic.learningModes.fastTrack.mustKnow} />
            <Mode title="Deep Mastery" summary={content.topic.learningModes.deepMastery.summary} items={content.topic.learningModes.deepMastery.mustKnow} />
          </div>
        </div>
      </section>
      <section className="rounded-lg border border-[var(--border)] bg-white p-5">
        <h2 className="text-xl font-semibold">Subtopics</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {content.subtopics.map((subtopic) => (
            <div key={subtopic.id} className="rounded-md border border-[var(--border)] p-3">
              <p className="font-medium">{subtopic.title}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{subtopic.summary}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-lg border border-[var(--border)] bg-white p-5">
        <h2 className="text-xl font-semibold">Practice tasks and problems</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {content.practiceTasks.map((task) => (
            <Link key={task.id} href={`/practice/${task.slug}`} className="rounded-md border border-[var(--border)] p-3 hover:border-teal-700">
              <p className="font-medium">{task.title}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{task.statement}</p>
            </Link>
          ))}
          {content.problemStatements.map((problem) => (
            <div key={problem.id} className="rounded-md bg-slate-50 p-3">
              <p className="font-medium">{problem.title}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{problem.statement}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <Panel title="Interview questions" items={content.interviewQuestions.map((question) => question.question)} />
        <Panel title="Revision prompts" items={content.revisionPrompts.map((prompt) => prompt.prompt)} />
        <Panel title="Prerequisites" items={content.prerequisites.map((topic) => topic.title)} />
        <Panel title="Related and advanced topics" items={[...content.relatedTopics, ...content.advancedTopics].map((topic) => topic.title)} />
      </section>
      <section className="rounded-lg border border-[var(--border)] bg-white p-5">
        <h2 className="text-xl font-semibold">References and rubric</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {content.referenceLinks.map((reference) => (
            <a
              key={reference.id}
              href={reference.url}
              className="rounded-md border border-[var(--border)] p-3 text-sm hover:border-teal-700"
              rel="noreferrer"
              target="_blank"
            >
              {reference.title}
            </a>
          ))}
          {content.evaluationRubric?.criteria.map((criterion) => (
            <div key={criterion.id} className="rounded-md bg-slate-50 p-3">
              <p className="font-medium">{criterion.title}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{criterion.description}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-4">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-2 font-semibold capitalize">{value}</p>
    </div>
  );
}

function Mode({ title, summary, items }: { title: string; summary: string; items: string[] }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-[var(--muted)]">{summary}</p>
      <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-[var(--muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-[var(--border)] bg-white p-5">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4 space-y-2">
        {items.length > 0 ? (
          items.map((item) => (
            <p key={item} className="rounded-md bg-slate-50 p-3 text-sm text-[var(--muted)]">
              {item}
            </p>
          ))
        ) : (
          <p className="text-sm text-[var(--muted)]">None linked yet</p>
        )}
      </div>
    </section>
  );
}
