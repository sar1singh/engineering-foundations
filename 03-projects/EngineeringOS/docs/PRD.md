# EngineeringOS PRD

## Product Summary

EngineeringOS is an AI-powered learning, interview, and job-switch operating system for engineers. It is built as a local-first product inside `03-projects/EngineeringOS/`.

EngineeringOS serves four goals:

1. Personal learning system
2. Public SaaS MVP
3. Portfolio/showcase project
4. Content marketing and teaching platform

The MVP must help an engineer follow a structured roadmap, study topics deeply, practice coding and explain-back tasks, track progress, and build interview readiness.

## Product Goals

- Provide a dashboard for daily learning direction, progress, weak areas, revision, and readiness.
- Store the master learning roadmap as structured data, not as UI-only cards.
- Support a topic graph that shows roadmap hierarchy, topic relationships, and progress state.
- Provide a Topic Studio that retrieves complete structured topic content.
- Provide a Practice Lab that retrieves practice tasks, problem statements, starter code, hints, edge cases, and rubrics.
- Use repository interfaces and services so the UI does not directly depend on raw mock data.
- Start with local mock content and later move to SQLite/Prisma after the local prototype is stable.
- Keep the data model ready for a future Supabase/PostgreSQL migration.

## MVP Product Areas

### Dashboard

The dashboard must show:

- Today's mission from roadmap and progress data
- Current learning path from the active roadmap
- Weakest areas from progress and evaluation data
- Revision queue from revision prompts
- Readiness score from scoring service

### Learning Graph

The learning graph must show:

- Active roadmap tree
- Domains, categories, modules, and topics
- Topic prerequisites, related topics, and advanced topics
- Topic relation edges
- Progress status per topic

### Topic Studio

Topic Studio must retrieve complete topic content through `TopicContentService`.

Each topic must include:

- Topic name
- Short summary
- Why this matters
- Prerequisites
- Related topics
- Advanced topics
- Difficulty
- Estimated time
- Role relevance
- Interview relevance
- Company relevance
- Learning modes
- Theory
- Mental model
- Code examples
- Production use cases
- Common mistakes
- Practice tasks
- Subtasks
- Problem statements
- Edge cases
- Interview questions
- Explain-back prompt
- Evaluation rubric
- Revision prompts
- Reference links
- Completion criteria

### Practice Lab

Practice Lab must retrieve practice content through `PracticeContentService`.

It must support:

- Practice task
- Subtasks
- Problem statement
- Examples
- Constraints
- Hints
- Edge cases
- Starter code
- Evaluation panel
- Progress state

### Progress Tracking

Progress tracking must support:

- Completed topics
- Completed tasks
- Weak areas
- Revision queue
- Streak count
- Last active date
- Readiness score
- Interview readiness percent

## Roadmap Hierarchy

EngineeringOS must store the master roadmap as structured data:

```txt
Roadmap
  Domain
    Category
      Module
        Topic
          Subtopic
            Practice Task
              Subtask
              Problem Statement
```

The initial active roadmap should be:

```txt
Engineering Interview Readiness Roadmap
```

Target roles:

- Senior Engineer
- Lead Engineer
- Staff Engineer
- Solution Architect

Target companies:

- FAANG
- GCC
- Indian Product Companies
- Well-funded Startups

## Required Initial Domains

The system should seed at least these roadmap domains:

1. JavaScript Foundations
2. Advanced JavaScript Runtime
3. Node.js Backend Engineering
4. DSA and Algorithms
5. Low-Level Design
6. High-Level System Design
7. Distributed Systems
8. Databases
9. Caching
10. Messaging and Queues
11. API Design
12. Security and Auth
13. AWS and Cloud Architecture
14. Observability
15. Testing and Quality
16. Interview Preparation
17. Content Creation / Proof-of-Work
18. Career Execution

The product must remain extensible and must not be hardcoded only for JavaScript.

## MVP Content Seeds

The MVP should include enough topics to demonstrate the system across:

- JavaScript fundamentals and runtime topics
- Node.js backend topics
- DSA and algorithms
- System design
- Databases
- AWS and cloud architecture

Every topic should have practice tasks, interview questions, reference links, revision prompts, and evaluation criteria.

## Non-Goals For MVP

Do not implement these before the local prototype, content retrieval layer, and repository architecture work:

- Supabase
- PostgreSQL production backend
- OpenAI or real AI generation
- Billing
- Auth
- Cloud deployment
- GitHub sync
- LeetCode sync
- SaaS administration workflows

## Product Constraints

- Product name, app title, metadata title, browser tab, UI header, logo text, config `appName`, and package description must use `EngineeringOS`.
- Work only inside `03-projects/EngineeringOS/`.
- Start with mock/local implementation.
- Do not put secrets in frontend code.
- Do not hardcode API keys.
- Do not let UI components manually join large data objects.
- Use repositories for fetching.
- Use services for aggregation.
- Keep tasks small, executable, and testable.
