import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadImage(file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('whispers')
        .upload(filePath, file);

    if (uploadError) {
        console.error('[Supabase Storage] Upload error:', uploadError.message);
        return null;
    }

    const { data } = supabase.storage
        .from('whispers')
        .getPublicUrl(filePath);

    return data.publicUrl;
}
