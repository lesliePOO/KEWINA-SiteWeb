import { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import type { Produit } from '../../types/catalogue';
import { VisuelProduit } from './VisuelProduit';

/** Galerie plein écran : flèches, clavier (← → Échap) et balayage au doigt. */
export function Visionneuse({
  produit, vue, nbVues, couleur, surVue, surFermer,
}: { produit: Produit; vue: number; nbVues: number; couleur: string | null; surVue: (i: number) => void; surFermer: () => void }) {
  const fermer = useRef<HTMLButtonElement>(null);
  const departX = useRef<number | null>(null);
  const aller = (i: number) => surVue((i + nbVues) % nbVues);

  useEffect(() => {
    const precedentFocus = document.activeElement as HTMLElement | null;
    fermer.current?.focus();
    const ancien = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const touche = (e: KeyboardEvent) => {
      if (e.key === 'Escape') surFermer();
      if (e.key === 'ArrowRight') aller(vue + 1);
      if (e.key === 'ArrowLeft') aller(vue - 1);
    };
    window.addEventListener('keydown', touche);
    return () => {
      window.removeEventListener('keydown', touche);
      document.body.style.overflow = ancien;
      precedentFocus?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vue]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-noir/95 text-creme"
      role="dialog"
      aria-modal="true"
      aria-label={`${produit.nom} — vue ${vue + 1} sur ${nbVues}`}
      onTouchStart={(e) => (departX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (departX.current === null) return;
        const dx = e.changedTouches[0].clientX - departX.current;
        if (Math.abs(dx) > 50) aller(dx < 0 ? vue + 1 : vue - 1);
        departX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 lg:px-8">
        <span className="font-ui text-xs tabular-nums text-sable">{String(vue + 1).padStart(2, '0')} / {String(nbVues).padStart(2, '0')}</span>
        <button ref={fermer} type="button" onClick={surFermer} className="grid h-11 w-11 place-items-center hover:text-bronze" aria-label="Fermer la galerie">
          <X size={24} strokeWidth={1.5} />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 lg:px-20">
        <div key={vue} className="relative aspect-[4/5] h-full max-h-full max-w-full animate-apparition">
          <VisuelProduit produit={produit} index={vue} couleur={couleur} sizes="(min-width: 1024px) 60vw, 100vw" prioritaire />
        </div>
        {nbVues > 1 && (
          <>
            <button type="button" onClick={() => aller(vue - 1)} className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center hover:text-bronze lg:left-6" aria-label="Vue précédente">
              <ArrowLeft size={22} strokeWidth={1.5} />
            </button>
            <button type="button" onClick={() => aller(vue + 1)} className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center hover:text-bronze lg:right-6" aria-label="Vue suivante">
              <ArrowRight size={22} strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
