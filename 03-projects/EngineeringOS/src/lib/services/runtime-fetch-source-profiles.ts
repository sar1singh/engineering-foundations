export interface SourceProfile {
  sourceFamily: string;
  allowedExpansionPaths: string[];
  blockedExpansionPaths: string[];
  explicitDocumentUrls: string[];
  maxDocumentsPerSession: number;
  educationalCategory: string;
  trustLevel: 'high' | 'medium' | 'low';
}

export const SourceFamilyProfile: Record<string, SourceProfile> = {
  'system-design-primer': {
    sourceFamily: 'system-design-primer',
    allowedExpansionPaths: ['*'],
    blockedExpansionPaths: ['*/docs', '*/assets'],
    explicitDocumentUrls: [
      'https://raw.githubusercontent.com/donnemartin/system-design-primer/master/README.md',
      'https://raw.githubusercontent.com/ashishps1/awesome-system-design-resources/master/README.md'
    ],
    maxDocumentsPerSession: 50,
    educationalCategory: 'system-design',
    trustLevel: 'high'
  },
  'computer-science': {
    sourceFamily: 'computer-science',
    allowedExpansionPaths: ['*'],
    blockedExpansionPaths: [],
    explicitDocumentUrls: [
      'https://raw.githubusercontent.com/ossu/computer-science/master/README.md'
    ],
    maxDocumentsPerSession: 50,
    educationalCategory: 'computer-science',
    trustLevel: 'high'
  },
  'roadmaps': {
    sourceFamily: 'roadmaps',
    allowedExpansionPaths: ['*'],
    blockedExpansionPaths: [],
    explicitDocumentUrls: [
      'https://roadmap.sh/backend'
    ],
    maxDocumentsPerSession: 50,
    educationalCategory: 'roadmap',
    trustLevel: 'medium'
  },
  'official-docs': {
    sourceFamily: 'official-docs',
    allowedExpansionPaths: ['*'],
    blockedExpansionPaths: [],
    explicitDocumentUrls: [
      'https://docs.aws.amazon.com/lambda/latest/dg/welcome.html',
      'https://kubernetes.io/docs/concepts/overview/',
      'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
    ],
    maxDocumentsPerSession: 50,
    educationalCategory: 'official-docs',
    trustLevel: 'high'
  },
  'coding-interview-university': {
    sourceFamily: 'coding-interview-university',
    allowedExpansionPaths: ['*'],
    blockedExpansionPaths: [],
    explicitDocumentUrls: [
      'https://raw.githubusercontent.com/jwasham/coding-interview-university/main/README.md'
    ],
    maxDocumentsPerSession: 50,
    educationalCategory: 'coding-interview',
    trustLevel: 'high'
  },
  'cs-video-courses': {
    sourceFamily: 'cs-video-courses',
    allowedExpansionPaths: ['*'],
    blockedExpansionPaths: [],
    explicitDocumentUrls: [
      'https://raw.githubusercontent.com/Developer-Y/cs-video-courses/master/README.md'
    ],
    maxDocumentsPerSession: 50,
    educationalCategory: 'computer-science',
    trustLevel: 'high'
  },
  'awesome-courses': {
    sourceFamily: 'awesome-courses',
    allowedExpansionPaths: ['*'],
    blockedExpansionPaths: [],
    explicitDocumentUrls: [
      'https://raw.githubusercontent.com/prakhar1989/awesome-courses/master/README.md'
    ],
    maxDocumentsPerSession: 50,
    educationalCategory: 'university-courses',
    trustLevel: 'high'
  }
};

export function getSourceProfile(sourceFamily: string): SourceProfile | undefined {
  return SourceFamilyProfile[sourceFamily];
}
