'use client';

import React, { useState } from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  ArrowLeft, 
  Layers, 
  Database, 
  AlertTriangle, 
  HelpCircle, 
  Eye, 
  Save, 
  RotateCcw,
  Sparkles,
  Award,
  Table as TableIcon,
  LayoutGrid,
  Check,
  ExternalLink
} from 'lucide-react';
import { HLD_SCENARIOS } from '@/data/hldScenarios';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { HLDScenario } from '@/types';

export default function HLDSimulatorPage() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('case-1-flash-sale');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showGoldStandard, setShowGoldStandard] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'workbench' | 'matrix'>('workbench');

  // Persistent notes per scenario and step
  const [userNotes, setUserNotes] = useLocalStorage<Record<string, Record<number, string>>>(
    'epam_b1_hld_notes',
    {}
  );

  // Persistent rubric checks
  const [rubricChecks, setRubricChecks] = useLocalStorage<Record<string, boolean>>(
    'epam_b1_hld_rubric',
    {}
  );

  const scenario: HLDScenario = HLD_SCENARIOS.find(s => s.id === selectedScenarioId) || HLD_SCENARIOS[0];
  const currentNotes = userNotes[scenario.id]?.[currentStep] || '';

  const handleNoteChange = (text: string) => {
    setUserNotes(prev => ({
      ...prev,
      [scenario.id]: {
        ...(prev[scenario.id] || {}),
        [currentStep]: text
      }
    }));
  };

  const toggleRubric = (key: string) => {
    setRubricChecks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const steps = [
    { num: 1, label: 'Clarify & Quantify', icon: HelpCircle, title: 'Step 1: Clarify FRs & Quantify NFRs' },
    { num: 2, label: 'C4 Container Topology', icon: Layers, title: 'Step 2: C4 Container Topology' },
    { num: 3, label: 'Persistence & Concurrency', icon: Database, title: 'Step 3: Persistence & Concurrency Strategy' },
    { num: 4, label: 'Failure Modes & Resiliency', icon: AlertTriangle, title: 'Step 4: Failure Modes & Trade-Off Defense' }
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header with High-Impact Big Screen Typography */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-bold text-emerald-400 uppercase tracking-wider">
            <Cpu className="w-5 h-5" />
            <span>Part 2: Live HLD Whiteboard (45 Minutes)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Live High-Level Design (HLD) Whiteboard Studio
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 max-w-4xl leading-relaxed">
            Strict execution of EPAM&apos;s 4-step architecture framework on real-world ambiguous problem statements. Clarify requirements, quantify NFR budgets, establish C4 container boundaries, defend data persistence, and mitigate failure modes.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
          {/* View Mode Toggle: Workbench vs Full Solution Matrix Table */}
          <div className="flex items-center space-x-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
            <button
              onClick={() => setViewMode('workbench')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                viewMode === 'workbench'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Interactive Whiteboard</span>
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                viewMode === 'matrix'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span>Full 4-Step Matrix (Table)</span>
            </button>
          </div>

          <button
            onClick={() => setShowGoldStandard(!showGoldStandard)}
            className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all shadow-md ${
              showGoldStandard
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{showGoldStandard ? 'Hide Gold Standard' : 'Reveal B1 Gold Standard'}</span>
          </button>
        </div>
      </div>

      {/* Case Scenario Selector Strip (Clean Tab Bar, No Box Clutter) */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-2 border-b border-zinc-800">
        <span className="text-xs font-black uppercase tracking-wider text-zinc-400 whitespace-nowrap pl-1">
          Select Problem Scenario:
        </span>
        {HLD_SCENARIOS.map((s) => {
          const isSelected = selectedScenarioId === s.id;
          return (
            <button
              key={s.id}
              onClick={() => {
                setSelectedScenarioId(s.id);
                setCurrentStep(1);
                setShowGoldStandard(false);
              }}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center space-x-2 ${
                isSelected
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{s.title.split(':')[1] || s.title}</span>
            </button>
          );
        })}
      </div>

      {/* Current Scenario Brief Banner - Roomy & High Contrast */}
      <div className="p-6 sm:p-8 rounded-3xl border border-zinc-800 bg-zinc-900/60 space-y-3 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            {scenario.title}
          </h2>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 self-start sm:self-auto font-mono">
            {scenario.category}
          </span>
        </div>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
          {scenario.brief}
        </p>
      </div>

      {/* VIEW MODE 1: INTERACTIVE STEP WORKBENCH */}
      {viewMode === 'workbench' && (
        <div className="space-y-6">
          {/* 4-Step Stepper Pipeline - Big Screen Stepper */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s) => {
              const isCurrent = currentStep === s.num;
              const isDone = currentStep > s.num;
              const Icon = s.icon;
              return (
                <button
                  key={s.num}
                  onClick={() => setCurrentStep(s.num)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-center space-x-3.5 shadow-md ${
                    isCurrent
                      ? 'border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500/50'
                      : isDone
                      ? 'border-zinc-800 bg-zinc-900/90 text-zinc-200'
                      : 'border-zinc-800/80 bg-zinc-950 text-zinc-500 hover:bg-zinc-900'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                    isCurrent
                      ? 'bg-emerald-500 text-zinc-950 shadow-md'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {s.num}
                  </div>
                  <div className="truncate">
                    <div className="text-xs uppercase font-extrabold tracking-wider text-zinc-400">Step {s.num}</div>
                    <div className="text-sm font-bold text-white truncate">{s.label}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Whiteboard Work Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT COLUMN: Candidate Whiteboard Workspace */}
            <div className="space-y-5 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <span className="text-sm font-black uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                    <Save className="w-4 h-4" /> Candidate Whiteboard Scratchpad (Step {currentStep})
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">Auto-saved to localStorage</span>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed">
                  {currentStep === 1 && 'Note down your clarifying questions to the panel and quantified calculations (RPS, storage, latency budgets).'}
                  {currentStep === 2 && 'Draft your C4 Container layout: API Gateways, microservice workers, message queues, and caching boundaries.'}
                  {currentStep === 3 && 'Specify your persistence choices (SQL vs NoSQL), partition keys, consistency models, and concurrency locking strategies.'}
                  {currentStep === 4 && 'Identify critical failure modes (broker crash, thundering herd, split-brain) and explicitly state what you sacrifice.'}
                </p>

                <textarea
                  rows={15}
                  value={currentNotes}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  placeholder={`Draft your Step ${currentStep} architectural design notes here as if actively drawing and speaking on the whiteboard...`}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm sm:text-base text-zinc-100 font-mono leading-relaxed focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Stepper Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-sm">
                <button
                  disabled={currentStep === 1}
                  onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:pointer-events-none text-zinc-300 font-bold flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous Step
                </button>
                <span className="text-zinc-400 font-mono font-bold">Step {currentStep} of 4</span>
                <button
                  disabled={currentStep === 4}
                  onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white font-extrabold flex items-center gap-2 shadow-md transition-all"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: EPAM Committee Rubric & Gold Standard Solution */}
            <div className="space-y-6">
              {/* Rubric Checklist */}
              <div className="p-6 sm:p-8 rounded-3xl border border-zinc-800 bg-zinc-900/60 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> EPAM Committee Step {currentStep} Rubric Checklist
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">Verify all points</span>
                </div>

                <div className="space-y-2.5 text-sm sm:text-base">
                  {currentStep === 1 && [
                    'Asked clarifying questions before proposing any tech stack or diagrams',
                    'Quantified peak traffic (RPS) and estimated read/write ratio',
                    'Established explicit latency SLA (P99) and availability target (99.9x%)',
                    'Defined RPO (acceptable data loss) and RTO (recovery time window)'
                  ].map((item, idx) => {
                    const key = `${scenario.id}-s1-${idx}`;
                    const checked = !!rubricChecks[key];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleRubric(key)}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded border-zinc-700 text-emerald-500 focus:ring-0"
                        />
                        <span className={checked ? 'text-zinc-500 line-through' : 'text-zinc-200 font-medium'}>{item}</span>
                      </div>
                    );
                  })}

                  {currentStep === 2 && [
                    'Drew clean C4 container boundaries (no giant single-box diagrams)',
                    'Decoupled ingestion from downstream processing via queues (SQS/Kafka)',
                    'Identified edge termination (CDN, WAF, API Gateway rate-limiting)',
                    'Specified container auto-scaling triggers (CPU/queue backlog depth)'
                  ].map((item, idx) => {
                    const key = `${scenario.id}-s2-${idx}`;
                    const checked = !!rubricChecks[key];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleRubric(key)}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded border-zinc-700 text-emerald-500 focus:ring-0"
                        />
                        <span className={checked ? 'text-zinc-500 line-through' : 'text-zinc-200 font-medium'}>{item}</span>
                      </div>
                    );
                  })}

                  {currentStep === 3 && [
                    'Justified primary datastore choice (NoSQL vs SQL) based on access patterns',
                    'Defined composite partition keys to prevent hot partitions',
                    'Explained concurrency control (Optimistic locking vs Redis locks)',
                    'Addressed cache invalidation strategy and cache stampede protection'
                  ].map((item, idx) => {
                    const key = `${scenario.id}-s3-${idx}`;
                    const checked = !!rubricChecks[key];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleRubric(key)}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded border-zinc-700 text-emerald-500 focus:ring-0"
                        />
                        <span className={checked ? 'text-zinc-500 line-through' : 'text-zinc-200 font-medium'}>{item}</span>
                      </div>
                    );
                  })}

                  {currentStep === 4 && [
                    'Analyzed primary database node crash or network partition recovery',
                    'Addressed poison pill message handling via Dead Letter Queues (DLQ)',
                    'Prevented cascading failures with circuit breakers and bulkhead isolation',
                    'Explicitly defended the fundamental architectural trade-off (Gain vs. Sacrifice)'
                  ].map((item, idx) => {
                    const key = `${scenario.id}-s4-${idx}`;
                    const checked = !!rubricChecks[key];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleRubric(key)}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded border-zinc-700 text-emerald-500 focus:ring-0"
                        />
                        <span className={checked ? 'text-zinc-500 line-through' : 'text-zinc-200 font-medium'}>{item}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Gold Standard Solution Reference Box */}
              {showGoldStandard ? (
                <div className="p-6 sm:p-8 rounded-3xl border border-emerald-500/40 bg-emerald-950/20 space-y-5 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
                    <span className="text-sm font-black uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-400" /> B1 Gold Standard Reference (Step {currentStep})
                    </span>
                    <span className="text-xs text-emerald-400 font-mono">Senior Architect Benchmark</span>
                  </div>

                  {currentStep === 1 && (
                    <div className="space-y-4 text-sm sm:text-base">
                      <div>
                        <strong className="text-xs uppercase font-extrabold text-emerald-300 block mb-2">Clarifying Questions to Ask the Panel:</strong>
                        <ul className="text-zinc-200 space-y-1.5">
                          {scenario.step1Clarification.clarifyingQuestionsToAsk.map((q, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-emerald-400 font-black">&bull;</span>
                              <span className="italic">&quot;{q}&quot;</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <strong className="text-xs uppercase font-extrabold text-emerald-300 block mb-2">Quantified NFR Calculations:</strong>
                        <div className="space-y-2">
                          {scenario.step1Clarification.quantifiedNFRs.map((nfr, i) => (
                            <div key={i} className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
                              <div className="text-white font-bold">{nfr.metric}: <span className="text-emerald-400 font-mono">{nfr.value}</span></div>
                              <div className="text-xs text-zinc-400 mt-1">{nfr.rationale}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4 text-sm sm:text-base">
                      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs sm:text-sm text-cyan-300 leading-relaxed">
                        <strong className="text-emerald-400">Topology:</strong> {scenario.step2C4Topology.overview}
                      </div>
                      <div>
                        <strong className="text-xs uppercase font-extrabold text-emerald-300 block mb-2">Container Breakdown:</strong>
                        <div className="space-y-2">
                          {scenario.step2C4Topology.components.map((c, i) => (
                            <div key={i} className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                              <div className="text-white font-bold flex items-center justify-between">
                                <span>{c.name}</span>
                                <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">{c.tech}</span>
                              </div>
                              <div className="text-xs sm:text-sm text-zinc-300 mt-1 leading-relaxed">{c.responsibility}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-3 text-sm sm:text-base">
                      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                        <div className="text-xs text-zinc-400 uppercase font-bold">Primary Datastore Choice</div>
                        <div className="text-white font-bold">{scenario.step3Persistence.primaryDatastore}</div>
                      </div>
                      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                        <div className="text-xs text-zinc-400 uppercase font-bold">Schema &amp; Key Design</div>
                        <div className="text-zinc-200 leading-relaxed text-sm">{scenario.step3Persistence.schemaStrategy}</div>
                      </div>
                      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                        <div className="text-xs text-zinc-400 uppercase font-bold">Concurrency Control</div>
                        <div className="text-emerald-300 font-medium leading-relaxed text-sm">{scenario.step3Persistence.concurrencyControl}</div>
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-4 text-sm sm:text-base">
                      <div>
                        <strong className="text-xs uppercase font-extrabold text-emerald-300 block mb-2">Failure Modes &amp; Mitigations:</strong>
                        <div className="space-y-2.5">
                          {scenario.step4Resiliency.failureModes.map((fm, i) => (
                            <div key={i} className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                              <div className="text-rose-300 font-bold">{fm.mode}</div>
                              <div className="text-xs text-zinc-400">Blast Radius: {fm.blastRadius}</div>
                              <div className="text-xs sm:text-sm text-emerald-300">Mitigation: {fm.mitigation}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-zinc-950 border border-emerald-500/40 text-zinc-100 italic leading-relaxed">
                        <strong className="text-emerald-400 not-italic block text-xs uppercase font-bold mb-1">Architectural Defense Statement:</strong>
                        &quot;{scenario.step4Resiliency.defenseTradeOff}&quot;
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/40 text-center space-y-3">
                  <Sparkles className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Compare Against B1 Gold Standard Solution</h4>
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
                    Draft your solution notes on the left first. When ready, click &quot;Reveal B1 Gold Standard&quot; above to inspect the EPAM committee benchmark.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: COMPREHENSIVE 4-STEP ARCHITECTURE MATRIX (CLEAN DATA TABLE) */}
      {viewMode === 'matrix' && (
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-xl">
          <div className="p-6 border-b border-zinc-800 bg-zinc-950">
            <h3 className="text-xl font-bold text-white">
              Complete 4-Step Architectural Solution Matrix: {scenario.title}
            </h3>
            <p className="text-sm text-zinc-400 mt-1">
              Holistic side-by-side view of all four steps of the design without nested box fatigue.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950 text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-400">
                  <th className="py-4 px-6 w-48">EPAM Framework Step</th>
                  <th className="py-4 px-6">Official B1 Gold Standard Design Specifications</th>
                  <th className="py-4 px-6 w-80">Candidate Draft Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-sm sm:text-base">
                {/* Row 1: Step 1 */}
                <tr className="hover:bg-zinc-800/20 transition-colors">
                  <td className="py-6 px-6 align-top">
                    <span className="inline-block px-3 py-1 rounded-lg text-xs font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
                      STEP 1
                    </span>
                    <div className="text-base font-bold text-white">Clarify FRs &amp; Quantify NFRs</div>
                  </td>
                  <td className="py-6 px-6 align-top space-y-3">
                    <div>
                      <strong className="text-xs text-indigo-300 uppercase block mb-1">Key Clarifying Questions:</strong>
                      <ul className="text-zinc-300 text-sm space-y-1">
                        {scenario.step1Clarification.clarifyingQuestionsToAsk.map((q, i) => (
                          <li key={i}>&bull; &quot;{q}&quot;</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong className="text-xs text-emerald-300 uppercase block mb-1">Target NFR Metrics:</strong>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {scenario.step1Clarification.quantifiedNFRs.map((n, i) => (
                          <div key={i} className="p-2 rounded bg-zinc-950 border border-zinc-800 font-mono text-zinc-300">
                            <span className="text-emerald-400 font-bold">{n.metric}:</span> {n.value}
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-6 align-top font-mono text-xs text-zinc-300 bg-zinc-950/40">
                    {userNotes[scenario.id]?.[1] || <span className="text-zinc-600 italic">No notes drafted yet</span>}
                  </td>
                </tr>

                {/* Row 2: Step 2 */}
                <tr className="hover:bg-zinc-800/20 transition-colors">
                  <td className="py-6 px-6 align-top">
                    <span className="inline-block px-3 py-1 rounded-lg text-xs font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mb-2">
                      STEP 2
                    </span>
                    <div className="text-base font-bold text-white">C4 Container Topology</div>
                  </td>
                  <td className="py-6 px-6 align-top space-y-3">
                    <p className="text-sm text-cyan-300 font-mono bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                      {scenario.step2C4Topology.overview}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {scenario.step2C4Topology.components.map((c, i) => (
                        <div key={i} className="p-2.5 rounded bg-zinc-950 border border-zinc-800 text-xs">
                          <div className="font-bold text-white">{c.name} <span className="text-cyan-400 font-mono">({c.tech})</span></div>
                          <div className="text-zinc-400 mt-0.5">{c.responsibility}</div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-6 px-6 align-top font-mono text-xs text-zinc-300 bg-zinc-950/40">
                    {userNotes[scenario.id]?.[2] || <span className="text-zinc-600 italic">No notes drafted yet</span>}
                  </td>
                </tr>

                {/* Row 3: Step 3 */}
                <tr className="hover:bg-zinc-800/20 transition-colors">
                  <td className="py-6 px-6 align-top">
                    <span className="inline-block px-3 py-1 rounded-lg text-xs font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
                      STEP 3
                    </span>
                    <div className="text-base font-bold text-white">Persistence &amp; Concurrency</div>
                  </td>
                  <td className="py-6 px-6 align-top space-y-2 text-sm text-zinc-300">
                    <div><strong className="text-xs text-amber-300 uppercase">Datastore:</strong> {scenario.step3Persistence.primaryDatastore}</div>
                    <div><strong className="text-xs text-amber-300 uppercase">Schema:</strong> {scenario.step3Persistence.schemaStrategy}</div>
                    <div><strong className="text-xs text-amber-300 uppercase">Concurrency:</strong> {scenario.step3Persistence.concurrencyControl}</div>
                  </td>
                  <td className="py-6 px-6 align-top font-mono text-xs text-zinc-300 bg-zinc-950/40">
                    {userNotes[scenario.id]?.[3] || <span className="text-zinc-600 italic">No notes drafted yet</span>}
                  </td>
                </tr>

                {/* Row 4: Step 4 */}
                <tr className="hover:bg-zinc-800/20 transition-colors">
                  <td className="py-6 px-6 align-top">
                    <span className="inline-block px-3 py-1 rounded-lg text-xs font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-2">
                      STEP 4
                    </span>
                    <div className="text-base font-bold text-white">Failure Modes &amp; Resiliency</div>
                  </td>
                  <td className="py-6 px-6 align-top space-y-3">
                    <div className="space-y-1.5">
                      {scenario.step4Resiliency.failureModes.map((f, i) => (
                        <div key={i} className="text-xs text-zinc-300">
                          <strong className="text-rose-400">{f.mode}:</strong> Blast radius {f.blastRadius}; {f.mitigation}
                        </div>
                      ))}
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-950 border border-emerald-500/30 text-xs italic text-emerald-300">
                      &quot;{scenario.step4Resiliency.defenseTradeOff}&quot;
                    </div>
                  </td>
                  <td className="py-6 px-6 align-top font-mono text-xs text-zinc-300 bg-zinc-950/40">
                    {userNotes[scenario.id]?.[4] || <span className="text-zinc-600 italic">No notes drafted yet</span>}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
