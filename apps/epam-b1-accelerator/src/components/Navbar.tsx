'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Milestone, 
  Layers, 
  FileText, 
  Cpu, 
  MessageSquareCode, 
  ShieldCheck,
  Zap,
  GraduationCap
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TOTAL_TOPICS_COUNT } from '@/data/skillTopicsAndLinksData';

export function Navbar() {
  const pathname = usePathname();
  const [competencyStatus] = useLocalStorage<Record<string, string>>('epam_b1_competencies', {});
  const [completedTopics] = useLocalStorage<Record<string, boolean>>('epam_b1_completed_topics', {});
  const [flashcardStatus] = useLocalStorage<Record<string, string>>('epam_b1_flashcards', {});

  const masteredSkills = Object.values(competencyStatus).filter(v => v === 'mastered').length;
  const completedTopicsCount = Object.values(completedTopics).filter(Boolean).length;
  const masteredCards = Object.values(flashcardStatus).filter(v => v === 'mastered').length;

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/roadmap', label: 'Topics & Roadmap', icon: Milestone },
    { href: '/jargon', label: 'Flashcards (30)', icon: Layers },
    { href: '/artifact-builder', label: 'SAD Workbench', icon: FileText },
    { href: '/hld-simulator', label: 'HLD Whiteboard', icon: Cpu },
    { href: '/mock-panel', label: 'Mock Panel', icon: MessageSquareCode },
    { href: '/exam', label: 'B1 Exam (25)', icon: GraduationCap },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Brand & Badge */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/25">
                <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center group-hover:bg-zinc-900 transition-colors">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-black text-white text-lg tracking-tight">EPAM B1 Accelerator</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    Level 1 / B1
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono hidden sm:block">Cox Automotive &amp; AWS Production Edition</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-zinc-800 text-white shadow-md border border-zinc-700'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Metrics Bar */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2.5 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs font-bold">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-zinc-400">Topics:</span>
              <span className="font-extrabold text-indigo-400">{completedTopicsCount}/{TOTAL_TOPICS_COUNT}</span>
              <span className="text-zinc-700">|</span>
              <span className="text-zinc-400">Skills:</span>
              <span className="font-extrabold text-emerald-400">{masteredSkills}/38</span>
              <span className="text-zinc-700">|</span>
              <span className="text-zinc-400">Cards:</span>
              <span className="font-extrabold text-cyan-400">{masteredCards}/30</span>
            </div>

            <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Full Session Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden border-t border-zinc-800/80 bg-zinc-950 px-3 py-2 flex items-center justify-around overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2 rounded text-[10px] font-medium transition-colors ${
                isActive ? 'text-indigo-400' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="truncate">{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
