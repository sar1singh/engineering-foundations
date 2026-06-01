"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Brain,
  Compass,
  Gauge,
  GitBranch,
  ListChecks,
  MessageSquareText,
  ShieldCheck,
  LayoutDashboard,
  Library,
  Sparkles,
  SlidersHorizontal,
  Settings,
  Wrench
} from "lucide-react";

const navItems = [
  { label: "Today", href: "/today", icon: Sparkles },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Interview Rounds", href: "/interview-rounds", icon: MessageSquareText },
  { label: "Sources", href: "/sources", icon: Compass },
  { label: "Weak Areas", href: "/weak-areas", icon: ListChecks },
  { label: "Answer Builders", href: "/answer-builders", icon: Wrench },
  { label: "Onboarding", href: "/onboarding", icon: SlidersHorizontal },
  { label: "Learning Graph", href: "/graph", icon: GitBranch },
  { label: "Topic Studio", href: "/topics/closures", icon: Brain },
  { label: "Practice Lab", href: "/practice/implement-counter-with-closure", icon: BookOpen },
  { label: "Syllabus", href: "/syllabus", icon: Library },
  { label: "Progress", href: "/progress", icon: BarChart3 },
  { label: "Content", href: "/content", icon: Gauge },
  { label: "Product QA", href: "/quality", icon: ShieldCheck },
  { label: "Settings", href: "/settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden border-[var(--border)] bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-72 lg:border-r">
      <div className="eo-scroll flex h-full flex-col gap-6 overflow-y-auto px-4 py-5">
        <Link href="/today" className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(20,116,111,0.22)]">
            EO
          </div>
          <div>
            <p className="font-semibold">EngineeringOS</p>
            <p className="text-sm text-[var(--muted)]">Learning operating system</p>
          </div>
        </Link>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
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
        </nav>
      </div>
    </aside>
  );
}
