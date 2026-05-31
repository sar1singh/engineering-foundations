"use client";

import { useEffect, useMemo, useState } from "react";
import { SyllabusResponseForm } from "@/components/persistence/SyllabusResponseForm";

export function TimedMockInterview({ prompts, topicId }: { prompts: string[]; topicId: string }) {
  const questions = useMemo(() => prompts.slice(0, 5), [prompts]);
  const [index, setIndex] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const currentPrompt = questions[index] ?? "No mock interview prompts available.";

  useEffect(() => {
    if (!startedAt) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [startedAt]);

  return (
    <div className="mt-4 rounded-md border border-[var(--border)] bg-slate-50 p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Timed mock session</p>
          <p className="text-xs text-[var(--muted)]">
            Question {Math.min(index + 1, questions.length)}/{questions.length} / {elapsedSeconds}s elapsed
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-md border border-[var(--border)] px-3 py-2 text-sm"
            onClick={() => {
              setStartedAt(Date.now());
              setElapsedSeconds(0);
            }}
            type="button"
          >
            Start
          </button>
          <button
            className="rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white"
            disabled={index >= questions.length - 1}
            onClick={() => setIndex((value) => Math.min(value + 1, questions.length - 1))}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
      <p className="mt-3 rounded-md bg-white p-3 text-sm text-[var(--muted)]">{currentPrompt}</p>
      <SyllabusResponseForm prompt={currentPrompt} promptType="Timed Mock interview" topicId={topicId} />
    </div>
  );
}
