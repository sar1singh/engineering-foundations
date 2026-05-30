"use client";

import { useActionState } from "react";
import { ActionMessage } from "@/components/persistence/ActionMessage";
import { SubmitButton } from "@/components/persistence/SubmitButton";
import { initialPersistenceActionState, markTopicCompleteFormAction } from "@/lib/actions/progress-actions";

export function TopicCompletionForm({ topicId, isComplete }: { topicId: string; isComplete: boolean }) {
  const [state, formAction] = useActionState(markTopicCompleteFormAction.bind(null, topicId), initialPersistenceActionState);

  return (
    <form action={formAction} className="space-y-2">
      <SubmitButton disabled={isComplete} pendingLabel="Saving...">
        {isComplete ? "Topic complete" : "Mark topic complete"}
      </SubmitButton>
      <ActionMessage state={state} />
    </form>
  );
}
