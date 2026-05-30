"use client";

import { useActionState } from "react";
import { ActionMessage } from "@/components/persistence/ActionMessage";
import { SubmitButton } from "@/components/persistence/SubmitButton";
import { initialPersistenceActionState } from "@/lib/actions/persistence-action-state";
import { saveTopicExplainBackStateAction } from "@/lib/actions/progress-actions";

export function ExplainBackForm({ topicId }: { topicId: string }) {
  const [state, formAction] = useActionState(saveTopicExplainBackStateAction.bind(null, topicId), initialPersistenceActionState);

  return (
    <form action={formAction} className="mt-4 space-y-3">
      <textarea
        className="min-h-32 w-full rounded-md border border-[var(--border)] p-3 text-sm outline-none focus:border-teal-700"
        name="answer"
        placeholder="Write your explanation in your own words."
      />
      <SubmitButton pendingLabel="Saving..." variant="secondary">
        Save explain-back
      </SubmitButton>
      <ActionMessage state={state} />
    </form>
  );
}
