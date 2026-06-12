import Link from "next/link";
import DiscoveryAgentPreview from "@/components/founder-beta/DiscoveryAgentPreview";

export default function DiscoveryAgentPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-teal-700">Founder Beta</p>
          <h1 className="mt-1 text-xl font-semibold">Discovery Agent</h1>
          <p className="mt-1 text-sm text-gray-500">
            Runtime discovery agent — accepts a URL, extracts metadata, generates a candidate, checks for duplicates, and prepares a review queue item. Session-only, no writes.
          </p>
        </div>
        <Link
          className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          href="/founder-beta"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="rounded-lg border border-indigo-200 bg-white">
        <DiscoveryAgentPreview />
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        <p className="font-semibold">Session-Only State</p>
        <p>All data is held in React useState and will be lost on page reload. No database writes, no autonomous publishing.</p>
      </div>
    </div>
  );
}
