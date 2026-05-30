"use client";

import { useActionState } from "react";
import { ActionMessage } from "@/components/persistence/ActionMessage";
import { SubmitButton } from "@/components/persistence/SubmitButton";
import { initialPersistenceActionState } from "@/lib/actions/persistence-action-state";
import { markTaskCompleteFormAction } from "@/lib/actions/progress-actions";

export function TaskCompletionForm({ taskId, routePath, isComplete }: { taskId: string; routePath: string; isComplete: boolean }) {
  const [state, formAction] = useActionState(
    markTaskCompleteFormAction.bind(null, taskId, routePath),
    initialPersistenceActionState
  );

  return (
    <form action={formAction} className="space-y-2">
      <SubmitButton disabled={isComplete} pendingLabel="Saving...">
        {isComplete ? "Task complete" : "Mark task complete"}
      </SubmitButton>
      <ActionMessage state={state} />
    </form>
  );
}
