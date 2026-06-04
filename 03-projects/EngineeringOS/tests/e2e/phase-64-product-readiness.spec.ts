import { expect, test } from "@playwright/test";

test.describe("Phase 64 backend-separation UX and product readiness", () => {
  test("dashboard exposes API-backed progress and founder outcome metrics", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });

    await page.getByText("Analytics and readiness details").click();
    await expect(page.getByRole("heading", { name: "Backend separation signal" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Founder outcome metrics" })).toBeVisible();
    await expect(page.getByText("Runnable DSA patterns")).toBeVisible();
    await expect(page.getByText("AWS hands-on labs")).toBeVisible();
  });

  test("syllabus filters expose runnable practice and capstone modes", async ({ page }) => {
    await page.goto("/syllabus?content=runnable", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Master roadmap syllabus" })).toBeVisible();
    await expect(page.getByRole("link", { name: /HashMap/i }).first()).toBeVisible();

    await page.goto("/syllabus?content=capstones", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("link", { name: /HLD|LLD|Architecture|Payment|Booking/i }).first()).toBeVisible();
  });

  test("hands-on lab controls support local completion and copy affordances", async ({ page }) => {
    await page.goto("/syllabus/api-gateway", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Lambda/API Gateway hello service")).toBeVisible();
    await expect(page.getByRole("button", { name: "Mark lab complete" })).toBeVisible();
    await page.getByRole("button", { name: "Mark lab complete" }).click();
    await expect(page.getByRole("button", { name: "Lab complete" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy IaC" })).toBeVisible();
  });
});
