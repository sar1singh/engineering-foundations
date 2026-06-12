"use client";

import Link from "next/link";
import { useState, useCallback, useMemo } from "react";
import { dryRunManualUrlFetch, DEFAULT_FETCH_BOUNDARY } from "@/lib/services/manual-url-dry-run";
import { previewCandidateImport } from "@/lib/services/manual-url-candidate-bridge";
import type { ManualUrlSubmission, ManualUrlFetchResult, FetchValidationResult } from "@/lib/services/manual-url-fetch-contracts";
import type { ContentSourceType } from "@/types/content-ingestion";
import { founderBetaCapabilities, founderBetaSkills } from "@/data/founder-beta";
import {
  createInitialReviewState,
  computeQueueSummary,
  approveCandidate,
  rejectCandidate,
  markDuplicateRisk,
  needsChangesCandidate,
  resetDecision,
} from "@/lib/services/runtime-fetch-review-service";
import type { RuntimeFetchReviewState, RuntimeFetchReviewDecision } from "@/lib/services/runtime-fetch-review-service";

const SOURCE_TYPES: ContentSourceType[] = [
  "official-docs", "engineering-blog", "book", "interview-guide",
  "github-repository", "career-framework", "roadmap", "job-description", "practice-platform",
];

type SessionCandidate = {
  url: string;
  submittedBy: string;
  sourceType: ContentSourceType;
  capabilityId: string;
  skillId: string;
  topicId: string;
  notes: string;
  fetchResult: ManualUrlFetchResult;
  validation: FetchValidationResult;
  duplicateWarning: string;
};

