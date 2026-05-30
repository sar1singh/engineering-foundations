import type { EvaluationRubricRepository } from "@/lib/repositories/evaluation-rubric-repository";
import type { InterviewQuestionRepository } from "@/lib/repositories/interview-question-repository";
import type { PracticeRepository } from "@/lib/repositories/practice-repository";
import type { ProblemRepository } from "@/lib/repositories/problem-repository";
import type { ReferenceRepository } from "@/lib/repositories/reference-repository";
import type { RevisionPromptRepository } from "@/lib/repositories/revision-prompt-repository";
import type { SubtopicRepository } from "@/lib/repositories/subtopic-repository";
import type { TopicRepository } from "@/lib/repositories/topic-repository";
import type { EvaluationRubric } from "@/types/evaluation";
import type { PracticeTask } from "@/types/practice";
import type { ProblemStatement } from "@/types/problem";
import type { ReferenceLink } from "@/types/reference";
import type { Subtopic } from "@/types/subtopic";
import type { InterviewQuestion, RevisionPrompt, Topic } from "@/types/topic";

export type TopicContent = {
  topic: Topic;
  subtopics: Subtopic[];
  practiceTasks: PracticeTask[];
  problemStatements: ProblemStatement[];
  interviewQuestions: InterviewQuestion[];
  referenceLinks: ReferenceLink[];
  revisionPrompts: RevisionPrompt[];
  evaluationRubric: EvaluationRubric | null;
  prerequisites: Topic[];
  relatedTopics: Topic[];
  advancedTopics: Topic[];
};

export class TopicContentService {
  constructor(
    private readonly topicRepository: TopicRepository,
    private readonly subtopicRepository: SubtopicRepository,
    private readonly practiceRepository: PracticeRepository,
    private readonly problemRepository: ProblemRepository,
    private readonly interviewQuestionRepository: InterviewQuestionRepository,
    private readonly referenceRepository: ReferenceRepository,
    private readonly revisionPromptRepository: RevisionPromptRepository,
    private readonly evaluationRubricRepository: EvaluationRubricRepository
  ) {}

  async getTopicContentById(topicId: string): Promise<TopicContent | null> {
    const topic = await this.topicRepository.getTopicById(topicId);
    return topic ? this.getTopicContent(topic) : null;
  }

  async getTopicContentBySlug(slug: string): Promise<TopicContent | null> {
    const topic = await this.topicRepository.getTopicBySlug(slug);
    return topic ? this.getTopicContent(topic) : null;
  }

  private async getTopicContent(topic: Topic): Promise<TopicContent> {
    const [subtopics, practiceTasks, problemStatements, interviewQuestions, referenceLinks, revisionPrompts, evaluationRubric] =
      await Promise.all([
        this.subtopicRepository.getSubtopicsByTopicId(topic.id),
        this.practiceRepository.getTasksByTopicId(topic.id),
        this.problemRepository.getProblemsByTopicId(topic.id),
        this.interviewQuestionRepository.getQuestionsByTopicId(topic.id),
        this.referenceRepository.getReferencesByTopicId(topic.id),
        this.revisionPromptRepository.getPromptsByTopicId(topic.id),
        this.evaluationRubricRepository.getRubricByTopicId(topic.id)
      ]);

    const [prerequisites, relatedTopics, advancedTopics] = await Promise.all([
      Promise.all(topic.prerequisites.map((id) => this.topicRepository.getTopicById(id))),
      Promise.all(topic.relatedTopics.map((id) => this.topicRepository.getTopicById(id))),
      Promise.all(topic.advancedTopics.map((id) => this.topicRepository.getTopicById(id)))
    ]);

    return {
      topic,
      subtopics,
      practiceTasks,
      problemStatements,
      interviewQuestions,
      referenceLinks,
      revisionPrompts,
      evaluationRubric,
      prerequisites: prerequisites.filter((item): item is Topic => item !== null),
      relatedTopics: relatedTopics.filter((item): item is Topic => item !== null),
      advancedTopics: advancedTopics.filter((item): item is Topic => item !== null)
    };
  }
}
