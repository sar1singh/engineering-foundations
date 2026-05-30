import type { ReferenceLink } from "@/types/reference";
import { topics } from "@/data/topics";

export const referenceLinks: ReferenceLink[] = topics.map((topic) => {
  const reference: ReferenceLink = {
    id: `reference-${topic.id}-core`,
    title: `${topic.title} primary reference`,
    url: `https://developer.mozilla.org/search?q=${encodeURIComponent(topic.title)}`,
    sourceType: "docs",
    topicIds: [topic.id],
    priority: "primary"
  };

  if (topic.id !== "js-closures") {
    return reference;
  }

  return {
    ...reference,
    title: "MDN guide to closures and lexical scoping",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures"
  };
});
