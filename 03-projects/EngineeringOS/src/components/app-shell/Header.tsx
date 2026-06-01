import Link from "next/link";
import { UserCircle } from "lucide-react";

const mobileNavItems = [
  { label: "Today", href: "/today" },
  { label: "Courses", href: "/courses" },
  { label: "Syllabus", href: "/syllabus" },
  { label: "Graph", href: "/graph" },
  { label: "Practice", href: "/practice/implement-counter-with-closure" },
  { label: "Interview Rounds", href: "/interview-rounds" },
  { label: "Sources", href: "/sources" },
  { label: "Weak Areas", href: "/weak-areas" },
  { label: "Answer Builders", href: "/answer-builders" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/90 text-[var(--foreground)] shadow-[0_12px_32px_rgba(0,0,0,0.18)] backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:h-16 lg:px-8 lg:py-0">
        <div>
          <p className="text-sm font-medium text-[var(--muted)]">Local-first foundation</p>
          <p className="font-semibold text-[var(--foreground)]">EngineeringOS</p>
        </div>
        <Link className="hidden items-center gap-2 rounded-xl border border-[var(--border)] bg-slate-50 px-3 py-2 text-sm font-semibold text-[var(--foreground)] sm:flex" href="/profile">
          <UserCircle className="h-4 w-4 text-teal-700" aria-hidden="true" />
          Local guest / Mock data
        </Link>
        <div className="relative w-full lg:hidden">
          <nav className="eo-scroll flex gap-2 overflow-x-auto pb-1 pr-12" aria-label="Mobile founder navigation">
            {mobileNavItems.map((item) => (
              <Link key={item.href} className="shrink-0 rounded-lg border border-[var(--border)] bg-slate-50 px-3 py-2 text-sm font-semibold text-[var(--foreground)]" href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center bg-gradient-to-l from-[var(--surface)] via-[var(--surface)] to-transparent pl-8">
            <span className="rounded-full border border-[var(--border)] bg-slate-50 px-2 py-1 text-xs font-semibold text-[var(--muted)]">More</span>
          </div>
        </div>
      </div>
    </header>
  );
}
