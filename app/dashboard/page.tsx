'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Activity, Shield, CheckCircle, Target, Code2, Zap, MessageCircle,
  BarChart2, FileText, ArrowRight, TrendingUp, Flame, Loader2
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { getScoreColor } from '@/utils/cn';
import { createClient } from '@/lib/supabase/client';

interface SessionRow {
  id: string;
  mode: string;
  role: string | null;
  total_score: number;
  avg_confidence: number;
  filler_words: number;
  duration_secs: number;
  created_at: string;
}

// ─── Static fallback data (shown for new users with no sessions) ────────────
const DEMO_SESSIONS = [
  { id: '1', title: 'Senior Frontend Engineer', type: 'technical', score: 88, date: 'Complete your first session!', icon: Code2, iconColor: '#6366f1', iconBg: 'rgba(99,102,241,0.15)' },
  { id: '2', title: 'Product Manager — Stress Round', type: 'stress', score: 72, date: 'Practice →', icon: Zap, iconColor: '#ef4444', iconBg: 'rgba(239,68,68,0.15)' },
  { id: '3', title: 'Data Analyst Behavioral', type: 'behavioral', score: 91, date: 'Example session', icon: BarChart2, iconColor: '#f59e0b', iconBg: 'rgba(245,158,11,0.15)' },
];

const SKILLS = [
  { name: 'Technical Knowledge', score: 86, color: '#6366f1' },
  { name: 'Communication Clarity', score: 74, color: '#3b82f6' },
  { name: 'Problem Solving', score: 91, color: '#10b981' },
  { name: 'Behavioral Depth', score: 68, color: '#f59e0b' },
  { name: 'Confidence Under Pressure', score: 79, color: '#ec4899' },
];

const BADGES = [
  { icon: '🔥', name: '7-Day Streak' }, { icon: '⭐', name: 'Top 10%' },
  { icon: '💪', name: 'Stress Master' }, { icon: '🎯', name: '90+ Score' },
  { icon: '🚀', name: 'First Session' }, { icon: '🤝', name: 'Team Player' },
];

const QUICK = [
  { icon: Code2, label: 'Technical Interview', mode: 'technical' },
  { icon: MessageCircle, label: 'Behavioral Round', mode: 'behavioral' },
  { icon: Zap, label: 'Stress Test', mode: 'stress' },
  { icon: FileText, label: 'Resume-Based', mode: 'resume' },
];

