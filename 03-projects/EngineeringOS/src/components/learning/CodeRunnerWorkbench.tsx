import { LocalCodeRunner } from "@/components/practice/LocalCodeRunner";

type CodeRunnerWorkbenchProps = {
  code: string;
  description: string;
  enabled: boolean;
  language: string;
  title: string;
};

export function CodeRunnerWorkbench({ code, description, enabled, language, title }: CodeRunnerWorkbenchProps) {
  const canRunInBrowser = enabled && (language === "javascript" || language === "typescript");

  return (
    <div className="eo-gradient-border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-strong)]">Compiler workspace</p>
          <h3 className="mt-1 text-xl font-semibold">{title}</h3>
          <p className="mt-2 max-w-3xl text-sm text-[var(--muted)]">{description}</p>
        </div>
        <span className="eo-chip">{language}</span>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <div className="min-w-0">
          <div className="flex items-center justify-between rounded-t-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
            <p className="text-sm font-semibold">Example code</p>
            <p className="text-xs text-[var(--muted)]">read, edit, run</p>
          </div>
          <pre className="min-h-[28rem] overflow-x-auto rounded-b-xl bg-slate-950 p-4 text-sm leading-6 text-slate-50">
            <code>{code}</code>
          </pre>
        </div>
        <div className="min-w-0">
          {canRunInBrowser ? (
            <LocalCodeRunner enabled={enabled} initialCode={code} />
          ) : (
            <div className="eo-card p-4">
              <p className="font-semibold">Runner unavailable for this snippet</p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                The current alpha runner supports browser-safe JavaScript and TypeScript-shaped examples. Node.js APIs, filesystem,
                imports, network calls, and DOM access need a separate isolated execution service before public beta.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
