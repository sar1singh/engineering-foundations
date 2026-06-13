import Link from "next/link";
import AutonomousDiscoveryPreview from "@/components/founder-beta/AutonomousDiscoveryPreview";

export default function AutonomousDiscoveryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-teal-700">Founder Beta</p>
          <h1 className="mt-1 text-xl font-semibold">Autonomous Discovery</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gap-cluster-driven adaptive discovery with seed expansion, confidence scoring, coverage heatmaps, and legacy seed-backed agents.
          </p>
        </div>
        <Link
          className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          href="/founder-beta"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="rounded-lg border border-teal-200 bg-white">
        <AutonomousDiscoveryPreview />
      </div>
    </div>
  );
}
