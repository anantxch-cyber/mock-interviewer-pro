/**
 * Supabase public configuration.
 * These are PUBLIC/anon keys — safe to include in client bundle.
 * Env var NEXT_PUBLIC_SUPABASE_ANON_KEY is the standard Supabase name;
 * set it in .env.local and in Vercel project settings.
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://nfzfpnqzhvvawhxgoihq.supabase.co';

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_QTzseSTQTdyJVfIb1ju-eg_EYm-yf90';
