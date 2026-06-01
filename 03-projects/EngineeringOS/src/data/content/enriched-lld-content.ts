import type { EnrichedDesignCapstone, EnrichedTopicContent } from "@/types/enriched-content";

const lldRefs = ["low-level-design-primer", "awesome-system-design-resources"];
const algorithmRefs = ["low-level-design-primer", "the-algorithms-javascript"];

function capstone(input: EnrichedDesignCapstone): EnrichedDesignCapstone {
  return input;
}

function topicContent(
  topicSlug: string,
  capstoneItem: EnrichedDesignCapstone,
  beginnerExplanation: string,
  deepExplanation: string,
  whyInterviewersAsk: string,
  prerequisites: string[],
  roleRelevance: string[],
  estimatedTimeMinutes = 120,
  interviewFrequency: EnrichedTopicContent["interviewFrequency"] = "high"
): EnrichedTopicContent {
  return {
    topicSlug,
    sourceRefs: capstoneItem.sourceRefs,
    beginnerExplanation,
    deepExplanation,
    whyInterviewersAsk,
    prerequisites,
    skipForNow: ["Perfect distributed consensus", "Full production UI", "Vendor-specific implementation details"],
    roleRelevance,
    estimatedTimeMinutes,
    interviewFrequency,
    enrichedProblems: [],
    designCapstones: [capstoneItem]
  };
}

const parkingLot = capstone({
  id: "capstone-parking-lot-lld",
  prompt: "Design a parking lot system that handles multiple vehicle types, spot allocation, ticketing, fee calculation, and exits.",
  sourceRefs: lldRefs,
  requirements: ["Support bike, car, and truck spots", "Issue a ticket on entry", "Free the spot on exit", "Calculate fees from ticket duration", "Allow new allocation and pricing rules"],
  approach: ["Start with vehicle, spot, floor, ticket, and gate entities", "Put allocation behind ParkingStrategy", "Put pricing behind FeeCalculator", "Keep ParkingLot as orchestration, not a god class", "Use a clock abstraction for deterministic fee tests"],
  designBreakdown: ["API/classes: ParkingLot.park(vehicle), ParkingLot.unpark(ticketId), ParkingFloor, ParkingSpot, EntryGate, ExitGate, Ticket, FeeCalculator, SpotAllocationStrategy", "Object model: Vehicle has type and plate; ParkingSpot has type, floor, occupancy; Ticket stores spot, vehicle, entry time, status", "Extension points: nearest-spot strategy, reserved spots, EV charging, dynamic pricing, lost-ticket policy", "Test cases: full lot rejects, incompatible vehicle rejected, spot freed after exit, pricing rounds correctly, duplicate ticket exit is idempotent"],
  tradeoffs: ["A simple scan is easy but slow for large lots", "Priority queues by spot type speed allocation but complicate updates", "Flat hourly fees are interview-friendly while slabs require a pricing policy object"],
  failureModes: ["Race between two gates claiming the same spot", "Ticket not found or already closed", "Clock/timezone fee bugs", "Floor capacity drift after manual admin changes"],
  security: ["Validate ticket ownership before payment", "Protect admin spot overrides", "Avoid logging full plate data where not needed"],
  observability: ["Occupancy by floor and spot type", "Entry/exit latency", "Rejected parking attempts", "Fee calculation errors"],
  awsVariant: ["DynamoDB conditional writes for distributed spot claims", "SQS event for ticket-issued and ticket-closed audit trail", "CloudWatch alarms on gate failure rates"],
  rubric: ["Names core APIs and classes", "Separates allocation and pricing strategies", "Covers full lot and duplicate exit tests", "Explains concurrency at gates", "Narrates one simple design first, then extensions"],
  expectedSeniorSignals: ["Clear object ownership", "Strategy-based extension", "Concurrency awareness", "Money/time edge-case discipline", "Pragmatic interview narration"]
});

