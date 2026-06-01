import { expect, test } from "@playwright/test";

test.describe("Phase 65 glassmorphism guided learning UX", () => {
  test("courses page exposes guided role and bootcamp cards", async ({ page }) => {
    await page.goto("/courses", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "Choose a mission, not a menu." })).toBeVisible();
    await expect(page.getByRole("link", { name: /Senior Backend Engineer/ }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /AWS Solution Architect/ }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Interview Crash Course/ }).first()).toBeVisible();
  });

  test("profile and placeholder auth routes are visible and honest about local mode", async ({ page }) => {
    await page.goto("/profile", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Your interview mission profile" })).toBeVisible();
    await expect(page.getByText("Local learner profile")).toBeVisible();

    await page.goto("/signin", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Local sign-in placeholder" })).toBeVisible();
  });

  test("syllabus hides advanced filters behind a focused panel", async ({ page }) => {
    await page.goto("/syllabus", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /Find the next lesson/ })).toBeVisible();
    await expect(page.getByText("Advanced filters", { exact: true })).toBeVisible();
    await page.getByText("Advanced filters", { exact: true }).click();
    await expect(page.getByLabel("Domain")).toBeVisible();
  });

  test("learning graph uses a visual roadmap with clickable nodes", async ({ page }) => {
    await page.goto("/graph", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /roadmap-style map/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Promises|Closures|Graph|Binary|Node/i }).first()).toBeVisible();
  });

  test("runner reports a passing harness state", async ({ page }) => {
    await page.goto("/practice/runnable-hashmap-two-sum-frequency", { waitUntil: "domcontentloaded" });
    const runButton = page.getByRole("button", { name: "Run" });
    await expect(runButton).toBeEnabled();
    await runButton.click();
    await expect(page.getByTestId("local-runner-output")).toContainText("visible harness passed");
    await expect(page.getByText(/State: passed/i)).toBeVisible();
  });
});
