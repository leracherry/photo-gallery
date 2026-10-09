import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import App from "../App";

const photos = [
  { id: 1, title: "quiet open skies" },
  { id: 2, title: "a forest moment" },
];
beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => photos }),
  );
});
describe("Collection interactions", () => {
  test("opens a lightbox, navigates with arrows, closes, and restores focus and scrolling", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText("quiet open skies");
    const link = screen.getByRole("link", {
      name: "View larger version of quiet open skies",
    });
    await user.click(link);
    expect(screen.getByRole("dialog")).toHaveAttribute("open");
    expect(document.body.style.overflow).toBe("hidden");
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("dialog")).toHaveAccessibleName("a forest moment");
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("dialog")).toHaveAccessibleName("quiet open skies");
    await user.click(screen.getByRole("button", { name: "Previous photo" }));
    expect(screen.getByRole("dialog")).toHaveAccessibleName("a forest moment");
    await user.click(screen.getByRole("button", { name: "Close photo" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(link).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });
  test("closes on native Escape cancellation and backdrop click", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText("quiet open skies");
    const link = screen.getByRole("link", {
      name: /View larger version of quiet/,
    });
    await user.click(link);
    fireEvent(screen.getByRole("dialog"), new Event("cancel"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(link);
    await user.click(screen.getByRole("dialog"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  test("navigates only within the filtered collection", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText("quiet open skies");
    await user.type(screen.getByRole("searchbox"), "quiet");
    await user.click(screen.getByRole("link", { name: /View larger version/ }));
    await user.click(screen.getByRole("button", { name: "Next photo" }));
    expect(screen.getByRole("dialog")).toHaveAccessibleName("quiet open skies");
    expect(screen.getByText(/1 \/ 1/)).toBeInTheDocument();
  });
  test("toggles the roomier grid", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText("quiet open skies");
    const button = screen.getByRole("button", { name: "Toggle spacious grid" });
    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("region", { name: "Photo gallery" })).toHaveClass(
      "spacious",
    );
  });
  test("handles failed images in the grid and lightbox", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText("quiet open skies");
    fireEvent.error(screen.getByAltText("quiet open skies"));
    expect(screen.getByText("Image unavailable")).toBeInTheDocument();
    await user.click(
      screen.getByRole("link", { name: /View larger version of quiet/ }),
    );
    fireEvent.error(screen.getByAltText("quiet open skies"));
    expect(
      screen.getByRole("link", { name: "Open the original" }),
    ).toHaveAttribute("rel", "noopener noreferrer");
    await user.click(screen.getByRole("button", { name: "Next photo" }));
    await waitFor(() =>
      expect(screen.getAllByAltText("a forest moment")).toHaveLength(2),
    );
  });
});
