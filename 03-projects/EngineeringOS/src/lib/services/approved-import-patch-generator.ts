import type {
  ApprovedImportCandidate,
  ImportPatch,
  PatchConflict,
  PatchEntry,
  SourcePatchEntry,
  PatchGenerationReport,
  PatchValidationResult,
} from "@/types/ingestion-patch";
import type { SourceReference } from "@/types/founder-beta";
import { founderBetaSourceCatalog } from "@/data/founder-beta";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";
import { founderBetaCapabilities } from "@/data/founder-beta";

const PATCH_DATA_DIR = "data/ingestion/generated/";
const PATCH_FILENAME = "approved-import-patch.preview.json";

export function getPatchOutputPath(): string {
  return `${PATCH_DATA_DIR}${PATCH_FILENAME}`;
}

function deriveSourceId(url: string, title: string): string {
  const fromUrl = url
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "")
    .replace(/[^a-zA-Z0-9/\-_]/g, "")
    .split("/")
    .filter(Boolean);
  const domain = fromUrl[0] || "unknown";
  const domainBase = domain.replace(/^www\./, "").replace(/\..+$/, "");
  const pathPart = fromUrl.slice(1).join("-").replace(/[^a-zA-Z0-9\-_]/g, "").toLowerCase();
  if (pathPart) {
    const slug = pathPart.length > 40 ? pathPart.slice(0, 40) : pathPart;
    return `${domainBase}-${slug}`;
  }
  return domainBase;
}

function deriveTopicId(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 50);
  return `topic-${slug}`;
}

function deriveSourceTitle(url: string, candidateTitle: string): string {
  if (candidateTitle && candidateTitle !== "Untitled") return candidateTitle;
  const fromUrl = url
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
  return fromUrl.includes("/")
    ? fromUrl.split("/").pop()?.replace(/[-_]/g, " ") || fromUrl
    : fromUrl;
}

function reduceToSourceType(
  candidateSourceType: string
): SourceReference["sourceType"] {
  const validTypes: SourceReference["sourceType"][] = [
    "official-docs", "github-repository", "roadmap", "book",
    "interview-guide", "engineering-blog", "career-framework",
    "job-description", "security-guides",
  ];
  if (validTypes.includes(candidateSourceType as SourceReference["sourceType"])) {
    return candidateSourceType as SourceReference["sourceType"];
  }
  return "engineering-blog";
}

export function checkForConflict(
  sourceId: string,
  url: string
): PatchConflict | null {
  const existingSource = founderBetaSourceCatalog.find(
    (s) => s.id === sourceId
  );
  if (existingSource) {
    return {
      entryType: "source",
      field: "id",
      existingValue: existingSource.id,
      incomingValue: sourceId,
      severity: "warning",
      message: `Source ID "${sourceId}" already exists in catalog: "${existingSource.title}"`,
    };
  }
  const existingByUrl = founderBetaSourceCatalog.find(
    (s) => s.url.toLowerCase() === url.toLowerCase()
  );
  if (existingByUrl) {
    return {
      entryType: "source",
      field: "url",
      existingValue: existingByUrl.url,
      incomingValue: url,
      severity: "error",
      message: `URL already exists in catalog as "${existingByUrl.id}": ${url}`,
    };
  }
  return null;
}

export function checkTopicConflict(
  topicId: string
): PatchConflict | null {
  const existingTopic = founderBetaMasterTopics.find(
    (t) => t.id === topicId
  );
  if (existingTopic) {
    return {
      entryType: "topic",
      field: "id",
      existingValue: existingTopic.id,
      incomingValue: topicId,
      severity: "warning",
      message: `Topic ID "${topicId}" already exists in master topics: "${existingTopic.name}"`,
    };
  }
  return null;
}

export function buildSourceEntry(
  candidate: ApprovedImportCandidate
): SourcePatchEntry {
  return {
    type: "source",
    operation: "add",
    sourceId: deriveSourceId(candidate.candidateUrl, candidate.title),
    title: deriveSourceTitle(candidate.candidateUrl, candidate.title),
    url: candidate.candidateUrl,
    sourceType: reduceToSourceType(candidate.sourceType),
    category: candidate.category || "General",
    tier: candidate.tier,
    reliability: candidate.reliability,
    founderBetaRelevance: candidate.description,
  };
}

