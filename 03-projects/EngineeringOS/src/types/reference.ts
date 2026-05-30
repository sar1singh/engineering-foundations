export type ReferenceLink = {
  id: string;
  title: string;
  url: string;
  sourceType: "docs" | "youtube" | "article" | "github" | "leetcode" | "course" | "book" | "blog";
  topicIds: string[];
  priority: "primary" | "secondary" | "optional";
};
