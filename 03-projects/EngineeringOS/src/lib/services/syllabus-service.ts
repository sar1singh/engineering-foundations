import { mockSyllabusCatalog } from "@/data/mock-syllabus";
import type { MockSyllabusCatalog, SyllabusDomain, SyllabusPracticeProblem, SyllabusTopic } from "@/types/syllabus";

export class SyllabusService {
  getCatalog(): MockSyllabusCatalog {
    return mockSyllabusCatalog;
  }

  getDomains(): SyllabusDomain[] {
    return mockSyllabusCatalog.domains;
  }

  getTopicBySlug(slug: string): SyllabusTopic | null {
    for (const domain of mockSyllabusCatalog.domains) {
      for (const syllabusModule of domain.modules) {
        const topic = syllabusModule.topics.find((item) => item.slug === slug || item.id === slug);

        if (topic) {
          return topic;
        }
      }
    }

    return null;
  }

  getPracticeProblemsByTopicSlug(slug: string): SyllabusPracticeProblem[] {
    return this.getTopicBySlug(slug)?.practiceProblems ?? [];
  }

  getPracticeProblemsByDifficulty(difficulty: SyllabusPracticeProblem["difficulty"]): SyllabusPracticeProblem[] {
    return mockSyllabusCatalog.domains.flatMap((domain) =>
      domain.modules.flatMap((syllabusModule) =>
        syllabusModule.topics.flatMap((topic) => topic.practiceProblems.filter((problem) => problem.difficulty === difficulty))
      )
    );
  }
}

export const syllabusService = new SyllabusService();
