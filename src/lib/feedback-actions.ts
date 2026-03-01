
'use server';

import { addFeedbackItem, getFeedbackItems } from './feedback-store';
import { Feedback } from './types';

export async function submitFeedbackAction(formData: {
  message: string;
  isAnonymous: boolean;
  username?: string;
  imageUrl?: string;
}) {
  const id = Math.random().toString(36).substring(7);
  
  const newFeedback: Feedback = {
    id,
    message: formData.message,
    isAnonymous: formData.isAnonymous,
    username: formData.username,
    imageUrl: formData.imageUrl,
    createdAt: new Date(),
    messageCount: 0
  };

  await addFeedbackItem(newFeedback);
  return { success: true, item: newFeedback };
}

export async function getAllFeedbackAction() {
  return await getFeedbackItems();
}
