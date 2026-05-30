export type ProblemStatement = {
  id: string;
  title: string;
  slug: string;
  source: "internal" | "leetcode" | "hackerrank" | "codechef" | "external";
  externalUrl?: string;
  difficulty: "easy" | "medium" | "hard";
  topicIds: string[];
  statement: string;
  examples: ProblemExample[];
  constraints: string[];
  expectedOutput?: string;
  testCases: TestCase[];
};

export type ProblemExample = {
  input: string;
  output: string;
  explanation: string;
};

export type TestCase = {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
};
