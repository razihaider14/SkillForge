import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { useQueryClient } from "@tanstack/react-query";
import { Providers } from "@/components/providers";

function QueryClientProbe() {
  // Throws if there's no QueryClientProvider above it in the tree, so a
  // successful render is proof QueryProvider is actually wired, not just
  // present in the source.
  const queryClient = useQueryClient();
  return (
    <span data-testid="probe">
      {queryClient ? "query-client-available" : "missing"}
    </span>
  );
}

describe("Providers", () => {
  it("renders children", () => {
    render(
      <Providers>
        <p>child content</p>
      </Providers>,
    );
    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("makes a TanStack Query client available to descendants", () => {
    render(
      <Providers>
        <QueryClientProbe />
      </Providers>,
    );
    expect(screen.getByTestId("probe")).toHaveTextContent(
      "query-client-available",
    );
  });
});
