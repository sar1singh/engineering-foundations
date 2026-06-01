"use client";

import { useMemo, useState } from "react";

type LabCompletionControlsProps = {
  labId: string;
  snippet: string;
};

export function LabCompletionControls({ labId, snippet }: LabCompletionControlsProps) {
  const storageKey = useMemo(() => `engineeringos.lab.${labId}.complete`, [labId]);
  const [complete, setComplete] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(`engineeringos.lab.${labId}.complete`) === "true";
  });
  const [copied, setCopied] = useState(false);

  function toggleComplete() {
    const next = !complete;
    setComplete(next);
    window.localStorage.setItem(storageKey, String(next));
  }

  async function copySnippet() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <button className="rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white" type="button" onClick={toggleComplete}>
        {complete ? "Lab complete" : "Mark lab complete"}
      </button>
      <button className="rounded-md border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--muted)]" type="button" onClick={copySnippet}>
        {copied ? "Copied" : "Copy IaC"}
      </button>
    </div>
  );
}
