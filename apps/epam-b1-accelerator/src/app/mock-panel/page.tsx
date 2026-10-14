'use client';

import React, { useState } from 'react';
import { 
  MessageSquareCode, 
  Send, 
  RotateCcw, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  User, 
  Bot, 
  ShieldCheck,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PanelMessage } from '@/types';
import { COX_AUTO_SAD_DATA } from '@/data/coxAutoSADData';

const INITIAL_MESSAGES: PanelMessage[] = [
  {
    id: 'm-intro',
    sender: 'Dmitry (Chair)',
    avatarColor: 'bg-indigo-600',
    text: 'Welcome to your EPAM B1 Software Architect Assessment session. I am Dmitry, Committee Chair. With me today are Elena, our Chief Architect for Cloud & Distributed Systems, and Marcus from Enterprise Architecture Governance. We will audit your Cox Automotive Solution Architecture Document and drill into your technical decisions. Whenever you are ready, defend your choices concisely—ideally using an analogy, explicit trade-offs (Gain vs. Sacrifice), and quantifiable metrics.',
    timestamp: 'Assessment Start'
  },
  {
    id: 'm-q1',
    sender: 'Dmitry (Chair)',
    avatarColor: 'bg-indigo-600',
    text: 'Let us begin with your persistence tier in ADR-01. You chose DynamoDB Single-Table design over Aurora MySQL for your vehicle catalog. Automotive data is inherently relational (Dealers, Showrooms, Vehicles, Appraisals). Why force this into a NoSQL single table? How do you perform complex relational searches without SQL JOINs, and what did you sacrifice?',
    timestamp: '00:02'
  }
];

