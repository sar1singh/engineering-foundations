'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Award, 
  Search, 
  Filter, 
  CheckCircle2, 
  ChevronRight, 
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
  Briefcase,
  Table as TableIcon,
  LayoutGrid,
  X,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  ListChecks
} from 'lucide-react';
import { SYLLABUS_DATA } from '@/data/syllabusData';
import { TOTAL_TOPICS_COUNT, TOTAL_EXTERNAL_LINKS_COUNT } from '@/data/skillTopicsAndLinksData';
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

  const [completedTopics, setCompletedTopics] = useLocalStorage<Record<string, boolean>>(
    'epam_b1_completed_topics',
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
  const [layoutMode, setLayoutMode] = useState<'table' | 'grid'>('table');
  
  // Modal deep-dive state - default to topics tab for structured studying
  const [activeModalItem, setActiveModalItem] = useState<CompetencyItem | null>(null);
  const [modalTab, setModalTab] = useState<'topics' | 'defense' | 'roadmap' | 'exercise'>('topics');
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const domains = ['All', 'Solution Arch', 'Application Arch', 'Cloud', 'SDLC Processes', 'Leadership & Soft', 'AI', 'Business'];
  const levels = ['All', 'Advanced', 'Intermediate', 'Novice', 'NAT B2'];

  // Handle keyboard shortcuts for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeModalItem) return;
      if (e.key === 'Escape') {
        setActiveModalItem(null);
      } else if (e.key === 'ArrowRight') {
        handleNextModal();
      } else if (e.key === 'ArrowLeft') {
        handlePrevModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalItem]);

  const updateStatus = (id: string, status: 'unmastered' | 'learning' | 'mastered') => {
    setCompetencyStatus(prev => ({
      ...prev,
      [id]: status
    }));
  };

  const toggleTopic = (topicId: string) => {
    setCompletedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const getProviderBadge = (provider: string) => {
    switch (provider) {
      case 'AWS Architecture':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Martin Fowler':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
      case 'Distributed Systems / DDIA':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'OWASP':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'Microsoft Learn':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'RFC / Standard':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'EPAM Systems':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
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

    if (wordCount < 15) {
      alert('Please write a substantive architectural response (at least 15 words) before evaluating.');
      return;
    }

    const hasNumbers = /\d+/.test(text) || lower.includes('rps') || lower.includes('ms') || lower.includes('sla') || lower.includes('latency') || lower.includes('p99');
    const hasTradeoffs = lower.includes('trade-off') || lower.includes('gain') || lower.includes('sacrifice') || lower.includes('cost') || lower.includes('at the expense of');
    const hasComponents = lower.includes('dynamodb') || lower.includes('sqs') || lower.includes('fargate') || lower.includes('api gateway') || lower.includes('redis') || lower.includes('c4') || lower.includes('eventbridge') || lower.includes('circuit breaker') || lower.includes('hexagonal') || lower.includes('adapter') || lower.includes('pact') || lower.includes('dora') || lower.includes('postgres') || lower.includes('bedrock');
    const hasFailureHandling = lower.includes('failover') || lower.includes('dlq') || lower.includes('retry') || lower.includes('circuit breaker') || lower.includes('rollback') || lower.includes('partition') || lower.includes('timeout') || lower.includes('mitigat');

    const checklist = rubric.map((crit, idx) => {
      let passed = false;
      if (idx === 0) passed = hasComponents && wordCount >= 25;
      else if (idx === 1) passed = hasNumbers || hasTradeoffs;
      else passed = hasFailureHandling || hasTradeoffs;
      return { criterion: crit.criterion, passed };
    });

    const passedCount = checklist.filter(c => c.passed).length;
    let score: 1 | 2 | 3 | 4 = 1;
    let label: EvaluationResult['label'] = 'Unsatisfactory';
    let feedback = '';

    if (passedCount <= 1 || wordCount < 25) {
      score = 1;
      label = 'Unsatisfactory';
      feedback = 'The response is too brief or lacks concrete architectural structure. It misses quantified NFR targets and explicit component interactions.';
    } else if (passedCount === 2) {
      score = 2;
      label = 'Marginal';
      feedback = 'Approaching standard, but lacks either explicit Gain vs. Sacrifice trade-off defense or failure mitigation mechanisms.';
    } else if (passedCount === 3 && wordCount >= 40) {
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

  const handleNextModal = () => {
    if (!activeModalItem) return;
    const currentIndex = filteredCompetencies.findIndex(c => c.id === activeModalItem.id);
    if (currentIndex >= 0 && currentIndex < filteredCompetencies.length - 1) {
      setActiveModalItem(filteredCompetencies[currentIndex + 1]);
    } else {
      setActiveModalItem(filteredCompetencies[0]);
    }
  };

  const handlePrevModal = () => {
    if (!activeModalItem) return;
    const currentIndex = filteredCompetencies.findIndex(c => c.id === activeModalItem.id);
    if (currentIndex > 0) {
      setActiveModalItem(filteredCompetencies[currentIndex - 1]);
    } else {
      setActiveModalItem(filteredCompetencies[filteredCompetencies.length - 1]);
    }
  };

  const masteredCount = Object.values(competencyStatus).filter(v => v === 'mastered').length;
  const completedTopicsCount = Object.values(completedTopics).filter(Boolean).length;
  const practicedExercisesCount = Object.keys(userExerciseAnswers).filter(k => (userExerciseAnswers[k] || '').trim().length > 10).length;

  const getBoxBadge = (box: number, targetBar: string) => {
    if (box === 3) return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
    if (box === 2) return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Page Header with High-Impact Typography */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-bold text-indigo-400 uppercase tracking-wider">
            <Award className="w-5 h-5" />
            <span>EPAM Systems &bull; Software Architect Curriculum</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Topics, Roadmap &amp; Exercises
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 max-w-4xl leading-relaxed">
            All <strong className="text-white">38 LevelUp competencies</strong> with concrete syllabus topics, authoritative external documentation links, implementation roadmaps, and real interview use-case exercises with instant automated scoring.
          </p>
        </div>

        {/* Global Progress Metrics - Large & Legible */}
        <div className="flex flex-wrap items-center gap-4 self-start lg:self-auto">
          {/* Topics Covered */}
          <div className="flex items-center space-x-3 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 shadow-md">
            <div>
              <div className="text-xs uppercase font-extrabold text-zinc-400">Topics Studied</div>
              <div className="text-xl sm:text-2xl font-black text-white">
                <span className="text-indigo-400">{completedTopicsCount}</span> / {TOTAL_TOPICS_COUNT}
              </div>
            </div>
            <div className="text-sm font-black text-indigo-400 bg-indigo-500/15 border border-indigo-500/30 rounded-full w-11 h-11 flex items-center justify-center">
              {Math.round((completedTopicsCount / (TOTAL_TOPICS_COUNT || 1)) * 100)}%
            </div>
          </div>

          {/* Skills Mastered */}
          <div className="flex items-center space-x-3 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 shadow-md">
            <div>
              <div className="text-xs uppercase font-extrabold text-zinc-400">Skills Mastered</div>
              <div className="text-xl sm:text-2xl font-black text-white">
                <span className="text-emerald-400">{masteredCount}</span> / 38
              </div>
            </div>
            <div className="text-sm font-black text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 rounded-full w-11 h-11 flex items-center justify-center">
              {Math.round((masteredCount / 38) * 100)}%
            </div>
          </div>

          {/* Exercises Practiced */}
          <div className="flex items-center space-x-3 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 shadow-md">
            <div>
              <div className="text-xs uppercase font-extrabold text-zinc-400">Exercises Practiced</div>
              <div className="text-xl sm:text-2xl font-black text-white">
                <span className="text-cyan-400">{practicedExercisesCount}</span> / 38
              </div>
            </div>
            <div className="text-sm font-black text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 rounded-full w-11 h-11 flex items-center justify-center">
              {Math.round((practicedExercisesCount / 38) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Layout Toggle & Search Filter */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by competency title, technology (e.g., DynamoDB, SQS, Hexagonal), or interview scenario..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-2.5 text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* View Layout Toggle: Table vs Cards */}
        <div className="flex items-center space-x-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 self-start md:self-auto">
          <button
            onClick={() => setLayoutMode('table')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              layoutMode === 'table'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <TableIcon className="w-4 h-4" />
            <span>Interactive Table View</span>
          </button>

          <button
            onClick={() => setLayoutMode('grid')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              layoutMode === 'grid'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Grid Cards View</span>
          </button>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="space-y-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
        {/* Target Level Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-zinc-400 mr-2 flex items-center gap-1.5 uppercase tracking-wider">
            <Filter className="w-4 h-4" /> Target Bar:
          </span>
          {levels.map((lvl) => {
            const isActive = selectedLevel === lvl;
            return (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
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
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-800/80">
          <span className="text-xs font-bold text-zinc-400 mr-2 uppercase tracking-wider">Domain:</span>
          {domains.map((dom) => {
            const isActive = selectedDomain === dom;
            return (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-zinc-200 text-zinc-950 shadow-sm'
                    : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {dom}
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW MODE 1: INTERACTIVE DATA TABLE VIEW (CLEAN & NON-BOXED) */}
      {layoutMode === 'table' ? (
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/90 text-xs font-bold uppercase tracking-wider text-zinc-400">
                  <th className="py-4 px-5">Domain &amp; Competency</th>
                  <th className="py-4 px-4">LevelUp Target Bar</th>
                  <th className="py-4 px-4">Mastery Status</th>
                  <th className="py-4 px-5">Interview Case Study</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70 text-sm">
                {filteredCompetencies.map((comp) => {
                  const status = competencyStatus[comp.id] || 'unmastered';
                  const evaluation = savedEvaluations[comp.id];
                  const hasDraft = !!(userExerciseAnswers[comp.id] || '').trim();

                  return (
                    <tr
                      key={comp.id}
                      className="hover:bg-zinc-800/40 transition-colors group cursor-pointer"
                      onClick={() => {
                        setActiveModalItem(comp);
                        setModalTab('topics');
                      }}
                    >
                      {/* Column 1: Domain & Title */}
                      <td className="py-4 px-5 align-top">
                        <div className="space-y-1.5">
                          <div className="flex items-center space-x-2">
                            <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
                              {comp.domain}
                            </span>
                          </div>
                          <div className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {comp.title}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 pt-0.5">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md border ${
                              (comp.learningRoadmap.topicsToCover || []).length > 0 &&
                              (comp.learningRoadmap.topicsToCover || []).every(t => completedTopics[t.id])
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : (comp.learningRoadmap.topicsToCover || []).some(t => completedTopics[t.id])
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                            }`}>
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>{(comp.learningRoadmap.topicsToCover || []).filter(t => completedTopics[t.id]).length}/{(comp.learningRoadmap.topicsToCover || []).length} Topics</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">
                              <ExternalLink className="w-3 h-3 text-cyan-400" />
                              <span>{(comp.learningRoadmap.externalLinks || []).length} Docs</span>
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 line-clamp-1 italic">
                            &quot;{comp.analogy}&quot;
                          </p>
                        </div>
                      </td>

                      {/* Column 2: LevelUp Target Bar */}
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        <div className="space-y-1.5">
                          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded border ${getBoxBadge(comp.visualBox, comp.targetBar)}`}>
                            Box {comp.visualBox}: {comp.targetBar}
                          </span>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4].map(boxNum => (
                              <span
                                key={boxNum}
                                className={`w-2.5 h-2.5 rounded-sm ${
                                  boxNum <= comp.visualBox
                                    ? 'bg-indigo-500'
                                    : 'bg-zinc-800 border border-zinc-700'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Column 3: Mastery Status Controls */}
                      <td className="py-4 px-4 align-top whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex rounded-xl bg-zinc-950 p-1 border border-zinc-800">
                          <button
                            onClick={() => updateStatus(comp.id, 'unmastered')}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                              status === 'unmastered'
                                ? 'bg-zinc-800 text-white shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            Unread
                          </button>
                          <button
                            onClick={() => updateStatus(comp.id, 'learning')}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                              status === 'learning'
                                ? 'bg-amber-500/20 text-amber-300 font-bold shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            Practicing
                          </button>
                          <button
                            onClick={() => updateStatus(comp.id, 'mastered')}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                              status === 'mastered'
                                ? 'bg-emerald-500/20 text-emerald-300 font-bold shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            Mastered
                          </button>
                        </div>
                      </td>

                      {/* Column 4: Interview Case Study */}
                      <td className="py-4 px-5 align-top">
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-zinc-200 line-clamp-1">
                            {comp.interviewExercise.scenarioTitle}
                          </div>
                          {evaluation ? (
                            <span className={`inline-block text-xs font-black px-2 py-0.5 rounded border ${
                              evaluation.score >= 3
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            }`}>
                              Exam Score: {evaluation.score}/4 ({evaluation.label})
                            </span>
                          ) : hasDraft ? (
                            <span className="text-xs text-cyan-400 flex items-center gap-1 font-mono">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                              Draft saved in scratchpad
                            </span>
                          ) : (
                            <span className="text-xs text-zinc-500 font-mono">Not yet practiced</span>
                          )}
                        </div>
                      </td>

                      {/* Column 5: Action Triggers */}
                      <td className="py-4 px-5 align-top text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setActiveModalItem(comp);
                              setModalTab('roadmap');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors border border-zinc-700"
                            title="Inspect step-by-step implementation roadmap"
                          >
                            Roadmap
                          </button>
                          <button
                            onClick={() => {
                              setActiveModalItem(comp);
                              setModalTab('exercise');
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1"
                          >
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>Practice</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: CLEAN GRID CARDS (ROOMY, NON-NESTED) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCompetencies.map((comp) => {
            const status = competencyStatus[comp.id] || 'unmastered';
            const evaluation = savedEvaluations[comp.id];

            return (
              <div
                key={comp.id}
                onClick={() => {
                  setActiveModalItem(comp);
                  setModalTab('topics');
                }}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:shadow-xl ${
                  status === 'mastered'
                    ? 'border-emerald-500/40 bg-zinc-900/80'
                    : status === 'learning'
                    ? 'border-amber-500/30 bg-zinc-900/60'
                    : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
                      {comp.domain}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${getBoxBadge(comp.visualBox, comp.targetBar)}`}>
                      Box {comp.visualBox}: {comp.targetBar}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white line-clamp-1">{comp.title}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md border ${
                      (comp.learningRoadmap.topicsToCover || []).length > 0 &&
                      (comp.learningRoadmap.topicsToCover || []).every(t => completedTopics[t.id])
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : (comp.learningRoadmap.topicsToCover || []).some(t => completedTopics[t.id])
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                    }`}>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{(comp.learningRoadmap.topicsToCover || []).filter(t => completedTopics[t.id]).length}/{(comp.learningRoadmap.topicsToCover || []).length} Topics</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">
                      <ExternalLink className="w-3 h-3 text-cyan-400" />
                      <span>{(comp.learningRoadmap.externalLinks || []).length} Docs</span>
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed italic">
                    &quot;{comp.analogy}&quot;
                  </p>

                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/80 space-y-1">
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                      Interview Case:
                    </span>
                    <p className="text-xs text-zinc-200 line-clamp-2">{comp.interviewExercise.scenarioTitle}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                  {evaluation ? (
                    <span className="font-bold text-emerald-400">Score: {evaluation.score}/4 ({evaluation.label})</span>
                  ) : (
                    <span className="text-zinc-500 font-mono">Exercise Ready</span>
                  )}
                  <span className="font-bold text-indigo-400 flex items-center gap-1 group-hover:text-indigo-300">
                    Open Hub <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FOCUSED STUDY & INTERVIEW DEEP-DIVE MODAL (NO CLUTTER, LARGE FONTS) */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div
            className="w-full max-w-5xl rounded-3xl border border-zinc-700 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
                    {activeModalItem.domain}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${getBoxBadge(activeModalItem.visualBox, activeModalItem.targetBar)}`}>
                    Box {activeModalItem.visualBox}: {activeModalItem.targetBar}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {activeModalItem.title}
                </h2>
              </div>

              {/* Prev / Next & Close Controls */}
              <div className="flex items-center space-x-2 self-start sm:self-auto">
                <button
                  onClick={handlePrevModal}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors border border-zinc-800"
                  title="Previous Competency (ArrowLeft)"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextModal}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors border border-zinc-800"
                  title="Next Competency (ArrowRight)"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-zinc-800"
                  title="Close (Escape)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center space-x-2 border-b border-zinc-800 pb-2 overflow-x-auto">
              <button
                onClick={() => setModalTab('topics')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  modalTab === 'topics'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                <ListChecks className="w-4 h-4" />
                <span>1. Syllabus Topics &amp; Primary Docs</span>
              </button>

              <button
                onClick={() => setModalTab('defense')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  modalTab === 'defense'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>2. 30s Spoken Defense</span>
              </button>

              <button
                onClick={() => setModalTab('roadmap')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  modalTab === 'roadmap'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>3. Implementation Milestones</span>
              </button>

              <button
                onClick={() => setModalTab('exercise')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  modalTab === 'exercise'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>4. Case Study &amp; Evaluator</span>
              </button>
            </div>

            {/* MODAL BODY CONTENT */}

            {/* TAB 1: SYLLABUS TOPICS & OFFICIAL DOCUMENTATION */}
            {modalTab === 'topics' && (
              <div className="space-y-6">
                {/* Top Banner: Progress for this skill */}
                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                      <ListChecks className="w-4 h-4" />
                      <span>Syllabus Topics &amp; Primary Sources</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      Granular Curriculum Checklist &amp; Primary Reading
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Check off topics as you study them. Click external links to read primary documentation (AWS Well-Architected, Martin Fowler, DDIA, RFCs).
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 bg-zinc-950 px-4 py-2.5 rounded-xl border border-zinc-800 self-start sm:self-auto">
                    <span className="text-xs uppercase font-extrabold text-zinc-400">Skill Progress:</span>
                    <span className="text-sm font-black text-emerald-400">
                      {(activeModalItem.learningRoadmap.topicsToCover || []).filter(t => completedTopics[t.id]).length} / {(activeModalItem.learningRoadmap.topicsToCover || []).length} Topics
                    </span>
                  </div>
                </div>

                {/* 1. Topics Checklist */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Granular Topics to Cover for this Competency</span>
                  </h4>
                  <div className="space-y-3">
                    {(activeModalItem.learningRoadmap.topicsToCover || []).map((topic) => {
                      const isCompleted = !!completedTopics[topic.id];
                      return (
                        <div
                          key={topic.id}
                          onClick={() => toggleTopic(topic.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                            isCompleted
                              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                              : 'bg-zinc-900/60 border-zinc-800 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-900'
                          }`}
                        >
                          <div className="pt-0.5 flex-shrink-0">
                            <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                              isCompleted
                                ? 'bg-emerald-500 border-emerald-400 text-zinc-950'
                                : 'border-zinc-600 bg-zinc-950'
                            }`}>
                              {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h5 className={`text-base font-bold transition-all ${
                                isCompleted ? 'text-emerald-300 line-through decoration-emerald-500/50' : 'text-white'
                              }`}>
                                {topic.title}
                              </h5>
                              <span className="text-xs font-mono text-zinc-500">
                                {isCompleted ? 'Completed' : 'Click to toggle'}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              {topic.keyConcepts.map((concept, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center text-xs px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300"
                                >
                                  <span className="text-indigo-400 mr-1.5 font-bold">&bull;</span>
                                  {concept}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Curated Primary References & Documentation */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-cyan-400" />
                    <span>Authoritative External References &amp; Official Documentation (Click to Open)</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(activeModalItem.learningRoadmap.externalLinks || []).map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-extrabold border ${getProviderBadge(link.provider)}`}>
                              {link.provider}
                            </span>
                            <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                          </div>
                          <h5 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {link.title}
                          </h5>
                          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                            {link.description}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                          <span>Open Reference Documentation</span>
                          <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DEFENSE & THEORY */}
            {modalTab === 'defense' && (
              <div className="space-y-6">
                {/* Analogy & Trade-off */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Plain-English Analogy
                    </span>
                    <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-medium">
                      {activeModalItem.analogy}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Gain vs. Sacrifice Trade-off
                    </span>
                    <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
                      {activeModalItem.gainVsSacrifice}
                    </p>
                  </div>
                </div>

                {/* Verbatim 30-Second Committee Defense Script */}
                <div className="p-6 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                      <Award className="w-5 h-5 text-indigo-400" /> Verbatim 30-Second Committee Defense Script
                    </span>
                    <button
                      onClick={() => handleCopyScript(activeModalItem.id, activeModalItem.defenseScript30s)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                    >
                      {copiedId === activeModalItem.id ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Script</span>
                        </>
                      )}
                    </button>
                  </div>
                  <blockquote className="text-base sm:text-lg text-white font-medium leading-relaxed italic border-l-4 border-indigo-500 pl-4">
                    &quot;{activeModalItem.defenseScript30s}&quot;
                  </blockquote>
                </div>

                {/* Pitfalls & Challenge Questions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> Committee Red-Flag Pitfalls
                    </span>
                    <ul className="text-sm text-zinc-300 space-y-2">
                      {activeModalItem.pitfalls.map((p, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-rose-500 font-bold">&bull;</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4" /> Potential Panel Challenge Questions
                    </span>
                    <ul className="text-sm text-zinc-300 space-y-2">
                      {activeModalItem.keyQuestions.map((q, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-cyan-400 font-bold">&bull;</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: IMPLEMENTATION ROADMAP & LABS */}
            {modalTab === 'roadmap' && (
              <div className="space-y-6">
                {/* Theory & Recommended Reading */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Core Theoretical Foundations
                    </span>
                    <ul className="text-sm text-zinc-200 space-y-2">
                      {activeModalItem.learningRoadmap.coreTheory.map((th, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">&bull;</span>
                          <span>{th}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                      <FileCheck className="w-4 h-4" /> Recommended Literature &amp; Standards
                    </span>
                    <ul className="text-sm text-zinc-200 space-y-2">
                      {activeModalItem.learningRoadmap.recommendedReading.map((bk, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-cyan-400 font-bold">&bull;</span>
                          <span className="italic">{bk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Step-by-Step Implementation Milestones */}
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-emerald-400" />
                    <span>Hands-On Engineering Implementation Milestones</span>
                  </span>

                  <div className="space-y-4">
                    {activeModalItem.learningRoadmap.implementationMilestones.map((ms) => (
                      <div key={ms.step} className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black flex items-center justify-center border border-emerald-500/30">
                              {ms.step}
                            </span>
                            <h4 className="text-sm sm:text-base font-bold text-white">{ms.title}</h4>
                          </div>
                          <span className="text-xs font-mono text-zinc-500">Milestone {ms.step}</span>
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed">{ms.description}</p>
                        {ms.codeOrConfigPattern && (
                          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs sm:text-sm text-emerald-300 overflow-x-auto leading-relaxed">
                            <code>{ms.codeOrConfigPattern}</code>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Proof Deliverable */}
                <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-sm text-zinc-200 flex items-start gap-3">
                  <Award className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-indigo-300 uppercase text-xs block mb-0.5">Tangible Proof Deliverable to Build:</strong>
                    <span>{activeModalItem.learningRoadmap.proofArtifact}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: REAL INTERVIEW USE-CASE EXERCISE & EVALUATOR */}
            {modalTab === 'exercise' && (
              <div className="space-y-6">
                {/* Scenario Banner */}
                <div className="p-5 rounded-2xl bg-zinc-900 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
                      EPAM Assessment Interview Case Study
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">Real-world Problem</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {activeModalItem.interviewExercise.scenarioTitle}
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                    {activeModalItem.interviewExercise.businessContext}
                  </p>
                </div>

                {/* Problem Statement & Technical Constraints */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                      Architectural Bottleneck &amp; Challenge:
                    </span>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {activeModalItem.interviewExercise.architecturalProblem}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                      Non-Negotiable Technical Constraints:
                    </span>
                    <ul className="text-sm text-zinc-300 space-y-1.5">
                      {activeModalItem.interviewExercise.technicalConstraints.map((tc, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">&bull;</span>
                          <span>{tc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Committee Questions to Candidate */}
                <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" /> Questions the EPAM Committee Will Ask You:
                  </span>
                  <ul className="text-sm text-zinc-200 space-y-1.5">
                    {activeModalItem.interviewExercise.taskQuestions.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-indigo-400 font-bold">{idx + 1}.</span>
                        <span>&quot;{q}&quot;</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interactive Candidate Practice Box */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      Your Architectural Response &amp; Defense (Practice Here):
                    </label>
                    <span className="text-xs text-zinc-500 font-mono">Auto-saved to localStorage</span>
                  </div>
                  <textarea
                    rows={7}
                    placeholder="Type your proposed architecture, component breakdown, trade-off analysis, and how you resolve the client's constraints..."
                    value={userExerciseAnswers[activeModalItem.id] || ''}
                    onChange={(e) => setUserExerciseAnswers({ ...userExerciseAnswers, [activeModalItem.id]: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm sm:text-base text-zinc-100 placeholder-zinc-500 font-mono leading-relaxed focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm text-zinc-400">
                      Word Count: {(userExerciseAnswers[activeModalItem.id] || '').trim().split(/\s+/).filter(Boolean).length} words
                    </p>
                    <button
                      onClick={() => evaluateExerciseResponse(activeModalItem.id, activeModalItem.interviewExercise.evaluationRubric)}
                      className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Evaluate My Solution</span>
                    </button>
                  </div>
                </div>

                {/* Evaluation Results Card */}
                {savedEvaluations[activeModalItem.id] && (
                  <div className="p-5 rounded-2xl border border-indigo-500/40 bg-zinc-900 space-y-3">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-300">
                        Official Assessment Grade:
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-black uppercase ${
                        savedEvaluations[activeModalItem.id].score >= 3
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : savedEvaluations[activeModalItem.id].score === 2
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}>
                        Score {savedEvaluations[activeModalItem.id].score}/4: {savedEvaluations[activeModalItem.id].label}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-200 leading-relaxed font-medium">
                      {savedEvaluations[activeModalItem.id].feedback}
                    </p>

                    <div className="space-y-2 pt-1">
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                        Rubric Checklist Breakdown:
                      </span>
                      {savedEvaluations[activeModalItem.id].checklist.map((chk, i) => (
                        <div key={i} className="flex items-center space-x-2 text-xs sm:text-sm">
                          {chk.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-zinc-600 flex-shrink-0" />
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
                    onClick={() => setRevealedSolutions(prev => ({ ...prev, [activeModalItem.id]: !prev[activeModalItem.id] }))}
                    className="w-full py-3 px-5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-cyan-300 border border-cyan-500/30 text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>
                      {revealedSolutions[activeModalItem.id]
                        ? 'Hide Senior Architect Model Solution'
                        : 'Reveal Senior Architect Model Solution & Diagram'}
                    </span>
                  </button>
                </div>

                {revealedSolutions[activeModalItem.id] && (
                  <div className="p-6 rounded-2xl border border-cyan-500/40 bg-cyan-950/20 space-y-4">
                    <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                        <Award className="w-5 h-5 text-cyan-400" /> Senior Architect B1 Benchmark Model Solution
                      </span>
                      <span className="text-xs text-cyan-400 font-mono">Official Benchmark</span>
                    </div>

                    <div className="space-y-4 text-sm leading-relaxed">
                      <div>
                        <strong className="text-cyan-300 uppercase text-xs block mb-1">Executive Summary:</strong>
                        <p className="text-zinc-200">{activeModalItem.interviewExercise.modelSolution.executiveSummary}</p>
                      </div>

                      <div>
                        <strong className="text-cyan-300 uppercase text-xs block mb-1">Technical Architecture &amp; Data Flow:</strong>
                        <p className="text-zinc-200">{activeModalItem.interviewExercise.modelSolution.technicalApproach}</p>
                      </div>

                      <div>
                        <strong className="text-amber-300 uppercase text-xs block mb-1">Trade-Off Defense (Gain vs. Sacrifice):</strong>
                        <p className="text-zinc-200 italic">{activeModalItem.interviewExercise.modelSolution.tradeoffDefense}</p>
                      </div>

                      <div>
                        <strong className="text-emerald-300 uppercase text-xs block mb-1 font-mono">Architectural Flow / Topology Diagram:</strong>
                        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs sm:text-sm text-emerald-300 overflow-x-auto">
                          <code>{activeModalItem.interviewExercise.modelSolution.diagramOrPattern}</code>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
