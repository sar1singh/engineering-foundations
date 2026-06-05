"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Brain,
  ChevronDown,
  Compass,
  Gauge,
  GitBranch,
  GraduationCap,
  LayoutDashboard,
  Library,
  ListChecks,
  LogIn,
  MessageSquareText,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserCircle,
  Wrench
} from "lucide-react";

const primaryNav = [
  { label: "Mission", href: "/dashboard", icon: LayoutDashboard },
  { label: "Blueprint", href: "/graph", icon: GitBranch },
  { label: "Focus", href: "/courses", icon: Brain },
  { label: "Sources", href: "/sources", icon: Compass },
  { label: "Profile", href: "/profile", icon: UserCircle }
];

const navGroups = [
  {
    title: "Mission",
    items: [
      { label: "Today", href: "/today", icon: Sparkles },
      { label: "Founder Beta", href: "/founder-beta", icon: Sparkles },
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Progress", href: "/progress", icon: BarChart3 },
      { label: "Weak Areas", href: "/weak-areas", icon: ListChecks }
    ]
  },
  {
    title: "Learn",
    items: [
      { label: "Courses", href: "/courses", icon: GraduationCap },
      { label: "Blueprint Graph", href: "/graph", icon: GitBranch },
      { label: "Syllabus", href: "/syllabus", icon: Library },
      { label: "Topic Studio", href: "/topics/closures", icon: Brain }
    ]
  },
  {
    title: "Practice",
    items: [
      { label: "Practice Lab", href: "/practice/implement-counter-with-closure", icon: BookOpen },
      { label: "Interview Rounds", href: "/interview-rounds", icon: MessageSquareText },
      { label: "Answer Builders", href: "/answer-builders", icon: Wrench }
    ]
  },
  {
    title: "Resources",
    items: [
      { label: "Sources", href: "/sources", icon: Compass },
      { label: "Content Search", href: "/content", icon: Gauge },
      { label: "Product QA", href: "/quality", icon: ShieldCheck }
    ]
  },
  {
    title: "Account",
    items: [
      { label: "Profile", href: "/profile", icon: UserCircle },
      { label: "Onboarding", href: "/onboarding", icon: SlidersHorizontal },
      { label: "Sign in", href: "/signin", icon: LogIn },
      { label: "Settings", href: "/settings", icon: Settings }
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="eo-os-rail hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-20 lg:flex-col lg:items-center lg:justify-between lg:px-3 lg:py-4">
      <div className="flex w-full flex-col items-center gap-4">
        <Link href="/dashboard" className="flex h-11 w-11 items-center justify-center border border-[var(--accent)] bg-[var(--accent-soft)] font-mono text-sm font-black text-[var(--accent-strong)] shadow-[0_0_26px_rgba(0,229,255,0.2)]">
          E_OS
        </Link>
        <nav className="flex w-full flex-col gap-2" aria-label="Primary EngineeringOS navigation">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                aria-label={item.label}
                className="eo-rail-link flex h-12 w-full flex-col items-center justify-center gap-1 text-[0.58rem] font-bold uppercase tracking-[0.08em]"
                data-active={isActive}
                href={item.href}
                title={item.label}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <details className="group/menu relative w-full">
        <summary className="eo-rail-link flex h-12 w-full cursor-pointer list-none items-center justify-center" aria-label="Open route menu">
          <ChevronDown className="h-5 w-5 transition group-open/menu:rotate-180" aria-hidden="true" />
        </summary>
        <div className="absolute bottom-0 left-16 z-50 w-80 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.75)]">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent-strong)]">Route matrix</p>
          <div className="mt-3 space-y-3">
            {navGroups.map((group) => (
              <details key={group.title} open={["Mission", "Learn"].includes(group.title)} className="group/nav">
                <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  {group.title}
                  <ChevronDown className="h-3.5 w-3.5 transition group-open/nav:rotate-180" aria-hidden="true" />
                </summary>
                <div className="mt-2 grid gap-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition ${
                          isActive ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]" : "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]"
                        }`}
                        href={item.href}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>
        </div>
      </details>
    </aside>
  );
}
