import Link from "next/link";
import { readFile } from "node:fs/promises";
import path from "node:path";

type RoadmapSourcePageProps = {
  searchParams: Promise<{ path?: string }>;
};

const repoRoot = path.resolve(process.cwd(), "..", "..");
const allowedRoot = path.resolve(repoRoot, "00-control", "master-roadmap");

export default async function RoadmapSourcePage({ searchParams }: RoadmapSourcePageProps) {
  const requestedPath = (await searchParams).path ?? "";
  const safePath = requestedPath.replaceAll("\\", "/");
  const absolutePath = path.resolve(repoRoot, safePath);
  const isAllowed = absolutePath.startsWith(allowedRoot) && safePath.endsWith(".md");
  const content = isAllowed ? await readMarkdown(absolutePath) : null;

  return (
    <section className="space-y-6">
      <div className="eo-glow-card p-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Local roadmap source</p>
        <h1 className="mt-2 text-3xl font-semibold">Master roadmap markdown</h1>
        <p className="mt-2 max-w-3xl text-[var(--muted)]">
          Local EngineeringOS source files are shown here instead of being treated like public web pages.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link className="eo-secondary-action px-4 py-2 text-sm" href="/syllabus">Back to syllabus</Link>
          <Link className="eo-secondary-action px-4 py-2 text-sm" href="/sources">Open live sources</Link>
        </div>
      </div>
      <article className="eo-card p-5">
        <p className="font-mono text-xs text-[var(--muted)]">{safePath || "No source path selected."}</p>
        {content ? (
          <pre className="mt-4 max-h-[70vh] overflow-auto whitespace-pre-wrap rounded-lg border border-[var(--border)] bg-slate-950 p-4 text-sm leading-6 text-slate-50">
            {content}
          </pre>
        ) : (
          <div className="mt-4 rounded-lg border border-rose-500/40 bg-rose-950/40 p-4 text-sm text-rose-50">
            This source path is not available for local preview. Only markdown files under
            <span className="font-mono"> 00-control/master-roadmap </span>
            are exposed.
          </div>
        )}
      </article>
    </section>
  );
}

async function readMarkdown(absolutePath: string) {
  try {
    return await readFile(absolutePath, "utf8");
  } catch {
    return null;
  }
}