const elevatorSystem = capstone({
  id: "capstone-elevator-system-lld",
  prompt: "Design an elevator control system for multiple elevators, floors, internal/external requests, dispatching, and state transitions.",
  sourceRefs: lldRefs,
  requirements: ["Accept hall calls and car calls", "Track elevator direction, floor, doors, and load", "Assign requests to elevators", "Support pluggable scheduling", "Expose emergency and maintenance states"],
  approach: ["Model Elevator as a state machine", "Separate Dispatcher from Elevator", "Use request queues per elevator", "Make scheduling strategy replaceable", "Define tick/move behavior for simulation tests"],
  designBreakdown: ["API/classes: ElevatorController.requestPickup(floor,direction), requestDrop(elevatorId,floor), Elevator.step(), Dispatcher.assign(request), SchedulingStrategy", "Object model: Elevator has current floor, direction, door state, target queue, capacity, mode; Request has source, destination or direction, timestamp, status", "Extension points: nearest-car, collective-control, destination dispatch, VIP/emergency override, maintenance lockout", "Test cases: same-direction batching, opposite-direction defer, idle elevator chosen, overloaded elevator skipped, emergency mode clears queue"],
  tradeoffs: ["One global queue is simple but hides per-car behavior", "Per-elevator queues model reality but need a dispatcher", "Shortest-seek is efficient locally but can starve distant floors"],
  failureModes: ["Starvation of low-priority floors", "Door open while moving state bug", "Conflicting requests during maintenance", "Capacity sensor mismatch"],
  security: ["Restrict maintenance/admin operations", "Audit emergency overrides", "Avoid exposing passenger identity in telemetry"],
  observability: ["Wait time by floor", "Trip completion latency", "Queue depth by elevator", "Mode transitions and emergency events"],
  awsVariant: ["IoT Core for elevator telemetry", "Kinesis for movement events", "Lambda rules for alerting on unsafe state transitions"],
  rubric: ["Defines state transitions clearly", "Keeps dispatcher pluggable", "Tests movement and assignment behavior", "Covers starvation and maintenance", "Explains scheduling tradeoffs out loud"],
  expectedSeniorSignals: ["State-machine clarity", "Scheduling tradeoff judgment", "Simulation-friendly API", "Safety-first edge cases", "Incremental narration"]
});

const splitwise = capstone({
  id: "capstone-splitwise-expense-sharing-lld",
  prompt: "Design an expense-sharing system with users, groups, expenses, exact/equal/percentage splits, balances, and settlement suggestions.",
  sourceRefs: algorithmRefs,
  requirements: ["Create users and groups", "Add expenses with multiple split modes", "Maintain balances", "Show who owes whom", "Suggest simplified settlements"],
  approach: ["Represent every expense as immutable ledger entries", "Use SplitStrategy for equal, exact, and percentage allocation", "Store net balances separately from audit history", "Use integer minor currency units", "Simplify debts with creditor/debtor matching"],
  designBreakdown: ["API/classes: ExpenseService.addExpense(dto), BalanceService.getUserBalances(userId), SettlementService.simplify(groupId), SplitStrategy", "Object model: Expense has payer, amount, currency, splits; LedgerEntry stores from, to, amount; BalanceSheet stores net pair or user totals", "Extension points: multi-currency conversion, recurring expenses, receipt attachments, group-level permissions", "Test cases: equal split with remainder, exact split sum mismatch, percentage not 100, payer included/excluded, simplified settlement preserves net balances"],
  tradeoffs: ["Pairwise balances are easy to query but can grow large", "User net totals simplify settlement but lose direct relationship detail", "Immutable ledger aids auditability while cached balances need reconciliation"],
  failureModes: ["Rounding drift", "Duplicate expense submission", "Deleted user with open balance", "Concurrent expense updates corrupting cached balances"],
  security: ["Authorize group membership before reads/writes", "Idempotency key for expense creation", "Audit edits and deletions"],
  observability: ["Expense creation errors", "Balance reconciliation drift", "Settlement computation latency", "Duplicate idempotency hits"],
  awsVariant: ["DynamoDB transactions for expense plus ledger writes", "SQS reconciliation job", "S3 for receipt objects"],
  rubric: ["Uses strategy for split types", "Explains ledger versus balance cache", "Tests rounding and invalid split sums", "Handles idempotency", "Narrates money correctness before UI features"],
  expectedSeniorSignals: ["Ledger thinking", "Rounding discipline", "Auditability", "Algorithmic settlement clarity", "Product-aware extension points"]
});

