import Link from "next/link";
import { TimedMockInterview } from "@/components/interview/TimedMockInterview";
import { LabCompletionControls } from "@/components/labs/LabCompletionControls";
import { ExplainBackHistory } from "@/components/persistence/ExplainBackHistory";
import { EvaluationHistory } from "@/components/persistence/EvaluationHistory";
import { SyllabusResponseForm } from "@/components/persistence/SyllabusResponseForm";
import { TopicCompletionForm } from "@/components/persistence/TopicCompletionForm";
import { LocalCodeRunner } from "@/components/practice/LocalCodeRunner";
import { practiceTasks } from "@/data/practice-tasks";
import { appServices } from "@/lib/providers";
import type { EnrichedDesignCapstone, EnrichedHandsOnLab, EnrichedPracticeProblem, EnrichedTopicContent } from "@/types/enriched-content";
import type { SyllabusPracticeProblem, SyllabusReviewPrompt, SyllabusTopic } from "@/types/syllabus";

type SyllabusTopicPageProps = {
  params: Promise<{ topicId: string }>;
};

export default async function SyllabusTopicPage({ params }: SyllabusTopicPageProps) {
  const { topicId } = await params;
  const topic = appServices.syllabusService.getTopicBySlug(topicId);
  const progress = await appServices.repositories.progressRepository.getCurrentProgress();

  if (!topic) {
    return (
      <section className="space-y-4">
        <p className="text-sm font-medium text-teal-700">Syllabus</p>
        <h1 className="text-3xl font-semibold">Syllabus topic not found</h1>
        <p className="text-[var(--muted)]">No imported syllabus topic exists for {topicId}.</p>
        <Link className="text-sm font-medium text-teal-700" href="/syllabus">
          Browse syllabus
        </Link>
      </section>
    );
  }

  const attempts = await appServices.repositories.explainBackRepository.getExplainBackAttemptsByTopicId(topic.id);
  const evaluationResults = await appServices.repositories.evaluationResultRepository.getEvaluationResultsByTopicId(topic.id);
  const isComplete = progress.completedTopicIds.includes(topic.id);
  const allTopics = appServices.syllabusService.getDomains().flatMap((domain) => domain.modules.flatMap((module) => module.topics));
  const currentIndex = allTopics.findIndex((item) => item.slug === topic.slug);
  const nextTopic = allTopics[currentIndex + 1] ?? allTopics[0] ?? null;
  const relatedTopics = allTopics
    .filter((item) => item.slug !== topic.slug && (item.sourcePath === topic.sourcePath || item.references.some((reference) => topic.references.some((topicReference) => topicReference.sourceType === reference.sourceType))))
    .slice(0, 4);
  const practiceNext = practiceTasks.find((task) => topic.enrichedContent?.enrichedProblems.some((problem) => problem.id === task.sourceProblemId));

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-teal-700">Syllabus Topic</p>
          <h1 className="text-3xl font-semibold">{topic.title}</h1>
          <p className="mt-2 max-w-3xl text-[var(--muted)]">{topic.definition}</p>
        </div>
        <TopicCompletionForm isComplete={isComplete} topicId={topic.id} />
      </div>

      <nav className="flex flex-wrap gap-2 rounded-lg border border-[var(--border)] bg-white p-3">
        {[
          ["#learn", "Learn"],
          ["#solution-lab", "Solution lab"],
          ["#code", "Code"],
          ["#practice", "Practice"],
          ["#interview", "Interview"],
          ["#review", "Review"],
          ["#references", "References"]
        ].map(([href, label]) => (
          <a key={href} className="rounded-md px-3 py-2 text-sm font-medium text-[var(--muted)] hover:bg-teal-50 hover:text-teal-800" href={href}>
            {label}
          </a>
        ))}
      </nav>

      <section className="grid gap-6 xl:grid-cols-[1fr_280px]">
        <div className="space-y-6">
      <section id="learn" className="grid scroll-mt-4 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-lg border border-[var(--border)] bg-white p-5">
          <h2 className="text-xl font-semibold">Theory and mental model</h2>
          <p className="mt-3 whitespace-pre-line text-[var(--muted)]">{topic.theory}</p>
          <div className="mt-4 rounded-md bg-slate-50 p-4">
            <p className="text-sm font-medium">Mental model</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{topic.mentalModel}</p>
          </div>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-white p-5">
          <h2 className="text-xl font-semibold">Progress signals</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {topic.progressSignals.map((signal) => (
              <span key={signal} className="rounded-md bg-slate-50 px-3 py-1 text-sm text-[var(--muted)]">
                {signal.replaceAll("_", " ")}
              </span>
            ))}
          </div>
        </div>
      </section>

      {topic.enrichedContent ? <EnrichedSolutionLab content={topic.enrichedContent} /> : null}

      <section id="code" className="scroll-mt-4 rounded-lg border border-[var(--border)] bg-white p-5">
        <h2 className="text-xl font-semibold">Working code example</h2>
        <div className="mt-4 space-y-4">
          {topic.codeExamples.map((example) => (
            <div key={example.id} className="space-y-2">
              <div>
                <p className="font-medium">{example.title}</p>
                <p className="text-sm text-[var(--muted)]">{example.explanation}</p>
              </div>
              <pre className="overflow-x-auto rounded-md bg-slate-950 p-4 text-sm text-slate-50">
                <code>{example.code}</code>
              </pre>
              {example.language === "javascript" && example.runnable ? <LocalCodeRunner enabled={appServices.config.features.enableCodeRunner} initialCode={example.code} /> : null}
            </div>
          ))}
        </div>
      </section>

      <section id="practice" className="grid scroll-mt-4 gap-6 xl:grid-cols-3">
        {(["easy", "medium", "hard"] as const).map((difficulty) => (
          <PracticePanel
            key={difficulty}
            problems={topic.practiceProblems.filter((problem) => problem.difficulty === difficulty)}
            title={`${difficulty[0].toUpperCase()}${difficulty.slice(1)} practice`}
            topicId={topic.id}
          />
        ))}
      </section>

      <section id="interview" className="grid scroll-mt-4 gap-6 xl:grid-cols-2">
        <PromptPanel prompts={topic.interviewQuestions} promptType="Interview question" title="Interview questions" topicId={topic.id} />
        <PromptPanel prompts={topic.revisionPrompts} promptType="Revision prompt" title="Revision prompts" topicId={topic.id} />
      </section>

      <section id="review" className="grid scroll-mt-4 gap-6 xl:grid-cols-[1fr_1.15fr]">
        <RubricPanel prompts={topic.reviewPrompts} topicId={topic.id} />
        <MockInterviewPanel topic={topic} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ListPanel items={topic.commonMistakes} title="Common mistakes" />
        <ListPanel items={topic.productionUseCases} title="Production use cases" />
      </section>

      <section className="rounded-lg border border-[var(--border)] bg-white p-5">
        <h2 className="text-xl font-semibold">Saved responses</h2>
        <ExplainBackHistory attempts={attempts} />
        <EvaluationHistory results={evaluationResults} />
      </section>

      <section id="references" className="scroll-mt-4 rounded-lg border border-[var(--border)] bg-white p-5">
        <h2 className="text-xl font-semibold">References</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {topic.references.map((reference) => (
            <a
              key={reference.id}
              className="rounded-md border border-[var(--border)] p-3 text-sm hover:border-teal-700"
              href={reference.url}
              rel="noreferrer"
              target={reference.url.startsWith("http") ? "_blank" : undefined}
            >
              <span className="font-medium">{reference.title}</span>
              <span className="mt-1 block text-[var(--muted)]">{reference.usage}</span>
            </a>
          ))}
        </div>
      </section>
      <section className="eo-card p-5">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">Continue learning</p>
        <h2 className="mt-1 text-xl font-semibold">Next and related content</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {nextTopic ? <ContinuationCard href={`/syllabus/${nextTopic.slug}`} label="Next content" title={nextTopic.title} text={nextTopic.definition} /> : null}
          {practiceNext ? <ContinuationCard href={`/practice/${practiceNext.slug}`} label="Practice next" title={practiceNext.title} text={practiceNext.statement} /> : null}
          <ContinuationCard href="#interview" label="Interview next" title="Mock interview mode" text={`${topic.interviewQuestions.length} questions available for this topic.`} />
          {relatedTopics[0] ? <ContinuationCard href={`/syllabus/${relatedTopics[0].slug}`} label="Related content" title={relatedTopics[0].title} text={relatedTopics[0].definition} /> : null}
        </div>
      </section>
        </div>
        <aside className="h-fit rounded-lg border border-[var(--border)] bg-white p-5 xl:sticky xl:top-6">
          <h2 className="text-lg font-semibold">Topic checklist</h2>
          <div className="mt-4 space-y-2">
            <ChecklistItem done={isComplete} label="Marked complete" />
            <ChecklistItem done={attempts.length > 0} label="Saved response" />
            <ChecklistItem done={evaluationResults.length > 0} label="Mock score saved" />
            <ChecklistItem done={topic.practiceProblems.length >= 8} label={`${topic.practiceProblems.length} practice prompts`} />
            <ChecklistItem done={topic.interviewQuestions.length >= 8} label={`${topic.interviewQuestions.length} interview questions`} />
            <ChecklistItem done={topic.reviewPrompts.length > 0} label="Rubric available" />
            <ChecklistItem done={topic.references.length > 0} label={`${topic.references.length} references`} />
          </div>
          <Link className="mt-4 block rounded-md bg-teal-700 px-3 py-2 text-center text-sm font-medium text-white" href="/quality">
            View QA status
          </Link>
        </aside>
      </section>
    </section>
  );
}

