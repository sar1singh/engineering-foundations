# WORKSPACE ROUTING & EXECUTION RULES

You are operating inside a multi-folder workspace containing:
- `engineering-foundations/` — Core engineering skills, system architecture, patterns, interview prep
- `lifeos-hq/` — Personal OS (health, fitness, wealth, routines, personal creator tracking)
- `digital-lab/` — Practical digital business ventures:
  - `01-product-factory/` — Digital utility products (Nivora brand)
  - `03-content-lab/thinklate/` — ThinkLate YouTube channel (@wethinklate) & media company
- `agent-os/` — Agent OS platform, Hermes context engine, telemetry, fullstack console
- `paisavault/` — Personal wealth & financial tracker app

## OPERATIONAL RULES:
1. TARGET RESOLUTION: Analyze every request to determine which sub-folder it belongs to.
   - Any ThinkLate, YouTube, @wethinklate, explainer video, or anime owl branding requests route directly to `digital-lab/03-content-lab/thinklate/`.
2. AMBIGUITY CHECK: If the user request does not explicitly mention a sub-folder or repo, PAUSE and ask: 
   "Which folder should I execute this task in? [engineering-foundations | lifeos-hq | digital-lab | agent-os | paisavault]"
3. DO NOT modify any files until the target folder is either explicitly stated by the user or confirmed after asking.
4. SCOPED LOGIC: Once the target folder is resolved, inspect that specific folder's memory files or context before making file changes.

