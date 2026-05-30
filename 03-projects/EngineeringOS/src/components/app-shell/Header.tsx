export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm text-[var(--muted)]">Local-first foundation</p>
          <p className="font-semibold">EngineeringOS</p>
        </div>
        <div className="rounded-md border border-[var(--border)] px-3 py-1 text-sm text-[var(--muted)]">
          Mock data
        </div>
      </div>
    </header>
  );
}
