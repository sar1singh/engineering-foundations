import { expect, test } from "@playwright/test";

test.describe("Phase 62 syllabus gap closure UI", () => {
  test("new LLD and AI syllabus pages expose enriched solution labs", async ({ page }) => {
    await page.goto("/syllabus/workflow-engine-lld", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Workflow Engine LLD" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Solution lab and senior review notes" })).toBeVisible();
    await expect(page.getByText("API/classes: WorkflowService")).toBeVisible();

    await page.goto("/syllabus/agentic-ai-foundations", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Agentic AI Foundations" })).toBeVisible();
    await expect(page.getByText("Design a RAG assistant")).toBeVisible();
  });

  test("AWS syllabus pages expose hands-on labs and IaC sketches", async ({ page }) => {
    await page.goto("/syllabus/vpc", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "Hands-on labs and IaC sketches" })).toBeVisible();
    await expect(page.getByText("Two-AZ VPC foundation")).toBeVisible();
    await expect(page.getByText("resource \"aws_vpc\" \"main\"")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Safety notes" }).first()).toBeVisible();
  });

  test("new HLD capstones are visible to learners", async ({ page }) => {
    await page.goto("/syllabus/hld-video-streaming", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "Video Streaming HLD" })).toBeVisible();
    await expect(page.getByText("Design a video streaming platform")).toBeVisible();
    await expect(page.getByRole("heading", { name: "AWS variant" }).first()).toBeVisible();
  });
});
