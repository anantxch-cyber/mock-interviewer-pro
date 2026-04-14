'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Activity, Shield, CheckCircle, Target, Code2, Zap, MessageCircle,
  BarChart2, FileText, ArrowRight, TrendingUp, Flame
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { getScoreColor } from '@/utils/cn';

// ─── Static data (replace with Supabase queries in production) ─────────────
const DEFAULT_SESSIONS = [
  { id: '1', title: 'Senior Frontend Engineer', type: 'technical', score: 88, date: 'Today, 10:00 AM', icon: Code2, iconColor: '#6366f1', iconBg: 'rgba(99,102,241,0.15)' },
  { id: '2', title: 'Product Manager — Stress Round', type: 'stress', score: 72, date: 'Yesterday', icon: Zap, iconColor: '#ef4444', iconBg: 'rgba(239,68,68,0.15)' },
  { id: '3', title: 'Data Analyst Behavioral', type: 'behavioral', score: 91, date: 'Apr 10', icon: BarChart2, iconColor: '#f59e0b', iconBg: 'rgba(245,158,11,0.15)' },
  { id: '4', title: 'Google HR Round', type: 'hr', score: 64, date: 'Apr 8', icon: MessageCircle, iconColor: '#10b981', iconBg: 'rgba(16,185,129,0.15)' },
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

const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [totalSessions, setTotalSessions] = useState(24);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem('interviewStats') || '{}');
      setTotalSessions(24 + (s.totalSessions || 0));
    } catch { /* use defaults */ }
  }, []);

  const name = user?.user_metadata?.name || user?.email?.split('@')[0] || 'there';
  const firstName = name.split(' ')[0];

  return (
    <AppShell>
      <div className="p-8 max-w-[1280px] mx-auto">
        {/* Header */}
        <motion.div initial="hidden" animate="show" variants={stagger} className="mb-8">
          <motion.div variants={fadeUp} className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-1.5">
                Welcome back, {loading ? '...' : firstName}
                <span className="inline-flex items-center gap-1.5 ml-4 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold align-middle">
                  <TrendingUp size={13} /> 84% Ready
                </span>
              </h1>
              <p className="text-[#71717a] text-base">
                You've completed <span className="text-white font-semibold">{totalSessions}</span> sessions this month.
                You're on a <span className="text-orange-400 font-semibold"><Flame size={13} className="inline" /> 7-day streak!</span>
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
            { label: 'Overall Score', val: '79', sub: '+8 from last week', icon: Activity, color: '#6366f1', bg: 'rgba(99,102,241,0.1)', trend: true },
            { label: 'Confidence', val: '82%', sub: 'Growing steadily', icon: Shield, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', trend: true },
            { label: 'Sessions Done', val: `${totalSessions}`, sub: 'This month', icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.1)', trend: false },
            { label: 'Hiring Chance', val: '74%', sub: '+12% this month', icon: Target, color: '#ec4899', bg: 'rgba(236,72,153,0.1)', trend: true },
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
                  {DEFAULT_SESSIONS.map((s, i) => (
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
