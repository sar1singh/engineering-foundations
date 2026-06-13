import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GapDrivenIngestionPreview } from "./GapDrivenIngestionPreview";

describe("GapDrivenIngestionPreview", () => {
  it("renders the heading", () => {
    render(<GapDrivenIngestionPreview />);
    expect(screen.getByText("Gap-Driven Ingestion Engine")).toBeInTheDocument();
  });

  it("renders the no-write warning", () => {
    render(<GapDrivenIngestionPreview />);
    expect(screen.getByText("No autonomous graph writes")).toBeInTheDocument();
  });

  it("renders sub-agent trace section", () => {
    render(<GapDrivenIngestionPreview />);
    expect(screen.getByText("Sub-Agent Traces")).toBeInTheDocument();
  });

  it("renders summary section", () => {
    render(<GapDrivenIngestionPreview />);
    expect(screen.getByText("Summary")).toBeInTheDocument();
  });

  it("renders total gaps stat", () => {
    render(<GapDrivenIngestionPreview />);
    expect(screen.getByText("Total gaps")).toBeInTheDocument();
  });

  it("renders all 6 sub-agent names", () => {
    render(<GapDrivenIngestionPreview />);
    expect(screen.getByText("Coverage Gap Agent")).toBeInTheDocument();
    expect(screen.getByText("Source Diversity Agent")).toBeInTheDocument();
    expect(screen.getByText("Proof Coverage Agent")).toBeInTheDocument();
    expect(screen.getByText("Mission Coverage Agent")).toBeInTheDocument();
    expect(screen.getByText("Interview Coverage Agent")).toBeInTheDocument();
    expect(screen.getByText("Readiness Coverage Agent")).toBeInTheDocument();
  });

  it("renders uncovered gaps section if uncovered gaps exist", () => {
    render(<GapDrivenIngestionPreview />);
    const sections = screen.getAllByText(/Uncovered Gaps/i);
    expect(sections.length).toBeGreaterThan(0);
  });

  it("renders the preview-only warning badge", () => {
    render(<GapDrivenIngestionPreview />);
    expect(screen.getByText(/No write.*preview only/i)).toBeInTheDocument();
  });

  it("renders gap count badge with number", () => {
    render(<GapDrivenIngestionPreview />);
    const badge = screen.getByText(/gaps.*candidates/i);
    expect(badge).toBeInTheDocument();
  });

  it("renders description paragraph", () => {
    render(<GapDrivenIngestionPreview />);
    expect(
      screen.getByText(/Agents detect syllabus gaps, rank them, and recommend content to ingest next/)
    ).toBeInTheDocument();
  });
});
