import Link from "next/link";
import { markTaskCompleteAction, savePracticeMockEvaluationFormAction } from "@/lib/actions/progress-actions";
import { appServices } from "@/lib/providers";

type PracticePageProps = {
  params: Promise<{ taskId: string }>;
};

export default async function PracticePage({ params }: PracticePageProps) {
  const { taskId } = await params;
  const content = await appServices.practiceContentService.getPracticeContentBySlug(taskId);
  const progress = await appServices.repositories.progressRepository.getCurrentProgress();

  if (!content) {
    return (
      <section className="space-y-4">
        <p className="text-sm font-medium text-teal-700">Practice Lab</p>
        <h1 className="text-3xl font-semibold">Practice task not found</h1>
        <p className="text-[var(--muted)]">No practice task exists for route parameter {taskId}.</p>
        <Link className="text-sm font-medium text-teal-700" href="/content">
          Browse available tasks
        </Link>
      </section>
    );
  }

  const isComplete = progress.completedTaskIds.includes(content.task.id);
  const completeTask = markTaskCompleteAction.bind(null, content.task.id);
  const saveMockEvaluation = savePracticeMockEvaluationFormAction.bind(null, content.task.id, content.task.topicId);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-teal-700">Practice Lab</p>
          <h1 className="text-3xl font-semibold">{content.task.title}</h1>
          <p className="mt-2 max-w-3xl text-[var(--muted)]">{content.task.statement}</p>
          {content.topic ? (
            <Link className="mt-3 inline-block text-sm font-medium text-teal-700" href={`/topics/${content.topic.slug}`}>
              Back to {content.topic.title}
            </Link>
          ) : null}
        </div>
        <form action={completeTask}>
          <button
            className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
            disabled={isComplete}
            type="submit"
          >
            {isComplete ? "Task complete" : "Mark task complete"}
          </button>
        </form>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Difficulty" value={content.task.difficulty} />
        <Metric label="Task type" value={content.task.taskType} />
        <Metric label="Estimated time" value={`${content.task.estimatedMinutes} min`} />
      </div>
      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-[var(--border)] bg-white p-5">
          <h2 className="text-xl font-semibold">Subtasks</h2>
          <div className="mt-4 space-y-3">
            {content.task.subtasks.map((subtask) => (
              <div key={subtask.id} className="rounded-md bg-slate-50 p-3">
                <p className="font-medium">{subtask.order}. {subtask.title}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{subtask.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-white p-5">
          <h2 className="text-xl font-semibold">Problem statement</h2>
          <p className="mt-3 text-[var(--muted)]">{content.problemStatement?.statement ?? "No problem linked."}</p>
          <div className="mt-4 space-y-2">
            {content.problemStatement?.examples.map((example) => (
              <div key={`${example.input}-${example.output}`} className="rounded-md bg-slate-50 p-3 text-sm">
                <p><span className="font-medium">Input:</span> {example.input}</p>
                <p><span className="font-medium">Output:</span> {example.output}</p>
                <p className="text-[var(--muted)]">{example.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="grid gap-6 xl:grid-cols-3">
        <ListPanel title="Hints" items={content.task.hints} />
        <ListPanel title="Edge cases" items={content.task.edgeCases} />
        <ListPanel title="Completion criteria" items={content.task.completionCriteria} />
      </section>
      <section className="rounded-lg border border-[var(--border)] bg-white p-5">
        <h2 className="text-xl font-semibold">Starter code</h2>
        <pre className="mt-4 overflow-auto rounded-md bg-slate-950 p-4 text-sm text-slate-100">
          {content.task.starterCode ?? "// No starter code available for this task."}
        </pre>
      </section>
      <section className="rounded-lg border border-[var(--border)] bg-white p-5">
        <h2 className="text-xl font-semibold">Evaluation rubric</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {content.evaluationRubric?.criteria.map((criterion) => (
            <div key={criterion.id} className="rounded-md bg-slate-50 p-3">
              <p className="font-medium">{criterion.title}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{criterion.description}</p>
              <p className="mt-2 text-sm text-teal-700">{criterion.maxScore} pts</p>
            </div>
          ))}
        </div>
        <form action={saveMockEvaluation} className="mt-5 space-y-3 border-t border-[var(--border)] pt-4">
          <label className="block text-sm font-medium" htmlFor="mock-evaluation-summary">
            Mock evaluation note
          </label>
          <textarea
            className="min-h-24 w-full rounded-md border border-[var(--border)] p-3 text-sm outline-none focus:border-teal-700"
            id="mock-evaluation-summary"
            name="summary"
            placeholder="Capture a short self-review for this task."
          />
          <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white" type="submit">
            Save mock evaluation
          </button>
        </form>
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

function ListPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-[var(--border)] bg-white p-5">
      <h2 className="text-xl font-semibold">{title}</h2>
      <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-[var(--muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
