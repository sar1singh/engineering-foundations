import { expect, test } from "@playwright/test";
import { rm } from "node:fs/promises";
import path from "node:path";

test.describe("Founder beta read-only surface", () => {
  test.beforeEach(async () => {
    await rm(path.join(process.cwd(), ".engineeringos", "founder-beta-progress.json"), { force: true });
  });

  test("/founder-beta renders the default Today Plan", async ({ page }) => {
    await page.goto("/founder-beta", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "Founder Beta Solution Architect Path" })).toBeVisible();
    await expect(page.getByText("Demo progress active")).toHaveCount(0);
    await expect(page.getByText("Weak-area demo active")).toHaveCount(0);
    await expect(page.getByText("Local draft only")).toBeVisible();
    await expect(page.getByText("Manual Progress Draft")).toBeVisible();
    await expect(page.getByRole("button", { name: "Save local progress" })).toBeVisible();
    await expect(page.getByText("Saved locally. Not synced. Not final evaluated readiness.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Session Settings" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Manual Readiness Estimates" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Weak Areas" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Completed Work" })).toBeVisible();
    await expect(page.getByText("These are manual draft estimates for internal validation.")).toBeVisible();
    await expect(page.getByText("Primary Mission", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Understand the AWS Well-Architected pillars/ })).toBeVisible();
    await expect(page.getByText("Readiness Snapshot")).toBeVisible();
    await expect(page.getByText("Hard Gate Status")).toBeVisible();
    await expect(page.getByText("Next Actions")).toBeVisible();

    await expect(page.getByRole("button", { name: "Save local progress" })).toBeEnabled();
    await page.getByLabel("Architect Readiness").fill("76");
    await expect(page.getByLabel("Architect Readiness")).toHaveValue("76");
    const saveResponse = page.waitForResponse((response) => response.url().includes("/api/founder-beta/progress"));
    await page.getByRole("button", { name: "Save local progress" }).click();
    expect((await saveResponse).ok()).toBe(true);
    await expect(page.getByText("Local progress saved")).toBeVisible();
    await expect(page.getByText("Readiness Snapshot")).toBeVisible();
    await expect(page.getByText("Primary Mission", { exact: true })).toBeVisible();
  });

  test("/founder-beta?demo=1 renders non-zero demo progress", async ({ page }) => {
    await page.goto("/founder-beta?demo=1", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "Founder Beta Solution Architect Path" })).toBeVisible();
    await expect(page.getByText("Demo progress active")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Design a rate limiter for a mission generation API." })).toBeVisible();
    await expect(page.getByText("72%").first()).toBeVisible();
    await expect(page.getByText("Readiness Snapshot")).toBeVisible();
    await expect(page.getByText("Hard Gate Status")).toBeVisible();
  });

  test("/founder-beta?demo=weak-area renders weak-area demo progress", async ({ page }) => {
    await page.goto("/founder-beta?demo=weak-area", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "Founder Beta Solution Architect Path" })).toBeVisible();
    await expect(page.getByText("Weak-area demo active")).toBeVisible();
    await expect(page.getByText("Demo progress active")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /Understand the AWS Well-Architected pillars/ })).toBeVisible();
    await expect(page.getByText("58%").first()).toBeVisible();
    await expect(page.getByText("Readiness Snapshot")).toBeVisible();
    await expect(page.getByText("Hard Gate Status")).toBeVisible();
  });
});
