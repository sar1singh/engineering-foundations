import type { AgentAttribution } from "@/types/content-ingestion";
import {
  ManualUrlSubmission,
  FetchBoundary,
  ManualUrlFetchResult,
  FetchValidationResult,
} from "./manual-url-fetch-contracts";

function addError(res: FetchValidationResult, msg: string) {
  res.errors.push(msg);
  res.valid = false;
}

export function validateManualUrlInput(
  sub: ManualUrlSubmission
): FetchValidationResult {
  const res: FetchValidationResult = { valid: true, errors: [], warnings: [] };

  if (!sub.url?.trim()) addError(res, "url is required");
  if (!sub.submittedBy?.trim()) addError(res, "submittedBy is required");
  if (!sub.submittedAt?.trim()) addError(res, "submittedAt is required");
  if (!sub.sourceType) addError(res, "sourceType is required");
  if (sub.consent !== true) addError(res, "User must give explicit consent to fetch");

  return res;
}

export function assertNoBulkCrawl(
  sub: ManualUrlSubmission
): FetchValidationResult {
  const res: FetchValidationResult = { valid: true, errors: [], warnings: [] };
  if (/[,\s]/.test(sub.url.trim())) {
    addError(res, "Bulk URL submission is forbidden – only one URL may be provided");
  }
  return res;
}

export function assertAllowedProtocol(
  url: string,
  allowed: ("https:" | "http:")[]
): boolean {
  try {
    const parsed = new URL(url);
    return allowed.includes(parsed.protocol as "https:" | "http:");
  } catch {
    return false;
  }
}

export function assertNoPrivateNetworkUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    const privatePatterns = [
      /^localhost$/i,
      /^127\.\d+\.\d+\.\d+$/,
      /^10\.\d+\.\d+\.\d+$/,
      /^192\.168\.\d+\.\d+$/,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+$/,
      /^0\.0\.0\.0$/,
      /^::1$/,
    ];
    return !privatePatterns.some((re) => re.test(host));
  } catch {
    return false;
  }
}

export function assertAttributionPresent(
  attribution: AgentAttribution | undefined
): FetchValidationResult {
  const res: FetchValidationResult = { valid: true, errors: [], warnings: [] };
  if (!attribution) {
    addError(res, "attribution is required");
    return res;
  }
  if (!attribution.agentId) addError(res, "attribution.agentId missing");
  if (!attribution.agentTraceId) addError(res, "attribution.agentTraceId missing");
  if (!attribution.discoveredAt) addError(res, "attribution.discoveredAt missing");
  if (!attribution.sourceUrl) addError(res, "attribution.sourceUrl missing");
  return res;
}

export function validateFetchBoundary(
  boundary: FetchBoundary,
  sub: ManualUrlSubmission
): FetchValidationResult {
  const res: FetchValidationResult = { valid: true, errors: [], warnings: [] };

  if (!assertAllowedProtocol(sub.url, boundary.allowedProtocols)) {
    addError(res, `URL protocol not allowed – must be one of ${boundary.allowedProtocols.join(", ")}`);
  }

  if (!assertNoPrivateNetworkUrl(sub.url)) {
    addError(res, "URL points to a private network address (localhost, 10.x.x.x, 192.168.x.x, etc.)");
  }

  try {
    const host = new URL(sub.url).hostname;
    for (const pattern of boundary.restrictedDomains) {
      const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$", "i");
      if (regex.test(host)) {
        addError(res, `URL host matches restricted domain pattern: ${pattern}`);
      }
    }
  } catch {
    addError(res, "Unable to parse URL for domain check");
  }

  if (boundary.maxContentBytes <= 0) {
    addError(res, "maxContentBytes must be > 0");
  }
  if (boundary.requestTimeoutMs <= 0) {
    addError(res, "requestTimeoutMs must be > 0");
  }
  if (boundary.redirectLimit < 0) {
    addError(res, "redirectLimit must be >= 0");
  }
  if (boundary.allowCookies !== false) {
    addError(res, "allowCookies must be false – cookies are never sent");
  }
  if (boundary.allowDownload !== false) {
    addError(res, "allowDownload must be false – binary downloads are blocked");
  }
  if (boundary.respectRobotsTxt !== true && boundary.respectRobotsTxt !== "manual-review-required") {
    addError(res, "respectRobotsTxt must be true or 'manual-review-required'");
  }

  return res;
}

const MAX_PREVIEW_CHARS = 2000;

export function validateFetchOutput(
  result: ManualUrlFetchResult
): FetchValidationResult {
  const res: FetchValidationResult = { valid: true, errors: [], warnings: [] };

  if (!result.fetchStatus) addError(res, "fetchStatus is required");
  if (result.fetchStatus === "success") {
    if (!result.httpStatus) addError(res, "httpStatus is required on success");
    if (!result.finalUrl) addError(res, "finalUrl is required on success");
    if (!result.contentType) addError(res, "contentType is required on success");
  }

  if (result.rawTextPreview && result.rawTextPreview.length > MAX_PREVIEW_CHARS) {
    addError(res, `rawTextPreview exceeds maximum of ${MAX_PREVIEW_CHARS} characters`);
  }

  const attributionResult = assertAttributionPresent(result.attribution);
  if (!attributionResult.valid) {
    res.errors.push(...attributionResult.errors);
    res.valid = false;
  }

  if (typeof result.fetchStatus === "undefined") {
    addError(res, "fetchStatus is required");
  }

  return res;
}
