"use client";

import { useMemo, useState, useSyncExternalStore } from "react";

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

const subscribeHydration = () => () => undefined;
const getHydratedSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export function getLocalRunnerSafetyError(code: string): string | null {
  if (code.length > 6000) {
    return "Code is too long for the local learning runner. Keep examples focused and under 6000 characters.";
  }

  const blockedPattern = blockedRunnerPatterns.find((item) => item.pattern.test(code));
  return blockedPattern?.reason ?? null;
}

export function prepareLocalRunnerCode(code: string): string {
  return code
    .replace(/\bexport\s+/g, "")
    .replace(/\bnew\s+(Map|Set|WeakMap|WeakSet)<[^>(]+>/g, "new $1")
    .replace(/\b(Array)<[^>(]+>/g, "$1")
    .replace(/\)\s*:\s*[^{]+(?=\s*\{)/g, ")")
    .replace(/:\s*[A-Za-z_$][A-Za-z0-9_$<>\s\[\]\|\{\}:]*(?=\s*[,)=;{])/g, "")
    .replace(/([A-Za-z0-9_$\)\]])!/g, "$1");
}

export function LocalCodeRunner({ enabled = true, initialCode }: { enabled?: boolean; initialCode: string }) {
  const runnableCode = useMemo(() => initialCode || "// Write JavaScript here", [initialCode]);
  const [code, setCode] = useState(runnableCode);
  const [output, setOutput] = useState("Run code to see console output.");
  const [runnerState, setRunnerState] = useState<"ready" | "running" | "passed" | "failed" | "blocked">("ready");
  const isHydrated = useSyncExternalStore(subscribeHydration, getHydratedSnapshot, getServerHydrationSnapshot);

  function runCode() {
    setRunnerState("running");
    const safetyError = getLocalRunnerSafetyError(code);
    if (safetyError) {
      setOutput(`Blocked: ${safetyError}`);
      setRunnerState("blocked");
      return;
    }

    const logs: string[] = [];
    const sandboxConsole = {
      log: (...values: unknown[]) => logs.push(values.map((value) => (typeof value === "string" ? value : JSON.stringify(value))).join(" ")),
      assert: (condition: unknown, message = "Assertion failed") => {
        if (!condition) {
          throw new Error(message);
        }
        logs.push(`pass: ${message}`);
      }
    };

    try {
      const fn = new Function("console", `"use strict";\n${prepareLocalRunnerCode(code)}`);
      fn(sandboxConsole);
      setOutput(logs.length > 0 ? logs.join("\n") : "Code ran without console output.");
      setRunnerState("passed");
    } catch (error) {
      setOutput(error instanceof Error ? error.message : "Unknown execution error.");
      setRunnerState("failed");
    }
  }

  return (
    <div className="eo-card mt-4 p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Local JavaScript runner</p>
          <p className="text-xs text-[var(--muted)]">
            {enabled
              ? `State: ${runnerState}. Console-only examples, no network, DOM, storage, imports, or dynamic eval.`
              : "Runner disabled for this deployment mode. Code remains available for read-only study."}
          </p>
        </div>
        <button className="eo-primary-action px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50" disabled={!enabled || !isHydrated || runnerState === "running"} onClick={runCode} type="button">
          {runnerState === "running" ? "Running..." : "Run"}
        </button>
      </div>
      <textarea
        className="eo-input mt-3 min-h-44 p-3 font-mono text-xs"
        disabled={!enabled}
        onChange={(event) => setCode(event.target.value)}
        value={code}
      />
      <pre data-testid="local-runner-output" className={`mt-3 min-h-16 overflow-auto rounded-xl p-3 text-xs ${
        runnerState === "passed" ? "bg-cyan-950 text-cyan-50" : runnerState === "failed" || runnerState === "blocked" ? "bg-rose-950 text-rose-50" : "bg-slate-950 text-slate-50"
      }`}>{output}</pre>
    </div>
  );
}
