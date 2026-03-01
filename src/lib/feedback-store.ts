import { Feedback } from './types';

// Mock database with initial "Lons" themed data
let feedbackItems: Feedback[] = [
  {
    id: '1',
    message: 'The silence of the early morning is where I find my best ideas. Anyone else feel the same?',
    isAnonymous: false,
    username: 'Luna_Misty',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    aiSummary: 'User reflections on morning creativity.',
    aiCategories: ['general inquiry'],
  },
  {
    id: '2',
    message: "Sometimes it's hard to be yourself when the world expects you to be someone else. Lons feels like a safe place to just... breathe.",
    isAnonymous: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    aiSummary: 'Venting about social expectations and appreciation for the platform.',
    aiCategories: ['general inquiry'],
  }
];

export async function getFeedbackItems(): Promise<Feedback[]> {
  return [...feedbackItems].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function addFeedbackItem(item: Feedback): Promise<void> {
  feedbackItems.push(item);
}