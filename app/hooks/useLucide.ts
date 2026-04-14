'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    lucide: { createIcons: (opts?: { root?: HTMLElement }) => void };
  }
}

export function useLucide(deps: unknown[] = []) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.lucide) {
      window.lucide.createIcons();
    }
  }, deps);
}
