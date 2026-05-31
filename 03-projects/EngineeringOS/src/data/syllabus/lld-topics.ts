import type { SyllabusPracticeProblem, SyllabusTopic } from "@/types/syllabus";

const lldReferences = [
  { id: "reference-lld-roadmap-architecture", title: "roadmap.sh Software Design and Architecture", url: "https://roadmap.sh/software-design-architecture", sourceType: "roadmap" as const, usage: "External guided path for design principles, architecture basics, and design patterns." },
  { id: "reference-lld-low-level-design-primer", title: "Low Level Design Primer", url: "https://github.com/prasadgujar/low-level-design-primer", sourceType: "roadmap" as const, usage: "Public GitHub repo for LLD, OOP, design patterns, and machine-coding interview preparation." },
  { id: "reference-lld-system-design-primer-ood", title: "System Design Primer OOD", url: "https://github.com/donnemartin/system-design-primer#object-oriented-design-interview-questions-with-solutions", sourceType: "roadmap" as const, usage: "System Design Primer section for object-oriented design interview practice." },
  { id: "reference-lld-codezym", title: "CodeZym Machine Coding Practice", url: "https://codezym.com/", sourceType: "practice" as const, usage: "Practice platform for LLD and machine-coding interview problems." }
];

function lldProblems(slug: string, title: string): SyllabusPracticeProblem[] {
  return [
    { id: `problem-lld-${slug}-easy`, title: `${title} design sketch`, difficulty: "easy", tags: ["lld", slug, "oop"], prompt: `Sketch the classes, responsibilities, and one key method for ${title}.`, expectedSignals: ["Clear responsibility split", "One working method", "Names extension point"] },
    { id: `problem-lld-${slug}-medium`, title: `${title} machine coding`, difficulty: "medium", tags: ["lld", slug, "machine-coding"], prompt: `Implement a small working version of ${title} with tests or sample input/output.`, expectedSignals: ["Compiles logically", "Handles edge cases", "Readable boundaries"] },
    { id: `problem-lld-${slug}-hard`, title: `${title} design review`, difficulty: "hard", tags: ["lld", slug, "design-review"], prompt: `Extend ${title} with a new requirement without rewriting everything. Explain the design change and trade-offs.`, expectedSignals: ["Open for extension", "Minimal coupling", "Trade-off explained"] }
  ];
}

function lldTopic(order: number, slug: string, title: string, phase: string, definition: string, mentalModel: string, theory: string, code: string): SyllabusTopic {
  return {
    id: `syllabus-lld-${slug}`,
    slug,
    title,
    order,
    sourcePath: "00-control/master-roadmap/07-lld/INDEX.md",
    definition,
    whyItMatters: `${title} is part of the LLD/${phase} track for senior engineer, staff engineer, and machine-coding interviews.`,
    mentalModel,
    theory: `${theory}\n\nVisual model: requirements -> objects/interfaces -> interactions -> extension points -> tests.`,
    codeExamples: [{ id: `example-lld-${slug}`, title: `${title} example`, language: "typescript", code, explanation: `Minimal TypeScript-oriented LLD example for ${title}.`, runnable: false }],
    practiceProblems: lldProblems(slug, title),
    interviewQuestions: [`How would you design ${title}?`, `What changes when requirements evolve?`, `Which design principle matters most here?`],
    commonMistakes: ["Starting with code before requirements", "God classes", "Overengineering patterns", "No tests or sample flows"],
    productionUseCases: ["Machine-coding rounds", "Backend module design", "Code reviews", "Service boundaries"],
    revisionPrompts: [`Draw ${title} from memory.`, `Name one class/interface boundary for ${title}.`, `Add one new requirement and update the design.`],
    reviewPrompts: [{ id: `review-lld-${slug}-mentor`, reviewerRole: "mentor", prompt: `Review ${title} like an LLD/machine-coding interviewer.`, rubric: ["Requirements covered", "Responsibilities clean", "Extensible design", "Edge cases considered"] }],
    references: [...lldReferences, { id: `reference-lld-${slug}-local-roadmap`, title: "EngineeringOS LLD master roadmap", url: "00-control/master-roadmap/07-lld/INDEX.md", sourceType: "roadmap", usage: "Local placeholder for future LLD source detail; external guided sources fill the current gap." }],
    progressSignals: ["read_definition", "read_theory", "studied_code_example", "ran_code_example", "solved_easy_problem", "solved_medium_problem", "solved_hard_problem", "submitted_explain_back", "completed_mock_review", "scheduled_revision"]
  };
}

