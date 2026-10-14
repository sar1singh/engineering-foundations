'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Target, 
  Clock, 
  Layers, 
  FileText, 
  Cpu, 
  MessageSquareCode, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  BarChart3,
  Flame,
  Award,
  Database,
  CloudRain
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SYLLABUS_DATA } from '@/data/syllabusData';
import { FLASHCARDS_DATA } from '@/data/flashcardsData';

export default function DashboardPage() {
  const [competencyStatus] = useLocalStorage<Record<string, string>>('epam_b1_competencies', {});
  const [flashcardStatus] = useLocalStorage<Record<string, string>>('epam_b1_flashcards', {});
  const [sadStatus] = useLocalStorage<Record<string, boolean>>('epam_b1_sad_checks', {
    nfrsReviewed: true,
    c4TopologyMastered: true,
    adr01Mastered: true,
    adr02Mastered: true,
    adr03Mastered: true,
    crossExamPracticed: false
  });

  const totalCompetencies = SYLLABUS_DATA.length; // 38
  const masteredCompetencies = Object.values(competencyStatus).filter(v => v === 'mastered').length;
  const learningCompetencies = Object.values(competencyStatus).filter(v => v === 'learning').length;

  const totalCards = FLASHCARDS_DATA.length; // 30
  const masteredCards = Object.values(flashcardStatus).filter(v => v === 'mastered').length;
  const learningCards = Object.values(flashcardStatus).filter(v => v === 'learning').length;

  const sadChecksTotal = Object.keys(sadStatus).length;
  const sadChecksPassed = Object.values(sadStatus).filter(Boolean).length;
  const sadPercentage = Math.round((sadChecksPassed / sadChecksTotal) * 100);

  // Overall readiness score
  const readinessScore = Math.round(
    ((masteredCompetencies / totalCompetencies) * 0.4 +
     (masteredCards / totalCards) * 0.3 +
     (sadChecksPassed / sadChecksTotal) * 0.3) * 100
  );

  const domains = [
    { name: 'Solution Arch', count: 7, bar: 'Advanced (Box 3)', color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10' },
    { name: 'Application Arch', count: 7, bar: 'Advanced (Box 3)', color: 'border-blue-500/30 text-blue-400 bg-blue-500/10' },
    { name: 'Cloud', count: 3, bar: 'Intermediate (Box 2)', color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10' },
    { name: 'SDLC Processes', count: 4, bar: 'Advanced / Inter', color: 'border-amber-500/30 text-amber-400 bg-amber-500/10' },
    { name: 'Leadership & Soft', count: 11, bar: 'Advanced / B2', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' },
    { name: 'AI', count: 2, bar: 'Inter / Novice', color: 'border-purple-500/30 text-purple-400 bg-purple-500/10' },
    { name: 'Business', count: 4, bar: 'Novice (Box 1)', color: 'border-rose-500/30 text-rose-400 bg-rose-500/10' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Executive Briefing */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> EPAM LevelUp Architecture Discipline
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Target className="w-3.5 h-3.5 mr-1" /> Level 1 / B1 Full Session
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock className="w-3.5 h-3.5 mr-1" /> Target: 30–45 Days Window
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              EPAM B1 Software Architect Accelerator
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Autonomous preparation command center for the 90-minute Full Session. Defend the real-world{' '}
              <strong className="text-zinc-200">Cox Automotive</strong> production artifact (AWS + Node.js + DynamoDB),
              master all <strong className="text-zinc-200">38 LevelUp competencies</strong>, and practice live HLD whiteboard scenarios.
            </p>
          </div>

          {/* Readiness Gauge Widget */}
          <div className="flex-shrink-0 flex items-center justify-center bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 shadow-xl">
            <div className="text-center space-y-1">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-zinc-800"
                    fill="transparent"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={289}
                    strokeDashoffset={289 - (289 * readinessScore) / 100}
                    strokeLinecap="round"
                    className="text-indigo-500 transition-all duration-1000 ease-out"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-white">{readinessScore}%</span>
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Readiness</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 font-medium">B1 Committee Gate</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Metric KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Competencies Progress */}
        <Link href="/roadmap" className="group p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900/90 hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-zinc-400 group-hover:text-indigo-400 flex items-center gap-1">
              Inspect Roadmap <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">LevelUp Competencies</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-emerald-400">{masteredCompetencies}</span>
            <span className="text-sm text-zinc-400">/ {totalCompetencies} Mastered</span>
          </div>
          <div className="mt-3 w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(masteredCompetencies / totalCompetencies) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-500 flex justify-between">
            <span>In progress: {learningCompetencies}</span>
            <span>Needs work: {totalCompetencies - masteredCompetencies - learningCompetencies}</span>
          </p>
        </Link>

        {/* Distributed Flashcards */}
        <Link href="/jargon" className="group p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900/90 hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-zinc-400 group-hover:text-cyan-400 flex items-center gap-1">
              Practice Cards <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Architecture Flashcards</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-cyan-400">{masteredCards}</span>
            <span className="text-sm text-zinc-400">/ {totalCards} Cleared</span>
          </div>
          <div className="mt-3 w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(masteredCards / totalCards) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-500 flex justify-between">
            <span>Learning: {learningCards}</span>
            <span>Unreviewed: {totalCards - masteredCards - learningCards}</span>
          </p>
        </Link>

        {/* SAD Artifact Defense */}
        <Link href="/artifact-builder" className="group p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900/90 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-zinc-400 group-hover:text-amber-400 flex items-center gap-1">
              Review SAD <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Production SAD Defense</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-amber-400">{sadPercentage}%</span>
            <span className="text-sm text-zinc-400">Readiness</span>
          </div>
          <div className="mt-3 w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${sadPercentage}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            Cox Automotive (2,500 RPS, 3 ADRs, C4 Topology)
          </p>
        </Link>
      </div>

      {/* 90-Minute Assessment Session Architecture Breakdown */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">Full Assessment Session Dynamics (90 Minutes)</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Part 1 */}
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                PART 1: 45 MINUTES
              </span>
              <span className="text-xs text-zinc-400 font-mono">Forensic Audit</span>
            </div>
            <h3 className="text-base font-bold text-white">Production Artifact (SAD) Defense</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The committee of 2–3 Senior and Chief Architects will audit your submitted Solution Architecture Document.
              They test for authentic authorship, explore why alternatives were rejected, and drill down on NFR feasibility.
            </p>
            <ul className="text-xs text-zinc-300 space-y-1.5 pt-2 border-t border-zinc-800/80">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Verify NFR metrics (2,500 RPS, P99 &lt; 150ms, RTO &lt; 15 min, RPO = 0)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Defend 3 core ADRs (DynamoDB vs MySQL, SQS vs Sync REST, Optimistic Locking)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Handle failure modes and cross-examination questions</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                href="/artifact-builder"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                <span>Launch SAD Workbench &amp; Defense Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Part 2 */}
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PART 2: 45 MINUTES
              </span>
              <span className="text-xs text-zinc-400 font-mono">Live Whiteboarding</span>
            </div>
            <h3 className="text-base font-bold text-white">Live High-Level Design (HLD) Scenario</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              You are assigned an ambiguous business problem. Success is strictly determined by adhering to EPAM’s 4-step framework
              without jumping prematurely into code or technology names.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80 text-[11px] font-mono">
              <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                <span className="text-emerald-400 font-bold">Step 1:</span> Clarify FRs &amp; Quantify NFRs
              </div>
              <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                <span className="text-emerald-400 font-bold">Step 2:</span> C4 Container Topology
              </div>
              <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                <span className="text-emerald-400 font-bold">Step 3:</span> Persistence &amp; Concurrency
              </div>
              <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                <span className="text-emerald-400 font-bold">Step 4:</span> Failure Modes &amp; Trade-Offs
              </div>
            </div>
            <div className="pt-2">
              <Link
                href="/hld-simulator"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                <span>Launch 4-Step HLD Whiteboard Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 38 Competencies Domain Coverage */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">EPAM LevelUp Skills Inventory (38 Competencies)</h2>
          </div>
          <Link href="/roadmap" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            View All in Roadmap <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {domains.map((d) => (
            <div key={d.name} className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/50 flex flex-col justify-between">
              <div>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${d.color} mb-2`}>
                  {d.count} Skills
                </span>
                <h4 className="text-xs font-bold text-white truncate" title={d.name}>{d.name}</h4>
              </div>
              <p className="text-[10px] text-zinc-400 mt-2 font-mono">{d.bar}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Interactive Feature Launchpads */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/roadmap"
          className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/60 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">38-Skill Interactive Roadmap</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Filter by LevelUp Boxes (Advanced, Intermediate, Novice) with verbatim 30-second defense scripts.
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1 mt-4">
            Enter Roadmap <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          href="/jargon"
          className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/60 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">30 Distributed Systems Flashcards</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Interactive 3D flip cards covering CAP, Sagas, Outbox CDC, Bulkheads, Circuit Breakers, and C4.
            </p>
          </div>
          <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1 mt-4">
            Flip Flashcards <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          href="/artifact-builder"
          className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/60 hover:border-amber-500/40 transition-all flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">SAD Defense Workbench</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Edit Cox Automotive architecture data, export Markdown artifacts, and test against 6 tough panel questions.
            </p>
          </div>
          <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 mt-4">
            Open Workbench <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          href="/mock-panel"
          className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/60 hover:border-rose-500/40 transition-all flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <MessageSquareCode className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Committee Mock Examiner</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Simulate cross-examination by Dmitry, Elena, and Marcus with instant 1–4 scale scoring on your answers.
            </p>
          </div>
          <span className="text-xs font-semibold text-rose-400 flex items-center gap-1 mt-4">
            Start Mock Interview <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}
