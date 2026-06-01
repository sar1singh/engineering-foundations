import type { EnrichedDesignCapstone, EnrichedTopicContent } from "@/types/enriched-content";

const aiSourceRefs = ["roadmap-sh", "tech-interview-handbook"];

const evaluator: EnrichedDesignCapstone = {
  id: "capstone-ai-learning-evaluator",
  prompt: "Design an AI-assisted evaluator that reviews learner answers without pretending to be a perfect judge.",
  sourceRefs: aiSourceRefs,
  requirements: [
    "Score against explicit rubrics",
    "Show feedback and missing signals with evidence",
    "Avoid leaking answers too early",
    "Track improvement over time",
    "Support human override and appeal flows",
    "Report cost, latency, safety, and calibration quality"
  ],
  approach: [
    "Keep rubric dimensions deterministic before model judgment",
    "Retrieve only approved EngineeringOS source content",
    "Ask the model for structured JSON feedback with citations to rubric items",
    "Store evidence, score, model metadata, and user-facing feedback separately",
    "Calibrate against golden answers and adversarial weak answers",
    "Gate release with regression evals before prompt or model changes"
  ],
  designBreakdown: [
    "Prompt builder",
    "Rubric schema",
    "Content retriever",
    "Evaluator model adapter",
    "Safety filter",
    "Score persistence",
    "Calibration set",
    "Appeal and human review queue",
    "Cost and latency dashboard"
  ],
  tradeoffs: [
    "Strict rubrics reduce creative feedback but improve consistency",
    "Model feedback is fast but needs calibration",
    "Human review is more trustworthy but expensive and slower",
    "Short prompts reduce cost but may lose grading nuance",
    "Caching helps repeated practice but can freeze stale rubric behavior"
  ],
  failureModes: [
    "Overconfident wrong feedback",
    "Prompt injection through learner answer",
    "Rubric drift after prompt updates",
    "Bias toward verbose answers",
    "Private data in prompts or logs",
    "Silent model version changes altering scores",
    "Latency spikes during practice sessions"
  ],
  security: [
    "Strip secrets and unnecessary PII before model calls",
    "Treat learner answers and retrieved content as untrusted input",
    "Use prompt-injection guardrails and output schema validation",
    "Log model inputs safely with retention controls",
    "Separate tenant data and evaluator permissions",
    "Provide an evaluator disable switch"
  ],
  observability: [
    "Score distribution by rubric dimension",
    "Calibration disagreement against golden answers",
    "User appeal and correction rate",
    "Latency and cost per evaluation",
    "Unsafe prompt detection rate",
    "Schema validation failures",
    "Model and prompt version traces"
  ],
  awsVariant: [
    "API Gateway evaluator endpoint",
    "Lambda or ECS model adapter",
    "DynamoDB or RDS score records",
    "Bedrock-compatible adapter later",
    "CloudWatch metrics for cost, latency, and safety",
    "KMS encryption for stored evaluation artifacts"
  ],
  rubric: [
    "Uses an explicit rubric",
    "Handles safety and privacy",
    "Stores auditable feedback",
    "Defines calibration and regression evals",
    "Includes cost and latency budgets",
    "Does not replace human judgment blindly"
  ],
  expectedSeniorSignals: ["Responsible AI framing", "Evaluation discipline", "Data privacy", "Product empathy", "Cost awareness"]
};

