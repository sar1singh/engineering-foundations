"use client";

import { useState } from "react";
import type { SourceReference, Capability } from "@/types/founder-beta";

type ResourceExplorerPanelProps = {
  sources: SourceReference[];
  capabilities: Capability[];
  categories: string[];
  topicNamesByCapability: Record<string, Array<{ id: string; name: string; sourceIds: string[] }>>;
};

type Filters = {
  capabilityId: string;
  topicId: string;
  category: string;
  tier: string;
  reliability: string;
};

function matchesFilters(source: SourceReference, filters: Filters, activeTopicSourceIds: Set<string>): boolean {
  if (filters.topicId && !activeTopicSourceIds.has(source.id)) return false;
  if (filters.category && source.category !== filters.category) return false;
  if (filters.tier && source.tier !== filters.tier) return false;
  if (filters.reliability && source.reliability !== filters.reliability) return false;
  return true;
}

function SourceBadge({ label }: { label: string }) {
  const colors: Record<string, string> = {
    "tier-1": "bg-green-100 text-green-800",
    "tier-2": "bg-blue-100 text-blue-800",
    "tier-3": "bg-yellow-100 text-yellow-800",
    "tier-4": "bg-gray-100 text-gray-600",
    high: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-red-100 text-red-800",
    "official-docs": "bg-purple-100 text-purple-800",
    "github-repository": "bg-gray-100 text-gray-800",
    roadmap: "bg-indigo-100 text-indigo-800",
    book: "bg-amber-100 text-amber-800",
    "interview-guide": "bg-pink-100 text-pink-800",
    "engineering-blog": "bg-cyan-100 text-cyan-800",
    "career-framework": "bg-emerald-100 text-emerald-800",
    "job-description": "bg-orange-100 text-orange-800"
  };
  const className = colors[label] ?? "bg-gray-100 text-gray-600";

  return <span className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${className}`}>{label}</span>;
}

export function ResourceExplorerPanel({ sources, capabilities, categories, topicNamesByCapability }: ResourceExplorerPanelProps) {
  const [filters, setFilters] = useState<Filters>({
    capabilityId: "",
    topicId: "",
    category: "",
    tier: "",
    reliability: ""
  });

  const activeTopics = filters.capabilityId ? topicNamesByCapability[filters.capabilityId] ?? [] : [];
  const activeTopicSourceIds = new Set<string>();
  if (filters.topicId) {
    const topic = activeTopics.find((t) => t.id === filters.topicId);
    if (topic) topic.sourceIds.forEach((id) => activeTopicSourceIds.add(id));
  }

  const filteredSources = sources.filter((source) => matchesFilters(source, filters, activeTopicSourceIds));

  function setFilter(key: keyof Filters, value: string) {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "capabilityId" ? { topicId: "" } : {}),
      ...(key === "capabilityId" || key === "topicId" ? { category: "", tier: "", reliability: "" } : {})
    }));
  }

  const tierOptions = ["tier-1", "tier-2", "tier-3", "tier-4"];
  const reliabilityOptions: Array<SourceReference["reliability"]> = ["high", "medium", "low"];

  return (
    <div className="space-y-4">
      <div className="eo-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-teal-700">Filter Resources</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Capability</label>
            <select
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
              value={filters.capabilityId}
              onChange={(e) => setFilter("capabilityId", e.target.value)}
            >
              <option value="">All Capabilities</option>
              {capabilities.map((cap) => (
                <option key={cap.id} value={cap.id}>{cap.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Topic</label>
            <select
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
              value={filters.topicId}
              onChange={(e) => setFilter("topicId", e.target.value)}
              disabled={activeTopics.length === 0}
            >
              <option value="">All Topics</option>
              {activeTopics.map((topic) => (
                <option key={topic.id} value={topic.id}>{topic.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Category</label>
            <select
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
              value={filters.category}
              onChange={(e) => setFilter("category", e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Tier</label>
            <select
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
              value={filters.tier}
              onChange={(e) => setFilter("tier", e.target.value)}
            >
              <option value="">All Tiers</option>
              {tierOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Reliability</label>
            <select
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
              value={filters.reliability}
              onChange={(e) => setFilter("reliability", e.target.value)}
            >
              <option value="">All</option>
              {reliabilityOptions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        Showing {filteredSources.length} of {sources.length} sources
      </div>

      <div className="space-y-2">
        {filteredSources.map((source) => {
          const topicsForSource = topicNamesByCapability["__all"]?.filter((t) => t.sourceIds.includes(source.id)) ?? [];
          return (
            <div key={source.id} className="eo-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-teal-700 hover:underline"
                  >
                    {source.title}
                  </a>
                  <p className="mt-0.5 text-xs text-gray-500">{source.category}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  <SourceBadge label={source.tier} />
                  <SourceBadge label={source.reliability} />
                  <SourceBadge label={source.sourceType} />
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-600">{source.founderBetaRelevance}</p>
              {topicsForSource.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {topicsForSource.slice(0, 5).map((t) => (
                    <span key={t.id} className="inline-block rounded bg-teal-50 px-1.5 py-0.5 text-xs text-teal-700">
                      {t.name}
                    </span>
                  ))}
                  {topicsForSource.length > 5 && (
                    <span className="inline-block rounded bg-gray-50 px-1.5 py-0.5 text-xs text-gray-500">
                      +{topicsForSource.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
