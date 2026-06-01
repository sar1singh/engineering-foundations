import Link from "next/link";
import { practiceTasks } from "@/data/practice-tasks";
import { linearLearningRoadmap } from "@/data/syllabus/linear-learning-roadmap";
import { roleLearningRoadmaps } from "@/data/syllabus/role-learning-roadmaps";
import { appServices } from "@/lib/providers";
import { getProductQualityStatus } from "@/lib/services/product-quality-service";

type SyllabusPageProps = {
  searchParams: Promise<{ role?: string; priority?: string; q?: string; view?: string; domain?: string; difficulty?: string; source?: string; frequency?: string; content?: string; time?: string }>;
};

export default async function SyllabusPage({ searchParams }: SyllabusPageProps) {
  const { role = "all", priority = "all", q = "", view = "cards", domain = "all", difficulty = "all", source = "all", frequency = "all", content = "all", time = "all" } = await searchParams;
  const domains = appServices.syllabusService.getDomains();
  const qualityStatus = getProductQualityStatus();
  const normalizedQuery = q.trim().toLowerCase();
  const runnableProblemIds = new Set(practiceTasks.map((task) => task.sourceProblemId).filter((id): id is string => Boolean(id)));
  const selectedRole = roleLearningRoadmaps.find((item) => item.slug === role) ?? null;
  const priorityTopicSlugs = new Set(
    selectedRole
      ? selectedRole.focus
          .filter((focus) => priority === "all" || focus.priority === priority)
          .flatMap((focus) => focus.topicSlugs)
      : []
  );
  const roleTopicSlugs = new Set(selectedRole?.topicSlugs ?? []);
  const visibleDomains =
    selectedRole || priority !== "all"
      ? domains
          .map((domain) => ({
            ...domain,
            modules: domain.modules
              .map((module) => ({
                ...module,
                topics: module.topics.filter((topic) => {
                  if (selectedRole && priority !== "all") return priorityTopicSlugs.has(topic.slug);
                  if (selectedRole) return roleTopicSlugs.has(topic.slug);
                  return topic.progressSignals.includes("solved_easy_problem");
                })
              }))
              .filter((module) => module.topics.length > 0)
          }))
          .filter((domain) => domain.modules.length > 0)
      : domains;
  const domainFiltered = domain === "all" ? visibleDomains : visibleDomains.filter((item) => item.slug === domain);
  const searchedDomains = normalizedQuery
    ? domainFiltered
        .map((domain) => ({
          ...domain,
          modules: domain.modules
            .map((module) => ({
              ...module,
              topics: module.topics.filter((topic) =>
                [topic.title, topic.slug, topic.definition, topic.mentalModel, topic.whyItMatters, ...topic.practiceProblems.map((problem) => problem.title)]
                  .join(" ")
                  .toLowerCase()
                  .includes(normalizedQuery)
              )
            }))
            .filter((module) => module.topics.length > 0)
        }))
        .filter((domain) => domain.modules.length > 0)
    : domainFiltered;
  const fullyFilteredDomains = searchedDomains
    .map((domain) => ({
      ...domain,
      modules: domain.modules
        .map((module) => ({
          ...module,
          topics: module.topics.filter((topic) => {
            const difficultyMatch = difficulty === "all" || topic.practiceProblems.some((problem) => problem.difficulty === difficulty);
            const sourceMatch = source === "all" || topic.references.some((reference) => reference.sourceType === source);
            const frequencyMatch =
              frequency === "all" ||
              (frequency === "high" && topic.practiceProblems.length >= 8 && topic.interviewQuestions.length >= 8) ||
              (frequency === "expert" && topic.practiceProblems.some((problem) => problem.difficulty === "hard"));
            const contentMatch =
              content === "all" ||
              (content === "enriched" && Boolean(topic.enrichedContent)) ||
              (content === "labs" && (topic.enrichedContent?.handsOnLabs?.length ?? 0) > 0) ||
              (content === "capstones" && (topic.enrichedContent?.designCapstones.length ?? 0) > 0) ||
              (content === "runnable" && (topic.enrichedContent?.enrichedProblems.some((problem) => runnableProblemIds.has(problem.id)) ?? false));
            const estimatedMinutes = topic.enrichedContent?.estimatedTimeMinutes ?? 90;
            const timeMatch =
              time === "all" ||
              (time === "quick" && estimatedMinutes <= 75) ||
              (time === "standard" && estimatedMinutes > 75 && estimatedMinutes <= 120) ||
              (time === "deep" && estimatedMinutes > 120);

            return difficultyMatch && sourceMatch && frequencyMatch && contentMatch && timeMatch;
          })
        }))
        .filter((module) => module.topics.length > 0)
    }))
    .filter((item) => item.modules.length > 0);
  const visibleTopics = fullyFilteredDomains.flatMap((domain) =>
    domain.modules.flatMap((module) => module.topics.map((topic) => ({ domain, module, topic })))
  );
  const queryParams = new URLSearchParams();
  if (role !== "all") queryParams.set("role", role);
  if (priority !== "all") queryParams.set("priority", priority);
  if (q) queryParams.set("q", q);
  if (domain !== "all") queryParams.set("domain", domain);
  if (difficulty !== "all") queryParams.set("difficulty", difficulty);
  if (source !== "all") queryParams.set("source", source);
  if (frequency !== "all") queryParams.set("frequency", frequency);
  if (content !== "all") queryParams.set("content", content);
  if (time !== "all") queryParams.set("time", time);
  const baseQuery = queryParams.toString();
  const enrichedTopicCount = visibleTopics.filter(({ topic }) => topic.enrichedContent).length;
  const handsOnLabTopicCount = visibleTopics.filter(({ topic }) => (topic.enrichedContent?.handsOnLabs?.length ?? 0) > 0).length;

  return (
    <section className="space-y-6">
      <div className="eo-glow-card p-6">
        <div className="relative z-[1] flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Syllabus command center</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">Find the next lesson without drowning in filters.</h1>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">
              Start with role, focus, and search. Open deeper controls only when you need precision.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <h2 aria-label="Syllabus Command Center" className="eo-chip text-sm">Syllabus Command Center</h2>
              <h2 aria-label="Master roadmap syllabus" className="eo-chip text-sm">Master roadmap syllabus</h2>
            </div>
          </div>
          <Link className="eo-secondary-action px-4 py-2 text-sm" href="/courses">
            Browse guided courses
          </Link>
        </div>
      </div>
      <section className="eo-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Quick search</h2>
            <span className="sr-only">Role roadmap filters</span>
            <p className="mt-1 text-sm text-[var(--muted)]">Most learners only need role, focus, content type, and search.</p>
          </div>
          <Link className="eo-chip" href="/quality">
            QA health {qualityStatus.coveragePercent}%
          </Link>
        </div>
        <form className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <input name="role" type="hidden" value={role} />
          <input name="priority" type="hidden" value={priority} />
          <input name="view" type="hidden" value={view} />
          <input name="domain" type="hidden" value={domain} />
          <input name="difficulty" type="hidden" value={difficulty} />
          <input name="source" type="hidden" value={source} />
          <input name="frequency" type="hidden" value={frequency} />
          <input name="content" type="hidden" value={content} />
          <input name="time" type="hidden" value={time} />
          <label className="space-y-2">
            <span className="text-sm font-medium">Search topics</span>
            <input
              className="eo-input"
              defaultValue={q}
              name="q"
              placeholder="Search graph, payment, IAM, DP, incident..."
            />
          </label>
          <button className="eo-primary-action self-end px-4 py-2 text-sm" type="submit">
            Search
          </button>
          <Link className="eo-secondary-action self-end px-4 py-2 text-sm" href="/syllabus">
            Reset
          </Link>
        </form>
        <details className="mt-4 rounded-2xl border border-[var(--border)] bg-slate-50 p-4">
          <summary className="cursor-pointer text-sm font-bold text-[var(--foreground)]">Advanced filters</summary>
        <form className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <input name="role" type="hidden" value={role} />
          <input name="priority" type="hidden" value={priority} />
          <input name="q" type="hidden" value={q} />
          <input name="view" type="hidden" value={view} />
          <input name="content" type="hidden" value={content} />
          <input name="time" type="hidden" value={time} />
          <SelectField
            label="Domain"
            name="domain"
            options={[["all", "All domains"], ...domains.map((item) => [item.slug, item.title] as [string, string])]}
            value={domain}
          />
          <SelectField
            label="Difficulty"
            name="difficulty"
            options={[
              ["all", "All difficulties"],
              ["easy", "Easy"],
              ["medium", "Medium"],
              ["hard", "Hard"]
            ]}
            value={difficulty}
          />
          <SelectField
            label="Source platform"
            name="source"
            options={[
              ["all", "All sources"],
              ["docs", "Docs"],
              ["roadmap", "Roadmaps"],
              ["practice", "Practice"],
              ["article", "Articles"],
              ["video", "Videos"]
            ]}
            value={source}
          />
          <SelectField
            label="Interview frequency"
            name="frequency"
            options={[
              ["all", "All"],
              ["high", "High frequency"],
              ["expert", "Expert/hard"]
            ]}
            value={frequency}
          />
          <SelectField
            label="Time"
            name="time"
            options={[
              ["all", "Any time"],
              ["quick", "Quick <=75m"],
              ["standard", "Standard 76-120m"],
              ["deep", "Deep >120m"]
            ]}
            value={time}
          />
          <button className="eo-secondary-action px-3 py-2 text-sm xl:col-span-5" type="submit">
            Apply filters
          </button>
        </form>
        <form className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <input name="role" type="hidden" value={role} />
          <input name="priority" type="hidden" value={priority} />
          <input name="q" type="hidden" value={q} />
          <input name="view" type="hidden" value={view} />
          <input name="domain" type="hidden" value={domain} />
          <input name="difficulty" type="hidden" value={difficulty} />
          <input name="source" type="hidden" value={source} />
          <input name="frequency" type="hidden" value={frequency} />
          <input name="time" type="hidden" value={time} />
          <SelectField
            label="Content type"
            name="content"
            options={[
              ["all", "All content"],
              ["enriched", "Enriched only"],
              ["labs", "Hands-on labs"],
              ["capstones", "Design capstones"],
              ["runnable", "Runnable practice"]
            ]}
            value={content}
          />
          <button className="eo-secondary-action self-end px-3 py-2 text-sm" type="submit">
            Apply content filter
          </button>
        </form>
        </details>
        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_0.8fr]">
          <div className="eo-panel p-4">
            <p className="text-sm font-medium">Target role</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <FilterLink active={role === "all"} href="/syllabus" label="All syllabus" />
              {roleLearningRoadmaps.map((item) => (
                <FilterLink key={item.slug} active={role === item.slug} href={`/syllabus?role=${item.slug}&priority=${priority}`} label={item.title} />
              ))}
            </div>
          </div>
          <div className="eo-panel p-4">
            <p className="text-sm font-medium">Focus</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                ["all", "Full path"],
                ["core-80-20", "80/20 Core"],
                ["depth", "Depth"],
                ["expert", "Expert"]
              ].map(([value, label]) => (
                <FilterLink
                  key={value}
                  active={priority === value}
                  href={role === "all" ? `/syllabus?priority=${value}` : `/syllabus?role=${role}&priority=${value}`}
                  label={label}
                />
              ))}
            </div>
          </div>
        </div>
        {selectedRole ? (
          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <h3 className="font-semibold">{selectedRole.title}</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">{selectedRole.outcome}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {selectedRole.focus.map((focus) => (
                <div key={focus.title} className="eo-panel p-3">
                  <p className="text-xs font-medium uppercase text-teal-700">{focus.level} / {focus.priority.replaceAll("-", " ")}</p>
                  <p className="mt-1 text-sm font-medium">{focus.title}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {focus.topicSlugs.slice(0, 6).map((slug) => (
                      <Link key={slug} className="rounded bg-slate-50 px-2 py-1 text-xs text-[var(--muted)] hover:text-teal-700" href={`/syllabus/${slug}`}>
                        {slug}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
      <section className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Metric label="Visible topics" value={visibleTopics.length} />
        <Metric label="Domains" value={fullyFilteredDomains.length} />
        <Metric label="Enriched" value={enrichedTopicCount} />
        <Metric label="Lab topics" value={handsOnLabTopicCount} />
        <Metric label="QA coverage" value={`${qualityStatus.coveragePercent}%`} />
        <Metric label="Focus" value={priority === "all" ? "Full path" : priority.replaceAll("-", " ")} />
      </section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Topics</h2>
        <div className="flex gap-2">
          <FilterLink active={view !== "table"} href={`/syllabus${baseQuery ? `?${baseQuery}&view=cards` : "?view=cards"}`} label="Cards" />
          <FilterLink active={view === "table"} href={`/syllabus${baseQuery ? `?${baseQuery}&view=table` : "?view=table"}`} label="Table" />
        </div>
      </div>
      {view === "table" ? (
        <section className="overflow-x-auto rounded-lg border border-[var(--border)] bg-white">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="p-3 font-semibold">Topic</th>
                <th className="p-3 font-semibold">Domain</th>
                <th className="p-3 font-semibold">Module</th>
                <th className="p-3 font-semibold">Problems</th>
                <th className="p-3 font-semibold">Questions</th>
                <th className="p-3 font-semibold">References</th>
              </tr>
            </thead>
            <tbody>
              {visibleTopics.map(({ domain, module, topic }) => (
                <tr key={topic.id} className="border-t border-[var(--border)]">
                  <td className="p-3">
                    <Link className="font-medium text-teal-700" href={`/syllabus/${topic.slug}`}>
                      {topic.title}
                    </Link>
                    <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">{topic.definition}</p>
                  </td>
                  <td className="p-3 text-[var(--muted)]">{domain.title}</td>
                  <td className="p-3 text-[var(--muted)]">{module.title}</td>
                  <td className="p-3">{topic.practiceProblems.length}</td>
                  <td className="p-3">{topic.interviewQuestions.length}</td>
                  <td className="p-3">{topic.references.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}
      <section className="eo-card p-5">
        <h2 className="text-xl font-semibold">Linear learning path</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-5">
          {linearLearningRoadmap.map((stage, index) => (
            <div key={stage.stage} className="eo-panel p-3">
              <p className="text-xs font-medium uppercase text-teal-700">Stage {index + 1}</p>
              <h3 className="mt-1 font-semibold">{stage.stage}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{stage.goal}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {stage.topicSlugs.slice(0, 5).map((slug) => (
                    <Link key={slug} className="rounded-full bg-white px-2 py-1 text-xs text-[var(--muted)] hover:text-teal-700" href={`/syllabus/${slug}`}>
                    {slug}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="space-y-8">
        {view === "table" ? null : fullyFilteredDomains.map((domain) => (
          <section key={domain.id} className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold">{domain.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{domain.goal}</p>
            </div>
            {domain.modules.map((module) => (
              <div key={module.id} className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold">{module.title}</h3>
                  <p className="text-sm text-[var(--muted)]">{module.goal}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {module.topics.map((topic) => (
                    <Link
                      key={topic.id}
                      className="eo-gradient-border block p-4 hover:-translate-y-1"
                      href={`/syllabus/${topic.slug}`}
                    >
                      <p className="text-xs font-medium uppercase text-teal-700">#{topic.order}</p>
                      <h4 className="mt-1 font-semibold">{topic.title}</h4>
                      <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">{topic.definition}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="eo-card p-4">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-2 font-semibold capitalize">{value}</p>
    </div>
  );
}

function SelectField({ label, name, options, value }: { label: string; name: string; options: Array<[string, string]>; value: string }) {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-medium">{label}</span>
      <select
        className="eo-input"
        defaultValue={value}
        name={name}
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function FilterLink({ active, href, label }: { active: boolean; href: string; label: string }) {
  return (
    <Link
      className={`rounded-md border px-3 py-2 text-sm font-medium ${
        active ? "border-teal-700 bg-teal-50 text-teal-800" : "border-[var(--border)] bg-slate-50 text-[var(--foreground)] hover:border-teal-700"
      }`}
      href={href}
    >
      {label}
    </Link>
  );
}
