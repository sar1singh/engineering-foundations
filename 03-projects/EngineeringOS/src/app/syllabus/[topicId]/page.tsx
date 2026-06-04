import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, ExternalLink, Lightbulb, PlayCircle } from "lucide-react";
import { TimedMockInterview } from "@/components/interview/TimedMockInterview";
import { LabCompletionControls } from "@/components/labs/LabCompletionControls";
import { CodeRunnerWorkbench } from "@/components/learning/CodeRunnerWorkbench";
import { SourceReferencesPanel } from "@/components/learning/SourceReferencesPanel";
import { ExplainBackHistory } from "@/components/persistence/ExplainBackHistory";
import { EvaluationHistory } from "@/components/persistence/EvaluationHistory";
import { SyllabusResponseForm } from "@/components/persistence/SyllabusResponseForm";
import { TopicCompletionForm } from "@/components/persistence/TopicCompletionForm";
import { practiceTasks } from "@/data/practice-tasks";
import { appServices } from "@/lib/providers";
import type { EnrichedDesignCapstone, EnrichedHandsOnLab, EnrichedPracticeProblem, EnrichedTopicContent } from "@/types/enriched-content";
import type { SyllabusPracticeProblem, SyllabusReviewPrompt, SyllabusTopic } from "@/types/syllabus";

type TopicSection = "learn" | "solution" | "code" | "practice" | "interview" | "review" | "references";

type SyllabusTopicPageProps = {
  params: Promise<{ topicId: string }>;
  searchParams: Promise<{ fromCourse?: string; section?: string }>;
};

const sections: Array<{ id: TopicSection; label: string }> = [
  { id: "learn", label: "Learn" },
  { id: "solution", label: "Solution lab" },
  { id: "code", label: "Code" },
  { id: "practice", label: "Practice" },
  { id: "interview", label: "Interview" },
  { id: "review", label: "Review" },
  { id: "references", label: "References" }
];