function ContinuationCard({ href, label, title, text }: { href: string; label: string; title: string; text: string }) {
  return (
    <Link className="eo-panel block p-4 hover:bg-teal-50" href={href}>
      <p className="text-xs font-bold uppercase text-teal-700">{label}</p>
      <p className="mt-1 font-semibold">{title}</p>
      <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">{text}</p>
    </Link>
  );
}

function EnrichedSolutionLab({ content }: { content: EnrichedTopicContent }) {
  return (
    <section id="solution-lab" className="scroll-mt-4 space-y-5 rounded-lg border border-teal-200 bg-teal-50/50 p-5">
      <div>
        <p className="text-sm font-medium text-teal-800">Source-backed EngineeringOS enrichment</p>
        <h2 className="mt-1 text-xl font-semibold">Solution lab and senior review notes</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{content.beginnerExplanation}</p>
        <p className="mt-2 text-sm text-[var(--muted)]">{content.deepExplanation}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <MiniPanel title="Why asked" value={content.whyInterviewersAsk} />
        <MiniPanel title="Role relevance" value={content.roleRelevance.join(", ")} />
        <MiniPanel title="Frequency" value={`${content.interviewFrequency} / ${content.estimatedTimeMinutes} min`} />
      </div>
      {content.lineByLineExplanation?.length ? <ListPanel items={content.lineByLineExplanation} title="How to narrate the solution" /> : null}
      {content.enrichedProblems.length ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Enriched coding drills</h3>
          {content.enrichedProblems.map((problem) => (
            <EnrichedProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      ) : null}
      {content.designCapstones.length ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Design capstones</h3>
          {content.designCapstones.map((capstone) => (
            <DesignCapstoneCard key={capstone.id} capstone={capstone} />
          ))}
        </div>
      ) : null}
      {content.handsOnLabs?.length ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Hands-on labs and IaC sketches</h3>
          {content.handsOnLabs.map((lab) => (
            <HandsOnLabCard key={lab.id} lab={lab} />
          ))}
        </div>
      ) : null}
      <div className="rounded-md bg-white p-3 text-sm text-[var(--muted)]">
        Sources: {content.sourceRefs.join(", ")}. EngineeringOS uses these as referral and coverage sources; explanations and solutions here are original.
      </div>
    </section>
  );
}

