import { describe, expect, it, vi } from "vitest";
import { axe } from "jest-axe";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProfileHeader } from "@/components/analyze/profile-header";

describe("ProfileHeader", () => {
  it("renders the username as a heading", () => {
    render(
      <ProfileHeader
        username="octocat"
        repositoryCount={8}
        deepScan={false}
        onDeepScanChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("heading", { name: "octocat" })).toBeInTheDocument();
  });

  it("renders the repository count", () => {
    render(
      <ProfileHeader
        username="octocat"
        repositoryCount={8}
        deepScan={false}
        onDeepScanChange={vi.fn()}
      />,
    );
    expect(screen.getByText("8 repositories analyzed")).toBeInTheDocument();
  });

  it("uses singular 'repository' for a count of 1", () => {
    render(
      <ProfileHeader
        username="octocat"
        repositoryCount={1}
        deepScan={false}
        onDeepScanChange={vi.fn()}
      />,
    );
    expect(screen.getByText("1 repository analyzed")).toBeInTheDocument();
  });

  it("links to the user's GitHub profile", () => {
    render(
      <ProfileHeader
        username="octocat"
        repositoryCount={8}
        deepScan={false}
        onDeepScanChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("link", { name: /view on github/i })).toHaveAttribute(
      "href",
      "https://github.com/octocat",
    );
  });

  it("renders the Deep Scan switch reflecting the current value", () => {
    render(
      <ProfileHeader
        username="octocat"
        repositoryCount={8}
        deepScan={true}
        onDeepScanChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("calls onDeepScanChange when the switch is toggled", async () => {
    const user = userEvent.setup();
    const onDeepScanChange = vi.fn();
    render(
      <ProfileHeader
        username="octocat"
        repositoryCount={8}
        deepScan={false}
        onDeepScanChange={onDeepScanChange}
      />,
    );

    await user.click(screen.getByRole("switch"));
    expect(onDeepScanChange).toHaveBeenCalledWith(true);
  });

  it("explains that Deep Scan takes longer and uses more GitHub API requests", () => {
    render(
      <ProfileHeader
        username="octocat"
        repositoryCount={8}
        deepScan={false}
        onDeepScanChange={vi.fn()}
      />,
    );
    expect(screen.getByText(/takes longer/i)).toBeInTheDocument();
    expect(screen.getByText(/more github api requests/i)).toBeInTheDocument();
  });

  it("renders actions when provided", () => {
    render(
      <ProfileHeader
        username="octocat"
        repositoryCount={8}
        deepScan={false}
        onDeepScanChange={vi.fn()}
        actions={<button type="button">View repositories</button>}
      />,
    );
    expect(
      screen.getByRole("button", { name: "View repositories" }),
    ).toBeInTheDocument();
  });

  it("hides the avatar image if it fails to load", async () => {
    render(
      <ProfileHeader
        username="octocat"
        repositoryCount={8}
        deepScan={false}
        onDeepScanChange={vi.fn()}
      />,
    );
    // alt="" (decorative) gives this an accessibility role of "presentation",
    // not "img" — query by tag directly.
    const avatar = document.querySelector("img") as HTMLImageElement;
    expect(avatar).toBeInTheDocument();

    await act(async () => {
      avatar.dispatchEvent(new Event("error"));
    });

    expect(document.querySelector("img")).not.toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = render(
        <ProfileHeader
          username="octocat"
          repositoryCount={8}
          deepScan={false}
          onDeepScanChange={vi.fn()}
          actions={<button type="button">View repositories</button>}
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
