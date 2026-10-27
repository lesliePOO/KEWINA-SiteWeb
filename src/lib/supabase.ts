import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const cle = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/** Client public : il ne lit que ce que les règles RLS autorisent. Null si la configuration manque. */
export const supabase: SupabaseClient | null = url && cle ? createClient(url, cle) : null;