function HandsOnLabCard({ lab }: { lab: EnrichedHandsOnLab }) {
  return (
    <article className="rounded-lg border border-[var(--border)] bg-white p-4">
      <p className="text-xs font-medium uppercase text-teal-800">AWS lab</p>
      <h4 className="mt-1 font-semibold">{lab.title}</h4>
      <p className="mt-2 text-sm text-[var(--muted)]">{lab.goal}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">{lab.scenario}</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <ListPanel items={lab.steps} title="Steps" />
        <ListPanel items={lab.validation} title="Validation" />
        <ListPanel items={lab.cleanup} title="Cleanup" />
        <ListPanel items={lab.safetyNotes} title="Safety notes" />
      </div>
      <pre className="mt-4 overflow-x-auto rounded-md bg-slate-950 p-4 text-xs text-slate-50">
        <code>{lab.iacSnippet}</code>
      </pre>
      <LabCompletionControls labId={lab.id} snippet={lab.iacSnippet} />
    </article>
  );
}

function MiniPanel({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-md bg-white p-3">
      <p className="text-xs font-medium uppercase text-teal-800">{title}</p>
      <p className="mt-1 text-sm text-[var(--muted)]">{value}</p>
    </div>
  );
}

function EnrichedProblemCard({ problem }: { problem: EnrichedPracticeProblem }) {
  return (
    <article className="rounded-lg border border-[var(--border)] bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase text-teal-800">{problem.pattern}</p>
          <h4 className="mt-1 font-semibold">{problem.title}</h4>
        </div>
        <span className="rounded-md bg-slate-50 px-2 py-1 text-xs text-[var(--muted)]">{problem.difficulty}</span>
      </div>
      <p className="mt-3 text-sm text-[var(--muted)]">{problem.originalStatement}</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <ListPanel items={problem.hints} title="Hints" />
        <ListPanel items={problem.approach} title="Approach" />
      </div>
      <pre className="mt-4 overflow-x-auto rounded-md bg-slate-950 p-4 text-xs text-slate-50">
        <code>{problem.solution}</code>
      </pre>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <MiniPanel title="Complexity" value={`${problem.complexity.time}, ${problem.complexity.space}`} />
        <MiniPanel title="Tests" value={problem.testCases.join(" | ")} />
        <MiniPanel title="Narration" value={problem.interviewNarration} />
      </div>
      <ListPanel items={problem.commonMistakes} title="Common mistakes" />
    </article>
  );
}

