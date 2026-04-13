// js/store.js — Central Data Store with LocalStorage persistence

const KEYS = {
  sessions: 'ai_interview_sessions',
  user: 'ai_interview_user',
  stats: 'ai_interview_stats',
};

const DEFAULT_SESSIONS = [
  { id: '1', title: 'Senior Frontend Engineer', type: 'technical', score: 88, date: 'Today, 10:00 AM', icon: 'code-2', iconBg: 'rgba(99,102,241,0.15)', iconColor: '#6366f1' },
  { id: '2', title: 'Product Manager — Stress Round', type: 'stress', score: 72, date: 'Yesterday', icon: 'zap', iconBg: 'rgba(239,68,68,0.15)', iconColor: '#ef4444' },
  { id: '3', title: 'Data Analyst Behavioral', type: 'behavioral', score: 91, date: 'Apr 10', icon: 'bar-chart-2', iconBg: 'rgba(245,158,11,0.15)', iconColor: '#f59e0b' },
  { id: '4', title: 'Google HR Round Simulation', type: 'hr', score: 64, date: 'Apr 8', icon: 'users', iconBg: 'rgba(16,185,129,0.15)', iconColor: '#10b981' },
];

const DEFAULT_USER = {
  name: 'Alex',
  xp: 1820,
  level: 7,
  streak: 7,
  badges: ['🔥','⭐','💪','🎯','🚀','🤝'],
};

const DEFAULT_STATS = {
  totalSessions: 24,
  avgScore: 79,
  confidence: 82,
  hiringChance: 74,
  readiness: 84,
};

export const AppStore = {
  getSessions() {
    try {
      const raw = localStorage.getItem(KEYS.sessions);
      return raw ? JSON.parse(raw) : DEFAULT_SESSIONS;
    } catch { return DEFAULT_SESSIONS; }
  },
  getUser() {
    try {
      const raw = localStorage.getItem(KEYS.user);
      const stored = raw ? JSON.parse(raw) : {};

      // Merge stored xp from interview stats
      const statsRaw = localStorage.getItem('interviewStats');
      const iStats = statsRaw ? JSON.parse(statsRaw) : {};
      
      return { ...DEFAULT_USER, ...stored, xp: (DEFAULT_USER.xp + (iStats.totalXP || 0)), streak: DEFAULT_USER.streak };
    } catch { return DEFAULT_USER; }
  },
  getStats() {
    try {
      const raw = localStorage.getItem(KEYS.stats);
      const s = raw ? JSON.parse(raw) : {};

      const iRaw = localStorage.getItem('interviewStats');
      const iStats = iRaw ? JSON.parse(iRaw) : {};

      return {
        ...DEFAULT_STATS,
        ...s,
        totalSessions: DEFAULT_STATS.totalSessions + (iStats.totalSessions || 0),
      };
    } catch { return DEFAULT_STATS; }
  },
  addSession(session) {
    const sessions = this.getSessions();
    sessions.unshift({ ...session, id: Date.now().toString(), date: 'Just now' });
    localStorage.setItem(KEYS.sessions, JSON.stringify(sessions.slice(0, 30)));
  },
};
