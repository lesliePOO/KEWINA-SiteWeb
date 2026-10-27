import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { useMouvementReduit } from '../../lib/mouvement';

/** Vrai dès que l'élément entre dans l'écran (une seule fois). */
export function useVisible<T extends Element>(marge = '0px 0px -12% 0px') {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: marge },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [marge, visible]);
  return { ref, visible };
}

type Effet = 'monte' | 'rideau' | 'fondu';

/** Révèle son contenu à l'entrée dans l'écran : montée douce, rideau ou fondu. */
export function Revele({
  children,
  effet = 'monte',
  delai = 0,
  className = '',
  as: Balise = 'div',
}: {
  children: ReactNode;
  effet?: Effet;
  delai?: number;
  className?: string;
  as?: ElementType;
}) {
  const { ref, visible } = useVisible<HTMLDivElement>();
  return (
    <Balise ref={ref} className={`revele revele-${effet} ${visible ? 'est-visible' : ''} ${className}`} style={{ transitionDelay: `${delai}ms` } as CSSProperties}>
      {children}
    </Balise>
  );
}

/** Léger décalage de profondeur au défilement (ordinateur uniquement, désactivé si mouvement réduit). */
export function Parallaxe({ children, intensite = 0.12, className = '' }: { children: ReactNode; intensite?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduit = useMouvementReduit();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduit || !window.matchMedia('(min-width: 1024px)').matches) return;
    let raf = 0;
    const maj = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const centre = r.top + r.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${(-centre * intensite).toFixed(1)}px, 0) scale(1.12)`;
    };
    const surDefilement = () => {
      if (!raf) raf = requestAnimationFrame(maj);
    };
    maj();
    window.addEventListener('scroll', surDefilement, { passive: true });
    window.addEventListener('resize', surDefilement);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', surDefilement);
      window.removeEventListener('resize', surDefilement);
    };
  }, [intensite, reduit]);
  return (
    <div ref={ref} className={`h-full w-full will-change-transform ${className}`}>
      {children}
    </div>
  );
}