const rateLimiter = capstone({
  id: "capstone-rate-limiter-lld",
  prompt: "Design a rate limiter library/service that supports per-user and per-IP limits with fixed window, sliding window, and token bucket strategies.",
  sourceRefs: lldRefs,
  requirements: ["Support multiple algorithms", "Identify callers by key", "Return allow/deny plus retry metadata", "Make storage pluggable", "Be safe under concurrent requests"],
  approach: ["Define a RateLimiter interface", "Separate policy from storage", "Implement token bucket first for burst control", "Inject clock for deterministic tests", "Add Redis-backed storage for distributed use"],
  designBreakdown: ["API/classes: RateLimiter.allow(key), RateLimitPolicy, RateLimitStore, TokenBucketLimiter, SlidingWindowLimiter, Decision, Clock", "Object model: Policy defines capacity/window/refill; Store owns counters/timestamps; Decision returns allowed, remaining, retryAfter", "Extension points: tenant policies, weighted costs, admin bypass, local fallback", "Test cases: first request allowed, limit exceeded returns retryAfter, boundary burst behavior, token refill math, concurrent double-spend prevention"],
  tradeoffs: ["Fixed window is simple but allows boundary bursts", "Sliding window is smoother but uses more storage", "Token bucket handles bursts but needs careful refill math"],
  failureModes: ["Redis timeout", "Clock skew", "Concurrent double-spend of tokens", "Unbounded key cardinality", "Wrong tenant key"],
  security: ["Avoid trusting spoofable headers", "Separate tenant scopes", "Protect admin override APIs", "Log abuse decisions without leaking secrets"],
  observability: ["Allowed/blocked count by policy", "Store latency", "Hot keys", "Fallback mode activations"],
  awsVariant: ["API Gateway throttling for edge protection", "ElastiCache Redis for shared counters", "CloudWatch metrics and alarms"],
  rubric: ["Clean interfaces", "Testable clock", "Concurrency plan", "Distributed storage option", "Clear algorithm tradeoffs"],
  expectedSeniorSignals: ["Extensible design", "Correctness under concurrency", "Operational fallback", "Tenant-aware API", "Precise retry semantics"]
});

const cacheLld = capstone({
  id: "capstone-cache-lru-lld",
  prompt: "Design an in-memory LRU cache with get, put, eviction, capacity control, optional TTL, and metrics hooks.",
  sourceRefs: algorithmRefs,
  requirements: ["O(1) get and put", "Evict least recently used key", "Update existing values", "Support capacity zero edge case", "Expose hit/miss metrics"],
  approach: ["Combine Map lookup with doubly linked recency list", "Move touched nodes to the front", "Evict from the tail", "Keep node operations private and small"],
  designBreakdown: ["API/classes: LRUCache.get(key), put(key,value), delete(key), CacheNode, DoublyLinkedList, EvictionPolicy, Clock", "Object model: Map stores key to node; node stores key, value, prev, next, optional expiresAt; list head is most recent", "Extension points: TTL, LFU policy, size-based eviction, metrics callback, loader/read-through cache", "Test cases: get miss, put update refreshes recency, capacity eviction, capacity zero no-op, expired entry removed"],
  tradeoffs: ["Map plus linked list is more code but guarantees O(1)", "Native Map insertion order is simpler but less explicit in interviews", "TTL adds cleanup complexity"],
  failureModes: ["Stale node links", "Memory leak after eviction", "Incorrect update recency", "Capacity zero crash"],
  security: ["Avoid caching secrets without encryption policy", "Partition tenant keys", "Redact values from debug logs"],
  observability: ["Hit ratio", "Eviction count", "Current size", "Expired entry count"],
  awsVariant: ["Use ElastiCache Redis for distributed cache after local cache limits", "CloudWatch cache hit metrics"],
  rubric: ["O(1) operations", "Clean node manipulation", "Edge-case handling", "Clear production caveats", "Tests recency after update"],
  expectedSeniorSignals: ["Data-structure correctness", "API clarity", "Testing edge cases", "Production cache caution", "Memory-safety awareness"]
});

