import { Code2, ExternalLink, FileText, Map, PlayCircle, ScrollText } from "lucide-react";
import { sourceCatalogById } from "@/data/content/source-catalog";
import type { SourceCatalogEntry } from "@/types/enriched-content";
import type { SyllabusReference } from "@/types/syllabus";

type SourceReferencesPanelProps = {
  sourceRefs?: string[];
  topicReferences?: SyllabusReference[];
  variant?: "drawer" | "cards";
};

const groupLabels: Record<string, string> = {
  official: "Official docs",
  practice: "Practice platform",
  roadmap: "Roadmap",
  github: "GitHub repo",
  video: "Video/course",
  article: "Article/blog"
};

export function SourceReferencesPanel({ sourceRefs = [], topicReferences = [], variant = "drawer" }: SourceReferencesPanelProps) {
  const catalogMap = sourceCatalogById as Record<string, SourceCatalogEntry | undefined>;
  const catalogSources = sourceRefs
    .map((sourceRef) => catalogMap[sourceRef])
    .filter((source): source is SourceCatalogEntry => Boolean(source));
  const references = topicReferences.map(toReferenceSource);
  const allSources = [...catalogSources.map(toCatalogSource), ...references];
  const groupedSources = groupSources(allSources);

  if (allSources.length === 0) {
    return null;
  }

  return (
    <aside className={variant === "drawer" ? "eo-focus-workspace sticky top-24 h-fit p-4" : "eo-card p-5"}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[var(--warm)]">References</p>
          <h2 className="mt-1 text-xl font-semibold">Source referral panel</h2>
        </div>
        <ExternalLink className="h-5 w-5 text-[var(--muted)]" aria-hidden="true" />
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
        EngineeringOS keeps explanations original and links out to public sources for verification, extra practice, and deeper reading.
      </p>
      <div className="mt-4 space-y-4">
        {Object.entries(groupedSources).map(([group, sources]) => (
          <section key={group}>
            <p className="mb-2 font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{groupLabels[group] ?? group}</p>
            <div className={variant === "cards" ? "grid gap-3 md:grid-cols-2 xl:grid-cols-3" : "grid gap-2"}>
              {sources.map((source) => (
                <a key={`${source.title}-${source.url}`} className="eo-source-card block p-3" href={linkForSourceUrl(source.url)} rel="noreferrer" target={source.url.startsWith("http") ? "_blank" : undefined}>
                  <span className="flex items-start gap-3">
                    <source.icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--warm)]" aria-hidden="true" />
                    <span>
                      <span className="block font-semibold">{source.title}</span>
                      <span className="mt-1 block text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{source.typeLabel}</span>
                    </span>
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-[var(--muted)]">{source.whyUseful}</span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}

function linkForSourceUrl(url: string) {
  if (url.startsWith("http")) return url;
  if (url.startsWith("00-control/master-roadmap/")) return `/roadmap-source?path=${encodeURIComponent(url)}`;
  return url;
}

type DisplaySource = {
  group: string;
  icon: typeof Code2;
  title: string;
  typeLabel: string;
  url: string;
  whyUseful: string;
};

function toCatalogSource(source: SourceCatalogEntry): DisplaySource {
  const group = source.sourceType === "docs" ? "official" : source.sourceType === "github-repo" ? "github" : source.sourceType === "platform" ? "practice" : source.sourceType === "course" ? "video" : "roadmap";
  return {
    group,
    icon: iconForGroup(group),
    title: source.title,
    typeLabel: source.sourceType.replace("-", " "),
    url: source.url,
    whyUseful: source.whyUseful
  };
}

function toReferenceSource(reference: SyllabusReference): DisplaySource {
  const group =
    reference.sourceType === "docs"
      ? "official"
      : reference.sourceType === "practice"
        ? "practice"
        : reference.sourceType === "roadmap"
          ? "roadmap"
          : reference.sourceType === "video"
            ? "video"
            : "article";
  return {
    group,
    icon: iconForGroup(group),
    title: reference.title,
    typeLabel: reference.sourceType,
    url: reference.url,
    whyUseful: reference.usage
  };
}

function groupSources(sources: DisplaySource[]) {
  return sources.reduce<Record<string, DisplaySource[]>>((groups, source) => {
    const existing = groups[source.group] ?? [];
    if (!existing.some((item) => item.url === source.url)) {
      groups[source.group] = [...existing, source];
    }
    return groups;
  }, {});
}

function iconForGroup(group: string) {
  if (group === "github") return Code2;
  if (group === "practice") return PlayCircle;
  if (group === "roadmap") return Map;
  if (group === "official") return ScrollText;
  return FileText;
}
