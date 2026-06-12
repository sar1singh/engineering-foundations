import { ImportReviewPanel } from "@/components/founder-beta/ImportReviewPanel";
import firstImportCandidates from "../../../../data/ingestion/first-import-candidates.json";
import type { ApprovedImportCandidate } from "@/types/ingestion-patch";

export default function ImportReviewPage() {
  const candidates = firstImportCandidates as ApprovedImportCandidate[];

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <ImportReviewPanel candidates={candidates} />
    </div>
  );
}
