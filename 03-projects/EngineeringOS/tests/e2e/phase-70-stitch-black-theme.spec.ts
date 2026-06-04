import { expect, test } from "@playwright/test";

test.describe("Phase 70 Stitch-backed black theme UX", () => {
  test("dashboard renders the Mission Control first viewport", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("MISSION_CONTROL // ACTIVE")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Mission in progress" })).toBeVisible();
    await expect(page.getByText("TODAY'S PROTOCOL")).toBeVisible();
    await expect(page.getByText("READINESS TELEMETRY")).toBeVisible();
    await expect(page.getByText("VULNERABILITY DETECTED")).toBeVisible();
  });

  test("black command shell exposes minimal OS rail navigation", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "The compact OS rail is a desktop shell; mobile uses the compact founder navigation.");
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("link", { name: "Mission", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Blueprint", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Focus", exact: true })).toBeVisible();
    await expect(page.getByText("ENGINEERING_OS")).toBeVisible();
    await expect(page.getByText("CMD+K TO SEARCH NODES")).toBeVisible();
  });

  test("blueprint graph renders clickable grouped roadmap nodes", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/graph", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("BLUEPRINT_MODULE // ROLE PATH")).toBeVisible();
    await expect(page.getByText("ACTIVE SESSION")).toBeVisible();
    await expect(page.getByRole("link", { name: /Resume module/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Resume module|Closures|Graph|Binary|IAM|API/i }).first()).toBeVisible();
  });

  test("topic focus engine exposes clickable source references", async ({ page }) => {
    await page.goto("/syllabus/graph-bfs", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "Source referral panel" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /NeetCode|LeetCode|Algorithms|GitHub|roadmap/i }).first()).toBeVisible();
  });

  test("practice page keeps Focus Engine runner and output console", async ({ page }) => {
    await page.goto("/practice/runnable-hashmap-two-sum-frequency", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("DSA_WORKSPACE // FOCUS ENGINE")).toBeVisible();
    await expect(page.getByText("Output console")).toBeVisible();
    const runButton = page.getByRole("button", { name: "Run" });
    await expect(runButton).toBeEnabled({ timeout: 20000 });
    await runButton.click({ force: true });
    await expect(page.getByTestId("local-runner-output")).toContainText("visible harness passed");
  });
});
