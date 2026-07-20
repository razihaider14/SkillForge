import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm sm:flex-row">
        <p>&copy; {new Date().getFullYear()} SkillForge</p>
        <nav aria-label="Footer" className="flex items-center gap-6">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
          <Link href="/analyze" className="hover:text-foreground">
            Analyze
          </Link>
        </nav>
      </div>
    </footer>
  );
}
