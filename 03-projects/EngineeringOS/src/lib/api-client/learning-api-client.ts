import type {
  LearnerProfileResponse,
  LearnerProfileUpdateRequest,
  ProgressSummaryResponse,
  QualityStatusResponse,
  ReadinessResponse
} from "@/lib/api-contracts/learning-api";

async function readJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const learningApiClient = {
  getLearnerProfile() {
    return readJson<LearnerProfileResponse>("/api/learner/profile");
  },
  updateLearnerProfile(input: LearnerProfileUpdateRequest) {
    return readJson<LearnerProfileResponse>("/api/learner/profile", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input)
    });
  },
  getProgressSummary() {
    return readJson<ProgressSummaryResponse>("/api/progress/summary");
  },
  getReadiness() {
    return readJson<ReadinessResponse>("/api/readiness");
  },
  getQualityStatus() {
    return readJson<QualityStatusResponse>("/api/quality/status");
  }
};
