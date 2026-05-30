import type { ReferenceLink } from "@/types/reference";
import { topics } from "@/data/topics";

export const referenceLinks: ReferenceLink[] = topics.map((topic) => ({
  id: `reference-${topic.id}-core`,
  title: `${topic.title} primary reference`,
  url: `https://developer.mozilla.org/search?q=${encodeURIComponent(topic.title)}`,
  sourceType: "docs",
  topicIds: [topic.id],
  priority: "primary"
}));
