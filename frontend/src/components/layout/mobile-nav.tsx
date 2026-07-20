"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const panelId = React.useId();

  return (
    <div className="sm:hidden">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X /> : <Menu />}
      </Button>

      {open && (
        <div
          id={panelId}
          className="bg-background absolute inset-x-0 top-full z-40 flex flex-col gap-1 border-b px-6 py-4"
        >
          <nav aria-label="Primary" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="hover:bg-accent rounded-md px-3 py-2 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-2 flex items-center justify-between gap-2 border-t pt-3">
            <ThemeToggle />
            <Button asChild size="sm" onClick={() => setOpen(false)}>
              <Link href="/analyze">Analyze</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