const notificationService = capstone({
  id: "capstone-notification-service-lld",
  prompt: "Design a notification service that sends email, SMS, and push notifications with templates, preferences, retries, and delivery tracking.",
  sourceRefs: lldRefs,
  requirements: ["Support multiple channels", "Render templates with data", "Respect user preferences", "Retry transient provider failures", "Track delivery status"],
  approach: ["Separate notification request intake from channel providers", "Use TemplateRenderer and PreferenceService before enqueueing", "Model delivery attempts", "Use retry policy per provider/channel", "Make idempotency explicit"],
  designBreakdown: ["API/classes: NotificationService.send(request), TemplateRenderer, PreferenceService, ChannelProvider, RetryPolicy, DeliveryRepository", "Object model: Notification has recipient, channel, template, payload, idempotencyKey; DeliveryAttempt records provider response and status", "Extension points: new channel provider, quiet hours, priority routing, digest batching, A/B templates", "Test cases: opted-out user skipped, missing template variable fails validation, provider timeout retries, duplicate idempotency key returns same notification, permanent failure stops retry"],
  tradeoffs: ["Synchronous send is simple but fragile", "Queue-backed delivery improves reliability but adds eventual status", "Provider abstraction helps switching vendors but can hide channel-specific capabilities"],
  failureModes: ["Template render error", "Provider outage", "Retry storm", "Duplicate notifications", "Preference service unavailable"],
  security: ["Validate template variables", "Protect recipient PII", "Prevent template injection", "Authorize sender/app identity"],
  observability: ["Delivery success rate by channel", "Provider latency", "Retry count", "Dead-letter count", "Preference-skip count"],
  awsVariant: ["SNS/Pinpoint/SES providers", "SQS for async delivery", "DynamoDB delivery status table", "CloudWatch alarms on dead letters"],
  rubric: ["Defines channel provider interface", "Separates templates/preferences/delivery", "Covers retry and idempotency tests", "Handles PII and opt-out", "Narrates reliability before provider details"],
  expectedSeniorSignals: ["Reliability modeling", "User preference respect", "Provider abstraction judgment", "Idempotency discipline", "PII-aware design"]
});

const workflowEngine = capstone({
  id: "capstone-workflow-engine-lld",
  prompt: "Design a workflow engine that executes multi-step workflows with dependencies, retries, state persistence, and human/manual steps.",
  sourceRefs: algorithmRefs,
  requirements: ["Define workflows as steps and dependencies", "Execute ready steps", "Persist workflow state", "Retry failed steps by policy", "Support manual approval steps"],
  approach: ["Model the workflow as a DAG", "Keep execution state separate from workflow definition", "Use StepExecutor registry by step type", "Advance state through explicit transitions", "Detect cycles at definition time"],
  designBreakdown: ["API/classes: WorkflowService.start(definitionId,input), WorkflowRunner.tick(instanceId), StepExecutor, StateStore, RetryPolicy, WorkflowDefinitionValidator", "Object model: Definition has nodes/edges; Instance has step states, input/output, version; StepRun records attempts", "Extension points: timers, compensation, pause/resume, version migration, external event wait", "Test cases: cycle rejected, independent steps run in parallel, failed step retries then fails workflow, manual step pauses, resume continues downstream"],
  tradeoffs: ["In-process runner is easier for machine coding", "Durable queue plus store survives crashes but is more infrastructure-heavy", "DAG workflows are simpler than arbitrary code but less expressive"],
  failureModes: ["Worker crash after side effect before state write", "Duplicate step execution", "Workflow definition changed mid-run", "Poison step retry loop"],
  security: ["Authorize workflow start and manual approval", "Validate step inputs", "Store secrets as references, not plain payloads"],
  observability: ["Workflow duration", "Step failure rate", "Retry count", "Stuck instances", "State transition audit log"],
  awsVariant: ["Step Functions as managed workflow engine", "Lambda/ECS workers for steps", "EventBridge for external events", "DynamoDB for custom state store"],
  rubric: ["Uses DAG/state-machine language", "Separates definition from instance", "Covers retries and duplicate execution", "Tests cycle/manual/resume cases", "Explains durability tradeoffs"],
  expectedSeniorSignals: ["State transition rigor", "Idempotent step thinking", "Durability awareness", "Extensible executor registry", "Clear phased narration"]
});