export default function RuntimeFetchPreviewPage() {
  const [url, setUrl] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [sourceType, setSourceType] = useState<ContentSourceType>("official-docs");
  const [capabilityId, setCapabilityId] = useState("");
  const [skillId, setSkillId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [fetchResult, setFetchResult] = useState<ManualUrlFetchResult | null>(null);
  const [validation, setValidation] = useState<FetchValidationResult | null>(null);
  const [ran, setRan] = useState(false);
  const [sessionCandidates, setSessionCandidates] = useState<SessionCandidate[]>([]);
  const [reviewStates, setReviewStates] = useState<RuntimeFetchReviewState[]>([]);
  const [rejectionInputs, setRejectionInputs] = useState<Record<string, string>>({});
  const [changesInputs, setChangesInputs] = useState<Record<string, string>>({});

  const capabilitiesList = founderBetaCapabilities ?? [];
  const skillsList = founderBetaSkills ?? [];
  const filteredSkills = skillsList.filter((s) => !capabilityId || s.capabilityId === capabilityId);

  const summary = useMemo(() => computeQueueSummary(reviewStates), [reviewStates]);

  const candidateImportPreview = useMemo(() => {
    if (!fetchResult || !ran) return null;
    try {
      return previewCandidateImport(fetchResult, {
        url,
        submittedBy: submittedBy.trim() || "anonymous",
        sourceType,
        capabilityId: capabilityId || undefined,
        skillId: skillId || undefined,
        topicId: topicId || undefined,
        notes: notes.trim() || undefined,
      });
    } catch {
      return null;
    }
  }, [fetchResult, ran, url, submittedBy, sourceType, capabilityId, skillId, topicId, notes]);

  const topicsList = [
    { id: "topic-aws-well-architected", name: "AWS Well-Architected" },
    { id: "topic-hld-url-shortener", name: "URL Shortener (HLD)" },
    { id: "topic-dsa-arrays", name: "DSA Arrays" },
    { id: "topic-security-architecture-review", name: "Security Architecture Review" },
    { id: "topic-staff-engineer-scope", name: "Staff Engineer Scope" },
  ];

  const handleRun = useCallback(() => {
    setRan(true);
    const input: ManualUrlSubmission = {
      url: url.trim(),
      submittedBy: submittedBy.trim() || "anonymous",
      submittedAt: new Date().toISOString(),
      sourceType,
      intendedCapabilityId: capabilityId || undefined,
      intendedSkillId: skillId || undefined,
      intendedTopicId: topicId || undefined,
      notes: notes.trim() || undefined,
      consent,
    };
    const { result, validation: val } = dryRunManualUrlFetch(input, DEFAULT_FETCH_BOUNDARY);
    setFetchResult(result);
    setValidation(val);
  }, [url, submittedBy, sourceType, capabilityId, skillId, topicId, notes, consent]);

  const handleSendToReview = useCallback(() => {
    if (!fetchResult || !validation) return;
    const duplicateWarning =
      candidateImportPreview?.duplicateInfo.isDuplicate
        ? `Duplicate detected (${candidateImportPreview.duplicateInfo.matches.length} match${candidateImportPreview.duplicateInfo.matches.length > 1 ? "es" : ""})`
        : "";
    const candidate: SessionCandidate = {
      url,
      submittedBy,
      sourceType,
      capabilityId,
      skillId,
      topicId,
      notes,
      fetchResult,
      validation,
      duplicateWarning,
    };
    setSessionCandidates((prev) => {
      if (prev.some((c) => c.url === candidate.url)) return prev;
      return [...prev, candidate];
    });
    setReviewStates((prev) => {
      if (prev.some((s) => s.candidateUrl === candidate.url)) return prev;
      return [...prev, createInitialReviewState(candidate.url, { duplicateWarning, candidateId: candidate.url })];
    });
  }, [fetchResult, validation, url, submittedBy, sourceType, capabilityId, skillId, topicId, notes, candidateImportPreview]);

  const handleApproveAll = useCallback(() => {
    const pending = reviewStates.filter((s) => s.decision === "pending");
    let next = reviewStates;
    for (const s of pending) {
      next = approveCandidate(next, s.candidateUrl);
    }
    setReviewStates(next);
  }, [reviewStates]);

  const handleRejectAll = useCallback(() => {
    const pending = reviewStates.filter((s) => s.decision === "pending");
    let next = reviewStates;
    for (const s of pending) {
      next = rejectCandidate(next, s.candidateUrl, "Bulk reject");
    }
    setReviewStates(next);
  }, [reviewStates]);

  const resetSession = useCallback(() => {
    setUrl("");
    setSubmittedBy("");
    setSourceType("official-docs");
    setCapabilityId("");
    setSkillId("");
    setTopicId("");
    setNotes("");
    setConsent(false);
    setFetchResult(null);
    setValidation(null);
    setRan(false);
  }, []);

  const decisionBadge = (decision: RuntimeFetchReviewDecision) => {
    const map: Record<RuntimeFetchReviewDecision, string> = {
      pending: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      "duplicate-risk": "bg-amber-100 text-amber-800",
      "needs-changes": "bg-purple-100 text-purple-800",
    };
    return map[decision] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-teal-700">Founder Beta</p>
          <h1 className="mt-1 text-xl font-semibold">Manual URL Runtime Fetch Preview</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Dry-run fetch over a manually submitted URL — no real network calls, no persistence, no autonomous publish
          </p>
        </div>
        <Link
          className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          href="/founder-beta"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="eo-card p-4 text-sm text-[var(--muted)]">
        <p className="font-semibold text-[var(--foreground)]">How it works</p>
        <p className="mt-1">
          Enter a URL below and run a dry-run fetch. The system validates the input against safety
          boundaries (protocol, private network, bulk-crawl, consent, etc.) and returns a mocked fetch
          result. No real network calls are made. Once validated, you can send the candidate to the
          manual review preview queue.
        </p>
        <p className="mt-1 font-semibold text-amber-700">
          No writes performed. No autonomous publishing. Human approval required.
        </p>
      </div>

      {/* Input Form */}
      <div className="rounded-lg border p-4">
        <h2 className="mb-3 text-base font-semibold">URL Input</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">URL <span className="text-red-500">*</span></label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://docs.example.com/guide"
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Submitted By <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={submittedBy}
                onChange={(e) => setSubmittedBy(e.target.value)}
                placeholder="sarwan"
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Source Type <span className="text-red-500">*</span></label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as ContentSourceType)}
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
              >
                {SOURCE_TYPES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium">Capability (optional)</label>
              <select value={capabilityId} onChange={(e) => setCapabilityId(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm">
                <option value="">-- select --</option>
                {capabilitiesList.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Skill (optional)</label>
              <select value={skillId} onChange={(e) => setSkillId(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm">
                <option value="">-- select --</option>
                {filteredSkills.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Topic (optional)</label>
              <select value={topicId} onChange={(e) => setTopicId(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 text-sm">
                <option value="">-- select --</option>
                {topicsList.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes"
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="consent" className="text-sm">
              I confirm that the submitted URL is publicly accessible and I have the right to fetch it <span className="text-red-500">*</span>
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRun}
              className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
              disabled={!url.trim() || !submittedBy.trim() || !consent}
            >
              Run Dry-Run Fetch
            </button>
            {ran && (
              <button
                onClick={resetSession}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Validation / Fetch Result */}
      {ran && validation && (
        <div className="rounded-lg border p-4">
          <h2 className="mb-3 text-base font-semibold">Validation & Fetch Result</h2>
          <div className="space-y-2 text-sm">
            <div className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${validation.valid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {validation.valid ? "✓ VALID" : "✕ INVALID"}
            </div>
            {validation.errors.length > 0 && (
              <div>
                <p className="font-semibold text-red-700">Errors:</p>
                <ul className="list-inside list-disc text-red-600">
                  {validation.errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}
            {validation.warnings.length > 0 && (
              <div>
                <p className="font-semibold text-amber-700">Warnings:</p>
                <ul className="list-inside list-disc text-amber-600">
                  {validation.warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}
          </div>

          {fetchResult && validation.valid && (
            <div className="mt-4 space-y-3 border-t pt-4">
              <h3 className="font-semibold">Mocked Fetch Result</h3>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div><span className="font-medium text-[var(--muted)]">Status:</span> {fetchResult.fetchStatus}</div>
                <div><span className="font-medium text-[var(--muted)]">HTTP Status:</span> {fetchResult.httpStatus}</div>
                <div className="md:col-span-2"><span className="font-medium text-[var(--muted)]">Final URL:</span> {fetchResult.finalUrl}</div>
                <div><span className="font-medium text-[var(--muted)]">Content Type:</span> {fetchResult.contentType}</div>
                <div><span className="font-medium text-[var(--muted)]">Title:</span> {fetchResult.title}</div>
              </div>

              {/* Attribution */}
              <div className="rounded-lg border bg-blue-50 p-3">
                <p className="font-semibold text-blue-800">Attribution</p>
                <div className="mt-1 grid grid-cols-1 gap-1 text-sm md:grid-cols-2">
                  <div><span className="text-[var(--muted)]">Agent ID:</span> {fetchResult.attribution.agentId}</div>
                  <div><span className="text-[var(--muted)]">Agent Version:</span> {fetchResult.attribution.agentVersion}</div>
                  <div><span className="text-[var(--muted)]">Trace ID:</span> <code className="rounded bg-gray-100 px-1">{fetchResult.attribution.agentTraceId}</code></div>
                  <div><span className="text-[var(--muted)]">Discovered At:</span> {fetchResult.attribution.discoveredAt}</div>
                  <div className="md:col-span-2"><span className="text-[var(--muted)]">Source URL:</span> {fetchResult.attribution.sourceUrl}</div>
                </div>
              </div>

              {/* Raw Text Preview */}
              <div>
                <p className="font-medium text-[var(--muted)]">Raw Text Preview (first ~2k chars):</p>
                <pre className="mt-1 max-h-32 overflow-auto rounded border bg-gray-50 p-2 text-xs">{fetchResult.rawTextPreview}</pre>
              </div>

              {/* Metadata */}
              {fetchResult.extractedMetadata && (
                <div>
                  <p className="font-medium text-[var(--muted)]">Extracted Metadata:</p>
                  <pre className="mt-1 max-h-24 overflow-auto rounded border bg-gray-50 p-2 text-xs">
                    {JSON.stringify(fetchResult.extractedMetadata, null, 2)}
                  </pre>
                </div>
              )}

              {/* Candidate Preview */}
              <div className="rounded-lg border bg-teal-50 p-3">
                <p className="font-semibold text-teal-800">Candidate Preview</p>
                <div className="mt-1 grid grid-cols-1 gap-1 text-sm md:grid-cols-2">
                  <div><span className="text-[var(--muted)]">Title:</span> {fetchResult.title}</div>
                  <div><span className="text-[var(--muted)]">URL:</span> {fetchResult.finalUrl}</div>
                  <div><span className="text-[var(--muted)]">Source Type:</span> {sourceType}</div>
                  <div><span className="text-[var(--muted)]">Capability:</span> {capabilityId || "(not set)"}</div>
                  <div><span className="text-[var(--muted)]">Skill:</span> {skillId || "(not set)"}</div>
                  <div><span className="text-[var(--muted)]">Topic:</span> {topicId || "(not set)"}</div>
                  <div className="md:col-span-2"><span className="text-[var(--muted)]">Notes:</span> {notes || "(none)"}</div>
                </div>
                <div className="mt-2 inline-block rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                  Human approval required
                </div>
              </div>

              {/* Boundary Enforcement */}
              <div className="rounded-lg border bg-gray-50 p-3 text-sm">
                <p className="font-semibold text-gray-700">Boundary Enforcement</p>
                <ul className="mt-1 list-inside list-disc text-green-700">
                  <li>No writes performed — preview only</li>
                  <li>No autonomous publishing — human approval required</li>
                  <li>Attribution present — agentId={fetchResult.attribution.agentId}</li>
                  <li>Duplicate risk not assessed at fetch stage</li>
                  <li>Preview-only status — no database writes</li>
                </ul>
              </div>

              {/* Candidate Import Preview */}
              {candidateImportPreview && (
                <div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
                  <p className="font-semibold text-purple-800">Candidate Import Preview</p>
                  <p className="mt-1 text-xs text-purple-600">
                    How this fetch result would be imported into the candidate catalog — preview only, no writes
                  </p>

                  {/* Candidate Fields */}
                  <div className="mt-2 grid grid-cols-1 gap-1 text-sm md:grid-cols-2">
                    <div><span className="text-[var(--muted)]">Candidate ID:</span> <code className="rounded bg-purple-100 px-1">{candidateImportPreview.candidate.id}</code></div>
                    <div><span className="text-[var(--muted)]">Title:</span> {candidateImportPreview.candidate.title}</div>
                    <div className="md:col-span-2">
                      <span className="text-[var(--muted)]">URL:</span> {candidateImportPreview.candidate.url}
                    </div>
                    <div><span className="text-[var(--muted)]">Source Type:</span> {candidateImportPreview.candidate.sourceType}</div>
                    <div><span className="text-[var(--muted)]">Tier:</span> {candidateImportPreview.candidate.tier}</div>
                    <div><span className="text-[var(--muted)]">Category:</span> {candidateImportPreview.candidate.category}</div>
                    <div><span className="text-[var(--muted)]">Discovery Method:</span> {candidateImportPreview.candidate.discoveryMethod}</div>
                    <div><span className="text-[var(--muted)]">Discovered By:</span> {candidateImportPreview.candidate.discoveredBy}</div>
                    <div><span className="text-[var(--muted)]">Confidence:</span> {candidateImportPreview.candidate.estimatedConfidence}</div>
                    <div className="md:col-span-2">
                      <span className="text-[var(--muted)]">Description:</span> {candidateImportPreview.candidate.description}
                    </div>
                  </div>

                  {/* Validation */}
                  <div className="mt-2">
                    <div className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                      candidateImportPreview.validation.valid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {candidateImportPreview.validation.valid ? "✓ Candidate Valid" : "✕ Candidate Invalid"}
                    </div>
                    {candidateImportPreview.validation.errors.length > 0 && (
                      <ul className="mt-1 list-inside list-disc text-xs text-red-600">
                        {candidateImportPreview.validation.errors.map((e, i) => <li key={i}>{e}</li>)}
                      </ul>
                    )}
                    {candidateImportPreview.validation.warnings.length > 0 && (
                      <ul className="mt-1 list-inside list-disc text-xs text-amber-600">
                        {candidateImportPreview.validation.warnings.map((w, i) => <li key={i}>{w}</li>)}
                      </ul>
                    )}
                  </div>

                  {/* Duplicate Detection */}
                  <div className="mt-2">
                    <p className="text-sm font-medium text-[var(--muted)]">Duplicate Check (source catalog)</p>
                    {candidateImportPreview.duplicateInfo.isDuplicate ? (
                      <div>
                        <div className="inline-block rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                          ⚠ Duplicate detected ({candidateImportPreview.duplicateInfo.matches.length} match{candidateImportPreview.duplicateInfo.matches.length > 1 ? "es" : ""})
                        </div>
                        <ul className="mt-1 space-y-1">
                          {candidateImportPreview.duplicateInfo.matches.map((m, i) => (
                            <li key={i} className="text-xs">
                              <span className="font-medium">{m.field}:</span>{" "}
                              {m.source.title}{" "}
                              <code className="rounded bg-gray-100 px-1 text-[11px]">{m.source.id}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="inline-block rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        No duplicates found in catalog
                      </div>
                    )}
                  </div>

                  {/* Human Approval */}
                  <div className="mt-2">
                    {candidateImportPreview.humanApprovalRequired ? (
                      <div className="inline-block rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                        Human approval required
                      </div>
                    ) : (
                      <div className="inline-block rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        No human approval gate triggered
                      </div>
                    )}
                    <p className="mt-1 text-xs text-purple-600">
                      Preview only — no candidate catalog writes performed
                    </p>
                  </div>
                </div>
              )}

              {/* Send to Review */}
              <button
                onClick={handleSendToReview}
                className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Send to Manual Review Preview
              </button>
            </div>
          )}
        </div>
      )}

      {/* Review Queue */}
      {sessionCandidates.length > 0 && (
        <div className="rounded-lg border p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold">Review Queue ({summary.total})</h2>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="inline-block rounded bg-blue-100 px-2 py-0.5 font-medium text-blue-800">
                {summary.pending} pending
              </span>
              <span className="inline-block rounded bg-green-100 px-2 py-0.5 font-medium text-green-800">
                {summary.approved} approved
              </span>
              <span className="inline-block rounded bg-red-100 px-2 py-0.5 font-medium text-red-800">
                {summary.rejected} rejected
              </span>
              <span className="inline-block rounded bg-amber-100 px-2 py-0.5 font-medium text-amber-800">
                {summary.duplicateRisk} duplicate-risk
              </span>
              <span className="inline-block rounded bg-purple-100 px-2 py-0.5 font-medium text-purple-800">
                {summary.needsChanges} needs-changes
              </span>
            </div>
          </div>
          {summary.pending > 0 && (
            <div className="mb-3 flex gap-2">
              <button
                onClick={handleApproveAll}
                className="rounded bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700"
              >
                Approve All Pending
              </button>
              <button
                onClick={handleRejectAll}
                className="rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
              >
                Reject All Pending
              </button>
            </div>
          )}
          <div className="space-y-2">
            {sessionCandidates.map((c, i) => {
              const state = reviewStates.find((s) => s.candidateUrl === c.url);
              const decision = state?.decision ?? "pending";
              return (
                <div key={`${c.url}-${i}`} className="rounded border bg-gray-50 p-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{c.fetchResult.title || c.url}</span>
                      <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${decisionBadge(decision)}`}>
                        {decision}
                      </span>
                    </div>
                  </div>

                  {/* Duplicate warning — shown prominently when present */}
                  {c.duplicateWarning && (
                    <div className="mt-2 inline-block rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                      ⚠ {c.duplicateWarning}
                    </div>
                  )}

                  {/* Rejection reason */}
                  {decision === "rejected" && state?.rejectionReason && (
                    <div className="mt-1 text-xs text-red-600">
                      Reason: {state.rejectionReason}
                    </div>
                  )}

                  {/* Needs-changes notes */}
                  {decision === "needs-changes" && state?.needsChangesNotes && (
                    <div className="mt-1 text-xs text-purple-600">
                      Notes: {state.needsChangesNotes}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {decision !== "approved" && (
                      <button
                        onClick={() => setReviewStates((prev) => approveCandidate(prev, c.url))}
                        className="rounded bg-green-600 px-2 py-1 text-xs font-semibold text-white hover:bg-green-700"
                      >
                        Approve
                      </button>
                    )}
                    {decision !== "rejected" && (
                      <>
                        <button
                          onClick={() => {
                            const reason = rejectionInputs[c.url] ?? "";
                            setReviewStates((prev) => rejectCandidate(prev, c.url, reason));
                          }}
                          className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700"
                        >
                          Reject
                        </button>
                        <input
                          type="text"
                          value={rejectionInputs[c.url] ?? ""}
                          onChange={(e) => setRejectionInputs((prev) => ({ ...prev, [c.url]: e.target.value }))}
                          placeholder="Rejection reason..."
                          className="w-40 rounded border px-2 py-1 text-xs"
                        />
                      </>
                    )}
                    {decision !== "duplicate-risk" && c.duplicateWarning && (
                      <button
                        onClick={() => setReviewStates((prev) => markDuplicateRisk(prev, c.url, c.duplicateWarning))}
                        className="rounded bg-amber-600 px-2 py-1 text-xs font-semibold text-white hover:bg-amber-700"
                      >
                        Mark Duplicate Risk
                      </button>
                    )}
                    {decision !== "needs-changes" && (
                      <>
                        <button
                          onClick={() => {
                            const notes = changesInputs[c.url] ?? "";
                            setReviewStates((prev) => needsChangesCandidate(prev, c.url, notes));
                          }}
                          className="rounded bg-purple-600 px-2 py-1 text-xs font-semibold text-white hover:bg-purple-700"
                        >
                          Needs Changes
                        </button>
                        <input
                          type="text"
                          value={changesInputs[c.url] ?? ""}
                          onChange={(e) => setChangesInputs((prev) => ({ ...prev, [c.url]: e.target.value }))}
                          placeholder="What needs changing..."
                          className="w-40 rounded border px-2 py-1 text-xs"
                        />
                      </>
                    )}
                    {decision !== "pending" && (
                      <button
                        onClick={() => setReviewStates((prev) => resetDecision(prev, c.url))}
                        className="rounded border border-gray-300 px-2 py-1 text-xs font-semibold hover:bg-gray-100"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {summary.approved > 0 && (
            <div className="mt-3 rounded-lg border bg-green-50 p-3">
              <p className="font-semibold text-green-800">Publish Preview (read-only)</p>
              <p className="mt-1 text-sm text-green-700">
                {sessionCandidates.filter((c) => {
                  const s = reviewStates.find((rs) => rs.candidateUrl === c.url);
                  return s?.decision === "approved";
                }).length} approved candidate(s) would be published here. No actual publish performed.
                All state is session-only and will reset on page reload.
              </p>
            </div>
          )}
        </div>
      )}

      {/* No persistence notice */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        <p className="font-semibold">Session-Only State</p>
        <p>All data on this page is held in React useState and will be lost on page reload.
        No database writes, no persistence, no autonomous publishing.</p>
      </div>
    </div>
  );
}
