# EngineeringOS UX Flow

## UX Principles

EngineeringOS should feel like a focused operating system for engineering growth. The user should always understand:

- What to learn next
- Why the topic matters
- How it fits into the roadmap
- What to practice
- What is complete
- What needs revision
- How interview-ready they are becoming

The UI must be powered by structured roadmap, content, practice, and progress data. It must not depend on hardcoded topic cards as the long-term source of truth.

## Primary Navigation Areas

- Dashboard
- Learning Graph
- Topic Studio
- Practice Lab
- Progress and revision views
- Search and roadmap browsing

## Dashboard Flow

Dashboard needs:

```txt
Active roadmap
Current topic
Today's mission
Progress state
Weak areas
Revision queue
Readiness score
```

Retrieval flow:

```txt
Dashboard
  -> DashboardService
    -> RoadmapTreeService
    -> TopicRepository
    -> PracticeRepository
    -> ProgressRepository
```

Dashboard should show:

- Today's Mission from roadmap and progress data
- Current Learning Path from the active roadmap
- Weakest Areas from progress and evaluation data
- Revision Queue from revision prompts
- Readiness Score from scoring service

Expected user actions:

- Continue current topic
- Start today's mission
- Review weak areas
- Open revision prompts
- Jump to the active roadmap path
- Open a practice task

## Learning Graph Flow

Learning Graph needs:

```txt
Active roadmap tree
Topic relationships
Progress state
```

Retrieval flow:

```txt
Graph Page
  -> RoadmapTreeService
  -> TopicRelationRepository
  -> ProgressRepository
```

The graph must use:

- RoadmapTreeService
- TopicRelation data
- Progress data

Expected user actions:

- Browse domains, categories, modules, and topics
- See prerequisites and related topics
- Identify incomplete, active, and completed topics
- Open a topic in Topic Studio
- Understand advanced paths after finishing a topic

## Topic Studio Flow

Topic Studio needs complete topic content.

Route shape:

```txt
/topics/[topicId or slug]
```

Retrieval flow:

```txt
/topics/[topicId or slug]
  -> TopicContentService
    -> TopicRepository
    -> SubtopicRepository
    -> PracticeRepository
    -> ProblemRepository
    -> InterviewQuestionRepository
    -> ReferenceRepository
    -> RevisionPromptRepository
    -> EvaluationRubricRepository
```

Topic Studio must display:

- Topic
- Subtopics
- Practice tasks
- Problem statements
- Interview questions
- References
- Revision prompts
- Rubric
- Prerequisites
- Related topics
- Advanced topics

Expected user actions:

- Read the topic summary, theory, and mental model
- Study Fast Track or Deep Mastery mode
- Review code examples and production use cases
- Open practice tasks
- Answer interview questions
- Use explain-back prompts
- Mark topic criteria as complete

Missing topic behavior:

- Return a safe empty state.
- Do not crash.
- Do not manually join missing data inside UI components.

## Practice Lab Flow

Practice Lab needs:

```txt
Practice task
Problem statement
Starter code
Hints
Edge cases
Evaluation rubric
Progress state
```

Route shape:

```txt
/practice/[taskId or slug]
```

Retrieval flow:

```txt
/practice/[taskId or slug]
  -> PracticeContentService
    -> PracticeRepository
    -> ProblemRepository
    -> EvaluationRubricRepository
    -> ProgressRepository
```

Practice Lab must display:

- Task
- Subtasks
- Problem statement
- Examples
- Constraints
- Hints
- Edge cases
- Starter code
- Evaluation panel

Expected user actions:

- Read task requirements
- Complete subtasks
- Write or inspect starter code
- Check edge cases
- Review hints
- Compare against completion criteria
- Use the evaluation rubric
- Update local progress

Missing task behavior:

- Return a safe empty state.
- Do not crash.

## Progress And Revision Flow

Progress data should support:

- Completed topic IDs
- Completed task IDs
- Weak areas
- Streak count
- Last active date
- Readiness score
- Interview readiness percent

Revision flow:

```txt
Dashboard or Topic Studio
  -> RevisionService
    -> RevisionPromptRepository
    -> ProgressRepository
```

Expected user actions:

- See revision prompts for weak or stale topics
- Reopen a topic or practice task
- Complete explain-back prompts
- Improve readiness score through repeated practice

## Search And Retrieval Flow

Search must support:

- Roadmaps
- Topics
- Tasks
- References

Retrieval flow:

```txt
Search UI
  -> SearchService
    -> RoadmapRepository
    -> TopicRepository
    -> PracticeRepository
    -> ReferenceRepository
```

Expected user actions:

- Search by topic title, slug, tag, role relevance, company relevance, or difficulty
- Open a topic, task, reference, or roadmap result

## Learning Modes

Every topic should support two study modes.

Fast Track / 80-20 Mode:

- Interview-first
- High ROI
- Minimal theory
- Practice-heavy
- Clear pass condition

Deep Mastery Mode:

- Full understanding
- Production-level context
- Edge cases
- Trade-offs
- System connections
- Teaching and content creation

## Data Ownership In UX

- UI components should ask services for ready-to-render content.
- Services aggregate data from repositories.
- Repositories fetch from mock data first, then later from Prisma/SQLite.
- The UI must not manually join topic, task, question, reference, and rubric data.