const pubSub = capstone({
  id: "capstone-pub-sub-lld",
  prompt: "Design an in-memory pub/sub system with topics, publishers, subscribers, filtering, acknowledgement, and delivery guarantees.",
  sourceRefs: algorithmRefs,
  requirements: ["Create topics", "Publish messages", "Subscribe consumers", "Deliver to matching subscribers", "Support at-least-once acknowledgement mode"],
  approach: ["Start with a Broker owning topics", "Represent each subscription independently", "Use queue per subscription for fan-out", "Add acknowledgement and retry for reliable mode", "Make filtering a predicate strategy"],
  designBreakdown: ["API/classes: Broker.publish(topic,message), subscribe(topic,handler,options), Topic, Subscription, MessageQueue, DeliveryPolicy, Filter", "Object model: Topic holds subscriptions; Subscription owns cursor/queue/filter/ack state; Message has id, key, payload, timestamp", "Extension points: durable storage, ordering by key, wildcard topics, backpressure, dead-letter queues", "Test cases: one publish reaches many subscribers, filter excludes message, subscriber failure redelivers, unsubscribe stops delivery, per-key order maintained"],
  tradeoffs: ["Direct callback delivery is tiny but weak under slow subscribers", "Per-subscription queues isolate consumers but use more memory", "At-most-once is fast but can lose messages; at-least-once needs idempotent consumers"],
  failureModes: ["Slow subscriber backpressure", "Message loss on broker restart", "Duplicate delivery after ack timeout", "Unbounded topic memory"],
  security: ["Authorize publish/subscribe per topic", "Validate payload size", "Avoid logging sensitive payloads"],
  observability: ["Publish rate", "Subscriber lag", "Delivery failures", "Queue depth", "Dead-letter count"],
  awsVariant: ["SNS topics for fan-out", "SQS queues per subscriber", "EventBridge for routed events", "CloudWatch lag and DLQ alarms"],
  rubric: ["Models topic/subscription/message clearly", "Names delivery guarantee", "Covers slow consumer behavior", "Tests fan-out/filter/retry", "Narrates scope before distributed broker features"],
  expectedSeniorSignals: ["Delivery semantics clarity", "Backpressure awareness", "Consumer isolation", "Ordering tradeoff judgment", "Extensible broker API"]
});

const taskScheduler = capstone({
  id: "capstone-task-scheduler-lld",
  prompt: "Design a task scheduler that supports one-time tasks, recurring tasks, priorities, retries, cancellation, and worker execution.",
  sourceRefs: algorithmRefs,
  requirements: ["Schedule tasks for future execution", "Support recurring schedules", "Poll due tasks efficiently", "Retry failed tasks", "Allow cancellation"],
  approach: ["Store tasks by nextRunAt in a min-heap or priority queue", "Separate scheduler from worker executor", "Represent recurrence as a policy", "Use explicit task states", "Inject clock for tests"],
  designBreakdown: ["API/classes: TaskScheduler.schedule(task), cancel(taskId), tick(), TaskStore, PriorityQueue, RecurrencePolicy, Worker, RetryPolicy", "Object model: Task has id, payload, nextRunAt, priority, recurrence, attempts, status; Worker claims and executes due tasks", "Extension points: cron parser, distributed locks, task dedupe, worker pools, dead-letter handling", "Test cases: due task executes first, future task waits, priority tie-breaker works, recurring task reschedules, cancelled task never runs"],
  tradeoffs: ["Min-heap is fast in memory but not durable", "Database polling is durable but needs indexing and locking", "Cron syntax is expressive but increases parser risk"],
  failureModes: ["Clock skew", "Worker crash after claim", "Duplicate execution", "Recurring task drift", "Poison task retries forever"],
  security: ["Validate task type and payload", "Authorize scheduling by tenant", "Avoid executing arbitrary code from payload"],
  observability: ["Scheduling delay", "Execution duration", "Retry count", "Queue depth", "Dead-letter count"],
  awsVariant: ["EventBridge Scheduler for simple schedules", "SQS delayed messages for short delays", "DynamoDB conditional claim for custom scheduler", "ECS/Lambda workers"],
  rubric: ["Uses heap/queue or indexed due-time store", "Separates scheduling and execution", "Tests clock and cancellation cases", "Handles duplicate execution", "Explains durability upgrade path"],
  expectedSeniorSignals: ["Time-based correctness", "Worker failure modeling", "Data-structure fit", "Idempotency awareness", "Operationally realistic scope control"]
});

