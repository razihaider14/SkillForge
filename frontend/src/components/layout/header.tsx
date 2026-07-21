import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";

export function Header() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/75 sticky top-0 z-30 border-b backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Portlio
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 sm:flex">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground text-sm font-medium"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-muted-foreground hover:text-foreground text-sm font-medium"
          >
            About
          </Link>
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <ThemeToggle />
          <Button asChild size="sm">
            <Link href="/analyze">Analyze</Link>
          </Button>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
