import type { RevisionPrompt } from "@/types/topic";
import { topics } from "@/data/topics";

export const revisionPrompts: RevisionPrompt[] = topics.map((topic) => ({
  id: `revision-${topic.id}-core`,
  topicId: topic.id,
  prompt:
    topic.id === "js-closures"
      ? "Explain closures without notes using createCounter. Include live bindings, independent factory calls, and one stale-state or memory-retention pitfall."
      : `Explain ${topic.title} without notes, then give one edge case and one interview question.`,
  frequency: "weekly"
}));
