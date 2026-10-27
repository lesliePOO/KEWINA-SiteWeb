import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ecrireStockage, lireStockage } from '../lib/stockage';

const CLE = 'kewina.favoris.v1';

interface EtatFavoris {
  favoris: string[];
  estFavori: (slug: string) => boolean;
  basculer: (slug: string) => void;
}

const Contexte = createContext<EtatFavoris | null>(null);

/** Favoris gardés sur l'appareil du visiteur (pas de compte client en V1). */
export function FavorisProvider({ children }: { children: ReactNode }) {
  const [favoris, setFavoris] = useState<string[]>(() => {
    const brut = lireStockage<unknown>(CLE, []);
    return Array.isArray(brut) ? brut.filter((s): s is string => typeof s === 'string') : [];
  });

  useEffect(() => ecrireStockage(CLE, favoris), [favoris]);

  const basculer = useCallback(
    (slug: string) => setFavoris((a) => (a.includes(slug) ? a.filter((s) => s !== slug) : [...a, slug])),
    [],
  );

  const valeur = useMemo(() => ({ favoris, estFavori: (s: string) => favoris.includes(s), basculer }), [favoris, basculer]);
  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>;
}

export function useFavoris() {
  const c = useContext(Contexte);
  if (!c) throw new Error('useFavoris doit être utilisé dans FavorisProvider');
  return c;
}
