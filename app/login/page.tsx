'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, BrainCircuit, Chrome } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { Suspense } from 'react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type Errors = Partial<Record<'email' | 'password', string>>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';
  const supabase = createClient();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const validate = (): boolean => {
    const result = loginSchema.safeParse(form);
    if (result.success) { setErrors({}); return true; }
    const errs: Errors = {};
    result.error.errors.forEach(e => { if (e.path[0]) errs[e.path[0] as keyof Errors] = e.message; });
    setErrors(errs);
    return false;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    if (error) {
      toast.error(error.message === 'Invalid login credentials' ? 'Wrong email or password.' : error.message);
    } else {
      toast.success('Welcome back! 👋');
      router.push(next);
      router.refresh();
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${next}` },
    });
    if (error) { toast.error(error.message); setGoogleLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#040405] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/8 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[420px] relative z-10"
      >
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-8 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-shadow">
            <BrainCircuit size={18} className="text-white" />
          </div>
          <span className="text-lg font-semibold text-white tracking-tight">InterviewAI</span>
        </Link>

        {/* Card */}
        <div className="bg-[#111113]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-sm text-[#71717a]">Sign in to continue your interview prep</p>
          </div>

          {/* Google */}
          <Button
            variant="secondary"
            size="lg"
            className="w-full mb-6"
            loading={googleLoading}
            onClick={handleGoogle}
            icon={<Chrome size={16} />}
          >
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-[#52525b]">or sign in with email</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              label="Email address" type="email" placeholder="you@example.com"
              icon={<Mail size={15} />}
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              error={errors.email} autoComplete="email"
            />
            <div>
              <Input
                label="Password" type="password" placeholder="••••••••"
                icon={<Lock size={15} />}
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                error={errors.password} autoComplete="current-password"
              />
              <div className="text-right mt-1.5">
                <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full mt-1" loading={loading}>
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[#71717a] mt-5">
          Don't have an account?{' '}
          <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Create one free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
