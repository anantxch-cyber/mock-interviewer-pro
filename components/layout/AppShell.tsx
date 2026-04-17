'use client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, PlayCircle, FileBarChart, Code2, MessageCircle,
  Users, Zap, Trophy, Settings, BrainCircuit, LogOut, ChevronRight, Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/utils/cn';
import { useState } from 'react';

const NAV_MAIN = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/setup', icon: PlayCircle, label: 'New Interview' },
  { href: '/report', icon: FileBarChart, label: 'Last Report' },
];

const NAV_MODES = [
  { href: '/setup?mode=technical', icon: Code2, label: 'Technical' },
  { href: '/setup?mode=behavioral', icon: MessageCircle, label: 'Behavioral' },
  { href: '/setup?mode=hr', icon: Users, label: 'HR Round' },
  { href: '/setup?mode=stress', icon: Zap, label: 'Stress Test', badge: 'HOT' },
];

const NAV_PROFILE = [
  { href: '/report', icon: Trophy, label: 'Achievements' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

function NavItem({ href, icon: Icon, label, badge }: { href: string; icon: React.ElementType; label: string; badge?: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href.split('?')[0]));

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ x: 2 }}
        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer relative ${
          isActive
            ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
            : 'text-[#71717a] hover:text-[#d4d4d8] hover:bg-white/[0.04]'
        }`}
      >
        <Icon size={16} />
        <span className="flex-1">{label}</span>
        {badge && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">{badge}</span>}
        {isActive && <div className="absolute right-3 w-1 h-1 rounded-full bg-indigo-400" />}
      </motion.div>
    </Link>
  );
}

function SidebarSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#3f3f46] px-3 mb-2 block">{label}</span>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
  };

  const name = profile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const email = user?.email || '';
  const initials = getInitials(name);
  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;
  // XP needed to reach next level (simple formula: level * 500)
  const xpForNextLevel = level * 500;
  const xpProgress = Math.min(100, Math.round((xp % xpForNextLevel) / xpForNextLevel * 100));

  return (
    <div className="flex min-h-screen bg-[#040405]">
      {/* Ambient */}
      <div className="fixed top-0 left-0 w-[40vw] h-[40vh] rounded-full bg-indigo-600/8 blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[30vw] h-[30vh] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none z-0" />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-[240px] border-r border-white/[0.06] bg-[#040405]/90 backdrop-blur-xl flex flex-col z-20 overflow-hidden">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 px-4 h-14 border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_14px_rgba(99,102,241,0.4)] flex-shrink-0">
            <BrainCircuit size={14} className="text-white" />
          </div>
          <span className="font-semibold text-base text-white tracking-tight">InterviewAI</span>
        </Link>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-5">
          <SidebarSection label="Main">
            {NAV_MAIN.map(n => <NavItem key={n.href} {...n} />)}
          </SidebarSection>
          <SidebarSection label="Practice Modes">
            {NAV_MODES.map(n => <NavItem key={n.href} {...n} />)}
          </SidebarSection>
          <SidebarSection label="Account">
            {NAV_PROFILE.map(n => <NavItem key={n.href} {...n} />)}
          </SidebarSection>
        </nav>

        {/* User Footer */}
        <div className="border-t border-white/[0.06] p-3">
          {/* XP Bar */}
          <div className="mb-3 px-1">
            <div className="flex justify-between text-[11px] mb-1.5">
              <span className="text-[#52525b] font-medium">Level {level}</span>
              <span className="text-[#71717a]">{xp.toLocaleString()} XP</span>
            </div>
            <div className="h-1 bg-[#1c1c1f] rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }} transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }} />
            </div>
          </div>

          {/* User + Sign out */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/[0.04] transition-colors group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {loading ? '…' : initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">{loading ? 'Loading...' : name}</div>
              <div className="text-[10px] text-[#52525b] truncate">{email}</div>
            </div>
            <button onClick={handleSignOut} disabled={signingOut}
              className="text-[#52525b] hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/10 flex-shrink-0"
              title="Sign out">
              {signingOut ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-[240px] flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={typeof window !== 'undefined' ? window.location.pathname : 'page'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
