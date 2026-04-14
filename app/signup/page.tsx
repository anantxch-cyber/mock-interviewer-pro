'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, BrainCircuit, Chrome } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must include at least one uppercase letter')
    .regex(/[0-9]/, 'Must include at least one number'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match', path: ['confirmPassword'],
});

type Errors = Partial<Record<'name' | 'email' | 'password' | 'confirmPassword', string>>;

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const result = signupSchema.safeParse(form);
    if (result.success) { setErrors({}); return true; }
    const errs: Errors = {};
    result.error.errors.forEach(e => { if (e.path[0]) errs[e.path[0] as keyof Errors] = e.message; });
    setErrors(errs);
    return false;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { name: form.name }, emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      toast.error(error.message);
    } else if (data.user?.identities?.length === 0) {
      toast.error('An account with this email already exists. Try signing in.');
    } else {
      setDone(true);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) { toast.error(error.message); setGoogleLoading(false); }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-[#040405] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm w-full text-center bg-[#111113]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-10">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
          <p className="text-sm text-[#71717a]">We sent a confirmation link to <strong className="text-white">{form.email}</strong>. Click it to activate your account.</p>
          <Link href="/login" className="inline-block mt-6 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">Back to sign in</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040405] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/8 blur-[100px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-[420px] relative z-10">
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-8 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-shadow">
            <BrainCircuit size={18} className="text-white" />
          </div>
          <span className="text-lg font-semibold text-white tracking-tight">InterviewAI</span>
        </Link>

        <div className="bg-[#111113]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
            <p className="text-sm text-[#71717a]">Start your AI interview prep journey today</p>
          </div>

          <Button variant="secondary" size="lg" className="w-full mb-6" loading={googleLoading}
            onClick={handleGoogle} icon={<Chrome size={16} />}>
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-[#52525b]">or create with email</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <Input label="Full name" type="text" placeholder="Alex Johnson"
              icon={<User size={15} />} value={form.name} onChange={set('name')} error={errors.name} />
            <Input label="Email address" type="email" placeholder="you@example.com"
              icon={<Mail size={15} />} value={form.email} onChange={set('email')} error={errors.email} />
            <Input label="Password" type="password" placeholder="Min 8 chars, 1 uppercase, 1 number"
              icon={<Lock size={15} />} value={form.password} onChange={set('password')} error={errors.password} />
            <Input label="Confirm password" type="password" placeholder="••••••••"
              icon={<Lock size={15} />} value={form.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} />
            <Button type="submit" size="lg" className="w-full mt-1" loading={loading}>
              Create Account
            </Button>
          </form>
          <p className="text-xs text-center text-[#52525b] mt-4">
            By signing up, you agree to our{' '}
            <a href="#" className="text-indigo-400 hover:underline">Terms</a> and{' '}
            <a href="#" className="text-indigo-400 hover:underline">Privacy Policy</a>.
          </p>
        </div>
        <p className="text-center text-sm text-[#71717a] mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