const modeIconMap: Record<string, { icon: typeof Code2; color: string; bg: string }> = {
  technical:     { icon: Code2,        color: '#6366f1', bg: 'rgba(99,102,241,0.15)' },
  behavioral:    { icon: MessageCircle, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  hr:            { icon: BarChart2,     color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  stress:        { icon: Zap,          color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  'system-design': { icon: Activity,   color: '#a855f7', bg: 'rgba(168,85,247,0.15)' },
  resume:        { icon: FileText,      color: '#06b6d4', bg: 'rgba(6,182,212,0.15)' },
};

const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

function formatDate(isoStr: string): string {
  const d = new Date(isoStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return `Today, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const supabase = createClient();

  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [totalScore, setTotalScore] = useState(0);
  const [avgConfidence, setAvgConfidence] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);

  const name = user?.user_metadata?.name || user?.email?.split('@')[0] || 'there';
  const firstName = name.split(' ')[0];

  useEffect(() => {
    if (!user) return;
    setSessionsLoading(true);

    supabase
      .from('sessions')
      .select('id, mode, role, total_score, avg_confidence, filler_words, duration_secs, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(4)
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) {
          // Fallback: read from localStorage if DB fails or is empty
          const local = JSON.parse(localStorage.getItem('interviewStats') || '{}');
          setTotalSessions(local.totalSessions || 0);
        } else {
          const rows = data as unknown as SessionRow[];
          setSessions(rows);
          setTotalSessions(rows.length);
          if (rows.length > 0) {
            setTotalScore(Math.round(rows.reduce((s, r) => s + r.total_score, 0) / rows.length));
            setAvgConfidence(Math.round(rows.reduce((s, r) => s + r.avg_confidence, 0) / rows.length));
          }
        }
        setSessionsLoading(false);
      });
  }, [user]);

  // Map DB sessions to display items
  const displaySessions = sessions.length > 0
    ? sessions.map(s => {
        const meta = modeIconMap[s.mode] ?? modeIconMap.technical;
        return {
          id: s.id,
          title: s.role || `${s.mode.charAt(0).toUpperCase() + s.mode.slice(1)} Interview`,
          type: s.mode,
          score: s.total_score,
          date: formatDate(s.created_at),
          icon: meta.icon,
          iconColor: meta.color,
          iconBg: meta.bg,
        };
      })
    : DEMO_SESSIONS;

  return (
    <AppShell>
      <div className="p-8 max-w-[1280px] mx-auto">
        {/* Header */}
        <motion.div initial="hidden" animate="show" variants={stagger} className="mb-8">
          <motion.div variants={fadeUp} className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-1.5">
                Welcome back, {loading ? '...' : firstName}
                {totalScore > 0 && (
                  <span className="inline-flex items-center gap-1.5 ml-4 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold align-middle">
                    <TrendingUp size={13} /> {totalScore}% Ready
                  </span>
                )}
              </h1>
              <p className="text-[#71717a] text-base">
                {totalSessions > 0
                  ? <>You've completed <span className="text-white font-semibold">{totalSessions}</span> {totalSessions === 1 ? 'session' : 'sessions'}. Keep pushing!</>
                  : <>Start your first interview to see your stats here.</>
                }
              </p>
            </div>
            <Button onClick={() => router.push('/setup')} icon={<Zap size={15} />} className="glow-indigo">
              Start Interview
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Row */}
        <motion.div initial="hidden" animate="show" variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Overall Score', val: totalScore > 0 ? `${totalScore}` : '—', sub: totalScore > 0 ? 'From your sessions' : 'No sessions yet', icon: Activity, color: '#6366f1', bg: 'rgba(99,102,241,0.1)', trend: totalScore > 0 },
            { label: 'Confidence', val: avgConfidence > 0 ? `${avgConfidence}%` : '—', sub: avgConfidence > 0 ? 'Average confidence' : 'No sessions yet', icon: Shield, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', trend: avgConfidence > 0 },
            { label: 'Sessions Done', val: `${totalSessions}`, sub: 'Total completed', icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.1)', trend: false },
            { label: 'Hiring Chance', val: totalScore > 0 ? `${Math.min(99, Math.round(totalScore * 0.9))}%` : '—', sub: totalScore > 0 ? 'Based on scores' : 'No data yet', icon: Target, color: '#ec4899', bg: 'rgba(236,72,153,0.1)', trend: totalScore > 0 },
          ].map(({ label, val, sub, icon: Icon, color, bg, trend }) => (
            <motion.div key={label} variants={fadeUp}>
              <Card hover onClick={() => router.push('/report')} className="p-5 cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#52525b]">{label}</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: bg, color }}>
                    <Icon size={15} />
                  </div>
                </div>
                <div className="text-3xl font-light text-white mb-1.5">{val}</div>
                <div className={`flex items-center gap-1 text-xs ${trend ? 'text-green-400' : 'text-[#71717a]'}`}>
                  {trend && <TrendingUp size={11} />} {sub}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
          <div className="flex flex-col gap-6">
            {/* Recent Sessions */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sessions</CardTitle>
                  <Link href="/report" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                    View All <ArrowRight size={11} />
                  </Link>
                </CardHeader>
                <CardContent className="p-0">
                  {sessionsLoading ? (
                    <div className="flex items-center justify-center py-10 gap-2 text-[#52525b]">
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-sm">Loading sessions...</span>
                    </div>
                  ) : (
                    <>
                      {sessions.length === 0 && (
                        <div className="px-5 py-3 text-xs text-[#52525b] italic border-b border-white/[0.04]">
                          No sessions yet — example data shown below
                        </div>
                      )}
                      {displaySessions.map((s, i) => (
                        <motion.div key={s.id}
                          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i }}
                          onClick={() => router.push('/report')}
                          className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.03] transition-colors cursor-pointer border-b border-white/[0.04] last:border-0 group"
                        >
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                            style={{ background: s.iconBg, color: s.iconColor }}>
                            <s.icon size={17} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate group-hover:text-indigo-300 transition-colors">{s.title}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                                s.type === 'technical' ? 'bg-indigo-500/15 text-indigo-400' :
                                s.type === 'stress' ? 'bg-red-500/15 text-red-400' :
                                s.type === 'behavioral' ? 'bg-yellow-500/15 text-yellow-400' :
                                'bg-green-500/15 text-green-400'
                              }`}>{s.type}</span>
                              <span className="text-[11px] text-[#52525b]">{s.date}</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-xl font-semibold" style={{ color: getScoreColor(s.score) }}>{s.score}</div>
                            <div className="text-[10px] text-[#52525b] uppercase tracking-wider">Score</div>
                          </div>
                          <ArrowRight size={14} className="text-[#3f3f46] group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                        </motion.div>
                      ))}
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Skill Breakdown */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card>
                <CardHeader><CardTitle>Skill Breakdown</CardTitle></CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {SKILLS.map((s, i) => (
                    <div key={s.name}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-[#a1a1aa]">{s.name}</span>
                        <span className="font-semibold text-white">{s.score}%</span>
                      </div>
                      <div className="h-1.5 bg-[#1c1c1f] rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full"
                          style={{ background: s.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${s.score}%` }}
                          transition={{ duration: 0.8, delay: 0.1 * i, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Quick Start */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <Card>
                <CardHeader><CardTitle>Quick Start</CardTitle></CardHeader>
                <CardContent className="p-3 grid grid-cols-2 gap-2">
                  {QUICK.map(({ icon: Icon, label, mode }) => (
                    <motion.button key={mode}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => router.push(`/setup?mode=${mode}`)}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#1c1c1f] hover:bg-[#252527] border border-white/[0.06] hover:border-indigo-500/30 text-[#a1a1aa] hover:text-indigo-300 transition-all text-center cursor-pointer"
                    >
                      <Icon size={18} />
                      <span className="text-xs font-medium leading-tight">{label}</span>
                    </motion.button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <Card>
                <CardHeader><CardTitle>Achievements 🏆</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-3 gap-2">
                  {BADGES.map((b, i) => (
                    <motion.div key={b.name}
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * i }}
                      title={b.name}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#1c1c1f] border border-white/[0.06] hover:border-yellow-500/30 hover:bg-yellow-500/5 cursor-pointer transition-all group"
                    >
                      <span className="text-2xl">{b.icon}</span>
                      <span className="text-[10px] text-[#71717a] group-hover:text-[#a1a1aa] text-center leading-tight transition-colors">{b.name}</span>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
