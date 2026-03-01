
import { Feedback } from './types';

// Mock database
let feedbackItems: Feedback[] = [
  {
    id: '1',
    message: 'The login page takes too long to load on mobile devices. I waited for over 10 seconds before seeing anything.',
    isAnonymous: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    aiSummary: 'Slow login performance on mobile devices.',
    aiCategories: ['bug'],
  },
  {
    id: '2',
    message: 'I would love to see a dark mode feature in the next update. The current white theme is too bright at night.',
    isAnonymous: false,
    username: 'night_owl_99',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    aiSummary: 'User requesting a dark mode feature.',
    aiCategories: ['feature request'],
  }
];

export async function getFeedbackItems(): Promise<Feedback[]> {
  return [...feedbackItems].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function addFeedbackItem(item: Feedback): Promise<void> {
  feedbackItems.push(item);
}
