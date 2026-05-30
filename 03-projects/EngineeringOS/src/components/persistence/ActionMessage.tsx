"use client";

import type { PersistenceActionState } from "@/lib/actions/progress-actions";

export function ActionMessage({ state }: { state: PersistenceActionState }) {
  if (!state.message) {
    return null;
  }

  const className =
    state.status === "success"
      ? "rounded-md bg-teal-50 px-3 py-2 text-sm text-teal-800"
      : "rounded-md bg-red-50 px-3 py-2 text-sm text-red-700";

  return (
    <p aria-live="polite" className={className}>
      {state.message}
    </p>
  );
}
