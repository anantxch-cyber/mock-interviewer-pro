'use client';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  glow?: boolean;
}

export default function Card({ children, className, hover, onClick, glow }: CardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -2, borderColor: 'rgba(99,102,241,0.3)' } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        'bg-[#111113]/60 backdrop-blur-md border border-white/[0.08] rounded-2xl',
        'shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
        glow && 'shadow-[0_0_40px_rgba(99,102,241,0.08)]',
        hover && 'cursor-pointer',
        'transition-colors duration-200',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between px-5 py-4 border-b border-white/[0.06]', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-sm font-semibold text-[#d4d4d8] tracking-wide', className)}>{children}</h3>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}
