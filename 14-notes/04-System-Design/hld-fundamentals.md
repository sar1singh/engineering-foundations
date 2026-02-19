Intent: Moving from "How to code" to "How to architect".

## What is the difference between "Vertical" and "Horizontal" Scaling?
Vertical scaling (upgrading one machine) has a "hard ceiling." Horizontal scaling (adding more instances) provides High Availability. Principals design for horizontal scale using Load Balancers and Auto Scaling Groups

## Explain "Idempotency" in a distributed API.
An operation is idempotent if multiple identical requests have the same effect as a single request (e.g., a PUT). I implement this using Idempotency Keys (stored in Redis) to ensure duplicate network retries don't process a payment twice.