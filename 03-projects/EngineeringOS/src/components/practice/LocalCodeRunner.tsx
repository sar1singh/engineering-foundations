"use client";

import { useMemo, useState } from "react";

const blockedRunnerPatterns = [
  { pattern: /\bfetch\s*\(/i, reason: "Network calls are disabled in the learning runner." },
  { pattern: /\bXMLHttpRequest\b/i, reason: "Network calls are disabled in the learning runner." },
  { pattern: /\blocalStorage\b|\bsessionStorage\b|\bindexedDB\b/i, reason: "Browser storage access is disabled in the learning runner." },
  { pattern: /\bdocument\b|\bwindow\b|\bglobalThis\b|\bself\b/i, reason: "DOM and global object access are disabled in the learning runner." },
  { pattern: /\beval\s*\(/i, reason: "Dynamic evaluation is disabled in the learning runner." },
  { pattern: /\bFunction\s*\(/i, reason: "Dynamic function creation is disabled in the learning runner." },
  { pattern: /\bimport\s*\(/i, reason: "Dynamic imports are disabled in the learning runner." },
  { pattern: /while\s*\(\s*true\s*\)|for\s*\(\s*;\s*;\s*\)/i, reason: "Obvious infinite loops are blocked in the learning runner." }
];

export function getLocalRunnerSafetyError(code: string): string | null {
  if (code.length > 6000) {
    return "Code is too long for the local learning runner. Keep examples focused and under 6000 characters.";
  }

  const blockedPattern = blockedRunnerPatterns.find((item) => item.pattern.test(code));
  return blockedPattern?.reason ?? null;
}

export function LocalCodeRunner({ enabled = true, initialCode }: { enabled?: boolean; initialCode: string }) {
  const runnableCode = useMemo(() => initialCode || "// Write JavaScript here", [initialCode]);
  const [code, setCode] = useState(runnableCode);
  const [output, setOutput] = useState("Run code to see console output.");

  function runCode() {
    const safetyError = getLocalRunnerSafetyError(code);
    if (safetyError) {
      setOutput(`Blocked: ${safetyError}`);
      return;
    }

    const logs: string[] = [];
    const sandboxConsole = {
      log: (...values: unknown[]) => logs.push(values.map((value) => (typeof value === "string" ? value : JSON.stringify(value))).join(" "))
    };

    try {
      const fn = new Function("console", `"use strict";\n${code}`);
      fn(sandboxConsole);
      setOutput(logs.length > 0 ? logs.join("\n") : "Code ran without console output.");
    } catch (error) {
      setOutput(error instanceof Error ? error.message : "Unknown execution error.");
    }
  }

  return (
    <div className="mt-4 rounded-md border border-[var(--border)] bg-slate-50 p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Local JavaScript runner</p>
          <p className="text-xs text-[var(--muted)]">
            {enabled
              ? "Learning sandbox: console-only examples, no network, DOM, storage, imports, or dynamic eval."
              : "Runner disabled for this deployment mode. Code remains available for read-only study."}
          </p>
        </div>
        <button className="rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400" disabled={!enabled} onClick={runCode} type="button">
          Run
        </button>
      </div>
      <textarea
        className="mt-3 min-h-44 w-full rounded-md border border-[var(--border)] bg-white p-3 font-mono text-xs outline-none focus:border-teal-700"
        disabled={!enabled}
        onChange={(event) => setCode(event.target.value)}
        value={code}
      />
      <pre className="mt-3 min-h-16 overflow-auto rounded-md bg-slate-950 p-3 text-xs text-slate-50">{output}</pre>
    </div>
  );
}
