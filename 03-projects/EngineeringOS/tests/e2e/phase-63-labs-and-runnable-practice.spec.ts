import { expect, test } from "@playwright/test";

test.describe("Phase 63 lab discovery and runnable practice UI", () => {
  test("syllabus can filter to hands-on AWS labs", async ({ page }) => {
    await page.goto("/syllabus?content=labs", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "Master roadmap syllabus" })).toBeVisible();
    await expect(page.getByRole("link", { name: "API Gateway" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Step Functions" })).toBeVisible();
    await expect(page.getByRole("link", { name: "CI/CD Blue-Green and Canary" })).toBeVisible();
  });

  test("AWS lab page exposes the new Lambda/API Gateway lab", async ({ page }) => {
    await page.goto("/syllabus/api-gateway", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "API Gateway", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Hands-on labs and IaC sketches" })).toBeVisible();
    await expect(page.getByText("Lambda/API Gateway hello service")).toBeVisible();
    await expect(page.getByText("aws_lambda_function")).toBeVisible();
  });

  test("runnable DSA practice pages expose starter code and a test harness", async ({ page }) => {
    await page.goto("/practice/runnable-hashmap-two-sum-frequency", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: /Runnable DSA:/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Test harness" })).toBeVisible();
    await expect(page.locator("pre").filter({ hasText: "console.assert" }).first()).toBeVisible();
    await expect(page.locator("pre").filter({ hasText: "visible harness passed" }).first()).toBeVisible();
  });
});
