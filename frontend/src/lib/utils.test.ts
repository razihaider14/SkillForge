import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins plain class strings", () => {
    expect(cn("flex", "items-center")).toBe("flex items-center");
  });

  it("drops falsy values", () => {
    expect(cn("flex", false && "hidden", undefined, null, "gap-2")).toBe(
      "flex gap-2",
    );
  });

  it("resolves conflicting Tailwind utilities in favor of the later one", () => {
    // This is the whole reason cn() exists instead of a plain template
    // string: components need to let callers override a default className
    // (e.g. <Button className="p-4" />) without both classes surviving.
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("supports the conditional-object form", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active");
  });
});
