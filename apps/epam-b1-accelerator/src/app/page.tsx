'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Target, 
  Clock, 
  Layers, 
  FileText, 
  Cpu, 
  MessageSquareCode, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  BarChart3,
  Flame,
  Award,
  Database,
  Check,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  RotateCcw,
  Download,
  Upload,
  ListChecks
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SYLLABUS_DATA } from '@/data/syllabusData';
import { FLASHCARDS_DATA } from '@/data/flashcardsData';
import { TOTAL_TOPICS_COUNT } from '@/data/skillTopicsAndLinksData';

export default function DashboardPage() {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const [competencyStatus] = useLocalStorage<Record<string, string>>('epam_b1_competencies', {});
  const [completedTopics] = useLocalStorage<Record<string, boolean>>('epam_b1_completed_topics', {});
  const [flashcardStatus] = useLocalStorage<Record<string, string>>('epam_b1_flashcards', {});
  const [examResult] = useLocalStorage<any>('epam_b1_latest_exam_result', null);
  const [sadStatus, setSadStatus] = useLocalStorage<Record<string, boolean>>('epam_b1_sad_checks', {
    nfrsReviewed: false,
    c4TopologyMastered: false,
    adr01Mastered: false,
    adr02Mastered: false,
    adr03Mastered: false,
    crossExamPracticed: false
  });

  const totalCompetencies = SYLLABUS_DATA.length; // 38
  const masteredCompetencies = Object.values(competencyStatus).filter(v => v === 'mastered').length;
  const learningCompetencies = Object.values(competencyStatus).filter(v => v === 'learning').length;

  const totalTopics = TOTAL_TOPICS_COUNT; // ~114
  const completedTopicsCount = Object.values(completedTopics).filter(Boolean).length;

  const totalCards = FLASHCARDS_DATA.length; // 30
  const masteredCards = Object.values(flashcardStatus).filter(v => v === 'mastered').length;
  const learningCards = Object.values(flashcardStatus).filter(v => v === 'learning').length;

  const sadChecksTotal = Object.keys(sadStatus).length;
  const sadChecksPassed = Object.values(sadStatus).filter(Boolean).length;
  const sadPercentage = Math.round((sadChecksPassed / sadChecksTotal) * 100);

  const examScorePercent = examResult ? (examResult.percentage || 0) : 0;

  // Authentic Overall readiness score (0% by default for real clean study progress)
  const readinessScore = Math.round(
    ((masteredCompetencies / totalCompetencies) * 0.25 +
     (completedTopicsCount / (totalTopics || 1)) * 0.25 +
     (masteredCards / totalCards) * 0.15 +
     (sadChecksPassed / sadChecksTotal) * 0.15 +
     (examScorePercent / 100) * 0.20) * 100
  );

  const toggleSadCheck = (key: string) => {
    setSadStatus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleResetAllData = () => {
    if (confirm('Are you sure you want to reset all study progress back to 0%? This will clear all checked topics, mastered competencies, flashcards, exam scores, and SAD defense checks.')) {
      localStorage.removeItem('epam_b1_competencies');
      localStorage.removeItem('epam_b1_completed_topics');
      localStorage.removeItem('epam_b1_flashcards');
      localStorage.removeItem('epam_b1_sad_checks');
      localStorage.removeItem('epam_b1_latest_exam_result');
      localStorage.removeItem('epam_b1_exam_draft_answers');
      localStorage.removeItem('epam_b1_exercise_answers');
      localStorage.removeItem('epam_b1_exercise_evaluations');
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const data = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      competencies: JSON.parse(localStorage.getItem('epam_b1_competencies') || '{}'),
      completedTopics: JSON.parse(localStorage.getItem('epam_b1_completed_topics') || '{}'),
      flashcards: JSON.parse(localStorage.getItem('epam_b1_flashcards') || '{}'),
      sadChecks: JSON.parse(localStorage.getItem('epam_b1_sad_checks') || '{}'),
      latestExamResult: JSON.parse(localStorage.getItem('epam_b1_latest_exam_result') || 'null'),
      exerciseAnswers: JSON.parse(localStorage.getItem('epam_b1_exercise_answers') || '{}'),
      exerciseEvaluations: JSON.parse(localStorage.getItem('epam_b1_exercise_evaluations') || '{}')
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `epam_b1_study_progress_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.competencies) localStorage.setItem('epam_b1_competencies', JSON.stringify(json.competencies));
        if (json.completedTopics) localStorage.setItem('epam_b1_completed_topics', JSON.stringify(json.completedTopics));
        if (json.flashcards) localStorage.setItem('epam_b1_flashcards', JSON.stringify(json.flashcards));
        if (json.sadChecks) localStorage.setItem('epam_b1_sad_checks', JSON.stringify(json.sadChecks));
        if (json.latestExamResult) localStorage.setItem('epam_b1_latest_exam_result', JSON.stringify(json.latestExamResult));
        if (json.exerciseAnswers) localStorage.setItem('epam_b1_exercise_answers', JSON.stringify(json.exerciseAnswers));
        if (json.exerciseEvaluations) localStorage.setItem('epam_b1_exercise_evaluations', JSON.stringify(json.exerciseEvaluations));
        alert('Study progress imported successfully!');
        window.location.reload();
      } catch (err) {
        alert('Invalid study progress JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const domainStats = [
    { name: 'Solution Arch', count: 7, bar: 'Box 3: Advanced', color: 'border-indigo-500/40 text-indigo-300 bg-indigo-500/15' },
    { name: 'Application Arch', count: 7, bar: 'Box 3: Advanced', color: 'border-blue-500/40 text-blue-300 bg-blue-500/15' },
    { name: 'Cloud', count: 3, bar: 'Box 2: Intermediate', color: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/15' },
    { name: 'SDLC Processes', count: 4, bar: 'Box 3 / Box 2', color: 'border-amber-500/40 text-amber-300 bg-amber-500/15' },
    { name: 'Leadership & Soft', count: 11, bar: 'Box 3: Advanced / NAT B2', color: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/15' },
    { name: 'AI', count: 2, bar: 'Box 2 / Box 1', color: 'border-purple-500/40 text-purple-300 bg-purple-500/15' },
    { name: 'Business', count: 4, bar: 'Box 1: Novice', color: 'border-rose-500/40 text-rose-300 bg-rose-500/15' },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Executive Command Briefing - Big Screen Typography */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 via-zinc-900/60 to-zinc-950 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-[32rem] h-[32rem] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          <div className="space-y-4 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                <ShieldCheck className="w-4 h-4 mr-1.5" /> EPAM LevelUp Architecture Discipline
              </span>
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <Target className="w-4 h-4 mr-1.5" /> Level 1 / B1 Full Session
              </span>
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Clock className="w-4 h-4 mr-1.5" /> 90-Minute Committee Gate
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              EPAM B1 Software Architect Accelerator
            </h1>
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
              Autonomous preparation command center for the 90-minute Full Session assessment. Defend the real-world{' '}
              <strong className="text-white font-semibold underline decoration-indigo-500/50 underline-offset-4">Cox Automotive</strong> production artifact (AWS + Node.js + DynamoDB Single-Table),
              master all <strong className="text-white font-semibold">38 LevelUp competencies</strong>, and practice live HLD whiteboard scenarios.
            </p>
          </div>

          {/* Readiness Gauge Widget - Large & Clear */}
          <div className="flex-shrink-0 flex items-center justify-center bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-zinc-800"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray={364}
                    strokeDashoffset={364 - (364 * readinessScore) / 100}
                    strokeLinecap="round"
                    className="text-indigo-500 transition-all duration-1000 ease-out"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl font-black text-white">{readinessScore}%</span>
                  <span className="text-xs uppercase font-extrabold text-zinc-400">Readiness</span>
                </div>
              </div>
              <div className="text-sm font-bold text-indigo-300">B1 Committee Gate Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Level Verification Exam Callout Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950/60 via-zinc-900 to-zinc-950 p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs sm:text-sm font-bold uppercase tracking-wider">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span>Autonomous Competency Calibration &bull; 25 Scenarios</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {examResult ? `Latest Assessment: ${examResult.verdict} (${examResult.percentage}%)` : 'Verify Your Skill Level for EPAM B1 Software Architect'}
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Take the timed 25-scenario diagnostic exam to verify whether your architectural decisions meet the required <strong className="text-white">Box 3 (Advanced)</strong>, <strong className="text-white">Box 2 (Intermediate)</strong>, and <strong className="text-white">Box 1 (Novice)</strong> thresholds across all 7 domains.
          </p>
        </div>

        <Link
          href="/exam"
          className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-lg transition-all self-start md:self-auto whitespace-nowrap"
        >
          <span>{examResult ? 'View Scorecard / Retake' : 'Launch Verification Exam'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Real Study Progress Controls & Offline Data Management */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>Study Progress Engine &bull; Production Ready</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active Zero-Baseline
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400">
              Track authentic preparation: check off granular syllabus topics, verify skill bars via 25-scenario exam, and defend Cox Auto NFRs.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportData}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs sm:text-sm font-bold transition-all border border-zinc-700 flex items-center gap-1.5"
            title="Import saved progress from JSON"
          >
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>

          <button
            onClick={handleExportData}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs sm:text-sm font-bold transition-all border border-zinc-700 flex items-center gap-1.5"
            title="Export your study progress to JSON"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>

          <button
            onClick={handleResetAllData}
            className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs sm:text-sm font-bold transition-all border border-rose-500/30 flex items-center gap-1.5"
            title="Reset all progress to 0%"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset 0%</span>
          </button>
        </div>
      </div>

      {/* 4 Core Pillars KPI Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Pillar 1: Granular Topics to Cover */}
        <Link 
          href="/roadmap" 
          className="group p-6 rounded-3xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-indigo-500/50 transition-all shadow-lg flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <ListChecks className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-zinc-400 group-hover:text-indigo-300 flex items-center gap-1.5">
              Study Topics <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Topics to Cover</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-black text-indigo-400">{completedTopicsCount}</span>
              <span className="text-sm font-bold text-zinc-400">/ {totalTopics} Topics</span>
            </div>
            <div className="mt-4 w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${(completedTopicsCount / (totalTopics || 1)) * 100}%` }}
              />
            </div>
          </div>
          <div className="text-xs text-zinc-400 font-medium pt-2 border-t border-zinc-800/80">
            {Math.round((completedTopicsCount / (totalTopics || 1)) * 100)}% Syllabus Coverage &bull; Primary Docs
          </div>
        </Link>

        {/* Pillar 2: 38 LevelUp Competencies */}
        <Link 
          href="/roadmap" 
          className="group p-6 rounded-3xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-emerald-500/50 transition-all shadow-lg flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-zinc-400 group-hover:text-emerald-300 flex items-center gap-1.5">
              Master Table <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Skills Mastered</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-black text-emerald-400">{masteredCompetencies}</span>
              <span className="text-sm font-bold text-zinc-400">/ {totalCompetencies} Skills</span>
            </div>
            <div className="mt-4 w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${(masteredCompetencies / totalCompetencies) * 100}%` }}
              />
            </div>
          </div>
          <div className="text-xs text-zinc-400 flex justify-between font-medium pt-2 border-t border-zinc-800/80">
            <span>Practicing: {learningCompetencies}</span>
            <span>Needs work: {totalCompetencies - masteredCompetencies - learningCompetencies}</span>
          </div>
        </Link>

        {/* Pillar 3: Practice Verification Exam */}
        <Link 
          href="/exam" 
          className="group p-6 rounded-3xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-cyan-500/50 transition-all shadow-lg flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-zinc-400 group-hover:text-cyan-300 flex items-center gap-1.5">
              {examResult ? 'Scorecard' : 'Take Exam'} <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Verification Exam</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-black text-cyan-400">{examScorePercent}%</span>
              <span className="text-sm font-bold text-zinc-400">{examResult ? 'Certified' : 'Diagnostic'}</span>
            </div>
            <div className="mt-4 w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${examScorePercent}%` }}
              />
            </div>
          </div>
          <div className="text-xs text-zinc-400 font-medium pt-2 border-t border-zinc-800/80 line-clamp-1">
            {examResult ? examResult.verdict : '25 Scenarios &bull; Box 1/2/3 Thresholds'}
          </div>
        </Link>

        {/* Pillar 4: Production SAD Defense */}
        <Link 
          href="/artifact-builder" 
          className="group p-6 rounded-3xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-amber-500/50 transition-all shadow-lg flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-zinc-400 group-hover:text-amber-300 flex items-center gap-1.5">
              Inspect Defense <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">SAD Defense Gate</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-black text-amber-400">{sadPercentage}%</span>
              <span className="text-sm font-bold text-zinc-400">({sadChecksPassed}/{sadChecksTotal})</span>
            </div>
            <div className="mt-4 w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${sadPercentage}%` }}
              />
            </div>
          </div>
          <div className="text-xs text-zinc-400 font-medium pt-2 border-t border-zinc-800/80">
            Cox Automotive (2,500 RPS Peak, 3 ADRs)
          </div>
        </Link>
      </div>

      {/* Interactive Production SAD Defense Gate Checklist (Direct Checkbox Verification) */}
      <div className="p-6 sm:p-8 rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Production SAD Defense Verification Gate</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Cox Automotive Artifact Defense Milestones
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              Click checkboxes to mark defense readiness as you review the NFR metrics, C4 topology, and 3 ADRs.
            </p>
          </div>
          <Link
            href="/artifact-builder"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold transition-all self-start sm:self-auto"
          >
            <span>Open SAD Workbench</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { key: 'nfrsReviewed', title: '1. NFR Metrics Verified', desc: '2,500 RPS Peak, P99 < 150ms, RPO=0, RTO < 15m' },
            { key: 'c4TopologyMastered', title: '2. C4 Level 2 Ingestion Topology', desc: 'API Gateway -> SQS FIFO -> Fargate Worker' },
            { key: 'adr01Mastered', title: '3. ADR-01: DynamoDB Single-Table', desc: 'Defend sub-10ms reads vs query latency trade-off' },
            { key: 'adr02Mastered', title: '4. ADR-02: Outbox CDC & EventBridge', desc: 'Transactional syndication with zero silent drops' },
            { key: 'adr03Mastered', title: '5. ADR-03: Fargate Microservices', desc: 'Blast radius isolation & independent autoscaling' },
            { key: 'crossExamPracticed', title: '6. Stress-Test Cross-Exam', desc: '6 forensic panel defense scenarios rehearsed' },
          ].map((item) => {
            const isChecked = !!sadStatus[item.key];
            return (
              <div
                key={item.key}
                onClick={() => toggleSadCheck(item.key)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isChecked
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div className="pt-0.5 flex-shrink-0">
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                    isChecked
                      ? 'bg-amber-500 border-amber-400 text-zinc-950'
                      : 'border-zinc-600 bg-zinc-900'
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className={`text-sm font-bold ${isChecked ? 'text-amber-300' : 'text-white'}`}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assessment Dynamics - Clean Executive Blueprint Table (No Nested Clutter) */}
      <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-xl">
        <div className="p-6 sm:p-8 border-b border-zinc-800 bg-zinc-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm uppercase tracking-wider">
              <Clock className="w-5 h-5" />
              <span>90-Minute Committee Assessment Blueprint</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Two-Phase Full Session Execution Dynamics
            </h2>
          </div>
          <span className="text-sm text-zinc-400 font-mono self-start sm:self-auto bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl">
            2–3 Senior / Chief Architect Examiners
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950 text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-400">
                <th className="py-4 px-6">Assessment Phase</th>
                <th className="py-4 px-6">Core Focus &amp; Format</th>
                <th className="py-4 px-6">Candidate Deliverables</th>
                <th className="py-4 px-6">Committee Pass Criteria</th>
                <th className="py-4 px-6 text-right">Direct Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-sm sm:text-base">
              {/* Part 1 */}
              <tr className="hover:bg-zinc-800/30 transition-colors">
                <td className="py-6 px-6 align-top">
                  <div className="space-y-1.5">
                    <span className="inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                      PART 1 &bull; 45 MIN
                    </span>
                    <div className="text-lg font-bold text-white">Production SAD Defense</div>
                    <div className="text-xs text-zinc-400 font-mono">Forensic Technical Audit</div>
                  </div>
                </td>
                <td className="py-6 px-6 align-top text-zinc-300 leading-relaxed max-w-sm">
                  Audit of your submitted Cox Automotive Solution Architecture Document. The committee tests authentic authorship, explores rejected architectural alternatives, and interrogates NFR feasibility under stress.
                </td>
                <td className="py-6 px-6 align-top text-zinc-300 leading-relaxed">
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      <span>Verify NFR metrics (2,500 RPS, P99 &lt; 150ms, RPO=0)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      <span>Defend 3 ADRs with explicit Gain vs. Sacrifice</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      <span>C4 Level 2 Ingestion &amp; Syndication container flows</span>
                    </li>
                  </ul>
                </td>
                <td className="py-6 px-6 align-top">
                  <span className="inline-block px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold">
                    Quantified Trade-off Defense (No Hand-waving)
                  </span>
                </td>
                <td className="py-6 px-6 align-top text-right whitespace-nowrap">
                  <Link
                    href="/artifact-builder"
                    className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all"
                  >
                    <span>Launch SAD Workbench</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </td>
              </tr>

              {/* Part 2 */}
              <tr className="hover:bg-zinc-800/30 transition-colors">
                <td className="py-6 px-6 align-top">
                  <div className="space-y-1.5">
                    <span className="inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      PART 2 &bull; 45 MIN
                    </span>
                    <div className="text-lg font-bold text-white">Live Whiteboarding</div>
                    <div className="text-xs text-zinc-400 font-mono">Live High-Level Design (HLD)</div>
                  </div>
                </td>
                <td className="py-6 px-6 align-top text-zinc-300 leading-relaxed max-w-sm">
                  Given an ambiguous real-world client problem (e.g. Flash-Sale Reservation or Multi-Tenant IoT Fleet), candidate must strictly execute EPAM&apos;s 4-step framework on the whiteboard without jumping prematurely to code.
                </td>
                <td className="py-6 px-6 align-top text-zinc-300 leading-relaxed">
                  <ol className="space-y-2 list-decimal list-inside font-medium">
                    <li><strong className="text-white">Step 1:</strong> Clarify FRs &amp; Quantify NFRs</li>
                    <li><strong className="text-white">Step 2:</strong> C4 Container Topology</li>
                    <li><strong className="text-white">Step 3:</strong> Persistence &amp; Concurrency</li>
                    <li><strong className="text-white">Step 4:</strong> Failure Modes &amp; Blast Radius</li>
                  </ol>
                </td>
                <td className="py-6 px-6 align-top">
                  <span className="inline-block px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold">
                    Systematic 4-Step Discipline (No Premature Tech)
                  </span>
                </td>
                <td className="py-6 px-6 align-top text-right whitespace-nowrap">
                  <Link
                    href="/hld-simulator"
                    className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all"
                  >
                    <span>Launch HLD Simulator</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* EPAM LevelUp Skills Inventory - Table View (Replaces 7 Tiny Boxes) */}
      <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-xl">
        <div className="p-6 sm:p-8 border-b border-zinc-800 bg-zinc-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm uppercase tracking-wider">
              <BarChart3 className="w-5 h-5" />
              <span>EPAM LevelUp Skills Inventory (38 Total Competencies)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Domain Coverage &amp; Mastery Distribution
            </h2>
          </div>
          <Link
            href="/roadmap"
            className="inline-flex items-center space-x-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 self-start sm:self-auto bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl transition-all"
          >
            <span>Open 38-Competency Master Table</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950 text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-400">
                <th className="py-4 px-6">Domain</th>
                <th className="py-4 px-6">LevelUp Target Bar</th>
                <th className="py-4 px-6">Total Competencies</th>
                <th className="py-4 px-6">Mastery Status</th>
                <th className="py-4 px-6 text-right">Drilldown</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-sm sm:text-base">
              {domainStats.map((dom) => {
                const domainCompetencies = SYLLABUS_DATA.filter(c => c.domain === dom.name);
                const masteredInDomain = domainCompetencies.filter(c => competencyStatus[c.id] === 'mastered').length;
                const percent = Math.round((masteredInDomain / dom.count) * 100);

                return (
                  <tr key={dom.name} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-white">
                      <span className="text-base sm:text-lg">{dom.name}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-extrabold border ${dom.color}`}>
                        {dom.bar}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-zinc-300">
                      {dom.count} Competencies
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3 max-w-xs">
                        <div className="flex-1 bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-2.5 rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-400 whitespace-nowrap">
                          {masteredInDomain}/{dom.count} ({percent}%)
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/roadmap`}
                        className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-zinc-400 hover:text-white transition-colors"
                      >
                        <span>View in Roadmap</span>
                        <ChevronRight className="w-4 h-4 text-indigo-400" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4 Primary System Launchpads - Big Screen Readable Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/roadmap"
          className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-indigo-500/50 transition-all shadow-xl flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-white text-lg">38-Skill Interactive Table</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Explore all competencies via table mode or modal deep-dive with verbatim 30s defense scripts, roadmaps, and client interview exercises.
            </p>
          </div>
          <span className="text-sm font-bold text-indigo-400 flex items-center gap-1.5 pt-4 border-t border-zinc-800/80">
            Open Roadmap <ArrowRight className="w-4 h-4" />
          </span>
        </Link>

        <Link
          href="/jargon"
          className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-cyan-500/50 transition-all shadow-xl flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-white text-lg">30 Architecture Flashcards</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Interactive 3D flip deck and architecture matrix covering CAP, Sagas, Outbox CDC, Bulkheads, Circuit Breakers, and C4 levels.
            </p>
          </div>
          <span className="text-sm font-bold text-cyan-400 flex items-center gap-1.5 pt-4 border-t border-zinc-800/80">
            Flip Flashcards <ArrowRight className="w-4 h-4" />
          </span>
        </Link>

        <Link
          href="/artifact-builder"
          className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-amber-500/50 transition-all shadow-xl flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-white text-lg">SAD Defense Workbench</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Edit Cox Automotive architecture data, examine NFR metrics table, review ADR decision matrix, and test against 6 tough panel questions.
            </p>
          </div>
          <span className="text-sm font-bold text-amber-400 flex items-center gap-1.5 pt-4 border-t border-zinc-800/80">
            Open SAD Workbench <ArrowRight className="w-4 h-4" />
          </span>
        </Link>

        <Link
          href="/mock-panel"
          className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-rose-500/50 transition-all shadow-xl flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <MessageSquareCode className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-white text-lg">Committee Mock Examiner</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Simulate cross-examination by Dmitry, Elena, and Marcus with instant 1–4 scale scoring on your architectural answers.
            </p>
          </div>
          <span className="text-sm font-bold text-rose-400 flex items-center gap-1.5 pt-4 border-t border-zinc-800/80">
            Start Mock Interview <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}
