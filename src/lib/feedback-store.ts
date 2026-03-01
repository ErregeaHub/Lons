import { Feedback } from './types';

let feedbackItems: Feedback[] = [
  {
    id: '1',
    message: 'Sometimes the silence is louder than the noise.',
    isAnonymous: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 12),
  },
  {
    id: '2',
    message: "The darkest nights produce the brightest stars.",
    isAnonymous: true,
    imageUrl: 'https://picsum.photos/seed/stars/800/1000',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '3',
    message: "Can I delete my anonymous posts later? I am curious.",
    isAnonymous: false,
    username: 'GhostWriter',
    imageUrl: 'https://picsum.photos/seed/ghost/800/1000',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  }
];

export async function getFeedbackItems(): Promise<Feedback[]> {
  return [...feedbackItems].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function addFeedbackItem(item: Feedback): Promise<void> {
  feedbackItems.push(item);
}
