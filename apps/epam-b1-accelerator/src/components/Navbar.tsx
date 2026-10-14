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
  Zap
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export function Navbar() {
  const pathname = usePathname();
  const [competencyStatus] = useLocalStorage<Record<string, string>>('epam_b1_competencies', {});
  const [flashcardStatus] = useLocalStorage<Record<string, string>>('epam_b1_flashcards', {});

  const masteredSkills = Object.values(competencyStatus).filter(v => v === 'mastered').length;
  const masteredCards = Object.values(flashcardStatus).filter(v => v === 'mastered').length;

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/roadmap', label: 'Roadmap (38)', icon: Milestone },
    { href: '/jargon', label: 'Flashcards (30)', icon: Layers },
    { href: '/artifact-builder', label: 'SAD Workbench', icon: FileText },
    { href: '/hld-simulator', label: 'HLD Whiteboard', icon: Cpu },
    { href: '/mock-panel', label: 'Mock Panel', icon: MessageSquareCode },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Badge */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-[7px] flex items-center justify-center group-hover:bg-zinc-900 transition-colors">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-base tracking-tight">EPAM B1 Accelerator</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                    L1 / B1
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-mono hidden sm:block">Cox Automotive & AWS Edition</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
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
            <div className="hidden lg:flex items-center space-x-2 bg-zinc-900/90 border border-zinc-800 rounded-lg px-3 py-1 text-xs">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-zinc-400">Skills:</span>
              <span className="font-semibold text-emerald-400">{masteredSkills}/38</span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400">Cards:</span>
              <span className="font-semibold text-cyan-400">{masteredCards}/30</span>
            </div>

            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
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
