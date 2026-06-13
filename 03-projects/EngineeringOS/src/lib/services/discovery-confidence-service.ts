import type { ConfidenceScoreDetail } from "@/types/adaptive-discovery";
import type { SyllabusGap } from "@/types/gap-driven-ingestion";
import { founderBetaMasterTopics } from "@/data/founder-beta/master-topics";
import { founderBetaSourceCatalog } from "@/data/founder-beta/source-catalog";
import { founderBetaDailyMissions } from "@/data/founder-beta/daily-missions";

export function scoreGraphFit(
  title: string,
  tags: string[],
  domain: string,
  gap: SyllabusGap
): number {
  let score = 0;
  const gapText = (gap.target.entityName + " " + gap.detail + " " + gap.reason).toLowerCase();
  const titleWords = title.toLowerCase().split(/\s+/);

  const matchCount = titleWords.filter((w) => w.length > 3 && gapText.includes(w)).length;
  score += matchCount * 5;

  if (gap.target.entityName.toLowerCase().split(/\s+/).some((w) => title.toLowerCase().includes(w))) {
    score += 15;
  }

  const tagMatch = tags.filter((t) => gapText.includes(t.toLowerCase())).length;
  score += tagMatch * 5;

  if (domain !== "general" && (gap.category === domain || gap.target.entityId.includes(domain))) {
    score += 10;
  }

  return Math.min(score, 100);
}

export function scoreDuplicateProbability(
  title: string,
  url: string
): number {
  const normalizedUrl = url.trim().replace(/\/+$/, "").toLowerCase();
  const sources = founderBetaSourceCatalog;

  for (const src of sources) {
    const srcUrl = src.url.trim().replace(/\/+$/, "").toLowerCase();
    if (srcUrl === normalizedUrl) return 95;
    if (srcUrl.includes(normalizedUrl) || normalizedUrl.includes(srcUrl)) return 70;
  }

  const titleWords = title.toLowerCase().split(/\s+/);
  for (const src of sources) {
    const srcWords = src.title.toLowerCase().split(/\s+/);
    const overlap = titleWords.filter((w) => srcWords.includes(w)).length;
    if (overlap >= Math.min(titleWords.length, srcWords.length) * 0.8) return 60;
  }

  return 5;
}

export function scoreSyllabusRelevance(
  title: string,
  tags: string[],
  domain: string
): number {
  const topics = founderBetaMasterTopics;
  let score = 0;
  const titleWords = title.toLowerCase().split(/\s+/);

  for (const topic of topics) {
    const topicWords = topic.name.toLowerCase().split(/\s+/);
    const overlap = titleWords.filter((w) => topicWords.includes(w) && w.length > 3).length;
    if (overlap >= 2) {
      score += 10;
    }
  }

  const allTags = new Set(founderBetaSourceCatalog.flatMap((s) => [s.category]));
  const tagMatch = tags.filter((t) => [...allTags].some((cat) => cat.includes(t))).length;
  score += tagMatch * 5;

  return Math.min(score, 100);
}

export function scoreSourceQuality(sourceType: string): number {
  const qualityMap: Record<string, number> = {
    "official-docs": 90,
    book: 85,
    "github-repository": 70,
    "engineering-blog": 65,
    "security-guides": 80,
    "interview-guide": 60,
    "career-framework": 60,
    "roadmap": 55,
    "job-description": 40,
  };
  return qualityMap[sourceType] ?? 50;
}

export function scoreInterviewValue(
  title: string,
  tags: string[],
  gap: SyllabusGap | null
): number {
  let score = 0;
  const interviewKeywords = [
    "interview", "system design", "behavioral", "leadership", "coding",
    "algorithm", "database", "distributed", "architecture", "design pattern",
    "api", "microservice", "scalability", "performance",
  ];

  const text = (title + " " + tags.join(" ")).toLowerCase();
  const matches = interviewKeywords.filter((kw) => text.includes(kw)).length;
  score += matches * 10;

  if (gap?.type === "weak-interview-coverage") score += 20;

  return Math.min(score, 100);
}

export function scoreMissionValue(
  title: string,
  tags: string[]
): number {
  const text = (title + " " + tags.join(" ")).toLowerCase();
  const missions = founderBetaDailyMissions;
  let score = 0;

  for (const mission of missions) {
    const missionWords = mission.objective.toLowerCase().split(/\s+/);
    const matchCount = missionWords.filter((w) => w.length > 3 && text.includes(w)).length;
    if (matchCount >= 2) score += 8;
  }

  return Math.min(score, 100);
}

export function scoreReadinessValue(
  title: string,
  tags: string[],
  gap: SyllabusGap | null
): number {
  let score = 0;
  const readinessKeywords = [
    "practice", "hands-on", "implementation", "exercise", "tutorial",
    "guide", "workshop", "lab", "project", "template", "example",
  ];

  const text = (title + " " + tags.join(" ")).toLowerCase();
  const matches = readinessKeywords.filter((kw) => text.includes(kw)).length;
  score += matches * 10;

  if (gap?.type === "weak-readiness-coverage") score += 15;

  return Math.min(score, 100);
}

export function computeConfidenceScore(
  title: string,
  url: string,
  sourceType: string,
  tags: string[],
  domain: string,
  gap: SyllabusGap | null
): ConfidenceScoreDetail {
  const graphFit = scoreGraphFit(title, tags, domain, gap || { target: { entityName: "", entityId: "" }, detail: "", reason: "", category: "", severity: "medium", score: 0, type: "low-source-topic", id: "" } as SyllabusGap);
  const duplicateProbability = scoreDuplicateProbability(title, url);
  const syllabusRelevance = scoreSyllabusRelevance(title, tags, domain);
  const sourceQuality = scoreSourceQuality(sourceType);
  const interviewValue = scoreInterviewValue(title, tags, gap);
  const missionValue = scoreMissionValue(title, tags);
  const readinessValue = scoreReadinessValue(title, tags, gap);

  const rawNormalized =
    graphFit * 0.25 +
    (100 - duplicateProbability) * 0.15 +
    syllabusRelevance * 0.2 +
    sourceQuality * 0.15 +
    interviewValue * 0.1 +
    missionValue * 0.05 +
    readinessValue * 0.1;

  const normalizedScore = Math.round(Math.min(Math.max(rawNormalized, 0), 100));

  return {
    graphFit,
    duplicateProbability,
    syllabusRelevance,
    sourceQuality,
    interviewValue,
    missionValue,
    readinessValue,
    normalizedScore,
  };
}

export function normalizeConfidenceScore(detail: ConfidenceScoreDetail): number {
  return detail.normalizedScore;
}
