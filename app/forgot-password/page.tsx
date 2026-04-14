'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, BrainCircuit, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) { setError('Please enter a valid email address'); return; }
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    if (err) { toast.error(err.message); } else { setSent(true); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#040405] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-[400px] relative z-10">
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-8 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <BrainCircuit size={18} className="text-white" />
          </div>
          <span className="text-lg font-semibold text-white tracking-tight">InterviewAI</span>
        </Link>

        <div className="bg-[#111113]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
          {sent ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <div className="text-5xl mb-4">✉️</div>
              <h2 className="text-xl font-bold text-white mb-2">Reset link sent!</h2>
              <p className="text-sm text-[#71717a] mb-6">Check your inbox at <strong className="text-white">{email}</strong> for a password reset link.</p>
              <Link href="/login" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">Back to sign in</Link>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-7">
                <h1 className="text-2xl font-bold text-white mb-1">Reset password</h1>
                <p className="text-sm text-[#71717a]">Enter your email and we'll send a reset link.</p>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input label="Email address" type="email" placeholder="you@example.com"
                  icon={<Mail size={15} />} value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  error={error} />
                <Button type="submit" size="lg" className="w-full" loading={loading}>
                  Send Reset Link
                </Button>
              </form>
            </>
          )}
        </div>

        <Link href="/login" className="flex items-center justify-center gap-1.5 text-sm text-[#71717a] hover:text-white transition-colors mt-5">
          <ArrowLeft size={14} /> Back to sign in
        </Link>
      </motion.div>
    </div>
  );
}
