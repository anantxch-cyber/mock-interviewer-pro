/**
 * Supabase public configuration.
 * These are PUBLIC/anon keys — safe to include in client bundle.
 * The NEXT_PUBLIC_ env vars override these defaults on Vercel.
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://nfzfpnqzhvvawhxgoihq.supabase.co';

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_QTzseSTQTdyJVfIb1ju-eg_EYm-yf90';
