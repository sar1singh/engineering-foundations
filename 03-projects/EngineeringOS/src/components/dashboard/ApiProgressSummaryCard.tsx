"use client";

import { useEffect, useState } from "react";

import { learningApiClient } from "@/lib/api-client/learning-api-client";

type ApiProgressState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; completedTopics: number; completedTasks: number; weakAreas: number; readiness: number };

export function ApiProgressSummaryCard() {
  const [state, setState] = useState<ApiProgressState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await learningApiClient.getProgressSummary();
        if (!cancelled) {
          setState({
            status: "ready",
            completedTopics: response.data.completedTopicCount,
            completedTasks: response.data.completedTaskCount,
            weakAreas: response.data.weakAreaCount,
            readiness: response.data.progress.readinessScore
          });
        }
      } catch {
        if (!cancelled) setState({ status: "error" });
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const values =
    state.status === "ready"
      ? [
          ["Readiness", `${state.readiness}%`],
          ["Topics", state.completedTopics],
          ["Tasks", state.completedTasks],
          ["Weak areas", state.weakAreas]
        ]
      : [
          ["Readiness", state.status === "error" ? "error" : "..."],
          ["Topics", state.status === "error" ? "error" : "..."],
          ["Tasks", state.status === "error" ? "error" : "..."],
          ["Weak areas", state.status === "error" ? "error" : "..."]
        ];

  return (
    <section className="rounded-lg border border-[var(--border)] bg-white p-5">
      <div>
        <p className="text-sm font-medium text-teal-700">API-backed progress</p>
        <h2 className="mt-1 text-xl font-semibold">Backend separation signal</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">This card reads progress through `/api/progress/summary`, proving the UI can move behind API adapters.</p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {values.map(([label, value]) => (
          <div key={label} className="rounded-md bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase text-[var(--muted)]">{label}</p>
            <p className="mt-1 font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
