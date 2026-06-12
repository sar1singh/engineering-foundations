import {
  ManualUrlSubmission,
  FetchBoundary,
  ManualUrlFetchResult,
  FetchValidationResult,
} from "./manual-url-fetch-contracts";
import {
  validateManualUrlInput,
  validateFetchBoundary,
  validateFetchOutput,
  assertNoBulkCrawl,
} from "./manual-url-fetch-validation";

export const DEFAULT_FETCH_BOUNDARY: FetchBoundary = {
  allowedProtocols: ["https:", "http:"],
  restrictedDomains: ["localhost", "127.0.0.1"],
  maxContentBytes: 20 * 1024 * 1024,
  requestTimeoutMs: 15000,
  respectRobotsTxt: "manual-review-required",
  redirectLimit: 5,
  allowCookies: false,
  allowDownload: false,
  assertNoBulkCrawl: true,
};

function randomTraceId(): string {
  return `trace-${crypto.randomUUID().slice(0, 8)}`;
}

export function dryRunManualUrlFetch(
  input: ManualUrlSubmission,
  boundary: FetchBoundary = DEFAULT_FETCH_BOUNDARY
): { result: ManualUrlFetchResult | null; validation: FetchValidationResult } {
  const inputVal = validateManualUrlInput(input);
  if (!inputVal.valid) return { result: null, validation: inputVal };

  const bulkVal = assertNoBulkCrawl(input);
  if (!bulkVal.valid) return { result: null, validation: bulkVal };

  const bVal = validateFetchBoundary(boundary, input);
  if (!bVal.valid) return { result: null, validation: bVal };

  const now = new Date().toISOString();
  const traceId = randomTraceId();

  const result: ManualUrlFetchResult = {
    fetchStatus: "success",
    httpStatus: 200,
    finalUrl: input.url,
    contentType: "text/html",
    title: "Demo Page",
    rawTextPreview:
      "<html><head><title>Demo</title></head><body>Example content…</body></html>",
    extractedMetadata: { description: "A demo page" },
    attribution: {
      agentId: "founder-beta-disc-agent",
      agentVersion: "0.1.0",
      agentTraceId: traceId,
      discoveredAt: now,
      sourceUrl: input.url,
      extractionMethod: "manual",
      rawMetadata: JSON.stringify({ requestedBy: input.submittedBy }),
    },
    errors: [],
  };

  const outVal = validateFetchOutput(result);
  return { result, validation: outVal };
}
