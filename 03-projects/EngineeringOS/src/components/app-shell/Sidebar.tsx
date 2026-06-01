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
  ListChecks,
  MessageSquareText,
  ShieldCheck,
  LayoutDashboard,
  Library,
  LogIn,
  UserCircle,
  Sparkles,
  SlidersHorizontal,
  Settings,
  Wrench
} from "lucide-react";

const navGroups = [
  {
    title: "Mission",
    items: [
      { label: "Today", href: "/today", icon: Sparkles },
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Progress", href: "/progress", icon: BarChart3 }
    ]
  },
  {
    title: "Learn",
    items: [
      { label: "Courses", href: "/courses", icon: GraduationCap },
      { label: "Syllabus", href: "/syllabus", icon: Library },
      { label: "Learning Graph", href: "/graph", icon: GitBranch },
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
      { label: "Weak Areas", href: "/weak-areas", icon: ListChecks },
      { label: "Content", href: "/content", icon: Gauge },
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
    <aside className="hidden border-[var(--border)] bg-white text-[var(--foreground)] lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-72 lg:border-r">
      <div className="eo-scroll flex h-full flex-col gap-6 overflow-y-auto px-4 py-5">
        <Link href="/today" className="eo-gradient-border flex items-center gap-3 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(79,70,229,0.28)]">
            EO
          </div>
          <div>
            <p className="font-semibold">EngineeringOS</p>
            <p className="text-sm text-[var(--muted)]">Learning operating system</p>
          </div>
        </Link>
        <nav className="flex flex-col gap-4">
          {navGroups.map((group) => (
            <details key={group.title} open className="group/nav">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-2 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                {group.title}
                <ChevronDown className="h-3.5 w-3.5 transition group-open/nav:rotate-180" aria-hidden="true" />
              </summary>
              <div className="mt-1 flex flex-col gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                        isActive
                          ? "bg-teal-50 text-teal-800 shadow-[inset_3px_0_0_var(--accent)]"
                          : "text-[var(--muted)] hover:bg-slate-50 hover:text-[var(--foreground)]"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? "text-teal-700" : "transition group-hover:text-teal-700"}`} aria-hidden="true" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </details>
          ))}
        </nav>
      </div>
    </aside>
  );
}
