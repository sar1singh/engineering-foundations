import { designTopic } from "@/data/content/enriched-factories";

export const enrichedSystemDesignContent = [
  designTopic({
    topicSlug: "hld-url-shortener",
    title: "URL Shortener HLD",
    domain: "HLD",
    prompt: "Design a URL shortener with custom aliases, low-latency redirects, analytics, abuse controls, and AWS-first deployment.",
    sourceRefs: ["system-design-primer", "checkcheckzz-system-design-interview", "awesome-system-design-resources"],
    requirements: ["Create short links", "Redirect with low latency", "Support custom aliases", "Capture click analytics", "Block malicious destinations"],
    designBreakdown: ["Link API", "Key generator", "Redirect service", "Hot alias cache", "Analytics event stream", "Abuse scanner", "Admin takedown workflow"],
    awsVariant: ["Route 53 latency routing", "CloudFront for edge redirects where cacheable", "DynamoDB link metadata", "ElastiCache hot alias cache", "Kinesis/SQS analytics ingestion", "Lambda/ECS abuse workers"]
  }),
  designTopic({
    topicSlug: "hld-chat-system",
    title: "Chat System HLD",
    domain: "HLD",
    prompt: "Design a chat system with realtime delivery, durable history, presence, offline notification, and backpressure.",
    sourceRefs: ["system-design-primer", "checkcheckzz-system-design-interview", "awesome-system-design-resources"],
    requirements: ["Realtime messaging", "Durable conversation history", "Presence", "Offline push notifications", "Ordering per conversation", "Abuse and block controls"],
    designBreakdown: ["WebSocket gateway", "Message service", "Conversation membership service", "Message store", "Presence cache", "Fanout queue", "Notification workers"],
    awsVariant: ["API Gateway WebSocket or ALB/ECS", "DynamoDB/RDS message store", "ElastiCache presence", "SQS/SNS fanout", "Lambda/ECS notification workers", "CloudWatch connection metrics"]
  }),
  designTopic({
    topicSlug: "hld-feed-system",
    title: "Feed System HLD",
    domain: "HLD",
    prompt: "Design a personalized feed that supports posts, follows, ranking, pagination, fanout, and freshness tradeoffs.",
    sourceRefs: ["system-design-primer", "checkcheckzz-system-design-interview", "awesome-scalability"],
    requirements: ["Create posts", "Follow/unfollow users", "Read personalized feed", "Rank and paginate results", "Handle celebrity skew", "Support freshness and moderation"],
    designBreakdown: ["Post service", "Follow graph", "Fanout-on-write workers", "Fanout-on-read path for celebrities", "Feed cache", "Ranking service", "Moderation workflow"],
    awsVariant: ["ECS APIs", "DynamoDB/RDS posts and follows", "SQS fanout workers", "ElastiCache feed cache", "OpenSearch optional ranking/search", "CloudFront for media"]
  }),
  designTopic({
    topicSlug: "hld-booking-system",
    title: "Booking System HLD",
    domain: "HLD",
    prompt: "Design a booking system with search availability, inventory holds, payment, confirmation, cancellation, and oversell prevention.",
    sourceRefs: ["system-design-primer", "checkcheckzz-system-design-interview", "awesome-system-design-resources"],
    requirements: ["Search availability", "Place short-lived holds", "Prevent overselling", "Confirm after payment", "Expire abandoned holds", "Cancel and refund"],
    designBreakdown: ["Search read model", "Inventory service", "Hold table with TTL", "Booking service", "Payment workflow", "Expiration worker", "Notification service"],
    awsVariant: ["CloudFront search UI", "API Gateway + ECS services", "RDS transactional inventory", "ElastiCache hot availability", "Step Functions booking workflow", "SQS/EventBridge expiration"]
  }),
  designTopic({
    topicSlug: "hld-payment-system",
    title: "Payment System HLD",
    domain: "HLD",
    prompt: "Design a payment system with payment intents, idempotency, provider webhooks, ledger events, retries, fraud checks, and reconciliation.",
    sourceRefs: ["system-design-primer", "checkcheckzz-system-design-interview", "awesome-system-design-resources"],
    requirements: ["Create idempotent payment intents", "Never double charge", "Maintain immutable ledger events", "Verify provider webhooks", "Retry safely", "Reconcile settlements"],
    designBreakdown: ["Payment API", "Payment orchestrator", "Provider adapter", "Ledger service", "Webhook receiver", "Retry/DLQ workers", "Reconciliation jobs"],
    awsVariant: ["API Gateway + ECS/Lambda", "Step Functions payment workflow", "RDS/PostgreSQL ledger", "SQS retry/DLQ", "KMS secrets/encryption", "CloudTrail and CloudWatch audit"]
  }),
  designTopic({
    topicSlug: "hld-notification-system",
    title: "Notification System HLD",
    domain: "HLD",
    prompt: "Design a notification platform for email, SMS, push, preferences, templates, retries, provider failover, and compliance.",
    sourceRefs: ["system-design-primer", "checkcheckzz-system-design-interview", "awesome-system-design-resources"],
    requirements: ["Send multi-channel notifications", "Respect preferences", "Render templates", "Retry and dedupe", "Track delivery", "Support provider failover"],
    designBreakdown: ["Notification API", "Preference service", "Template renderer", "Channel workers", "Provider adapters", "Delivery event store", "Suppression/compliance list"],
    awsVariant: ["SNS/SES/Pinpoint where appropriate", "SQS channel queues", "Lambda/ECS workers", "DynamoDB delivery status", "EventBridge events", "CloudWatch delivery dashboards"]
  }),
  designTopic({
    topicSlug: "hld-search-autocomplete",
    title: "Search and Autocomplete HLD",
    domain: "HLD",
    prompt: "Design search and autocomplete for a product catalog with low-latency suggestions, indexing, ranking, typo tolerance, and freshness.",
    sourceRefs: ["system-design-primer", "awesome-system-design-resources", "awesome-scalability"],
    requirements: ["Index catalog changes", "Serve search queries", "Return autocomplete suggestions", "Rank results", "Handle stale indexes", "Protect from query abuse"],
    designBreakdown: ["Catalog source of truth", "Indexing pipeline", "Search API", "Autocomplete trie/index", "Ranking features", "Reindex worker", "Query analytics"],
    awsVariant: ["OpenSearch for search", "DynamoDB/RDS catalog source", "Kinesis/SQS indexing events", "ElastiCache hot suggestions", "CloudFront/API Gateway edge controls", "WAF query abuse protection"]
  }),
  designTopic({
    topicSlug: "hld-file-storage",
    title: "File Storage HLD",
    domain: "HLD",
    prompt: "Design a file storage service with upload, metadata, permissions, preview generation, sharing, versioning, and virus scanning.",
    sourceRefs: ["system-design-primer", "awesome-system-design-resources"],
    requirements: ["Upload/download files", "Store metadata", "Authorize access", "Generate previews", "Scan files", "Support versioning and sharing"],
    designBreakdown: ["Upload API", "Pre-signed URL flow", "Metadata service", "Permission service", "Preview worker", "Virus scan worker", "Version history"],
    awsVariant: ["S3 object storage", "CloudFront signed URLs", "RDS/DynamoDB metadata", "Lambda preview/scanning workers", "SQS processing queues", "KMS encryption"]
  }),
  designTopic({
    topicSlug: "hld-metrics-observability",
    title: "Metrics and Observability HLD",
    domain: "HLD",
    prompt: "Design an observability platform that ingests metrics/logs/traces, supports dashboards, alerting, retention, and tenant isolation.",
    sourceRefs: ["awesome-scalability", "system-design-primer", "awesome-system-design-resources"],
    requirements: ["Ingest high-volume telemetry", "Query dashboards", "Trigger alerts", "Control retention", "Isolate tenants", "Handle backpressure"],
    designBreakdown: ["Telemetry collectors", "Ingestion queue", "Stream processors", "Time-series store", "Log/object storage", "Query API", "Alert evaluator"],
    awsVariant: ["Kinesis/MSK ingestion", "S3 retention lake", "OpenSearch logs", "Timestream/managed TSDB", "Lambda/ECS processors", "CloudWatch integration"]
  }),
  designTopic({
    topicSlug: "hld-ecommerce-checkout",
    title: "Ecommerce Checkout HLD",
    domain: "HLD",
    prompt: "Design ecommerce checkout with cart, inventory reservation, pricing, coupons, payment, order creation, and fulfillment events.",
    sourceRefs: ["system-design-primer", "awesome-system-design-resources", "awesome-scalability"],
    requirements: ["Manage cart", "Reserve inventory", "Calculate final price", "Apply coupons", "Take payment", "Create order", "Publish fulfillment events"],
    designBreakdown: ["Cart service", "Pricing service", "Inventory reservation", "Checkout orchestrator", "Payment adapter", "Order service", "Fulfillment event pipeline"],
    awsVariant: ["API Gateway/ECS services", "RDS orders/inventory", "DynamoDB carts", "Step Functions checkout", "SQS/EventBridge events", "KMS and CloudTrail for payment-adjacent audit"]
  }),
  designTopic({
    topicSlug: "hld-ride-sharing",
    title: "Ride Sharing HLD",
    domain: "HLD",
    prompt: "Design a ride sharing platform with rider matching, driver location updates, trip lifecycle, pricing, payment, notifications, and safety controls.",
    sourceRefs: ["system-design-primer", "checkcheckzz-system-design-interview", "awesome-scalability"],
    requirements: ["Track driver locations", "Match nearby riders and drivers", "Price trips", "Manage trip states", "Process payment", "Support safety and cancellation flows"],
    designBreakdown: ["Location ingestion", "Geospatial index", "Matching service", "Trip state machine", "Pricing service", "Payment workflow", "Notification and safety service"],
    awsVariant: ["API Gateway/ECS services", "Kinesis location stream", "DynamoDB geohash partitions", "ElastiCache hot driver availability", "Step Functions trip/payment workflow", "CloudWatch safety and matching metrics"]
  }),
  designTopic({
    topicSlug: "hld-video-streaming",
    title: "Video Streaming HLD",
    domain: "HLD",
    prompt: "Design a video streaming platform with upload, transcoding, metadata, playback, CDN delivery, DRM/security, analytics, and cost-aware storage.",
    sourceRefs: ["system-design-primer", "awesome-system-design-resources", "awesome-scalability"],
    requirements: ["Upload videos", "Transcode renditions", "Store metadata", "Serve adaptive playback", "Protect premium content", "Track playback quality"],
    designBreakdown: ["Upload service", "Transcoding workflow", "Object storage", "Metadata catalog", "Playback API", "CDN distribution", "Analytics pipeline"],
    awsVariant: ["S3 video storage", "Step Functions transcoding workflow", "MediaConvert-style workers", "CloudFront distribution", "DynamoDB/RDS metadata", "Kinesis playback analytics", "KMS/signed URLs"]
  }),
  designTopic({
    topicSlug: "hld-distributed-rate-limiter",
    title: "Distributed Rate Limiter HLD",
    domain: "HLD",
    prompt: "Design a distributed rate limiter for public APIs with tenant policies, global and regional limits, low-latency decisions, abuse protection, and graceful degradation.",
    sourceRefs: ["system-design-primer", "awesome-system-design-resources", "awesome-scalability"],
    requirements: ["Apply per-tenant and per-IP policies", "Keep decision latency low", "Support bursts", "Work across multiple app instances", "Degrade safely if the store fails", "Expose audit and metrics"],
    designBreakdown: ["Policy service", "Limiter SDK/API", "Redis/token bucket store", "Regional limit workers", "Admin overrides", "Decision logs", "Abuse analytics"],
    awsVariant: ["API Gateway throttling at edge", "ECS/EKS limiter service", "ElastiCache Redis shared counters", "DynamoDB policy store", "CloudWatch blocked/allowed dashboards", "WAF for coarse abuse control"]
  })
];
