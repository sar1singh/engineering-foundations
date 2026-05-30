"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingLabel,
  disabled = false,
  variant = "primary"
}: {
  children: string;
  pendingLabel: string;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}) {
  const { pending } = useFormStatus();
  const baseClass =
    "rounded-md px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600";
  const variantClass =
    variant === "primary"
      ? "bg-teal-700 text-white hover:bg-teal-800"
      : "border border-[var(--border)] text-slate-700 hover:border-teal-700";

  return (
    <button className={`${baseClass} ${variantClass}`} disabled={disabled || pending} type="submit">
      {pending ? pendingLabel : children}
    </button>
  );
}
