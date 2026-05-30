import { appServices } from "@/lib/providers";

export default function SettingsPage() {
  const { config } = appServices;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-teal-700">Settings</p>
        <h1 className="text-3xl font-semibold">EngineeringOS settings</h1>
        <p className="mt-2 text-[var(--muted)]">Backend-ready placeholders are wired, but real integrations remain disabled.</p>
      </div>
      <section className="rounded-lg border border-[var(--border)] bg-white p-5">
        <h2 className="text-xl font-semibold">App config</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Setting label="App name" value={config.appName} />
          <Setting label="Version" value={config.appVersion} />
          <Setting label="Environment" value={config.environment} />
          <Setting label="Data source" value={config.dataSource} />
        </div>
      </section>
      <section className="rounded-lg border border-[var(--border)] bg-white p-5">
        <h2 className="text-xl font-semibold">Feature flags</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {Object.entries(config.features).map(([key, value]) => (
            <Setting key={key} label={key} value={value ? "enabled" : "disabled"} />
          ))}
        </div>
      </section>
    </section>
  );
}

function Setting({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[var(--border)] p-3">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
