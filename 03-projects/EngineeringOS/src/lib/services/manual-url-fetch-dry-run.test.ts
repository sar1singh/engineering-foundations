import { describe, expect, it } from "vitest";
import { dryRunManualUrlFetch, DEFAULT_FETCH_BOUNDARY } from "./manual-url-dry-run";
import type { ManualUrlSubmission } from "./manual-url-fetch-contracts";
import type { ContentSourceType } from "@/types/content-ingestion";

function validInput(overrides: Partial<ManualUrlSubmission> = {}): ManualUrlSubmission {
  return {
    url: "https://docs.example.com/guide",
    submittedBy: "sarwan",
    submittedAt: "2026-06-11T00:00:00Z",
    sourceType: "official-docs" as ContentSourceType,
    consent: true,
    ...overrides,
  };
}

describe("dryRunManualUrlFetch", () => {
  it("passes a valid HTTPS URL", () => {
    const { result, validation } = dryRunManualUrlFetch(validInput());
    expect(validation.valid).toBe(true);
    expect(result).not.toBeNull();
    expect(result!.fetchStatus).toBe("success");
    expect(result!.httpStatus).toBe(200);
    expect(result!.finalUrl).toBe("https://docs.example.com/guide");
  });

  it("rejects empty URL", () => {
    const { result, validation } = dryRunManualUrlFetch(validInput({ url: "" }));
    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain("url is required");
    expect(result).toBeNull();
  });

  it("rejects missing submittedBy", () => {
    const { result, validation } = dryRunManualUrlFetch(validInput({ submittedBy: "" }));
    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain("submittedBy is required");
    expect(result).toBeNull();
  });

  it("rejects missing sourceType", () => {
    const { result, validation } = dryRunManualUrlFetch(validInput({ sourceType: undefined as unknown as ContentSourceType }));
    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain("sourceType is required");
    expect(result).toBeNull();
  });

  it("rejects missing consent", () => {
    const { result, validation } = dryRunManualUrlFetch(validInput({ consent: false }));
    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain("User must give explicit consent to fetch");
    expect(result).toBeNull();
  });

  it("rejects ftp protocol", () => {
    const input = validInput({ url: "ftp://files.example.com/data" });
    const { result, validation } = dryRunManualUrlFetch(input);
    expect(validation.valid).toBe(false);
    expect(validation.errors.some((e) => e.includes("protocol"))).toBe(true);
    expect(result).toBeNull();
  });

  it("rejects localhost URL", () => {
    const { result, validation } = dryRunManualUrlFetch(validInput({ url: "http://localhost:3000/test" }));
    expect(validation.valid).toBe(false);
    expect(validation.errors.some((e) => e.includes("private network"))).toBe(true);
    expect(result).toBeNull();
  });

  it("rejects private IP 127.0.0.1", () => {
    const { result, validation } = dryRunManualUrlFetch(validInput({ url: "http://127.0.0.1/api" }));
    expect(validation.valid).toBe(false);
    expect(validation.errors.some((e) => e.includes("private network"))).toBe(true);
    expect(result).toBeNull();
  });

  it("rejects private IP 192.168.x.x", () => {
    const { result, validation } = dryRunManualUrlFetch(validInput({ url: "http://192.168.1.1/dashboard" }));
    expect(validation.valid).toBe(false);
    expect(result).toBeNull();
  });

  it("rejects multiple URLs (bulk crawl)", () => {
    const { result, validation } = dryRunManualUrlFetch(validInput({ url: "https://a.com, https://b.com" }));
    expect(validation.valid).toBe(false);
    expect(validation.errors.some((e) => e.includes("Bulk URL"))).toBe(true);
    expect(result).toBeNull();
  });

  it("rejects bulk with whitespace", () => {
    const { result, validation } = dryRunManualUrlFetch(validInput({ url: "https://a.com https://b.com" }));
    expect(validation.valid).toBe(false);
    expect(validation.errors.some((e) => e.includes("Bulk URL"))).toBe(true);
    expect(result).toBeNull();
  });

  it("produces attribution on success", () => {
    const { result } = dryRunManualUrlFetch(validInput());
    expect(result).not.toBeNull();
    expect(result!.attribution).toBeDefined();
    expect(result!.attribution.agentId).toBe("founder-beta-disc-agent");
    expect(result!.attribution.agentTraceId).toBeTruthy();
    expect(result!.attribution.discoveredAt).toBeTruthy();
    expect(result!.attribution.sourceUrl).toBe("https://docs.example.com/guide");
  });

  it("produces preview content fields", () => {
    const { result } = dryRunManualUrlFetch(validInput());
    expect(result).not.toBeNull();
    expect(result!.title).toBe("Demo Page");
    expect(result!.contentType).toBe("text/html");
    expect(result!.rawTextPreview).toContain("Example content");
    expect(result!.extractedMetadata).toBeDefined();
  });

  it("rejects invalid boundary maxContentBytes", () => {
    const badBoundary = { ...DEFAULT_FETCH_BOUNDARY, maxContentBytes: 0 };
    const { result, validation } = dryRunManualUrlFetch(validInput(), badBoundary);
    expect(validation.valid).toBe(false);
    expect(validation.errors.some((e) => e.includes("maxContentBytes"))).toBe(true);
    expect(result).toBeNull();
  });

  it("rejects invalid boundary requestTimeoutMs", () => {
    const badBoundary = { ...DEFAULT_FETCH_BOUNDARY, requestTimeoutMs: 0 };
    const { result, validation } = dryRunManualUrlFetch(validInput(), badBoundary);
    expect(validation.valid).toBe(false);
    expect(validation.errors.some((e) => e.includes("requestTimeoutMs"))).toBe(true);
    expect(result).toBeNull();
  });

  it("rejects boundary with allowCookies=true", () => {
    const badBoundary = { ...DEFAULT_FETCH_BOUNDARY, allowCookies: true as false };
    const { result, validation } = dryRunManualUrlFetch(validInput(), badBoundary);
    expect(validation.valid).toBe(false);
    expect(validation.errors.some((e) => e.includes("allowCookies"))).toBe(true);
    expect(result).toBeNull();
  });

  it("rejects boundary with allowDownload=true", () => {
    const badBoundary = { ...DEFAULT_FETCH_BOUNDARY, allowDownload: true as false };
    const { result, validation } = dryRunManualUrlFetch(validInput(), badBoundary);
    expect(validation.valid).toBe(false);
    expect(validation.errors.some((e) => e.includes("allowDownload"))).toBe(true);
    expect(result).toBeNull();
  });

  it("rejects boundary with invalid respectRobotsTxt", () => {
    const badBoundary = { ...DEFAULT_FETCH_BOUNDARY, respectRobotsTxt: false as true };
    const { result, validation } = dryRunManualUrlFetch(validInput(), badBoundary);
    expect(validation.valid).toBe(false);
    expect(validation.errors.some((e) => e.includes("respectRobotsTxt"))).toBe(true);
    expect(result).toBeNull();
  });
});
