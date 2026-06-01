"use client";

import { useEffect, useState } from "react";

import { learningApiClient } from "@/lib/api-client/learning-api-client";

type ProfileState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; targetRole: string; source: string; userType: string };

export function ApiLearnerProfileStatus() {
  const [state, setState] = useState<ProfileState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await learningApiClient.getLearnerProfile();
        if (!cancelled) {
          setState({
            status: "ready",
            targetRole: response.data.preferences.targetRole,
            source: response.data.preferenceSource,
            userType: response.data.isAuthenticated ? "authenticated" : "local guest"
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

  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-4">
      <p className="text-sm font-medium text-teal-700">API learner profile check</p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        {state.status === "ready"
          ? `API profile: ${state.targetRole.replaceAll("-", " ")} / ${state.source} / ${state.userType}.`
          : state.status === "error"
            ? "API profile check failed."
            : "Loading learner profile through API client..."}
      </p>
    </div>
  );
}
