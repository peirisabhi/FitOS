import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders its children and responds to clicks", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Save changes</Button>);

    const button = screen.getByRole("button", { name: "Save changes" });
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button onClick={onClick} disabled>
        Save changes
      </Button>,
    );

    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies the destructive variant's styling hook", () => {
    render(<Button variant="destructive">Remove</Button>);
    expect(screen.getByRole("button", { name: "Remove" })).toHaveClass("bg-destructive");
  });
});
