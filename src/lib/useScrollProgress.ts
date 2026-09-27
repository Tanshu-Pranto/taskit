'use client';

import { useCallback, useSyncExternalStore, type RefObject } from 'react';

/**
 * Tracks how far `ref`'s element has been scrolled through the viewport, as a 0..1 value:
 * 0 while its top edge is at (or below) the viewport top, 1 once its bottom edge has
 * reached the viewport bottom. Meant for tall "scrollytelling" sections taller than 100vh.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>): number {
  const subscribe = useCallback((onStoreChange: () => void) => {
    let ticking = false;
    const handle = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        onStoreChange();
      });
    };
    window.addEventListener('scroll', handle, { passive: true });
    window.addEventListener('resize', handle);
    return () => {
      window.removeEventListener('scroll', handle);
      window.removeEventListener('resize', handle);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    const el = ref.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const range = rect.height - window.innerHeight;
    if (range <= 0) return rect.top <= 0 ? 1 : 0;
    const raw = -rect.top / range;
    // Round to avoid re-render churn from sub-pixel scroll jitter.
    return Math.round(Math.min(1, Math.max(0, raw)) * 500) / 500;
  }, [ref]);

  const getServerSnapshot = useCallback(() => 0, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
