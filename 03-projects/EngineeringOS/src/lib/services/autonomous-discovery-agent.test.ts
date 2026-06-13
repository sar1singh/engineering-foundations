import { describe, expect, it } from "vitest";
import { discoverySeeds } from "@/data/discovery-seeds";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";
import { founderBetaSourceCatalog } from "@/data/founder-beta/source-catalog";
import {
  buildDiscoverySummary,
  deduplicateDiscoveryCandidates,
  discoverCandidatesFromSeeds,
  runAutonomousDiscovery,
} from "./autonomous-discovery-agent";

describe("autonomous discovery agent", () => {
  it("discovers candidates from static seeds", () => {
    const seeds = discoverCandidatesFromSeeds(["aws"]);

    expect(seeds.length).toBeGreaterThanOrEqual(10);
    expect(seeds.every((seed) => seed.category === "aws")).toBe(true);
  });

  it("deduplicates seed URLs deterministically", () => {
    const duplicateSeeds = [discoverySeeds[0], { ...discoverySeeds[0], id: "duplicate-seed" }, discoverySeeds[1]];
    const unique = deduplicateDiscoveryCandidates(duplicateSeeds);

    expect(unique.map((seed) => seed.id)).toEqual([discoverySeeds[0].id, discoverySeeds[1].id]);
  });

  it("filters by selected categories", () => {
    const seeds = discoverCandidatesFromSeeds(["backend", "system-design"]);

    expect(seeds.length).toBeGreaterThan(0);
    expect(new Set(seeds.map((seed) => seed.category))).toEqual(new Set(["backend", "system-design"]));
  });

  it("returns deterministic output ordering", () => {
    const first = discoverCandidatesFromSeeds(["system-design", "aws"]).map((seed) => seed.id);
    const second = discoverCandidatesFromSeeds(["system-design", "aws"]).map((seed) => seed.id);

    expect(second).toEqual(first);
  });

  it("marks discovered candidates review-required", () => {
    const result = runAutonomousDiscovery({ categories: ["backend"], limit: 2 });

    expect(result.candidates).toHaveLength(2);
    expect(result.candidates.every((candidate) => candidate.reviewRequired)).toBe(true);
    expect(result.summary.reviewRequired).toBe(2);
  });

  it("runs every candidate through the Pack 11B pipeline", () => {
    const result = runAutonomousDiscovery({ categories: ["aws"], limit: 1 });
    const candidate = result.candidates[0];

    expect(candidate.pipelineResult.trace.map((entry) => entry.agentType)).toEqual([
      "validation-agent",
      "metadata-agent",
      "candidate-agent",
      "duplicate-agent",
      "review-agent",
    ]);
  });

  it("does not write to graph data", () => {
    const beforeSources = founderBetaSourceCatalog.length;
    const beforeTopics = founderBetaMasterTopics.length;

    runAutonomousDiscovery({ categories: ["aws", "backend"], limit: 4 });

    expect(founderBetaSourceCatalog).toHaveLength(beforeSources);
    expect(founderBetaMasterTopics).toHaveLength(beforeTopics);
  });

  it("builds summary from candidates", () => {
    const result = runAutonomousDiscovery({ categories: ["system-design"], limit: 3 });
    const summary = buildDiscoverySummary(result.candidates, ["system-design"], result.candidates.length);

    expect(summary.candidatesDiscovered).toBe(3);
    expect(summary.graphWrites).toBe(0);
    expect(summary.traceSteps).toBe(15);
  });
});
