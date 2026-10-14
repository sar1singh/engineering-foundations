import { SADArtifact } from '@/types';

export const COX_AUTO_SAD_DATA: SADArtifact = {
  title: 'Solution Architecture Document: High-Throughput Vehicle Inventory Syndication & Real-Time Search Platform',
  projectContext: 'Cox Automotive (Autotrader / Kelley Blue Book Ecosystem)',
  businessScope: 'Provide an enterprise-grade vehicle inventory ingestion and syndication backbone. Ingest heterogeneous dealer feeds (DMS / CSV / JSON), normalize vehicle specifications, calculate real-time Kelley Blue Book (KBB) valuations, maintain atomic vehicle availability, and syndicate searchable inventory to consumer portals within sub-second SLAs.',
  scaleDrivers: '2,500 peak inventory updates/sec during morning dealer sync windows; 45 million active vehicle listings nationwide; 99.95% availability SLA; P99 consumer catalog search latency < 150ms; Zero lost pricing updates (RPO = 0); Automatic regional recovery (RTO < 15 mins).',
  nfrs: [
    {
      category: 'Throughput & Scalability',
      requirement: 'Peak Ingestion Volume',
      targetMetric: '2,500 updates / sec (sustained 4-hour morning window)',
      verificationMethod: 'Distributed Gatling/k6 load test simulating 10,000 concurrent dealer feed bursts against API Gateway',
      failureMitigation: 'AWS SQS buffer queue absorbs bursts; auto-scaling ECS Fargate workers scale out based on queue depth metrics'
    },
    {
      category: 'Availability',
      requirement: 'System Uptime SLA',
      targetMetric: '99.95% Availability (< 4.38 hours downtime/year)',
      verificationMethod: 'Synthetics canaries monitoring public endpoints across 3 AWS Availability Zones (us-east-1a, 1b, 1c)',
      failureMitigation: 'Multi-AZ active redundancy with DynamoDB automated multi-AZ replication and ALB health-check failover'
    },
    {
      category: 'Latency',
      requirement: 'Consumer Search Response Time',
      targetMetric: 'P99 Latency < 150ms; P50 Latency < 45ms',
      verificationMethod: 'CloudWatch Synthetics + OpenTelemetry distributed tracing spans measured at Edge CloudFront boundary',
      failureMitigation: 'Read-optimized OpenSearch cluster with warm query caches and ElastiCache Redis query accelerator'
    },
    {
      category: 'Data Durability & RPO',
      requirement: 'Recovery Point Objective (Pricing & Ingestion)',
      targetMetric: 'RPO = 0 (Zero lost pricing updates)',
      verificationMethod: 'Chaos engineering test disabling primary ECS cluster; verifying SQS message redelivery via DLQ',
      failureMitigation: 'SQS FIFO with message deduplication and DynamoDB Point-in-Time Recovery (PITR) with continuous backups'
    },
    {
      category: 'Disaster Recovery & RTO',
      requirement: 'Recovery Time Objective (Regional Failure)',
      targetMetric: 'RTO < 15 minutes',
      verificationMethod: 'Annual cross-region disaster recovery drill switching Route 53 DNS from us-east-1 to us-west-2',
      failureMitigation: 'DynamoDB Global Tables with bidirectional replication + Terraform-automated infrastructure spin-up in secondary region'
    },
    {
      category: 'Security & Compliance',
      requirement: 'Data Protection & Dealer PII',
      targetMetric: 'SOC2 & CCPA Compliance; Zero plain-text credentials in flight/rest',
      verificationMethod: 'Automated SonarQube, AWS Security Hub, and monthly third-party penetration testing',
      failureMitigation: 'AWS KMS customer-managed keys (CMK) encryption at rest; TLS 1.3 in transit; Cognito mTLS dealer authorization'
    }
  ],
  c4Topology: {
    description: 'C4 Level 2 Container Architecture for Cox Automotive Inventory Platform',
    flowNarrative: '1. Dealer Feeds send bulk updates via API Gateway. 2. Node.js Ingest Worker on AWS ECS Fargate validates payloads and pushes messages into AWS SQS. 3. SQS acts as a backpressure buffer decoupling ingestion from downstream persistence. 4. Stream Processing Service batches messages and updates Amazon DynamoDB (Single-Table Inventory Store). 5. DynamoDB Streams capture committed mutations and trigger Amazon EventBridge. 6. EventBridge routes events to OpenSearch/Algolia Search Cluster and third-party syndication partners.',
    containers: [
      {
        name: 'API Gateway & Edge Boundary',
        technology: 'AWS API Gateway + CloudFront + AWS WAF',
        role: 'Authenticates dealer requests via OAuth2/JWT, applies token-bucket rate limiting (10,000 req/min/dealer), and terminates TLS 1.3.',
        scalingStrategy: 'Fully managed serverless scaling with edge caching of static vehicle media.'
      },
      {
        name: 'Ingest Worker Service',
        technology: 'Node.js (TypeScript) on AWS ECS Fargate',
        role: 'Performs schema validation, normalizes disparate dealer formats (CDK, Reynolds, CSV), and produces canonical vehicle events.',
        scalingStrategy: 'ECS Auto-scaling based on CPU utilization (> 70%) and incoming request count (min 4, max 40 tasks across 3 AZs).'
      },
      {
        name: 'Ingestion Buffer Queue',
        technology: 'Amazon SQS (FIFO + Standard DLQ)',
        role: 'Provides backpressure protection, decouples ingestion rate from database write IOPS, and guarantees at-least-once message delivery.',
        scalingStrategy: 'Managed cloud queue with automatic partition scaling and Dead Letter Queue retention of 14 days.'
      },
      {
        name: 'Stream Processing Service',
        technology: 'Node.js Worker Service on AWS ECS Fargate',
        role: 'Consumes batches of 10 messages from SQS, executes valuation business rules, and writes atomic records to DynamoDB.',
        scalingStrategy: 'Scales based on SQS ApproximateNumberOfMessagesVisible (scales out when backlog > 500 items).'
      },
      {
        name: 'Inventory Datastore',
        technology: 'Amazon DynamoDB (Single-Table Design)',
        role: 'Primary source of truth for dealer inventory, vehicle specifications, appraisal records, and hold reservations.',
        scalingStrategy: 'On-Demand capacity mode with auto-partitioning across composite hash keys (PK: DEALER#id, SK: VEHICLE#vin).'
      },
      {
        name: 'Event Distribution Fabric',
        technology: 'DynamoDB Streams + AWS EventBridge',
        role: 'Captures change-data-capture (CDC) events asynchronously from the database and fans out to search clusters and syndication webhooks.',
        scalingStrategy: 'EventBridge pipe with automated retry policies and exponential backoff.'
      },
      {
        name: 'Catalog Search Cluster',
        technology: 'Amazon OpenSearch Service (Elasticsearch) & Redis',
        role: 'Powers faceted consumer queries (Make, Model, Year, Price, Radius) with sub-150ms P99 latency.',
        scalingStrategy: '3 master nodes, 6 data nodes (r6g.xlarge) with warm index tiering and automated shard rebalancing.'
      }
    ]
  },
  adrs: [
    {
      id: 'ADR-01',
      title: 'DynamoDB Single-Table Design vs. Amazon Aurora MySQL for Vehicle Catalog Store',
      status: 'Accepted',
      context: 'Cox Automotive inventory operations require processing up to 2,500 inventory updates/sec during peak dealer syndication windows, while providing predictable single-digit millisecond read latency for vehicle lookup by VIN and dealer. The legacy system suffered severe connection-pool exhaustion and locking contention on MySQL relational tables during morning feed syncs.',
      decision: 'Adopt Amazon DynamoDB utilizing Single-Table Design patterns. All entities (Dealer, Vehicle, Appraisal, HoldReservation) reside in a single table indexed by composite partition key (PK) and sort key (SK), augmented by two Global Secondary Indexes (GSIs).',
      consequencesGain: [
        'Predictable single-digit millisecond latency (3-6ms) regardless of data volume (45M+ items)',
        'Zero database connection pooling overhead in containerized serverless Node.js workers',
        'Built-in multi-AZ durability and seamless automatic partition scaling without sharding logic',
        'Native DynamoDB Streams support providing reliable CDC for downstream OpenSearch syndication'
      ],
      consequencesSacrifice: [
        'Inability to run ad-hoc analytical queries directly on the primary transactional database',
        'High upfront design complexity: all query patterns must be modeled in advance (no runtime SQL joins)',
        'Requires secondary index (GSI) projections which add to write cost and eventual consistency lag'
      ],
      rejectionRationale: 'Amazon Aurora MySQL was rejected because at 2,500 updates/sec with concurrent reads, relational write-lock contention on the central `vehicles` table required complex application-level sharding and connection proxying (PgBouncer/RDS Proxy), increasing operational TCO by an estimated 65%.'
    },
    {
      id: 'ADR-02',
      title: 'Asynchronous Event-Driven Ingestion via Amazon SQS vs. Synchronous REST Processing',
      status: 'Accepted',
      context: 'Car dealerships batch-upload thousands of inventory updates simultaneously between 08:00 and 10:00 EST. A synchronous REST pipeline caused HTTP 504 Gateway Timeouts at the API Gateway, cascading failures to upstream dealer feeds, and worker starvation during downstream database micro-throttles.',
      decision: 'Implement an asynchronous Queue-Based Load Leveling pattern. API Gateway and Ingest Workers immediately validate the schema, push raw payloads onto Amazon SQS, and return HTTP 202 Accepted with a correlation tracking ID. Downstream Stream Processing workers consume from SQS at a controlled, sustainable rate.',
      consequencesGain: [
        'Decoupled ingestion rate from database write throughput; eliminates downstream system collapse during 10x traffic bursts',
        'Immediate HTTP 202 response to dealer feeds within < 80ms, eliminating connection timeouts',
        'Built-in fault tolerance: failed messages automatically route to Dead Letter Queue (DLQ) after 3 retries without data loss'
      ],
      consequencesSacrifice: [
        'Eventual consistency: catalog updates are visible to consumers within 2-5 seconds rather than synchronously',
        'Requires dealer API consumers to poll for ingestion job status or listen to webhook notifications',
        'Increased cloud architectural footprint with SQS FIFO queues, CloudWatch alarms, and DLQ monitoring'
      ],
      rejectionRationale: 'Synchronous REST ingestion was rejected because handling a 2,500 RPS burst synchronously would require provisioning 10x compute and database headroom that remains 90% idle during off-peak hours, failing both our cost efficiency and 99.95% availability targets.'
    },
    {
      id: 'ADR-03',
      title: 'Optimistic Concurrency Control via DynamoDB ConditionExpression for Vehicle Holds/Reservations',
      status: 'Accepted',
      context: 'When popular used vehicles are listed below market value, multiple consumer portals and dealer sales reps attempt to place holds or purchase reservations simultaneously. We must prevent race conditions and double-selling without blocking database threads.',
      decision: 'Implement Optimistic Concurrency Control (OCC) using DynamoDB ConditionExpression attributes (`attribute_not_exists(holdStatus) OR holdStatus = :available`) coupled with version timestamps. When a hold is requested, DynamoDB conditionally executes the update; if another client reserved the vehicle 1ms prior, DynamoDB rejects the transaction with a `ConditionalCheckFailedException`.',
      consequencesGain: [
        'Zero distributed locking overhead: eliminates the need for heavyweight Redis Redlock or ZooKeeper clusters',
        'High throughput under normal read/write traffic: 99.8% of requests succeed on the first attempt without lock contention',
        'Atomic, deterministic state transitions guaranteed by the database storage engine at zero added infrastructure cost'
      ],
      consequencesSacrifice: [
        'Under heavy contention on the same vehicle, losing callers receive 409 Conflict and must implement client retry logic',
        'Requires careful state machine modeling on entity records to track reservation timeouts and TTL auto-expiry'
      ],
      rejectionRationale: 'Pessimistic Distributed Locking via Redis Redlock was rejected because maintaining distributed lock leases across multi-AZ container clusters introduces split-brain risk during network partitions, increases latency by 15-25ms per reservation, and adds stateful cluster management overhead.'
    }
  ],
  crossExaminations: [
    {
      id: 'Q1',
      interrogator: 'Dmitry (Lead Committee Chair)',
      focusArea: 'DynamoDB Single-Table vs. Relational Modeling',
      question: 'In ADR-01, you chose DynamoDB Single-Table design over Aurora MySQL. But automotive inventory data has deep hierarchical relationships (Dealer -> Showrooms -> Vehicles -> Inspection History -> Valuations). How do you handle schema changes and complex relational queries without JOINs?',
      weakAnswer: 'DynamoDB is faster and more modern than MySQL, and it scales better in the cloud. If we need relational queries, we can just do multiple get calls in our Node.js code or do a table scan to find matching records.',
      strongAnswer: 'We model hierarchical relationships using compound sort keys and adjacency list patterns. For example, PK is `DEALER#<dealer_id>` and SK is `VEHICLE#<vin>` or `VALUATION#<timestamp>`. A single Query API call with `begins_with(SK, "VEHICLE#")` retrieves all vehicles for a dealer in one single-digit millisecond roundtrip. For ad-hoc multidimensional filtering and relational analytics, we deliberately separate operational writes from read queries using DynamoDB Streams into Amazon OpenSearch (CQRS pattern). This gives us O(1) key-value ingestion speed while offloading heavy faceted searches to an indexing engine optimized for them.',
      evaluationCriteria: [
        'Mentions compound keys (PK/SK) and begins_with expressions',
        'Explains CQRS pattern with OpenSearch for relational/faceted queries',
        'Rejects table scans explicitly as an architectural anti-pattern'
      ]
    },
    {
      id: 'Q2',
      interrogator: 'Elena (Cloud & Distributed Systems Chief)',
      focusArea: 'Data Loss Prevention & SQS Backpressure',
      question: 'Your NFR states RPO = 0 (zero lost pricing updates) under a 2,500 RPS peak. If your downstream Stream Processing ECS workers crash under memory pressure during a sudden traffic surge, how does your architecture guarantee zero lost data and prevent duplicate processing?',
      weakAnswer: 'We have CloudWatch alarms that restart the containers when they crash. We also configured SQS so messages stay in the queue until the workers come back online.',
      strongAnswer: 'Zero data loss is guaranteed by our SQS visibility timeout and acknowledgment protocol. When an ECS worker pulls a batch of messages, it does not delete them until the DynamoDB write successfully commits. If a worker crashes midway, the visibility timeout expires (configured at 30 seconds, 3x our P99 processing duration) and AWS SQS automatically makes the message visible to another healthy worker. To prevent poison pills from causing infinite crash loops, messages failing three times are diverted to our Dead Letter Queue (DLQ) with CloudWatch alerts. To prevent duplicate pricing writes upon redelivery, our DynamoDB writes are strictly idempotent: we use condition expressions with incoming monotonic version timestamps (`attribute_not_exists(version) OR version < :newVersion`).',
      evaluationCriteria: [
        'Details SQS visibility timeout and explicit deletion after commit',
        'Articulates DLQ mechanism and poison pill isolation',
        'Explains idempotency and version checks to neutralize duplicate processing'
      ]
    },
    {
      id: 'Q3',
      interrogator: 'Elena (Cloud & Distributed Systems Chief)',
      focusArea: 'Eventual Consistency vs. Consumer Experience',
      question: 'Your ingestion pipeline is asynchronous (ADR-02), introducing a 2-5 second eventual consistency window. What happens if a dealer updates a vehicle price from $30,000 to $25,000, and immediately refreshes their portal? Will they see the old price, and how does your architecture solve this read-your-own-writes dilemma?',
      weakAnswer: 'It is an eventual consistent system, so the dealer will just have to wait a few seconds and refresh their browser again. Eventual consistency is a normal trade-off in cloud systems.',
      strongAnswer: 'This is the classic "Read-Your-Own-Writes" problem. While the global search cluster is eventually consistent via DynamoDB Streams, we resolve the dealer experience through a hybrid approach: When the dealer submits the price update, the Ingestion Worker writes the pending modification to an in-memory Redis session cache keyed by `dealerId:vin` with a 15-second TTL. When the dealer portal queries their inventory, our API Gateway Lambda checks the session cache first. If a fresh mutation exists, it merges it with the catalog response, providing instantaneous read-your-own-writes consistency to the authoring dealer while allowing the broader consumer audience to converge within 2 seconds.',
      evaluationCriteria: [
        'Identifies the phenomenon as Read-Your-Own-Writes consistency',
        'Proposes a concrete architectural pattern (Session caching / Write-through / Optimistic UI)',
        'Defends why global strong consistency would cripple ingestion throughput'
      ]
    },
    {
      id: 'Q4',
      interrogator: 'Marcus (Enterprise Governance & Architecture)',
      focusArea: 'ADR-03 Concurrency & Race Conditions',
      question: 'In ADR-03, you rejected Redis Redlock in favor of DynamoDB ConditionExpression for vehicle reservations. In a flash sale where 500 buyers click "Reserve Vehicle" on the exact same discounted truck at 09:00:00.000, 499 requests will fail with 409 Conflict. How does your architecture protect the user experience and avoid overwhelming your database with retries?',
      weakAnswer: 'The clients will just retry automatically in a loop until one of them gets it or until they give up.',
      strongAnswer: 'First, having 499 requests fail fast with 409 Conflict is the correct business and architectural outcome: there is only one physical vehicle, and we must never oversell. Second, to prevent 499 concurrent callers from hammering DynamoDB with uncoordinated retries, our client SDK and API Gateway enforce Exponential Backoff with Full Jitter. Furthermore, for high-contention inventory drops, we place an edge Redis token gate: only the first N requests are granted an acquisition ticket to attempt the DynamoDB reservation, while subsequent requests receive immediate "Offer Expired / In Checkout" feedback at the edge within 20ms, completely shielding the database from stampedes.',
      evaluationCriteria: [
        'Defends fail-fast as the correct business invariant for non-fungible inventory',
        'Explains Exponential Backoff with Full Jitter to mitigate thundering herds',
        'Describes an edge rate-limiting/token gate mechanism to shield the database'
      ]
    },
    {
      id: 'Q5',
      interrogator: 'Dmitry (Lead Committee Chair)',
      focusArea: 'Disaster Recovery & Multi-Region Topology',
      question: 'Your RTO is 15 minutes and RPO is 0. If AWS us-east-1 suffers a total regional outage affecting ECS, SQS, and API Gateway, walk us step-by-step through your failover execution. What automated vs manual steps occur?',
      weakAnswer: 'AWS handles multi-region failover automatically for us. Route 53 switches to us-west-2 and everything keeps running.',
      strongAnswer: 'Our multi-region strategy uses an Active-Passive Warm Standby architecture. For data persistence, we configure DynamoDB Global Tables, which replicates mutations bidirectionally to us-west-2 with replication lag typically under 1 second. Route 53 health checks monitor our us-east-1 public ingress endpoints. If 3 consecutive health checks fail across 30 seconds, Route 53 automatically fails over DNS traffic to our us-west-2 API Gateway. In us-west-2, our ECS Fargate services run at a minimal baseline (2 tasks) and auto-scale to full capacity within 3 minutes upon receiving traffic. For in-flight SQS messages trapped in us-east-1 during the outage, our dealer feed contracts dictate that unacknowledged batches (those that did not receive HTTP 202) are retransmitted by the dealer gateway to the active region, satisfying our RPO=0 and 15-minute RTO targets.',
      evaluationCriteria: [
        'Clarifies Active-Passive Warm Standby topology vs. Active-Active',
        'Explains DynamoDB Global Tables replication dynamics',
        'Addresses the fate of in-flight unacknowledged messages during regional blackouts'
      ]
    },
    {
      id: 'Q6',
      interrogator: 'Marcus (Enterprise Governance & Architecture)',
      focusArea: 'Security, Compliance & Data Isolation',
      question: 'Cox Automotive syndicates inventory for competing dealership networks (e.g., Penske vs. AutoNation). How do you enforce tenant data isolation in a shared DynamoDB single-table architecture and prevent Dealer A from inspecting or overwriting Dealer B’s confidential wholesale pricing?',
      weakAnswer: 'We filter by dealer ID in the where clause of our application queries, and we trust our code not to make mistakes.',
      strongAnswer: 'We enforce tenant isolation through defense-in-depth across three architectural layers: 1. Identity & Token Claims: Every incoming request carries an OAuth2 JWT containing a cryptographically signed `tenant_id` claim verified by API Gateway Lambda Authorizer. 2. DynamoDB Partition Key Isolation: The table partition key is strictly prefixed with `DEALER#<tenant_id>`. 3. AWS IAM Fine-Grained Access Control: In high-security multi-tenant workflows, our backend assumes dynamic IAM roles with session policies utilizing the `dynamodb:LeadingKeys` condition key (`"Condition": {"ForAllValues:StringEquals": {"dynamodb:LeadingKeys": ["DEALER#${aws:PrincipalTag/TenantId}"]}}`). This guarantees that even if application code had a bug, the AWS DynamoDB storage engine physically blocks any cross-tenant partition query at the IAM level.',
      evaluationCriteria: [
        'Rejects "application-level where clauses" as insufficient for enterprise tenant isolation',
        'Explains tenant-scoped composite Partition Keys (`DEALER#<tenant_id>`)',
        'Demonstrates mastery of AWS IAM Fine-Grained Access Control using `dynamodb:LeadingKeys`'
      ]
    }
  ]
};
