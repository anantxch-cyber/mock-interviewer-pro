export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          email: string;
          avatar_url: string | null;
          xp: number;
          level: number;
          streak: number;
          last_session_at: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          email: string;
          avatar_url?: string | null;
          xp?: number;
          level?: number;
          streak?: number;
          last_session_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          mode: string;
          role: string | null;
          total_score: number;
          avg_confidence: number;
          filler_words: number;
          duration_secs: number;
          questions: Json;
          answers: Json;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['sessions']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Database['public']['Tables']['sessions']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
