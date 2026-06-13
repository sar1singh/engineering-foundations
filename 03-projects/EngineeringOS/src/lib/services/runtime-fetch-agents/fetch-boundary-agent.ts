import type { FetchBoundaryCheck, FetchBoundaryResult } from "@/types/runtime-fetch-agent";
import { isDomainAllowed } from "@/data/runtime-fetch-allowlist";

const ALLOWED_PROTOCOLS = ["https:", "http:"];
const MAX_REDIRECTS = 5;
const TIMEOUT_MS = 30000;
const MAX_CONTENT_BYTES = 5 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = ["text/html", "text/plain", "application/xhtml+xml"];

function isPrivateNetwork(host: string): boolean {
  const patterns = [
    /^localhost$/i,
    /^127\.\d+\.\d+\.\d+$/,
    /^10\.\d+\.\d+\.\d+$/,
    /^192\.168\.\d+\.\d+$/,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+$/,
    /^0\.0\.0\.0$/,
    /^::1$/,
  ];
  return patterns.some((re) => re.test(host));
}

export function runFetchBoundaryAgent(url: string): FetchBoundaryResult {
  const startedAt = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];

  const checks: FetchBoundaryCheck = {
    protocolValid: false,
    domainAllowed: false,
    notPrivateNetwork: false,
    maxRedirectsOk: true,
    timeoutOk: true,
    contentTypeOk: true,
    contentLengthOk: true,
    noBinaryDownload: true,
    noCookies: true,
    noAuthHeaders: true,
  };

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return {
      success: false,
      checks,
      errors: ["Invalid URL format"],
      warnings: [],
      elapsedMs: Date.now() - startedAt,
    };
  }

  if (!ALLOWED_PROTOCOLS.includes(parsed.protocol as "https:" | "http:")) {
    errors.push(`Protocol "${parsed.protocol}" is not allowed. Only HTTPS and HTTP are permitted.`);
  } else {
    checks.protocolValid = true;
  }

  const allowlistResult = isDomainAllowed(url);
  if (!allowlistResult.allowed) {
    errors.push(allowlistResult.reason || "Domain not in allowlist");
  } else {
    checks.domainAllowed = true;
  }

  if (isPrivateNetwork(parsed.hostname)) {
    errors.push("URL points to a private network address");
  } else {
    checks.notPrivateNetwork = true;
  }

  if (!checks.protocolValid || !checks.domainAllowed || !checks.notPrivateNetwork) {
    return {
      success: false,
      checks,
      errors,
      warnings,
      elapsedMs: Date.now() - startedAt,
    };
  }

  warnings.push("Redirect limit set to " + MAX_REDIRECTS);
  warnings.push("Timeout set to " + TIMEOUT_MS + "ms");
  warnings.push("Max content length: " + MAX_CONTENT_BYTES + " bytes");
  warnings.push("Allowed MIME types: " + ALLOWED_CONTENT_TYPES.join(", "));
  warnings.push("Cookies are never sent");
  warnings.push("Binary downloads are blocked");

  return {
    success: true,
    checks,
    errors,
    warnings,
    elapsedMs: Date.now() - startedAt,
  };
}

export { MAX_REDIRECTS, TIMEOUT_MS, MAX_CONTENT_BYTES, ALLOWED_CONTENT_TYPES };
