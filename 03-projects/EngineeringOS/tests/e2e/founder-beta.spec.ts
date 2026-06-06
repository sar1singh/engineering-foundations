import { expect, test } from "@playwright/test";
import { rm } from "node:fs/promises";
import path from "node:path";

test.describe("Founder beta read-only surface", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Founder beta local persistence uses a shared file-backed store.");
    await rm(path.join(process.cwd(), ".engineeringos", "founder-beta-progress.json"), { force: true });
  });

  test("/founder-beta renders the default Today Plan", async ({ page }) => {
    await page.goto("/founder-beta", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1, name: "Founder Beta Solution Architect Path" })).toBeVisible();
    await expect(page.getByText("Demo progress active")).toHaveCount(0);
    await expect(page.getByText("Weak-area demo active")).toHaveCount(0);
    await expect(page.getByText("Local draft only")).toBeVisible();
    await expect(page.getByText("Onboarding Initialization Preview")).toBeVisible();
    await expect(page.getByText("Preview only. Does not overwrite saved progress.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Save onboarding progress" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Initial Session Inputs" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Initial Readiness Estimates" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Initial Weak Areas" })).toBeVisible();
    await expect(page.getByText("Derived Today Plan Preview")).toBeVisible();
    await page.getByLabel("Preview AWS Readiness").fill("71");
    await expect(page.getByLabel("Preview AWS Readiness")).toHaveValue("71");
    await expect(page.getByText("Preview Readiness Snapshot")).toBeVisible();
    await expect(page.getByText("Manual Progress Draft")).toBeVisible();
    await expect(page.getByRole("button", { name: "Save local progress" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Reset local progress" })).toBeVisible();
    await expect(page.getByText("Saved locally. Not synced. Not final evaluated readiness.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Session Settings" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Manual Readiness Estimates" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Weak Areas", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Completed Work" })).toBeVisible();
    await expect(page.getByText("These are manual draft estimates for internal validation.")).toBeVisible();
    await expect(page.getByText("Primary Mission", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Understand the AWS Well-Architected pillars/ })).toBeVisible();
    await expect(page.getByText("Readiness Snapshot", { exact: true })).toBeVisible();
    await expect(page.getByText("Hard Gate Status")).toBeVisible();
    await expect(page.getByText("Next Actions")).toBeVisible();

    await expect(page.getByRole("button", { name: "Save local progress" })).toBeEnabled();
    await page.getByLabel("Architect Readiness", { exact: true }).fill("76");
    await expect(page.getByLabel("Architect Readiness", { exact: true })).toHaveValue("76");
    const saveResponse = page.waitForResponse((response) => response.url().includes("/api/founder-beta/progress"));
    await page.getByRole("button", { name: "Save local progress" }).click();
    expect((await saveResponse).ok()).toBe(true);
    await expect(page.getByText("Local progress saved")).toBeVisible();
    await expect(page.getByText("Readiness Snapshot", { exact: true })).toBeVisible();
    await expect(page.getByText("Primary Mission", { exact: true })).toBeVisible();
  });

  test("/onboarding points to the Founder Beta initializer", async ({ page }) => {
    await page.goto("/onboarding", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1, name: "Configure your learning plan" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Initialize local Founder Beta progress" })).toBeVisible();
    await expect(page.getByText("It saves normalized progress input only; Today Plan and readiness are recalculated.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Open Founder Beta initializer" })).toHaveAttribute("href", "/founder-beta");
  });

  test("/founder-beta onboarding preview saves progress and requires confirmation before overwrite", async ({ page }) => {
    await page.goto("/founder-beta", { waitUntil: "domcontentloaded" });

    await page.getByLabel("Preview available minutes").fill("45");
    await page.getByLabel("Preview AWS Readiness").fill("71");
    await expect(page.getByLabel("Preview available minutes")).toHaveValue("45");
    await expect(page.getByLabel("Preview AWS Readiness")).toHaveValue("71");

    await expect(page.getByRole("button", { name: "Save onboarding progress" })).toBeEnabled();
    await page.getByRole("button", { name: "Save onboarding progress" }).click();

    await expect(page.getByText("Onboarding initialization saved locally. Today Plan was recomputed from saved progress.")).toBeVisible();
    await expect(page.getByText("Primary Mission", { exact: true })).toBeVisible();

    await page.goto("/founder-beta", { waitUntil: "networkidle" });
    await expect(page.getByText("Saved local progress loaded")).toBeVisible();
    await expect(page.getByLabel("Available minutes", { exact: true })).toHaveValue("45");
    await expect(page.getByLabel("AWS Readiness", { exact: true })).toHaveValue("71");
    await expect(page.getByRole("button", { name: "Overwrite onboarding progress" })).toBeVisible();

    await page.getByLabel("Preview available minutes").fill("40");
    await expect(page.getByLabel("Preview available minutes")).toHaveValue("40");
    await page.getByRole("button", { name: "Overwrite onboarding progress" }).click();
    await expect(page.getByText("This will replace your saved local Founder Beta progress. Today Plan and readiness will be recalculated.")).toBeVisible();

    await page.getByRole("button", { name: "Keep saved progress" }).click();
    await expect(page.getByText("Saved progress kept. Onboarding preview was not saved.")).toBeVisible();

    await page.goto("/founder-beta", { waitUntil: "networkidle" });
    await expect(page.getByLabel("Available minutes", { exact: true })).toHaveValue("45");

    await page.getByLabel("Preview available minutes").fill("40");
    await expect(page.getByLabel("Preview available minutes")).toHaveValue("40");
    await page.getByRole("button", { name: "Overwrite onboarding progress" }).click();
    await page.getByRole("button", { name: "Confirm overwrite" }).click();

    await expect(page.getByText("Onboarding initialization saved locally. Today Plan was recomputed from saved progress.")).toBeVisible();
    await expect(page.getByText("Primary Mission", { exact: true })).toBeVisible();

    await page.goto("/founder-beta", { waitUntil: "networkidle" });
    await expect(page.getByLabel("Available minutes", { exact: true })).toHaveValue("40");
  });

  test("/founder-beta?demo=1 renders non-zero demo progress", async ({ page }) => {
    await page.goto("/founder-beta?demo=1", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1, name: "Founder Beta Solution Architect Path" })).toBeVisible();
    await expect(page.getByText("Demo progress active")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Design a rate limiter for a mission generation API." })).toBeVisible();
    await expect(page.getByText("72%").first()).toBeVisible();
    await expect(page.getByText("Readiness Snapshot", { exact: true })).toBeVisible();
    await expect(page.getByText("Hard Gate Status")).toBeVisible();
  });

  test("/founder-beta?demo=weak-area renders weak-area demo progress", async ({ page }) => {
    await page.goto("/founder-beta?demo=weak-area", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1, name: "Founder Beta Solution Architect Path" })).toBeVisible();
    await expect(page.getByText("Weak-area demo active")).toBeVisible();
    await expect(page.getByText("Demo progress active")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /Understand the AWS Well-Architected pillars/ })).toBeVisible();
    await expect(page.getByText("58%").first()).toBeVisible();
    await expect(page.getByText("Readiness Snapshot", { exact: true })).toBeVisible();
    await expect(page.getByText("Hard Gate Status")).toBeVisible();
  });

  test("/founder-beta reloads saved local progress, derives Today Plan output, and resets", async ({ page }) => {
    await page.goto("/founder-beta", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("button", { name: "Save local progress" })).toBeEnabled();
    await page.getByLabel("Available minutes", { exact: true }).fill("75");
    await page.getByLabel("Architect Readiness", { exact: true }).fill("76");

    const saveResponse = page.waitForResponse((response) => response.url().includes("/api/founder-beta/progress"));
    await page.getByRole("button", { name: "Save local progress" }).click();
    expect((await saveResponse).ok()).toBe(true);
    await expect(page.getByText("Local progress saved")).toBeVisible();

    await page.goto("/founder-beta", { waitUntil: "networkidle" });

    await expect(page.getByText("Saved local progress loaded")).toBeVisible();
    await expect(page.getByLabel("Available minutes", { exact: true })).toHaveValue("75");
    await expect(page.getByLabel("Architect Readiness", { exact: true })).toHaveValue("76");
    await expect(page.getByText("Primary Mission", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Understand the AWS Well-Architected pillars|Draft an API contract|Design a rate limiter/ })).toBeVisible();
    await expect(page.getByText("Readiness Snapshot", { exact: true })).toBeVisible();

    await expect(page.getByRole("button", { name: "Reset local progress" })).toBeEnabled();
    const resetResponse = page.waitForResponse((response) => response.url().includes("/api/founder-beta/progress"));
    await page.getByRole("button", { name: "Reset local progress" }).click();
    expect((await resetResponse).ok()).toBe(true);
    await expect(page.getByText("Local progress reset")).toBeVisible();
    await expect(page.getByLabel("Available minutes", { exact: true })).toHaveValue("60");
    await expect(page.getByLabel("Architect Readiness", { exact: true })).toHaveValue("0");

    await page.goto("/founder-beta", { waitUntil: "networkidle" });
    await expect(page.getByText("Saved local progress loaded")).toHaveCount(0);
    await expect(page.getByLabel("Available minutes", { exact: true })).toHaveValue("60");
    await expect(page.getByLabel("Architect Readiness", { exact: true })).toHaveValue("0");
    await expect(page.getByText("Primary Mission", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Understand the AWS Well-Architected pillars/ })).toBeVisible();
  });
});
