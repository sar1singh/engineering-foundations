import { describe, expect, it } from "vitest";
import { mockSyllabusCatalog } from "@/data/mock-syllabus";
import { syllabusService } from "@/lib/services/syllabus-service";

const masterRoadmapPrioritySlugs = [
  "dsa",
  "javascript",
  "nodejs",
  "databases",
  "system-design",
  "interviews",
  "aws",
  "security",
  "performance"
] as const;

const masterRoadmapDomainSlugs = [
  "foundations",
  "javascript",
  "nodejs",
  "dsa",
  "databases",
  "system-design",
  "lld",
  "tradeoffs",
  "aws",
  "security",
  "performance",
  "case-studies",
  "senior-skills",
  "interviews",
  "career-assets",
  "ai-expansion"
] as const;

describe("master roadmap coverage contract", () => {
  it("keeps every current 4-month sprint priority visible as a first-class syllabus domain", () => {
    const domainSlugs = syllabusService.getDomains().map((domain) => domain.slug);

    expect(domainSlugs).toEqual(expect.arrayContaining([...masterRoadmapPrioritySlugs]));
  });

  it("keeps every master roadmap router domain visible as a first-class syllabus domain", () => {
    const domainSlugs = syllabusService.getDomains().map((domain) => domain.slug);

    expect(domainSlugs).toEqual(expect.arrayContaining([...masterRoadmapDomainSlugs]));
  });

  it("preserves master roadmap source traceability", () => {
    expect(mockSyllabusCatalog.sourceRoots).toContain("00-control/master-roadmap");

    for (const domain of syllabusService.getDomains()) {
      expect(domain.sourcePath).toContain("00-control/master-roadmap/");
      for (const syllabusModule of domain.modules) {
        expect(syllabusModule.sourcePath).toContain("00-control/master-roadmap/");
      }
    }
  });

  it("keeps AWS as the cloud architecture direction and avoids Azure drift", () => {
    const serializedSyllabus = JSON.stringify(syllabusService.getDomains()).toLowerCase();

    expect(serializedSyllabus).toContain("aws");
    expect(serializedSyllabus).not.toContain("azure");
  });
});
