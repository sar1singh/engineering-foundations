import { describe, expect, it } from "vitest";

import { getLocalRunnerSafetyError, prepareLocalRunnerCode } from "@/components/practice/LocalCodeRunner";

describe("LocalCodeRunner safety guard", () => {
  it("allows focused console-only learning examples", () => {
    expect(getLocalRunnerSafetyError("const total = [1, 2, 3].reduce((sum, value) => sum + value, 0); console.log(total);")).toBeNull();
  });

  it("blocks network and browser capability access", () => {
    expect(getLocalRunnerSafetyError("fetch('/api/private')")).toContain("Network");
    expect(getLocalRunnerSafetyError("localStorage.setItem('x', 'y')")).toContain("storage");
    expect(getLocalRunnerSafetyError("document.body.innerHTML = ''")).toContain("DOM");
  });

  it("blocks dynamic evaluation and obvious infinite loops", () => {
    expect(getLocalRunnerSafetyError("eval('console.log(1)')")).toContain("Dynamic evaluation");
    expect(getLocalRunnerSafetyError("const fn = Function('return 1')")).toContain("Dynamic function");
    expect(getLocalRunnerSafetyError("while (true) { console.log('x') }")).toContain("infinite loops");
  });

  it("normalizes common TypeScript learning snippets into executable browser JavaScript", () => {
    const normalized = prepareLocalRunnerCode(`export function twoSum(nums: number[], target: number): [number, number] | null {
  const seen = new Map<number, number>();
  return seen.get(target)!;
}`);

    expect(normalized).not.toContain("export");
    expect(normalized).not.toContain(": number");
    expect(normalized).not.toContain("<number");
    expect(normalized).not.toContain("!");
    expect(() => new Function("console", normalized)).not.toThrow();
  });

  it("preserves multiple typed parameters while normalizing runnable DSA snippets", () => {
    const normalized = prepareLocalRunnerCode("export function twoSum(nums: number[], target: number): [number, number] | null { return [0, target]; }");

    expect(normalized).toContain("function twoSum(nums, target)");
    expect(normalized).toContain("target");
  });
});
