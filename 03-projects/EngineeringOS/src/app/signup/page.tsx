import Link from "next/link";
import { Rocket } from "lucide-react";

export default function SignUpPage() {
  return (
    <section className="grid min-h-[70vh] items-center gap-8 lg:grid-cols-[0.9fr_1fr]">
      <form className="eo-card p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-pink-500 to-indigo-500 text-white">
          <Rocket className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-3xl font-semibold">Create your job-switch mission.</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">This is a polished mock signup. Real auth will be wired after provider selection.</p>
        <label className="mt-5 block space-y-2">
          <span className="text-sm font-semibold">Name</span>
          <input className="eo-input" placeholder="Your name" />
        </label>
        <label className="mt-4 block space-y-2">
          <span className="text-sm font-semibold">Target role</span>
          <select className="eo-input" defaultValue="solution-architect">
            <option value="backend-senior-engineer">Senior Backend Engineer</option>
            <option value="solution-architect">AWS Solution Architect</option>
            <option value="staff-principal-engineer">Staff/Principal Engineer</option>
            <option value="engineering-manager">Engineering Manager</option>
          </select>
        </label>
        <Link className="eo-primary-action mt-6 w-full px-4 py-3 text-sm" href="/onboarding">Build local learning plan</Link>
      </form>
      <div className="eo-glow-card p-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">What happens next</p>
        <h2 className="mt-3 text-4xl font-semibold">A guided course path, not a blank dashboard.</h2>
        <div className="mt-6 grid gap-3">
          {["Pick a target role", "Create weekly time budget", "Lock weak areas", "Start mission mode", "Track readiness"].map((item, index) => (
            <div key={item} className="eo-panel flex items-center gap-3 p-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-800">{index + 1}</span>
              <span className="font-semibold">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
