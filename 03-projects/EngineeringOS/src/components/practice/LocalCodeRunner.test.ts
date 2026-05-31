import { describe, expect, it } from "vitest";

import { getLocalRunnerSafetyError } from "@/components/practice/LocalCodeRunner";

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
});
