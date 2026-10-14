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
  Award
} from 'lucide-react';
import { HLD_SCENARIOS } from '@/data/hldScenarios';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { HLDScenario } from '@/types';

export default function HLDSimulatorPage() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('case-1-flash-sale');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showGoldStandard, setShowGoldStandard] = useState<boolean>(false);

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
    { num: 2, label: 'C4 Topology', icon: Layers, title: 'Step 2: C4 Container Topology' },
    { num: 3, label: 'Data & Concurrency', icon: Database, title: 'Step 3: Persistence & Concurrency Strategy' },
    { num: 4, label: 'Failure & Resiliency', icon: AlertTriangle, title: 'Step 4: Failure Modes & Trade-Off Defense' }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4" />
            <span>Part 2: Live HLD Whiteboard (45 Minutes)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Live High-Level Design (HLD) Whiteboard Simulator
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Master the strict EPAM 4-step framework. Formulate questions, structure C4 container boundaries, defend data persistence, and analyze failure modes.
          </p>
        </div>

        {/* Reference Solution Toggle */}
        <div className="flex items-center space-x-2 self-start lg:self-auto">
          <button
            onClick={() => setShowGoldStandard(!showGoldStandard)}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
              showGoldStandard
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showGoldStandard ? 'Hide B1 Gold Standard' : 'Reveal B1 Gold Standard'}</span>
          </button>
        </div>
      </div>

      {/* Case Scenario Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-950/20 shadow-md ring-1 ring-emerald-500/50'
                  : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/40'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                {s.category}
              </span>
              <h4 className="text-xs font-bold text-white line-clamp-1">{s.title.split(':')[1] || s.title}</h4>
              <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{s.subtitle}</p>
            </button>
          );
        })}
      </div>

      {/* Current Scenario Brief Banner */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/70 space-y-1.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {scenario.title}
          </h2>
          <span className="text-xs text-zinc-400 font-mono hidden sm:inline">{scenario.category}</span>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">{scenario.brief}</p>
      </div>

      {/* 4-Step Stepper Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {steps.map((s) => {
          const isCurrent = currentStep === s.num;
          const isDone = currentStep > s.num;
          const Icon = s.icon;
          return (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`p-3 rounded-xl border text-left transition-all flex items-center space-x-2.5 ${
                isCurrent
                  ? 'border-emerald-500 bg-emerald-950/30'
                  : isDone
                  ? 'border-zinc-800 bg-zinc-900/90 text-zinc-300'
                  : 'border-zinc-800/60 bg-zinc-950 text-zinc-500 hover:bg-zinc-900'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                isCurrent
                  ? 'bg-emerald-500 text-zinc-950'
                  : isDone
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-zinc-800 text-zinc-400'
              }`}>
                {s.num}
              </div>
              <div className="truncate">
                <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Step {s.num}</div>
                <div className="text-xs font-semibold text-white truncate">{s.label}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Whiteboard Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: Candidate Whiteboard Workspace */}
        <div className="space-y-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5" /> Candidate Whiteboard Scratchpad (Step {currentStep})
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Auto-saved to localStorage</span>
            </div>

            <p className="text-xs text-zinc-400">
              {currentStep === 1 && 'Note down your clarifying questions to the panel and quantified calculations (RPS, storage, latency budgets).'}
              {currentStep === 2 && 'Draft your C4 Container layout: API Gateways, microservice workers, message queues, and caching boundaries.'}
              {currentStep === 3 && 'Specify your persistence choices (SQL vs NoSQL), partition keys, consistency models, and concurrency locking strategies.'}
              {currentStep === 4 && 'Identify critical failure modes (broker crash, thundering herd, split-brain) and explicitly state what you sacrifice.'}
            </p>

            <textarea
              rows={14}
              value={currentNotes}
              onChange={(e) => handleNoteChange(e.target.value)}
              placeholder={`Type your Step ${currentStep} architectural design notes here as if presenting to the EPAM panel...`}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-100 font-mono leading-relaxed focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs">
            <button
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:pointer-events-none text-zinc-300 font-medium flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <span className="text-zinc-500 font-mono">Step {currentStep} of 4</span>
            <button
              disabled={currentStep === 4}
              onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white font-semibold flex items-center gap-1 shadow-sm"
            >
              Next Step <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: EPAM Committee Rubric & Gold Standard Solution */}
        <div className="space-y-4">
          {/* Rubric Checklist */}
          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> EPAM Committee Step {currentStep} Rubric Checklist
              </span>
              <span className="text-[10px] text-zinc-500">Check as you cover each item</span>
            </div>

            <div className="space-y-2 text-xs">
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
                    className="flex items-center space-x-2.5 p-2 rounded-lg bg-zinc-950/70 border border-zinc-800/80 cursor-pointer hover:border-zinc-700"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="rounded border-zinc-700 text-emerald-500 focus:ring-0"
                    />
                    <span className={checked ? 'text-zinc-400 line-through' : 'text-zinc-200'}>{item}</span>
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
                    className="flex items-center space-x-2.5 p-2 rounded-lg bg-zinc-950/70 border border-zinc-800/80 cursor-pointer hover:border-zinc-700"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="rounded border-zinc-700 text-emerald-500 focus:ring-0"
                    />
                    <span className={checked ? 'text-zinc-400 line-through' : 'text-zinc-200'}>{item}</span>
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
                    className="flex items-center space-x-2.5 p-2 rounded-lg bg-zinc-950/70 border border-zinc-800/80 cursor-pointer hover:border-zinc-700"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="rounded border-zinc-700 text-emerald-500 focus:ring-0"
                    />
                    <span className={checked ? 'text-zinc-400 line-through' : 'text-zinc-200'}>{item}</span>
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
                    className="flex items-center space-x-2.5 p-2 rounded-lg bg-zinc-950/70 border border-zinc-800/80 cursor-pointer hover:border-zinc-700"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="rounded border-zinc-700 text-emerald-500 focus:ring-0"
                    />
                    <span className={checked ? 'text-zinc-400 line-through' : 'text-zinc-200'}>{item}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gold Standard Solution Reference Box */}
          {showGoldStandard ? (
            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/15 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> B1 Gold Standard Reference Solution (Step {currentStep})
                </span>
                <span className="text-[10px] text-emerald-500/80 font-mono">Official Benchmark</span>
              </div>

              {currentStep === 1 && (
                <div className="space-y-3 text-xs">
                  <div>
                    <strong className="text-emerald-300 uppercase text-[10px] block mb-1">Clarifying Questions to Panel:</strong>
                    <ul className="text-zinc-300 space-y-1">
                      {scenario.step1Clarification.clarifyingQuestionsToAsk.map((q, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">&bull;</span>
                          <span>&quot;{q}&quot;</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <strong className="text-emerald-300 uppercase text-[10px] block mb-1">Quantified NFR Calculations:</strong>
                    <div className="space-y-1.5">
                      {scenario.step1Clarification.quantifiedNFRs.map((nfr, i) => (
                        <div key={i} className="p-2 rounded bg-zinc-950/70 border border-zinc-800">
                          <div className="text-white font-semibold">{nfr.metric}: <span className="text-emerald-400 font-mono">{nfr.value}</span></div>
                          <div className="text-[11px] text-zinc-400">{nfr.rationale}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-3 text-xs">
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-300">
                    <strong className="text-emerald-400">Topology:</strong> {scenario.step2C4Topology.overview}
                  </div>
                  <div>
                    <strong className="text-emerald-300 uppercase text-[10px] block mb-1">Container Breakdown:</strong>
                    <div className="space-y-1.5">
                      {scenario.step2C4Topology.components.map((c, i) => (
                        <div key={i} className="p-2 rounded bg-zinc-950/70 border border-zinc-800">
                          <div className="text-white font-semibold flex items-center justify-between">
                            <span>{c.name}</span>
                            <span className="text-[10px] font-mono text-cyan-400">{c.tech}</span>
                          </div>
                          <div className="text-[11px] text-zinc-400 mt-0.5">{c.responsibility}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-3 text-xs">
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 space-y-1">
                    <div className="text-zinc-400 text-[10px] uppercase font-bold">Primary Datastore</div>
                    <div className="text-white font-semibold">{scenario.step3Persistence.primaryDatastore}</div>
                  </div>
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 space-y-1">
                    <div className="text-zinc-400 text-[10px] uppercase font-bold">Schema &amp; Key Design</div>
                    <div className="text-zinc-300 leading-relaxed">{scenario.step3Persistence.schemaStrategy}</div>
                  </div>
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 space-y-1">
                    <div className="text-zinc-400 text-[10px] uppercase font-bold">Concurrency Control</div>
                    <div className="text-emerald-300 font-medium leading-relaxed">{scenario.step3Persistence.concurrencyControl}</div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-3 text-xs">
                  <div>
                    <strong className="text-emerald-300 uppercase text-[10px] block mb-1.5">Failure Modes &amp; Mitigations:</strong>
                    <div className="space-y-2">
                      {scenario.step4Resiliency.failureModes.map((fm, i) => (
                        <div key={i} className="p-2.5 rounded bg-zinc-950/70 border border-zinc-800 space-y-1">
                          <div className="text-rose-300 font-semibold">{fm.mode}</div>
                          <div className="text-[11px] text-zinc-400">Blast Radius: {fm.blastRadius}</div>
                          <div className="text-[11px] text-emerald-300">Mitigation: {fm.mitigation}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded bg-zinc-950 border border-emerald-500/30 text-zinc-200 italic leading-relaxed">
                    <strong className="text-emerald-400 not-italic block mb-0.5">Architectural Defense Statement:</strong>
                    &quot;{scenario.step4Resiliency.defenseTradeOff}&quot;
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 text-center space-y-2">
              <Sparkles className="w-6 h-6 text-emerald-400 mx-auto" />
              <h4 className="text-xs font-bold text-white">Compare with B1 Gold Standard Solution</h4>
              <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
                First, practice writing your design notes in the scratchpad on the left. Then click &quot;Reveal B1 Gold Standard&quot; above to inspect the ideal committee response.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