export default function MockPanelPage() {
  const [messages, setMessages] = useLocalStorage<PanelMessage[]>('epam_b1_mock_panel_history', INITIAL_MESSAGES);
  const [inputAnswer, setInputAnswer] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const questionsPool = [
    {
      interrogator: 'Elena (Cloud Lead)' as const,
      color: 'bg-cyan-600',
      question: 'Your NFR states RPO = 0 (zero lost pricing updates) under a 2,500 RPS peak. If your ECS Fargate stream processing workers crash midway through a burst, how does your architecture guarantee zero lost data and prevent duplicate writes?'
    },
    {
      interrogator: 'Marcus (Gov & Arch)' as const,
      color: 'bg-purple-600',
      question: 'In ADR-03, you rejected distributed locks like Redis Redlock in favor of DynamoDB ConditionExpression. In an exclusive flash sale with 500 buyers clicking reserve at the exact same millisecond, 499 will fail with 409 Conflict. How do you protect user experience and avoid a thundering herd against your database?'
    },
    {
      interrogator: 'Elena (Cloud Lead)' as const,
      color: 'bg-cyan-600',
      question: 'Your ingestion pipeline is asynchronous (ADR-02), introducing a 2-second eventual consistency lag. What happens when a dealer updates a price from $30,000 to $25,000 and immediately refreshes their portal? How do you solve the read-your-own-writes dilemma?'
    },
    {
      interrogator: 'Dmitry (Chair)' as const,
      color: 'bg-indigo-600',
      question: 'Your RTO is 15 minutes and RPO is 0. If AWS us-east-1 suffers a total regional blackout, walk us step-by-step through your failover execution. What automated vs manual steps occur, and what happens to in-flight messages?'
    },
    {
      interrogator: 'Marcus (Gov & Arch)' as const,
      color: 'bg-purple-600',
      question: 'Cox Automotive syndicates inventory for competing dealership groups. How do you enforce strict tenant data isolation in a shared DynamoDB single table and prevent Dealer A from viewing or overwriting Dealer B confidential wholesale prices?'
    }
  ];

  // Rule-based heuristic evaluation engine
  const evaluateAnswer = (text: string) => {
    const lower = text.toLowerCase();
    const length = text.trim().split(/\s+/).length;

    const hasAnalogy = lower.includes('like a') || lower.includes('analogy') || lower.includes('think of') || lower.includes('similar to') || lower.includes('conveyor') || lower.includes('locker') || lower.includes('ledger');
    const hasTradeoff = lower.includes('trade-off') || lower.includes('tradeoff') || lower.includes('gain') || lower.includes('sacrifice') || lower.includes('at the expense of') || lower.includes('cost') || lower.includes('tax');
    const hasNumbers = /\d+/.test(text) || lower.includes('rps') || lower.includes('ms') || lower.includes('latency') || lower.includes('rpo') || lower.includes('rto');
    const hasMechanics = lower.includes('conditionexpression') || lower.includes('dynamodb') || lower.includes('sqs') || lower.includes('dlq') || lower.includes('cqrs') || lower.includes('opensearch') || lower.includes('redis') || lower.includes('idempotent') || lower.includes('iam') || lower.includes('token') || lower.includes('circuit breaker');

    let score: 1 | 2 | 3 | 4 = 1;
    let label: 'Unsatisfactory' | 'Marginal' | 'B1 Solid Pass' | 'B2 Distinction' = 'Unsatisfactory';
    let feedback = '';

    const checks = [
      { item: 'Quantified metrics or SLAs cited (e.g. 2,500 RPS, P99 < 150ms)', passed: hasNumbers },
      { item: 'Clear Gain vs. Sacrifice trade-off explicitly articulated', passed: hasTradeoff },
      { item: 'Concrete architectural mechanisms named (DynamoDB, SQS, CQRS, etc.)', passed: hasMechanics },
      { item: 'Plain-English analogy or conceptual clarity provided', passed: hasAnalogy }
    ];

    const passedCount = checks.filter(c => c.passed).length;

    if (length < 25) {
      score = 1;
      label = 'Unsatisfactory';
      feedback = 'Answer is too brief. An architect in a B1 assessment must provide a structured, defensible justification rather than a one-sentence assertion.';
    } else if (passedCount <= 1) {
      score = 1;
      label = 'Unsatisfactory';
      feedback = 'Answer lacks architectural substance. You named technologies but did not explain trade-offs, failure recovery, or quantitative constraints.';
    } else if (passedCount === 2) {
      score = 2;
      label = 'Marginal';
      feedback = 'Marginal response. You demonstrated basic technical familiarity, but missed either the trade-off defense (Gain vs. Sacrifice) or concrete failure mitigation details.';
    } else if (passedCount === 3) {
      score = 3;
      label = 'B1 Solid Pass';
      feedback = 'Solid B1 Software Architect defense! You clearly articulated the core architectural mechanisms, supported your choices with quantifiable constraints, and acknowledged the trade-offs.';
    } else {
      score = 4;
      label = 'B2 Distinction';
      feedback = 'Outstanding distinction performance! Flawless structure: clear plain-English analogy, quantitative constraints, precise cloud mechanics, and explicit gain-versus-sacrifice defense.';
    }

    return { score, label, feedback, checklist: checks };
  };

  const handleSendAnswer = () => {
    if (!inputAnswer.trim()) return;

    const userMsg: PanelMessage = {
      id: `user-${Date.now()}`,
      sender: 'Candidate',
      avatarColor: 'bg-emerald-600',
      text: inputAnswer,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setIsEvaluating(true);

    const evaluation = evaluateAnswer(inputAnswer);

    const evalMsg: PanelMessage = {
      id: `eval-${Date.now()}`,
      sender: 'Dmitry (Chair)',
      avatarColor: 'bg-indigo-600',
      text: `Evaluation of Candidate Response: ${evaluation.feedback}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      grade: evaluation
    };

    // Pick next panel follow-up question
    const nextQ = questionsPool[Math.floor(Math.random() * questionsPool.length)];
    const followUpMsg: PanelMessage = {
      id: `followup-${Date.now() + 1}`,
      sender: nextQ.interrogator,
      avatarColor: nextQ.color,
      text: nextQ.question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, userMsg, evalMsg, followUpMsg]);
      setInputAnswer('');
      setIsEvaluating(false);
    }, 600);
  };

  const handleResetSession = () => {
    if (confirm('Reset mock committee examination chat history?')) {
      setMessages(INITIAL_MESSAGES);
    }
  };

  const injectPresetQuestion = (q: typeof questionsPool[0]) => {
    const qMsg: PanelMessage = {
      id: `q-${Date.now()}`,
      sender: q.interrogator,
      avatarColor: q.color,
      text: q.question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, qMsg]);
  };

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Header with High-Impact Typography */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-zinc-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-bold text-rose-400 uppercase tracking-wider">
            <MessageSquareCode className="w-5 h-5" />
            <span>Committee Defense Simulator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Mock Committee Examiner
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            Simulate forensic cross-examination before a panel of 3 Senior and Chief Architects. Real-time scoring on a 1–4 scale evaluating analogies, quantifiable SLAs, and trade-off defense.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <button
            onClick={handleResetSession}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-sm font-bold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Session</span>
          </button>
        </div>
      </div>

      {/* Committee Panel Profiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 flex items-center space-x-3.5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-md">
            D
          </div>
          <div className="truncate">
            <div className="text-sm font-bold text-white">Dmitry (Lead Chair)</div>
            <div className="text-xs text-indigo-300 truncate">Software Architecture Discipline</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 flex items-center space-x-3.5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center font-black text-white text-sm shadow-md">
            E
          </div>
          <div className="truncate">
            <div className="text-sm font-bold text-white">Elena (Chief Architect)</div>
            <div className="text-xs text-cyan-300 truncate">Cloud &amp; Distributed Systems</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-purple-500/30 bg-purple-950/20 flex items-center space-x-3.5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center font-black text-white text-sm shadow-md">
            M
          </div>
          <div className="truncate">
            <div className="text-sm font-bold text-white">Marcus (Senior Architect)</div>
            <div className="text-xs text-purple-300 truncate">Governance &amp; Enterprise ADRs</div>
          </div>
        </div>
      </div>

      {/* Preset Questions Injection Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-zinc-400 mr-1 flex items-center gap-1.5 uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" /> Prompt Committee with Target Question:
        </span>
        {questionsPool.map((q, idx) => (
          <button
            key={idx}
            onClick={() => injectPresetQuestion(q)}
            className="px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors font-medium"
          >
            {q.interrogator.split(' ')[0]}: {q.question.slice(0, 32)}...
          </button>
        ))}
      </div>

      {/* Chat Messages Feed */}
      <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 sm:p-8 min-h-[460px] max-h-[700px] overflow-y-auto shadow-2xl">
        {messages.map((m) => {
          const isCandidate = m.sender === 'Candidate';
          const isGrade = !!m.grade;

          return (
            <div
              key={m.id}
              className={`flex items-start space-x-4 ${isCandidate ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center text-sm font-black text-white shadow-lg ${
                  m.avatarColor || 'bg-zinc-700'
                }`}
              >
                {isCandidate ? <User className="w-5 h-5" /> : m.sender[0]}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-3xl p-5 sm:p-6 text-sm sm:text-base leading-relaxed shadow-md ${
                  isCandidate
                    ? 'bg-emerald-950/40 border border-emerald-500/30 text-zinc-100'
                    : isGrade
                    ? 'bg-zinc-900 border border-indigo-500/40 text-zinc-200'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-2 text-xs text-zinc-400 font-bold">
                  <span className="text-white">{m.sender}</span>
                  <span className="font-mono">{m.timestamp}</span>
                </div>

                <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>

                {/* Rubric Grade Card if present */}
                {m.grade && (
                  <div className="mt-4 pt-4 border-t border-zinc-800 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                        Official Assessment Scoring:
                      </span>
                      <span
                        className={`px-3 py-1 rounded-xl text-xs sm:text-sm font-black uppercase ${
                          m.grade.score >= 3
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : m.grade.score === 2
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        Score {m.grade.score}/4: {m.grade.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {m.grade.checklist.map((c, i) => (
                        <div key={i} className="flex items-center space-x-2 text-xs">
                          {c.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                          )}
                          <span className={c.passed ? 'text-zinc-200 font-medium' : 'text-zinc-500'}>
                            {c.item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isEvaluating && (
          <div className="flex items-center space-x-3 text-sm text-zinc-400 italic py-3">
            <span className="w-3 h-3 rounded-full bg-indigo-500 animate-ping" />
            <span>Committee is evaluating your architectural response against the B1 rubric...</span>
          </div>
        )}
      </div>

      {/* Input Composer */}
      <div className="space-y-3">
        <div className="relative">
          <textarea
            rows={4}
            placeholder="Type your 30-second committee defense here. Tip: Use an analogy, cite quantitative metrics (2,500 RPS, P99 < 150ms), state what you sacrificed, and define failure recovery..."
            value={inputAnswer}
            onChange={(e) => setInputAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSendAnswer();
              }
            }}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 pr-28 text-sm sm:text-base text-zinc-100 placeholder-zinc-500 leading-relaxed focus:outline-none focus:border-indigo-500 transition-colors shadow-lg"
          />

          <button
            onClick={handleSendAnswer}
            disabled={!inputAnswer.trim() || isEvaluating}
            className="absolute right-4 bottom-4 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:pointer-events-none text-white text-sm font-black transition-all shadow-md flex items-center gap-2"
          >
            <span>Defend</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-zinc-500 text-right font-medium">
          Press <kbd className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">Ctrl + Enter</kbd> to submit defense to committee
        </p>
      </div>
    </div>
  );
}
