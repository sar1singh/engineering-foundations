import type { ContentSourceType, AgentAttribution } from "@/types/content-ingestion";

export type ManualUrlSubmission = {
  url: string;
  submittedBy: string;
  submittedAt: string;
  intendedCapabilityId?: string;
  intendedSkillId?: string;
  intendedTopicId?: string;
  sourceType: ContentSourceType;
  notes?: string;
  consent: boolean;
};

export type FetchBoundary = {
  allowedProtocols: ("https:" | "http:")[];
  restrictedDomains: string[];
  maxContentBytes: number;
  requestTimeoutMs: number;
  respectRobotsTxt: true | "manual-review-required";
  redirectLimit: number;
  allowCookies: false;
  allowDownload: false;
  assertNoBulkCrawl?: true;
};

export type ManualUrlFetchResult = {
  fetchStatus: "success" | "error";
  httpStatus?: number;
  finalUrl?: string;
  contentType?: string;
  title?: string;
  rawTextPreview?: string;
  extractedMetadata?: Record<string, unknown>;
  attribution: AgentAttribution;
  errors?: string[];
};

export type FetchValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};
