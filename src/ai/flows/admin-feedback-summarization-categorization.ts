'use server';
/**
 * @fileOverview An AI agent for summarizing and categorizing admin feedback.
 *
 * - adminFeedbackSummarizationAndCategorization - A function that handles the feedback summarization and categorization process.
 * - AdminFeedbackInput - The input type for the adminFeedbackSummarizationAndCategorization function.
 * - AdminFeedbackOutput - The return type for the adminFeedbackSummarizationAndCategorization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminFeedbackInputSchema = z.object({
  feedbackMessage: z.string().describe('The detailed feedback message from a user.'),
});
export type AdminFeedbackInput = z.infer<typeof AdminFeedbackInputSchema>;

const AdminFeedbackOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the feedback message.'),
  categories: z.array(z.enum(['bug', 'feature request', 'general inquiry'])).describe('A list of suggested categories for the feedback, chosen from "bug", "feature request", or "general inquiry".'),
});
export type AdminFeedbackOutput = z.infer<typeof AdminFeedbackOutputSchema>;

const summarizeAndCategorizePrompt = ai.definePrompt({
  name: 'summarizeAndCategorizePrompt',
  input: {schema: AdminFeedbackInputSchema},
  output: {schema: AdminFeedbackOutputSchema},
  prompt: `You are an AI assistant specialized in triaging user feedback.\nGiven the following feedback message, your task is to:\n1. Provide a concise summary of the feedback.\n2. Suggest relevant categories for the feedback from the following options: 'bug', 'feature request', 'general inquiry'. You can select one or more categories.\n\nFeedback Message:\n{{{feedbackMessage}}}\n\nPlease output the summary and categories in a JSON format matching the following schema:\n{{jsonSchema AdminFeedbackOutputSchema}}`,
});

const adminFeedbackSummarizationAndCategorizationFlow = ai.defineFlow(
  {
    name: 'adminFeedbackSummarizationAndCategorizationFlow',
    inputSchema: AdminFeedbackInputSchema,
    outputSchema: AdminFeedbackOutputSchema,
  },
  async (input) => {
    const {output} = await summarizeAndCategorizePrompt(input);
    return output!;
  }
);

export async function adminFeedbackSummarizationAndCategorization(
  input: AdminFeedbackInput
): Promise<AdminFeedbackOutput> {
  return adminFeedbackSummarizationAndCategorizationFlow(input);
}
