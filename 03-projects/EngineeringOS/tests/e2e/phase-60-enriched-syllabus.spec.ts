import { expect, test } from "@playwright/test";

test.describe("Phase 60 enriched syllabus UI", () => {
  test("Graph BFS exposes source-backed solution lab content", async ({ page }) => {
    await page.goto("/syllabus/graph-bfs", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "Solution lab and senior review notes" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Enriched coding drills" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Shortest path in a binary grid" })).toBeVisible();
    await expect(page.getByText("export function shortestPathGrid")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Source referral panel" }).first()).toBeVisible();
  });

  test("Payment HLD exposes design capstone review dimensions", async ({ page }) => {
    await page.goto("/syllabus/hld-payment-system", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "Design capstones" })).toBeVisible();
    await expect(page.getByText("Design a payment system with payment intents")).toBeVisible();
    await expect(page.getByRole("heading", { name: "AWS variant" }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Security" }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Observability" }).first()).toBeVisible();
  });
});
