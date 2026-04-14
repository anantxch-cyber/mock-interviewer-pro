import { type Database } from './supabase';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Session = Database['public']['Tables']['sessions']['Row'];

export interface InterviewConfig {
  mode: string;
  role: string;
  exp: string;
  company: string;
  numQ: number;
  focus: string;
}

export interface AnswerObj {
  q: string;
  answer: string;
  score: number;
  confidence: number;
  fillerWords: number;
  wordCount: number;
}

export interface ReportData {
  mode: string;
  totalScore: number;
  avgConf: number;
  totalFillers: number;
  duration: number;
  date: string;
  answers: AnswerObj[];
}

export type InterviewMode = 'technical' | 'behavioral' | 'hr' | 'stress' | 'system-design' | 'dsa' | 'resume';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