const featureFlagService = capstone({
  id: "capstone-feature-flag-service-lld",
  prompt: "Design a feature flag service with boolean and percentage flags, targeting rules, environments, audit history, and SDK evaluation.",
  sourceRefs: lldRefs,
  requirements: ["Create and update flags", "Evaluate flags for a user/context", "Support environments", "Support rollout percentages and targeting", "Audit every change"],
  approach: ["Separate management API from evaluation SDK", "Make rule evaluation deterministic", "Use hashing for percentage rollout", "Cache flag definitions in SDK", "Define safe defaults when config is unavailable"],
  designBreakdown: ["API/classes: FlagAdminService.upsert(flag), FlagEvaluator.evaluate(key,context), Rule, Segment, PercentageRollout, AuditLog", "Object model: Flag has key, environment, default, rules, variations, version; Context has user/team/attributes", "Extension points: multivariate flags, prerequisites, kill switches, approval workflow, streaming updates", "Test cases: disabled flag returns default, targeted user matches, percentage rollout stable for same user, environment isolation, missing flag uses fallback"],
  tradeoffs: ["Server-side evaluation centralizes control but adds latency", "SDK-side evaluation is fast but needs cache invalidation", "Percentage rollout is easy with hashing but must remain stable across versions"],
  failureModes: ["Stale SDK cache", "Bad default causing outage", "Rule order bug", "Audit log missing for emergency change"],
  security: ["RBAC for flag changes", "Audit admin actions", "Avoid exposing sensitive targeting rules to public clients", "Validate attributes used in rules"],
  observability: ["Evaluation count by flag/variation", "Config fetch latency", "SDK cache age", "Flag change audit feed"],
  awsVariant: ["AppConfig for managed flags", "CloudFront/S3 for SDK config snapshots", "DynamoDB audit log", "EventBridge flag-change events"],
  rubric: ["Defines evaluator API", "Uses deterministic percentage rollout", "Covers defaults and stale cache", "Separates environments", "Narrates release-safety intent"],
  expectedSeniorSignals: ["Deterministic evaluation", "Release-risk awareness", "Admin/audit discipline", "SDK cache tradeoff judgment", "Privacy-aware targeting"]
});

const logger = capstone({
  id: "capstone-logger-lld",
  prompt: "Design a logger library with levels, structured fields, appenders/transports, formatting, correlation IDs, and sampling.",
  sourceRefs: lldRefs,
  requirements: ["Log at levels", "Attach structured metadata", "Support multiple transports", "Propagate request correlation", "Avoid blocking application hot paths"],
  approach: ["Define a small Logger interface", "Represent log events as structured objects", "Use transport/appender abstraction", "Make formatter and sampling pluggable", "Provide child loggers for context"],
  designBreakdown: ["API/classes: Logger.info/debug/error, Logger.child(context), LogEvent, Formatter, Transport, Sampler, ContextProvider", "Object model: LogEvent stores timestamp, level, message, fields, error, correlationId; Transport writes to console/file/remote sink", "Extension points: redaction, async batching, OpenTelemetry bridge, dynamic log levels, per-tenant sampling", "Test cases: below-level logs dropped, child context merged, error stack serialized, transport failure isolated, sensitive field redacted"],
  tradeoffs: ["Synchronous logging is simple but can slow requests", "Async batching improves throughput but can lose logs on crash", "Free-form messages are easy while structured logs are searchable"],
  failureModes: ["Transport backpressure", "Recursive logging on transport error", "PII leak", "Log volume explosion"],
  security: ["Redact secrets and tokens", "Avoid logging request bodies by default", "Protect remote log credentials"],
  observability: ["Dropped log count", "Transport latency", "Batch queue depth", "Serialization failures"],
  awsVariant: ["CloudWatch Logs transport", "Firehose for batched delivery", "X-Ray/OpenTelemetry correlation", "KMS-encrypted log sinks"],
  rubric: ["Keeps API ergonomic", "Uses transport/formatter abstractions", "Covers redaction and transport failure tests", "Explains sync versus async", "Narrates observability value clearly"],
  expectedSeniorSignals: ["Operational empathy", "PII-safe defaults", "Hot-path performance awareness", "Composable context model", "Failure-isolation mindset"]
});

