import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { useDeepScan } from "@/hooks/use-deep-scan";

describe("useDeepScan", () => {
  it("defaults to false when there is no include_content param", () => {
    const { result } = renderHook(() => useDeepScan(), {
      wrapper: ({ children }) => (
        <NuqsTestingAdapter>{children}</NuqsTestingAdapter>
      ),
    });

    expect(result.current[0]).toBe(false);
  });

  it("reads true from an existing ?include_content=true URL", () => {
    const { result } = renderHook(() => useDeepScan(), {
      wrapper: ({ children }) => (
        <NuqsTestingAdapter searchParams="include_content=true">
          {children}
        </NuqsTestingAdapter>
      ),
    });

    expect(result.current[0]).toBe(true);
  });

  it("updates the URL when set to true", async () => {
    const onUrlUpdate = vi.fn();
    const { result } = renderHook(() => useDeepScan(), {
      wrapper: ({ children }) => (
        <NuqsTestingAdapter onUrlUpdate={onUrlUpdate} hasMemory>
          {children}
        </NuqsTestingAdapter>
      ),
    });

    await act(async () => {
      await result.current[1](true);
    });

    expect(onUrlUpdate).toHaveBeenCalled();
    const event = onUrlUpdate.mock.calls[0][0];
    expect(event.searchParams.get("include_content")).toBe("true");
  });

  it("reflects the update in its own return value (hasMemory)", async () => {
    const { result } = renderHook(() => useDeepScan(), {
      wrapper: ({ children }) => (
        <NuqsTestingAdapter hasMemory>{children}</NuqsTestingAdapter>
      ),
    });

    await act(async () => {
      await result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
  });
});
