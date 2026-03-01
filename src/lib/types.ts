
export type FeedbackCategory = 'bug' | 'feature request' | 'general inquiry';

export interface Feedback {
  id: string;
  message: string;
  imageUrl?: string;
  isAnonymous: boolean;
  username?: string;
  createdAt: Date;
  aiSummary?: string;
  aiCategories?: FeedbackCategory[];
}
