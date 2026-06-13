export type FetchAllowlistEntry = {
  domain: string;
  label: string;
  matchPattern: string;
};

export const RUNTIME_FETCH_ALLOWLIST: FetchAllowlistEntry[] = [
  { domain: "docs.aws.amazon.com", label: "AWS Documentation", matchPattern: "docs.aws.amazon.com" },
  { domain: "nodejs.org", label: "Node.js Official", matchPattern: "nodejs.org" },
  { domain: "grpc.io", label: "gRPC Official", matchPattern: "grpc.io" },
  { domain: "kubernetes.io", label: "Kubernetes Official", matchPattern: "kubernetes.io" },
  { domain: "developer.mozilla.org", label: "MDN Web Docs", matchPattern: "developer.mozilla.org" },
];

export function isDomainAllowed(url: string): { allowed: boolean; matchedEntry?: FetchAllowlistEntry; reason?: string } {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    for (const entry of RUNTIME_FETCH_ALLOWLIST) {
      if (host === entry.matchPattern || host.endsWith("." + entry.matchPattern)) {
        return { allowed: true, matchedEntry: entry };
      }
    }
    return { allowed: false, reason: `Domain "${host}" is not in the fetch allowlist` };
  } catch {
    return { allowed: false, reason: "Unable to parse URL" };
  }
}

export function getAllowlistStatus(url: string): { allowed: boolean; entry?: FetchAllowlistEntry; blockReason?: string } {
  const result = isDomainAllowed(url);
  if (result.allowed) {
    return { allowed: true, entry: result.matchedEntry };
  }
  return { allowed: false, blockReason: result.reason };
}
