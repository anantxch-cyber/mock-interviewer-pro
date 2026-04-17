'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, BrainCircuit, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { z } from 'zod';

const resetSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must include at least one uppercase letter')
    .regex(/[0-9]/, 'Must include at least one number'),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
});

type Errors = Partial<Record<'password' | 'confirm', string>>;

export default function UpdatePasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [noSession, setNoSession] = useState(false);

  // Supabase sends a PKCE code for password reset — we need a session first
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSessionReady(true);
      } else {
        setNoSession(true);
      }
    });
    // Listen for the PASSWORD_RECOVERY event which fires when the magic link is clicked
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        setSessionReady(true);
        setNoSession(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const validate = () => {
    const result = resetSchema.safeParse(form);
    if (result.success) { setErrors({}); return true; }
    const errs: Errors = {};
    result.error.errors.forEach(e => { if (e.path[0]) errs[e.path[0] as keyof Errors] = e.message; });
    setErrors(errs);
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: form.password });
    if (error) {
      toast.error(error.message);
    } else {
      setDone(true);
      setTimeout(() => router.push('/dashboard'), 2500);
    }
    setLoading(false);
  };

  // Invalid link / no session
  if (noSession) {
    return (
      <div className="min-h-screen bg-[#040405] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm w-full text-center bg-[#111113]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-10">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Link expired or invalid</h2>
          <p className="text-sm text-[#71717a] mb-6">This password reset link has expired. Please request a new one.</p>
          <Link href="/forgot-password" className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors">
            Request new link
          </Link>
        </motion.div>
      </div>
    );
  }

  // Loading session
  if (!sessionReady) {
    return (
      <div className="min-h-screen bg-[#040405] flex items-center justify-center">
        <Loader2 size={24} className="text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040405] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-[400px] relative z-10">
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-8 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-shadow">
            <BrainCircuit size={18} className="text-white" />
          </div>
          <span className="text-lg font-semibold text-white tracking-tight">InterviewAI</span>
        </Link>

        <div className="bg-[#111113]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
          {done ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <CheckCircle size={40} className="text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Password updated!</h2>
              <p className="text-sm text-[#71717a]">Redirecting you to your dashboard…</p>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-7">
                <h1 className="text-2xl font-bold text-white mb-1">Set new password</h1>
                <p className="text-sm text-[#71717a]">Choose a strong password for your account.</p>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="New password" type="password"
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  icon={<Lock size={15} />}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  error={errors.password}
                />
                <Input
                  label="Confirm new password" type="password"
                  placeholder="••••••••"
                  icon={<Lock size={15} />}
                  value={form.confirm}
                  onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                  error={errors.confirm}
                />
                <Button type="submit" size="lg" className="w-full mt-1" loading={loading}>
                  Update Password
                </Button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
