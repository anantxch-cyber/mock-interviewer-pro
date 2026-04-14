'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BrainCircuit, Sparkles, PlayCircle, LayoutDashboard, Code2, Users,
  MessageCircle, Zap, Network, Terminal, FileText, ArrowRight, Trophy, Mic, Layers
} from 'lucide-react';

const MODES = [
  { mode: 'technical', Icon: Code2, title: 'Technical', desc: 'DS&A, System Design, Coding concepts', bg: 'rgba(99,102,241,0.15)', color: '#6366f1' },
  { mode: 'hr', Icon: Users, title: 'HR Round', desc: 'Culture fit, salary, motivations', bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
  { mode: 'behavioral', Icon: MessageCircle, title: 'Behavioral', desc: 'STAR stories, leadership, teamwork', bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  { mode: 'stress', Icon: Zap, title: 'Stress Test', desc: 'Rapid fire, pressure, interruptions', bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
  { mode: 'system-design', Icon: Network, title: 'System Design', desc: 'Architecture, scalability, tradeoffs', bg: 'rgba(168,85,247,0.15)', color: '#a855f7' },
  { mode: 'dsa', Icon: Terminal, title: 'DSA Deep Dive', desc: 'LeetCode-style, explain your thinking', bg: 'rgba(6,182,212,0.15)', color: '#06b6d4' },
];

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const nav = document.getElementById('mainNav');
    const handleScroll = () => nav?.classList.toggle('nav-scrolled', window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Ambient Background */}
      <div className="ambient-bg">
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
        <div className="ambient-orb orb-3" />
      </div>

      {/* Nav */}
      <nav className="nav" id="mainNav">
        <div className="nav-inner">
          <Link href="/" className="nav-brand">
            <div className="brand-icon"><BrainCircuit size={18} /></div>
            <span>InterviewAI</span>
          </Link>
          <div className="nav-links">
            <Link href="/dashboard" className="nav-link">Dashboard</Link>
            <Link href="/setup?mode=technical" className="nav-link">Practice</Link>
            <Link href="/report" className="nav-link">Reports</Link>
          </div>
          <div className="nav-actions">
            <button className="btn btn-ghost" onClick={() => router.push('/dashboard')}>Sign In</button>
            <button className="btn btn-primary glow" onClick={() => router.push('/setup')}>Start Free →</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>Powered by Next-Gen AI</span>
        </div>
        <h1 className="hero-title">
          The Last Interview Prep<br />
          <span className="gradient-text">You'll Ever Need</span>
        </h1>
        <p className="hero-subtitle">
          Practice with an AI that thinks like a senior hiring manager. Get real-time personality analysis,
          deep feedback, and a personalized improvement roadmap — all in one premium platform.
        </p>
        <div className="hero-cta">
          <button className="btn btn-primary btn-xl glow" onClick={() => router.push('/setup')}>
            <PlayCircle size={18} /> Start Mock Interview
          </button>
          <button className="btn btn-outline btn-xl" onClick={() => router.push('/dashboard')}>
            <LayoutDashboard size={18} /> View Dashboard
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat-item"><span className="stat-num">98%</span><span className="stat-label">Accuracy Rate</span></div>
          <div className="stat-divider" />
          <div className="stat-item"><span className="stat-num">50+</span><span className="stat-label">Interview Modes</span></div>
          <div className="stat-divider" />
          <div className="stat-item"><span className="stat-num">10K+</span><span className="stat-label">Candidates Hired</span></div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="section-header">
          <h2>Everything you need to <span className="gradient-text">get hired</span></h2>
          <p>Built by engineers who've sat on both sides of the interview table.</p>
        </div>
        <div className="features-grid">
          {[
            { Icon: BrainCircuit, title: 'Deep Personality Analysis', desc: 'AI analyzes confidence, leadership, emotional stability, and growth mindset in real-time.', tags: ['Confidence Score', 'Hiring Probability', 'Roadmap'], large: true, iconClass: 'icon-purple' },
            { Icon: Mic, title: 'Voice-Powered Sessions', desc: 'Speak your answers naturally. AI detects filler words, pacing, and hesitation.', tags: [], large: false, iconClass: 'icon-blue' },
            { Icon: Layers, title: '8+ Interview Modes', desc: 'HR, Technical, Behavioral, Stress Tests, Group Discussion, Fresher & Experienced modes.', tags: [], large: false, iconClass: 'icon-green' },
            { Icon: FileText, title: 'Resume Intelligence', desc: 'Upload your resume. AI extracts your projects and fires custom questions at you.', tags: [], large: false, iconClass: 'icon-orange' },
            { Icon: Trophy, title: 'Gamified Learning', desc: 'Climb XP levels, earn badges, maintain streaks, and compete on daily challenges.', tags: ['🔥 Streaks', '⭐ XP System', '🏆 Badges'], large: true, iconClass: 'icon-pink' },
          ].map(({ Icon, title, desc, tags, large, iconClass }) => (
            <div key={title} className={`feature-card${large ? ' feature-card-large' : ''}`} onClick={() => router.push('/setup')}>
              <div className={`feature-icon ${iconClass}`}><Icon size={22} /></div>
              <h3>{title}</h3>
              <p>{desc}</p>
              {tags.length > 0 && <div className="feature-tags">{tags.map(t => <span key={t} className="tag">{t}</span>)}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Mode Selector */}
      <section className="modes-section">
        <div className="section-header">
          <h2>Pick Your <span className="gradient-text">Battle Mode</span></h2>
        </div>
        <div className="modes-grid">
          {MODES.map(({ mode, Icon, title, desc, bg, color }) => (
            <div key={mode} className="mode-card" onClick={() => router.push(`/setup?mode=${mode}`)}>
              <div className="mode-icon" style={{ background: bg, color }}><Icon size={20} /></div>
              <div><h4>{title}</h4><p>{desc}</p></div>
              <ArrowRight size={16} className="mode-arrow" />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="brand-icon"><BrainCircuit size={18} /></div>
        <p>InterviewAI Pro — Built for the ambitious.</p>
      </footer>
    </>
  );
}
