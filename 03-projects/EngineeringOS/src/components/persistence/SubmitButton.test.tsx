import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SubmitButton } from "@/components/persistence/SubmitButton";

describe("SubmitButton", () => {
  it("renders enabled primary action by default", () => {
    render(
      <form>
        <SubmitButton pendingLabel="Saving...">Save</SubmitButton>
      </form>
    );

    expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();
  });

  it("supports disabled state", () => {
    render(
      <form>
        <SubmitButton disabled pendingLabel="Saving...">
          Save
        </SubmitButton>
      </form>
    );

    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });
});
