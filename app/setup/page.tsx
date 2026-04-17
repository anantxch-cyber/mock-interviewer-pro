'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import {
  BrainCircuit, Code2, MessageCircle, Users, Zap, Network, FileText,
  ArrowLeft, ArrowRight, CheckCircle
} from 'lucide-react';

interface Config {
  mode: string; role: string; exp: string;
  company: string; numQ: number; focus: string;
}

const MODES = [
  { mode: 'technical',     Icon: Code2,        title: 'Technical',      desc: 'DS&A, System Design, Coding concepts', bg: 'rgba(99,102,241,0.15)',  color: '#6366f1' },
  { mode: 'behavioral',    Icon: MessageCircle, title: 'Behavioral',     desc: 'STAR stories, leadership, teamwork',   bg: 'rgba(245,158,11,0.15)',  color: '#f59e0b' },
  { mode: 'hr',            Icon: Users,         title: 'HR Round',       desc: 'Culture fit, salary, motivations',     bg: 'rgba(16,185,129,0.15)',  color: '#10b981' },
  { mode: 'stress',        Icon: Zap,           title: 'Stress Test',    desc: 'Rapid fire, pressure, interruptions',  bg: 'rgba(239,68,68,0.15)',   color: '#ef4444' },
  { mode: 'system-design', Icon: Network,       title: 'System Design',  desc: 'Architecture, scalability, tradeoffs', bg: 'rgba(168,85,247,0.15)',  color: '#a855f7' },
  { mode: 'resume',        Icon: FileText,      title: 'Resume-Based',   desc: 'Questions from your own projects',     bg: 'rgba(6,182,212,0.15)',   color: '#06b6d4' },
];

const MODE_LABELS: Record<string, string> = {
  technical: 'Technical', behavioral: 'Behavioral', hr: 'HR Round',
  stress: 'Stress Test', 'system-design': 'System Design', resume: 'Resume-Based', dsa: 'DSA Deep Dive'
};

function SetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<Config>({
    mode: searchParams.get('mode') || 'technical',
    role: '', exp: 'junior', company: '', numQ: 8, focus: '',
  });

  const nextStep = () => {
    if (step === 3) {
      localStorage.setItem('interviewConfig', JSON.stringify(config));
      router.push('/interview');
    } else {
      setStep(s => s + 1);
    }
  };
  const prevStep = () => setStep(s => s - 1);

  return (
    <>
      <div className="ambient-bg">
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
      </div>

      <nav className="nav nav-scrolled">
        <div className="nav-inner">
          <Link href="/" className="nav-brand">
            <div className="brand-icon"><BrainCircuit size={16} /></div>
            <span>InterviewAI</span>
          </Link>
          <div className="nav-actions">
            <button className="btn btn-ghost" onClick={() => router.back()}>
              <ArrowLeft size={15} style={{ display: 'inline', marginRight: 4 }} /> Back
            </button>
          </div>
        </div>
      </nav>

      <div className="setup-page">
        <div className="setup-header">
          <h1>Configure Your <span className="gradient-text">Interview</span></h1>
          <p>Set up a realistic session tailored to your target role and skill level.</p>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          {[1, 2, 3].map((n, i) => (
            <>
              <div key={n} className={`step ${step >= n ? 'active' : ''} ${step > n ? 'done' : ''}`}>
                <div className="step-num">{step > n ? <CheckCircle size={14} /> : n}</div>
              </div>
              {i < 2 && (
                <div key={`line-${n}`} className="step-line" style={{ background: step > n ? 'var(--green)' : undefined }} />
              )}
            </>
          ))}
        </div>

        {/* Step 1: Mode */}
        {step === 1 && (
          <div className="setup-card">
            <h2>1. Choose Interview Mode</h2>
            <div className="mode-select-grid">
              {MODES.map(m => (
                <label
                  key={m.mode}
                  className={`mode-select-item ${config.mode === m.mode ? 'selected' : ''}`}
                  onClick={() => setConfig(c => ({ ...c, mode: m.mode }))}
                >
                  <input type="radio" name="mode" value={m.mode} checked={config.mode === m.mode} readOnly />
                  <div className="mode-select-icon" style={{ background: m.bg, color: m.color }}>
                    <m.Icon size={18} />
                  </div>
                  <div><h4>{m.title}</h4><p>{m.desc}</p></div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="setup-card">
            <h2>2. Your Profile &amp; Target Role</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Target Role</label>
                <select className="form-select" value={config.role} onChange={e => setConfig(c => ({ ...c, role: e.target.value }))}>
                  <option value="">Select a role...</option>
                  {['Software Engineer (Frontend)', 'Software Engineer (Backend)', 'Full Stack Developer',
                    'Data Scientist', 'Data Analyst', 'Product Manager', 'DevOps Engineer',
                    'ML Engineer', 'Sales Executive', 'HR Manager', 'Business Analyst'].map(r => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Experience Level</label>
                <select className="form-select" value={config.exp} onChange={e => setConfig(c => ({ ...c, exp: e.target.value }))}>
                  <option value="fresher">Fresher / 0–1 yr</option>
                  <option value="junior">Junior / 1–3 yrs</option>
                  <option value="mid">Mid-level / 3–6 yrs</option>
                  <option value="senior">Senior / 6+ yrs</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Target Company (Optional)</label>
                <input type="text" className="form-input" value={config.company}
                  onChange={e => setConfig(c => ({ ...c, company: e.target.value }))}
                  placeholder="e.g. Google, Amazon, Startup..." />
                <div className="form-hint">We'll tailor questions to match the company's interview culture.</div>
              </div>
              <div className="form-group">
                <label>Number of Questions</label>
                <select className="form-select" value={config.numQ} onChange={e => setConfig(c => ({ ...c, numQ: parseInt(e.target.value) }))}>
                  <option value={5}>5 Questions (Quick, ~15 min)</option>
                  <option value={8}>8 Questions (Standard, ~25 min)</option>
                  <option value={12}>12 Questions (Full round, ~40 min)</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Focus Areas (Optional)</label>
              <input type="text" className="form-input" value={config.focus}
                onChange={e => setConfig(c => ({ ...c, focus: e.target.value }))}
                placeholder="e.g. React, Node.js, SQL, Leadership..." />
              <div className="form-hint">Separate multiple topics with commas.</div>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className="setup-card">
            <h2>3. Confirm &amp; Launch</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                ['Interview Mode', MODE_LABELS[config.mode] || config.mode],
                ['Target Role', config.role || '—'],
                ['Experience Level', config.exp],
                ['Questions', `${config.numQ} questions`],
                ['Company', config.company || 'Generic'],
                ['Focus', config.focus || 'All topics'],
              ].map(([k, v]) => (
                <div key={k} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{k}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, padding: 16, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>💡 PRO TIP</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.5 }}>Try to speak your answers out loud using the voice mode. Users who speak answers improve their confidence score 3x faster.</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="setup-actions">
          {step > 1 ? (
            <button className="btn btn-ghost" onClick={prevStep}>
              <ArrowLeft size={15} style={{ display: 'inline', marginRight: 4 }} /> Back
            </button>
          ) : <div />}
          <button className="btn btn-primary glow" onClick={nextStep}>
            {step === 3
              ? '🚀 Launch Interview'
              : <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>Continue <ArrowRight size={15} /></span>
            }
          </button>
        </div>
      </div>
    </>
  );
}

export default function SetupPage() {
  return (
    <Suspense fallback={<div className="setup-page"><p>Loading...</p></div>}>
      <SetupContent />
    </Suspense>
  );
}
