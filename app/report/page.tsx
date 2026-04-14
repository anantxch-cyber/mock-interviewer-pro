'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ReportData {
  mode: string; totalScore: number; avgConf: number; totalFillers: number;
  duration: number; date: string; answers: { q: string; answer: string; score: number }[];
}

const DEFAULT_REPORT: ReportData = {
  mode: 'technical', totalScore: 76, avgConf: 79, totalFillers: 5, duration: 1260,
  date: new Date().toISOString(),
  answers: [
    { q: 'Explain the event loop in Node.js.', answer: 'I explained the call stack and how async callbacks are queued.', score: 82 },
    { q: 'Design a URL shortening service.', answer: 'I designed a system using Redis and hash IDs.', score: 74 },
    { q: 'Explain React Hooks.', answer: 'I described useState, useEffect, and custom hooks.', score: 71 },
  ],
};

const PERSONALITY_MATRIX = [
  { label: 'Confidence', val: 'Medium', icon: '⚡', color: 'var(--yellow)' },
  { label: 'Communication', val: 'Clear', icon: '✅', color: 'var(--green)' },
  { label: 'Problem Solving', val: 'Analytical', icon: '🧠', color: 'var(--blue)' },
  { label: 'Stress Handling', val: 'Anxious', icon: '😰', color: 'var(--orange)' },
  { label: 'Leadership', val: 'Growing', icon: '📈', color: 'var(--primary)' },
  { label: 'Professionalism', val: 'High', icon: '✅', color: 'var(--green)' },
];

const ROADMAP = [
  { icon: '🎯', step: 'Filler Word Reduction', tip: 'Practice the "pause + proceed" technique. Replace "uh/um" with a conscious 1s pause.' },
  { icon: '📊', step: 'Data-Driven Answers', tip: 'Every claim needs a metric. Instead of "improved performance", say "improved load time by 38%".' },
  { icon: '🔧', step: 'System Design Depth', tip: 'Study CAP theorem, consistent hashing, and caching patterns. Drive a mock system design daily.' },
];

function formatDuration(secs: number) {
  const m = Math.floor(secs / 60), s = secs % 60;
  return `${m} min${s > 0 ? ` ${s} sec` : ''}`;
}

function getScoreColor(s: number) {
  return s >= 80 ? 'var(--green)' : s >= 60 ? 'var(--yellow)' : 'var(--red)';
}

function getHiringLabel(s: number) {
  if (s >= 90) return { label: 'Strong Hire', emoji: '🏆', color: 'var(--green)' };
  if (s >= 75) return { label: 'Likely Hire', emoji: '✅', color: 'var(--green)' };
  if (s >= 60) return { label: 'Borderline', emoji: '⚠️', color: 'var(--yellow)' };
  return { label: 'Needs Work', emoji: '❌', color: 'var(--red)' };
}

