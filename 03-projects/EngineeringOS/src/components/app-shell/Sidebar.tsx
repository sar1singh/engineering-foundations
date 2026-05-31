"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Brain,
  Gauge,
  GitBranch,
  LayoutDashboard,
  Library,
  Settings
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Learning Graph", href: "/graph", icon: GitBranch },
  { label: "Topic Studio", href: "/topics/closures", icon: Brain },
  { label: "Practice Lab", href: "/practice/implement-counter-with-closure", icon: BookOpen },
  { label: "Syllabus", href: "/syllabus", icon: Library },
  { label: "Progress", href: "/progress", icon: BarChart3 },
  { label: "Content", href: "/content", icon: Gauge },
  { label: "Settings", href: "/settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-[var(--border)] bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:w-72 lg:border-r">
      <div className="flex h-full flex-col gap-6 px-4 py-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700 text-sm font-semibold text-white">
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
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-teal-50 text-teal-800"
                    : "text-[var(--muted)] hover:bg-slate-50 hover:text-[var(--foreground)]"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
