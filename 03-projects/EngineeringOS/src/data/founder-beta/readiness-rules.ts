import type { OfferReadinessSignal, ReadinessRule } from "@/types/founder-beta";

export const topicReadinessWeights = {
  knowledge: 0.2,
  practice: 0.25,
  interview: 0.25,
  implementation: 0.3
} as const;

export const proofScoreLabels = {
  0: "Not Attempted",
  1: "Attempted",
  2: "Partial",
  3: "Acceptable",
  4: "Strong",
  5: "Interview Ready"
} as const;

export const founderBetaReadinessRules: ReadinessRule[] = [
  {
    id: "rule-architect-readiness",
    label: "Architect Readiness",
    threshold: 75,
    appliesTo: "role",
    description: "Solution Architect applications are not recommended below this score."
  },
  {
    id: "rule-aws-readiness",
    label: "AWS Readiness",
    threshold: 70,
    appliesTo: "capability",
    description: "AWS design and tradeoff readiness must clear this gate for Architect readiness."
  },
  {
    id: "rule-behavioral-readiness",
    label: "Behavioral Readiness",
    threshold: 70,
    appliesTo: "interview",
    description: "Founder must have credible senior-level stories with follow-up readiness."
  },
  {
    id: "rule-communication-readiness",
    label: "Communication Readiness",
    threshold: 70,
    appliesTo: "interview",
    description: "Architect readiness requires concise tradeoff and stakeholder communication."
  },
  {
    id: "rule-resume-readiness",
    label: "Resume Readiness",
    threshold: 80,
    appliesTo: "offer",
    description: "Resume must clearly position the founder for Solution Architect / Lead Backend outcomes."
  },
  {
    id: "rule-architecture-case-studies",
    label: "Architecture Case Studies",
    threshold: 3,
    appliesTo: "offer",
    description: "At least 3 completed case studies are required before application recommendation."
  }
];

export const founderBetaOfferReadinessSignals: OfferReadinessSignal[] = [
  {
    id: "signal-resume-readiness",
    label: "Resume Readiness",
    readinessArea: "resume",
    threshold: 80,
    status: "in-progress",
    notes: "Resume should show architect positioning, senior scope, and measurable impact."
  },
  {
    id: "signal-behavioral-readiness",
    label: "Behavioral Readiness",
    readinessArea: "behavioral",
    threshold: 70,
    status: "in-progress",
    notes: "Requires interview-ready ownership, conflict, incident, and leadership stories."
  },
  {
    id: "signal-interview-readiness",
    label: "Interview Readiness",
    readinessArea: "interview",
    threshold: 75,
    status: "blocked",
    notes: "Depends on HLD, AWS, behavioral, communication, and senior backend interview readiness."
  },
  {
    id: "signal-case-study-readiness",
    label: "Architecture Case Study Readiness",
    readinessArea: "case-studies",
    threshold: 3,
    status: "blocked",
    notes: "Initial required case studies: EngineeringOS, Agent-OS, and Large Scale Learning Platform."
  },
  {
    id: "signal-referral-readiness",
    label: "Referral Outreach",
    readinessArea: "referrals",
    status: "not-started",
    notes: "Referral outreach may start before gates, but is tracked separately from Offer Readiness."
  },
  {
    id: "signal-compensation-readiness",
    label: "Compensation Readiness",
    readinessArea: "compensation",
    status: "in-progress",
    notes: "Floor: 60 LPA. Target: 70-80 LPA. Stretch: 90+ LPA."
  }
];
