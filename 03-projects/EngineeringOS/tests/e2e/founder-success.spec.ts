import { expect, test } from "@playwright/test";

const founderRoutes = [
  { path: "/", heading: "Your next 90 minutes are already decided." },
  { path: "/dashboard", heading: "Mission in progress" },
  { path: "/today", heading: "Your next 90 minutes are already decided." },
  { path: "/interview-rounds", heading: "Prepare for the actual loop, not random topics." },
  { path: "/sources", heading: "Use the best sources. Skip the rest for now." },
  { path: "/weak-areas", heading: "Weakness is a queue, not an identity." },
  { path: "/answer-builders", heading: "Structure beats panic." },
  { path: "/syllabus", heading: "Syllabus Command Center" },
  { path: "/syllabus/graph-bfs", heading: "Graph BFS" },
  { path: "/quality", heading: "Quality contract dashboard" }
];

test.describe("Phase 57 founder-success UX", () => {
  for (const route of founderRoutes) {
    test(`${route.path} presents the intended product surface`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { name: route.heading })).toBeVisible();
      await expect(page.locator("body")).toHaveCSS("color-scheme", "dark");
    });
  }

  test("navigation exposes founder-success surfaces", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/today", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("link", { name: "Mission", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Blueprint", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Focus", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sources", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Profile", exact: true })).toBeVisible();
  });

  test("mobile prioritizes learning content before navigation chrome", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/today", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("navigation", { name: "Mobile founder navigation" })).toBeVisible();
    await expect(page.getByText("More")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Your next 90 minutes are already decided." })).toBeInViewport();
  });

  test("mobile founder surfaces avoid page-wide horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    for (const route of ["/today", "/interview-rounds", "/sources", "/weak-areas", "/answer-builders"]) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(2);
    }
  });

  test("answer builders support compact mobile scanning", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/answer-builders", { waitUntil: "domcontentloaded" });

    const hld = page.locator("details").filter({ hasText: "Requirements" }).first();
    await expect(hld).toHaveAttribute("open", "");

    const lld = page.locator("article").filter({ hasText: "LLD answer builder" }).locator("details");
    await expect(lld).not.toHaveAttribute("open", "");
    await lld.getByText("View framework").click();
    await expect(lld).toHaveAttribute("open", "");
  });

  test("today cockpit visual baseline remains stable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/today", { waitUntil: "networkidle" });

    await expect(page).toHaveScreenshot("phase-57-mobile-today.png", {
      fullPage: false,
      maxDiffPixelRatio: 0.03
    });
  });
});