export default function ReportPage() {
  const router = useRouter();
  const [report, setReport] = useState<ReportData>(DEFAULT_REPORT);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('lastReport');
      if (raw) setReport(JSON.parse(raw));
    } catch { /* use defaults */ }
    if (typeof window !== 'undefined' && window.lucide) window.lucide.createIcons();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.lucide) window.lucide.createIcons();
  });

  const score = report.totalScore;
  const conf = report.avgConf;
  const fillers = report.totalFillers;
  const dateStr = new Date(report.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const hiring = getHiringLabel(score);
  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference * (1 - score / 100);

  const strengths = [
    score >= 75 ? 'Strong technical depth with structured answers.' : null,
    conf >= 75 ? 'Confident delivery — language was clear and assertive.' : null,
    fillers < 3 ? 'Minimal filler words — professional cadence maintained.' : null,
    'Showed clear problem-solving approach with trade-off analysis.',
  ].filter(Boolean) as string[];

  const weaknesses = [
    fillers > 2 ? `Detected ${fillers} filler words (um, uh, like). Practice pausing instead.` : null,
    score < 75 ? 'Answers could be more concise and results-focused.' : null,
    'Connect responses more explicitly to the target role requirements.',
  ].filter(Boolean) as string[];

  return (
    <>
      <div className="ambient-bg"><div className="ambient-orb orb-1" /><div className="ambient-orb orb-2" /></div>

      <nav className="nav nav-scrolled">
        <div className="nav-inner">
          <Link href="/" className="nav-brand">
            <div className="brand-icon"><i data-lucide="brain-circuit" /></div>
            <span>InterviewAI</span>
          </Link>
          <div className="nav-actions">
            <button className="btn btn-ghost" onClick={() => router.push('/dashboard')}>
              <i data-lucide="layout-dashboard" /> Dashboard
            </button>
            <button className="btn btn-primary glow" onClick={() => router.push('/setup')}>
              Practice Again →
            </button>
          </div>
        </div>
      </nav>

      <div className="report-page">
        {/* Header */}
        <div className="report-header">
          <div>
            <h1 className="report-title">Interview Report</h1>
            <p className="report-subtitle">
              {report.mode.charAt(0).toUpperCase() + report.mode.slice(1)} · {formatDuration(report.duration)} · {dateStr}
            </p>
          </div>
          <div className="hiring-chip" style={{ borderColor: hiring.color, color: hiring.color }}>
            <div style={{ fontSize: '1.4rem' }}>{score}%</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: 2 }}>{hiring.emoji} {hiring.label}</div>
          </div>
        </div>

        {/* Score + Personality */}
        <div className="report-grid-top">
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <div className="card-title" style={{ alignSelf: 'flex-start' }}>Overall Score</div>
            <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="65" cy="65" r="52" fill="none" stroke="var(--bg-surface)" strokeWidth="10" />
              <circle cx="65" cy="65" r="52" fill="none" stroke="url(#grad)" strokeWidth="10"
                strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ textAlign: 'center', marginTop: -8 }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 300 }}>{score}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Out of 100</div>
            </div>
            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
              {[{ l: 'Confidence', v: `${conf}%` }, { l: 'Fillers', v: fillers }].map(({ l, v }) => (
                <div key={l} style={{ flex: 1, textAlign: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 10 }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', textTransform: 'uppercase', fontWeight: 700 }}>{l}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: 4 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Personality Matrix</div>
            <div className="personality-grid">
              {PERSONALITY_MATRIX.map(({ label, val, icon, color }) => (
                <div key={label} className="personality-item">
                  <div className="personality-label">{label}</div>
                  <div className="personality-val" style={{ color }}>{icon} {val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strengths + Weaknesses */}
        <div className="report-grid-mid">
          <div className="card">
            <div className="card-title" style={{ color: 'var(--green)' }}>✅ Strengths</div>
            <ul className="report-list" style={{ '--dot-color': 'var(--green)' } as React.CSSProperties}>
              {strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className="card">
            <div className="card-title" style={{ color: 'var(--yellow)' }}>⚠️ Improvement Areas</div>
            <ul className="report-list" style={{ '--dot-color': 'var(--yellow)' } as React.CSSProperties}>
              {weaknesses.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        </div>

        {/* Q&A Review */}
        {report.answers && report.answers.length > 0 && (
          <div className="card">
            <div className="card-title">Answer Review</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
              {report.answers.map((a, i) => (
                <div key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-3)', marginBottom: 6 }}>Q{i + 1}: {a.q?.substring(0, 80)}...</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>{a.answer?.substring(0, 120) || '[Skipped]'}{(a.answer?.length || 0) > 120 ? '...' : ''}</span>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: getScoreColor(a.score || 0), marginLeft: 12 }}>{a.score || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Roadmap */}
        <div className="card">
          <div className="card-title">📍 Your Improvement Roadmap</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            {ROADMAP.map(({ icon, step, tip }) => (
              <div key={step} style={{ display: 'flex', gap: 14, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: '1.4rem' }}>{icon}</div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{step}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.6 }}>{tip}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 24, display: 'flex', justifyContent: 'center', gap: 16 }}>
          <button className="btn btn-primary glow" style={{ padding: '14px 32px', fontSize: '1rem' }} onClick={() => router.push('/setup')}>
            Practice Again 🚀
          </button>
          <button className="btn btn-outline" style={{ padding: '14px 32px', fontSize: '1rem' }} onClick={() => router.push('/dashboard')}>
            View Dashboard
          </button>
        </div>
      </div>
    </>
  );
}
