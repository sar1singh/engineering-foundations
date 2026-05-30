import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ExplainBackForm } from "@/components/persistence/ExplainBackForm";
import { MockEvaluationForm } from "@/components/persistence/MockEvaluationForm";
import { ResetProgressForm } from "@/components/persistence/ResetProgressForm";

describe("persistence form interactions", () => {
  it("allows users to type an explain-back answer", async () => {
    const user = userEvent.setup();

    render(<ExplainBackForm topicId="js-fundamentals" />);

    const textarea = screen.getByPlaceholderText("Write your explanation in your own words.");
    await user.type(textarea, "Closures keep lexical environment references.");

    expect(textarea).toHaveValue("Closures keep lexical environment references.");
    expect(screen.getByRole("button", { name: "Save explain-back" })).toBeEnabled();
  });

  it("allows users to type a mock evaluation note", async () => {
    const user = userEvent.setup();

    render(<MockEvaluationForm taskId="task-js-fundamentals-core" topicId="js-fundamentals" />);

    const textarea = screen.getByPlaceholderText("Capture a short self-review for this task.");
    await user.type(textarea, "Solution handles the core closure case.");

    expect(textarea).toHaveValue("Solution handles the core closure case.");
    expect(screen.getByRole("button", { name: "Save mock evaluation" })).toBeEnabled();
  });

  it("renders reset progress as a secondary action", () => {
    render(<ResetProgressForm />);

    expect(screen.getByRole("button", { name: "Reset local progress" })).toBeEnabled();
  });
});
