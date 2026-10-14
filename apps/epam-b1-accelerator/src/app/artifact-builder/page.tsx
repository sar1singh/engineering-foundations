'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Copy, 
  RotateCcw, 
  Check, 
  ShieldCheck, 
  AlertCircle, 
  ChevronRight, 
  Layers, 
  HelpCircle,
  Sparkles,
  Award,
  Table as TableIcon,
  LayoutGrid,
  X,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { COX_AUTO_SAD_DATA } from '@/data/coxAutoSADData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SADArtifact, ADRItem } from '@/types';

export default function SADWorkbenchPage() {
  const [sadData, setSadData] = useLocalStorage<SADArtifact>('epam_b1_sad_data', COX_AUTO_SAD_DATA);
  const [activeTab, setActiveTab] = useState<'overview' | 'nfrs' | 'c4' | 'adrs' | 'stress-test'>('overview');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('Q1');
  const [revealedStrongAnswer, setRevealedStrongAnswer] = useState<Record<string, boolean>>({});
  const [userPracticeAnswers, setUserPracticeAnswers] = useLocalStorage<Record<string, string>>('epam_b1_user_qa_practice', {});
  const [copiedMd, setCopiedMd] = useState<boolean>(false);

  // ADR View Mode & Modal
  const [adrViewMode, setAdrViewMode] = useState<'matrix' | 'cards'>('matrix');
  const [activeAdrModal, setActiveAdrModal] = useState<ADRItem | null>(null);

  const resetToBaseline = () => {
    if (confirm('Reset SAD artifact to the official Cox Automotive production baseline? Any manual edits will be overwritten.')) {
      setSadData(COX_AUTO_SAD_DATA);
    }
  };

  const generateMarkdown = (): string => {
    return `# ${sadData.title}
**Context:** ${sadData.projectContext}
**Target Role:** EPAM Software Architect (Level 1 / B1) Full Session Defense

## 1. Business Scope & Drivers
${sadData.businessScope}

**Scale & Architecture Drivers:**
${sadData.scaleDrivers}

## 2. Non-Functional Requirements (NFRs)
| Category | Requirement | Target Metric | Verification Method | Failure Mitigation |
| :--- | :--- | :--- | :--- | :--- |
${sadData.nfrs.map(n => `| ${n.category} | ${n.requirement} | ${n.targetMetric} | ${n.verificationMethod} | ${n.failureMitigation} |`).join('\n')}

## 3. C4 Level 2 Container Topology
${sadData.c4Topology.description}

### Ingestion & Syndication Flow
${sadData.c4Topology.flowNarrative}

### Container Specifications
${sadData.c4Topology.containers.map(c => `### ${c.name} (${c.technology})\n- **Role:** ${c.role}\n- **Scaling Strategy:** ${c.scalingStrategy}\n`).join('\n')}

## 4. Architectural Decision Records (ADRs)
${sadData.adrs.map(adr => `### ${adr.id}: ${adr.title}
**Status:** ${adr.status}

**Context:**
${adr.context}

**Decision:**
${adr.decision}

**Consequences (Gains):**
${adr.consequencesGain.map(g => `- ${g}`).join('\n')}

**Consequences (Sacrifices):**
${adr.consequencesSacrifice.map(s => `- ${s}`).join('\n')}

**Rejected Alternatives:**
${adr.rejectionRationale}
`).join('\n---\n')}
`;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdown();
    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2500);
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Cox_Automotive_EPAM_B1_SAD_Artifact.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const activeQuestion = sadData.crossExaminations.find(q => q.id === selectedQuestionId) || sadData.crossExaminations[0];

  return (
    <div className="space-y-8 pb-20">
      {/* Header with High-Impact Typography */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-bold text-amber-400 uppercase tracking-wider">
            <FileText className="w-5 h-5" />
            <span>Artifact Defense (Part 1 - 45 Minutes)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Guided SAD Defense Workbench
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 max-w-4xl leading-relaxed">
            Official production Solution Architecture Document for <strong className="text-white font-semibold">Cox Automotive</strong> (AWS + Node.js + DynamoDB Single-Table).
            Review NFR tables, C4 topology registry, ADR decision matrix, and practice committee stress-tests.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
          <button
            onClick={resetToBaseline}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-sm font-bold transition-colors"
            title="Reset all fields to original Cox Automotive baseline"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Baseline</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold transition-colors border border-zinc-700 shadow-sm"
          >
            {copiedMd ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copied Markdown!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black transition-colors shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>Download .MD Artifact</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs - Roomy and Legible */}
      <div className="flex items-center space-x-2 border-b border-zinc-800 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: '1. Executive Scope & Drivers' },
          { id: 'nfrs', label: '2. NFR Table (2,500 RPS Peak)' },
          { id: 'c4', label: '3. C4 Level 2 Container Topology' },
          { id: 'adrs', label: '4. ADR Decision Matrix (1–3)' },
          { id: 'stress-test', label: '5. Committee Cross-Exam (6 Qs)', badge: 'Stress Test' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-3 text-sm sm:text-base font-bold rounded-t-2xl transition-all whitespace-nowrap flex items-center space-x-2.5 ${
              activeTab === tab.id
                ? 'bg-zinc-900 text-amber-400 border-t-2 border-amber-500 border-x border-zinc-800 shadow-md'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="px-2 py-0.5 rounded-md text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 shadow-xl">
          <div className="space-y-6 max-w-5xl">
            <div>
              <label className="block text-sm font-extrabold uppercase tracking-wider text-zinc-300 mb-2">
                Artifact Document Title
              </label>
              <input
                type="text"
                value={sadData.title}
                onChange={(e) => setSadData({ ...sadData, title: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-base sm:text-lg font-bold text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-extrabold uppercase tracking-wider text-zinc-300 mb-2">
                  Client / Production Context
                </label>
                <input
                  type="text"
                  value={sadData.projectContext}
                  onChange={(e) => setSadData({ ...sadData, projectContext: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-sm sm:text-base text-white focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-extrabold uppercase tracking-wider text-zinc-300 mb-2">
                  Key Scale Drivers (At a Glance)
                </label>
                <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm sm:text-base font-mono text-emerald-400 font-bold">
                  2,500 RPS Peak | 99.95% SLA | P99 &lt; 150ms | RPO=0 | RTO &lt; 15m
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-extrabold uppercase tracking-wider text-zinc-300 mb-2">
                Business Scope &amp; Architecture Mandate
              </label>
              <textarea
                rows={5}
                value={sadData.businessScope}
                onChange={(e) => setSadData({ ...sadData, businessScope: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm sm:text-base text-zinc-200 leading-relaxed focus:outline-none focus:border-amber-500 font-normal"
              />
            </div>

            <div>
              <label className="block text-sm font-extrabold uppercase tracking-wider text-zinc-300 mb-2">
                Scale Drivers &amp; System Constraints
              </label>
              <textarea
                rows={4}
                value={sadData.scaleDrivers}
                onChange={(e) => setSadData({ ...sadData, scaleDrivers: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm sm:text-base text-zinc-200 leading-relaxed focus:outline-none focus:border-amber-500 font-normal"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NFRs TABLE VIEW */}
      {activeTab === 'nfrs' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-sm text-indigo-200 leading-relaxed flex items-center space-x-3">
            <ShieldCheck className="w-6 h-6 text-indigo-400 flex-shrink-0" />
            <div>
              <strong className="text-white">EPAM Committee Tip:</strong> For B1 Software Architect, examiners assess whether your NFR metrics are strictly quantifiable and supported by concrete mitigation mechanisms. Hand-waving terms like &quot;high availability&quot; or &quot;performant&quot; result in immediate marginal ratings.
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950 text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-400">
                    <th className="py-4 px-6">Category &amp; Requirement</th>
                    <th className="py-4 px-6">Target Metric (SLA)</th>
                    <th className="py-4 px-6">Verification Method</th>
                    <th className="py-4 px-6">Failure Mitigation Architecture</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-sm sm:text-base">
                  {sadData.nfrs.map((nfr, idx) => (
                    <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-5 px-6 font-semibold text-white align-top">
                        <span className="inline-block px-2.5 py-0.5 rounded-lg bg-zinc-800 text-xs font-bold text-indigo-300 mb-1.5 border border-zinc-700">
                          {nfr.category}
                        </span>
                        <div className="text-base font-bold text-white">{nfr.requirement}</div>
                      </td>
                      <td className="py-5 px-6 font-mono text-emerald-400 font-black text-base align-top whitespace-nowrap">
                        {nfr.targetMetric}
                      </td>
                      <td className="py-5 px-6 text-zinc-300 align-top leading-relaxed max-w-sm">
                        {nfr.verificationMethod}
                      </td>
                      <td className="py-5 px-6 text-zinc-300 align-top leading-relaxed max-w-md font-medium">
                        {nfr.failureMitigation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: C4 CONTAINER TOPOLOGY */}
      {activeTab === 'c4' && (
        <div className="space-y-6">
          {/* Flow Narrative */}
          <div className="p-6 sm:p-8 rounded-3xl border border-zinc-800 bg-zinc-900/60 space-y-4 shadow-xl">
            <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>C4 Level 2 Container Ingestion &amp; Syndication Pipeline Narrative</span>
            </h3>
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 text-sm sm:text-base font-mono text-cyan-300 leading-relaxed">
              API Gateway &rarr; Node.js Ingest Worker (ECS Fargate) &rarr; AWS SQS (Backpressure Buffer) &rarr; Stream Processing Service &rarr; Amazon DynamoDB (Single-Table Store) &rarr; DynamoDB Streams &rarr; EventBridge &rarr; OpenSearch/Algolia Search Cluster.
            </div>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              {sadData.c4Topology.flowNarrative}
            </p>
          </div>

          {/* Container Registry Table */}
          <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-xl">
            <div className="p-6 border-b border-zinc-800 bg-zinc-950/80">
              <h4 className="text-lg font-bold text-white">Container Architecture &amp; Scaling Registry</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950 text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-400">
                    <th className="py-4 px-6">Container Name</th>
                    <th className="py-4 px-6">Technology Stack</th>
                    <th className="py-4 px-6">Architectural Role</th>
                    <th className="py-4 px-6">Scaling &amp; Resiliency Strategy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-sm sm:text-base">
                  {sadData.c4Topology.containers.map((container, idx) => (
                    <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-5 px-6 font-bold text-white align-top">
                        <span className="text-base sm:text-lg">{container.name}</span>
                      </td>
                      <td className="py-5 px-6 align-top">
                        <span className="inline-block px-3 py-1 rounded-lg bg-zinc-950 text-cyan-300 font-mono text-xs sm:text-sm font-bold border border-zinc-800">
                          {container.technology}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-zinc-300 align-top leading-relaxed max-w-sm">
                        {container.role}
                      </td>
                      <td className="py-5 px-6 text-zinc-300 align-top leading-relaxed max-w-md font-medium">
                        {container.scalingStrategy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ADRs DECISION MATRIX & MODAL VIEW */}
      {activeTab === 'adrs' && (
        <div className="space-y-6">
          {/* View Toggle */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Architectural Decision Records (ADRs 01–03)</span>
            </h3>

            <div className="flex items-center space-x-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
              <button
                onClick={() => setAdrViewMode('matrix')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                  adrViewMode === 'matrix'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <TableIcon className="w-4 h-4" />
                <span>Decision Matrix (Table)</span>
              </button>
              <button
                onClick={() => setAdrViewMode('cards')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                  adrViewMode === 'cards'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Document Cards</span>
              </button>
            </div>
          </div>

          {/* ADR VIEW 1: COMPARISON MATRIX TABLE */}
          {adrViewMode === 'matrix' && (
            <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-950 text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-400">
                      <th className="py-4 px-6">ADR #</th>
                      <th className="py-4 px-6">Architectural Context &amp; Driver</th>
                      <th className="py-4 px-6">Decision Taken</th>
                      <th className="py-4 px-6">Primary Gain</th>
                      <th className="py-4 px-6">Primary Sacrifice / Tax</th>
                      <th className="py-4 px-6 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 text-sm sm:text-base">
                    {sadData.adrs.map((adr) => (
                      <tr
                        key={adr.id}
                        className="hover:bg-zinc-800/40 transition-colors group cursor-pointer"
                        onClick={() => setActiveAdrModal(adr)}
                      >
                        <td className="py-5 px-6 font-bold text-white align-top">
                          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-1">
                            {adr.id}
                          </span>
                          <div className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {adr.title}
                          </div>
                        </td>
                        <td className="py-5 px-6 text-zinc-300 align-top leading-relaxed max-w-xs">
                          {adr.context}
                        </td>
                        <td className="py-5 px-6 text-indigo-200 font-semibold align-top leading-relaxed max-w-sm">
                          {adr.decision}
                        </td>
                        <td className="py-5 px-6 text-emerald-300 align-top leading-relaxed max-w-xs">
                          {adr.consequencesGain[0]}
                        </td>
                        <td className="py-5 px-6 text-amber-300 align-top leading-relaxed max-w-xs">
                          {adr.consequencesSacrifice[0]}
                        </td>
                        <td className="py-5 px-6 text-right align-top whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveAdrModal(adr);
                            }}
                            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 group-hover:bg-indigo-600 text-zinc-300 group-hover:text-white font-bold text-xs sm:text-sm transition-all shadow-sm"
                          >
                            <span>Inspect ADR</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ADR VIEW 2: EXPANDED DOCUMENT CARDS */}
          {adrViewMode === 'cards' && (
            <div className="grid grid-cols-1 gap-6">
              {sadData.adrs.map((adr) => (
                <div key={adr.id} className="p-8 rounded-3xl border border-zinc-800 bg-zinc-900/50 space-y-5 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 rounded-xl text-sm font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                        {adr.id}
                      </span>
                      <h3 className="text-xl font-black text-white">{adr.title}</h3>
                    </div>
                    <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      Status: {adr.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <strong className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Context &amp; Driver:</strong>
                    <p className="text-sm sm:text-base text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80">
                      {adr.context}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <strong className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Accepted Architectural Decision:</strong>
                    <p className="text-base text-indigo-200 font-semibold leading-relaxed bg-indigo-950/20 p-4 rounded-2xl border border-indigo-500/30">
                      {adr.decision}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                      <span className="text-xs font-black text-emerald-400 uppercase">Consequences (Gains)</span>
                      <ul className="text-sm text-zinc-200 space-y-1.5">
                        {adr.consequencesGain.map((g, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                      <span className="text-xs font-black text-amber-400 uppercase">Consequences (Sacrifices &amp; Taxes)</span>
                      <ul className="text-sm text-zinc-200 space-y-1.5">
                        {adr.consequencesSacrifice.map((s, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="text-amber-400 font-bold">&bull;</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                    <span className="text-xs font-bold text-rose-400 uppercase block">
                      Why Alternatives Were Formally Rejected:
                    </span>
                    <p className="text-sm text-zinc-200 leading-relaxed">{adr.rejectionRationale}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: COMMITTEE STRESS TESTING */}
      {activeTab === 'stress-test' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Question Selector List */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-zinc-400 mb-3">
              6 Forensic Defense Questions
            </h3>
            {sadData.crossExaminations.map((q) => {
              const isSelected = selectedQuestionId === q.id;
              const hasDraft = !!userPracticeAnswers[q.id];
              return (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuestionId(q.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/30 shadow-lg ring-1 ring-indigo-500/50'
                      : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-indigo-400">{q.id}: {q.focusArea}</span>
                    {hasDraft && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" title="Draft practiced" />
                    )}
                  </div>
                  <p className="text-sm text-white font-semibold line-clamp-2">{q.question}</p>
                  <div className="text-xs text-zinc-400 mt-2 font-mono">{q.interrogator}</div>
                </button>
              );
            })}
          </div>

          {/* Active Question Deep Dive & Answer Comparison */}
          <div className="lg:col-span-2 space-y-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 shadow-xl">
            <div className="space-y-3 border-b border-zinc-800 pb-5">
              <div className="flex items-center space-x-3 text-sm">
                <span className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-extrabold border border-rose-500/30">
                  {activeQuestion.id}
                </span>
                <span className="text-zinc-300 font-semibold">{activeQuestion.interrogator}</span>
                <span className="text-zinc-600">|</span>
                <span className="text-cyan-400 font-bold">{activeQuestion.focusArea}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                &quot;{activeQuestion.question}&quot;
              </h2>
            </div>

            {/* Practice Speaking Input */}
            <div className="space-y-2">
              <label className="block text-sm font-bold uppercase tracking-wider text-zinc-300">
                Candidate Spoken Defense Practice (Timed &bull; 45 Seconds):
              </label>
              <textarea
                rows={5}
                placeholder="Speak aloud and type your justification using quantified NFRs, Gain vs Sacrifice trade-offs, and failure recovery mechanisms..."
                value={userPracticeAnswers[activeQuestion.id] || ''}
                onChange={(e) => setUserPracticeAnswers({ ...userPracticeAnswers, [activeQuestion.id]: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-base text-white focus:outline-none focus:border-indigo-500 leading-relaxed font-normal"
              />
            </div>

            {/* Evaluation Criteria Checklist */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                What the EPAM Committee is Evaluating:
              </span>
              <ul className="text-sm text-zinc-300 space-y-1.5 pt-1">
                {activeQuestion.evaluationCriteria.map((crit, idx) => (
                  <li key={idx} className="flex items-center space-x-2.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Toggle Strong vs Weak Answer */}
            <div className="pt-2">
              <button
                onClick={() => setRevealedStrongAnswer(prev => ({ ...prev, [activeQuestion.id]: !prev[activeQuestion.id] }))}
                className="w-full py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {revealedStrongAnswer[activeQuestion.id]
                    ? 'Hide Model Answer Comparison'
                    : 'Reveal Strong vs. Weak Model Answer Comparison'}
                </span>
              </button>
            </div>

            {revealedStrongAnswer[activeQuestion.id] && (
              <div className="space-y-5 pt-2">
                {/* Weak Answer */}
                <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                  <span className="text-xs font-black text-rose-400 uppercase flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Weak / Junior Engineer Response (Rejection Bar):
                  </span>
                  <p className="text-sm text-rose-200/90 italic leading-relaxed">
                    &quot;{activeQuestion.weakAnswer}&quot;
                  </p>
                </div>

                {/* Strong B1 Defense */}
                <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2.5">
                  <span className="text-xs font-black text-emerald-400 uppercase flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-400" /> Senior Architect B1 Gold Standard Defense:
                  </span>
                  <p className="text-base text-zinc-100 font-medium leading-relaxed italic border-l-4 border-emerald-400 pl-4">
                    &quot;{activeQuestion.strongAnswer}&quot;
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADR DEEP DIVE MODAL */}
      {activeAdrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-950">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {activeAdrModal.id}
                </span>
                <span className="text-sm font-bold text-emerald-400">Status: {activeAdrModal.status}</span>
              </div>
              <button
                onClick={() => setActiveAdrModal(null)}
                className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {activeAdrModal.title}
              </h2>

              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Context &amp; Business Driver:</span>
                <p className="text-sm sm:text-base text-zinc-200 leading-relaxed bg-zinc-950 p-5 rounded-2xl border border-zinc-800">
                  {activeAdrModal.context}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Accepted Decision:</span>
                <p className="text-base sm:text-lg text-indigo-200 font-semibold leading-relaxed bg-indigo-950/20 p-5 rounded-2xl border border-indigo-500/30">
                  {activeAdrModal.decision}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                  <span className="text-xs font-black text-emerald-400 uppercase">Consequences (Gains)</span>
                  <ul className="text-sm text-zinc-200 space-y-2">
                    {activeAdrModal.consequencesGain.map((g, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                  <span className="text-xs font-black text-amber-400 uppercase">Consequences (Sacrifices &amp; Taxes)</span>
                  <ul className="text-sm text-zinc-200 space-y-2">
                    {activeAdrModal.consequencesSacrifice.map((s, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-amber-400 font-bold">&bull;</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                <span className="text-xs font-bold text-rose-400 uppercase block">
                  Why Alternatives Were Formally Rejected:
                </span>
                <p className="text-sm text-zinc-200 leading-relaxed">{activeAdrModal.rejectionRationale}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end p-6 border-t border-zinc-800 bg-zinc-950">
              <button
                onClick={() => setActiveAdrModal(null)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all"
              >
                Close ADR View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
