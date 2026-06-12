import type { Rubric } from "@/types/founder-beta";

export const founderBetaInterviewRubrics: Rubric[] = [
  // DSA rubrics
  {
    id: "rubric-dsa-correctness",
    name: "DSA Correctness",
    category: "dsa",
    criteria: [
      { id: "dsa-correct-approach", label: "Approach Selection", description: "Chooses correct algorithm/data structure for the problem", maxScore: 5, weight: 3,
        scoreLevels: [
          { level: 1, label: "Wrong approach", description: "Chosen algorithm does not solve the problem" },
          { level: 3, label: "Acceptable approach", description: "Works but not optimal; needs interviewer guidance" },
          { level: 5, label: "Optimal approach", description: "Selects best algorithm with clear justification" }
        ]
      },
      { id: "dsa-correct-implementation", label: "Implementation", description: "Writes correct, compilable code with proper syntax", maxScore: 5, weight: 3,
        scoreLevels: [
          { level: 1, label: "Does not compile", description: "Syntax errors, missing logic, does not run" },
          { level: 3, label: "Mostly correct", description: "Works for normal cases; minor edge case bugs" },
          { level: 5, label: "Fully correct", description: "Handles all cases including edge cases and constraints" }
        ]
      },
      { id: "dsa-correct-edge-cases", label: "Edge Cases", description: "Identifies and handles edge cases", maxScore: 5, weight: 2,
        scoreLevels: [
          { level: 1, label: "Misses edge cases", description: "Only handles the happy path" },
          { level: 3, label: "Handles common edge cases", description: "Considers empty input, single element, boundaries" },
          { level: 5, label: "Comprehensive", description: "Proactively discusses and handles all edge cases" }
        ]
      }
    ]
  },
  {
    id: "rubric-dsa-complexity",
    name: "DSA Complexity Analysis",
    category: "dsa",
    criteria: [
      { id: "dsa-complexity-time", label: "Time Complexity", description: "Correctly analyzes and explains time complexity", maxScore: 5, weight: 3,
        scoreLevels: [
          { level: 1, label: "Incorrect", description: "Wrong analysis or cannot explain" },
          { level: 3, label: "Correct with gaps", description: "Correct Big O but misses amortized/best/worst cases" },
          { level: 5, label: "Thorough", description: "Precise analysis with best, average, and worst cases" }
        ]
      },
      { id: "dsa-complexity-space", label: "Space Complexity", description: "Correctly analyzes memory usage", maxScore: 5, weight: 2,
        scoreLevels: [
          { level: 1, label: "Ignores space", description: "Does not consider memory usage" },
          { level: 3, label: "Basic space analysis", description: "Correct Big O but misses aux/recursion stack space" },
          { level: 5, label: "Comprehensive", description: "Analyzes all memory including call stack and aux structures" }
        ]
      },
      { id: "dsa-complexity-optimization", label: "Optimization Awareness", description: "Suggests optimizations and tradeoffs", maxScore: 5, weight: 1,
        scoreLevels: [
          { level: 1, label: "No optimization", description: "Sticks with first solution without improvement" },
          { level: 3, label: "Aware of alternatives", description: "Mentions possible optimizations but does not implement" },
          { level: 5, label: "Optimizes iteratively", description: "Starts with brute force, then optimizes step by step" }
        ]
      }
    ]
  },
  {
    id: "rubric-dsa-communication",
    name: "DSA Communication",
    category: "dsa",
    criteria: [
      { id: "dsa-comm-clarity", label: "Clarity", description: "Explains approach clearly before coding", maxScore: 5, weight: 3,
        scoreLevels: [
          { level: 1, label: "Unclear", description: "Starts coding without explaining approach" },
          { level: 3, label: "Adequate", description: "Explains approach but with some gaps" },
          { level: 5, label: "Crystal clear", description: "Explains complete approach, tradeoffs, and plan before coding" }
        ]
      },
      { id: "dsa-comm-interaction", label: "Interviewer Interaction", description: "Engages with interviewer questions and hints", maxScore: 5, weight: 2,
        scoreLevels: [
          { level: 1, label: "Defensive", description: "Ignores hints or pushes back without consideration" },
          { level: 3, label: "Receptive", description: "Accepts hints but needs explicit direction" },
          { level: 5, label: "Collaborative", description: "Engages with hints, asks clarifying questions, iterates together" }
        ]
      },
      { id: "dsa-comm-testing", label: "Testing and Verification", description: "Tests solution with examples and discusses verification", maxScore: 5, weight: 1,
        scoreLevels: [
          { level: 1, label: "No testing", description: "Writes code and declares done" },
          { level: 3, label: "Basic testing", description: "Walks through one example manually" },
          { level: 5, label: "Thorough verification", description: "Tests multiple cases including edge cases" }
        ]
      }
    ]
  },

  // LLD rubrics
  {
    id: "rubric-lld-requirements",
    name: "LLD Requirements",
    category: "lld",
    criteria: [
      { id: "lld-req-gathering", label: "Requirements Gathering", description: "Clarifies requirements before designing", maxScore: 5, weight: 3,
        scoreLevels: [
          { level: 1, label: "Assumes requirements", description: "Starts designing without clarifying scope" },
          { level: 3, label: "Basic clarification", description: "Asks some clarifying questions" },
          { level: 5, label: "Thorough scoping", description: "Systematically gathers functional and non-functional requirements" }
        ]
      },
      { id: "lld-req-coverage", label: "Requirements Coverage", description: "Design addresses stated requirements", maxScore: 5, weight: 2,
        scoreLevels: [
          { level: 1, label: "Misses key requirements", description: "Design leaves out major stated requirements" },
          { level: 3, label: "Covers main requirements", description: "Addresses core requirements but misses some" },
          { level: 5, label: "Complete coverage", description: "Design addresses every requirement with explicit mapping" }
        ]
      }
    ]
  },
  {
    id: "rubric-lld-design-quality",
    name: "LLD Design Quality",
    category: "lld",
    criteria: [
      { id: "lld-quality-classes", label: "Class Design", description: "Designs clean classes with clear responsibilities", maxScore: 5, weight: 3,
        scoreLevels: [
          { level: 1, label: "God classes", description: "Single class handles all responsibilities" },
          { level: 3, label: "Reasonable separation", description: "Multiple classes with mostly clear responsibilities" },
          { level: 5, label: "Excellent design", description: "Well-factored classes following SRP with clear interfaces" }
        ]
      },
      { id: "lld-quality-relationships", label: "Relationships", description: "Models inheritance, composition, and dependency relationships", maxScore: 5, weight: 2,
        scoreLevels: [
          { level: 1, label: "No relationships", description: "Classes are disconnected or overuses inheritance" },
          { level: 3, label: "Basic relationships", description: "Uses composition and inheritance correctly" },
          { level: 5, label: "Sophisticated design", description: "Appropriate use of interfaces, abstract classes, and composition" }
        ]
      },
      { id: "lld-quality-solid", label: "SOLID Principles", description: "Applies SOLID principles appropriately", maxScore: 5, weight: 2,
        scoreLevels: [
          { level: 1, label: "Violates SOLID", description: "Multiple SOLID violations present" },
          { level: 3, label: "Partial SOLID", description: "Applies some principles but has violations" },
          { level: 5, label: "SOLID throughout", description: "All five principles are demonstrated correctly" }
        ]
      }
    ]
  },
  {
    id: "rubric-lld-extensibility",
    name: "LLD Extensibility",
    category: "lld",
    criteria: [
      { id: "lld-extensibility-patterns", label: "Design Patterns", description: "Uses appropriate design patterns", maxScore: 5, weight: 3,
        scoreLevels: [
          { level: 1, label: "No patterns", description: "No design patterns used or misapplied" },
          { level: 3, label: "Basic patterns", description: "Uses common patterns appropriately" },
          { level: 5, label: "Pattern mastery", description: "Selects and applies patterns that solve the exact problem" }
        ]
      },
      { id: "lld-extensibility-future", label: "Future Changes", description: "Design anticipates future extensions", maxScore: 5, weight: 2,
        scoreLevels: [
          { level: 1, label: "Brittle", description: "Any change requires modifying existing code" },
          { level: 3, label: "Extensible", description: "Open/closed principle applied to core paths" },
          { level: 5, label: "Pluggable", description: "New features can be added via configuration or plugins" }
        ]
      }
    ]
  },

  // HLD rubrics
  {
    id: "rubric-hld-scalability",
    name: "HLD Scalability",
    category: "hld",
    criteria: [
      { id: "hld-scale-requirements", label: "Scale Requirements", description: "Identifies scale requirements and constraints", maxScore: 5, weight: 2,
        scoreLevels: [
          { level: 1, label: "Ignores scale", description: "No discussion of scale requirements" },
          { level: 3, label: "Basic estimation", description: "Rough traffic estimates without detailed breakdown" },
          { level: 5, label: "Rigorous estimation", description: "Detailed capacity estimates: QPS, storage, bandwidth, cache" }
        ]
      },
      { id: "hld-scale-architecture", label: "Scaling Architecture", description: "Design scales to meet requirements", maxScore: 5, weight: 3,
        scoreLevels: [
          { level: 1, label: "Single server", description: "Architecture cannot scale beyond single node" },
          { level: 3, label: "Horizontal scaling", description: "Uses basic horizontal scaling with load balancer" },
          { level: 5, label: "Distributed architecture", description: "Comprehensive scaling: sharding, caching, CDN, async processing" }
        ]
      },
      { id: "hld-scale-bottlenecks", label: "Bottleneck Analysis", description: "Identifies and addresses bottlenecks", maxScore: 5, weight: 2,
        scoreLevels: [
          { level: 1, label: "No analysis", description: "Does not identify potential bottlenecks" },
          { level: 3, label: "Major bottlenecks", description: "Identifies main bottlenecks but limited mitigation" },
          { level: 5, label: "Comprehensive mitigation", description: "Identifies all bottlenecks and designs mitigations" }
        ]
      }
    ]
  },
  {
    id: "rubric-hld-tradeoffs",
    name: "HLD Tradeoffs",
    category: "hld",
    criteria: [
      { id: "hld-tradeoff-awareness", label: "Tradeoff Awareness", description: "Identifies architectural tradeoffs", maxScore: 5, weight: 3,
        scoreLevels: [
          { level: 1, label: "Single solution", description: "Presents one solution without alternatives" },
          { level: 3, label: "Some tradeoffs", description: "Mentions alternatives for major decisions" },
          { level: 5, label: "Systematic tradeoffs", description: "Compares multiple options with explicit pros/cons for each decision" }
        ]
      },
      { id: "hld-tradeoff-cap", label: "CAP Theorem", description: "Applies CAP theorem understanding", maxScore: 5, weight: 2,
        scoreLevels: [
          { level: 1, label: "No CAP awareness", description: "Does not discuss consistency/availability tradeoffs" },
          { level: 3, label: "Basic CAP", description: "Acknowledges CAP but does not apply to specific decisions" },
          { level: 5, label: "CAP mastery", description: "Explicit CAP-based decisions with justification for consistency choice" }
        ]
      },
      { id: "hld-tradeoff-technology", label: "Technology Choices", description: "Justifies technology choices with tradeoffs", maxScore: 5, weight: 1,
        scoreLevels: [
          { level: 1, label: "Unsupported choices", description: "Picks technologies without justification" },
          { level: 3, label: "Reasonable choices", description: "Chooses appropriate technologies with basic justification" },
          { level: 5, label: "Deep technology reasoning", description: "Detailed comparison of alternatives with operational considerations" }
        ]
      }
    ]
  },
  {
    id: "rubric-hld-reliability",
    name: "HLD Reliability",
    category: "hld",
    criteria: [
      { id: "hld-reliable-fault-tolerance", label: "Fault Tolerance", description: "Designs for failure scenarios", maxScore: 5, weight: 3,
        scoreLevels: [
          { level: 1, label: "No fault tolerance", description: "No consideration of failures" },
          { level: 3, label: "Basic HA", description: "Multi-AZ deployment, some redundancy" },
          { level: 5, label: "Comprehensive resilience", description: "Graceful degradation, circuit breakers, bulkheads, retries" }
        ]
      },
      { id: "hld-reliable-data", label: "Data Reliability", description: "Ensures data durability and consistency", maxScore: 5, weight: 2,
        scoreLevels: [
          { level: 1, label: "No data protection", description: "No backup, replication, or durability strategy" },
          { level: 3, label: "Basic data reliability", description: "Replication with some backup strategy" },
          { level: 5, label: "Comprehensive data strategy", description: "Backup, DR, replication, consistency guarantees, and data integrity" }
        ]
      },
      { id: "hld-reliable-monitoring", label: "Monitoring and Recovery", description: "Plans for observability and recovery", maxScore: 5, weight: 1,
        scoreLevels: [
          { level: 1, label: "No monitoring", description: "No monitoring or recovery plan" },
          { level: 3, label: "Basic monitoring", description: "Health checks and basic dashboards" },
          { level: 5, label: "Complete observability", description: "Logs, metrics, traces, alerts, runbooks, and DR drills" }
        ]
      }
    ]
  },

  // Behavioral rubrics
  {
    id: "rubric-behavioral-star",
    name: "STAR Completeness",
    category: "behavioral",
    criteria: [
      { id: "behavioral-star-situation", label: "Situation", description: "Sets context for the story", maxScore: 5, weight: 2,
        scoreLevels: [
          { level: 1, label: "No context", description: "Dives into action without background" },
          { level: 3, label: "Basic context", description: "Provides some context but incomplete" },
          { level: 5, label: "Rich context", description: "Clear situation with team size, timeline, and stakes" }
        ]
      },
      { id: "behavioral-star-task", label: "Task", description: "Clearly defines personal responsibility", maxScore: 5, weight: 2,
        scoreLevels: [
          { level: 1, label: "Vague task", description: "Unclear what their specific role was" },
          { level: 3, label: "Clear task", description: "States their role and responsibility" },
          { level: 5, label: "Specific ownership", description: "Precise personal accountability with measurable goals" }
        ]
      },
      { id: "behavioral-star-action", label: "Action", description: "Describes specific actions taken", maxScore: 5, weight: 3,
        scoreLevels: [
          { level: 1, label: "No detail", description: "Talks about what the team did, not themselves" },
          { level: 3, label: "Some detail", description: "Describes personal actions but misses key decisions" },
          { level: 5, label: "Detailed actions", description: "Step-by-step personal actions with rationale at each step" }
        ]
      },
      { id: "behavioral-star-result", label: "Result", description: "Shares measurable outcomes and learnings", maxScore: 5, weight: 3,
        scoreLevels: [
          { level: 1, label: "No result", description: "Story ends without outcome" },
          { level: 3, label: "Qualitative result", description: "Describes outcome without metrics" },
          { level: 5, label: "Quantified impact", description: "Specific metrics, business impact, and personal learnings" }
        ]
      }
    ]
  },
  {
    id: "rubric-behavioral-ownership",
    name: "Ownership and Initiative",
    category: "behavioral",
    criteria: [
      { id: "behavioral-own-scope", label: "Scope of Ownership", description: "Takes ownership beyond assigned role", maxScore: 5, weight: 3,
        scoreLevels: [
          { level: 1, label: "Within role only", description: "Only describes in-scope responsibilities" },
          { level: 3, label: "Beyond role", description: "Occasionally went beyond defined scope" },
          { level: 5, label: "Full ownership", description: "Consistently takes ownership end-to-end including unowned problems" }
        ]
      },
      { id: "behavioral-own-proactivity", label: "Proactivity", description: "Shows initiative without being asked", maxScore: 5, weight: 2,
        scoreLevels: [
          { level: 1, label: "Reactive", description: "Only does what is asked" },
          { level: 3, label: "Occasionally proactive", description: "Takes initiative on some topics" },
          { level: 5, label: "Highly proactive", description: "Identifies and solves problems before they are raised" }
        ]
      }
    ]
  },
  {
    id: "rubric-behavioral-impact",
    name: "Impact and Results",
    category: "behavioral",
    criteria: [
      { id: "behavioral-impact-magnitude", label: "Impact Magnitude", description: "Describes meaningful, measurable impact", maxScore: 5, weight: 3,
        scoreLevels: [
          { level: 1, label: "Minimal impact", description: "Impact is unclear or trivial" },
          { level: 3, label: "Moderate impact", description: "Clear improvement but difficult to quantify" },
          { level: 5, label: "Significant impact", description: "Quantified improvement in performance, reliability, or revenue" }
        ]
      },
      { id: "behavioral-impact-scope", label: "Impact Scope", description: "Impact extends beyond immediate team", maxScore: 5, weight: 2,
        scoreLevels: [
          { level: 1, label: "Individual only", description: "Impact limited to personal productivity" },
          { level: 3, label: "Team impact", description: "Improved team effectiveness" },
          { level: 5, label: "Org-wide impact", description: "Changes affected multiple teams, org, or company-wide" }
        ]
      },
      { id: "behavioral-impact-learnings", label: "Learnings and Growth", description: "Reflects on learnings and growth", maxScore: 5, weight: 1,
        scoreLevels: [
          { level: 1, label: "No reflection", description: "Does not mention what was learned" },
          { level: 3, label: "Some reflection", description: "Mentions key learnings" },
          { level: 5, label: "Deep reflection", description: "Honest assessment of what went well, what could improve, and growth areas" }
        ]
      }
    ]
  }
];

export const getRubricById = (id: string): Rubric | undefined =>
  founderBetaInterviewRubrics.find((r) => r.id === id);

export const getRubricsByCategory = (category: string): Rubric[] =>
  founderBetaInterviewRubrics.filter((r) => r.category === category);

export const getRubricsByIds = (ids: string[]): Rubric[] =>
  founderBetaInterviewRubrics.filter((r) => ids.includes(r.id));
