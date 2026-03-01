
export interface Feedback {
  id: string;
  message: string;
  imageUrl?: string;
  isAnonymous: boolean;
  username?: string;
  createdAt: Date;
  aiCategories?: string[];
}
