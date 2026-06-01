"use client";

import { useEffect, useState } from "react";

import { learningApiClient } from "@/lib/api-client/learning-api-client";

type ApiStatus = {
  readiness?: number;
  quality?: number;
  status: "loading" | "ready" | "error";
};

export function ApiReadinessStrip() {
  const [state, setState] = useState<ApiStatus>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [readiness, quality] = await Promise.all([learningApiClient.getReadiness(), learningApiClient.getQualityStatus()]);

        if (!cancelled) {
          setState({
            status: "ready",
            readiness: readiness.data.assessment.score,
            quality: quality.data.coveragePercent
          });
        }
      } catch {
        if (!cancelled) {
          setState({ status: "error" });
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-teal-700">API boundary check</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Dashboard is also reading readiness and quality through API client adapters.</p>
        </div>
        <div className="flex gap-2 text-sm">
          <span className="rounded-md bg-slate-50 px-3 py-2">Readiness: {state.readiness ?? (state.status === "error" ? "error" : "...")}</span>
          <span className="rounded-md bg-slate-50 px-3 py-2">Quality: {state.quality ?? (state.status === "error" ? "error" : "...")}</span>
        </div>
      </div>
    </div>
  );
}
