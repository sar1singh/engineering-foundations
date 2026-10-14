export type SkillLevel = 'Novice' | 'Intermediate' | 'Advanced' | 'NAT B2';

export type SkillDomain = 
  | 'AI' 
  | 'Business' 
  | 'Solution Arch' 
  | 'SDLC Processes' 
  | 'Application Arch' 
  | 'Cloud' 
  | 'Leadership & Soft';

export interface ImplementationStep {
  step: number;
  title: string;
  description: string;
  codeOrConfigPattern?: string;
}

export interface ExternalResourceLink {
  title: string;
  url: string;
  provider: 'AWS Architecture' | 'Martin Fowler' | 'EPAM Systems' | 'RFC / Standard' | 'Microsoft Learn' | 'OWASP' | 'Distributed Systems / DDIA';
  description: string;
}

export interface TopicItem {
  id: string;
  title: string;
  keyConcepts: string[];
  externalLinks?: ExternalResourceLink[];
}

export interface LearningRoadmap {
  coreTheory: string[];
  topicsToCover?: TopicItem[];
  externalLinks?: ExternalResourceLink[];
  recommendedReading: string[];
  implementationMilestones: ImplementationStep[];
  proofArtifact: string;
}

export interface EvaluationCriterion {
  criterion: string;
  weight: string;
  targetStandard: string;
}

export interface InterviewExercise {
  scenarioTitle: string;
  businessContext: string;
  architecturalProblem: string;
  technicalConstraints: string[];
  taskQuestions: string[];
  evaluationRubric: EvaluationCriterion[];
  modelSolution: {
    executiveSummary: string;
    technicalApproach: string;
    tradeoffDefense: string;
    diagramOrPattern: string;
  };
}

export interface CompetencyItem {
  id: string;
  domain: SkillDomain;
  title: string;
  targetBar: SkillLevel;
  visualBox: 1 | 2 | 3 | 4; // 1 = Novice, 2 = Intermediate, 3 = Advanced, 4 = Expert
  analogy: string;
  gainVsSacrifice: string;
  defenseScript30s: string;
  pitfalls: string[];
  keyQuestions: string[];
  learningRoadmap: LearningRoadmap;
  interviewExercise: InterviewExercise;
}

export type MasteryStatus = 'unmastered' | 'learning' | 'mastered';

export interface FlashcardItem {
  id: string;
  concept: string;
  category: 'Consistency & Transactions' | 'Resiliency & Patterns' | 'Storage & Caching' | 'Messaging & Events' | 'Security & Topology';
  analogy: string;
  gainVsSacrifice: string;
  defenseScript30s: string;
  antiPattern: string;
  realWorldScenario: string;
}

export interface NFRMetric {
  category: string;
  requirement: string;
  targetMetric: string;
  verificationMethod: string;
  failureMitigation: string;
}

export interface C4ContainerItem {
  name: string;
  technology: string;
  role: string;
  scalingStrategy: string;
}

export interface ADRItem {
  id: string;
  title: string;
  status: 'Accepted' | 'Proposed' | 'Deprecated';
  context: string;
  decision: string;
  consequencesGain: string[];
  consequencesSacrifice: string[];
  rejectionRationale: string;
}

export interface CommitteeQuestion {
  id: string;
  interrogator: string;
  question: string;
  focusArea: string;
  weakAnswer: string;
  strongAnswer: string;
  evaluationCriteria: string[];
}

export interface SADArtifact {
  title: string;
  projectContext: string;
  businessScope: string;
  scaleDrivers: string;
  nfrs: NFRMetric[];
  c4Topology: {
    description: string;
    flowNarrative: string;
    containers: C4ContainerItem[];
  };
  adrs: ADRItem[];
  crossExaminations: CommitteeQuestion[];
}

export interface HLDScenario {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  brief: string;
  step1Clarification: {
    functionalRequirements: string[];
    quantifiedNFRs: {
      metric: string;
      value: string;
      rationale: string;
    }[];
    clarifyingQuestionsToAsk: string[];
  };
  step2C4Topology: {
    overview: string;
    components: {
      name: string;
      tech: string;
      responsibility: string;
    }[];
    flow: string[];
  };
  step3Persistence: {
    primaryDatastore: string;
    schemaStrategy: string;
    concurrencyControl: string;
    cachingStrategy: string;
  };
  step4Resiliency: {
    failureModes: {
      mode: string;
      blastRadius: string;
      mitigation: string;
    }[];
    defenseTradeOff: string;
  };
}

export interface PanelMessage {
  id: string;
  sender: 'Dmitry (Chair)' | 'Elena (Cloud Lead)' | 'Marcus (Gov & Arch)' | 'Candidate' | 'System';
  avatarColor: string;
  text: string;
  timestamp: string;
  grade?: {
    score: 1 | 2 | 3 | 4;
    label: 'Unsatisfactory' | 'Marginal' | 'B1 Solid Pass' | 'B2 Distinction';
    feedback: string;
    checklist: { item: string; passed: boolean }[];
  };
}
