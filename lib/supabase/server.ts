import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { type Database } from '@/types/supabase';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

/**
 * Creates a Supabase server client with proper async cookie handling.
 * Must be called in a Server Component, Route Handler, or Server Action context.
 */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as any)
          );
        } catch { /* Server Component context — cookies set by middleware response */ }
      },
    },
  });
}
