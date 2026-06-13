import { describe, it, expect } from "vitest";
import {
  discoverKnowledgeGraphGaps,
  prioritizeKnowledgeGraphGaps,
  routeGapToDiscoveryAgent,
  matchSeedsToGap,
  buildGapDrivenIngestionPlan,
  summarizeGapDrivenPlan,
} from "./gap-driven-ingestion-engine";
import { founderBetaSourceCatalog } from "@/data/founder-beta";
import { discoverySeeds } from "@/data/discovery-seeds";

describe("Pack13B_GapResolutionWave1", () => {
  it("discovers and prioritizes all gaps", () => {
    const gaps = discoverKnowledgeGraphGaps();
    const prioritized = prioritizeKnowledgeGraphGaps(gaps);
    const bySeverity: Record<string, number> = {};
    const byType: Record<string, number> = {};
    for (const p of prioritized) {
      bySeverity[p.gap.severity] = (bySeverity[p.gap.severity] || 0) + 1;
      byType[p.gap.type] = (byType[p.gap.type] || 0) + 1;
    }
    console.log(`\n=== GAP DISCOVERY RESULTS ===`);
    console.log(`Total gaps found: ${gaps.length}`);
    console.log(`\nBy severity:`, JSON.stringify(bySeverity, null, 2));
    console.log(`\nBy type:`, JSON.stringify(byType, null, 2));
    console.log(`\n--- Top 15 Prioritized Gaps ---`);
    for (const p of prioritized.slice(0, 15)) {
      const agent = routeGapToDiscoveryAgent(p.gap);
      console.log(`  [${p.priorityScore}] ${p.gap.severity} ${p.gap.type} — ${p.gap.target.entityName} (${p.gap.target.entityType}: ${p.gap.target.entityId})`);
      console.log(`    Agent: ${agent} | Reason: ${p.gap.reason}`);
    }
    expect(gaps.length).toBeGreaterThan(0);
  });

  it("builds ingestion plan and lists candidates", () => {
    const gaps = discoverKnowledgeGraphGaps();
    const prioritized = prioritizeKnowledgeGraphGaps(gaps);
    const importedIds = new Set(founderBetaSourceCatalog.map(s => s.id));
    const plan = buildGapDrivenIngestionPlan(prioritized, discoverySeeds, importedIds);
    const summary = summarizeGapDrivenPlan(plan);

    console.log(`\n=== INGESTION PLAN SUMMARY ===`);
    console.log(`Total gaps: ${summary.totalGaps}`);
    console.log(`Total candidates: ${summary.totalCandidates}`);
    console.log(`High priority: ${summary.highPriorityCount}`);
    console.log(`Total candidates: ${summary.totalCandidates}`);
    console.log(`Uncovered gaps: ${summary.uncoveredGapCount}`);
    console.log(`Uncovered gaps: ${summary.uncoveredGapCount}`);
    console.log(`Top gap types: ${summary.topGapTypes.join(", ")}`);
    console.log(`Top agent needs: ${summary.topAgentNeeds.join(", ")}`);
    console.log(`\n--- High Priority Candidates ---`);
    for (const c of plan.highPriorityCandidates.slice(0, 10)) {
      console.log(`  [${c.matchScore}] ${c.title}`);
      console.log(`    Seed: ${c.seedId} | Agent: ${c.recommendedAgent}`);
      console.log(`    SourceId: ${c.proposedSourceId} | TopicId: ${c.proposedTopicId}`);
      console.log(`    Reasons: ${c.matchReasons.join("; ")}`);
    }
    console.log(`\n--- Uncovered Gaps (no matching seeds) ---`);
    for (const g of plan.uncoveredGaps.slice(0, 10)) {
      console.log(`  ${g.severity} ${g.type} — ${g.target.entityName} (${g.target.entityId})`);
    }
  });
});
