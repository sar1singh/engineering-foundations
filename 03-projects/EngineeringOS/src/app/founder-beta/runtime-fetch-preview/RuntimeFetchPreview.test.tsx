import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import RuntimeFetchPreviewPage from "./page";

describe("RuntimeFetchPreviewPage", () => {
  beforeEach(() => {
    // ensure a clean rerender each time
  });

  it("renders heading and description", () => {
    render(<RuntimeFetchPreviewPage />);
    expect(screen.getByText("Manual URL Runtime Fetch Preview")).toBeInTheDocument();
    expect(screen.getByText(/Dry-run fetch over a manually submitted URL/)).toBeInTheDocument();
  });

  it("renders URL input, Submitted By, Source Type, and consent checkbox", () => {
    render(<RuntimeFetchPreviewPage />);
    expect(screen.getByPlaceholderText("https://docs.example.com/guide")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("sarwan")).toBeInTheDocument();
    expect(screen.getByText("Source Type")).toBeInTheDocument();
    expect(screen.getByLabelText(/I confirm that the submitted URL is publicly accessible/)).toBeInTheDocument();
  });

  it("disables Run Dry-Run Fetch button when URL is empty", () => {
    render(<RuntimeFetchPreviewPage />);
    const btn = screen.getByText("Run Dry-Run Fetch");
    expect(btn).toBeDisabled();
  });

  it("enables Run button when URL, submittedBy, and consent are filled", () => {
    render(<RuntimeFetchPreviewPage />);
    fireEvent.change(screen.getByPlaceholderText("https://docs.example.com/guide"), {
      target: { value: "https://example.com/doc" },
    });
    fireEvent.change(screen.getByPlaceholderText("sarwan"), {
      target: { value: "sarwan" },
    });
    fireEvent.click(screen.getByLabelText(/I confirm that the submitted URL is publicly accessible/));
    expect(screen.getByText("Run Dry-Run Fetch")).not.toBeDisabled();
  });

  it("shows validation errors for an invalid URL", () => {
    render(<RuntimeFetchPreviewPage />);
    fireEvent.change(screen.getByPlaceholderText("https://docs.example.com/guide"), {
      target: { value: "not-a-url" },
    });
    fireEvent.change(screen.getByPlaceholderText("sarwan"), {
      target: { value: "sarwan" },
    });
    fireEvent.click(screen.getByLabelText(/I confirm that the submitted URL is publicly accessible/));
    fireEvent.click(screen.getByText("Run Dry-Run Fetch"));
    expect(screen.getByText("✕ INVALID")).toBeInTheDocument();
    expect(screen.getByText(/URL protocol not allowed/)).toBeInTheDocument();
  });

  it("shows validation errors for blocked protocol", () => {
    render(<RuntimeFetchPreviewPage />);
    fireEvent.change(screen.getByPlaceholderText("https://docs.example.com/guide"), {
      target: { value: "ftp://example.com/doc" },
    });
    fireEvent.change(screen.getByPlaceholderText("sarwan"), {
      target: { value: "sarwan" },
    });
    fireEvent.click(screen.getByLabelText(/I confirm that the submitted URL is publicly accessible/));
    fireEvent.click(screen.getByText("Run Dry-Run Fetch"));
    expect(screen.getByText("✕ INVALID")).toBeInTheDocument();
    expect(screen.getByText(/URL protocol not allowed/)).toBeInTheDocument();
  });

  it("shows validation errors for blocked domain (localhost)", () => {
    render(<RuntimeFetchPreviewPage />);
    fireEvent.change(screen.getByPlaceholderText("https://docs.example.com/guide"), {
      target: { value: "https://localhost:3000/doc" },
    });
    fireEvent.change(screen.getByPlaceholderText("sarwan"), {
      target: { value: "sarwan" },
    });
    fireEvent.click(screen.getByLabelText(/I confirm that the submitted URL is publicly accessible/));
    fireEvent.click(screen.getByText("Run Dry-Run Fetch"));
    expect(screen.getByText("✕ INVALID")).toBeInTheDocument();
    expect(screen.getAllByText(/private network/).length).toBeGreaterThanOrEqual(1);
  });

  it("shows mocked result for valid URL", () => {
    render(<RuntimeFetchPreviewPage />);
    fireEvent.change(screen.getByPlaceholderText("https://docs.example.com/guide"), {
      target: { value: "https://example.com/doc" },
    });
    fireEvent.change(screen.getByPlaceholderText("sarwan"), {
      target: { value: "sarwan" },
    });
    fireEvent.click(screen.getByLabelText(/I confirm that the submitted URL is publicly accessible/));
    fireEvent.click(screen.getByText("Run Dry-Run Fetch"));
    expect(screen.getByText("✓ VALID")).toBeInTheDocument();
    expect(screen.getByText("Mocked Fetch Result")).toBeInTheDocument();
    expect(screen.getAllByText(/founder-beta-disc-agent/).length).toBeGreaterThanOrEqual(1);
  });

  it("shows Send to Manual Review Preview after valid dry-run", () => {
    render(<RuntimeFetchPreviewPage />);
    fireEvent.change(screen.getByPlaceholderText("https://docs.example.com/guide"), {
      target: { value: "https://example.com/doc" },
    });
    fireEvent.change(screen.getByPlaceholderText("sarwan"), {
      target: { value: "sarwan" },
    });
    fireEvent.click(screen.getByLabelText(/I confirm that the submitted URL is publicly accessible/));
    fireEvent.click(screen.getByText("Run Dry-Run Fetch"));
    expect(screen.getByText("Send to Manual Review Preview")).toBeInTheDocument();
  });

  it("adds candidate to review queue when Send is clicked", () => {
    render(<RuntimeFetchPreviewPage />);
    fireEvent.change(screen.getByPlaceholderText("https://docs.example.com/guide"), {
      target: { value: "https://example.com/doc" },
    });
    fireEvent.change(screen.getByPlaceholderText("sarwan"), {
      target: { value: "sarwan" },
    });
    fireEvent.click(screen.getByLabelText(/I confirm that the submitted URL is publicly accessible/));
    fireEvent.click(screen.getByText("Run Dry-Run Fetch"));
    fireEvent.click(screen.getByText("Send to Manual Review Preview"));
    expect(screen.getByText(/Review Queue \(1\)/)).toBeInTheDocument();
    expect(screen.getByText("pending")).toBeInTheDocument();
  });

  it("approve button changes state to approved", () => {
    render(<RuntimeFetchPreviewPage />);
    fireEvent.change(screen.getByPlaceholderText("https://docs.example.com/guide"), {
      target: { value: "https://example.com/doc" },
    });
    fireEvent.change(screen.getByPlaceholderText("sarwan"), {
      target: { value: "sarwan" },
    });
    fireEvent.click(screen.getByLabelText(/I confirm that the submitted URL is publicly accessible/));
    fireEvent.click(screen.getByText("Run Dry-Run Fetch"));
    fireEvent.click(screen.getByText("Send to Manual Review Preview"));
    fireEvent.click(screen.getByText("Approve"));
    expect(screen.getByText("approved")).toBeInTheDocument();
    expect(screen.getByText(/Publish Preview/)).toBeInTheDocument();
  });

  it("reject button changes state to rejected", () => {
    render(<RuntimeFetchPreviewPage />);
    fireEvent.change(screen.getByPlaceholderText("https://docs.example.com/guide"), {
      target: { value: "https://example.com/doc" },
    });
    fireEvent.change(screen.getByPlaceholderText("sarwan"), {
      target: { value: "sarwan" },
    });
    fireEvent.click(screen.getByLabelText(/I confirm that the submitted URL is publicly accessible/));
    fireEvent.click(screen.getByText("Run Dry-Run Fetch"));
    fireEvent.click(screen.getByText("Send to Manual Review Preview"));
    fireEvent.click(screen.getByText("Reject"));
    expect(screen.getByText("rejected")).toBeInTheDocument();
  });

  it("deduplicates when same URL is sent to review twice", () => {
    render(<RuntimeFetchPreviewPage />);
    const urlInput = screen.getByPlaceholderText("https://docs.example.com/guide");
    const nameInput = screen.getByPlaceholderText("sarwan");
    const consent = screen.getByLabelText(/I confirm that the submitted URL is publicly accessible/);
    fireEvent.change(urlInput, { target: { value: "https://example.com/doc" } });
    fireEvent.change(nameInput, { target: { value: "sarwan" } });
    fireEvent.click(consent);
    fireEvent.click(screen.getByText("Run Dry-Run Fetch"));
    fireEvent.click(screen.getByText("Send to Manual Review Preview"));
    // Send again without changing URL
    fireEvent.click(screen.getByText("Run Dry-Run Fetch"));
    fireEvent.click(screen.getByText("Send to Manual Review Preview"));
    expect(screen.getByText(/Review Queue \(1\)/)).toBeInTheDocument();
    expect(screen.queryByText(/Review Queue \(2\)/)).not.toBeInTheDocument();
  });

  it("shows queue status indicators with correct counts", () => {
    render(<RuntimeFetchPreviewPage />);
    const urlInput = screen.getByPlaceholderText("https://docs.example.com/guide");
    const nameInput = screen.getByPlaceholderText("sarwan");
    const consent = screen.getByLabelText(/I confirm that the submitted URL is publicly accessible/);
    fireEvent.change(urlInput, { target: { value: "https://example.com/doc" } });
    fireEvent.change(nameInput, { target: { value: "sarwan" } });
    fireEvent.click(consent);
    fireEvent.click(screen.getByText("Run Dry-Run Fetch"));
    fireEvent.click(screen.getByText("Send to Manual Review Preview"));
    // After send-to-review: 1 pending, 0 approved, 0 rejected
    expect(screen.getByText(/1 pending/)).toBeInTheDocument();
    expect(screen.queryAllByText(/0 approved/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/0 rejected/)).toBeInTheDocument();
    // Approve it
    fireEvent.click(screen.getByText("Approve"));
    expect(screen.getByText(/0 pending/)).toBeInTheDocument();
    expect(screen.queryAllByText(/1 approved/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/0 rejected/)).toBeInTheDocument();
  });

  it("batch Approve All Pending approves all sent-to-review items", () => {
    render(<RuntimeFetchPreviewPage />);
    const urlInput = screen.getByPlaceholderText("https://docs.example.com/guide");
    const nameInput = screen.getByPlaceholderText("sarwan");
    const consent = screen.getByLabelText(/I confirm that the submitted URL is publicly accessible/);
    fireEvent.change(urlInput, { target: { value: "https://example.com/doc1" } });
    fireEvent.change(nameInput, { target: { value: "sarwan" } });
    fireEvent.click(consent);
    fireEvent.click(screen.getByText("Run Dry-Run Fetch"));
    fireEvent.click(screen.getByText("Send to Manual Review Preview"));
    // Second candidate
    fireEvent.change(urlInput, { target: { value: "https://example.com/doc2" } });
    fireEvent.click(screen.getByText("Run Dry-Run Fetch"));
    fireEvent.click(screen.getByText("Send to Manual Review Preview"));
    expect(screen.getByText(/Review Queue \(2\)/)).toBeInTheDocument();
    expect(screen.getByText(/2 pending/)).toBeInTheDocument();
    fireEvent.click(screen.getByText("Approve All Pending"));
    expect(screen.queryAllByText(/2 approved/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/0 pending/)).toBeInTheDocument();
  });

  it("batch Reject All Pending rejects all sent-to-review items", () => {
    render(<RuntimeFetchPreviewPage />);
    const urlInput = screen.getByPlaceholderText("https://docs.example.com/guide");
    const nameInput = screen.getByPlaceholderText("sarwan");
    const consent = screen.getByLabelText(/I confirm that the submitted URL is publicly accessible/);
    fireEvent.change(urlInput, { target: { value: "https://example.com/doc1" } });
    fireEvent.change(nameInput, { target: { value: "sarwan" } });
    fireEvent.click(consent);
    fireEvent.click(screen.getByText("Run Dry-Run Fetch"));
    fireEvent.click(screen.getByText("Send to Manual Review Preview"));
    fireEvent.change(urlInput, { target: { value: "https://example.com/doc2" } });
    fireEvent.click(screen.getByText("Run Dry-Run Fetch"));
    fireEvent.click(screen.getByText("Send to Manual Review Preview"));
    expect(screen.getByText(/Review Queue \(2\)/)).toBeInTheDocument();
    fireEvent.click(screen.getByText("Reject All Pending"));
    expect(screen.getByText(/2 rejected/)).toBeInTheDocument();
    expect(screen.getByText(/0 pending/)).toBeInTheDocument();
  });

  it("shows session-only notice", () => {
    render(<RuntimeFetchPreviewPage />);
    expect(screen.getByText("Session-Only State")).toBeInTheDocument();
    expect(screen.getByText(/All data on this page is held in React useState/)).toBeInTheDocument();
  });

  it("shows Human approval required badge (in how-it-works card)", () => {
    render(<RuntimeFetchPreviewPage />);
    expect(screen.getByText(/Human approval required/)).toBeInTheDocument();
  });

  it("No autonomous publishing badge is present", () => {
    render(<RuntimeFetchPreviewPage />);
    expect(screen.getByText(/No autonomous publishing/)).toBeInTheDocument();
  });
});
