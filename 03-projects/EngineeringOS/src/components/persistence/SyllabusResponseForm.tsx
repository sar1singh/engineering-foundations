"use client";

import { useActionState } from "react";
import { ActionMessage } from "@/components/persistence/ActionMessage";
import { SubmitButton } from "@/components/persistence/SubmitButton";
import { initialPersistenceActionState } from "@/lib/actions/persistence-action-state";
import { saveSyllabusResponseStateAction } from "@/lib/actions/progress-actions";

export function SyllabusResponseForm({
  topicId,
  prompt,
  promptType
}: {
  topicId: string;
  prompt: string;
  promptType: string;
}) {
  const [state, formAction] = useActionState(saveSyllabusResponseStateAction.bind(null, topicId), initialPersistenceActionState);

  return (
    <form action={formAction} className="mt-3 space-y-3">
      <input name="promptType" type="hidden" value={promptType} />
      <input name="prompt" type="hidden" value={prompt} />
      <textarea
        className="min-h-28 w-full rounded-md border border-[var(--border)] p-3 text-sm outline-none focus:border-teal-700"
        name="answer"
        placeholder="Submit your response, solution notes, or interview answer."
      />
      <SubmitButton pendingLabel="Saving..." variant="secondary">
        Save response
      </SubmitButton>
      <ActionMessage state={state} />
    </form>
  );
}
