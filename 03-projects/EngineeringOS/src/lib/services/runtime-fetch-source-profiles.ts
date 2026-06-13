// Update runtime-fetch-source-profiles.ts
export const SourceFamilyProfile = {
  'system-design-primer': {
    sourceFamily: 'system-design-primer',
    allowedExpansionPaths: ['system-design-primer/README.md'],
    blockedExpansionPaths: ['system-design-primer/docs', 'system-design-primer/assets'],
    explicitDocumentUrls: [
      'https://raw.githubusercontent.com/donnemartin/system-design-primer/master/README.md',
      'https://raw.githubusercontent.com/ashishps1/awesome-system-design-resources/master/README.md'
    ],
    maxDocumentsPerSession: 50,
    educationalCategory: 'system-design',
    trustLevel: 'high'
  },
  // Other profiles...
};
