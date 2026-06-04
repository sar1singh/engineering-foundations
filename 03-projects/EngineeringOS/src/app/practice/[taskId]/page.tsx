import Link from "next/link";
import { GuidedNextSteps } from "@/components/learning/GuidedNextSteps";
import { EvaluationHistory } from "@/components/persistence/EvaluationHistory";
import { MockEvaluationForm } from "@/components/persistence/MockEvaluationForm";
import { TaskCompletionForm } from "@/components/persistence/TaskCompletionForm";
import { LocalCodeRunner } from "@/components/practice/LocalCodeRunner";
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
  const evaluationResults = await appServices.repositories.evaluationResultRepository.getEvaluationResultsByTaskId(content.task.id);
  const runnerCode = content.task.solutionCode ?? content.task.starterCode ?? "";
  const initialCode = content.task.testHarness
    ? `${runnerCode}\n\n${content.task.testHarness}`
    : runnerCode;
  const isDesignWorkspace = ["design", "hld", "lld", "architecture"].some((keyword) =>
    `${content.task.taskType} ${content.task.title} ${content.task.statement}`.toLowerCase().includes(keyword)
  );

  return (
    <section className="space-y-6">
      <div className="eo-glow-card p-5">
        <div className="relative z-[1] flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-sm font-bold uppercase tracking-[0.16em] text-teal-700">
              {isDesignWorkspace ? "ARCHITECTURAL_RUBRIC // FOCUS ENGINE" : "DSA_WORKSPACE // FOCUS ENGINE"}
            </p>
            <h1 className="mt-1 text-3xl font-semibold md:text-4xl">{content.task.title}</h1>
            <p className="mt-2 max-w-4xl text-[var(--muted)]">{content.task.statement}</p>
          </div>
          <TaskCompletionForm isComplete={isComplete} routePath={`/practice/${taskId}`} taskId={content.task.id} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Difficulty" value={content.task.difficulty} />
        <Metric label="Task type" value={content.task.taskType} />
        <Metric label="Estimated time" value={`${content.task.estimatedMinutes} min`} />
      </div>
      <section className="eo-focus-workspace grid gap-6 p-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative z-0 space-y-5">
          <div className="eo-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Problem</h2>
              {content.topic ? (
                <Link className="eo-chip" href={`/topics/${content.topic.slug}`}>
                  Review {content.topic.title}
                </Link>
              ) : null}
            </div>
            <p className="mt-3 text-[var(--muted)]">{content.problemStatement?.statement ?? content.task.statement}</p>
            <div className="mt-4 space-y-2">
              {content.problemStatement?.examples.map((example) => (
                <div key={`${example.input}-${example.output}`} className="eo-panel p-3 text-sm">
                  <p><span className="font-medium">Input:</span> {example.input}</p>
                  <p><span className="font-medium">Output:</span> {example.output}</p>
                  <p className="text-[var(--muted)]">{example.explanation}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="eo-card p-5">
            <h2 className="text-xl font-semibold">Subtasks</h2>
            <div className="mt-4 space-y-3">
              {content.task.subtasks.map((subtask) => (
                <div key={subtask.id} className="eo-panel p-3">
                  <p className="font-medium">{subtask.order}. {subtask.title}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{subtask.description}</p>
                </div>
              ))}
            </div>
          </div>
          {isDesignWorkspace ? (
            <div className="eo-command-panel p-5">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--focus)]">TRADE-OFF MATRIX</p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {["Requirements", "Tradeoffs", "Failure modes"].map((label) => (
                  <div key={label} className="eo-panel p-3">
                    <p className="font-semibold">{label}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">Capture the senior signal before submitting review.</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
            <ListPanel title="Hints" items={content.task.hints} />
            <ListPanel title="Edge cases" items={content.task.edgeCases} />
            <ListPanel title="Completion criteria" items={content.task.completionCriteria} />
          </div>
        </div>
        <div className="relative z-50 order-first space-y-5 xl:order-none">
          <section className="eo-gradient-border p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">Code runner</p>
                <h2 className="mt-1 text-xl font-semibold">Implement, run, review</h2>
              </div>
              <span className="eo-chip">local alpha</span>
            </div>
            <LocalCodeRunner enabled={appServices.config.features.enableCodeRunner} initialCode={initialCode} />
          </section>
          {isDesignWorkspace ? (
            <section className="eo-card p-5">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--focus)]">SYSTEM ARCHITECTURE DIAGRAM</p>
              <div className="mt-4 flex min-h-56 items-center justify-center rounded-md border border-dashed border-[var(--border)] bg-[var(--surface-soft)] text-center font-mono text-sm uppercase tracking-[0.18em] text-[var(--muted)]">
                Sketchpad area / capture HLD notes before review
              </div>
            </section>
          ) : null}
          <details className="eo-card p-5" open>
            <summary className="cursor-pointer text-xl font-semibold">Starter code and visible harness</summary>
            <pre className="mt-4 overflow-auto rounded-md bg-slate-950 p-4 text-sm text-slate-100">
              {content.task.starterCode ?? "// No starter code available for this task."}
            </pre>
            {content.task.testHarness ? (
              <div className="mt-4">
                <h3 className="font-semibold">Test harness</h3>
                <pre className="mt-3 overflow-auto rounded-md bg-slate-950 p-4 text-sm text-slate-100">
                  {content.task.testHarness}
                </pre>
              </div>
            ) : null}
          </details>
        </div>
      </section>
      <section className="eo-card p-5">
        <h2 className="text-xl font-semibold">Evaluation rubric</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {content.evaluationRubric?.criteria.map((criterion) => (
            <div key={criterion.id} className="eo-panel p-3">
              <p className="font-medium">{criterion.title}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{criterion.description}</p>
              <p className="mt-2 text-sm text-teal-700">{criterion.maxScore} pts</p>
            </div>
          ))}
        </div>
        <MockEvaluationForm taskId={content.task.id} topicId={content.task.topicId} />
        <EvaluationHistory results={evaluationResults} />
      </section>
      <GuidedNextSteps
        steps={[
          content.topic
            ? {
                href: `/topics/${content.topic.slug}`,
                label: `Review ${content.topic.title}`,
                description: "Use the topic page to tighten theory and explain-back gaps."
              }
            : null,
          {
            href: "/progress",
            label: "Update your plan",
            description: "Check whether this task changed completion, weak areas, or readiness."
          },
          {
            href: "/content?q=practice",
            label: "Find another task",
            description: "Search for another focused repetition across the local content library."
          }
        ].filter((step): step is { href: string; label: string; description: string } => step !== null)}
      />
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="eo-card p-4">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-2 font-semibold capitalize">{value}</p>
    </div>
  );
}

function ListPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="eo-card p-5">
      <h2 className="text-xl font-semibold">{title}</h2>
      <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-[var(--muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