const ragAssistant: EnrichedDesignCapstone = {
  id: "capstone-rag-support-assistant",
  prompt: "Design a RAG assistant for internal engineering support that answers from approved docs and escalates when confidence is low.",
  sourceRefs: ["roadmap-sh", "tech-interview-handbook"],
  requirements: [
    "Ingest approved documentation with ownership metadata",
    "Chunk and embed content with stable document IDs",
    "Retrieve relevant passages with filters for team, version, and access",
    "Generate answers with citations and uncertainty",
    "Refuse or escalate when sources are missing",
    "Measure answer quality, freshness, cost, and latency"
  ],
  approach: [
    "Start with a narrow FAQ or runbook domain",
    "Define chunking, metadata, and deletion rules before choosing a vector store",
    "Use hybrid retrieval when keyword precision matters",
    "Ground prompts on retrieved snippets and require source IDs",
    "Evaluate retrieval and generation separately",
    "Add feedback capture for wrong, stale, and unsafe answers"
  ],
  designBreakdown: [
    "Document ingestion pipeline",
    "Chunker and metadata normalizer",
    "Embedding model adapter",
    "Vector index",
    "Retriever and reranker",
    "Answer generator",
    "Citation validator",
    "Feedback queue",
    "Quality dashboard"
  ],
  tradeoffs: [
    "Larger chunks preserve context but reduce retrieval precision",
    "Smaller chunks improve targeting but may lose meaning",
    "Hybrid search adds operational complexity but catches exact terms",
    "Reranking improves relevance with extra latency and cost",
    "Fresh indexing reduces stale answers but increases ingestion load"
  ],
  failureModes: [
    "Hallucinated answer when retrieval misses",
    "Stale docs ranked above current docs",
    "Access-control metadata omitted from retrieval",
    "Prompt injection inside source documents",
    "Embedding drift after model migration",
    "High p95 latency from reranking and long context windows"
  ],
  security: [
    "Enforce authorization before retrieval and again before answer rendering",
    "Treat retrieved documents as data, not instructions",
    "Redact secrets during ingestion",
    "Log source IDs instead of full sensitive passages where possible",
    "Keep index deletion and retention auditable"
  ],
  observability: [
    "Recall@k on labeled queries",
    "Citation coverage",
    "No-answer rate",
    "Freshness lag",
    "Token cost by query class",
    "p50 and p95 retrieval plus generation latency",
    "User correction rate"
  ],
  awsVariant: [
    "S3 document landing zone",
    "EventBridge ingestion trigger",
    "Lambda or ECS chunking worker",
    "OpenSearch or managed vector store",
    "API Gateway answer endpoint",
    "CloudWatch dashboards and alarms"
  ],
  rubric: [
    "Separates retrieval quality from generation quality",
    "Includes access control and deletion",
    "Uses citations and refusal behavior",
    "Defines eval sets for common and adversarial queries",
    "Budgets cost and latency explicitly"
  ],
  expectedSeniorSignals: ["Grounding discipline", "Security boundaries", "Operational measurement", "Pragmatic indexing choices", "Clear escalation design"]
};

const agentWorkflow: EnrichedDesignCapstone = {
  id: "capstone-agentic-incident-workflow",
  prompt: "Design an agentic incident helper that can summarize signals, suggest next actions, and call approved tools without taking unsafe autonomous action.",
  sourceRefs: ["roadmap-sh", "awesome-scalability"],
  requirements: [
    "Read alerts, logs, traces, runbooks, and recent deploy metadata",
    "Suggest triage hypotheses with confidence and evidence",
    "Call only allowlisted read tools by default",
    "Require human approval for mutating tools",
    "Keep a complete action audit trail",
    "Handle tool failure, partial data, and model uncertainty"
  ],
  approach: [
    "Define autonomy levels from summarize-only to approved remediation",
    "Use typed tool contracts with idempotency and timeouts",
    "Limit tool scope by incident, tenant, and environment",
    "Plan one step at a time and verify each tool result",
    "Expose reasoning summary without leaking hidden prompts",
    "Run offline evals using historical incidents before production use"
  ],
  designBreakdown: [
    "Incident context collector",
    "Planner",
    "Tool registry",
    "Policy engine",
    "Human approval gate",
    "Execution runner",
    "Audit log",
    "Eval harness",
    "SLO and cost monitor"
  ],
  tradeoffs: [
    "More autonomy can reduce toil but increases blast radius",
    "Strict tool schemas slow iteration but prevent ambiguous actions",
    "Human approval adds latency but protects production",
    "Detailed context improves diagnosis but raises token cost",
    "Workflow orchestration improves reliability but adds state management"
  ],
  failureModes: [
    "Wrong hypothesis from incomplete telemetry",
    "Tool output misread as instruction",
    "Repeated tool calls amplify outage load",
    "Approval prompt hides risky side effects",
    "Runbook drift causes stale recommendations",
    "Agent loops without a stop condition"
  ],
  security: [
    "Use least-privilege service identities per tool",
    "Separate read-only and mutating tool permissions",
    "Validate all tool arguments against schemas and policy",
    "Record actor, model, prompt version, tool call, and result",
    "Block secrets from prompts and generated summaries"
  ],
  observability: [
    "Tool success and timeout rate",
    "Human approval and rejection rate",
    "Mean triage time impact",
    "Policy block reasons",
    "Loop and retry counts",
    "Token spend by incident severity",
    "Post-incident usefulness rating"
  ],
  awsVariant: [
    "Step Functions for bounded workflow state",
    "Lambda tool adapters",
    "CloudWatch Logs and X-Ray readers",
    "IAM roles scoped by environment",
    "DynamoDB audit trail",
    "SNS or ChatOps approval channel"
  ],
  rubric: [
    "Defines autonomy boundaries",
    "Uses typed and policy-checked tools",
    "Includes human approval for risky actions",
    "Handles tool failures and loops",
    "Measures operational value and safety"
  ],
  expectedSeniorSignals: ["Blast-radius thinking", "Tool-contract design", "Incident empathy", "Human-in-the-loop judgment", "Operability"]
};