export const lldFoundationTopics: SyllabusTopic[] = [
  lldTopic(1, "oop-principles", "OOP Principles", "Foundations", "OOP principles organize software around encapsulated state, behavior, abstraction, inheritance, and polymorphism.", "Objects own behavior and hide implementation details behind contracts.", "The 80/20 LLD foundation is knowing how to split responsibilities, avoid shared mutable chaos, and make changes local.", "interface PaymentMethod {\n  pay(amount: number): Promise<void>;\n}\nclass CardPayment implements PaymentMethod {\n  async pay(amount: number) { /* charge card */ }\n}\n"),
  lldTopic(2, "solid", "SOLID", "Foundations", "SOLID is a set of design principles for maintainable object-oriented code.", "Each class should have a reason to exist and a small reason to change.", "Use SOLID as a review lens, not a checklist to force abstractions. The highest ROI principles are single responsibility, dependency inversion, and interface segregation.", "class OrderService {\n  constructor(private readonly payment: PaymentMethod) {}\n  checkout(total: number) { return this.payment.pay(total); }\n}\n"),
  lldTopic(3, "design-patterns", "Design Patterns", "Foundations", "Design patterns are reusable solutions to common object collaboration problems.", "Patterns name recurring shapes; use them when the problem is actually present.", "Know factory, strategy, observer, adapter, decorator, command, and singleton pitfalls. Interviewers care more about fit than memorization.", "type PricingStrategy = (amount: number) => number;\nconst withDiscount: PricingStrategy = (amount) => amount * 0.9;\n"),
  lldTopic(4, "uml-sequence-class-diagrams", "UML Sequence and Class Diagrams", "Foundations", "UML-style diagrams communicate classes, relationships, and runtime interactions.", "Use diagrams to make responsibilities and message flow visible.", "For interviews, simple boxes/arrows beat perfect notation. Show key classes, interfaces, ownership, and request flow.", "User -> BookingService -> InventoryService -> PaymentService -> NotificationService")
];

export const lldMachineCodingTopics: SyllabusTopic[] = [
  lldTopic(5, "parking-lot", "Parking Lot", "Machine Coding", "Parking Lot is a classic LLD problem for vehicle types, spot allocation, tickets, pricing, and exits.", "Map vehicles to compatible spots and keep allocation rules isolated.", "Focus on entities, allocation strategy, ticket lifecycle, fee calculation, and extension for new vehicle/spot types.", "class ParkingLot {\n  park(vehicle: Vehicle): Ticket { /* choose spot */ throw new Error('todo'); }\n  unpark(ticket: Ticket): number { /* calculate fee */ return 0; }\n}\n"),
  lldTopic(6, "elevator-system", "Elevator System", "Machine Coding", "Elevator System models requests, direction, scheduling, cabins, floors, and state transitions.", "Separate request dispatch from elevator movement.", "The 80/20 design is dispatcher strategy, elevator state, request queues, and extensibility for scheduling algorithms.", "class Elevator {\n  currentFloor = 0;\n  moveTo(floor: number) { this.currentFloor = floor; }\n}\n"),
  lldTopic(7, "splitwise-expense-sharing", "Splitwise Expense Sharing", "Machine Coding", "Splitwise models users, groups, expenses, splits, balances, and settlement.", "Every expense creates balance deltas between users.", "Focus on split strategies, ledger consistency, settlement simplification, and clear money rounding rules.", "class Ledger {\n  addDebt(from: string, to: string, amount: number) { /* update balances */ }\n}\n"),
  lldTopic(8, "rate-limiter-lld", "Rate Limiter LLD", "Machine Coding", "Rate Limiter LLD designs local or distributed request allowance with algorithms such as fixed window, sliding window, or token bucket.", "A limiter is a policy plus a store plus a clock.", "Separate algorithm from storage so local memory can later become Redis. Discuss concurrency and distributed consistency.", "interface RateLimiter {\n  allow(key: string, now: number): boolean;\n}\n"),
  lldTopic(9, "cache-lld", "Cache LLD", "Machine Coding", "Cache LLD designs get/put/evict behavior with capacity and eviction policies such as LRU or LFU.", "Cache is a map plus policy-maintained metadata.", "The classic LRU design combines hash map lookup with doubly linked ordering. Keep eviction policy swappable.", "class LruCache<K, V> {\n  get(key: K): V | undefined { return undefined; }\n  put(key: K, value: V) {}\n}\n"),
  lldTopic(10, "notification-service-lld", "Notification Service LLD", "Machine Coding", "Notification Service LLD models templates, recipients, channels, preferences, providers, retries, and delivery status.", "Notification design is channel routing plus reliable delivery tracking.", "Focus on channel abstraction, preference checks, dedupe, provider failure, retry policy, and observability.", "interface ChannelProvider {\n  send(message: Message): Promise<DeliveryResult>;\n}\n")
];

export const lldSeniorDesignTopics: SyllabusTopic[] = [
  lldTopic(11, "api-design-contracts", "API Design Contracts", "Senior LLD", "API design contracts define request/response shape, errors, idempotency, pagination, compatibility, and ownership.", "A good API is a stable contract, not just a route.", "Senior engineers design APIs for evolution: versioning, typed errors, auth, idempotency, pagination, rate limits, and observability.", "type ApiError = { code: string; message: string; requestId: string };\n"),
  lldTopic(12, "module-boundaries", "Module Boundaries", "Senior LLD", "Module boundaries define ownership, dependency direction, public APIs, and hidden internals.", "Hide decisions behind small contracts.", "Good boundaries reduce blast radius and make teams faster. Avoid circular dependencies, shared mutable globals, and leaky abstractions.", "export interface UserRepository {\n  findById(id: string): Promise<User | null>;\n}\n"),
  lldTopic(13, "extensibility-tradeoffs", "Extensibility Trade-offs", "Senior LLD", "Extensibility trade-offs balance current simplicity against future change without speculative overengineering.", "Design for likely change, not every possible change.", "Staff-level design requires naming what should be flexible, what should stay simple, and what signal would justify abstraction.", "function createProcessor(kind: string): Processor {\n  // factory only if processor kinds vary independently\n  throw new Error(kind);\n}\n")
];
