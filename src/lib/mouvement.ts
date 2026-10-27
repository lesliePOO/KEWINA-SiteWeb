import { useEffect, useState } from 'react';

/** Vrai si le visiteur a demandé la réduction des animations dans son système. */
export function useMouvementReduit(): boolean {
  const [reduit, setReduit] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const maj = () => setReduit(mq.matches);
    mq.addEventListener('change', maj);
    return () => mq.removeEventListener('change', maj);
  }, []);
  return reduit;
}
