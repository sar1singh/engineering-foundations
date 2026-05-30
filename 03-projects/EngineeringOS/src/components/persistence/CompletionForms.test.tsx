import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TaskCompletionForm } from "@/components/persistence/TaskCompletionForm";
import { TopicCompletionForm } from "@/components/persistence/TopicCompletionForm";

describe("completion forms", () => {
  it("renders topic completion action", () => {
    render(<TopicCompletionForm isComplete={false} topicId="js-fundamentals" />);

    expect(screen.getByRole("button", { name: "Mark topic complete" })).toBeEnabled();
  });

  it("disables completed topic action", () => {
    render(<TopicCompletionForm isComplete topicId="js-fundamentals" />);

    expect(screen.getByRole("button", { name: "Topic complete" })).toBeDisabled();
  });

  it("renders task completion action", () => {
    render(<TaskCompletionForm isComplete={false} taskId="task-js-fundamentals-core" />);

    expect(screen.getByRole("button", { name: "Mark task complete" })).toBeEnabled();
  });

  it("disables completed task action", () => {
    render(<TaskCompletionForm isComplete taskId="task-js-fundamentals-core" />);

    expect(screen.getByRole("button", { name: "Task complete" })).toBeDisabled();
  });
});
