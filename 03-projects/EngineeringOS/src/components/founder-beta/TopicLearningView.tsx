"use client";

import Link from "next/link";
import type { MasterTopic, SourceReference, DailyMission, Capability } from "@/types/founder-beta";

type NamedItem = { id: string; name: string };

type TopicLearningViewProps = {
  topic: MasterTopic;
  capabilities: Capability[];
  skills: NamedItem[];
  sources: SourceReference[];
  missions: DailyMission[];
  prerequisiteTopics: NamedItem[];
  relatedTopics: NamedItem[];
  successorTopics: NamedItem[];
};

const priorityLabel: Record<string, string> = {
  p0: "P0 — Core",
  p1: "P1 — Important",
  p2: "P2 — Nice to have"
};

const importanceLabel: Record<string, string> = {
  high: "High",
  medium: "Medium",
  low: "Low"
};

const readinessColors: Record<string, string> = {
  knowledge: "bg-blue-100 text-blue-800",
  practice: "bg-green-100 text-green-800",
  interview: "bg-purple-100 text-purple-800",
  implementation: "bg-orange-100 text-orange-800"
};

function TopicLink({ id, name }: { id: string; name: string }) {
  return (
    <Link href={`/founder-beta/topic/${id}`} className="text-teal-700 underline hover:text-teal-900">
      {name}
    </Link>
  );
}

