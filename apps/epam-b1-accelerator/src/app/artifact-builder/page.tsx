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
  Award
} from 'lucide-react';
import { COX_AUTO_SAD_DATA } from '@/data/coxAutoSADData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SADArtifact } from '@/types';

export default function SADWorkbenchPage() {
  const [sadData, setSadData] = useLocalStorage<SADArtifact>('epam_b1_sad_data', COX_AUTO_SAD_DATA);
  const [activeTab, setActiveTab] = useState<'overview' | 'nfrs' | 'c4' | 'adrs' | 'stress-test'>('overview');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('Q1');
  const [revealedStrongAnswer, setRevealedStrongAnswer] = useState<Record<string, boolean>>({});
  const [userPracticeAnswers, setUserPracticeAnswers] = useLocalStorage<Record<string, string>>('epam_b1_user_qa_practice', {});
  const [copiedMd, setCopiedMd] = useState<boolean>(false);

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
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Artifact Defense (Part 1 - 45 Minutes)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Guided SAD Defense Workbench
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Official production SAD for <strong className="text-zinc-200">Cox Automotive</strong> (AWS + Node.js + DynamoDB).
            Review NFR metrics, C4 topology, 3 core ADRs, and run committee stress-tests.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <button
            onClick={resetToBaseline}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-xs font-medium transition-colors"
            title="Reset all fields to original Cox Automotive baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition-colors border border-zinc-700 shadow-sm"
          >
            {copiedMd ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied Markdown!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .MD Artifact</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-zinc-800 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: '1. Executive Scope & Drivers' },
          { id: 'nfrs', label: '2. NFR Table (2,500 RPS)' },
          { id: 'c4', label: '3. C4 Container Topology' },
          { id: 'adrs', label: '4. Core ADRs (1-3)' },
          { id: 'stress-test', label: '5. Committee Cross-Exam (6 Qs)', badge: 'Stress Test' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all whitespace-nowrap flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-zinc-900 text-indigo-400 border-t-2 border-indigo-500 border-x border-zinc-800'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Artifact Title
              </label>
              <input
                type="text"
                value={sadData.title}
                onChange={(e) => setSadData({ ...sadData, title: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Client / Production Context
                </label>
                <input
                  type="text"
                  value={sadData.projectContext}
                  onChange={(e) => setSadData({ ...sadData, projectContext: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Key Scale Drivers (At a glance)
                </label>
                <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-emerald-400">
                  2,500 RPS Peak | 99.95% SLA | P99 &lt; 150ms | RPO=0 | RTO &lt; 15m
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Business Scope &amp; Architecture Mandate
              </label>
              <textarea
                rows={4}
                value={sadData.businessScope}
                onChange={(e) => setSadData({ ...sadData, businessScope: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 leading-relaxed focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Scale Drivers &amp; System Constraints
              </label>
              <textarea
                rows={3}
                value={sadData.scaleDrivers}
                onChange={(e) => setSadData({ ...sadData, scaleDrivers: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 leading-relaxed focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NFRs */}
      {activeTab === 'nfrs' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-300">
            <strong>Committee Tip:</strong> For B1 Software Architect, the panel evaluates whether your NFR numbers are measurable and backed by explicit failure mitigations. Avoid unquantified words like &quot;scalable&quot; or &quot;high availability&quot;.
          </div>

          <div className="overflow-x-auto border border-zinc-800 rounded-xl bg-zinc-900/40">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/90 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5 font-bold">Category</th>
                  <th className="p-3.5 font-bold">Target Metric</th>
                  <th className="p-3.5 font-bold">Verification Method</th>
                  <th className="p-3.5 font-bold">Failure Mitigation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {sadData.nfrs.map((nfr, idx) => (
                  <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-3.5 font-semibold text-white whitespace-nowrap align-top">
                      <span className="inline-block px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-indigo-300 mb-1">
                        {nfr.category}
                      </span>
                      <div>{nfr.requirement}</div>
                    </td>
                    <td className="p-3.5 font-mono text-emerald-400 align-top">
                      {nfr.targetMetric}
                    </td>
                    <td className="p-3.5 text-zinc-300 align-top">
                      {nfr.verificationMethod}
                    </td>
                    <td className="p-3.5 text-zinc-400 align-top">
                      {nfr.failureMitigation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: C4 TOPOLOGY */}
      {activeTab === 'c4' && (
        <div className="space-y-6">
          {/* Flow Narrative */}
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              C4 Level 2 Container Ingestion &amp; Syndication Narrative
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-mono bg-zinc-950 p-4 rounded-lg border border-zinc-800/80">
              API Gateway &rarr; Node.js Ingest Worker (AWS ECS Fargate) &rarr; AWS SQS (Backpressure Buffer) &rarr; Stream Processing Service &rarr; Amazon DynamoDB (Single-Table Inventory Store) &rarr; DynamoDB Streams &rarr; Amazon EventBridge &rarr; OpenSearch/Algolia Search Cluster.
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {sadData.c4Topology.flowNarrative}
            </p>
          </div>

          {/* Container Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sadData.c4Topology.containers.map((container, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{container.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-cyan-400 border border-zinc-700">
                    {container.technology}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  <strong>Role:</strong> {container.role}
                </p>
                <p className="text-xs text-zinc-400 pt-1 border-t border-zinc-800/80">
                  <strong className="text-zinc-500">Scaling Strategy:</strong> {container.scalingStrategy}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ADRs */}
      {activeTab === 'adrs' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {sadData.adrs.map((adr) => (
              <div key={adr.id} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {adr.id}
                    </span>
                    <h3 className="text-base font-bold text-white">{adr.title}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Status: {adr.status}
                  </span>
                </div>

                <div className="text-xs text-zinc-300 space-y-1">
                  <strong className="text-zinc-400 uppercase tracking-wider text-[10px]">Context &amp; Architectural Driver:</strong>
                  <p className="leading-relaxed bg-zinc-950 p-3 rounded-lg border border-zinc-800/80">{adr.context}</p>
                </div>

                <div className="text-xs text-zinc-300 space-y-1">
                  <strong className="text-indigo-400 uppercase tracking-wider text-[10px]">Accepted Architectural Decision:</strong>
                  <p className="leading-relaxed bg-indigo-950/15 p-3 rounded-lg border border-indigo-500/20 font-medium text-indigo-200">{adr.decision}</p>
                </div>

                {/* Consequences Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-lg bg-emerald-950/15 border border-emerald-500/20 space-y-1.5">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase">Consequences (Gains)</span>
                    <ul className="text-xs text-zinc-300 space-y-1">
                      {adr.consequencesGain.map((g, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-lg bg-amber-950/15 border border-amber-500/20 space-y-1.5">
                    <span className="text-[11px] font-bold text-amber-400 uppercase">Consequences (Sacrifices &amp; Taxes)</span>
                    <ul className="text-xs text-zinc-300 space-y-1">
                      {adr.consequencesSacrifice.map((s, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Rejection Rationale */}
                <div className="p-3.5 rounded-lg bg-rose-950/15 border border-rose-500/20 text-xs">
                  <span className="font-bold text-rose-400 uppercase text-[10px] block mb-1">
                    Why Alternatives Were Formally Rejected:
                  </span>
                  <p className="text-zinc-300 leading-relaxed">{adr.rejectionRationale}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: COMMITTEE STRESS TESTING */}
      {activeTab === 'stress-test' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Selector List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              6 Forensic Defense Questions
            </h3>
            {sadData.crossExaminations.map((q) => {
              const isSelected = selectedQuestionId === q.id;
              const hasDraft = !!userPracticeAnswers[q.id];
              return (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuestionId(q.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/30 shadow-md'
                      : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                    <span className="text-indigo-400">{q.id}: {q.focusArea}</span>
                    {hasDraft && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400" title="Draft practiced" />
                    )}
                  </div>
                  <p className="text-xs text-white font-medium line-clamp-2">{q.question}</p>
                  <div className="text-[10px] text-zinc-500 mt-1">{q.interrogator}</div>
                </button>
              );
            })}
          </div>

          {/* Active Question Deep Dive & Answer Comparison */}
          <div className="lg:col-span-2 space-y-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
            <div className="space-y-2 border-b border-zinc-800 pb-4">
              <div className="flex items-center space-x-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                  {activeQuestion.id}
                </span>
                <span className="text-zinc-400">{activeQuestion.interrogator}</span>
                <span className="text-zinc-600">|</span>
                <span className="text-cyan-400 font-medium">{activeQuestion.focusArea}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                &quot;{activeQuestion.question}&quot;
              </h2>
            </div>

            {/* Practice Speaking Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                Your Spoken Defense Practice (Record Your Answer):
              </label>
              <textarea
                rows={4}
                placeholder="Type how you would speak this answer aloud to Dmitry or Elena in under 45 seconds..."
                value={userPracticeAnswers[activeQuestion.id] || ''}
                onChange={(e) => setUserPracticeAnswers({ ...userPracticeAnswers, [activeQuestion.id]: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>

            {/* Evaluation Criteria Checklist */}
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                What the EPAM Committee is Listening For:
              </span>
              <ul className="text-xs text-zinc-300 space-y-1">
                {activeQuestion.evaluationCriteria.map((crit, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Toggle Strong vs Weak Answer */}
            <div className="pt-2">
              <button
                onClick={() => setRevealedStrongAnswer(prev => ({ ...prev, [activeQuestion.id]: !prev[activeQuestion.id] }))}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
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
              <div className="space-y-4 pt-2">
                {/* Weak Answer */}
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1.5">
                  <span className="text-[11px] font-bold text-rose-400 uppercase flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Weak / Junior Engineer Response (Rejection Bar):
                  </span>
                  <p className="text-xs text-rose-200/80 italic leading-relaxed">
                    &quot;{activeQuestion.weakAnswer}&quot;
                  </p>
                </div>

                {/* Strong B1 Defense */}
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> Strong Software Architect B1 Model Defense:
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-100 font-medium leading-relaxed italic border-l-2 border-emerald-400 pl-3">
                    &quot;{activeQuestion.strongAnswer}&quot;
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
