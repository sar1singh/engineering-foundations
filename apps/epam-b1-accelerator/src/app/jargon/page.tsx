'use client';

import React, { useState, useMemo } from 'react';
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
  BookOpen
} from 'lucide-react';
import { FLASHCARDS_DATA } from '@/data/flashcardsData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FlashcardItem } from '@/types';

export default function FlashcardsPage() {
  const [flashcardStatus, setFlashcardStatus] = useLocalStorage<Record<string, 'unmastered' | 'learning' | 'mastered'>>(
    'epam_b1_flashcards',
    {}
  );

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMasteryFilter, setSelectedMasteryFilter] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
      return matchesCategory && matchesMastery;
    });
  }, [selectedCategory, selectedMasteryFilter, flashcardStatus]);

  // Clamp current index when filter changes
  const activeIndex = Math.min(currentIndex, Math.max(0, filteredCards.length - 1));
  const currentCard: FlashcardItem | undefined = filteredCards[activeIndex];

  const currentStatus = currentCard ? (flashcardStatus[currentCard.id] || 'unmastered') : 'unmastered';

  const setStatus = (status: 'unmastered' | 'learning' | 'mastered') => {
    if (!currentCard) return;
    setFlashcardStatus(prev => ({
      ...prev,
      [currentCard.id]: status
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
  const needPracticeCount = FLASHCARDS_DATA.length - masteredCount - learningCount;

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Distributed Systems Decoder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            30 Core Architecture Flashcards
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Zero-jargon distributed systems concepts: CAP, 2PC vs Saga, Outbox CDC, CQRS, Bulkheads, C4 levels, and 30-second verbatim defenses.
          </p>
        </div>

        {/* Mastery Pill */}
        <div className="flex items-center space-x-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs self-start sm:self-auto">
          <div>
            <div className="text-zinc-400">Mastery Score</div>
            <div className="font-bold text-white">
              <span className="text-emerald-400">{masteredCount}</span> / 30 Cleared
            </div>
          </div>
          <div className="text-xs font-black text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-full w-9 h-9 flex items-center justify-center">
            {Math.round((masteredCount / 30) * 100)}%
          </div>
        </div>
      </div>

      {/* Category & Mastery Filters */}
      <div className="space-y-2 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-zinc-400 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Category:
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
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/80">
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-[11px] font-semibold text-zinc-400 mr-1">Status:</span>
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
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-200 text-zinc-950 font-bold'
                      : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleShuffle}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle Cards</span>
          </button>
        </div>
      </div>

      {/* Main Flashcard Interactive Area */}
      {filteredCards.length > 0 && currentCard ? (
        <div className="space-y-4">
          {/* Card Position Tracker */}
          <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
            <span>
              Card <strong className="text-white">{activeIndex + 1}</strong> of{' '}
              <strong className="text-white">{filteredCards.length}</strong>
            </span>
            <span className="font-mono text-zinc-500">{currentCard.category}</span>
          </div>

          {/* Interactive Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[360px] sm:min-h-[420px] rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-cyan-500/40 relative overflow-hidden"
          >
            {/* Ambient Backlight */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

            {!isFlipped ? (
              // FRONT OF CARD
              <div className="space-y-6 my-auto text-center py-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Concept #{currentCard.id.replace('card-', '')}</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {currentCard.concept}
                </h2>

                <div className="max-w-xl mx-auto p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-zinc-300 text-sm sm:text-base italic leading-relaxed">
                  &quot;{currentCard.analogy}&quot;
                </div>

                <div className="pt-4 flex items-center justify-center space-x-2 text-xs font-semibold text-zinc-500 group">
                  <RotateCw className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                  <span className="text-zinc-400 group-hover:text-cyan-400 transition-colors">
                    Click anywhere to flip and reveal committee defense script &rarr;
                  </span>
                </div>
              </div>
            ) : (
              // BACK OF CARD (Deep Dive Defense)
              <div className="space-y-5 text-left py-2" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
                      {currentCard.concept}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsFlipped(false)}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-medium bg-zinc-800 px-2 py-1 rounded"
                  >
                    <RotateCw className="w-3 h-3" /> Flip Back
                  </button>
                </div>

                {/* 30-Second Committee Defense Script */}
                <div className="p-4 rounded-xl bg-indigo-950/25 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-indigo-400" /> Verbatim 30-Second Committee Defense
                    </span>
                    <button
                      onClick={() => handleCopy(currentCard.id, currentCard.defenseScript30s)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-semibold transition-colors"
                    >
                      {copiedId === currentCard.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Script</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed italic border-l-2 border-indigo-400 pl-3">
                    &quot;{currentCard.defenseScript30s}&quot;
                  </p>
                </div>

                {/* Gain vs Sacrifice Trade-Off */}
                <div className="p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800">
                  <div className="text-[11px] uppercase font-bold text-amber-400 mb-1 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" /> Architectural Trade-Off (Gain vs. Sacrifice)
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{currentCard.gainVsSacrifice}</p>
                </div>

                {/* Anti-Pattern to Avoid */}
                <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30">
                  <div className="text-[11px] uppercase font-bold text-rose-400 mb-0.5 flex items-center gap-1">
                    <AlertOctagon className="w-3.5 h-3.5" /> Committee Red-Flag Anti-Pattern
                  </div>
                  <p className="text-xs text-rose-200/90 leading-relaxed">{currentCard.antiPattern}</p>
                </div>
              </div>
            )}

            {/* Bottom Status & Flip Prompt */}
            <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-zinc-500">Mastery Level:</span>
                <div className="inline-flex rounded-lg bg-zinc-950 p-0.5 border border-zinc-800">
                  <button
                    onClick={(e) => { e.stopPropagation(); setStatus('unmastered'); }}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                      currentStatus === 'unmastered'
                        ? 'bg-zinc-800 text-white'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Need Practice
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setStatus('learning'); }}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                      currentStatus === 'learning'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Getting There
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setStatus('mastered'); }}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                      currentStatus === 'mastered'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Mastered
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Prev
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1 transition-colors shadow-sm"
                >
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-zinc-800 bg-zinc-900/40 text-zinc-400">
          <Layers className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
          <p className="text-sm">No flashcards match the selected category and status filters.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSelectedMasteryFilter('All'); }}
            className="mt-3 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
