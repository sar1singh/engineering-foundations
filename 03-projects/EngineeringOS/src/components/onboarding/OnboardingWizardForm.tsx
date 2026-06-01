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
    <form action={formAction} className="eo-card grid gap-4 p-5 md:grid-cols-2">
      <div className="md:col-span-2">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">Goal builder</p>
        <h2 className="mt-1 text-2xl font-semibold">Turn your ambition into a weekly mission plan.</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">This local profile will later map cleanly to real authenticated user state.</p>
      </div>
      <label className="space-y-2 rounded-2xl border border-[var(--border)] bg-slate-50 p-4">
        <span className="text-sm font-medium">Target role</span>
        <select className="eo-input" defaultValue={preferences.targetRole} name="targetRole">
          <option value="backend-senior-engineer">Senior Backend Engineer</option>
          <option value="solution-architect">AWS Solution Architect</option>
          <option value="staff-principal-engineer">Staff Principal Engineer</option>
          <option value="engineering-manager">Engineering Manager</option>
        </select>
      </label>
      <label className="space-y-2 rounded-2xl border border-[var(--border)] bg-slate-50 p-4">
        <span className="text-sm font-medium">Current level</span>
        <select className="eo-input" defaultValue={preferences.currentLevel} name="currentLevel">
          <option value="junior">Junior</option>
          <option value="mid">Mid-level</option>
          <option value="senior">Senior</option>
          <option value="staff-em">Staff/EM</option>
        </select>
      </label>
      <label className="space-y-2 rounded-2xl border border-[var(--border)] bg-slate-50 p-4">
        <span className="text-sm font-medium">Hours per week</span>
        <input className="eo-input" defaultValue={preferences.hoursPerWeek} min={1} name="hoursPerWeek" type="number" />
      </label>
      <label className="space-y-2 rounded-2xl border border-[var(--border)] bg-slate-50 p-4">
        <span className="text-sm font-medium">Deadline in weeks</span>
        <input className="eo-input" defaultValue={preferences.deadlineWeeks} min={1} name="deadlineWeeks" type="number" />
      </label>
      <label className="space-y-2 rounded-2xl border border-[var(--border)] bg-slate-50 p-4">
        <span className="text-sm font-medium">Learning mode</span>
        <select className="eo-input" defaultValue={preferences.learningMode} name="learningMode">
          <option value="core-80-20">80/20 focused</option>
          <option value="balanced">Balanced</option>
          <option value="deep-mastery">Deep mastery</option>
        </select>
      </label>
      <label className="space-y-2 rounded-2xl border border-[var(--border)] bg-slate-50 p-4">
        <span className="text-sm font-medium">Weak areas</span>
        <input className="eo-input" defaultValue={preferences.weakAreas.join(", ")} name="weakAreas" placeholder="aws, graph, hld" />
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
