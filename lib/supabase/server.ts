import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { type Database } from '@/types/supabase';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const cookieStore = cookies();

  return createServerClient<Database>(
    url || 'https://placeholder.supabase.co',
    key || 'placeholder-key',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as any)
            );
          } catch {
            // Called from Server Component — middleware handles session refresh
          }
        },
      },
    }
  );
}
