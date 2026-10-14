import { HLDScenario } from '@/types';

export const HLD_SCENARIOS: HLDScenario[] = [
  {
    id: 'case-1-flash-sale',
    title: 'Case 1: High-Volume Flash Sale / Exclusive Vehicle Drop',
    subtitle: 'Inventory race conditions, distributed locking, atomic reservations, and zero overselling',
    category: 'E-Commerce / High Concurrency',
    brief: 'An automotive OEM runs a limited flash sale: 500 exclusive electric vehicles (EVs) are made available at a $10,000 subsidy at exactly 10:00:00 AM. 100,000 concurrent buyers attempt to reserve and deposit $500 within the first 60 seconds. The business requires zero overselling, an atomic 10-minute cart reservation hold, payment webhook reconciliation, and graceful degradation for losing buyers.',
    step1Clarification: {
      functionalRequirements: [
        'Users can view real-time remaining vehicle inventory count',
        'Eligible users can claim a 10-minute exclusive reservation hold on a specific VIN',
        'Users can submit a $500 credit card deposit via Stripe/Adyen to confirm the reservation',
        'Unconfirmed reservations automatically release back to the inventory pool after exactly 10 minutes',
        'Payment confirmation permanently changes vehicle status to "Sold"'
      ],
      quantifiedNFRs: [
        {
          metric: 'Peak Concurrency & RPS',
          value: '100,000 concurrent active users; 15,000 peak reservation attempts/sec at 10:00:00 AM',
          rationale: 'Flash sale start spike requires instantaneous handling without dropping requests or crashing the web tier'
        },
        {
          metric: 'Reservation Latency',
          value: 'P99 Latency < 100ms for reservation claim feedback',
          rationale: 'Buyers need immediate deterministic feedback (Reserved vs. Sold Out) before initiating payment checkout'
        },
        {
          metric: 'Inventory Invariant',
          value: 'Zero Overselling (Exactly 500 vehicles sold; never 501)',
          rationale: 'Legal and regulatory liability in automotive sales prohibits collecting money for non-existent inventory'
        },
        {
          metric: 'Availability & RTO',
          value: '99.99% Availability during the 1-hour drop window; RTO < 1 min',
          rationale: 'Any downtime during the 10-minute drop causes severe brand damage and customer outrage'
        }
      ],
      clarifyingQuestionsToAsk: [
        'Are the 500 vehicles identical (fungible pool) or do buyers pick specific individual VINs and paint options?',
        'What is the maximum allowed reservation hold duration before auto-release (e.g., 10 minutes)?',
        'Is regional geolocation or KYC pre-qualification required before a buyer can click Reserve?'
      ]
    },
    step2C4Topology: {
      overview: 'Edge Token Gate + Redis In-Memory Reservation Engine + Asynchronous Payment Saga',
      components: [
        {
          name: 'CloudFront & Edge Token Gate',
          tech: 'AWS CloudFront + WAF + CloudFront Functions',
          responsibility: 'Absorbs DDoS traffic, enforces reCAPTCHA v3, and issues cryptographic queue waitlist tokens to serialize entry.'
        },
        {
          name: 'Reservation Ingress API',
          tech: 'AWS API Gateway + Node.js (ECS Fargate)',
          responsibility: 'Validates JWT auth and executes atomic Lua scripts on ElastiCache Redis cluster.'
        },
        {
          name: 'Distributed In-Memory Ledger',
          tech: 'Amazon ElastiCache Redis (Multi-AZ Cluster with Read Replicas)',
          responsibility: 'Maintains atomic inventory counters (`DECRBY`) and key-expiry reservation leases with 10-minute TTLs.'
        },
        {
          name: 'Payment Orchestration Worker',
          tech: 'AWS Step Functions + AWS Lambda',
          responsibility: 'Coordinates the Saga: handles payment authorization, Stripe webhooks, and idempotent confirmation.'
        },
        {
          name: 'Permanent Master Datastore',
          tech: 'Amazon DynamoDB (Single-Table)',
          responsibility: 'Stores immutable sales orders, buyer audit logs, and vehicle title transfers.'
        }
      ],
      flow: [
        '1. At 10:00:00 AM, 100,000 buyers hit CloudFront; WAF validates proof-of-work tokens and allows first batch to API Gateway.',
        '2. API Gateway invokes Node.js ECS worker, which runs an atomic Redis Lua script:',
        '   - Checks if inventory > 0; if yes, decrements counter, creates key `hold:<vin>` with buyer ID and EXPIRE 600 seconds.',
        '   - If counter == 0, returns immediate 409 Sold Out to caller in < 15ms.',
        '3. Successful buyer receives reservation token and begins 10-minute checkout with Stripe.',
        '4. Stripe sends payment confirmation webhook to API Gateway -> Step Functions Saga.',
        '5. Step Functions writes confirmed sale to DynamoDB, commits the vehicle as SOLD, and invalidates Redis hold TTL.',
        '6. If 10 minutes expire without payment, Redis keyspace notification fires, incrementing inventory counter back by 1.'
      ]
    },
    step3Persistence: {
      primaryDatastore: 'Redis Cluster (In-Memory Operational Reservation) + DynamoDB (Persistent Source of Truth)',
      schemaStrategy: 'Redis: Hash `vehicle_pool:active_count` + String `hold:<vin>` with TTL 600. DynamoDB: PK `ORDER#<orderId>`, SK `METADATA`, with GSI1 `VIN#<vin>` to enforce global uniqueness on confirmed sales.',
      concurrencyControl: 'In-Memory Atomic Operations via Redis Lua script (single-threaded event loop prevents race conditions), backed by DynamoDB ConditionExpression `attribute_not_exists(vin)` on final order creation.',
      cachingStrategy: 'Consumer catalog inventory count cached at CloudFront edge with 1-second TTL, refreshed via WebSocket push as stock drops below 50 units.'
    },
    step4Resiliency: {
      failureModes: [
        {
          mode: 'Redis Primary Node Crash midway through reservation window',
          blastRadius: 'Potential momentary drop of in-flight reservations during failover window.',
          mitigation: 'Multi-AZ Redis replication with automated failover via AWS ElastiCache (< 15 seconds) and AOF (Append Only File) persistence enabled with `fsync everysec`.'
        },
        {
          mode: 'Stripe Payment Webhook Delayed or Dropped',
          blastRadius: 'Buyer money is deducted, but vehicle reservation expires before webhook arrives.',
          mitigation: 'Client actively polls our checkout status API every 2 seconds, which directly queries the Stripe payment intent status as a fallback if webhook is delayed.'
        },
        {
          mode: 'Thundering Herd on "Sold Out" state',
          blastRadius: '99,500 losing buyers hammering refresh buttons repeatedly.',
          mitigation: 'Once inventory reaches 0 in Redis, CloudFront edge function is signaled via CloudFront KeyValueStore to return cached "Sold Out" HTML directly from the edge, shielding origin servers.'
        }
      ],
      defenseTradeOff: 'We trade away immediate disk durability on initial hold (using Redis in-memory atomic decrement) in exchange for sub-15ms P99 latency and guaranteed zero race conditions under 15,000 RPS. The permanent disk commit happens asynchronously during payment processing, where traffic has naturally reduced from 100,000 to the winning 500 buyers.'
    }
  },
  {
    id: 'case-2-monolith-modernization',
    title: 'Case 2: Monolith to Cloud Microservices Modernization',
    subtitle: 'Strangler Fig, Change Data Capture (CDC), database decoupling, and zero downtime',
    category: 'Architecture Migration / Enterprise Refactoring',
    brief: 'A 15-year-old on-premise Java Spring monolith with a 12-terabyte shared Oracle database handles all dealer management, vehicle valuation, and syndication feeds. Release cycles take 6 weeks, database deadlocks occur daily, and scaling the monolith requires costly proprietary hardware. The enterprise mandate is to decompose the monolith into cloud-native AWS microservices with zero downtime, zero business disruption, and reversible rollouts.',
    step1Clarification: {
      functionalRequirements: [
        'Decouple vehicle inventory syndication from legacy dealer accounting and payroll',
        'Enable daily independent microservice deployments without touching the monolith',
        'Maintain real-time bidirectional data synchronization between Oracle and AWS during the 9-month migration window',
        'Zero downtime and transparent rollback at any stage'
      ],
      quantifiedNFRs: [
        {
          metric: 'Data Sync Lag',
          value: 'CDC sync lag < 1 second between Oracle on-premise and AWS DynamoDB/Aurora',
          rationale: 'Dealers operating on the legacy system and consumers browsing the cloud portal must see consistent pricing'
        },
        {
          metric: 'Dual-Run Reliability',
          value: 'Zero lost updates (RPO = 0); 100% data audit reconciliation match',
          rationale: 'Financial discrepancy between legacy and new systems blocks regulatory compliance'
        },
        {
          metric: 'Migration Rollback Time',
          value: 'Instantaneous DNS / API Gateway switch (< 30 seconds)',
          rationale: 'If unexpected data drift occurs in the cloud microservice, traffic must revert immediately'
        }
      ],
      clarifyingQuestionsToAsk: [
        'Are there stored procedures in Oracle containing critical business logic that must be re-implemented?',
        'Does the legacy database have foreign key constraints spanning across the boundaries of our target microservice?',
        'What is the existing network interconnect between the on-premise data center and AWS (e.g., AWS Direct Connect)?'
      ]
    },
    step2C4Topology: {
      overview: 'Strangler Fig Proxy + Debezium CDC + Anti-Corruption Layer (ACL) + Event-Driven AWS Services',
      components: [
        {
          name: 'Routing & Strangler Proxy',
          tech: 'AWS API Gateway + Cloudflare CDN',
          responsibility: 'Inspects incoming HTTP routes: routes migrated paths (`/api/v2/inventory/*`) to AWS; proxies unmigrated paths back to legacy on-premise monolith.'
        },
        {
          name: 'Change Data Capture (CDC) Pipeline',
          tech: 'Debezium + Apache Kafka on AWS MSK',
          responsibility: 'Taps Oracle database transaction redo logs (GoldenGate or Debezium) and streams row mutations as events without impacting database CPU.'
        },
        {
          name: 'Anti-Corruption Layer (ACL)',
          tech: 'Node.js / TypeScript on AWS ECS Fargate',
          responsibility: 'Translates legacy Oracle relational schemas and cryptic column abbreviations into modern Domain-Driven Design (DDD) aggregates.'
        },
        {
          name: 'New Cloud Microservice',
          tech: 'AWS ECS Fargate + Amazon DynamoDB + EventBridge',
          responsibility: 'Autonomously manages vehicle inventory and syndication with its own dedicated database.'
        },
        {
          name: 'Reconciliation Audit Engine',
          tech: 'AWS Glue + Amazon Athena',
          responsibility: 'Runs nightly automated checksum comparisons between Oracle tables and DynamoDB records to prove zero data drift.'
        }
      ],
      flow: [
        'Phase 1 (Shadow Run): Debezium streams Oracle changes to Kafka. ACL ingests events and populates AWS DynamoDB. Monolith still serves 100% of live traffic; cloud reads are compared asynchronously for parity.',
        'Phase 2 (Canary Cutover): Strangler proxy routes 10% of read traffic to AWS Microservice. Write traffic still goes to Oracle, replicated to AWS via CDC in < 500ms.',
        'Phase 3 (Write Migration): Reverse CDC is established (AWS DynamoDB Streams -> Kafka -> Oracle writeback). Strangler proxy shifts write traffic to AWS Microservice; updates are replicated back to Oracle for legacy reports.',
        'Phase 4 (Monolith Decommission): Legacy database foreign keys are dropped; monolith syndication code is deleted.'
      ]
    },
    step3Persistence: {
      primaryDatastore: 'AWS DynamoDB (for new Microservice) decoupled from On-Premise Oracle 19c',
      schemaStrategy: 'Break the monolithic relational schema. Carve out vehicle domain into Single-Table DynamoDB schema. Use Anti-Corruption Layer to map Oracle column flags (`VEH_STAT_CD = 4`) into domain status enums (`VehicleStatus.READY_FOR_SYNDICATION`).',
      concurrencyControl: 'Optimistic locking with version timestamps. During dual-write/CDC synchronization, the latest timestamp wins (`last-write-wins` with vector clocks) to prevent echo-loops between systems.',
      cachingStrategy: 'ElastiCache Redis deployed in AWS to shield the new microservice from repeated lookups during read verification.'
    },
    step4Resiliency: {
      failureModes: [
        {
          mode: 'CDC Replication Lag Spikes over AWS Direct Connect',
          blastRadius: 'Dealers updating vehicle in legacy portal see delayed updates on the new consumer site.',
          mitigation: 'Kafka consumer lag monitoring with CloudWatch alarms. If lag exceeds 5 seconds, Strangler proxy temporarily pauses traffic shifting.'
        },
        {
          mode: 'Replication Echo Loop (AWS writes to Oracle, which streams back to AWS)',
          blastRadius: 'Infinite event loops consuming network bandwidth and corrupting version counters.',
          mitigation: 'Inject origin metadata tags (`origin: aws-microservice`). The CDC consumer ignores any event bearing its own origin tag.'
        },
        {
          mode: 'Data Parity Discrepancy discovered during audit',
          blastRadius: 'Inconsistent vehicle pricing displayed to buyers.',
          mitigation: 'Automated Athena reconciliation job flags mismatched records immediately and generates compensating repair events.'
        }
      ],
      defenseTradeOff: 'We accept the temporary operational complexity of running Kafka CDC and dual-run synchronization for several months in exchange for zero downtime, zero business disruption, and the ability to instantly roll back traffic via API Gateway without touching on-premise infrastructure.'
    }
  },
  {
    id: 'case-3-realtime-telemetry',
    title: 'Case 3: Real-Time Telemetry & Price Alert Notification Hub',
    subtitle: 'WebSockets, fanout to millions of subscriber devices, deduplication, and at-least-once delivery',
    category: 'Real-Time Streaming / Event-Driven',
    brief: 'Cox Automotive operates a consumer price alert system: 5 million active vehicle buyers configure price-drop alerts and auction bids across 50,000 dealerships. When a dealer slashes a price or an auction bid changes, matched buyers must receive push notifications, SMS, and live in-app WebSocket updates within 3 seconds. The system must handle 50,000 incoming price changes per minute with extreme fanout efficiency and zero duplicate notifications.',
    step1Clarification: {
      functionalRequirements: [
        'Consumers can subscribe to price-drop alerts on specific vehicles or saved search filters (e.g., "Any Ford F-150 under $35,000 within 50 miles")',
        'System matches incoming dealer price drops against millions of consumer subscription criteria in real time',
        'Delivers notifications via WebSockets (active web sessions), mobile push (APNs/FCM), and SMS (Twilio/AWS SNS)',
        'Deduplicates notifications: a buyer must never receive more than one notification for the same price change within a 24-hour window'
      ],
      quantifiedNFRs: [
        {
          metric: 'End-to-End Delivery Latency',
          value: 'P99 Latency < 3 seconds from dealer price change to consumer notification delivery',
          rationale: 'In competitive vehicle auctions and hot deals, notifications must arrive before competing buyers buy the car'
        },
        {
          metric: 'Fanout Throughput',
          value: 'Handle 50,000 price changes/min fanning out to up to 2 million push notifications/hour',
          rationale: 'Popular price drops on mainstream vehicles trigger thousands of subscriber alerts per single event'
        },
        {
          metric: 'Deduplication Rate',
          value: 'Zero duplicate alerts (< 0.001% tolerance over 24 hours)',
          rationale: 'Spamming buyers with duplicate push notifications damages retention and increases SMS egress costs'
        }
      ],
      clarifyingQuestionsToAsk: [
        'Are alerts strictly 1-to-1 (saved VIN) or complex multi-dimensional search predicates (faceted search subscriptions)?',
        'What rate-limiting or quiet-hours policy should apply to prevent sending SMS notifications at 3:00 AM?',
        'Do we need guaranteed in-order delivery of price adjustments or only the latest current price?'
      ]
    },
    step2C4Topology: {
      overview: 'EventBridge / Kafka Ingestion + Percolator Reverse-Search Matching + Distributed WebSocket Gateway + Fanout Worker Fleet',
      components: [
        {
          name: 'Event Ingestion Fabric',
          tech: 'AWS EventBridge + Amazon Kinesis Data Streams',
          responsibility: 'Ingests price modification events, partitions them by VIN hash, and buffers high-volume stream bursts.'
        },
        {
          name: 'Reverse Match Engine (Percolator)',
          tech: 'Amazon OpenSearch (Elasticsearch Percolator Query)',
          responsibility: 'Stores millions of registered buyer search queries and evaluates incoming vehicle documents against all stored queries in single-digit milliseconds.'
        },
        {
          name: 'Deduplication & Rate-Limiter Store',
          tech: 'Amazon ElastiCache Redis Cluster',
          responsibility: 'Enforces sliding-window deduplication keys (`alert:<userId>:<vin>:<price>`) with 24-hour TTLs.'
        },
        {
          name: 'WebSocket Connection Manager',
          tech: 'AWS API Gateway WebSocket API + DynamoDB Session Table',
          responsibility: 'Maintains persistent WebSocket connections for active web users; tracks `connectionId` mapped to `userId`.'
        },
        {
          name: 'Multi-Channel Dispatch Fleet',
          tech: 'AWS Lambda + Amazon SQS FIFO + Amazon SNS / Pinpoint',
          responsibility: 'Fans out notifications to APNs (iOS), FCM (Android), WebSockets, and SMS via throttled worker queues.'
        }
      ],
      flow: [
        '1. Price change event arrives on Kinesis (`vin: 123, new_price: $29,000, dealer: 456`).',
        '2. Match Worker sends vehicle document to OpenSearch Percolator, which returns 850 matching subscriber user IDs.',
        '3. Worker checks Redis for each subscriber: executes atomic `SETNX alert:<userId>:<vin> 1 EX 86400`. If key exists, alert is suppressed.',
        '4. For novel alerts, worker inspects subscriber delivery preference: if user has active WebSocket in DynamoDB session table, sends instant WebSocket frame via API Gateway.',
        '5. Simultaneously publishes push payload to SQS queue; batch Lambdas dispatch to Apple APNs and Google FCM in parallel.',
        '6. Delivery receipts are written to DynamoDB for audit analytics.'
      ]
    },
    step3Persistence: {
      primaryDatastore: 'OpenSearch (Percolator Index) + Redis (Deduplication Cache) + DynamoDB (Subscription & Session Store)',
      schemaStrategy: 'OpenSearch stores inverted queries as documents. DynamoDB stores: PK `USER#<userId>`, SK `SUB#<subscriptionId>`. WebSocket table: PK `CONNECTION#<connectionId>` with TTL for disconnected sockets.',
      concurrencyControl: 'Redis `SETNX` (Set if Not Exists) atomic operations guarantee that even if multiple workers process concurrent price drops, exactly one notification per user/vehicle pair is emitted.',
      cachingStrategy: 'User preference profiles cached in Redis to eliminate DynamoDB lookups during high-fanout broadcast spikes.'
    },
    step4Resiliency: {
      failureModes: [
        {
          mode: 'Apple Push Notification Service (APNs) Throttling',
          blastRadius: 'Backlog of pending iOS push notifications growing rapidly in the worker fleet.',
          mitigation: 'SQS queue with rate-limited exponential backoff; separate worker pools for APNs vs FCM vs WebSockets so APNs throttling never delays Android or web notifications.'
        },
        {
          mode: 'Stale WebSocket Connections in DynamoDB after client sudden disconnect',
          blastRadius: 'Failed API Gateway push calls wasting compute on dead socket connections.',
          mitigation: 'API Gateway `$disconnect` route automatically deletes DynamoDB session record; push workers treat `410 Gone` responses by purging the session key immediately.'
        },
        {
          mode: 'Celebrity Dealer Price Drop triggering 50,000 notifications simultaneously',
          blastRadius: 'Worker CPU exhaustion and SMS billing spikes.',
          mitigation: 'SQS queue-based load leveling buffers the 50,000 messages and drains them at a controlled rate of 500 dispatches/sec.'
        }
      ],
      defenseTradeOff: 'We prioritize delivery speed and deduplication over guaranteed delivery order. In rapid auction bidding, a notification announcing the final $25,000 price is far more valuable than replaying intermediate $27,000 bids. Redis atomic `SETNX` ensures zero duplicates while percolator queries allow sub-second matching across millions of stored queries.'
    }
  },
  {
    id: 'case-4-enterprise-rag-assistant',
    title: 'Case 4: Enterprise Internal Knowledge Assistant (RAG Pipeline)',
    subtitle: 'Document ingestion, chunking & embeddings, Vector DB, RAG pipeline, RBAC, and hallucination guardrails',
    category: 'GenAI / Enterprise Search',
    brief: 'Cox Automotive employs 20,000 personnel across corporate, dealer operations, and legal. They possess 2 million internal documents (PDFs, dealer contracts, franchise laws, HR policies, Jira tickets) across SharePoint, Confluence, and S3. Build an enterprise AI knowledge assistant that answers complex policy and contractual questions with verbatim citations, enforces strict Role-Based Access Control (RBAC) so employees only query documents they are authorized to see, and guarantees sub-3 second response times with zero PII leakage.',
    step1Clarification: {
      functionalRequirements: [
        'Ingest, parse, and embed 2 million documents across multiple formats (PDF, DOCX, Markdown, HTML)',
        'Natural language semantic search and generative conversational synthesis with verbatim source citations',
        'Strict document-level and chunk-level RBAC filtering based on Active Directory / Okta user groups',
        'Guardrails against hallucination, prompt injection, and PII/financial data exfiltration'
      ],
      quantifiedNFRs: [
        {
          metric: 'End-to-End Query Latency',
          value: 'P99 Latency < 3.5 seconds (including semantic search + LLM streaming token generation)',
          rationale: 'Interactive chat experience demands streaming first-token generation within 800ms'
        },
        {
          metric: 'Document Ingestion Throughput',
          value: '500,000 documents indexed per 24 hours during initial crawl; sub-5 minute sync for new updates',
          rationale: 'Frequent updates to franchise legal policies require rapid indexing into the vector store'
        },
        {
          metric: 'Security & Access Control',
          value: '100% RBAC enforcement; Zero authorization bypass in vector retrieval',
          rationale: 'A junior employee must never receive confidential executive compensation or M&A information'
        },
        {
          metric: 'Groundedness & Accuracy',
          value: 'Faithfulness score > 95% on RAG triad metrics (Context Relevance, Groundedness, Answer Relevance)',
          rationale: 'Contractual and franchise decisions rely on verifiable, legally accurate citations'
        }
      ],
      clarifyingQuestionsToAsk: [
        'Are document permissions inherited hierarchically from Active Directory groups, and how often do user group memberships change?',
        'Can we use managed foundational LLM APIs (e.g., AWS Bedrock Claude 3.5 / Titan) or is self-hosted on-premise inference mandatory?',
        'What is the average document length and do documents contain complex tabular financial data or scanned OCR images?'
      ]
    },
    step2C4Topology: {
      overview: 'Asynchronous Ingestion Worker + Vector Database with Metadata Filtering + Guardrail Gateway + Bedrock LLM Orchestrator',
      components: [
        {
          name: 'Document Ingestion & OCR Pipeline',
          tech: 'AWS S3 + AWS Textract + Node.js Chunking Service (ECS)',
          responsibility: 'Extracts clean text and tables from PDFs, cleans formatting, and generates semantically coherent chunks (512 tokens with 10% overlap).'
        },
        {
          name: 'Embedding & Vector Datastore',
          tech: 'Amazon Bedrock (Titan Embeddings v2) + OpenSearch Serverless (Vector Engine / pgvector)',
          responsibility: 'Generates 1536-dimensional vector embeddings and performs HNSW approximate nearest neighbor search with pre-filtering on security ACL tags.'
        },
        {
          name: 'Security & RBAC Enforcement Filter',
          tech: 'Okta OAuth2 / OIDC + AWS Lambda Authorizer',
          responsibility: 'Extracts user group claims (`legal_team`, `dealer_ops_southeast`) and injects them as mandatory SQL/Vector metadata filters into every query.'
        },
        {
          name: 'RAG Orchestrator & Guardrail Service',
          tech: 'LangChain / LlamaIndex on AWS ECS Fargate + AWS Bedrock Guardrails',
          responsibility: 'Applies prompt injection filters, retrieves top-k relevant chunks, formats system context with citation instructions, and streams responses to the client.'
        },
        {
          name: 'Semantic Cache & Feedback Store',
          tech: 'Amazon ElastiCache Redis + Amazon DynamoDB',
          responsibility: 'Caches frequent generic policy questions (e.g., "Holiday schedule 2026") and logs user feedback for evaluation loops.'
        }
      ],
      flow: [
        'Ingestion Flow: Document uploaded to S3 -> S3 Event triggers Textract -> Chunking worker splits text -> Bedrock generates embeddings -> Vector DB indexes embeddings with ACL metadata (`permitted_groups: ["legal", "exec"]`).',
        'Query Flow: 1. User submits query in chat UI. 2. API Gateway validates Okta JWT and extracts user group claims. 3. Input passes Bedrock Guardrail (checks for jailbreak attempts & PII).',
        '4. Bedrock converts query to vector. 5. OpenSearch executes HNSW vector search WITH filter (`permitted_groups IN user_groups`). Top 5 chunks retrieved.',
        '6. Orchestrator constructs prompt: [System: Answer only based on Context. Cite [Doc, Page]]. 7. Claude 3.5 streams tokens back to user via SSE (Server-Sent Events) in < 800ms.',
        '8. Hallucination check verifies citations against retrieved text before closing stream.'
      ]
    },
    step3Persistence: {
      primaryDatastore: 'OpenSearch Serverless Vector Engine (or Aurora PostgreSQL with pgvector) + S3 Document Storage',
      schemaStrategy: 'Vector store schema includes: `chunk_id`, `document_id`, `text_content`, `embedding_vector`, `acl_groups` (array of strings), `page_number`, `source_url`.',
      concurrencyControl: 'Stateless read pipeline with optimistic concurrency on document updates: documents are versioned in S3 with automated tombstoning of deprecated vectors.',
      cachingStrategy: 'Semantic Caching in Redis: if an incoming query has > 0.96 cosine similarity to a recently answered query with identical user ACL groups, the cached answer is returned in < 50ms.'
    },
    step4Resiliency: {
      failureModes: [
        {
          mode: 'Vector Search RBAC Leakage (Security Breach)',
          blastRadius: 'Unauthorized employee views executive acquisition documents.',
          mitigation: 'Enforce pre-filtering at the database query level (`filter: { terms: { permitted_groups: userGroups } }`) rather than post-filtering in application code, ensuring unauthorized chunks are never loaded into memory.'
        },
        {
          mode: 'LLM Hallucination on Contractual Terms',
          blastRadius: 'Legal or financial liability resulting from false policy advice.',
          mitigation: 'Implement RAG Triad verification: Groundedness check ensures every sentence in the response has a matching citation in the retrieved context. If groundedness < 90%, system outputs: "I cannot verify this policy in the official documentation."'
        },
        {
          mode: 'AWS Bedrock Rate Limiting (HTTP 429)',
          blastRadius: 'User queries failing during peak company working hours.',
          mitigation: 'Multi-model fallback routing: if Bedrock Claude 3.5 Sonnet throttles, the orchestrator automatically falls back to Claude 3.5 Haiku or Amazon Titan with exponential backoff.'
        }
      ],
      defenseTradeOff: 'We strictly mandate Vector Pre-Filtering over Post-Filtering: Even though pre-filtering slightly reduces pure vector recall efficiency by restricting the search space before HNSW navigation, it provides mathematical certainty against security authorization leaks, which is an absolute enterprise requirement.'
    }
  }
];