export function generatePatchFromApprovedCandidates(
  candidates: ApprovedImportCandidate[]
): ImportPatch {
  const entries: PatchEntry[] = [];
  const conflicts: PatchConflict[] = [];
  let candidatesProcessed = 0;
  let candidatesSkipped = 0;
  let topicEntries = 0;
  let sourceEntries = 0;
  const seenSources = new Set<string>();

  for (const candidate of candidates) {
    const existingByUrl = founderBetaSourceCatalog.find(
      (s) => s.url.toLowerCase() === candidate.candidateUrl.toLowerCase()
    );
    if (existingByUrl && !candidate.overrideDuplicateRisk) {
      candidatesSkipped++;
      conflicts.push({
        entryType: "source",
        field: "url",
        existingValue: existingByUrl.url,
        incomingValue: candidate.candidateUrl,
        severity: "error",
        message: `Duplicate risk not overridden: URL already in catalog as "${existingByUrl.id}": ${candidate.candidateUrl}`,
      });
      continue;
    }
    candidatesProcessed++;

    const sourceEntry = buildSourceEntry(candidate);
    const conflict = checkForConflict(sourceEntry.sourceId, candidate.candidateUrl);
    if (conflict) {
      conflicts.push(conflict);
    }
    if (!seenSources.has(sourceEntry.url.toLowerCase())) {
      seenSources.add(sourceEntry.url.toLowerCase());
      entries.push(sourceEntry);
      sourceEntries++;
    }

    if (candidate.title && candidate.title !== "Untitled") {
      const topicId = deriveTopicId(candidate.title);
      const topicConflict = checkTopicConflict(topicId);
      if (topicConflict) {
        conflicts.push(topicConflict);
      }
      entries.push({
        type: "topic",
        operation: "add",
        topicId,
        topicName: candidate.title,
        domainId: "domain-general",
        capabilityIds: [],
        skillIds: [],
        sourceIds: [sourceEntry.sourceId],
        description: candidate.description,
      });
      topicEntries++;
    }
  }

  const report: PatchGenerationReport = {
    totalCandidates: candidates.length,
    candidatesProcessed,
    candidatesSkipped,
    entriesGenerated: entries.length,
    topicEntries,
    sourceEntries,
    capabilityEntries: 0,
    conflicts,
    generatedAt: new Date().toISOString(),
  };

  return {
    id: `patch-${Date.now()}`,
    title: "Approved Import Patch Preview",
    description: `Auto-generated patch from ${candidatesProcessed} approved candidate(s). ${conflicts.length} conflict(s) detected.`,
    entries,
    conflicts,
    report,
    generatedAt: new Date().toISOString(),
  };
}

export function validatePatch(patch: ImportPatch): PatchValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!patch.id) errors.push("Patch ID is required");
  if (patch.entries.length === 0) {
    warnings.push("Patch has no entries");
  }

  for (const entry of patch.entries) {
    if (entry.type === "source") {
      if (!entry.url) errors.push(`Source entry ${entry.sourceId}: URL is required`);
      if (!entry.title) errors.push(`Source entry ${entry.sourceId}: title is required`);
      if (!entry.sourceType) errors.push(`Source entry ${entry.sourceId}: sourceType is required`);
    }
    if (entry.type === "topic") {
      if (!entry.topicId) errors.push("Topic entry: topicId is required");
      if (!entry.topicName) errors.push(`Topic entry ${entry.topicId}: name is required`);
    }
  }

  for (const conflict of patch.conflicts) {
    if (conflict.severity === "error") {
      errors.push(`Conflict: ${conflict.message}`);
    } else {
      warnings.push(`Conflict: ${conflict.message}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function detectPatchConflicts(
  patch: ImportPatch
): PatchConflict[] {
  return patch.conflicts;
}

export function summarizePatch(patch: ImportPatch): PatchGenerationReport {
  return patch.report;
}

export function serializePatch(patch: ImportPatch): string {
  return JSON.stringify(patch, null, 2);
}