export default async function SyllabusTopicPage({ params, searchParams }: SyllabusTopicPageProps) {
  const [{ topicId }, query] = await Promise.all([params, searchParams]);
  const topic = appServices.syllabusService.getTopicBySlug(topicId);
  const progress = await appServices.repositories.progressRepository.getCurrentProgress();

  if (!topic) {
    return (
      <section className="space-y-4">
        <p className="text-sm font-medium text-[var(--accent-strong)]">Syllabus</p>
        <h1 className="text-3xl font-semibold">Syllabus topic not found</h1>
        <p className="text-[var(--muted)]">No imported syllabus topic exists for {topicId}.</p>
        <Link className="text-sm font-medium text-[var(--accent-strong)]" href="/syllabus">
          Browse syllabus
        </Link>
      </section>
    );
  }

  const attempts = await appServices.repositories.explainBackRepository.getExplainBackAttemptsByTopicId(topic.id);
  const evaluationResults = await appServices.repositories.evaluationResultRepository.getEvaluationResultsByTopicId(topic.id);
  const isComplete = progress.completedTopicIds.includes(topic.id);
  const hasSolutionLab =
    Boolean(topic.enrichedContent) ||
    topic.slug.startsWith("hld-") ||
    topic.slug.includes("lld") ||
    topic.slug.includes("aws");
  const activeSection = parseTopicSection(query.section, hasSolutionLab ? "solution" : "learn");
  const allTopics = appServices.syllabusService.getDomains().flatMap((domain) => domain.modules.flatMap((module) => module.topics));
  const currentIndex = allTopics.findIndex((item) => item.slug === topic.slug);
  const previousTopic = allTopics[currentIndex - 1] ?? null;
  const nextTopic = allTopics[currentIndex + 1] ?? allTopics[0] ?? null;
  const relatedTopics = allTopics
    .filter((item) => item.slug !== topic.slug && (item.sourcePath === topic.sourcePath || item.references.some((reference) => topic.references.some((topicReference) => topicReference.sourceType === reference.sourceType))))
    .slice(0, 4);
  const practiceNext = practiceTasks.find((task) => topic.enrichedContent?.enrichedProblems.some((problem) => problem.id === task.sourceProblemId));

  return (
    <section className="space-y-6">
      <div className="eo-glow-card p-6">
        <div className="relative z-[1] flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-4xl">
            {query.fromCourse ? (
              <Link className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-[var(--accent-strong)]" href={`/courses/${query.fromCourse}`}>
                <ArrowLeft className="h-4 w-4" /> Back to roadmap
              </Link>
            ) : null}
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--accent-strong)]">Syllabus Topic</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{topic.title}</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--muted)]">{topic.definition}</p>
            <StatusStrip
              attempts={attempts.length}
              complete={isComplete}
              evaluations={evaluationResults.length}
              interviewCount={topic.interviewQuestions.length}
              practiceCount={topic.practiceProblems.length}
              referenceCount={topic.references.length}
            />
          </div>
          <TopicCompletionForm isComplete={isComplete} topicId={topic.id} />
        </div>
      </div>

      <nav className="eo-focus-workspace sticky top-20 z-10 flex flex-wrap gap-2 p-3">
        {sections.map((section) => (
          <Link
            key={section.id}
            className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
              activeSection === section.id ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]" : "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]"
            }`}
            href={`/syllabus/${topic.slug}?section=${section.id}`}
          >
            {section.label}
          </Link>
        ))}
      </nav>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          {activeSection === "learn" ? <LearnSection topic={topic} /> : null}
          {activeSection === "solution" ? (
            topic.enrichedContent ? <EnrichedSolutionLab content={topic.enrichedContent} /> : <EmptySection message="No enriched solution lab exists for this topic yet. Use Learn, Code, and Practice for now." />
          ) : null}
          {activeSection === "code" ? <CodeSection topic={topic} /> : null}
          {activeSection === "practice" ? <PracticePanel topic={topic} practiceNextSlug={practiceNext?.slug} /> : null}
          {activeSection === "interview" ? <InterviewSection topic={topic} /> : null}
          {activeSection === "review" ? <ReviewSection topic={topic} /> : null}
          {activeSection === "references" ? <ReferencesSection topic={topic} content={topic.enrichedContent} attempts={attempts} evaluationResults={evaluationResults} /> : null}
        </div>
        <SourceReferencesPanel sourceRefs={topic.enrichedContent?.sourceRefs} topicReferences={topic.references} />
      </section>

      <section className="eo-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--accent-strong)]">Continue learning</p>
            <h2 className="mt-1 text-xl font-semibold">Traverse, practice, or revise</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {previousTopic ? <Link className="eo-secondary-action px-3 py-2 text-sm" href={`/syllabus/${previousTopic.slug}`}><ArrowLeft className="h-4 w-4" />Previous</Link> : null}
            {nextTopic ? <Link className="eo-primary-action px-3 py-2 text-sm" href={`/syllabus/${nextTopic.slug}`}><ArrowRight className="h-4 w-4" />Next</Link> : null}
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {nextTopic ? <ContinuationCard href={`/syllabus/${nextTopic.slug}`} label="Next content" title={nextTopic.title} text={nextTopic.definition} /> : null}
          {practiceNext ? <ContinuationCard href={`/practice/${practiceNext.slug}`} label="Practice next" title={practiceNext.title} text={practiceNext.statement} /> : null}
          <ContinuationCard href={`/syllabus/${topic.slug}?section=interview`} label="Interview next" title="Mock interview mode" text={`${topic.interviewQuestions.length} questions available for this topic.`} />
          {relatedTopics[0] ? <ContinuationCard href={`/syllabus/${relatedTopics[0].slug}`} label="Related content" title={relatedTopics[0].title} text={relatedTopics[0].definition} /> : null}
        </div>
      </section>
    </section>
  );
}

function parseTopicSection(value: string | undefined, fallback: TopicSection): TopicSection {
  return sections.some((section) => section.id === value) ? (value as TopicSection) : fallback;
}

function StatusStrip({ attempts, complete, evaluations, interviewCount, practiceCount, referenceCount }: { attempts: number; complete: boolean; evaluations: number; interviewCount: number; practiceCount: number; referenceCount: number }) {
  const items = [
    { done: complete, label: "Completion" },
    { done: attempts > 0, label: "Saved answer" },
    { done: evaluations > 0, label: "Mock score" },
    { done: practiceCount >= 8, label: `${practiceCount} practices` },
    { done: interviewCount >= 8, label: `${interviewCount} interviews` },
    { done: referenceCount > 0, label: `${referenceCount} refs` }
  ];
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item.label} className="eo-chip">
          {item.done ? <CheckCircle2 className="h-4 w-4 text-cyan-300" /> : <Circle className="h-4 w-4 text-amber-300" />}
          {item.label}
        </span>
      ))}
    </div>
  );
}

function LearnSection({ topic }: { topic: SyllabusTopic }) {
  return (
    <section className="grid gap-5">
      <article className="eo-focus-workspace border-l-4 border-l-cyan-300 p-6">
        <h2 className="text-2xl font-semibold">Theory and mental model</h2>
        <p className="mt-4 whitespace-pre-line text-base leading-8 text-[var(--muted)]">{topic.theory}</p>
        <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <p className="text-sm font-bold">Mental model</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{topic.mentalModel}</p>
        </div>
      </article>
      <article className="eo-card border-l-4 border-l-indigo-300 p-5">
        <h2 className="text-xl font-semibold">Readiness score inputs</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Progress signals are tracked as scoring criteria for readiness. They stay compact here so the learning page remains focused.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {topic.progressSignals.slice(0, 5).map((signal) => (
            <span key={signal} className="eo-chip">{signal.replaceAll("_", " ")}</span>
          ))}
        </div>
      </article>
    </section>
  );
}

function CodeSection({ topic }: { topic: SyllabusTopic }) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">Working code example</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          A focused two-column workspace for reading the example and running browser-safe JavaScript. Node.js runtime APIs are not available in this local alpha runner.
        </p>
      </div>
      {topic.codeExamples.map((example) => (
        <CodeRunnerWorkbench
          key={example.id}
          code={example.code}
          description={example.explanation}
          enabled={appServices.config.features.enableCodeRunner && example.runnable}
          language={example.language}
          title={example.title}
        />
      ))}
    </section>
  );
}

function PracticePanel({ topic, practiceNextSlug }: { topic: SyllabusTopic; practiceNextSlug?: string }) {
  return (
    <section className="space-y-5">
      <div className="eo-card p-5">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--accent-strong)]">Practice workspace</p>
        <h2 className="mt-1 text-2xl font-semibold">Solve with hints, signals, and deliberate submission</h2>
        <p className="mt-2 max-w-3xl text-sm text-[var(--muted)]">
          Each prompt now separates the problem, thought process, starter code, and your answer. Use the practice lab when a runnable task exists.
        </p>
        {practiceNextSlug ? (
          <Link className="eo-primary-action mt-4 px-4 py-2 text-sm" href={`/practice/${practiceNextSlug}`}>
            <PlayCircle className="h-4 w-4" /> Open runnable practice lab
          </Link>
        ) : null}
      </div>
      <div className="grid gap-4">
        {topic.practiceProblems.map((problem) => (
          <PracticeProblemCard key={problem.id} problem={problem} topicId={topic.id} />
        ))}
      </div>
    </section>
  );
}

function PracticeProblemCard({ problem, topicId }: { problem: SyllabusPracticeProblem; topicId: string }) {
  return (
    <article className="eo-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent-strong)]">{problem.difficulty} practice</p>
          <h3 className="mt-1 text-xl font-semibold">{problem.title}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {problem.tags.slice(0, 4).map((tag) => <span key={tag} className="eo-chip">{tag}</span>)}
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{problem.prompt}</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <HintBox title="Thought process" items={problem.expectedSignals.length ? problem.expectedSignals : ["Define the invariant.", "Handle edge cases.", "Explain complexity."]} />
        <HintBox title="Hints" items={buildPracticeHints(problem)} />
      </div>
      {problem.starterCode ? (
        <details className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <summary className="cursor-pointer text-sm font-bold">Starter code</summary>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-50">
            <code>{problem.starterCode}</code>
          </pre>
        </details>
      ) : null}
      <details className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4" open>
        <summary className="cursor-pointer text-sm font-bold">Submit answer, notes, or solution approach</summary>
        <div className="mt-3">
          <SyllabusResponseForm prompt={problem.prompt} promptType="Practice problem" topicId={topicId} />
        </div>
      </details>
    </article>
  );
}

function buildPracticeHints(problem: SyllabusPracticeProblem): string[] {
  const tags = problem.tags.join(" ").toLowerCase();
  if (tags.includes("graph")) return ["Name the state before coding.", "Mark visited at enqueue time when duplicates are possible.", "State the traversal order and stopping condition."];
  if (tags.includes("tree")) return ["Choose DFS or BFS intentionally.", "Define what each recursive call returns.", "Call out null/base cases first."];
  if (tags.includes("hash") || tags.includes("map")) return ["Track the frequency or last-seen invariant.", "Say what the key represents.", "Check update order carefully."];
  if (tags.includes("dp")) return ["Define subproblem state.", "Write transition in words first.", "Explain base cases and memory optimization."];
  return ["Restate the input-output contract.", "Choose the smallest useful invariant.", "Narrate complexity and one edge case."];
}

function InterviewSection({ topic }: { topic: SyllabusTopic }) {
  return (
    <section className="grid gap-5 xl:grid-cols-2">
      <PromptPanel prompts={topic.interviewQuestions} promptType="Interview question" title="Interview questions" topicId={topic.id} />
      <PromptPanel prompts={topic.revisionPrompts} promptType="Revision prompt" title="Revision prompts" topicId={topic.id} />
    </section>
  );
}

function ReviewSection({ topic }: { topic: SyllabusTopic }) {
  return (
    <section className="grid gap-5 xl:grid-cols-[1fr_1.15fr]">
      <RubricPanel prompts={topic.reviewPrompts} topicId={topic.id} />
      <MockInterviewPanel topic={topic} />
    </section>
  );
}

function ReferencesSection({ topic, content, attempts, evaluationResults }: { topic: SyllabusTopic; content?: EnrichedTopicContent; attempts: unknown[]; evaluationResults: unknown[] }) {
  return (
    <section className="space-y-5">
      <SourceReferencesPanel sourceRefs={content?.sourceRefs ?? []} topicReferences={topic.references} variant="cards" />
      <section className="eo-card p-5">
        <h2 className="text-2xl font-semibold">Topic references</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {topic.references.map((reference) => (
            <a
              key={reference.id}
              className="eo-panel block p-4 text-sm transition hover:-translate-y-1 hover:border-[var(--accent)]"
              href={linkForReferenceUrl(reference.url)}
              rel="noreferrer"
              target={reference.url.startsWith("http") ? "_blank" : undefined}
            >
              <span className="flex items-center gap-2 font-semibold">
                {reference.title}
                {reference.url.startsWith("http") ? <ExternalLink className="h-4 w-4" /> : null}
              </span>
              <span className="mt-2 block text-[var(--muted)]">{reference.usage}</span>
            </a>
          ))}
        </div>
      </section>
      <section className="eo-card p-5">
        <h2 className="text-2xl font-semibold">Saved responses</h2>
        <ExplainBackHistory attempts={attempts as Parameters<typeof ExplainBackHistory>[0]["attempts"]} />
        <EvaluationHistory results={evaluationResults as Parameters<typeof EvaluationHistory>[0]["results"]} />
      </section>
    </section>
  );
}

function ContinuationCard({ href, label, title, text }: { href: string; label: string; title: string; text: string }) {
  return (
    <Link className="eo-panel group block p-4 transition hover:-translate-y-1 hover:border-[var(--accent)]" href={href}>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent-strong)]">{label}</p>
      <p className="mt-2 flex items-center justify-between gap-3 font-semibold">
        {title}
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </p>
      <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">{text}</p>
    </Link>
  );
}

function EnrichedSolutionLab({ content }: { content: EnrichedTopicContent }) {
  return (
    <section className="space-y-5">
      <div className="eo-gradient-border border-l-4 border-l-fuchsia-300 p-5">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--accent-strong)]">Source-backed EngineeringOS enrichment</p>
        <h2 className="mt-1 text-2xl font-semibold">Solution lab and senior review notes</h2>
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          <p className="text-sm leading-7 text-[var(--muted)]">{content.beginnerExplanation}</p>
          <p className="text-sm leading-7 text-[var(--muted)]">{content.deepExplanation}</p>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <MiniPanel title="Why asked" value={content.whyInterviewersAsk} />
        <MiniPanel title="Role relevance" value={content.roleRelevance.join(", ")} />
        <MiniPanel title="Frequency" value={`${content.interviewFrequency} / ${content.estimatedTimeMinutes} min`} />
      </div>
      {content.lineByLineExplanation?.length ? <NarrationAccordion items={content.lineByLineExplanation} /> : null}
      <SourceRefLinks sourceRefs={content.sourceRefs} />
      {content.enrichedProblems.length ? (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Enriched coding drills</h3>
          {content.enrichedProblems.map((problem) => <EnrichedProblemCard key={problem.id} problem={problem} />)}
        </div>
      ) : null}
      {content.designCapstones.length ? (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Design capstones</h3>
          {content.designCapstones.map((capstone) => <DesignCapstoneCard key={capstone.id} capstone={capstone} />)}
        </div>
      ) : null}
      {content.handsOnLabs?.length ? (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Hands-on labs and IaC sketches</h3>
          {content.handsOnLabs.map((lab) => <HandsOnLabCard key={lab.id} lab={lab} />)}
        </div>
      ) : null}
    </section>
  );
}

function NarrationAccordion({ items }: { items: string[] }) {
  return (
    <section className="eo-card border-l-4 border-l-amber-300 p-5">
      <h3 className="text-xl font-semibold">How to narrate the solution</h3>
      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <details key={item} className="eo-panel p-4">
            <summary className="flex cursor-pointer list-none items-center gap-3 text-sm font-bold">
              <Lightbulb className="h-4 w-4 text-[var(--warm)]" />
              Step {index + 1}: {item}
            </summary>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Interview narration hint: say why this step protects correctness, then mention the edge case it prevents.
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

function SourceRefLinks({ sourceRefs }: { sourceRefs: string[] }) {
  return <SourceReferencesPanel sourceRefs={sourceRefs} variant="cards" />;
}

function HandsOnLabCard({ lab }: { lab: EnrichedHandsOnLab }) {
  return (
    <article className="eo-card p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent-strong)]">AWS lab</p>
      <h4 className="mt-1 font-semibold">{lab.title}</h4>
      <p className="mt-2 text-sm text-[var(--muted)]">{lab.goal}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">{lab.scenario}</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <ListPanel items={lab.steps} title="Steps" />
        <ListPanel items={lab.validation} title="Validation" />
        <ListPanel items={lab.cleanup} title="Cleanup" />
        <ListPanel items={lab.safetyNotes} title="Safety notes" />
      </div>
      <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-50">
        <code>{lab.iacSnippet}</code>
      </pre>
      <LabCompletionControls labId={lab.id} snippet={lab.iacSnippet} />
    </article>
  );
}

function MiniPanel({ title, value }: { title: string; value: string }) {
  return (
    <div className="eo-card p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent-strong)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{value}</p>
    </div>
  );
}

function EnrichedProblemCard({ problem }: { problem: EnrichedPracticeProblem }) {
  const runnableTask = practiceTasks.find((task) => task.sourceProblemId === problem.id);
  return (
    <article className="eo-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent-strong)]">{problem.pattern}</p>
          <h4 className="mt-1 font-semibold">{problem.title}</h4>
        </div>
        <span className="eo-chip">{problem.difficulty}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{problem.originalStatement}</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <ListPanel items={problem.hints} title="Hints" />
        <ListPanel items={problem.approach} title="Approach" />
      </div>
      {runnableTask ? <Link className="eo-primary-action mt-4 px-4 py-2 text-sm" href={`/practice/${runnableTask.slug}`}>Open practice workspace</Link> : null}
      <details className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4" open>
        <summary className="cursor-pointer text-sm font-bold">Show solution</summary>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-50">
          <code>{problem.solution}</code>
        </pre>
      </details>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <MiniPanel title="Complexity" value={`${problem.complexity.time}, ${problem.complexity.space}`} />
        <MiniPanel title="Tests" value={problem.testCases.join(" | ")} />
        <MiniPanel title="Narration" value={problem.interviewNarration} />
      </div>
    </article>
  );
}

function DesignCapstoneCard({ capstone }: { capstone: EnrichedDesignCapstone }) {
  return (
    <article className="eo-card p-4">
      <h4 className="font-semibold">{capstone.prompt}</h4>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <ListPanel items={capstone.requirements} title="Requirements" />
        <ListPanel items={capstone.approach} title="Approach" />
        <ListPanel items={capstone.designBreakdown} title="Design breakdown" />
        <ListPanel items={capstone.tradeoffs} title="Tradeoffs" />
        <ListPanel items={capstone.failureModes} title="Failure modes" />
        <ListPanel items={capstone.security} title="Security" />
        <ListPanel items={capstone.observability} title="Observability" />
        {capstone.awsVariant ? <ListPanel items={capstone.awsVariant} title="AWS variant" /> : null}
        <ListPanel items={capstone.rubric} title="Rubric" />
        <ListPanel items={capstone.expectedSeniorSignals} title="Senior signals" />
      </div>
    </article>
  );
}

function PromptPanel({ prompts, promptType, title, topicId }: { prompts: string[]; promptType: string; title: string; topicId: string }) {
  return (
    <section className="eo-card p-5">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-4 grid gap-3">
        {prompts.map((prompt) => (
          <details key={prompt} className="eo-panel p-4">
            <summary className="cursor-pointer text-sm font-bold">{prompt}</summary>
            <div className="mt-3">
              <SyllabusResponseForm prompt={prompt} promptType={promptType} topicId={topicId} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function RubricPanel({ prompts, topicId }: { prompts: SyllabusReviewPrompt[]; topicId: string }) {
  return (
    <section className="eo-card p-5">
      <h2 className="text-2xl font-semibold">Rubric-based review</h2>
      <div className="mt-4 space-y-4">
        {prompts.map((prompt) => (
          <article key={prompt.id} className="eo-panel p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{prompt.reviewerRole.replaceAll("-", " ")}</p>
              <span className="eo-chip">review rubric</span>
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">{prompt.prompt}</p>
            <HintBox items={prompt.rubric} title="Rubric" />
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-bold">Submit review answer</summary>
              <div className="mt-3">
                <SyllabusResponseForm prompt={prompt.prompt} promptType="Rubric review" topicId={topicId} />
              </div>
            </details>
          </article>
        ))}
      </div>
    </section>
  );
}

function MockInterviewPanel({ topic }: { topic: SyllabusTopic }) {
  const mockPrompts = topic.interviewQuestions.slice(0, 5);
  return (
    <section className="eo-card p-5">
      <h2 className="text-2xl font-semibold">Mock interview mode</h2>
      <TimedMockInterview prompts={mockPrompts} topicId={topic.id} />
      <div className="mt-4 space-y-3">
        {mockPrompts.map((prompt, index) => (
          <details key={prompt} className="eo-panel p-4">
            <summary className="cursor-pointer text-sm font-bold">Question {index + 1}: {prompt}</summary>
            <div className="mt-3">
              <SyllabusResponseForm prompt={prompt} promptType="Mock interview" topicId={topic.id} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function ListPanel({ items, title }: { items: string[]; title: string }) {
  return (
    <section className="eo-panel p-4">
      <h4 className="font-semibold">{title}</h4>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-xl bg-[var(--surface)] p-3 text-sm leading-6 text-[var(--muted)]">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function HintBox({ items, title }: { items: string[]; title: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
      <p className="text-sm font-bold">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => <li key={item} className="text-sm leading-6 text-[var(--muted)]">{item}</li>)}
      </ul>
    </div>
  );
}

function EmptySection({ message }: { message: string }) {
  return (
    <section className="eo-empty">
      <p>{message}</p>
    </section>
  );
}

function linkForReferenceUrl(url: string) {
  if (url.startsWith("http")) return url;
  if (url.startsWith("00-control/master-roadmap/")) return `/roadmap-source?path=${encodeURIComponent(url)}`;
  return url;
}