const aiCodingAssistantRollout: EnrichedDesignCapstone = {
  id: "capstone-ai-coding-assistant-rollout",
  prompt: "Design a senior-engineering rollout plan for AI coding assistant usage across a product team.",
  sourceRefs: ["roadmap-sh", "tech-interview-handbook"],
  requirements: [
    "Define approved use cases for explanation, tests, refactors, docs, and boilerplate",
    "Protect proprietary code, secrets, and customer data",
    "Preserve code review accountability",
    "Measure productivity without rewarding unsafe churn",
    "Teach prompt patterns for small, verifiable changes",
    "Create policy for generated code licensing and attribution review"
  ],
  approach: [
    "Start with low-risk workflows such as test generation and code explanation",
    "Require developers to own generated code as if they wrote it",
    "Use repo-local context and narrow prompts instead of broad dumps",
    "Add secure handling rules for secrets, credentials, and customer examples",
    "Track review defects, cycle time, escaped bugs, and developer sentiment",
    "Run periodic audits of risky generated patterns"
  ],
  designBreakdown: [
    "Usage policy",
    "Secure prompt examples",
    "IDE configuration guidance",
    "Review checklist",
    "Training lab",
    "Metrics plan",
    "Exception process",
    "Audit cadence"
  ],
  tradeoffs: [
    "Loose access accelerates adoption but raises data exposure risk",
    "Strict review keeps quality high but may blunt productivity gains",
    "Measuring lines changed is easy but encourages poor behavior",
    "Team-wide standards help consistency but must allow local judgment"
  ],
  failureModes: [
    "Generated code passes happy paths but misses edge cases",
    "Developer accepts insecure suggestions",
    "Secrets or customer data pasted into prompts",
    "License-sensitive code copied without review",
    "Refactor changes behavior silently",
    "Team overtrusts assistant output during incidents"
  ],
  security: [
    "Ban secrets, tokens, credentials, and customer PII in prompts",
    "Prefer tools with enterprise data controls for private code",
    "Require dependency and license checks for generated additions",
    "Keep code review, tests, and threat modeling in the workflow",
    "Document acceptable data classification levels"
  ],
  observability: [
    "PR review defect rate",
    "Test coverage deltas",
    "Escaped bug rate",
    "Cycle time by change class",
    "Security finding rate",
    "Developer confidence survey",
    "Policy exception count"
  ],
  awsVariant: [
    "Code repository policy checks",
    "Secrets scanning in CI",
    "Static analysis gates",
    "CloudWatch or BI dashboard for delivery metrics",
    "IAM-reviewed access to internal code search"
  ],
  rubric: [
    "Keeps humans accountable",
    "Defines safe and unsafe use cases",
    "Includes security and licensing checks",
    "Measures quality as well as speed",
    "Provides concrete team practices"
  ],
  expectedSeniorSignals: ["Practical enablement", "Risk-aware adoption", "Engineering-quality focus", "Clear policy", "Measured rollout"]
};

