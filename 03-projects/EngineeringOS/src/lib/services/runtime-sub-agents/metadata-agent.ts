import type { ManualUrlFetchResult } from "../manual-url-fetch-contracts";
import type { MetadataAgentOutput } from "@/types/runtime-sub-agent";
import type { DiscoveryMetadata } from "@/types/discovery-agent";

export type MetadataAgentResult = {
  success: boolean;
  warnings: string[];
  errors: string[];
  elapsedMs: number;
  output: MetadataAgentOutput | null;
};

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

export function runMetadataAgent(
  fetchResult: ManualUrlFetchResult,
  url: string
): MetadataAgentResult {
  const startedAt = Date.now();
  const warnings: string[] = [];
  const errors: string[] = [];

  if (fetchResult.fetchStatus !== "success") {
    return {
      success: false,
      warnings: [],
      errors: ["Fetch did not succeed; cannot extract metadata"],
      elapsedMs: Date.now() - startedAt,
      output: null,
    };
  }

  const domain = extractDomain(url);
  const rawMeta = fetchResult.extractedMetadata || {};
  const title = fetchResult.title || url;

  let description = "";
  if (typeof rawMeta.description === "string") {
    description = rawMeta.description;
  } else if (fetchResult.title) {
    description = `Content fetched from ${url}`;
  } else {
    description = `URL fetched: ${url}`;
  }

  if (!fetchResult.title) {
    warnings.push("No title could be extracted from fetched content");
  }
  if (!description) {
    warnings.push("No description could be extracted from fetched content");
  }

  const keywords: string[] = [];
  if (typeof rawMeta.keywords === "string") {
    keywords.push(...rawMeta.keywords.split(",").map((k: string) => k.trim()).filter(Boolean));
  } else if (Array.isArray(rawMeta.keywords)) {
    keywords.push(...rawMeta.keywords.map(String));
  }

  const metadata: DiscoveryMetadata = {
    title,
    description,
    keywords,
    contentType: fetchResult.contentType || "unknown",
    url: fetchResult.finalUrl || url,
    domain,
  };

  return {
    success: true,
    warnings,
    errors,
    elapsedMs: Date.now() - startedAt,
    output: {
      agentType: "metadata-agent",
      metadata,
    },
  };
}
