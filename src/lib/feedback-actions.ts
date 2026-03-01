'use server';

import { addFeedbackItem, getFeedbackItems, deleteFeedbackItem } from './feedback-store';
import { Feedback } from './types';
import { sendTelegramNotification } from './telegram';

export async function submitFeedbackAction(formData: {
  message: string;
  isAnonymous: boolean;
  username?: string;
  imageUrl?: string;
}) {
  console.log('>>> [Action] Starting submitFeedbackAction');

  const id = Math.random().toString(36).substring(7);

  const newFeedback: Feedback = {
    id,
    message: formData.message,
    isAnonymous: formData.isAnonymous,
    username: formData.username,
    imageUrl: formData.imageUrl,
    createdAt: new Date(),
  };

  try {
    console.log('>>> [Action] Saving to Supabase...');
    await addFeedbackItem(newFeedback);
    console.log('>>> [Action] Supabase success');

    // Fire-and-forget Telegram notification
    console.log('>>> [Action] Triggering Telegram notification (async)...');
    sendTelegramNotification(
      formData.message,
      formData.username,
      formData.isAnonymous,
      formData.imageUrl,
    ).catch((err) => {
      console.error('>>> [Telegram Error]:', err);
    });

    return { success: true, item: newFeedback };
  } catch (error: any) {
    console.error('>>> [Action Critical Error]:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

export async function getAllFeedbackAction() {
  try {
    return await getFeedbackItems();
  } catch (error) {
    console.error('>>> [getAllFeedbackAction Error]:', error);
    return [];
  }
}

export async function deleteFeedbackAction(id: string) {
  try {
    console.log('>>> [Action] Deleting whisper:', id);
    await deleteFeedbackItem(id);
    console.log('>>> [Action] Deletion success');
    return { success: true };
  } catch (error: any) {
    console.error('>>> [Action Error]:', error);
    return { success: false, error: error.message || 'Internal Server Error' };
  }
}
