import * as React from "react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { act, render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

let mockPathname = "/analyze/octocat";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

const {
  NavigationProgressProvider,
  useNavigationProgress,
} = await import("@/components/providers/navigation-progress");

function StartButton() {
  const { start } = useNavigationProgress();
  return (
    <button type="button" onClick={start}>
      trigger start
    </button>
  );
}

beforeEach(() => {
  mockPathname = "/analyze/octocat";
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useNavigationProgress", () => {
  it("throws when used outside NavigationProgressProvider", () => {
    // Suppress the expected React error-boundary console noise for this one.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useNavigationProgress())).toThrow(
      /must be used within a NavigationProgressProvider/,
    );
    spy.mockRestore();
  });
});

describe("NavigationProgressProvider", () => {
  it("renders no progress bar initially", () => {
    render(
      <NavigationProgressProvider>
        <StartButton />
      </NavigationProgressProvider>,
    );
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("shows the progress bar after start() is called", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <NavigationProgressProvider>
        <StartButton />
      </NavigationProgressProvider>,
    );

    await user.click(screen.getByRole("button", { name: "trigger start" }));

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("increases progress over time while active, without reaching 100 on its own", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <NavigationProgressProvider>
        <StartButton />
      </NavigationProgressProvider>,
    );

    await user.click(screen.getByRole("button", { name: "trigger start" }));
    const initial = Number(screen.getByRole("progressbar").getAttribute("aria-valuenow"));

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    const later = Number(screen.getByRole("progressbar").getAttribute("aria-valuenow"));
    expect(later).toBeGreaterThan(initial);
    expect(later).toBeLessThan(100);
  });

  it("completes and removes the bar once the pathname changes", async () => {
    const user = userEvent.setup({ delay: null });
    const { rerender } = render(
      <NavigationProgressProvider>
        <StartButton />
      </NavigationProgressProvider>,
    );

    await user.click(screen.getByRole("button", { name: "trigger start" }));
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    mockPathname = "/analyze/octocat/repos";
    rerender(
      <NavigationProgressProvider>
        <StartButton />
      </NavigationProgressProvider>,
    );

    await waitFor(() =>
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100"),
    );

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("starts automatically when an internal <a> link is clicked", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <NavigationProgressProvider>
        <a href="/about">About</a>
      </NavigationProgressProvider>,
    );

    await user.click(screen.getByRole("link", { name: "About" }));

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("does not start for a same-page hash link", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <NavigationProgressProvider>
        <a href="#section">Jump</a>
      </NavigationProgressProvider>,
    );

    await user.click(screen.getByRole("link", { name: "Jump" }));

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("does not start for a link opening in a new tab", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <NavigationProgressProvider>
        <a href="/about" target="_blank" rel="noreferrer">
          About
        </a>
      </NavigationProgressProvider>,
    );

    await user.click(screen.getByRole("link", { name: "About" }));

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
