import Link from "next/link";
import { LogIn, ShieldCheck } from "lucide-react";

export default function SignInPage() {
  return (
    <section className="grid min-h-[70vh] items-center gap-8 lg:grid-cols-[1fr_0.85fr]">
      <div className="eo-glow-card p-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Account preview</p>
        <h1 className="mt-3 text-4xl font-semibold">Sign in will unlock cloud progress later.</h1>
        <p className="mt-4 text-[var(--muted)]">
          This phase keeps auth local/mock. The UI is ready for Clerk, Auth.js, or Cognito once the provider decision is made.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {["Profile ownership", "Cross-device progress", "Mock interview history", "Goal recovery"].map((item) => (
            <div key={item} className="eo-panel flex items-center gap-3 p-3">
              <ShieldCheck className="h-4 w-4 text-teal-700" aria-hidden="true" />
              <span className="text-sm font-semibold">{item}</span>
            </div>
          ))}
        </div>
      </div>
      <form className="eo-card p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-white">
          <LogIn className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold">Local sign-in placeholder</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">No external auth is connected yet. Use local guest mode for manual testing.</p>
        <label className="mt-5 block space-y-2">
          <span className="text-sm font-semibold">Email</span>
          <input className="eo-input" placeholder="you@example.com" type="email" />
        </label>
        <label className="mt-4 block space-y-2">
          <span className="text-sm font-semibold">Password</span>
          <input className="eo-input" placeholder="Provider pending" type="password" />
        </label>
        <Link className="eo-primary-action mt-6 w-full px-4 py-3 text-sm" href="/profile">Continue as local guest</Link>
        <Link className="mt-4 block text-center text-sm font-semibold text-teal-700" href="/signup">Create local goal instead</Link>
      </form>
    </section>
  );
}
