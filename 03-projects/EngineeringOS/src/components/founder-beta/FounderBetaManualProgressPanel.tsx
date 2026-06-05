"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import {
  founderBetaCapabilities,
  founderBetaDailyMissions
} from "@/data/founder-beta";
import { founderBetaFacadeService } from "@/lib/services/founder-beta-facade-service";
import type { FounderBetaProgressInput } from "@/lib/services/founder-beta-progress-adapter-service";
import type { DailyMission } from "@/types/founder-beta";

export type FounderBetaInitialMode = "default" | "demo" | "weak-area";

export function FounderBetaManualProgressPanel({
  initialMode,
  initialProgress,
  isPersistedInitialProgress
}: {
  initialMode: FounderBetaInitialMode;
  initialProgress: FounderBetaProgressInput;
  isPersistedInitialProgress: boolean;
}) {
  const stableInitialProgress = useMemo(() => initialProgress, [initialProgress]);
  const [progressInput, setProgressInput] = useState<FounderBetaProgressInput>(initialProgress);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isHydrated, setIsHydrated] = useState(false);
  const plan = founderBetaFacadeService.getFounderBetaPlanFromProgress(progressInput);
  const { todayPlan, readinessSnapshot, primaryMission, optionalMissions, nextActions, validationWarnings } = plan;
  const failedHardGates = readinessSnapshot.hardGates.filter((gate) => !gate.passed);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => setIsHydrated(true), 0);
    return () => window.clearTimeout(hydrationTimer);
  }, []);

  return (
    <section className="space-y-6">
      <div className="eo-card p-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-teal-700">Founder Beta</p>
          {initialMode === "demo" ? (
            <span className="rounded-full border border-teal-700 px-2 py-0.5 text-xs font-semibold text-teal-700">
              Demo progress active
            </span>
          ) : null}
          {initialMode === "weak-area" ? (
            <span className="rounded-full border border-red-700 px-2 py-0.5 text-xs font-semibold text-red-700">
              Weak-area demo active
            </span>
          ) : null}
          <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs font-semibold text-[var(--muted)]">
            Local draft only
          </span>
          {isPersistedInitialProgress ? (
            <span className="rounded-full border border-indigo-700 px-2 py-0.5 text-xs font-semibold text-indigo-700">
              Saved local progress loaded
            </span>
          ) : null}
        </div>
        <h1 className="mt-2 text-3xl font-semibold">{todayPlan.path.name}</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--muted)]">{todayPlan.path.targetOutcome}</p>
      </div>

      <section className="eo-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-teal-700">Manual Progress Draft</p>
            <h2 className="mt-1 text-xl font-semibold">Local input sandbox</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Saved locally. Not synced. Not final evaluated readiness.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="rounded-md border border-[var(--border)] px-3 py-2 text-sm font-semibold text-[var(--foreground)]"
              type="button"
              onClick={() => {
                setProgressInput(stableInitialProgress);
                setSaveStatus("idle");
              }}
            >
              Reset draft
            </button>
            <button
              className="rounded-md bg-teal-700 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!isHydrated || saveStatus === "saving"}
              type="button"
              onClick={() => saveLocalProgress(progressInput, setSaveStatus)}
            >
              {saveStatus === "saving" ? "Saving..." : "Save local progress"}
            </button>
          </div>
        </div>
        {saveStatus === "saved" ? (
          <p className="mt-3 rounded-md border border-teal-200 bg-teal-50 p-3 text-sm font-semibold text-teal-800">
            Local progress saved
          </p>
        ) : null}
        {saveStatus === "error" ? (
          <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">
            Local progress could not be saved.
          </p>
        ) : null}

        <div className="mt-5 grid gap-5">
          <DraftSection title="Session Settings" description="Adjust today's local time budget and mission mode.">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                Available minutes
                <input
                  className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-[var(--foreground)]"
                  min={0}
                  type="number"
                  value={progressInput.availableMinutes ?? 60}
                  onChange={(event) => setProgressInput((current) => ({ ...current, availableMinutes: Number(event.target.value) }))}
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Day mode
                <select
                  className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-[var(--foreground)]"
                  value={progressInput.dayMode ?? "weekday"}
                  onChange={(event) => setProgressInput((current) => ({ ...current, dayMode: event.target.value === "weekend" ? "weekend" : "weekday" }))}
                >
                  <option value="weekday">weekday</option>
                  <option value="weekend">weekend</option>
                </select>
              </label>
            </div>
          </DraftSection>

          <DraftSection title="Manual Readiness Estimates" description="These values feed hard-gate and mission selection calculations for this local draft.">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <ReadinessInput
                label="Architect Readiness"
                value={progressInput.manualReadinessScores?.architectReadiness ?? 0}
                onChange={(value) => updateReadiness(setProgressInput, "architectReadiness", value)}
              />
              <ReadinessInput
                label="AWS Readiness"
                value={progressInput.manualReadinessScores?.awsReadiness ?? 0}
                onChange={(value) => updateReadiness(setProgressInput, "awsReadiness", value)}
              />
              <ReadinessInput
                label="Behavioral Readiness"
                value={progressInput.manualReadinessScores?.behavioralReadiness ?? 0}
                onChange={(value) => updateReadiness(setProgressInput, "behavioralReadiness", value)}
              />
              <ReadinessInput
                label="Communication Readiness"
                value={progressInput.manualReadinessScores?.communicationReadiness ?? 0}
                onChange={(value) => updateReadiness(setProgressInput, "communicationReadiness", value)}
              />
              <ReadinessInput
                label="Resume Readiness"
                value={progressInput.manualReadinessScores?.resumeReadiness ?? 0}
                onChange={(value) => updateReadiness(setProgressInput, "resumeReadiness", value)}
              />
            </div>
            <p className="mt-3 text-sm text-[var(--muted)]">
              These are manual draft estimates for internal validation. They are not persisted and are not final evaluated readiness scores.
            </p>
          </DraftSection>

          <DraftSection title="Weak Areas" description="Mark capabilities that should influence repair and mission priority in the local draft.">
            <CheckboxGroup
              title="Weak capabilities"
              items={founderBetaCapabilities.map((capability) => ({ id: capability.id, label: capability.name }))}
              selectedIds={progressInput.weakAreaCapabilityIds ?? []}
              onChange={(ids) => setProgressInput((current) => ({ ...current, weakAreaCapabilityIds: ids }))}
            />
          </DraftSection>

          <DraftSection title="Completed Work" description="Marking a mission complete removes it from today's mission selection.">
            <CheckboxGroup
              title="Completed missions"
              items={founderBetaDailyMissions.map((mission) => ({ id: mission.id, label: getMissionLabel(mission) }))}
              selectedIds={progressInput.completedMissionIds ?? []}
              onChange={(ids) => setProgressInput((current) => ({ ...current, completedMissionIds: ids }))}
            />
          </DraftSection>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="eo-card p-5">
          <p className="text-sm font-semibold text-teal-700">Primary Mission</p>
          {primaryMission ? (
            <div className="mt-3">
              <h2 className="text-2xl font-semibold">{primaryMission.objective}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {primaryMission.missionType} / {primaryMission.estimatedMinutes} min
              </p>
              <div className="mt-4 space-y-2">
                {primaryMission.tasks.map((task) => (
                  <div key={task.id} className="rounded-md border border-[var(--border)] p-3">
                    <p className="font-medium">{task.description}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{task.expectedOutput}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-[var(--muted)]">No primary mission is currently selected.</p>
          )}
        </div>

        <div className="eo-card p-5">
          <p className="text-sm font-semibold text-teal-700">Readiness Snapshot</p>
          <div className="mt-4 space-y-3">
            <ReadinessRow label="Architect Readiness" value={readinessSnapshot.architectReadiness} />
            <ReadinessRow label="Role Readiness" value={readinessSnapshot.roleReadiness} />
            <ReadinessRow label="Offer Readiness" value={readinessSnapshot.offerReadiness.score} />
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="eo-card p-5">
          <p className="text-sm font-semibold text-teal-700">Optional Missions</p>
          <div className="mt-3 space-y-2">
            {optionalMissions.length > 0 ? (
              optionalMissions.map((mission) => (
                <div key={mission.id} className="rounded-md border border-[var(--border)] p-3">
                  <p className="font-medium">{mission.objective}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {mission.missionType} / {mission.estimatedMinutes} min
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--muted)]">No optional missions fit the current draft.</p>
            )}
          </div>
        </div>

        <div className="eo-card p-5">
          <p className="text-sm font-semibold text-teal-700">Next Actions</p>
          <div className="mt-3 space-y-2">
            {nextActions.map((action) => (
              <div key={action.id} className="rounded-md border border-[var(--border)] p-3">
                <p className="font-medium">{action.label}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{action.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="eo-card p-5">
        <p className="text-sm font-semibold text-teal-700">Hard Gate Status</p>
        <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {readinessSnapshot.hardGates.map((gate) => (
            <div key={gate.id} className="rounded-md border border-[var(--border)] p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{gate.label}</p>
                <span className={gate.passed ? "text-sm font-semibold text-teal-700" : "text-sm font-semibold text-red-700"}>
                  {gate.passed ? "Passed" : "Blocked"}
                </span>
              </div>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {gate.actual} / {gate.threshold}
              </p>
            </div>
          ))}
        </div>
        {failedHardGates.length > 0 ? (
          <p className="mt-3 text-sm text-[var(--muted)]">{failedHardGates.length} hard gates are below threshold in the local draft.</p>
        ) : null}
      </section>

      {validationWarnings.length > 0 ? (
        <section className="eo-card p-5">
          <p className="text-sm font-semibold text-red-700">Validation Warnings</p>
          <div className="mt-3 space-y-2">
            {validationWarnings.map((warning) => (
              <p key={warning} className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {warning}
              </p>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}

function ReadinessInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <input
        className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-[var(--foreground)]"
        max={100}
        min={0}
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

async function saveLocalProgress(
  progressInput: FounderBetaProgressInput,
  setSaveStatus: (status: "idle" | "saving" | "saved" | "error") => void
) {
  setSaveStatus("saving");

  try {
    const response = await fetch("/api/founder-beta/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(progressInput)
    });

    if (!response.ok) {
      throw new Error("Failed to save founder beta progress.");
    }

    setSaveStatus("saved");
  } catch {
    setSaveStatus("error");
  }
}

function DraftSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-md border border-[var(--border)] p-4">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function CheckboxGroup({
  title,
  items,
  selectedIds,
  onChange
}: {
  title: string;
  items: Array<{ id: string; label: string }>;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-2 max-h-56 space-y-2 overflow-y-auto rounded-md border border-[var(--border)] p-3">
        {items.map((item) => (
          <label key={item.id} className="flex items-start gap-2 text-sm text-[var(--muted)]">
            <input
              checked={selectedIds.includes(item.id)}
              className="mt-1"
              type="checkbox"
              onChange={(event) => onChange(toggleId(selectedIds, item.id, event.target.checked))}
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function getMissionLabel(mission: DailyMission): string {
  return `${formatMissionType(mission.missionType)}: ${mission.objective}`;
}

function formatMissionType(type: string): string {
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function ReadinessRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[var(--muted)]">{label}</p>
        <p className="font-semibold">{value}%</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-teal-700" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

function updateReadiness(
  setProgressInput: (updater: (current: FounderBetaProgressInput) => FounderBetaProgressInput) => void,
  key: keyof NonNullable<FounderBetaProgressInput["manualReadinessScores"]>,
  value: number
) {
  setProgressInput((current) => ({
    ...current,
    manualReadinessScores: {
      ...current.manualReadinessScores,
      [key]: value
    }
  }));
}

function toggleId(ids: string[], id: string, checked: boolean): string[] {
  if (checked) {
    return Array.from(new Set([...ids, id]));
  }

  return ids.filter((item) => item !== id);
}
