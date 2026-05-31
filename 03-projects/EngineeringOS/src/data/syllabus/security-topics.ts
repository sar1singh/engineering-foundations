import type { SyllabusPracticeProblem, SyllabusTopic } from "@/types/syllabus";

const securityReferences = [
  { id: "reference-security-owasp-top-10", title: "OWASP Top 10", url: "https://owasp.org/Top10/2021/", sourceType: "docs" as const, usage: "Baseline web application security risks: access control, crypto failures, injection, insecure design, auth failures, logging, SSRF, and more." },
  { id: "reference-security-owasp-cheat-sheets", title: "OWASP Cheat Sheet Series", url: "https://cheatsheetseries.owasp.org/", sourceType: "docs" as const, usage: "Practical implementation guidance for authentication, sessions, JWT, CSRF, XSS, SSRF, secrets, and secure design." },
  { id: "reference-security-roadmap", title: "roadmap.sh Cyber Security Roadmap", url: "https://roadmap.sh/cyber-security", sourceType: "roadmap" as const, usage: "Guided security learning path used to keep the track broad enough for interviews and architecture reviews." },
  { id: "reference-security-aws-well-architected", title: "AWS Well-Architected Security Pillar", url: "https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html", sourceType: "docs" as const, usage: "AWS-first security architecture lens for identity, detection, infrastructure protection, data protection, and incident response." }
];

function securityProblems(slug: string, title: string): SyllabusPracticeProblem[] {
  return [
    {
      id: `problem-security-${slug}-easy`,
      title: `${title} threat note`,
      difficulty: "easy",
      tags: ["security", slug, "threat-modeling"],
      prompt: `Explain ${title}, name one attack scenario, and write the smallest mitigation checklist.`,
      expectedSignals: ["Clear risk", "Attack scenario", "Mitigation checklist"]
    },
    {
      id: `problem-security-${slug}-medium`,
      title: `${title} secure design review`,
      difficulty: "medium",
      tags: ["security", slug, "design-review"],
      prompt: `Review a backend API or HLD for ${title}. Include trust boundaries, data exposure, abuse cases, and monitoring.`,
      expectedSignals: ["Trust boundaries", "Abuse cases", "Monitoring signal"]
    },
    {
      id: `problem-security-${slug}-hard`,
      title: `${title} incident response`,
      difficulty: "hard",
      tags: ["security", slug, "incident"],
      prompt: `A production issue may involve ${title}. Write triage steps, containment, evidence to preserve, customer impact, and long-term prevention.`,
      expectedSignals: ["Containment", "Evidence", "Customer impact", "Prevention"]
    }
  ];
}

function securityTopic(input: {
  order: number;
  slug: string;
  title: string;
  definition: string;
  mentalModel: string;
  theory: string;
  example: string;
  interviewQuestions: string[];
  commonMistakes: string[];
  productionUseCases: string[];
}): SyllabusTopic {
  return {
    id: `syllabus-security-${input.slug}`,
    slug: input.slug,
    title: input.title,
    order: input.order,
    sourcePath: "00-control/master-roadmap/10-security/INDEX.md",
    definition: input.definition,
    whyItMatters: `${input.title} is required for Senior Backend, AWS Solution Architect, Staff, and EM readiness because security failures become business, legal, and trust failures.`,
    mentalModel: input.mentalModel,
    theory: `${input.theory}\n\nSecurity review model: asset -> actor -> trust boundary -> abuse case -> control -> detection -> response.`,
    codeExamples: [
      {
        id: `example-security-${input.slug}`,
        title: `${input.title} design checklist`,
        language: "text",
        code: input.example,
        explanation: `Review checklist for ${input.title}.`,
        runnable: false
      }
    ],
    practiceProblems: securityProblems(input.slug, input.title),
    interviewQuestions: input.interviewQuestions,
    commonMistakes: input.commonMistakes,
    productionUseCases: input.productionUseCases,
    revisionPrompts: [`Explain ${input.title} using an OWASP risk.`, `Name one AWS control for ${input.title}.`, `Write one monitoring signal for ${input.title}.`],
    reviewPrompts: [
      {
        id: `review-security-${input.slug}`,
        reviewerRole: "mentor",
        prompt: `Review ${input.title} like a security architecture interview answer.`,
        rubric: ["Threat is concrete", "Control maps to risk", "Detection is measurable", "Trade-off is named"]
      }
    ],
    references: [...securityReferences, { id: `reference-security-${input.slug}-roadmap`, title: "EngineeringOS Security master roadmap", url: "00-control/master-roadmap/10-security/INDEX.md", sourceType: "roadmap", usage: "Local source path for first-class security coverage." }],
    progressSignals: ["read_definition", "read_theory", "studied_code_example", "ran_code_example", "solved_easy_problem", "solved_medium_problem", "solved_hard_problem", "submitted_explain_back", "completed_mock_review", "scheduled_revision"]
  };
}

