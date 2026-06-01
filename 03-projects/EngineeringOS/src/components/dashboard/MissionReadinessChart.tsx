"use client";

import { Bar, BarChart, CartesianGrid, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function MissionReadinessChart({
  domains,
  roles
}: {
  domains: Array<{ title: string; percent: number }>;
  roles: Array<{ title: string; percent: number }>;
}) {
  const radarData = domains.slice(0, 7).map((domain) => ({ subject: shortLabel(domain.title), score: domain.percent }));
  const roleData = roles.map((role) => ({ name: shortLabel(role.title), score: role.percent }));

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="eo-card p-5">
        <h2 className="text-xl font-semibold">Readiness radar</h2>
        <div className="mt-4 h-72 min-h-72 min-w-0">
          <ResponsiveContainer height="100%" width="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(148,163,184,0.28)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--muted)", fontSize: 12 }} />
              <Radar dataKey="score" fill="#818cf8" fillOpacity={0.28} stroke="#22d3ee" strokeWidth={2} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="eo-card p-5">
        <h2 className="text-xl font-semibold">Role path completion</h2>
        <div className="mt-4 h-72 min-h-72 min-w-0">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={roleData}>
              <CartesianGrid stroke="rgba(148,163,184,0.16)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "var(--muted)", fontSize: 12 }} />
              <YAxis tick={{ fill: "var(--muted)", fontSize: 12 }} />
              <Tooltip cursor={{ fill: "rgba(129,140,248,0.12)" }} />
              <Bar dataKey="score" fill="url(#roleGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="roleGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="55%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#d946ef" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

function shortLabel(label: string): string {
  return label.replace("Engineering", "Eng").replace("Solution", "Sol").replace("System Design", "Design").slice(0, 14);
}
