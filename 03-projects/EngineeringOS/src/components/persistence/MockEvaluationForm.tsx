"use client";

import { useActionState } from "react";
import { ActionMessage } from "@/components/persistence/ActionMessage";
import { SubmitButton } from "@/components/persistence/SubmitButton";
import { initialPersistenceActionState, savePracticeMockEvaluationStateAction } from "@/lib/actions/progress-actions";

export function MockEvaluationForm({ taskId, topicId }: { taskId: string; topicId: string }) {
  const [state, formAction] = useActionState(
    savePracticeMockEvaluationStateAction.bind(null, taskId, topicId),
    initialPersistenceActionState
  );

  return (
    <form action={formAction} className="mt-5 space-y-3 border-t border-[var(--border)] pt-4">
      <label className="block text-sm font-medium" htmlFor="mock-evaluation-summary">
        Mock evaluation note
      </label>
      <textarea
        className="min-h-24 w-full rounded-md border border-[var(--border)] p-3 text-sm outline-none focus:border-teal-700"
        id="mock-evaluation-summary"
        name="summary"
        placeholder="Capture a short self-review for this task."
      />
      <SubmitButton pendingLabel="Saving..." variant="secondary">
        Save mock evaluation
      </SubmitButton>
      <ActionMessage state={state} />
    </form>
  );
}