function DesignCapstoneCard({ capstone }: { capstone: EnrichedDesignCapstone }) {
  return (
    <article className="rounded-lg border border-[var(--border)] bg-white p-4">
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

function ChecklistItem({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-slate-50 p-2 text-sm">
      <span className="text-[var(--muted)]">{label}</span>
      <span className={`rounded-md px-2 py-1 text-xs ${done ? "bg-teal-50 text-teal-800" : "bg-amber-50 text-amber-800"}`}>
        {done ? "done" : "todo"}
      </span>
    </div>
  );
}

function PracticePanel({ problems, title, topicId }: { problems: SyllabusPracticeProblem[]; title: string; topicId: string }) {
  return (
    <section className="rounded-lg border border-[var(--border)] bg-white p-5">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4 space-y-4">
        {problems.map((problem) => (
          <div key={problem.id} className="rounded-md bg-slate-50 p-3">
            <p className="font-medium">{problem.title}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{problem.prompt}</p>
            {problem.starterCode ? (
              <pre className="mt-3 overflow-x-auto rounded-md bg-slate-950 p-3 text-xs text-slate-50">
                <code>{problem.starterCode}</code>
              </pre>
            ) : null}
            <SyllabusResponseForm prompt={problem.prompt} promptType="Practice problem" topicId={topicId} />
          </div>
        ))}
      </div>
    </section>
  );
}

function PromptPanel({ prompts, promptType, title, topicId }: { prompts: string[]; promptType: string; title: string; topicId: string }) {
  return (
    <section className="rounded-lg border border-[var(--border)] bg-white p-5">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4 space-y-4">
        {prompts.map((prompt) => (
          <div key={prompt} className="rounded-md bg-slate-50 p-3">
            <p className="text-sm text-[var(--muted)]">{prompt}</p>
            <SyllabusResponseForm prompt={prompt} promptType={promptType} topicId={topicId} />
          </div>
        ))}
      </div>
    </section>
  );
}

function RubricPanel({ prompts, topicId }: { prompts: SyllabusReviewPrompt[]; topicId: string }) {
  return (
    <section className="rounded-lg border border-[var(--border)] bg-white p-5">
      <h2 className="text-xl font-semibold">Rubric-based review</h2>
      <div className="mt-4 space-y-4">
        {prompts.map((prompt) => (
          <div key={prompt.id} className="rounded-md bg-slate-50 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">{prompt.reviewerRole.replaceAll("-", " ")}</p>
              <span className="rounded-md bg-white px-2 py-1 text-xs text-[var(--muted)]">review rubric</span>
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">{prompt.prompt}</p>
            <ul className="mt-3 space-y-2">
              {prompt.rubric.map((item) => (
                <li key={item} className="rounded-md border border-[var(--border)] bg-white p-2 text-sm text-[var(--muted)]">
                  {item}
                </li>
              ))}
            </ul>
            <SyllabusResponseForm prompt={prompt.prompt} promptType="Rubric review" topicId={topicId} />
          </div>
        ))}
      </div>
    </section>
  );
}

function MockInterviewPanel({ topic }: { topic: SyllabusTopic }) {
  const mockPrompts = topic.interviewQuestions.slice(0, 5);

  return (
    <section className="rounded-lg border border-[var(--border)] bg-white p-5">
      <h2 className="text-xl font-semibold">Mock interview mode</h2>
      <TimedMockInterview prompts={mockPrompts} topicId={topic.id} />
      <div className="mt-4 space-y-4">
        {mockPrompts.map((prompt, index) => (
          <div key={prompt} className="rounded-md bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase text-teal-700">Question {index + 1}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{prompt}</p>
            <SyllabusResponseForm prompt={prompt} promptType="Mock interview" topicId={topic.id} />
          </div>
        ))}
      </div>
    </section>
  );
}

function ListPanel({ items, title }: { items: string[]; title: string }) {
  return (
    <section className="rounded-lg border border-[var(--border)] bg-white p-5">
      <h2 className="text-xl font-semibold">{title}</h2>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-md bg-slate-50 p-3 text-sm text-[var(--muted)]">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
