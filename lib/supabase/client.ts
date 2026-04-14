import { createBrowserClient } from '@supabase/ssr';
import { type Database } from '@/types/supabase';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // During SSG/prerender, env vars might not be available — use safe fallback
  return createBrowserClient<Database>(
    url || 'https://placeholder.supabase.co',
    key || 'placeholder-key',
  );
}

export const isSupabaseConfigured =
  typeof window !== 'undefined' &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
