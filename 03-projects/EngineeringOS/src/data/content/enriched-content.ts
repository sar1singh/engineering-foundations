import { enrichedAiContent } from "@/data/content/enriched-ai-content";
import { enrichedAwsContent } from "@/data/content/enriched-aws-content";
import { enrichedDsaContent } from "@/data/content/enriched-dsa-content";
import { enrichedLldContent } from "@/data/content/enriched-lld-content";
import { enrichedStaffEmCareerContent } from "@/data/content/enriched-staff-em-career-content";
import { enrichedSystemDesignContent } from "@/data/content/enriched-system-design-content";
import { phase61DsaExpansion } from "@/data/content/phase61-dsa-expansion";
import type { EnrichedTopicContent } from "@/types/enriched-content";

export const enrichedTopicContent = [
  ...enrichedDsaContent,
  ...phase61DsaExpansion,
  ...enrichedSystemDesignContent,
  ...enrichedLldContent,
  ...enrichedAwsContent,
  ...enrichedStaffEmCareerContent,
  ...enrichedAiContent
] satisfies EnrichedTopicContent[];

export const enrichedTopicContentBySlug = Object.fromEntries(enrichedTopicContent.map((content) => [content.topicSlug, content])) as Record<
  string,
  EnrichedTopicContent
>;