export function TopicLearningView({
  topic,
  capabilities,
  skills,
  sources,
  missions,
  prerequisiteTopics,
  relatedTopics,
  successorTopics
}: TopicLearningViewProps) {
  const categoryOrder: Record<string, number> = {
    "official-docs": 0,
    "github-repository": 1,
    book: 2,
    roadmap: 3,
    "interview-guide": 4,
    "engineering-blog": 5,
    "career-framework": 6,
    "job-description": 7
  };

  const sortedSources = [...sources].sort((a, b) => {
    const aOrder = categoryOrder[a.sourceType] ?? 99;
    const bOrder = categoryOrder[b.sourceType] ?? 99;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.title.localeCompare(b.title);
  });

  const sourcesByCategory: Record<string, SourceReference[]> = {};
  for (const source of sortedSources) {
    if (!sourcesByCategory[source.category]) {
      sourcesByCategory[source.category] = [];
    }
    sourcesByCategory[source.category].push(source);
  }

  const totalEstimatedMinutes = topic.estimatedStudyMinutes + topic.estimatedPracticeMinutes;

  return (
    <div className="space-y-6">
      {/* Navigation & Title */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-teal-700">Founder Beta — Topic Learning View</p>
          <h1 className="mt-1 text-xl font-semibold">{topic.name}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {capabilities.map((c) => c.name).join(", ")} —{" "}
            {skills.map((s) => s.name).join(", ")}
          </p>
        </div>
        <Link
          className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
          href="/founder-beta"
        >
          Back to Mission Workspace
        </Link>
      </div>

      {/* Quick Info */}
      <div className="eo-card p-4">
        <h2 className="text-sm font-semibold">Quick Info</h2>
        <div className="mt-2 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div>
            <p className="text-[var(--muted)]">Priority</p>
            <p className="font-medium">{priorityLabel[topic.roadmapPriority] ?? topic.roadmapPriority}</p>
          </div>
          <div>
            <p className="text-[var(--muted)]">Interview Importance</p>
            <p className="font-medium">{importanceLabel[topic.interviewImportance] ?? topic.interviewImportance}</p>
          </div>
          <div>
            <p className="text-[var(--muted)]">Estimated Study</p>
            <p className="font-medium">{topic.estimatedStudyMinutes} min</p>
          </div>
          <div>
            <p className="text-[var(--muted)]">Estimated Practice</p>
            <p className="font-medium">{topic.estimatedPracticeMinutes} min</p>
          </div>
          <div>
            <p className="text-[var(--muted)]">Total Estimated Time</p>
            <p className="font-medium">{totalEstimatedMinutes} min (~{Math.round(totalEstimatedMinutes / 60)}h)</p>
          </div>
          <div>
            <p className="text-[var(--muted)]">Confidence Score</p>
            <p className="font-medium">{(topic.confidenceScore * 100).toFixed(0)}%</p>
          </div>
        </div>
      </div>

      {/* Readiness Indicators */}
      <div className="eo-card p-4">
        <h2 className="text-sm font-semibold">Readiness Dimensions</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {topic.readinessMetrics.map((dim) => (
            <span
              key={dim}
              className={`inline-block rounded px-2 py-1 text-xs font-medium ${readinessColors[dim] ?? "bg-gray-100 text-gray-600"}`}
            >
              {dim}
            </span>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {topic.proofTypes.map((pt) => (
            <span
              key={pt}
              className="inline-block rounded border border-teal-300 bg-teal-50 px-2 py-1 text-xs font-medium text-teal-800"
            >
              {pt}
            </span>
          ))}
        </div>
      </div>

      {/* Prerequisite, Related, Successor Topics */}
      <div className="grid gap-4 sm:grid-cols-3">
        {prerequisiteTopics.length > 0 && (
          <div className="eo-card p-4">
            <h2 className="text-sm font-semibold">Prerequisites</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {prerequisiteTopics.map((t) => (
                <li key={t.id}><TopicLink id={t.id} name={t.name} /></li>
              ))}
            </ul>
          </div>
        )}
        {relatedTopics.length > 0 && (
          <div className="eo-card p-4">
            <h2 className="text-sm font-semibold">Related Topics</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {relatedTopics.map((t) => (
                <li key={t.id}><TopicLink id={t.id} name={t.name} /></li>
              ))}
            </ul>
          </div>
        )}
        {successorTopics.length > 0 && (
          <div className="eo-card p-4">
            <h2 className="text-sm font-semibold">Successor Topics</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {successorTopics.map((t) => (
                <li key={t.id}><TopicLink id={t.id} name={t.name} /></li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Resource Integration */}
      {sources.length > 0 && (
        <div className="eo-card p-4">
          <h2 className="text-sm font-semibold">Resources ({sources.length})</h2>
          <div className="mt-3 space-y-4">
            {Object.entries(sourcesByCategory).map(([category, categorySources]) => (
              <div key={category}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  {category} ({categorySources.length})
                </h3>
                <ul className="mt-1 space-y-1">
                  {categorySources.map((source) => (
                    <li key={source.id} className="flex flex-wrap items-center gap-2 text-sm">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-700 underline hover:text-teal-900"
                      >
                        {source.title}
                      </a>
                      <span className="inline-block rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                        {source.sourceType}
                      </span>
                      <span className="inline-block rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                        {source.tier}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Practice Section */}
      {missions.length > 0 && (
        <div className="eo-card p-4">
          <h2 className="text-sm font-semibold">Related Missions ({missions.length})</h2>
          <div className="mt-3 space-y-3">
            {missions.map((mission) => (
              <div key={mission.id} className="rounded border border-gray-200 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-block rounded bg-teal-100 px-1.5 py-0.5 text-xs font-medium text-teal-800">
                    {mission.missionType}
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    {mission.estimatedMinutes} min — {mission.mode}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium">{mission.objective}</p>
                {mission.tasks.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-[var(--muted)]">Tasks:</p>
                    <ul className="mt-1 space-y-1">
                      {mission.tasks.map((task) => (
                        <li key={task.id} className="text-sm">
                          <span className="font-medium">{task.description}</span>
                          <span className="ml-1 text-xs text-[var(--muted)]">→ {task.expectedOutput}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {mission.proofRequirements.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-[var(--muted)]">Proof Requirements:</p>
                    <ul className="mt-1 space-y-1">
                      {mission.proofRequirements.map((proof) => (
                        <li key={proof.id} className="text-sm">
                          <span className="inline-block rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800">
                            {proof.proofType}
                          </span>{" "}
                          {proof.title} — Required score: {proof.requiredScore}/5
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {mission.readinessImpact.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-[var(--muted)]">Readiness Impact:</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {mission.readinessImpact.map((impact) => (
                        <span
                          key={impact}
                          className="inline-block rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-800"
                        >
                          {impact}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proof Visibility */}
      <div className="eo-card p-4">
        <h2 className="text-sm font-semibold">Proof Requirements</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {topic.proofTypes.map((pt) => {
            const capForProof = capabilities.find((c) => c.proofTypes.includes(pt));
            return (
              <span
                key={pt}
                className="inline-block rounded border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800"
              >
                {pt}{capForProof ? ` — ${capForProof.name}` : ""}
              </span>
            );
          })}
        </div>
        {topic.proofTypes.length === 0 && (
          <p className="mt-1 text-sm text-[var(--muted)]">No proof requirements defined for this topic.</p>
        )}
      </div>
    </div>
  );
}
