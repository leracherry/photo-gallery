import { render, screen, waitFor } from "@testing-library/react";
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

describe("Gallery data and search", () => {
  test("shows a loading state, then a single main landmark and collection", async () => {
    render(<App />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading photos");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Photo Gallery",
    );
    expect(await screen.findByText("quiet open skies")).toBeInTheDocument();
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.getByText("2 photographs")).toBeInTheDocument();
  });
  test("searches case-insensitively, trims whitespace, highlights, and clears", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText("quiet open skies");
    await user.type(screen.getByRole("searchbox"), " QUIET ");
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("quiet").tagName).toBe("MARK");
    expect(screen.getByText("1 photograph / 2")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.getByRole("searchbox")).toHaveValue("");
  });
  test("treats regex punctuation as literal search text", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText("quiet open skies");
    await user.type(screen.getByRole("searchbox"), "[[");
    expect(
      screen.getByText("No photos found matching “[”"),
    ).toBeInTheDocument();
    expect(screen.queryAllByRole("article")).toHaveLength(0);
  });
  test.each([
    ["network", () => Promise.reject(new Error("offline"))],
    ["HTTP", () => Promise.resolve({ ok: false, status: 500 })],
    [
      "invalid data",
      () =>
        Promise.resolve({
          ok: true,
          json: async () => ({ message: "invalid" }),
        }),
    ],
    [
      "invalid photo",
      () => Promise.resolve({ ok: true, json: async () => [{ id: 1 }] }),
    ],
  ])("shows a retryable error after a %s failure", async (_, response) => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    fetch.mockImplementationOnce(response);
    const user = userEvent.setup();
    render(<App />);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "The collection couldn’t load",
    );
    await user.click(screen.getByRole("button", { name: /Try again/ }));
    expect(await screen.findByText("quiet open skies")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
  test("shows a useful empty collection state", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    render(<App />);
    expect(
      await screen.findByText("No photographs just yet"),
    ).toBeInTheDocument();
  });
  test("ignores fetch completion after unmount", async () => {
    let resolve;
    fetch.mockReturnValueOnce(
      new Promise((done) => {
        resolve = done;
      }),
    );
    const { unmount } = render(<App />);
    unmount();
    resolve({ ok: true, json: async () => photos });
    await waitFor(() =>
      expect(screen.queryByRole("main")).not.toBeInTheDocument(),
    );
  });
});
