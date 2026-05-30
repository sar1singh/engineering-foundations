import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ActionMessage } from "@/components/persistence/ActionMessage";

describe("ActionMessage", () => {
  it("renders no message for idle state", () => {
    const { container } = render(<ActionMessage state={{ status: "idle", message: "" }} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders accessible success feedback", () => {
    render(<ActionMessage state={{ status: "success", message: "Saved." }} />);

    expect(screen.getByText("Saved.")).toHaveAttribute("aria-live", "polite");
  });

  it("renders accessible error feedback", () => {
    render(<ActionMessage state={{ status: "error", message: "Could not save." }} />);

    expect(screen.getByText("Could not save.")).toHaveClass("text-red-700");
  });
});
