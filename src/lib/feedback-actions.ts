
'use server';

import { addFeedbackItem, getFeedbackItems } from './feedback-store';
import { Feedback, FeedbackCategory } from './types';
import { adminFeedbackSummarizationAndCategorization } from '@/ai/flows/admin-feedback-summarization-categorization';

export async function submitFeedbackAction(formData: {
  message: string;
  isAnonymous: boolean;
  username?: string;
  imageUrl?: string;
}) {
  const id = Math.random().toString(36).substring(7);
  
  // Call AI Flow for summarization and categorization
  let aiSummary = '';
  let aiCategories: FeedbackCategory[] = [];
  
  try {
    const aiResult = await adminFeedbackSummarizationAndCategorization({
      feedbackMessage: formData.message
    });
    aiSummary = aiResult.summary;
    aiCategories = aiResult.categories as FeedbackCategory[];
  } catch (error) {
    console.error('AI Processing Error:', error);
  }

  const newFeedback: Feedback = {
    id,
    message: formData.message,
    isAnonymous: formData.isAnonymous,
    username: formData.username,
    imageUrl: formData.imageUrl,
    createdAt: new Date(),
    aiSummary,
    aiCategories
  };

  await addFeedbackItem(newFeedback);
  return { success: true };
}

export async function getAllFeedbackAction() {
  return await getFeedbackItems();
}
