
import { Feedback } from './types';

let feedbackItems: Feedback[] = [
  {
    id: '1',
    message: 'Is there any way to report a user?',
    isAnonymous: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    message: "Thanks for the quick response!",
    isAnonymous: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
  {
    id: '3',
    message: "Can I delete my anonymous posts later?",
    isAnonymous: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  }
];

export async function getFeedbackItems(): Promise<Feedback[]> {
  return [...feedbackItems].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function addFeedbackItem(item: Feedback): Promise<void> {
  feedbackItems.push(item);
}
