import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GuidedNextSteps } from "@/components/learning/GuidedNextSteps";

describe("GuidedNextSteps", () => {
  it("renders linked next-step cards", () => {
    render(
      <GuidedNextSteps
        steps={[
          {
            href: "/topics/javascript",
            label: "Study JavaScript",
            description: "Start with the current topic."
          }
        ]}
      />
    );

    expect(screen.getByRole("heading", { name: "Suggested next steps" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Study JavaScript/ })).toHaveAttribute("href", "/topics/javascript");
  });

  it("renders nothing when there are no steps", () => {
    const { container } = render(<GuidedNextSteps steps={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
