"use client";

import { useState } from "react";
import type { Capability, Skill, MasterTopic, SourceReference } from "@/types/founder-beta";
import type { CoverageSummary, GapAnalysisResult } from "@/types/content-registry";

type ContentExplorerProps = {
  capabilities: Capability[];
  skillsByCapabilityId: Record<string, Skill[]>;
  allTopics: MasterTopic[];
  allSources: SourceReference[];
  topicsByCapabilityId: Record<string, string[]>;
  topicsBySkillId: Record<string, string[]>;
  sourcesByCapabilityId: Record<string, string[]>;
  coverage: CoverageSummary;
  gaps: GapAnalysisResult;
};

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-blue-100 text-blue-800"
  };
  return (
    <span className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${colors[severity] ?? "bg-gray-100 text-gray-600"}`}>
      {severity}
    </span>
  );
}

export function ContentExplorer({
  capabilities,
  skillsByCapabilityId,
  allTopics,
  allSources,
  topicsByCapabilityId,
  topicsBySkillId,
  sourcesByCapabilityId,
  coverage,
  gaps
}: ContentExplorerProps) {
  const [selectedCapabilityId, setSelectedCapabilityId] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [showGaps, setShowGaps] = useState(false);

  const capTopics = selectedCapabilityId
    ? (topicsByCapabilityId[selectedCapabilityId] ?? [])
        .map((tid) => allTopics.find((t) => t.id === tid)!)
        .filter(Boolean)
    : [];
  const capSources = selectedCapabilityId
    ? (sourcesByCapabilityId[selectedCapabilityId] ?? [])
        .map((sid) => allSources.find((s) => s.id === sid)!)
        .filter(Boolean)
    : [];
  const skillTopics = selectedSkillId
    ? (topicsBySkillId[selectedSkillId] ?? [])
        .map((tid) => allTopics.find((t) => t.id === tid)!)
        .filter(Boolean)
    : [];

  const selectedCapability = selectedCapabilityId
    ? capabilities.find((c) => c.id === selectedCapabilityId)
    : null;

  function handleCapabilityChange(capId: string) {
    setSelectedCapabilityId(capId);
    setSelectedSkillId("");
  }

  const capCoverage = selectedCapabilityId
    ? coverage.capabilityCoverage.find((c) => c.capabilityId === selectedCapabilityId)
    : null;

  const sourceTypeBreakdown = Object.entries(coverage.sourceCoverage.byType)
    .sort(([, a], [, b]) => b - a);

  const barrierCount = gaps.gaps.filter((g) => g.severity === "high").length;
  const mediumCount = gaps.gaps.filter((g) => g.severity === "medium").length;
  const lowCount = gaps.gaps.filter((g) => g.severity === "low").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border p-3">
          <p className="text-2xl font-bold">{coverage.capabilityCoverage.length}</p>
          <p className="text-xs text-[var(--muted)]">Capabilities</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-2xl font-bold">{coverage.skillCoverage.length}</p>
          <p className="text-xs text-[var(--muted)]">Skills</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-2xl font-bold">{coverage.sourceCoverage.totalSources}</p>
          <p className="text-xs text-[var(--muted)]">Sources</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-2xl font-bold">{gaps.totalGaps}</p>
          <p className="text-xs text-[var(--muted)]">Gaps</p>
          <div className="mt-1 flex gap-1 text-[10px]">
            {barrierCount > 0 && <span className="text-red-600">{barrierCount} high</span>}
            {mediumCount > 0 && <span className="text-yellow-600">{mediumCount} med</span>}
            {lowCount > 0 && <span className="text-blue-600">{lowCount} low</span>}
            {gaps.totalGaps === 0 && <span className="text-green-600">none</span>}
          </div>
        </div>
      </div>

      <section className="rounded-lg border">
        <div className="border-b bg-gray-50 px-4 py-2">
          <h2 className="text-sm font-semibold">Capability &minus; Skill &minus; Topic &minus; Sources</h2>
        </div>
        <div className="grid grid-cols-1 gap-0 md:grid-cols-4">
          <div className="border-r p-3">
            <label className="mb-1 block text-xs font-medium text-[var(--muted)]">Capability</label>
            <select
              className="w-full rounded border p-1.5 text-sm"
              value={selectedCapabilityId}
              onChange={(e) => handleCapabilityChange(e.target.value)}
            >
              <option value="">Select a capability...</option>
              {capabilities.map((cap) => (
                <option key={cap.id} value={cap.id}>
                  {cap.name}
                </option>
              ))}
            </select>
          </div>

          <div className="border-r p-3">
            <label className="mb-1 block text-xs font-medium text-[var(--muted)]">Skill</label>
            {selectedCapabilityId ? (
              <select
                className="w-full rounded border p-1.5 text-sm"
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(e.target.value)}
              >
                <option value="">All skills in capability...</option>
                {(skillsByCapabilityId[selectedCapabilityId] ?? []).map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-[var(--muted)]">Select a capability first</p>
            )}
          </div>

          <div className="border-r p-3">
            <label className="mb-1 block text-xs font-medium text-[var(--muted)]">Topics ({selectedSkillId ? skillTopics.length : capTopics.length})</label>
            <div className="max-h-48 space-y-1 overflow-y-auto">
              {selectedSkillId
                ? skillTopics.map((topic) => (
                    <div key={topic.id} className="rounded bg-gray-50 px-2 py-1 text-xs">
                      <span className="font-medium">{topic.name}</span>
                      <span className="ml-1 text-[var(--muted)]">
                        {topic.sourceIds.length} src, {topic.proofTypes.length} pf, conf: {topic.confidenceScore}
                      </span>
                    </div>
                  ))
                : capTopics.map((topic) => (
                    <div key={topic.id} className="rounded bg-gray-50 px-2 py-1 text-xs">
                      <span className="font-medium">{topic.name}</span>
                      <span className="ml-1 text-[var(--muted)]">
                        {topic.sourceIds.length} src, conf: {topic.confidenceScore}
                      </span>
                    </div>
                  ))}
              {((selectedSkillId && skillTopics.length === 0) || (selectedCapabilityId && !selectedSkillId && capTopics.length === 0)) && (
                <p className="text-xs text-[var(--muted)]">No topics found for this selection</p>
              )}
            </div>
          </div>

          <div className="p-3">
            <label className="mb-1 block text-xs font-medium text-[var(--muted)]">Sources</label>
            <div className="max-h-48 space-y-1 overflow-y-auto">
              {capSources.map((source) => (
                <div key={source.id} className="rounded bg-gray-50 px-2 py-1 text-xs">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-teal-700 hover:underline"
                  >
                    {source.title}
                  </a>
                  <span className="ml-1 text-[var(--muted)]">({source.sourceType})</span>
                </div>
              ))}
              {selectedCapabilityId && capSources.length === 0 && (
                <p className="text-xs text-[var(--muted)]">No sources found</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {selectedCapability && capCoverage && (
        <section className="rounded-lg border p-4">
          <h2 className="mb-3 text-sm font-semibold">{selectedCapability.name} Coverage</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div>
              <p className="text-xs text-[var(--muted)]">Topics</p>
              <p className="text-lg font-semibold">{capCoverage.topicCount}</p>
              <p className="text-[10px] text-[var(--muted)]">min: 3</p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted)]">Skills</p>
              <p className="text-lg font-semibold">{capCoverage.skillCount}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted)]">Sources</p>
              <p className="text-lg font-semibold">{capCoverage.sourceCount}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted)]">Proof Types</p>
              <p className="text-lg font-semibold">{capCoverage.proofTypes.length}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted)]">Avg Confidence</p>
              <p className="text-lg font-semibold">{capCoverage.averageConfidenceScore}</p>
            </div>
          </div>
          {capCoverage.proofTypes.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {capCoverage.proofTypes.map((pt) => (
                <span key={pt} className="rounded bg-purple-100 px-1.5 py-0.5 text-xs font-medium text-purple-800">
                  {pt}
                </span>
              ))}
            </div>
          )}
          {capCoverage.topicCount >= 3 ? (
            <p className="mt-2 text-xs text-green-700">Topic coverage threshold met</p>
          ) : (
            <p className="mt-2 text-xs text-red-600">Topic coverage below minimum (3)</p>
          )}
        </section>
      )}

      <section className="rounded-lg border">
        <button
          className="flex w-full items-center justify-between px-4 py-2 text-left text-sm font-semibold hover:bg-gray-50"
          onClick={() => setShowGaps(!showGaps)}
        >
          <span>Gap Analysis ({gaps.totalGaps} gap{gaps.totalGaps !== 1 ? "s" : ""})</span>
          <span className="text-xs text-[var(--muted)]">{showGaps ? "Hide" : "Show"}</span>
        </button>
        {showGaps && (
          <div className="border-t p-4">
            {gaps.gaps.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No gaps detected. All quality thresholds passed.</p>
            ) : (
              <div className="space-y-2">
                {gaps.gaps.map((gap, i) => (
                  <div key={`${gap.entityId}-${i}`} className="rounded border bg-gray-50 p-2 text-xs">
                    <div className="mb-1 flex items-center gap-2">
                      <SeverityBadge severity={gap.severity} />
                      <span className="font-medium capitalize">{gap.type.replace(/-/g, " ")}</span>
                      {gap.severity === "high" && (
                        <span className="ml-auto rounded bg-red-100 px-1 py-0.5 text-[10px] text-red-700">
                          needs remediation
                        </span>
                      )}
                      {gap.severity === "medium" && (
                        <span className="ml-auto rounded bg-yellow-100 px-1 py-0.5 text-[10px] text-yellow-700">
                          acceptable
                        </span>
                      )}
                      {gap.severity === "low" && (
                        <span className="ml-auto rounded bg-blue-100 px-1 py-0.5 text-[10px] text-blue-700">
                          minor
                        </span>
                      )}
                    </div>
                    <p className="text-[var(--muted)]">
                      <strong>{gap.entityName}</strong> ({gap.entityId})
                    </p>
                    <p className="text-[var(--muted)]">{gap.detail}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 border-t pt-2">
              <p className="text-xs text-[var(--muted)]">
                <span className="font-medium">Remediation:</span>{" "}
                {gaps.weaklySourcedTopics.length > 0
                  ? `${gaps.weaklySourcedTopics.length} weakly-sourced topics — additional mappings needed`
                  : "No weakly-sourced topics — all have sufficient sources"}
                <br />
                {gaps.lowCoverageCapabilities.length > 0
                  ? `${gaps.lowCoverageCapabilities.length} low-coverage capabilities — expand topic count`
                  : "All capabilities have adequate topic coverage"}
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="mb-3 text-sm font-semibold">Source Catalog Breakdown</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-medium text-[var(--muted)]">By Type</p>
            <div className="space-y-1">
              {sourceTypeBreakdown.map(([type, count]) => (
                <div key={type} className="flex items-center justify-between text-xs">
                  <span>{type}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-[var(--muted)]">By Tier</p>
            <div className="space-y-1">
              {Object.entries(coverage.sourceCoverage.byTier).map(([tier, count]) => (
                <div key={tier} className="flex items-center justify-between text-xs">
                  <span>{tier}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