export const enrichedAiContent = [
  {
    topicSlug: "agentic-ai-foundations",
    sourceRefs: ["roadmap-sh"],
    beginnerExplanation:
      "Agentic AI systems use LLMs plus prompts, retrieval, tools, memory, policies, and workflow state to complete bounded tasks. The practical skill is not magic autonomy; it is designing the boundary where probabilistic reasoning meets deterministic software.",
    deepExplanation:
      "The 80/20 track for senior engineers is: understand LLM behavior and token limits, write prompts that produce typed outputs, use embeddings and RAG for grounding, build evals before broad release, wrap tool calls in policy and observability, and monitor cost, latency, security, and failure modes like any production system.",
    whyInterviewersAsk:
      "Senior AI system design tests whether you can turn model demos into reliable products: scoped use cases, measurable quality, safe tool access, human review, rollout, and operational ownership.",
    prerequisites: ["HTTP APIs", "System design", "Security basics", "Observability", "Data modeling", "Async workflows"],
    skipForNow: [
      "Training frontier foundation models",
      "Large-scale GPU infrastructure",
      "Research-only agent architectures",
      "Fully autonomous production remediation",
      "Model fine-tuning before retrieval and eval basics"
    ],
    roleRelevance: ["Senior engineer", "Staff engineer", "Solution architect", "AI product engineer", "Engineering manager"],
    estimatedTimeMinutes: 360,
    interviewFrequency: "high",
    lineByLineExplanation: [
      "LLM basics: know tokens, context windows, temperature, structured outputs, hallucination, and model/version drift.",
      "Prompting: specify role, task, constraints, examples, output schema, refusal rules, and evaluation criteria.",
      "Embeddings: convert text into vectors for similarity search, but preserve metadata, freshness, authorization, and deletion paths.",
      "RAG: retrieve trusted context first, generate only from that context, cite sources, and refuse when evidence is weak.",
      "Evals: maintain golden sets, adversarial sets, regression gates, human review samples, and separate retrieval metrics from answer metrics.",
      "Guardrails: validate inputs, retrieved context, tool arguments, and model outputs; policy belongs in code as well as prompts.",
      "Tool calling: expose small typed tools with least privilege, timeouts, idempotency, audit logs, and human approval for risky actions.",
      "Agents: bound planning loops with budgets, stop conditions, state machines, and fallback paths.",
      "Workflow orchestration: use queues or workflow engines when steps need retries, approvals, compensation, or resumability.",
      "Product safety: define misuse, privacy, fairness, appeal, disclosure, escalation, and rollback behavior before launch.",
      "Coding assistants: use AI for drafts and acceleration, but keep review, tests, security, and ownership human.",
      "Cost and latency: budget tokens, context size, model tier, cache strategy, concurrency, p95 latency, and per-feature spend from day one."
    ],
    enrichedProblems: [],
    designCapstones: [ragAssistant, agentWorkflow, aiCodingAssistantRollout]
  },
  {
    topicSlug: "ai-assisted-learning-evaluator",
    sourceRefs: evaluator.sourceRefs,
    beginnerExplanation: "An AI evaluator gives structured feedback on learner answers using a rubric, but it must be calibrated and treated as guidance.",
    deepExplanation:
      "The product value comes from repeatable practice loops: answer, score, missing signals, retry, trend. The engineering risk is false confidence if the evaluator is not grounded, tested, observable, and bounded by privacy and human-review rules.",
    whyInterviewersAsk: "AI features now require product judgment, evaluation design, privacy, cost control, and operational guardrails.",
    prerequisites: ["Rubrics", "Prompt basics", "RAG basics", "Data privacy", "API design", "Monitoring"],
    skipForNow: ["Training custom models", "Autonomous hiring decisions", "Opaque grading without appeals"],
    roleRelevance: ["AI product engineer", "Staff engineer", "Solution architect", "EM"],
    estimatedTimeMinutes: 140,
    interviewFrequency: "medium",
    lineByLineExplanation: [
      "Define the rubric before asking a model to judge anything.",
      "Ground feedback in approved lesson content and learner-visible criteria.",
      "Ask for structured output so the app can validate and store it safely.",
      "Track model, prompt, rubric, and content versions for every evaluation.",
      "Use golden answers, weak answers, and adversarial answers to measure drift.",
      "Watch latency and token spend because practice loops become expensive at scale.",
      "Keep human override, learner appeal, and evaluator disable paths available."
    ],
    enrichedProblems: [],
    designCapstones: [evaluator]
  }
] satisfies EnrichedTopicContent[];
