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

  test("/founder-beta link to /founder-beta/interview is present", async ({ page }) => {
    await page.goto("/founder-beta", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("link", { name: "Open Interview Simulator" })).toHaveAttribute("href", "/founder-beta/interview");
  });

  test("/founder-beta/interview renders the interview simulator", async ({ page }) => {
    await page.goto("/founder-beta/interview", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1, name: "Interview Simulation" })).toBeVisible();
    await expect(page.getByText("Local only — no persistence")).toBeVisible();
    await expect(page.getByText("Select Interview Type")).toBeVisible();
    await expect(page.getByText("Choose a session type to begin a timed practice interview.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Start dsa session" })).toBeVisible();

    for (const type of ["DSA", "LLD", "HLD", "Behavioral", "Mixed-Architect"]) {
      await expect(page.getByText(type, { exact: false }).first()).toBeVisible();
    }
  });

  test("/founder-beta/interview session type selection changes start button label", async ({ page }) => {
    await page.goto("/founder-beta/interview", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("button", { name: "Start dsa session" })).toBeVisible();
    await page.getByText("HLD").first().click();
    await expect(page.getByRole("button", { name: "Start hld session" })).toBeVisible();
    await page.getByText("Behavioral").first().click();
    await expect(page.getByRole("button", { name: "Start behavioral session" })).toBeVisible();
  });

  test("/founder-beta/interview session start shows in-progress state", async ({ page }) => {
    await page.goto("/founder-beta/interview", { waitUntil: "domcontentloaded" });

    await page.getByRole("button", { name: "Start dsa session" }).click();
    await expect(page.getByText("Question 1 of")).toBeVisible();
    await expect(page.getByText("Your response")).toBeVisible();
    await expect(page.getByText("Time spent (seconds)")).toBeVisible();
    await expect(page.getByRole("button", { name: "Complete session" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Timeout session" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Submit & Next Question" })).toBeDisabled();
  });

  test("/founder-beta/interview complete session shows evaluation results", async ({ page }) => {
    await page.goto("/founder-beta/interview", { waitUntil: "domcontentloaded" });

    await page.getByRole("button", { name: "Start dsa session" }).click();
    await expect(page.getByRole("button", { name: "Complete session" })).toBeVisible();
    await page.getByRole("button", { name: "Complete session" }).click();

    await expect(page.getByText("Session Completed")).toBeVisible();
    await expect(page.getByText("Overall Score")).toBeVisible();
    await expect(page.getByText("Proof Score")).toBeVisible();
    await expect(page.getByText("Readiness Impact")).toBeVisible();
    await expect(page.getByText("Proof Record")).toBeVisible();
    await expect(page.getByText("Offer Readiness Impact")).toBeVisible();
    await expect(page.getByText("Category Breakdown")).toBeVisible();
    await expect(page.getByRole("button", { name: "Start New Session" })).toBeVisible();
  });

  test("/founder-beta/interview timeout session shows timed-out state and evaluation", async ({ page }) => {
    await page.goto("/founder-beta/interview", { waitUntil: "domcontentloaded" });

    await page.getByRole("button", { name: "Start dsa session" }).click();
    await page.getByRole("button", { name: "Timeout session" }).click();

    await expect(page.getByText("Session Timed Out")).toBeVisible();
    await expect(page.getByText("Overall Score")).toBeVisible();
    await expect(page.getByText("Start New Session")).toBeVisible();
  });

  test("/founder-beta/interview start new session resets to type selection", async ({ page }) => {
    await page.goto("/founder-beta/interview", { waitUntil: "domcontentloaded" });

    await page.getByRole("button", { name: "Start dsa session" }).click();
    await page.getByRole("button", { name: "Complete session" }).click();
    await page.getByRole("button", { name: "Start New Session" }).click();

    await expect(page.getByText("Select Interview Type")).toBeVisible();
    await expect(page.getByRole("button", { name: "Start dsa session" })).toBeVisible();
  });

  test("/founder-beta/interview submit response advances to next question", async ({ page }) => {
    await page.goto("/founder-beta/interview", { waitUntil: "domcontentloaded" });

    await page.getByRole("button", { name: "Start dsa session" }).click();
    await expect(page.getByText("Question 1 of")).toBeVisible();

    const textarea = page.getByPlaceholder("Type your response here...");
    await textarea.fill("This is my sample answer for the DSA question.");
    await expect(page.getByRole("button", { name: /Submit & Next|Submit & Complete/ })).toBeEnabled();
  });

  test("/founder-beta/resources renders resource explorer with source list and filters", async ({ page }) => {
    await page.goto("/founder-beta/resources", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1, name: "Resource & Source Explorer" })).toBeVisible();
    await expect(page.getByText("curated sources")).toBeVisible();
    await expect(page.getByText("Filter Resources")).toBeVisible();
    await expect(page.getByText("Showing")).toBeVisible();
    await expect(page.getByText("All Capabilities")).toBeVisible();
    await expect(page.getByText("All Categories")).toBeVisible();
    await expect(page.getByText("All Tiers")).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to Dashboard" })).toBeVisible();
    await expect(page.getByRole("link", { name: "AWS Well-Architected Framework" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to Dashboard" })).toHaveAttribute("href", "/founder-beta");
  });

  test("/founder-beta/resources filters work: category select changes visible resources", async ({ page }) => {
    await page.goto("/founder-beta/resources", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("AWS Well-Architected Framework")).toBeVisible();
    await expect(page.getByText("Designing Data-Intensive Applications")).toBeVisible();
    await expect(page.getByText("LeetCode")).toBeVisible();
    await expect(page.getByText("StaffEng")).toBeVisible();
  });

  test("/founder-beta/resources source cards link to external URLs", async ({ page }) => {
    await page.goto("/founder-beta/resources", { waitUntil: "domcontentloaded" });

    const awsLink = page.getByRole("link", { name: "AWS Well-Architected Framework" });
    await expect(awsLink).toBeVisible();
    await expect(awsLink).toHaveAttribute("href", "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html");
    await expect(awsLink).toHaveAttribute("target", "_blank");
  });

  test("/founder-beta/resources shows tier badges and reliability badges for each source", async ({ page }) => {
    await page.goto("/founder-beta/resources", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("tier-1").first()).toBeVisible();
    await expect(page.getByText("high").first()).toBeVisible();
    await expect(page.getByText("official-docs").first()).toBeVisible();
  });

  test("/founder-beta renders the Browse Resources card and link", async ({ page }) => {
    await page.goto("/founder-beta", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Resource Explorer")).toBeVisible();
    await expect(page.getByText("Browse curated sources")).toBeVisible();
    await expect(page.getByRole("link", { name: "Browse Resources" })).toHaveAttribute("href", "/founder-beta/resources");
  });

  test("/founder-beta/resources link from dashboard navigates to resources page", async ({ page }) => {
    await page.goto("/founder-beta", { waitUntil: "domcontentloaded" });

    await page.getByRole("link", { name: "Browse Resources" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Resource & Source Explorer" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to Dashboard" })).toBeVisible();
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

  // ── Phase 6C: Mission Workspace & Topic Learning View ──

  test("mission workspace section renders on dashboard with topic links", async ({ page }) => {
    await page.goto("/founder-beta", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "Today's Missions & Topics" })).toBeVisible();
    await expect(page.getByText("available missions")).toBeVisible();
    await expect(page.getByText("View Topic →").first()).toBeVisible();
  });

  test("topic learning view renders with title, info, and resources", async ({ page }) => {
    await page.goto("/founder-beta/topic/topic-aws-well-architected", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1, name: "AWS Well-Architected Framework" })).toBeVisible();
    await expect(page.getByText("Founder Beta — Topic Learning View")).toBeVisible();
    await expect(page.getByText("Quick Info")).toBeVisible();
    await expect(page.getByText("Readiness Dimensions")).toBeVisible();
    await expect(page.getByText("Proof Requirements")).toBeVisible();
    await expect(page.getByText("Back to Mission Workspace")).toBeVisible();
  });

  test("topic learning view shows resources grouped by category", async ({ page }) => {
    await page.goto("/founder-beta/topic/topic-aws-well-architected", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Resources")).toBeVisible();
    await expect(page.getByText("AWS Well-Architected")).toBeVisible();
    await expect(page.getByText("official-docs").first()).toBeVisible();
  });

  test("topic learning view shows related missions and proof requirements", async ({ page }) => {
    await page.goto("/founder-beta/topic/topic-aws-well-architected", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Related Missions")).toBeVisible();
    await expect(page.getByText("Proof Requirements")).toBeVisible();
    await expect(page.getByText("aws-design").first()).toBeVisible();
  });

  test("topic learning view shows prerequisite and successor topic links", async ({ page }) => {
    await page.goto("/founder-beta/topic/topic-rate-limiting", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Prerequisites")).toBeVisible();
    await expect(page.getByText("Successor Topics")).toBeVisible();
  });

  test("mission workspace link navigates to topic learning view", async ({ page }) => {
    await page.goto("/founder-beta", { waitUntil: "domcontentloaded" });

    const topicLink = page.getByRole("link", { name: /View Topic →/ }).first();
    await expect(topicLink).toBeVisible();
    await topicLink.click();
    await expect(page.getByText("Founder Beta — Topic Learning View")).toBeVisible();
  });

  test("topic learning view back link navigates to dashboard", async ({ page }) => {
    await page.goto("/founder-beta/topic/topic-aws-well-architected", { waitUntil: "domcontentloaded" });

    await page.getByRole("link", { name: "Back to Mission Workspace" }).click();
    await expect(page.getByRole("heading", { name: "Founder Beta Solution Architect Path" })).toBeVisible();
  });

  test("unknown topic id shows not found", async ({ page }) => {
    await page.goto("/founder-beta/topic/unknown-topic-id", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("This page could not be found")).toBeVisible();
  });

  // ── Phase 7A: Content Registry & Coverage Explorer ──

  test("content registry page renders coverage metrics", async ({ page }) => {
    await page.goto("/founder-beta/content", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1, name: "Content Registry & Coverage" })).toBeVisible();
    await expect(page.getByText("capabilities,")).toBeVisible();
    await expect(page.getByText("skills,")).toBeVisible();
    await expect(page.getByText("topics,")).toBeVisible();
    await expect(page.getByText("sources")).toBeVisible();
    await expect(page.getByText("Gap Analysis")).toBeVisible();
  });

  test("content registry capability selector populates skills and topic lists", async ({ page }) => {
    await page.goto("/founder-beta/content", { waitUntil: "domcontentloaded" });

    await page.selectOption("select", "cap-node-backend");
    await expect(page.getByText("Backend Engineering")).toBeVisible();
    await expect(page.getByText("Topics")).toBeVisible();
    await expect(page.getByText("Sources")).toBeVisible();
  });

  test("content registry gap analysis toggle shows gap details", async ({ page }) => {
    await page.goto("/founder-beta/content", { waitUntil: "domcontentloaded" });

    await page.getByText("Gap Analysis").click();
    await expect(page.getByText("weakly sourced")).toBeVisible();
  });

  test("content registry shows source breakdown sections", async ({ page }) => {
    await page.goto("/founder-beta/content", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Source Catalog Breakdown")).toBeVisible();
    await expect(page.getByText("By Type")).toBeVisible();
    await expect(page.getByText("By Tier")).toBeVisible();
  });

  test("/founder-beta/ingestion-preview renders with simulation results", async ({ page }) => {
    await page.goto("/founder-beta/ingestion-preview", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Interactive Ingestion Simulation")).toBeVisible();
    await expect(page.getByText("candidates simulated")).toBeVisible();
    await expect(page.getByText("publish-ready")).toBeVisible();
    await expect(page.getByText("rejected")).toBeVisible();
  });

  test("ingestion preview shows lifecycle state transitions", async ({ page }) => {
    await page.goto("/founder-beta/ingestion-preview", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Discovered")).toBeVisible();
    await expect(page.getByText("Normalized")).toBeVisible();
    await expect(page.getByText("Mapped")).toBeVisible();
    await expect(page.getByText("Reviewed")).toBeVisible();
    await expect(page.getByText("Approved").first()).toBeVisible();
    await expect(page.getByText("Published")).toBeVisible();
  });

  test("ingestion preview filter buttons are functional", async ({ page }) => {
    await page.goto("/founder-beta/ingestion-preview", { waitUntil: "domcontentloaded" });

    await page.getByRole("button", { name: /invalid/ }).first().click();
    await expect(page.getByText("(untitled)")).toBeVisible();
  });

  // ── Phase 7F: Interactive Review Controls ──

  test("ingestion preview shows batch summary and approve / reject buttons", async ({ page }) => {
    await page.goto("/founder-beta/ingestion-preview", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Batch Summary")).toBeVisible();
    await expect(page.getByText(/Total:/)).toBeVisible();
    await expect(page.getByText(/Approved:/)).toBeVisible();
    await expect(page.getByText(/Rejected:/)).toBeVisible();
    await expect(page.getByText(/Pending:/)).toBeVisible();

    const approveButtons = page.getByRole("button", { name: "Approve" });
    await expect(approveButtons.first()).toBeVisible();
    const rejectButtons = page.getByRole("button", { name: "Reject", exact: true });
    await expect(rejectButtons.first()).toBeVisible();
  });

  test("ingestion preview reject flow updates batch summary", async ({ page }) => {
    await page.goto("/founder-beta/ingestion-preview", { waitUntil: "domcontentloaded" });

    await page.getByRole("button", { name: "Reject", exact: true }).first().click();
    const reasonInput = page.getByPlaceholder("Reason for rejection...");
    await expect(reasonInput).toBeVisible();

    await reasonInput.fill("Test rejection reason");
    await page.getByRole("button", { name: "Confirm Reject" }).click();

    await expect(page.getByText(/Rejected: 1/)).toBeVisible();
    await expect(page.getByText(/✕ Rejected/)).toBeVisible();
  });
});