const inventoryOrderSystem = capstone({
  id: "capstone-inventory-order-system-lld",
  prompt: "Design an inventory and order system that reserves stock, creates orders, processes payment, and releases or commits inventory.",
  sourceRefs: lldRefs,
  requirements: ["Track SKU inventory", "Reserve stock during checkout", "Create orders", "Commit stock after payment", "Release reservations on failure or timeout"],
  approach: ["Separate inventory reservation from order lifecycle", "Model order as a state machine", "Use Reservation objects with expiry", "Make payment an external dependency behind an interface", "Use idempotency keys for checkout"],
  designBreakdown: ["API/classes: InventoryService.reserve(items), release(reservationId), commit(reservationId), OrderService.createOrder(cart), PaymentGateway, OrderStateMachine", "Object model: SKU has available/reserved counts; Reservation has items, expiry, status; Order has items, payment status, fulfillment status", "Extension points: warehouses, backorders, coupons, shipment splitting, saga/outbox events", "Test cases: insufficient stock rejected, reservation reduces available stock, payment failure releases stock, duplicate checkout idempotent, expired reservation cannot commit"],
  tradeoffs: ["Strong locking prevents oversell but lowers throughput", "Optimistic reservation scales better but needs conflict handling", "Keeping payment outside inventory avoids coupling but requires compensating actions"],
  failureModes: ["Oversell under concurrent checkout", "Payment succeeds but order commit fails", "Reservation never expires", "Partial stock availability across warehouses"],
  security: ["Authorize order ownership", "Do not store raw payment details", "Validate price and SKU server-side", "Audit inventory adjustments"],
  observability: ["Reservation success/failure rate", "Inventory drift", "Order state transition count", "Payment compensation events"],
  awsVariant: ["DynamoDB conditional updates for stock", "SQS outbox for order events", "Step Functions saga for payment/commit/release", "EventBridge reservation-expired events"],
  rubric: ["Models reservation explicitly", "Uses order state machine", "Covers oversell and payment failure tests", "Explains consistency tradeoffs", "Narrates business invariants before classes"],
  expectedSeniorSignals: ["Invariant-first design", "Concurrency control", "Saga/compensation awareness", "Idempotent checkout", "Domain modeling clarity"]
});

