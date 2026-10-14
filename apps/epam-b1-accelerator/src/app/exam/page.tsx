'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Award, 
  ShieldCheck, 
  HelpCircle, 
  ChevronRight, 
  BarChart3, 
  Sparkles, 
  BookOpen, 
  ExternalLink,
  Table as TableIcon,
  Check,
  X
} from 'lucide-react';
import { EXAM_QUESTIONS, ExamQuestion } from '@/data/examQuestionsData';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ExamResult {
  completedAt: string;
  totalScore: number;
  percentage: number;
  verdict: 'B1 Certified Pass' | 'Marginal Candidate' | 'Unsatisfactory - Gaps Identified';
  domainScores: Record<string, { correct: number; total: number; percentage: number; targetBar: string; passed: boolean }>;
  answers: Record<string, 'A' | 'B' | 'C' | 'D'>;
}

export default function ExamPage() {
  const [userAnswers, setUserAnswers] = useLocalStorage<Record<string, 'A' | 'B' | 'C' | 'D'>>('epam_b1_exam_draft_answers', {});
  const [savedResult, setSavedResult] = useLocalStorage<ExamResult | null>('epam_b1_latest_exam_result', null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedFilterDomain, setSelectedFilterDomain] = useState<string>('All');
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(45 * 60); // 45 min
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);

  // Initialize submitted state if savedResult exists
  useEffect(() => {
    if (savedResult) {
      setIsExamSubmitted(true);
    }
  }, [savedResult]);

  // Timer countdown
  useEffect(() => {
    if (isExamSubmitted || isTimerPaused || timeRemainingSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimeRemainingSeconds(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isExamSubmitted, isTimerPaused, timeRemainingSeconds]);

  const filteredQuestions = useMemo(() => {
    if (selectedFilterDomain === 'All') return EXAM_QUESTIONS;
    return EXAM_QUESTIONS.filter(q => q.domain === selectedFilterDomain);
  }, [selectedFilterDomain]);

  const currentQ: ExamQuestion = filteredQuestions[Math.min(currentQuestionIndex, filteredQuestions.length - 1)] || EXAM_QUESTIONS[0];

  const handleSelectOption = (questionId: string, optionId: 'A' | 'B' | 'C' | 'D') => {
    if (isExamSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const calculateResults = () => {
    let totalCorrect = 0;
    const domainStats: Record<string, { correct: number; total: number; targetBar: string }> = {};

    EXAM_QUESTIONS.forEach(q => {
      if (!domainStats[q.domain]) {
        domainStats[q.domain] = { correct: 0, total: 0, targetBar: q.targetBar };
      }
      domainStats[q.domain].total += 1;

      if (userAnswers[q.id] === q.correctAnswer) {
        totalCorrect += 1;
        domainStats[q.domain].correct += 1;
      }
    });

    const totalQuestions = EXAM_QUESTIONS.length;
    const percentage = Math.round((totalCorrect / totalQuestions) * 100);

    const domainScores: ExamResult['domainScores'] = {};
    let failedAdvancedDomains = 0;

    Object.keys(domainStats).forEach(dom => {
      const stat = domainStats[dom];
      const domPercent = Math.round((stat.correct / stat.total) * 100);
      const isAdvanced = stat.targetBar === 'Advanced';
      const threshold = isAdvanced ? 80 : 70;
      const passed = domPercent >= threshold;

      if (isAdvanced && !passed) {
        failedAdvancedDomains += 1;
      }

      domainScores[dom] = {
        correct: stat.correct,
        total: stat.total,
        percentage: domPercent,
        targetBar: stat.targetBar,
        passed
      };
    });

    let verdict: ExamResult['verdict'] = 'Unsatisfactory - Gaps Identified';
    if (percentage >= 80 && failedAdvancedDomains === 0) {
      verdict = 'B1 Certified Pass';
    } else if (percentage >= 65 && failedAdvancedDomains <= 2) {
      verdict = 'Marginal Candidate';
    } else {
      verdict = 'Unsatisfactory - Gaps Identified';
    }

    const result: ExamResult = {
      completedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      totalScore: totalCorrect,
      percentage,
      verdict,
      domainScores,
      answers: userAnswers
    };

    setSavedResult(result);
    setIsExamSubmitted(true);
  };

  const handleRetakeExam = () => {
    if (confirm('Start a fresh exam attempt? Your current answers and score will be reset.')) {
      setUserAnswers({});
      setSavedResult(null);
      setIsExamSubmitted(false);
      setCurrentQuestionIndex(0);
      setTimeRemainingSeconds(45 * 60);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="space-y-10 pb-20">
      {/* Header with High-Impact Typography */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-bold text-indigo-400 uppercase tracking-wider">
            <GraduationCap className="w-5 h-5" />
            <span>EPAM Systems &bull; Architectural Assessment Gate</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            EPAM B1 Skill Level Verification Exam
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 max-w-4xl leading-relaxed">
            25 calibrated real-world architectural scenarios evaluating your readiness across <strong className="text-white font-semibold">Box 1 (Novice)</strong>, <strong className="text-white font-semibold">Box 2 (Intermediate)</strong>, and <strong className="text-white font-semibold">Box 3 (Advanced)</strong> bars. Verifies whether your decision-making satisfies the strict EPAM Level 1 / B1 standard.
          </p>
        </div>

        {/* Global Status Banner */}
        <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
          {!isExamSubmitted ? (
            <>
              {/* Timer Pill */}
              <div className="flex items-center space-x-3 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 shadow-md">
                <Clock className={`w-5 h-5 ${timeRemainingSeconds < 300 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
                <div>
                  <div className="text-xs uppercase font-extrabold text-zinc-400">Time Remaining</div>
                  <div className="text-xl font-mono font-black text-white">
                    {formatTimer(timeRemainingSeconds)}
                  </div>
                </div>
              </div>

              {/* Progress Count */}
              <div className="flex items-center space-x-3 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 shadow-md">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="text-xs uppercase font-extrabold text-zinc-400">Answered</div>
                  <div className="text-xl font-black text-white">
                    <span className="text-cyan-400">{answeredCount}</span> / {EXAM_QUESTIONS.length}
                  </div>
                </div>
              </div>

              <button
                onClick={calculateResults}
                disabled={answeredCount < 5}
                className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:pointer-events-none text-white text-sm font-black transition-all shadow-lg flex items-center gap-2"
              >
                <span>Submit Exam &amp; Verify Skills</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={handleRetakeExam}
              className="px-5 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold transition-all shadow-md flex items-center gap-2 border border-zinc-700"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Verification Exam</span>
            </button>
          )}
        </div>
      </div>

      {/* IF EXAM IS SUBMITTED: SHOW THE OFFICIAL SKILL LEVEL VERIFICATION REPORT */}
      {isExamSubmitted && savedResult && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Executive Verdict Banner */}
          <div className={`p-8 sm:p-12 rounded-3xl border shadow-2xl relative overflow-hidden ${
            savedResult.verdict === 'B1 Certified Pass'
              ? 'border-emerald-500/50 bg-gradient-to-b from-emerald-950/40 via-zinc-900 to-zinc-950'
              : savedResult.verdict === 'Marginal Candidate'
              ? 'border-amber-500/50 bg-gradient-to-b from-amber-950/40 via-zinc-900 to-zinc-950'
              : 'border-rose-500/50 bg-gradient-to-b from-rose-950/40 via-zinc-900 to-zinc-950'
          }`}>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="flex items-center space-x-2.5">
                  <span className={`px-3.5 py-1 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider ${
                    savedResult.verdict === 'B1 Certified Pass'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : savedResult.verdict === 'Marginal Candidate'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    Official Verdict &bull; {savedResult.verdict}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">Assessed on {savedResult.completedAt}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {savedResult.verdict === 'B1 Certified Pass'
                    ? 'Senior Architect (Level 1 / B1) Verified!'
                    : savedResult.verdict === 'Marginal Candidate'
                    ? 'Marginal Assessment: Targeted Gaps Require Remediation'
                    : 'Substandard Bar: Architectural Gaps Identified'}
                </h2>

                <p className="text-base text-zinc-300 leading-relaxed font-normal">
                  {savedResult.verdict === 'B1 Certified Pass'
                    ? 'Congratulations! Your score meets or exceeds the required EPAM LevelUp Box 3 (Advanced) thresholds across Solution Architecture, Application Architecture, and Leadership. You are ready to defend your Cox Automotive artifact in the 90-minute Full Session.'
                    : savedResult.verdict === 'Marginal Candidate'
                    ? 'You demonstrated solid architectural familiarity, but one or more critical Advanced domains (Box 3) fell below the 80% passing bar. Focus on quantitative NFR defense, DynamoDB Single-Table trade-offs, and disaster recovery.'
                    : 'Your answers reflect an Intermediate/Novice engineering baseline rather than the autonomous B1 Software Architect bar. Review the verbatim 30s defense scripts and milestone labs in the roadmap before scheduling the full session.'}
                </p>
              </div>

              {/* Score Dial */}
              <div className="flex items-center space-x-4 bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 shadow-xl self-start md:self-auto">
                <div className="text-center space-y-1">
                  <div className="text-4xl sm:text-5xl font-black text-white">
                    <span className={savedResult.percentage >= 80 ? 'text-emerald-400' : savedResult.percentage >= 65 ? 'text-amber-400' : 'text-rose-400'}>
                      {savedResult.percentage}%
                    </span>
                  </div>
                  <div className="text-xs uppercase font-extrabold text-zinc-400">
                    {savedResult.totalScore} / {EXAM_QUESTIONS.length} Questions Correct
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Domain-by-Domain Bar Analysis Table */}
          <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-xl">
            <div className="p-6 sm:p-8 border-b border-zinc-800 bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-indigo-400 text-xs sm:text-sm font-bold uppercase tracking-wider">
                  <BarChart3 className="w-5 h-5" />
                  <span>EPAM LevelUp Competency Calibration</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Skill Level Verification Matrix (Current vs. Required Bar)
                </h3>
              </div>
              <span className="text-xs text-zinc-400 font-mono">
                Advanced (Box 3): 80% Bar &bull; Intermediate: 70% Bar
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950 text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-400">
                    <th className="py-4 px-6">Domain</th>
                    <th className="py-4 px-6">Required EPAM Bar</th>
                    <th className="py-4 px-6">Your Score</th>
                    <th className="py-4 px-6">Passing Threshold</th>
                    <th className="py-4 px-6">Skill Level Verification</th>
                    <th className="py-4 px-6 text-right">Roadmap Remediation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-sm sm:text-base">
                  {Object.entries(savedResult.domainScores).map(([domName, stat]) => (
                    <tr key={domName} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-5 px-6 font-bold text-white">
                        <span className="text-base sm:text-lg">{domName}</span>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                          stat.targetBar === 'Advanced'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                            : stat.targetBar === 'Intermediate'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {stat.targetBar === 'Advanced' ? 'Box 3: Advanced' : stat.targetBar === 'Intermediate' ? 'Box 2: Intermediate' : 'Box 1: Novice'}
                        </span>
                      </td>
                      <td className="py-5 px-6 font-mono font-bold">
                        <span className={stat.passed ? 'text-emerald-400' : 'text-rose-400'}>
                          {stat.correct}/{stat.total} ({stat.percentage}%)
                        </span>
                      </td>
                      <td className="py-5 px-6 text-zinc-400 font-mono text-sm">
                        {stat.targetBar === 'Advanced' ? '>= 80%' : '>= 70%'}
                      </td>
                      <td className="py-5 px-6">
                        {stat.passed ? (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold">
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>VERIFIED (Good Enough)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-bold">
                            <X className="w-4 h-4 text-rose-400" />
                            <span>GAP (Needs Practice)</span>
                          </span>
                        )}
                      </td>
                      <td className="py-5 px-6 text-right">
                        <Link
                          href={`/roadmap`}
                          className="inline-flex items-center space-x-1 text-xs sm:text-sm font-bold text-indigo-400 hover:text-indigo-300"
                        >
                          <span>Review Skills</span>
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Question-by-Question Forensic Audit Review */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-white">Forensic Question-by-Question Audit</h3>
            <div className="space-y-6">
              {EXAM_QUESTIONS.map((q, idx) => {
                const userChoice = savedResult.answers[q.id];
                const isCorrect = userChoice === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className={`p-6 sm:p-8 rounded-3xl border space-y-4 shadow-xl ${
                      isCorrect
                        ? 'border-emerald-500/30 bg-zinc-900/60'
                        : 'border-rose-500/30 bg-zinc-900/60'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                      <div className="flex items-center space-x-3">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white ${
                          isCorrect ? 'bg-emerald-600' : 'bg-rose-600'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-sm font-bold text-white">{q.domain}</span>
                        <span className="text-xs font-mono text-zinc-400">({q.targetBar} Bar)</span>
                      </div>
                      <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase ${
                        isCorrect
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}>
                        {isCorrect ? 'Correct' : `Incorrect (You chose ${userChoice || 'None'})`}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-zinc-400 leading-relaxed">{q.scenario}</p>
                      <h4 className="text-base sm:text-lg font-bold text-white">{q.question}</h4>
                    </div>

                    {/* Options Breakdown */}
                    <div className="grid grid-cols-1 gap-2.5 pt-2">
                      {q.options.map(opt => {
                        const isThisCorrect = opt.id === q.correctAnswer;
                        const isThisUserChoice = opt.id === userChoice;

                        return (
                          <div
                            key={opt.id}
                            className={`p-4 rounded-2xl border text-sm flex items-start space-x-3 ${
                              isThisCorrect
                                ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-100 font-semibold'
                                : isThisUserChoice
                                ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                                : 'bg-zinc-950 border-zinc-800/80 text-zinc-400'
                            }`}
                          >
                            <span className="font-mono font-bold w-6">{opt.id}.</span>
                            <span className="flex-1">{opt.text}</span>
                            {isThisCorrect && <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
                            {!isThisCorrect && isThisUserChoice && <X className="w-5 h-5 text-rose-400 flex-shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                      <span className="text-xs uppercase font-extrabold text-indigo-400">Senior Architect Explanation:</span>
                      <p className="text-sm text-zinc-200 leading-relaxed">{q.explanation}</p>
                      <p className="text-xs text-zinc-500 font-mono pt-1">{q.b1Relevance}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* IF EXAM IS IN PROGRESS: INTERACTIVE QUESTION FLOW */}
      {!isExamSubmitted && (
        <div className="space-y-8">
          {/* Question Index Navigator Pills */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-zinc-400 mr-2 uppercase tracking-wider">Jump to Question:</span>
            {filteredQuestions.map((q, idx) => {
              const isCurrent = idx === currentQuestionIndex;
              const hasAnswer = !!userAnswers[q.id];

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400'
                      : hasAnswer
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Active Question Studio Card */}
          <div className="p-8 sm:p-12 rounded-3xl border border-zinc-800 bg-zinc-900/70 space-y-8 shadow-2xl">
            {/* Meta tags */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-5">
              <div className="flex items-center space-x-3">
                <span className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Question {currentQuestionIndex + 1} of {filteredQuestions.length}
                </span>
                <span className="text-sm font-bold text-white">{currentQ.domain}</span>
              </div>
              <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase ${
                currentQ.targetBar === 'Advanced'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : currentQ.targetBar === 'Intermediate'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                Target Bar: {currentQ.targetBar}
              </span>
            </div>

            {/* Scenario & Question */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 text-sm sm:text-base text-zinc-300 leading-relaxed">
                <strong className="text-zinc-400 uppercase text-xs block mb-1">Architectural Scenario:</strong>
                {currentQ.scenario}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                {currentQ.question}
              </h2>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-4">
              {currentQ.options.map((opt) => {
                const isSelected = userAnswers[currentQ.id] === opt.id;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQ.id, opt.id)}
                    className={`w-full text-left p-5 sm:p-6 rounded-2xl border transition-all flex items-start space-x-4 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/40 shadow-lg ring-1 ring-indigo-500/50 text-white'
                        : 'border-zinc-800 bg-zinc-950/80 hover:bg-zinc-800/50 text-zinc-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                      isSelected ? 'bg-indigo-600 text-white shadow-md' : 'bg-zinc-900 border border-zinc-700 text-zinc-400'
                    }`}>
                      {opt.id}
                    </div>
                    <span className="text-base sm:text-lg leading-relaxed pt-0.5">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Stepper Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:pointer-events-none text-zinc-300 font-bold text-sm flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Previous Scenario
              </button>

              <button
                disabled={currentQuestionIndex === filteredQuestions.length - 1}
                onClick={() => setCurrentQuestionIndex(prev => Math.min(filteredQuestions.length - 1, prev + 1))}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:pointer-events-none text-white font-extrabold text-sm flex items-center gap-2 shadow-md transition-all"
              >
                Next Scenario <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
