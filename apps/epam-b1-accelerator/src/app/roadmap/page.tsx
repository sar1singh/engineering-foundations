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
  BookOpen
} from 'lucide-react';
import { SYLLABUS_DATA } from '@/data/syllabusData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SkillLevel, SkillDomain } from '@/types';

export default function RoadmapPage() {
  const [competencyStatus, setCompetencyStatus] = useLocalStorage<Record<string, 'unmastered' | 'learning' | 'mastered'>>(
    'epam_b1_competencies',
    {}
  );

  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
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

  const filteredCompetencies = useMemo(() => {
    return SYLLABUS_DATA.filter(item => {
      const matchesDomain = selectedDomain === 'All' || item.domain === selectedDomain;
      const matchesLevel = selectedLevel === 'All' || item.targetBar === selectedLevel;
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.defenseScript30s.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.analogy.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDomain && matchesLevel && matchesSearch;
    });
  }, [selectedDomain, selectedLevel, searchQuery]);

  const masteredCount = Object.values(competencyStatus).filter(v => v === 'mastered').length;
  const learningCount = Object.values(competencyStatus).filter(v => v === 'learning').length;

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Official LevelUp Inventory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            38 EPAM LevelUp Architecture Competencies
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Official EPAM target bars: Box 1 (Novice), Box 2 (Intermediate), Box 3 (Advanced). Every card includes an analogy, trade-off, and 30s committee defense script.
          </p>
        </div>

        {/* Global Progress Pill */}
        <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 self-start sm:self-auto">
          <div className="text-right">
            <div className="text-xs text-zinc-400">Mastery Progress</div>
            <div className="text-sm font-bold text-white">
              <span className="text-emerald-400">{masteredCount}</span> / 38 Mastered
            </div>
          </div>
          <div className="w-12 h-12 flex items-center justify-center">
            <div className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-10 h-10 flex items-center justify-center">
              {Math.round((masteredCount / 38) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by competency title, analogy, or defense keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Quick Expand / Collapse */}
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
      <div className="space-y-3">
        <div className="text-xs text-zinc-400 flex items-center justify-between px-1">
          <span>Showing {filteredCompetencies.length} of 38 competencies</span>
        </div>

        {filteredCompetencies.map((comp) => {
          const status = competencyStatus[comp.id] || 'unmastered';
          const isExpanded = expandedCards[comp.id] || false;

          // Box indicator style
          const getBoxColor = (box: number) => {
            if (box === 3) return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
            if (box === 2) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
            return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
          };

          return (
            <div
              key={comp.id}
              className={`rounded-xl border transition-all ${
                status === 'mastered'
                  ? 'border-emerald-500/30 bg-zinc-900/80'
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
                    {/* Visual 4-box indicator matching EPAM LevelUp dot */}
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
                  </div>

                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {comp.title}
                    {status === 'mastered' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-1 italic">
                    Analogy: &quot;{comp.analogy}&quot;
                  </p>
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

              {/* Expandable Deep Dive Body */}
              {isExpanded && (
                <div className="border-t border-zinc-800/80 p-5 space-y-4 bg-zinc-950/60">
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