export const securityFoundationTopics: SyllabusTopic[] = [
  securityTopic({
    order: 1,
    slug: "security-threat-modeling",
    title: "Threat Modeling",
    definition: "Threat modeling identifies assets, actors, trust boundaries, abuse cases, controls, and residual risks before a system is built or changed.",
    mentalModel: "Think like an attacker, then design like an owner with clear controls and detection.",
    theory: "Start with what must be protected, who can touch it, and where trust changes. For interviews, use STRIDE-style thinking without getting trapped in acronyms. A strong answer names data, identity, network, dependency, and operational risks.",
    example: "Asset: payment token\nActors: user, admin, payment provider, attacker\nTrust boundaries: browser/API/provider webhook\nAbuse cases: replay, tampering, stolen token\nControls: idempotency, signature verification, least privilege\nDetection: failed signature rate, unusual refund volume",
    interviewQuestions: ["How do you threat model a payment API?", "What is a trust boundary?", "How do you explain residual risk to product leadership?"],
    commonMistakes: ["Starting with tools instead of assets", "No abuse cases", "No detection", "Treating threat modeling as a one-time ceremony"],
    productionUseCases: ["Architecture reviews", "Payment and booking HLD", "Security sign-off", "Incident prevention"]
  }),
  securityTopic({
    order: 2,
    slug: "oauth-oidc-jwt",
    title: "OAuth OIDC and JWT",
    definition: "OAuth delegates authorization, OIDC adds identity on top of OAuth, and JWT is a signed token format often used to carry claims.",
    mentalModel: "OAuth answers what an app can access; OIDC answers who the user is; JWT carries signed claims.",
    theory: "Know authorization code flow, PKCE, access tokens, refresh tokens, ID tokens, claims, expiry, audience, issuer, and key rotation. Senior answers distinguish authentication from authorization and avoid storing sensitive data in tokens.",
    example: "Login flow:\n1. Browser redirects to identity provider\n2. App receives authorization code\n3. Backend exchanges code for tokens\n4. Backend validates issuer, audience, signature, expiry\n5. API authorizes by scopes/roles, not by trusting UI state",
    interviewQuestions: ["OAuth vs OIDC?", "What must be validated in a JWT?", "Where should refresh tokens live?", "How does PKCE reduce risk?"],
    commonMistakes: ["Putting secrets in JWT payload", "Not validating issuer/audience", "Long-lived access tokens", "Confusing authentication and authorization"],
    productionUseCases: ["SSO", "API authorization", "Mobile/web login", "Partner integrations"]
  }),
  securityTopic({
    order: 3,
    slug: "sessions-csrf-xss",
    title: "Sessions CSRF and XSS",
    definition: "Session security protects authenticated browser state, CSRF prevents unwanted authenticated actions, and XSS prevents attacker-controlled script execution.",
    mentalModel: "The browser is helpful but dangerous: cookies, origins, forms, and scripts must be constrained.",
    theory: "Understand SameSite cookies, HttpOnly, Secure, CSRF tokens, origin checks, output encoding, content security policy, and sanitization. Interviews often ask how session-cookie auth differs from bearer-token auth.",
    example: "Controls:\n- HttpOnly Secure SameSite cookies\n- CSRF token or strict SameSite for state-changing requests\n- Escape output by context\n- Content Security Policy for blast-radius reduction\n- Never trust client-side authorization checks",
    interviewQuestions: ["How does CSRF work?", "How does XSS steal data or perform actions?", "SameSite Lax vs Strict?", "Cookie session vs bearer token trade-offs?"],
    commonMistakes: ["Relying only on CORS for CSRF", "Storing tokens in localStorage without risk discussion", "No output encoding", "No cookie flags"],
    productionUseCases: ["Web apps", "Admin portals", "B2B SaaS dashboards", "Internal tools"]
  }),
  securityTopic({
    order: 4,
    slug: "ssrf-secrets-injection",
    title: "SSRF Secrets and Injection",
    definition: "SSRF abuses server-side network access, secrets management protects credentials, and injection exploits unsafe command/query/template construction.",
    mentalModel: "Never let user input become network destinations, executable syntax, or secret exposure.",
    theory: "Senior backend security requires allowlists, parameterized queries, egress controls, metadata-service protection, secret rotation, KMS/Secrets Manager, and safe logging. SSRF matters deeply in cloud environments because metadata endpoints can expose credentials.",
    example: "Secure fetch rule:\n- Validate URL against allowlisted hosts\n- Block private/link-local IP ranges\n- Use short timeouts and size limits\n- Do not forward credentials\n- Log destination safely\n- Store secrets in Secrets Manager/KMS, not env dumps or logs",
    interviewQuestions: ["Why is SSRF dangerous in AWS?", "How do parameterized queries prevent injection?", "How do you rotate leaked secrets?", "What should never appear in logs?"],
    commonMistakes: ["Regex-only URL validation", "Logging secrets", "String-built SQL", "No egress boundary", "Ignoring cloud metadata endpoints"],
    productionUseCases: ["Webhook fetchers", "Image uploaders", "Payment integrations", "Internal admin APIs"]
  })
];
