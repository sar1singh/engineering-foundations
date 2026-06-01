import ts from "typescript";
import vm from "node:vm";
import { describe, expect, it } from "vitest";
import { enrichedTopicContentBySlug } from "@/data/content/enriched-content";
import type { EnrichedPracticeProblem } from "@/types/enriched-content";

type ExportedSolution = Record<string, (...args: unknown[]) => unknown>;

function loadSolution(problem: EnrichedPracticeProblem): ExportedSolution {
  const transpiled = ts.transpileModule(problem.solution, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      strict: true
    }
  }).outputText;
  const commonExports: ExportedSolution = {};
  const sandbox = { exports: commonExports, module: { exports: commonExports } };
  vm.runInNewContext(transpiled, sandbox, { timeout: 1000 });
  return sandbox.module.exports as ExportedSolution;
}

function problemById(topicSlug: string, problemId: string): EnrichedPracticeProblem {
  const problem = enrichedTopicContentBySlug[topicSlug]?.enrichedProblems.find((item) => item.id === problemId);
  expect(problem, `${topicSlug}/${problemId}`).toBeDefined();
  return problem!;
}

describe("DSA enriched solution executable contract", () => {
  it("executes representative embedded TypeScript solutions against real assertions", () => {
    const twoSum = loadSolution(problemById("hashmap-frequency", "enriched-hashmap-two-sum-frequency")).twoSum;
    expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1]);
    expect(twoSum([1, 2, 3], 7)).toBeNull();

    const topKFrequent = loadSolution(problemById("hashmap-frequency", "enriched-hashmap-top-k-frequent")).topKFrequent;
    expect(new Set(topKFrequent([1, 1, 1, 2, 2, 3], 2) as number[])).toEqual(new Set([1, 2]));

    const shortestPathGrid = loadSolution(problemById("graph-bfs", "enriched-graph-bfs-shortest-path-grid")).shortestPathGrid;
    expect(shortestPathGrid([[0, 0], [1, 0]])).toBe(2);
    expect(shortestPathGrid([[0, 1], [1, 0]])).toBe(-1);

    const minShipCapacity = loadSolution(problemById("binary-search", "enriched-binary-search-min-capacity")).minShipCapacity;
    expect(minShipCapacity([3, 2, 2, 4, 1, 4], 3)).toBe(6);

    const coinChange = loadSolution(problemById("dynamic-programming-core", "enriched-dp-coin-change")).coinChange;
    expect(coinChange([1, 2, 5], 11)).toBe(3);
    expect(coinChange([2], 3)).toBe(-1);

    const productExceptSelf = loadSolution(problemById("arrays-strings", "enriched-arrays-strings-product-except-self")).productExceptSelf;
    expect(productExceptSelf([1, 2, 3, 4])).toEqual([24, 12, 8, 6]);
  });

  it("transpiles every embedded DSA solution independently", () => {
    const dsaProblems = Object.values(enrichedTopicContentBySlug).flatMap((content) => content.enrichedProblems);
    expect(dsaProblems.length).toBeGreaterThan(20);

    for (const problem of dsaProblems) {
      expect(() => loadSolution(problem), problem.id).not.toThrow();
    }
  });
});
