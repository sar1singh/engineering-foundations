'use client';

import React, { useState, useMemo } from 'react';
import { 
  Award, 
  Search, 
  Filter, 
  CheckCircle2, 
  CircleDot, 
  Circle, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  AlertTriangle, 
  HelpCircle, 
  Sparkles,
  BookOpen,
  Code2,
  Terminal,
  FileCheck,
  Send,
  Eye,
  RotateCcw,
  ShieldAlert,
  Flame,
  Briefcase
} from 'lucide-react';
import { SYLLABUS_DATA } from '@/data/syllabusData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CompetencyItem, EvaluationCriterion } from '@/types';

interface EvaluationResult {
  score: 1 | 2 | 3 | 4;
  label: 'Unsatisfactory' | 'Marginal' | 'B1 Solid Pass' | 'B2 Distinction';
  feedback: string;
  checklist: { criterion: string; passed: boolean }[];
}

export default function RoadmapPage() {
  const [competencyStatus, setCompetencyStatus] = useLocalStorage<Record<string, 'unmastered' | 'learning' | 'mastered'>>(
    'epam_b1_competencies',
    {}
  );

  const [userExerciseAnswers, setUserExerciseAnswers] = useLocalStorage<Record<string, string>>(
    'epam_b1_exercise_answers',
    {}
  );

  const [savedEvaluations, setSavedEvaluations] = useLocalStorage<Record<string, EvaluationResult>>(
    'epam_b1_exercise_evaluations',
    {}
  );

  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'all' | 'roadmaps' | 'exercises'>('all');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [cardTabs, setCardTabs] = useState<Record<string, 'defense' | 'roadmap' | 'exercise'>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const domains = ['All', 'Solution Arch', 'Application Arch', 'Cloud', 'SDLC Processes', 'Leadership & Soft', 'AI', 'Business'];
  const levels = ['All', 'Advanced', 'Intermediate', 'Novice', 'NAT B2'];

  const toggleExpand = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    SYLLABUS_DATA.forEach(item => { allExpanded[item.id] = true; });
    setExpandedCards(allExpanded);
  };

  const collapseAll = () => {
    setExpandedCards({});
  };

  const setCardActiveTab = (id: string, tab: 'defense' | 'roadmap' | 'exercise') => {
    setCardTabs(prev => ({ ...prev, [id]: tab }));
    if (!expandedCards[id]) {
      setExpandedCards(prev => ({ ...prev, [id]: true }));
    }
  };

  const updateStatus = (id: string, status: 'unmastered' | 'learning' | 'mastered') => {
    setCompetencyStatus(prev => ({
      ...prev,
      [id]: status
    }));
  };

  const handleCopyScript = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Evaluate candidate's exercise response
  const evaluateExerciseResponse = (compId: string, rubric: EvaluationCriterion[]) => {
    const text = userExerciseAnswers[compId] || '';
    const lower = text.toLowerCase();
    const wordCount = text.trim().split(/\s+/).length;

    if (wordCount < 20) {
      alert('Please provide a substantive architectural response (at least 20 words) before evaluating.');
      return;
    }

    const hasNumbers = /\d+/.test(text) || lower.includes('rps') || lower.includes('ms') || lower.includes('sla') || lower.includes('latency');
    const hasTradeoffs = lower.includes('trade-off') || lower.includes('gain') || lower.includes('sacrifice') || lower.includes('cost') || lower.includes('at the expense of');
    const hasComponents = lower.includes('dynamodb') || lower.includes('sqs') || lower.includes('fargate') || lower.includes('api gateway') || lower.includes('redis') || lower.includes('c4') || lower.includes('eventbridge') || lower.includes('circuit breaker') || lower.includes('hexagonal') || lower.includes('adapter') || lower.includes('pact') || lower.includes('dora');
    const hasFailureHandling = lower.includes('failover') || lower.includes('dlq') || lower.includes('retry') || lower.includes('circuit breaker') || lower.includes('rollback') || lower.includes('partition') || lower.includes('timeout') || lower.includes('mitigat');

    const checklist = rubric.map((crit, idx) => {
      let passed = false;
      if (idx === 0) passed = hasComponents && wordCount >= 30;
      else if (idx === 1) passed = hasNumbers || hasTradeoffs;
      else passed = hasFailureHandling || hasTradeoffs;
      return { criterion: crit.criterion, passed };
    });

    const passedCount = checklist.filter(c => c.passed).length;
    let score: 1 | 2 | 3 | 4 = 1;
    let label: EvaluationResult['label'] = 'Unsatisfactory';
    let feedback = '';

    if (passedCount <= 1 || wordCount < 30) {
      score = 1;
      label = 'Unsatisfactory';
      feedback = 'The response is too brief or lacks concrete architectural structure. It misses quantified NFR targets and explicit component interactions.';
    } else if (passedCount === 2) {
      score = 2;
      label = 'Marginal';
      feedback = 'Approaching standard, but lacks either explicit Gain vs. Sacrifice trade-off defense or failure mitigation mechanisms.';
    } else if (passedCount === 3 && wordCount >= 50) {
      score = 3;
      label = 'B1 Solid Pass';
      feedback = 'Solid EPAM B1 Software Architect response! Directly addresses the client constraints, names concrete component boundaries, and defends architectural trade-offs.';
    } else {
      score = 4;
      label = 'B2 Distinction';
      feedback = 'Exceptional B2 distinction performance! Demonstrates deep full-lifecycle architecture: clear component topology, quantified NFR calculations, failure blast-radius containment, and commercial trade-off defense.';
    }

    const result: EvaluationResult = { score, label, feedback, checklist };
    setSavedEvaluations(prev => ({ ...prev, [compId]: result }));
  };

  const filteredCompetencies = useMemo(() => {
    return SYLLABUS_DATA.filter(item => {
      const matchesDomain = selectedDomain === 'All' || item.domain === selectedDomain;
      const matchesLevel = selectedLevel === 'All' || item.targetBar === selectedLevel;
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.defenseScript30s.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.analogy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.interviewExercise.scenarioTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.interviewExercise.businessContext.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDomain && matchesLevel && matchesSearch;
    });
  }, [selectedDomain, selectedLevel, searchQuery]);

  const masteredCount = Object.values(competencyStatus).filter(v => v === 'mastered').length;
  const practicedExercisesCount = Object.keys(userExerciseAnswers).filter(k => (userExerciseAnswers[k] || '').trim().length > 10).length;

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Official EPAM LevelUp Architecture Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            LevelUp Skills, Learning Roadmaps &amp; Interview Practice
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-4xl">
            Master all 38 competencies with complete theoretical foundations, hands-on implementation labs, and real interview use-case exercises with automated rubric evaluation.
          </p>
        </div>

        {/* Global Progress Metrics */}
        <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
          <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs">
            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-500">Skills Mastered</div>
              <div className="font-bold text-white">
                <span className="text-emerald-400">{masteredCount}</span> / 38
              </div>
            </div>
            <div className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-8 h-8 flex items-center justify-center">
              {Math.round((masteredCount / 38) * 100)}%
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs">
            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-500">Exercises Practiced</div>
              <div className="font-bold text-white">
                <span className="text-cyan-400">{practicedExercisesCount}</span> / 38
              </div>
            </div>
            <div className="text-xs font-black text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-full w-8 h-8 flex items-center justify-center">
              {Math.round((practicedExercisesCount / 38) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/80 border border-zinc-800 rounded-xl p-3">
        <div className="flex items-center space-x-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={() => {
              setViewMode('all');
              setCardTabs({});
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              viewMode === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Skills Overview
          </button>
          <button
            onClick={() => {
              setViewMode('roadmaps');
              setCardTabs({});
              expandAll();
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'roadmaps'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Implementation Roadmaps (Labs)</span>
          </button>
          <button
            onClick={() => {
              setViewMode('exercises');
              setCardTabs({});
              expandAll();
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'exercises'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Interview Practice &amp; Evaluator (38)</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by competency title, technology (e.g. DynamoDB, SQS, Hexagonal), or interview scenario..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Level Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-800/80">
          <span className="text-[11px] font-semibold text-zinc-400 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Target Bar:
          </span>
          {levels.map((lvl) => {
            const isActive = selectedLevel === lvl;
            return (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {lvl === 'Advanced' ? 'Box 3: Advanced' : lvl === 'Intermediate' ? 'Box 2: Intermediate' : lvl === 'Novice' ? 'Box 1: Novice' : lvl}
              </button>
            );
          })}
        </div>

        {/* Domain Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-zinc-400 mr-2">Domain:</span>
          {domains.map((dom) => {
            const isActive = selectedDomain === dom;
            return (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-zinc-200 text-zinc-950 font-bold'
                    : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {dom}
              </button>
            );
          })}
        </div>
      </div>

      {/* Competencies List */}
      <div className="space-y-4">
        <div className="text-xs text-zinc-400 flex items-center justify-between px-1">
          <span>Showing {filteredCompetencies.length} of 38 competencies</span>
        </div>

        {filteredCompetencies.map((comp) => {
          const status = competencyStatus[comp.id] || 'unmastered';
          const isExpanded = expandedCards[comp.id] || false;
          const activeTab = cardTabs[comp.id] || (viewMode === 'roadmaps' ? 'roadmap' : viewMode === 'exercises' ? 'exercise' : 'defense');
          const hasDraft = !!(userExerciseAnswers[comp.id] || '').trim();
          const evaluation = savedEvaluations[comp.id];

          const getBoxColor = (box: number) => {
            if (box === 3) return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
            if (box === 2) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
            return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
          };

          return (
            <div
              key={comp.id}
              className={`rounded-2xl border transition-all ${
                status === 'mastered'
                  ? 'border-emerald-500/40 bg-zinc-900/80 shadow-lg'
                  : status === 'learning'
                  ? 'border-amber-500/30 bg-zinc-900/60'
                  : 'border-zinc-800 bg-zinc-950/80 hover:border-zinc-700'
              }`}
            >
              {/* Header Row */}
              <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1 cursor-pointer" onClick={() => toggleExpand(comp.id)}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                      {comp.domain}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getBoxColor(comp.visualBox)}`}>
                      Box {comp.visualBox}: {comp.targetBar}
                    </span>
                    {/* Visual 4-box indicator */}
                    <div className="flex items-center space-x-1" title={`Target: Box ${comp.visualBox}`}>
                      {[1, 2, 3, 4].map(boxNum => (
                        <span
                          key={boxNum}
                          className={`w-2 h-2 rounded-sm ${
                            boxNum <= comp.visualBox
                              ? 'bg-indigo-500'
                              : 'bg-zinc-800 border border-zinc-700'
                          }`}
                        />
                      ))}
                    </div>

                    {evaluation && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        evaluation.score >= 3 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        Exam Score: {evaluation.score}/4 ({evaluation.label})
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {comp.title}
                    {status === 'mastered' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                    <span className="line-clamp-1 italic text-zinc-300">
                      Analogy: &quot;{comp.analogy}&quot;
                    </span>
                  </div>
                  <div className="text-[11px] text-cyan-400 font-mono pt-0.5 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Real Interview Case: {comp.interviewExercise.scenarioTitle}</span>
                  </div>
                </div>

                {/* Status Toggles & Expand Arrow */}
                <div className="flex items-center space-x-2 self-start md:self-auto">
                  <div className="inline-flex rounded-lg bg-zinc-900 p-0.5 border border-zinc-800">
                    <button
                      onClick={() => updateStatus(comp.id, 'unmastered')}
                      className={`px-2 py-1 text-[11px] font-medium rounded-md transition-all ${
                        status === 'unmastered'
                          ? 'bg-zinc-800 text-zinc-200 shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                      title="Mark as unreviewed"
                    >
                      Unread
                    </button>
                    <button
                      onClick={() => updateStatus(comp.id, 'learning')}
                      className={`px-2 py-1 text-[11px] font-medium rounded-md transition-all ${
                        status === 'learning'
                          ? 'bg-amber-500/20 text-amber-300 shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                      title="Currently practicing"
                    >
                      Practicing
                    </button>
                    <button
                      onClick={() => updateStatus(comp.id, 'mastered')}
                      className={`px-2 py-1 text-[11px] font-medium rounded-md transition-all ${
                        status === 'mastered'
                          ? 'bg-emerald-500/20 text-emerald-300 shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                      title="Mastered 30s defense"
                    >
                      Mastered
                    </button>
                  </div>

                  <button
                    onClick={() => toggleExpand(comp.id)}
                    className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                    aria-label="Toggle details"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expandable Deep Dive Body with 3 Distinct Modes */}
              {isExpanded && (
                <div className="border-t border-zinc-800/80 p-5 space-y-5 bg-zinc-950/70">
                  {/* Card Sub-Navigation Tabs */}
                  <div className="flex items-center space-x-2 border-b border-zinc-800 pb-2">
                    <button
                      onClick={() => setCardActiveTab(comp.id, 'defense')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        activeTab === 'defense'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>30s Defense &amp; Theory</span>
                    </button>

                    <button
                      onClick={() => setCardActiveTab(comp.id, 'roadmap')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        activeTab === 'roadmap'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Implementation Roadmap &amp; Labs</span>
                    </button>

                    <button
                      onClick={() => setCardActiveTab(comp.id, 'exercise')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        activeTab === 'exercise'
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Real Interview Exercise &amp; Evaluator</span>
                      {hasDraft && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    </button>
                  </div>

                  {/* TAB 1: DEFENSE & THEORY */}
                  {activeTab === 'defense' && (
                    <div className="space-y-4">
                      {/* Analogy & Trade-Off Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-lg bg-zinc-900/70 border border-zinc-800/80">
                          <div className="text-[11px] uppercase font-bold text-indigo-400 mb-1 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" /> Plain-English Analogy
                          </div>
                          <p className="text-xs text-zinc-300 leading-relaxed">{comp.analogy}</p>
                        </div>

                        <div className="p-3.5 rounded-lg bg-zinc-900/70 border border-zinc-800/80">
                          <div className="text-[11px] uppercase font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" /> Gain vs. Sacrifice Trade-off
                          </div>
                          <p className="text-xs text-zinc-300 leading-relaxed">{comp.gainVsSacrifice}</p>
                        </div>
                      </div>

                      {/* Verbatim 30-Second Committee Defense Script */}
                      <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 relative space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-indigo-400" /> Verbatim 30-Second Committee Defense Script
                          </span>
                          <button
                            onClick={() => handleCopyScript(comp.id, comp.defenseScript30s)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-semibold transition-colors"
                          >
                            {copiedId === comp.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Script</span>
                              </>
                            )}
                          </button>
                        </div>
                        <blockquote className="text-xs sm:text-sm text-zinc-200 font-medium leading-relaxed italic border-l-2 border-indigo-400 pl-3">
                          &quot;{comp.defenseScript30s}&quot;
                        </blockquote>
                      </div>

                      {/* Pitfalls & Challenge Questions */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-rose-400 uppercase flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Committee Red-Flag Pitfalls
                          </span>
                          <ul className="text-xs text-zinc-400 space-y-1">
                            {comp.pitfalls.map((p, idx) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <span className="text-rose-500 font-bold">•</span>
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-cyan-400 uppercase flex items-center gap-1">
                            <HelpCircle className="w-3.5 h-3.5" /> Potential Panel Challenge Questions
                          </span>
                          <ul className="text-xs text-zinc-400 space-y-1">
                            {comp.keyQuestions.map((q, idx) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <span className="text-cyan-500 font-bold">•</span>
                                <span>{q}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: LEARNING ROADMAP & IMPLEMENTATION LABS */}
                  {activeTab === 'roadmap' && (
                    <div className="space-y-5">
                      {/* Theory & Recommended Literature */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4" /> Core Theoretical Foundations
                          </div>
                          <ul className="text-xs text-zinc-300 space-y-1.5">
                            {comp.learningRoadmap.coreTheory.map((theory, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-amber-400 font-bold">&bull;</span>
                                <span>{theory}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                            <FileCheck className="w-4 h-4" /> Recommended Literature &amp; Standards
                          </div>
                          <ul className="text-xs text-zinc-300 space-y-1.5">
                            {comp.learningRoadmap.recommendedReading.map((book, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-cyan-400 font-bold">&bull;</span>
                                <span className="italic">{book}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Step-by-Step Hands-On Implementation Milestones */}
                      <div className="space-y-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-emerald-400" />
                          <span>Hands-On Engineering Implementation Milestones</span>
                        </div>

                        <div className="space-y-3">
                          {comp.learningRoadmap.implementationMilestones.map((ms) => (
                            <div key={ms.step} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center border border-emerald-500/30">
                                    {ms.step}
                                  </span>
                                  <h4 className="text-xs font-bold text-white">{ms.title}</h4>
                                </div>
                                <span className="text-[10px] font-mono text-zinc-500">Step {ms.step}</span>
                              </div>
                              <p className="text-xs text-zinc-300 leading-relaxed">{ms.description}</p>
                              {ms.codeOrConfigPattern && (
                                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                                  <code>{ms.codeOrConfigPattern}</code>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Proof Deliverable */}
                      <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-xs text-zinc-300 flex items-start gap-2.5">
                        <Award className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-indigo-300 uppercase text-[10px] block mb-0.5">Tangible Proof Deliverable to Build:</strong>
                          <span>{comp.learningRoadmap.proofArtifact}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: REAL INTERVIEW USE-CASE EXERCISE & EVALUATOR */}
                  {activeTab === 'exercise' && (
                    <div className="space-y-5">
                      {/* Scenario Brief Banner */}
                      <div className="p-4 rounded-xl bg-zinc-900/90 border border-cyan-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                            EPAM Assessment Interview Case Study
                          </span>
                          <span className="text-[11px] text-zinc-500 font-mono">Real-world Problem</span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-white">
                          {comp.interviewExercise.scenarioTitle}
                        </h3>
                        <p className="text-xs text-zinc-300 leading-relaxed">
                          {comp.interviewExercise.businessContext}
                        </p>
                      </div>

                      {/* Problem Statement & Technical Constraints */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
                          <span className="text-[11px] font-bold text-rose-400 uppercase block">
                            Architectural Bottleneck &amp; Challenge:
                          </span>
                          <p className="text-xs text-zinc-300 leading-relaxed">
                            {comp.interviewExercise.architecturalProblem}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
                          <span className="text-[11px] font-bold text-amber-400 uppercase block">
                            Non-Negotiable Technical Constraints:
                          </span>
                          <ul className="text-xs text-zinc-300 space-y-1">
                            {comp.interviewExercise.technicalConstraints.map((tc, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-amber-400 font-bold">&bull;</span>
                                <span>{tc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Committee Questions to Candidate */}
                      <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                        <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5" /> Questions the EPAM Committee Will Ask You:
                        </span>
                        <ul className="text-xs text-zinc-200 space-y-1">
                          {comp.interviewExercise.taskQuestions.map((q, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-indigo-400 font-bold">{idx + 1}.</span>
                              <span>&quot;{q}&quot;</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Interactive Candidate Practice Box */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                            Your Architectural Response &amp; Defense (Practice Here):
                          </label>
                          <span className="text-[10px] text-zinc-500 font-mono">Auto-saved to localStorage</span>
                        </div>
                        <textarea
                          rows={6}
                          placeholder="Type your proposed architecture, component breakdown, trade-off analysis, and how you resolve the client's constraints..."
                          value={userExerciseAnswers[comp.id] || ''}
                          onChange={(e) => setUserExerciseAnswers({ ...userExerciseAnswers, [comp.id]: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-100 placeholder-zinc-500 font-mono leading-relaxed focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                        <div className="flex items-center justify-between pt-1">
                          <p className="text-[11px] text-zinc-500">
                            Word Count: {(userExerciseAnswers[comp.id] || '').trim().split(/\s+/).filter(Boolean).length} words
                          </p>
                          <button
                            onClick={() => evaluateExerciseResponse(comp.id, comp.interviewExercise.evaluationRubric)}
                            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Evaluate My Solution</span>
                          </button>
                        </div>
                      </div>

                      {/* Evaluation Results Card */}
                      {evaluation && (
                        <div className="p-4 rounded-xl border border-indigo-500/40 bg-zinc-900/90 space-y-3">
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                              EPAM Committee Evaluation Score:
                            </span>
                            <span className={`px-2.5 py-0.5 rounded text-xs font-black uppercase ${
                              evaluation.score >= 3
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : evaluation.score === 2
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}>
                              Score {evaluation.score}/4: {evaluation.label}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-200 leading-relaxed">{evaluation.feedback}</p>

                          <div className="space-y-1.5 pt-1">
                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                              Rubric Checklist Evaluation:
                            </span>
                            {evaluation.checklist.map((chk, i) => (
                              <div key={i} className="flex items-center space-x-2 text-xs">
                                {chk.passed ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                ) : (
                                  <AlertTriangle className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
                                )}
                                <span className={chk.passed ? 'text-zinc-200' : 'text-zinc-500'}>
                                  {chk.criterion}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Model Solution Comparison Toggle */}
                      <div className="pt-2">
                        <button
                          onClick={() => setRevealedSolutions(prev => ({ ...prev, [comp.id]: !prev[comp.id] }))}
                          className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>
                            {revealedSolutions[comp.id]
                              ? 'Hide Senior Architect Model Solution'
                              : 'Reveal Senior Architect Model Solution & Diagram'}
                          </span>
                        </button>
                      </div>

                      {revealedSolutions[comp.id] && (
                        <div className="p-5 rounded-2xl border border-cyan-500/40 bg-cyan-950/15 space-y-4">
                          <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                              <Award className="w-4 h-4 text-cyan-400" /> Senior Architect B1 Gold Standard Model Solution
                            </span>
                            <span className="text-[10px] text-cyan-400 font-mono">Official Benchmark</span>
                          </div>

                          <div className="space-y-3 text-xs">
                            <div>
                              <strong className="text-cyan-300 uppercase text-[10px] block mb-1">Executive Summary:</strong>
                              <p className="text-zinc-200 leading-relaxed">{comp.interviewExercise.modelSolution.executiveSummary}</p>
                            </div>

                            <div>
                              <strong className="text-cyan-300 uppercase text-[10px] block mb-1">Technical Architecture &amp; Data Flow:</strong>
                              <p className="text-zinc-200 leading-relaxed">{comp.interviewExercise.modelSolution.technicalApproach}</p>
                            </div>

                            <div>
                              <strong className="text-amber-300 uppercase text-[10px] block mb-1">Trade-Off Defense (Gain vs. Sacrifice):</strong>
                              <p className="text-zinc-200 leading-relaxed italic">{comp.interviewExercise.modelSolution.tradeoffDefense}</p>
                            </div>

                            <div>
                              <strong className="text-emerald-300 uppercase text-[10px] block mb-1 font-mono">Architectural Flow / Topology Diagram:</strong>
                              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                                <code>{comp.interviewExercise.modelSolution.diagramOrPattern}</code>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
