"use client";

import { useEffect, useRef, useState } from "react";

import { founderBetaCapabilities } from "@/data/founder-beta";
import { founderBetaFacadeService } from "@/lib/services/founder-beta-facade-service";
import type { FounderBetaProgressInput } from "@/lib/services/founder-beta-progress-adapter-service";

const defaultPreviewProgress: FounderBetaProgressInput = {
  completedMissionIds: [],
  completedTopicIds: [],
  weakAreaCapabilityIds: [],
  weakAreaTopicIds: [],
  manualReadinessScores: {},
  availableMinutes: 60,
  dayMode: "weekday"
};

export function FounderBetaOnboardingInitializationPreview({ hasSavedProgress }: { hasSavedProgress: boolean }) {
  const [draft, setDraft] = useState<FounderBetaProgressInput>(defaultPreviewProgress);
  const draftRef = useRef<FounderBetaProgressInput>(defaultPreviewProgress);
  const formRef = useRef<HTMLFormElement>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "confirm-overwrite" | "kept" | "error">("idle");
  const [savedProgressExists, setSavedProgressExists] = useState(hasSavedProgress);
  const isHydrated = useHydrationState();
  const plan = founderBetaFacadeService.getFounderBetaPlanFromProgress(draft);
  const { primaryMission, readinessSnapshot, todayPlan, validationWarnings } = plan;
  const gateActuals = {
    awsReadiness: getHardGateActual(readinessSnapshot.hardGates, "rule-aws-readiness"),
    behavioralReadiness: getHardGateActual(readinessSnapshot.hardGates, "rule-behavioral-readiness"),
    communicationReadiness: getHardGateActual(readinessSnapshot.hardGates, "rule-communication-readiness"),
    resumeReadiness: getHardGateActual(readinessSnapshot.hardGates, "rule-resume-readiness")
  };

  function handleSaveRequest() {
    if (savedProgressExists && saveStatus !== "confirm-overwrite") {
      setSaveStatus("confirm-overwrite");
      return;
    }

    if (!formRef.current) {
      setSaveStatus("error");
      return;
    }

    saveOnboardingProgress(readDraftFromForm(new FormData(formRef.current), draftRef.current), setSaveStatus, setSavedProgressExists);
  }

  return (
    <form ref={formRef} className="eo-card p-5" onSubmit={(event) => event.preventDefault()}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-indigo-700">Onboarding Initialization Preview</p>
          <h2 className="mt-1 text-xl font-semibold">Preview first saved-progress shape</h2>
          <p className="mt-1 max-w-3xl text-sm text-[var(--muted)]">
            Preview only. Does not overwrite saved progress.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-indigo-700 px-2 py-0.5 text-xs font-semibold text-indigo-700">
            Preview first
          </span>
          {savedProgressExists ? (
            <span className="rounded-full border border-amber-600 px-2 py-0.5 text-xs font-semibold text-amber-700">
              Saved progress exists
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-4 rounded-md border border-[var(--border)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Onboarding save action</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Saves normalized progress input only. Today Plan and readiness stay derived.
            </p>
          </div>
          {savedProgressExists ? (
            <button
              className="rounded-md border border-amber-400 px-3 py-2 text-sm font-semibold text-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!isHydrated || saveStatus === "saving"}
              type="button"
              onClick={() => setSaveStatus("confirm-overwrite")}
            >
              Overwrite onboarding progress
            </button>
          ) : (
            <button
              className="rounded-md bg-indigo-700 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!isHydrated || saveStatus === "saving"}
              type="button"
              onClick={handleSaveRequest}
            >
              {saveStatus === "saving" ? "Saving..." : "Save onboarding progress"}
            </button>
          )}
        </div>

        {saveStatus === "confirm-overwrite" ? (
          <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3">
            <p className="text-sm font-semibold text-amber-900">
              This will replace your saved local Founder Beta progress. Today Plan and readiness will be recalculated.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                className="rounded-md bg-amber-700 px-3 py-2 text-sm font-semibold text-white"
                type="button"
                onClick={handleSaveRequest}
              >
                Confirm overwrite
              </button>
              <button
                className="rounded-md border border-amber-300 px-3 py-2 text-sm font-semibold text-amber-800"
                type="button"
                onClick={() => setSaveStatus("kept")}
              >
                Keep saved progress
              </button>
            </div>
          </div>
        ) : null}

        {saveStatus === "saved" ? (
          <p className="mt-3 rounded-md border border-teal-200 bg-teal-50 p-3 text-sm font-semibold text-teal-800">
            Onboarding initialization saved locally. Today Plan was recomputed from saved progress.
          </p>
        ) : null}
        {saveStatus === "kept" ? (
          <p className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800">
            Saved progress kept. Onboarding preview was not saved.
          </p>
        ) : null}
        {saveStatus === "error" ? (
          <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">
            Onboarding initialization could not be saved.
          </p>
        ) : null}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <section className="rounded-md border border-[var(--border)] p-4">
            <h3 className="font-semibold">Initial Session Inputs</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                Preview available minutes
                <input
                  className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-[var(--foreground)]"
                  data-founder-preview="available-minutes"
                  min={0}
                  name="availableMinutes"
                  type="number"
                  defaultValue={draft.availableMinutes ?? 60}
                  onChange={(event) => updateDraft(setDraft, draftRef, (current) => ({ ...current, availableMinutes: Number(event.target.value) }))}
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Preview day mode
                <select
                  className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-[var(--foreground)]"
                  data-founder-preview="day-mode"
                  name="dayMode"
                  defaultValue={draft.dayMode ?? "weekday"}
                  onChange={(event) => updateDraft(setDraft, draftRef, (current) => ({ ...current, dayMode: event.target.value === "weekend" ? "weekend" : "weekday" }))}
                >
                  <option value="weekday">weekday</option>
                  <option value="weekend">weekend</option>
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-md border border-[var(--border)] p-4">
            <h3 className="font-semibold">Initial Readiness Estimates</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">Manual draft estimates only. These do not become evaluated readiness scores.</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <ReadinessInput dataKey="architect-readiness" label="Preview Architect Readiness" value={draft.manualReadinessScores?.architectReadiness ?? 0} onChange={(value) => updateReadiness(setDraft, draftRef, "architectReadiness", value)} />
              <ReadinessInput dataKey="aws-readiness" label="Preview AWS Readiness" value={draft.manualReadinessScores?.awsReadiness ?? 0} onChange={(value) => updateReadiness(setDraft, draftRef, "awsReadiness", value)} />
              <ReadinessInput dataKey="behavioral-readiness" label="Preview Behavioral Readiness" value={draft.manualReadinessScores?.behavioralReadiness ?? 0} onChange={(value) => updateReadiness(setDraft, draftRef, "behavioralReadiness", value)} />
              <ReadinessInput dataKey="communication-readiness" label="Preview Communication Readiness" value={draft.manualReadinessScores?.communicationReadiness ?? 0} onChange={(value) => updateReadiness(setDraft, draftRef, "communicationReadiness", value)} />
              <ReadinessInput dataKey="resume-readiness" label="Preview Resume Readiness" value={draft.manualReadinessScores?.resumeReadiness ?? 0} onChange={(value) => updateReadiness(setDraft, draftRef, "resumeReadiness", value)} />
            </div>
          </section>

          <section className="rounded-md border border-[var(--border)] p-4">
            <h3 className="font-semibold">Initial Weak Areas</h3>
            <div className="mt-3 max-h-48 space-y-2 overflow-y-auto rounded-md border border-[var(--border)] p-3">
              {founderBetaCapabilities.map((capability) => (
                <label key={capability.id} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                  <input
                    defaultChecked={(draft.weakAreaCapabilityIds ?? []).includes(capability.id)}
                    className="mt-1"
                    data-founder-preview-capability="true"
                    name="weakAreaCapabilityIds"
                    type="checkbox"
                    value={capability.id}
                    onChange={(event) =>
                      updateDraft(setDraft, draftRef, (current) => ({
                        ...current,
                        weakAreaCapabilityIds: toggleId(current.weakAreaCapabilityIds ?? [], capability.id, event.target.checked)
                      }))
                    }
                  />
                  <span>{capability.name}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <section className="rounded-md border border-[var(--border)] p-4">
            <p className="text-sm font-semibold text-indigo-700">Derived Today Plan Preview</p>
            <h3 className="mt-1 text-lg font-semibold">{todayPlan.path.name}</h3>
            {primaryMission ? (
              <div className="mt-3 rounded-md border border-[var(--border)] p-3">
                <p className="text-sm font-semibold text-[var(--muted)]">Preview Primary Mission</p>
                <p className="mt-1 font-semibold">{primaryMission.objective}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {primaryMission.missionType} / {primaryMission.estimatedMinutes} min
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-[var(--muted)]">No mission would be selected for this onboarding draft.</p>
            )}
          </section>

          <section className="rounded-md border border-[var(--border)] p-4">
            <h3 className="font-semibold">Preview Readiness Snapshot</h3>
            <div className="mt-4 space-y-3">
              <PreviewReadinessRow label="Architect Readiness" value={readinessSnapshot.architectReadiness} />
              <PreviewReadinessRow label="AWS Readiness" value={gateActuals.awsReadiness} />
              <PreviewReadinessRow label="Behavioral Readiness" value={gateActuals.behavioralReadiness} />
              <PreviewReadinessRow label="Communication Readiness" value={gateActuals.communicationReadiness} />
              <PreviewReadinessRow label="Resume Readiness" value={gateActuals.resumeReadiness} />
            </div>
          </section>

          {validationWarnings.length > 0 ? (
            <section className="rounded-md border border-red-200 bg-red-50 p-4">
              <h3 className="font-semibold text-red-800">Preview Validation Warnings</h3>
              <div className="mt-2 space-y-2">
                {validationWarnings.map((warning) => (
                  <p key={warning} className="text-sm text-red-800">{warning}</p>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </form>
  );
}

function useHydrationState(): boolean {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => setIsHydrated(true), 0);
    return () => window.clearTimeout(hydrationTimer);
  }, []);

  return isHydrated;
}

function ReadinessInput({
  dataKey,
  label,
  value,
  onChange
}: {
  dataKey: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <input
        className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-[var(--foreground)]"
        data-founder-preview-readiness={dataKey}
        max={100}
        min={0}
        name={dataKey}
        type="number"
        defaultValue={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function PreviewReadinessRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[var(--muted)]">{label}</p>
        <p className="font-semibold">{value}%</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-indigo-700" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

function updateReadiness(
  setDraft: (updater: (current: FounderBetaProgressInput) => FounderBetaProgressInput) => void,
  draftRef: { current: FounderBetaProgressInput },
  key: keyof NonNullable<FounderBetaProgressInput["manualReadinessScores"]>,
  value: number
) {
  updateDraft(setDraft, draftRef, (current) => ({
    ...current,
    manualReadinessScores: {
      ...current.manualReadinessScores,
      [key]: value
    }
  }));
}

function updateDraft(
  setDraft: (updater: (current: FounderBetaProgressInput) => FounderBetaProgressInput) => void,
  draftRef: { current: FounderBetaProgressInput },
  updater: (current: FounderBetaProgressInput) => FounderBetaProgressInput
) {
  const next = updater(draftRef.current);
  draftRef.current = next;
  setDraft(() => next);
}

function toggleId(ids: string[], id: string, checked: boolean): string[] {
  if (checked) {
    return Array.from(new Set([...ids, id]));
  }

  return ids.filter((item) => item !== id);
}

function getHardGateActual(hardGates: Array<{ id: string; actual: number }>, id: string): number {
  return hardGates.find((gate) => gate.id === id)?.actual ?? 0;
}

function readDraftFromForm(formData: FormData, fallback: FounderBetaProgressInput): FounderBetaProgressInput {
  return {
    ...fallback,
    availableMinutes: readNumberFromForm(formData, "availableMinutes"),
    dayMode: formData.get("dayMode") === "weekend" ? "weekend" : "weekday",
    weakAreaCapabilityIds: formData.getAll("weakAreaCapabilityIds").map(String),
    manualReadinessScores: {
      ...fallback.manualReadinessScores,
      architectReadiness: readNumberFromForm(formData, "architect-readiness"),
      awsReadiness: readNumberFromForm(formData, "aws-readiness"),
      behavioralReadiness: readNumberFromForm(formData, "behavioral-readiness"),
      communicationReadiness: readNumberFromForm(formData, "communication-readiness"),
      resumeReadiness: readNumberFromForm(formData, "resume-readiness")
    }
  };
}

function readNumberFromForm(formData: FormData, key: string): number | undefined {
  const value = formData.get(key);
  return typeof value === "string" && value !== "" ? Number(value) : undefined;
}

async function saveOnboardingProgress(
  draft: FounderBetaProgressInput,
  setSaveStatus: (status: "idle" | "saving" | "saved" | "confirm-overwrite" | "kept" | "error") => void,
  setSavedProgressExists: (exists: boolean) => void
) {
  setSaveStatus("saving");

  try {
    const response = await fetch("/api/founder-beta/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(draft)
    });

    if (!response.ok) {
      throw new Error("Failed to save onboarding initialization.");
    }

    setSavedProgressExists(true);
    setSaveStatus("saved");
  } catch {
    setSaveStatus("error");
  }
}
