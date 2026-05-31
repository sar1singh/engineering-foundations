"use client";

import { useActionState } from "react";
import { ActionMessage } from "@/components/persistence/ActionMessage";
import { SubmitButton } from "@/components/persistence/SubmitButton";
import { initialPersistenceActionState } from "@/lib/actions/persistence-action-state";
import { saveLearningPreferencesStateAction } from "@/lib/actions/progress-actions";
import type { LearningPreferences } from "@/types/learning-preferences";

export function OnboardingWizardForm({ preferences }: { preferences: LearningPreferences }) {
  const [state, formAction] = useActionState(saveLearningPreferencesStateAction, initialPersistenceActionState);

  return (
    <form action={formAction} className="grid gap-4 rounded-lg border border-[var(--border)] bg-white p-5 md:grid-cols-2">
      <label className="space-y-2">
        <span className="text-sm font-medium">Target role</span>
        <select className="min-h-10 w-full rounded-md border border-[var(--border)] px-3 text-sm" defaultValue={preferences.targetRole} name="targetRole">
          <option value="backend-senior-engineer">Senior Backend Engineer</option>
          <option value="solution-architect">AWS Solution Architect</option>
          <option value="staff-principal-engineer">Staff Principal Engineer</option>
          <option value="engineering-manager">Engineering Manager</option>
        </select>
      </label>
      <label className="space-y-2">
        <span className="text-sm font-medium">Current level</span>
        <select className="min-h-10 w-full rounded-md border border-[var(--border)] px-3 text-sm" defaultValue={preferences.currentLevel} name="currentLevel">
          <option value="junior">Junior</option>
          <option value="mid">Mid-level</option>
          <option value="senior">Senior</option>
          <option value="staff-em">Staff/EM</option>
        </select>
      </label>
      <label className="space-y-2">
        <span className="text-sm font-medium">Hours per week</span>
        <input className="min-h-10 w-full rounded-md border border-[var(--border)] px-3 text-sm" defaultValue={preferences.hoursPerWeek} min={1} name="hoursPerWeek" type="number" />
      </label>
      <label className="space-y-2">
        <span className="text-sm font-medium">Deadline in weeks</span>
        <input className="min-h-10 w-full rounded-md border border-[var(--border)] px-3 text-sm" defaultValue={preferences.deadlineWeeks} min={1} name="deadlineWeeks" type="number" />
      </label>
      <label className="space-y-2">
        <span className="text-sm font-medium">Learning mode</span>
        <select className="min-h-10 w-full rounded-md border border-[var(--border)] px-3 text-sm" defaultValue={preferences.learningMode} name="learningMode">
          <option value="core-80-20">80/20 focused</option>
          <option value="balanced">Balanced</option>
          <option value="deep-mastery">Deep mastery</option>
        </select>
      </label>
      <label className="space-y-2">
        <span className="text-sm font-medium">Weak areas</span>
        <input className="min-h-10 w-full rounded-md border border-[var(--border)] px-3 text-sm" defaultValue={preferences.weakAreas.join(", ")} name="weakAreas" placeholder="aws, graph, hld" />
      </label>
      <div className="md:col-span-2">
        <SubmitButton pendingLabel="Saving..." variant="primary">
          Save learning plan
        </SubmitButton>
        <ActionMessage state={state} />
      </div>
    </form>
  );
}
