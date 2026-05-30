import { describe, expect, it } from "vitest";
import { appServices } from "@/lib/providers";

describe("Phase 24 curriculum content depth", () => {
  it("returns expanded closures content for Topic Studio", async () => {
    const content = await appServices.topicContentService.getTopicContentBySlug("closures");

    expect(content).not.toBeNull();
    expect(content?.topic.summary).toContain("lexical scope");
    expect(content?.topic.mentalModel).toContain("backpack");
    expect(content?.topic.codeExamples).toHaveLength(2);
    expect(content?.subtopics[0]?.completionCriteria).toContain(
      "Can explain why separate factory calls do not share retained state"
    );
    expect(content?.revisionPrompts[0]?.prompt).toContain("createCounter");
    expect(content?.referenceLinks[0]?.title).toContain("MDN guide to closures");
  });

  it("returns the richer closure counter task for Practice Lab", async () => {
    const content = await appServices.practiceContentService.getPracticeContentBySlug("implement-counter-with-closure");

    expect(content).not.toBeNull();
    expect(content?.task.statement).toContain("increment(), decrement(), reset(), and current()");
    expect(content?.task.subtasks).toHaveLength(3);
    expect(content?.task.starterCode).toContain("createCounter");
    expect(content?.problemStatement?.title).toBe("Closure Counter Factory");
    expect(content?.problemStatement?.examples).toHaveLength(2);
  });

  it("surfaces closures and the linked task through content search", async () => {
    const lexicalResults = await appServices.searchService.search("lexical-scope");
    const counterResults = await appServices.searchService.search("counter");
    const closureResults = await appServices.searchService.search("closures");

    expect(lexicalResults.topics.map((topic) => topic.id)).toContain("js-closures");
    expect(counterResults.tasks.map((task) => task.slug)).toContain("implement-counter-with-closure");
    expect(closureResults.references.map((reference) => reference.title)).toContain(
      "MDN guide to closures and lexical scoping"
    );
  });
});