export const enrichedLldContent = [
  topicContent(
    "parking-lot",
    parkingLot,
    "A parking lot design maps vehicles to compatible spots, issues tickets, and calculates fees when vehicles leave.",
    "Strong LLD keeps allocation, pricing, ticket lifecycle, and lot inventory separate so new spot types or pricing rules do not rewrite the core flow.",
    "It tests object modeling, strategy selection, state transitions, edge cases, and interview-friendly narration.",
    ["OOP classes", "Strategy pattern", "Basic time arithmetic", "Maps/sets"],
    ["Machine coding", "Backend module design", "Object-oriented interviews"]
  ),
  topicContent(
    "elevator-system",
    elevatorSystem,
    "An elevator system accepts pickup/drop requests and moves cabins through safe states.",
    "The design is mostly a state machine plus scheduling strategy: elevators own movement state, while dispatchers decide assignment.",
    "It reveals whether a candidate can tame state, queues, and algorithm tradeoffs without overbuilding.",
    ["Queues", "State machines", "Strategy pattern"],
    ["Machine coding", "Realtime control modeling", "LLD interviews"],
    135
  ),
  topicContent(
    "splitwise-expense-sharing",
    splitwise,
    "A Splitwise-style system records shared expenses and computes balances between people.",
    "The core is an immutable ledger plus cached balances, with split strategies for equal, exact, and percentage allocations.",
    "It tests money correctness, domain modeling, auditability, and simple graph/debt settlement reasoning.",
    ["Maps", "Graph basics", "Integer money representation", "Strategy pattern"],
    ["Machine coding", "Fintech/domain modeling", "Backend interviews"],
    130
  ),
  topicContent(
    "rate-limiter-lld",
    rateLimiter,
    "A rate limiter decides whether a caller can perform an action now or must wait.",
    "Good LLD separates algorithm, caller identity, clock, and storage so the same design works in memory, Redis, or API Gateway-backed systems.",
    "It tests interfaces, time-based state, concurrency, and extensibility.",
    ["Classes/interfaces", "Maps", "Time arithmetic", "Basic Redis"],
    ["Machine coding", "Backend platform", "API reliability"],
    120
  ),
  topicContent(
    "cache-lld",
    cacheLld,
    "An LRU cache keeps recently used items and evicts the coldest item when full.",
    "The classic design combines a hash map for lookup with a doubly linked list for recency updates.",
    "It checks whether you can combine data structures into a clean API.",
    ["Map", "Linked list", "Object references"],
    ["Coding interviews", "LLD rounds", "Backend performance"],
    100,
    "very-high"
  ),
  topicContent(
    "notification-service-lld",
    notificationService,
    "A notification service turns product events into channel-specific messages sent to recipients.",
    "The key design separates templates, preferences, routing, provider adapters, retry policy, and delivery status.",
    "It tests reliability modeling, abstraction boundaries, provider failure handling, and user privacy.",
    ["Interfaces", "Queues", "Retry policies", "Template rendering"],
    ["Machine coding", "Backend platform", "Product infrastructure"]
  ),
  topicContent(
    "workflow-engine-lld",
    workflowEngine,
    "A workflow engine runs a set of dependent steps and records progress until the workflow completes or fails.",
    "A durable design treats workflow definitions as DAGs and workflow instances as state machines with retryable step attempts.",
    "It tests state modeling, dependency traversal, idempotency, and crash recovery thinking.",
    ["Graphs/DAGs", "State machines", "Retries", "Idempotency"],
    ["Senior LLD", "Platform engineering", "Backend orchestration"],
    150
  ),
  topicContent(
    "pub-sub-lld",
    pubSub,
    "A pub/sub system lets publishers send messages to topics while subscribers receive matching messages.",
    "Even an in-memory broker needs explicit choices about fan-out, subscription queues, filtering, ordering, acknowledgement, and backpressure.",
    "It tests API boundaries, queue design, delivery semantics, and distributed-systems vocabulary at LLD scale.",
    ["Queues", "Callbacks", "Maps", "Basic messaging concepts"],
    ["Machine coding", "Event-driven backend", "Platform interviews"],
    130
  ),
  topicContent(
    "task-scheduler-lld",
    taskScheduler,
    "A task scheduler runs work at or after a requested time and optionally repeats it.",
    "The core design is due-time ordering plus task state, recurrence policy, retry policy, worker execution, and clock-driven tests.",
    "It tests time-based data structures, worker failure handling, and clean separation between scheduling and execution.",
    ["Priority queues", "Time arithmetic", "Worker patterns", "Retries"],
    ["Machine coding", "Backend infrastructure", "Job systems"],
    130
  ),
  topicContent(
    "feature-flag-service-lld",
    featureFlagService,
    "A feature flag service evaluates whether a feature should be enabled for a given context.",
    "A robust design separates flag administration from deterministic SDK evaluation, rollout rules, environments, and audit history.",
    "It tests release-safety thinking, deterministic algorithms, caching tradeoffs, and admin controls.",
    ["Hashing", "Rules engines", "Caching", "RBAC basics"],
    ["Senior LLD", "SaaS platform", "Release engineering"],
    125
  ),
  topicContent(
    "logger-lld",
    logger,
    "A logger captures application events with severity, message, metadata, and output transports.",
    "Production-ready logger design keeps the caller API small while making formatting, transports, context, redaction, and sampling replaceable.",
    "It tests practical API ergonomics, operational thinking, and hot-path performance tradeoffs.",
    ["Interfaces", "Serialization", "Error handling", "Observability basics"],
    ["Machine coding", "Backend observability", "Library design"],
    110
  ),
  topicContent(
    "inventory-order-system-lld",
    inventoryOrderSystem,
    "An inventory/order system protects stock while orders move through checkout, payment, and fulfillment.",
    "The strongest design makes reservation a first-class object and treats order processing as a state machine with compensation paths.",
    "It tests domain invariants, concurrency, idempotency, and pragmatic consistency tradeoffs.",
    ["State machines", "Transactions", "Idempotency", "Domain modeling"],
    ["Senior LLD", "E-commerce backend", "Machine coding"],
    150
  )
] satisfies EnrichedTopicContent[];
