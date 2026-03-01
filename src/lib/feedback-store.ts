import { supabase } from './supabase';
import { Feedback } from './types';

export async function getFeedbackItems(): Promise<Feedback[]> {
  const { data, error } = await supabase
    .from('whispers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Supabase] Error fetching whispers:', error.message);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    message: row.message,
    isAnonymous: row.is_anonymous,
    username: row.username || undefined,
    imageUrl: row.image_url || undefined,
    createdAt: new Date(row.created_at),
    aiCategories: row.ai_categories || undefined,
  }));
}

export async function addFeedbackItem(item: Feedback): Promise<void> {
  const { error } = await supabase.from('whispers').insert({
    id: item.id,
    message: item.message,
    is_anonymous: item.isAnonymous,
    username: item.username || null,
    image_url: item.imageUrl || null,
    created_at: item.createdAt.toISOString(),
  });

  if (error) {
    console.error('[Supabase] Error inserting whisper:', error.message);
    throw new Error(`Failed to save whisper: ${error.message}`);
  }
}

export async function deleteFeedbackItem(id: string): Promise<void> {
  const { error } = await supabase.from('whispers').delete().eq('id', id);

  if (error) {
    console.error('[Supabase] Error deleting whisper:', error.message);
    throw new Error(`Failed to delete whisper: ${error.message}`);
  }
}
