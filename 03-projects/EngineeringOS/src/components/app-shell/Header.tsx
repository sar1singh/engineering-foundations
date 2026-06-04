import Link from "next/link";
import { Bell, Search, Terminal, UserCircle } from "lucide-react";

const mobileNavItems = [
  { label: "Today", href: "/today" },
  { label: "Roadmap", href: "/graph" },
  { label: "Focus", href: "/courses" },
  { label: "Practice", href: "/practice/implement-counter-with-closure" },
  { label: "Profile", href: "/profile" }
];

export function Header() {
  return (
    <header className="eo-command-bar sticky top-0 z-20">
      <div className="mx-auto flex min-h-16 max-w-[1500px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:h-16 lg:px-8 lg:py-0">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="font-mono text-lg font-black tracking-tight text-[var(--foreground)]">
            ENGINEERING_OS
          </Link>
          <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)] md:inline">Mission Control</span>
        </div>

        <div className="hidden min-w-[280px] items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm text-[var(--muted)] md:flex">
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="font-mono">CMD+K TO SEARCH NODES</span>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <Link className="eo-secondary-action px-3 py-2 text-sm" href="/content">
            <Terminal className="h-4 w-4" aria-hidden="true" />
            Query
          </Link>
          <Link className="eo-secondary-action px-3 py-2 text-sm" href="/quality" aria-label="Product QA status">
            <Bell className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link className="eo-primary-action px-3 py-2 text-sm" href="/profile">
            <UserCircle className="h-4 w-4" aria-hidden="true" />
            Local guest
          </Link>
        </div>

        <div className="relative w-full lg:hidden">
          <nav className="eo-scroll flex gap-2 overflow-x-auto pb-1 pr-12" aria-label="Mobile founder navigation">
            {mobileNavItems.map((item) => (
              <Link key={item.href} className="shrink-0 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm font-semibold text-[var(--foreground)]" href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center bg-gradient-to-l from-[var(--background)] via-[var(--background)] to-transparent pl-8">
            <span className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-2 py-1 text-xs font-semibold text-[var(--muted)]">More</span>
          </div>
        </div>
      </div>
    </header>
  );
}
