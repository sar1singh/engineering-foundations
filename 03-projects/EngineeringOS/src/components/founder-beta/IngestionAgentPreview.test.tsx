import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IngestionAgentPreview } from "./IngestionAgentPreview";

describe("IngestionAgentPreview", () => {
  it("renders the heading and description", () => {
    render(<IngestionAgentPreview />);
    expect(screen.getByText("Ingestion Agent (Sub-Agent Pipeline)")).toBeInTheDocument();
    expect(screen.getByText("Pack 10F — Sub-Agent Ingestion Pipeline V1")).toBeInTheDocument();
  });

  it("renders the URL input field", () => {
    render(<IngestionAgentPreview />);
    expect(screen.getByPlaceholderText("https://example.com/article")).toBeInTheDocument();
  });

  it("renders the source type selector with default value", () => {
    render(<IngestionAgentPreview />);
    const select = screen.getByDisplayValue("official-docs");
    expect(select).toBeInTheDocument();
  });

  it("renders the Run Ingestion Agent button", () => {
    render(<IngestionAgentPreview />);
    expect(screen.getByText("Run Ingestion Agent")).toBeInTheDocument();
  });

  it("shows empty state before first run", () => {
    render(<IngestionAgentPreview />);
    expect(screen.getByText("No ingestion results yet.")).toBeInTheDocument();
  });

  it("Run button is disabled when URL is empty", () => {
    render(<IngestionAgentPreview />);
    const button = screen.getByText("Run Ingestion Agent").closest("button");
    expect(button).toBeDisabled();
  });

  it("Run button is enabled when URL is filled", async () => {
    const user = userEvent.setup();
    render(<IngestionAgentPreview />);
    const input = screen.getByPlaceholderText("https://example.com/article");
    await user.type(input, "https://example.com/test");
    const button = screen.getByText("Run Ingestion Agent").closest("button");
    expect(button).toBeEnabled();
  });

  it("shows agent result after running", async () => {
    const user = userEvent.setup();
    render(<IngestionAgentPreview />);
    const urlInput = screen.getByPlaceholderText("https://example.com/article");
    await user.type(urlInput, "https://example.com/article");
    const byInput = screen.getByPlaceholderText("e.g. sar1s");
    await user.type(byInput, "test-user");
    await user.click(screen.getByText("Run Ingestion Agent"));
    expect(screen.getByText("Ingestion Agent Result")).toBeInTheDocument();
    expect(screen.getByText("Agent trace")).toBeInTheDocument();
  });

  it("shows review queue after running", async () => {
    const user = userEvent.setup();
    render(<IngestionAgentPreview />);
    const urlInput = screen.getByPlaceholderText("https://example.com/article");
    await user.type(urlInput, "https://example.com/article");
    const byInput = screen.getByPlaceholderText("e.g. sar1s");
    await user.type(byInput, "test-user");
    await user.click(screen.getByText("Run Ingestion Agent"));
    expect(screen.getByText("Review Queue")).toBeInTheDocument();
    expect(screen.getByText(/Total:/)).toBeInTheDocument();
  });

  it("shows pipeline steps in the agent trace", async () => {
    const user = userEvent.setup();
    render(<IngestionAgentPreview />);
    const urlInput = screen.getByPlaceholderText("https://example.com/article");
    await user.type(urlInput, "https://example.com/article");
    const byInput = screen.getByPlaceholderText("e.g. sar1s");
    await user.type(byInput, "test-user");
    await user.click(screen.getByText("Run Ingestion Agent"));
    expect(screen.getByText("Fetch URL content")).toBeInTheDocument();
    expect(screen.getByText("Validate fetch output")).toBeInTheDocument();
    expect(screen.getByText("Bridge to candidate catalog")).toBeInTheDocument();
    expect(screen.getByText("Detect catalog duplicates")).toBeInTheDocument();
    expect(screen.getByText("Prepare review queue entry")).toBeInTheDocument();
  });

  it("shows gate status after running", async () => {
    const user = userEvent.setup();
    render(<IngestionAgentPreview />);
    const urlInput = screen.getByPlaceholderText("https://example.com/article");
    await user.type(urlInput, "https://example.com/article");
    const byInput = screen.getByPlaceholderText("e.g. sar1s");
    await user.type(byInput, "test-user");
    await user.click(screen.getByText("Run Ingestion Agent"));
    expect(screen.getAllByText(/Publish gate:/).length).toBeGreaterThanOrEqual(1);
  });

  it("candidate appears in review queue with pending status", async () => {
    const user = userEvent.setup();
    render(<IngestionAgentPreview />);
    const urlInput = screen.getByPlaceholderText("https://example.com/article");
    await user.type(urlInput, "https://example.com/test-url");
    const byInput = screen.getByPlaceholderText("e.g. sar1s");
    await user.type(byInput, "test-user");
    await user.click(screen.getByText("Run Ingestion Agent"));
    expect(screen.getByText("pending")).toBeInTheDocument();
  });

  it("approve button works on review queue candidate", async () => {
    const user = userEvent.setup();
    render(<IngestionAgentPreview />);
    const urlInput = screen.getByPlaceholderText("https://example.com/article");
    await user.type(urlInput, "https://example.com/approve-me");
    const byInput = screen.getByPlaceholderText("e.g. sar1s");
    await user.type(byInput, "test-user");
    await user.click(screen.getByText("Run Ingestion Agent"));
    await user.click(screen.getByText("Approve"));
    expect(screen.getByText("approved")).toBeInTheDocument();
    expect(screen.getByText(/Publish Preview/)).toBeInTheDocument();
  });

  it("reject button works with reason input", async () => {
    const user = userEvent.setup();
    render(<IngestionAgentPreview />);
    const urlInput = screen.getByPlaceholderText("https://example.com/article");
    await user.type(urlInput, "https://example.com/reject-me");
    const byInput = screen.getByPlaceholderText("e.g. sar1s");
    await user.type(byInput, "test-user");
    await user.click(screen.getByText("Run Ingestion Agent"));
    const reasonInput = screen.getByPlaceholderText("Reason...");
    await user.type(reasonInput, "Low quality");
    await user.click(screen.getByText("Reject"));
    expect(screen.getByText("rejected")).toBeInTheDocument();
    expect(screen.getByText(/Low quality/)).toBeInTheDocument();
  });

  it("reset button returns candidate to pending", async () => {
    const user = userEvent.setup();
    render(<IngestionAgentPreview />);
    const urlInput = screen.getByPlaceholderText("https://example.com/article");
    await user.type(urlInput, "https://example.com/reset-me");
    const byInput = screen.getByPlaceholderText("e.g. sar1s");
    await user.type(byInput, "test-user");
    await user.click(screen.getByText("Run Ingestion Agent"));
    await user.click(screen.getByText("Approve"));
    expect(screen.getByText("approved")).toBeInTheDocument();
    await user.click(screen.getByText("Reset"));
    expect(screen.getByText("pending")).toBeInTheDocument();
  });
});
