"use client";

import { useActionState } from "react";
import { ActionMessage } from "@/components/persistence/ActionMessage";
import { SubmitButton } from "@/components/persistence/SubmitButton";
import { initialPersistenceActionState } from "@/lib/actions/persistence-action-state";
import { resetLocalProgressFormAction } from "@/lib/actions/progress-actions";

export function ResetProgressForm() {
  const [state, formAction] = useActionState(resetLocalProgressFormAction, initialPersistenceActionState);

  return (
    <form action={formAction} className="space-y-2">
      <SubmitButton pendingLabel="Resetting..." variant="secondary">
        Reset local progress
      </SubmitButton>
      <ActionMessage state={state} />
    </form>
  );
}
