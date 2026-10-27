import { useEffect, useRef, useState } from 'react';
import { Etoffe } from '../ui/Etoffe';
import { useMouvementReduit } from '../../lib/mouvement';

function webglDisponible(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Drapé 3D. La bibliothèque Three.js n'est chargée que lorsque la section approche de l'écran.
 * Repli : étoffe dessinée (SVG) si WebGL est absent ou en cas d'erreur ; image fixe si le
 * visiteur a demandé la réduction des animations.
 */
export function DrapeEtoffe({ className = '' }: { className?: string }) {
  const conteneur = useRef<HTMLDivElement>(null);
  const reduit = useMouvementReduit();
  const [etat, setEtat] = useState<'attente' | 'pret' | 'repli'>('attente');

  useEffect(() => {
    const el = conteneur.current;
    if (!el) return;
    if (!webglDisponible()) {
      setEtat('repli');
      return;
    }
    let scene: { arreter: () => void } | null = null;
    let annule = false;

    const demarrer = async () => {
      try {
        const { monterDrape } = await import('./sceneDrape');
        if (annule) return;
        scene = monterDrape(el, { anime: !reduit });
        setEtat('pret');
      } catch {
        if (!annule) setEtat('repli');
      }
    };

    const approche = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          approche.disconnect();
          void demarrer();
        }
      },
      { rootMargin: '300px' },
    );
    approche.observe(el);

    return () => {
      annule = true;
      approche.disconnect();
      scene?.arreter();
    };
  }, [reduit]);

  return (
    <div className={`relative overflow-hidden bg-noir ${className}`}>
      {etat !== 'pret' && <Etoffe ton="wax" echelle={1.3} className="absolute inset-0" />}
      <div ref={conteneur} className={`absolute inset-0 transition-opacity duration-scene ${etat === 'pret' ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
    </div>
  );
}
