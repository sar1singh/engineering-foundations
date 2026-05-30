export type Category = {
  id: string;
  domainId: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  moduleIds: string[];
};

export type LearningModule = {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  topicIds: string[];
};
