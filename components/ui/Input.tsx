'use client';
import { cn } from '@/utils/cn';
import { type InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, type, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-[#d4d4d8]">{label}</label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-[#71717a] pointer-events-none">{icon}</div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'w-full bg-[#111113] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#52525b]',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50',
              'transition-all duration-200',
              error && 'border-red-500/50 focus:ring-red-500/30',
              icon && 'pl-10',
              isPassword && 'pr-10',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              className="absolute right-3 text-[#71717a] hover:text-[#a1a1aa] transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {error && (
          <div className="flex items-center gap-1.5 text-xs text-red-400">
            <AlertCircle size={12} /> {error}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
export default Input;
