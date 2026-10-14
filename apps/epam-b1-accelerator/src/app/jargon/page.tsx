'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Layers, 
  RotateCw, 
  Shuffle, 
  CheckCircle2, 
  Sparkles, 
  AlertOctagon, 
  Award, 
  ArrowRight, 
  ArrowLeft,
  Filter,
  Check,
  Copy,
  BookOpen,
  Table as TableIcon,
  LayoutGrid,
  Search,
  X,
  ExternalLink
} from 'lucide-react';
import { FLASHCARDS_DATA } from '@/data/flashcardsData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FlashcardItem } from '@/types';

export default function FlashcardsPage() {
  const [flashcardStatus, setFlashcardStatus] = useLocalStorage<Record<string, 'unmastered' | 'learning' | 'mastered'>>(
    'epam_b1_flashcards',
    {}
  );

  const [viewMode, setViewMode] = useState<'table' | 'deck'>('table');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMasteryFilter, setSelectedMasteryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal deep-dive state for table view
  const [modalCard, setModalCard] = useState<FlashcardItem | null>(null);

  const categories = [
    'All',
    'Consistency & Transactions',
    'Resiliency & Patterns',
    'Storage & Caching',
    'Messaging & Events',
    'Security & Topology'
  ];

  const filteredCards = useMemo(() => {
    return FLASHCARDS_DATA.filter(card => {
      const matchesCategory = selectedCategory === 'All' || card.category === selectedCategory;
      const status = flashcardStatus[card.id] || 'unmastered';
      const matchesMastery = 
        selectedMasteryFilter === 'All' ||
        (selectedMasteryFilter === 'Mastered' && status === 'mastered') ||
        (selectedMasteryFilter === 'Getting There' && status === 'learning') ||
        (selectedMasteryFilter === 'Need Practice' && status === 'unmastered');
      const matchesSearch = 
        card.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.analogy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.defenseScript30s.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.gainVsSacrifice.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesMastery && matchesSearch;
    });
  }, [selectedCategory, selectedMasteryFilter, searchQuery, flashcardStatus]);

  // Clamp current index when filter changes
  const activeIndex = Math.min(currentIndex, Math.max(0, filteredCards.length - 1));
  const currentCard: FlashcardItem | undefined = filteredCards[activeIndex];
  const currentStatus = currentCard ? (flashcardStatus[currentCard.id] || 'unmastered') : 'unmastered';

  // Keyboard navigation for deck and modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If modal is open
      if (modalCard) {
        if (e.key === 'Escape') setModalCard(null);
        else if (e.key === 'ArrowRight') handleNextModal();
        else if (e.key === 'ArrowLeft') handlePrevModal();
        return;
      }

      // If in deck view mode
      if (viewMode === 'deck' && filteredCards.length > 0) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          setIsFlipped(prev => !prev);
        } else if (e.key === 'ArrowRight') {
          handleNext();
        } else if (e.key === 'ArrowLeft') {
          handlePrev();
        } else if (e.key === '1') {
          setStatus('unmastered');
        } else if (e.key === '2') {
          setStatus('learning');
        } else if (e.key === '3') {
          setStatus('mastered');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalCard, viewMode, activeIndex, filteredCards]);

  const setStatus = (status: 'unmastered' | 'learning' | 'mastered') => {
    if (!currentCard) return;
    setFlashcardStatus(prev => ({
      ...prev,
      [currentCard.id]: status
    }));
  };

  const updateCardStatus = (id: string, status: 'unmastered' | 'learning' | 'mastered') => {
    setFlashcardStatus(prev => ({
      ...prev,
      [id]: status
    }));
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleNextModal = () => {
    if (!modalCard) return;
    const idx = filteredCards.findIndex(c => c.id === modalCard.id);
    if (idx >= 0 && idx < filteredCards.length - 1) {
      setModalCard(filteredCards[idx + 1]);
    } else {
      setModalCard(filteredCards[0]);
    }
  };

  const handlePrevModal = () => {
    if (!modalCard) return;
    const idx = filteredCards.findIndex(c => c.id === modalCard.id);
    if (idx > 0) {
      setModalCard(filteredCards[idx - 1]);
    } else {
      setModalCard(filteredCards[filteredCards.length - 1]);
    }
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    if (filteredCards.length > 1) {
      const randomIndex = Math.floor(Math.random() * filteredCards.length);
      setCurrentIndex(randomIndex);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const masteredCount = Object.values(flashcardStatus).filter(v => v === 'mastered').length;
  const learningCount = Object.values(flashcardStatus).filter(v => v === 'learning').length;

  return (
    <div className="space-y-8 pb-20">
      {/* Header with High-Impact Typography */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-bold text-cyan-400 uppercase tracking-wider">
            <Layers className="w-5 h-5" />
            <span>Distributed Systems Architecture Deck</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            30 Core Distributed Architecture Flashcards
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 max-w-4xl leading-relaxed">
            Zero-jargon distributed systems concepts: CAP, 2PC vs. Saga, Outbox CDC, CQRS, Bulkheads, C4 levels, and 30-second verbatim defenses without fluff.
          </p>
        </div>

        {/* Global Progress Gauge */}
        <div className="flex items-center space-x-4 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 shadow-lg self-start lg:self-auto">
          <div>
            <div className="text-xs uppercase font-extrabold text-zinc-400">Mastery Progress</div>
            <div className="text-2xl font-black text-white">
              <span className="text-emerald-400">{masteredCount}</span> / 30 Cleared
            </div>
          </div>
          <div className="text-base font-black text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 rounded-full w-12 h-12 flex items-center justify-center">
            {Math.round((masteredCount / 30) * 100)}%
          </div>
        </div>
      </div>

      {/* Control Bar: Layout Toggle & Search Filter */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 shadow-md">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search patterns (e.g. Saga, CAP, Outbox, Bulkhead, DynamoDB, CQRS, C4)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-2.5 text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* View Mode Toggle: Table Matrix vs Flip Deck */}
        <div className="flex items-center space-x-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 self-start md:self-auto">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              viewMode === 'table'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <TableIcon className="w-4 h-4" />
            <span>Architecture Matrix (Table)</span>
          </button>

          <button
            onClick={() => setViewMode('deck')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              viewMode === 'deck'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Interactive 3D Deck</span>
          </button>
        </div>
      </div>

      {/* Category & Mastery Filters Bar */}
      <div className="space-y-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-zinc-400 mr-2 flex items-center gap-1.5 uppercase tracking-wider">
            <Filter className="w-4 h-4" /> Category:
          </span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-zinc-400 mr-2 uppercase tracking-wider">Mastery Status:</span>
            {['All', 'Need Practice', 'Getting There', 'Mastered'].map((m) => {
              const isActive = selectedMasteryFilter === m;
              return (
                <button
                  key={m}
                  onClick={() => {
                    setSelectedMasteryFilter(m);
                    setCurrentIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-zinc-200 text-zinc-950 shadow-sm'
                      : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>

          {viewMode === 'deck' && (
            <button
              onClick={handleShuffle}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs sm:text-sm font-bold transition-colors"
            >
              <Shuffle className="w-4 h-4" />
              <span>Shuffle Cards</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW MODE 1: ARCHITECTURE PATTERN MATRIX (CLEAN DATA TABLE) */}
      {viewMode === 'table' && (
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/90 text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-400">
                  <th className="py-4 px-6">#</th>
                  <th className="py-4 px-6">Concept &amp; Category</th>
                  <th className="py-4 px-6">Plain English Analogy</th>
                  <th className="py-4 px-6">Core Trade-Off (Gain vs Sacrifice)</th>
                  <th className="py-4 px-6">Mastery</th>
                  <th className="py-4 px-6 text-right">Study Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70 text-sm sm:text-base">
                {filteredCards.map((card, idx) => {
                  const status = flashcardStatus[card.id] || 'unmastered';

                  return (
                    <tr
                      key={card.id}
                      className="hover:bg-zinc-800/40 transition-colors group cursor-pointer"
                      onClick={() => setModalCard(card)}
                    >
                      {/* Column 1: Index */}
                      <td className="py-4 px-6 font-mono text-zinc-500 font-bold text-sm align-top">
                        #{card.id.replace('card-', '')}
                      </td>

                      {/* Column 2: Concept & Category */}
                      <td className="py-4 px-6 align-top">
                        <div className="space-y-1">
                          <span className="inline-block text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
                            {card.category}
                          </span>
                          <div className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {card.concept}
                          </div>
                        </div>
                      </td>

                      {/* Column 3: Analogy */}
                      <td className="py-4 px-6 align-top max-w-sm">
                        <p className="text-xs sm:text-sm text-zinc-300 italic leading-relaxed">
                          &quot;{card.analogy}&quot;
                        </p>
                      </td>

                      {/* Column 4: Trade-Off */}
                      <td className="py-4 px-6 align-top max-w-md">
                        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-2">
                          {card.gainVsSacrifice}
                        </p>
                      </td>

                      {/* Column 5: Status Pills */}
                      <td className="py-4 px-6 align-top whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex rounded-xl bg-zinc-950 p-1 border border-zinc-800">
                          <button
                            onClick={() => updateCardStatus(card.id, 'unmastered')}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                              status === 'unmastered'
                                ? 'bg-zinc-800 text-white shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            Unread
                          </button>
                          <button
                            onClick={() => updateCardStatus(card.id, 'learning')}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                              status === 'learning'
                                ? 'bg-amber-500/20 text-amber-300 font-bold shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            Practicing
                          </button>
                          <button
                            onClick={() => updateCardStatus(card.id, 'mastered')}
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

                      {/* Column 6: Action */}
                      <td className="py-4 px-6 align-top text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalCard(card);
                          }}
                          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-800 group-hover:bg-cyan-600 text-zinc-300 group-hover:text-white font-bold text-xs sm:text-sm transition-all shadow-sm"
                        >
                          <span>Open Card</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: ROOMY 3D FLIP DECK (OPTIMIZED FOR BIG SCREENS) */}
      {viewMode === 'deck' && (
        <div className="max-w-5xl mx-auto space-y-4">
          {filteredCards.length > 0 && currentCard ? (
            <div className="space-y-4">
              {/* Card Position Tracker */}
              <div className="flex items-center justify-between text-sm text-zinc-400 px-2 font-medium">
                <span>
                  Card <strong className="text-white text-base">{activeIndex + 1}</strong> of{' '}
                  <strong className="text-white text-base">{filteredCards.length}</strong>
                </span>
                <span className="font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20">
                  {currentCard.category}
                </span>
              </div>

              {/* Big Interactive Flip Card Container */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="cursor-pointer min-h-[460px] rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-8 sm:p-12 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-cyan-500/40 relative overflow-hidden"
              >
                {/* Ambient Backlight */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

                {!isFlipped ? (
                  // FRONT OF CARD
                  <div className="space-y-8 my-auto text-center py-8">
                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      <Sparkles className="w-4 h-4" />
                      <span>Architecture Concept #{currentCard.id.replace('card-', '')}</span>
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                      {currentCard.concept}
                    </h2>

                    <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-zinc-200 text-base sm:text-lg italic leading-relaxed shadow-lg">
                      &quot;{currentCard.analogy}&quot;
                    </div>

                    <div className="pt-6 flex items-center justify-center space-x-2 text-sm font-bold text-zinc-400 group">
                      <RotateCw className="w-5 h-5 text-cyan-400 animate-spin-slow" />
                      <span className="group-hover:text-cyan-300 transition-colors">
                        Click card or press [Space] to flip &amp; reveal 30s committee defense &rarr;
                      </span>
                    </div>
                  </div>
                ) : (
                  // BACK OF CARD (Deep Dive Defense)
                  <div className="space-y-6 text-left py-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-black uppercase tracking-wider text-cyan-300 bg-cyan-500/15 px-3 py-1 rounded-lg border border-cyan-500/30">
                          {currentCard.concept}
                        </span>
                        <span className="text-xs text-zinc-400 font-mono hidden sm:inline">{currentCard.category}</span>
                      </div>
                      <button
                        onClick={() => setIsFlipped(false)}
                        className="text-xs sm:text-sm text-zinc-300 hover:text-white flex items-center gap-1.5 font-bold bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-700 transition-colors"
                      >
                        <RotateCw className="w-4 h-4" /> Flip Back
                      </button>
                    </div>

                    {/* 30-Second Committee Defense Script */}
                    <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                          <Award className="w-5 h-5 text-indigo-400" /> Verbatim 30-Second Committee Defense
                        </span>
                        <button
                          onClick={() => handleCopy(currentCard.id, currentCard.defenseScript30s)}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-bold transition-colors"
                        >
                          {copiedId === currentCard.id ? (
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
                      <p className="text-sm sm:text-base text-zinc-100 leading-relaxed italic border-l-3 border-indigo-400 pl-4">
                        &quot;{currentCard.defenseScript30s}&quot;
                      </p>
                    </div>

                    {/* Gain vs Sacrifice Trade-Off */}
                    <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                      <div className="text-xs uppercase font-extrabold text-amber-400 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" /> Architectural Trade-Off (Gain vs. Sacrifice)
                      </div>
                      <p className="text-sm text-zinc-300 leading-relaxed">{currentCard.gainVsSacrifice}</p>
                    </div>

                    {/* Anti-Pattern to Avoid */}
                    <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                      <div className="text-xs uppercase font-extrabold text-rose-400 flex items-center gap-1.5">
                        <AlertOctagon className="w-4 h-4" /> Committee Red-Flag Anti-Pattern
                      </div>
                      <p className="text-sm text-rose-200/90 leading-relaxed">{currentCard.antiPattern}</p>
                    </div>
                  </div>
                )}

                {/* Bottom Status & Flip Prompt */}
                <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
                  <div className="flex items-center space-x-3">
                    <span className="text-zinc-400 font-bold">Status:</span>
                    <div className="inline-flex rounded-xl bg-zinc-950 p-1 border border-zinc-800">
                      <button
                        onClick={(e) => { e.stopPropagation(); setStatus('unmastered'); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          currentStatus === 'unmastered'
                            ? 'bg-zinc-800 text-white shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        Need Practice [1]
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setStatus('learning'); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          currentStatus === 'learning'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        Getting There [2]
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setStatus('mastered'); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          currentStatus === 'mastered'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        Mastered [3]
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                      className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Prev (&larr;)
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleNext(); }}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold flex items-center gap-1.5 transition-colors shadow-md"
                    >
                      Next (&rarr;) <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-16 text-center rounded-3xl border border-zinc-800 bg-zinc-900/40 text-zinc-400">
              <Layers className="w-12 h-12 mx-auto text-zinc-600 mb-3" />
              <p className="text-base font-semibold">No flashcards match the selected search and filter criteria.</p>
              <button
                onClick={() => { setSelectedCategory('All'); setSelectedMasteryFilter('All'); setSearchQuery(''); }}
                className="mt-4 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm font-bold text-white"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* FOCUSED STUDY MODAL (DEEP DIVE FOR MATRIX TABLE ROWS) */}
      {modalCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-950">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Concept #{modalCard.id.replace('card-', '')} &bull; {modalCard.category}
                </span>
                <span className="text-xs text-zinc-500 font-mono hidden sm:inline">[Esc to close, &larr; &rarr; to navigate]</span>
              </div>
              <button
                onClick={() => setModalCard(null)}
                className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {modalCard.concept}
              </h2>

              {/* Analogy Box */}
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-xs uppercase font-extrabold text-cyan-400">Plain-English Analogy</span>
                <p className="text-base sm:text-lg text-zinc-200 italic leading-relaxed">
                  &quot;{modalCard.analogy}&quot;
                </p>
              </div>

              {/* 30-Second Verbatim Defense */}
              <div className="p-6 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-400" />
                    Verbatim 30-Second Committee Defense
                  </span>
                  <button
                    onClick={() => handleCopy(modalCard.id, modalCard.defenseScript30s)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-bold transition-colors"
                  >
                    {copiedId === modalCard.id ? (
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
                <p className="text-base sm:text-lg text-zinc-100 leading-relaxed italic border-l-4 border-indigo-500 pl-4">
                  &quot;{modalCard.defenseScript30s}&quot;
                </p>
              </div>

              {/* Trade-Off Details */}
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                <span className="text-xs uppercase font-extrabold text-amber-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Architectural Trade-Off (Gain vs. Sacrifice)
                </span>
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                  {modalCard.gainVsSacrifice}
                </p>
              </div>

              {/* Red-Flag Anti-Pattern */}
              <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-1.5">
                <span className="text-xs uppercase font-extrabold text-rose-400 flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4" /> Committee Red-Flag Anti-Pattern
                </span>
                <p className="text-sm sm:text-base text-rose-200/90 leading-relaxed">
                  {modalCard.antiPattern}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-t border-zinc-800 bg-zinc-950">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-bold text-zinc-400">Mastery:</span>
                <div className="inline-flex rounded-xl bg-zinc-900 p-1 border border-zinc-800">
                  <button
                    onClick={() => updateCardStatus(modalCard.id, 'unmastered')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      (flashcardStatus[modalCard.id] || 'unmastered') === 'unmastered'
                        ? 'bg-zinc-800 text-white shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Unread
                  </button>
                  <button
                    onClick={() => updateCardStatus(modalCard.id, 'learning')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      flashcardStatus[modalCard.id] === 'learning'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Practicing
                  </button>
                  <button
                    onClick={() => updateCardStatus(modalCard.id, 'mastered')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      flashcardStatus[modalCard.id] === 'mastered'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Mastered
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePrevModal}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous
                </button>
                <button
                  onClick={handleNextModal}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold flex items-center gap-1.5 transition-colors shadow-md"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
