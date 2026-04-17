'use client';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, useMemo } from 'react';
import type { User } from '@supabase/supabase-js';

export interface Profile {
  name: string | null;
  avatar_url: string | null;
  xp: number;
  level: number;
  streak: number;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Memoize client so it isn't recreated on every render
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let mounted = true;

    // Initial session check
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data.user ?? null);
      setLoading(false);
      if (data.user) fetchProfile(data.user.id);
    });

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('name, avatar_url, xp, level, streak')
      .eq('id', userId)
      .single();
    if (data) setProfile(data as Profile);
  }

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return { user, profile, loading, signOut };
}
