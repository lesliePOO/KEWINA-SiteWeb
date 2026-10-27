import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ecrireStockage, lireStockage } from '../lib/stockage';
import type { LignePanier } from '../types/catalogue';

const CLE = 'kewina.panier.v1';
const QTE_MAX = 20;

interface EtatPanier {
  lignes: LignePanier[];
  nombreArticles: number;
  ajouter: (varianteId: string, quantite: number) => void;
  changerQuantite: (varianteId: string, quantite: number) => void;
  retirer: (varianteId: string) => void;
  vider: () => void;
}

const Contexte = createContext<EtatPanier | null>(null);

function nettoyer(valeur: unknown): LignePanier[] {
  if (!Array.isArray(valeur)) return [];
  return valeur
    .filter((l): l is LignePanier => typeof l?.varianteId === 'string' && Number.isInteger(l?.quantite))
    .map((l) => ({ varianteId: l.varianteId, quantite: Math.min(Math.max(l.quantite, 1), QTE_MAX) }));
}

export function PanierProvider({ children }: { children: ReactNode }) {
  const [lignes, setLignes] = useState<LignePanier[]>(() => nettoyer(lireStockage(CLE, [])));

  useEffect(() => ecrireStockage(CLE, lignes), [lignes]);

  const ajouter = useCallback((varianteId: string, quantite: number) => {
    setLignes((actuel) => {
      const existante = actuel.find((l) => l.varianteId === varianteId);
      if (existante) {
        return actuel.map((l) => (l.varianteId === varianteId ? { ...l, quantite: Math.min(l.quantite + quantite, QTE_MAX) } : l));
      }
      return [...actuel, { varianteId, quantite: Math.min(quantite, QTE_MAX) }];
    });
  }, []);

  const changerQuantite = useCallback((varianteId: string, quantite: number) => {
    setLignes((actuel) =>
      actuel.map((l) => (l.varianteId === varianteId ? { ...l, quantite: Math.min(Math.max(quantite, 1), QTE_MAX) } : l)),
    );
  }, []);

  const retirer = useCallback((varianteId: string) => setLignes((a) => a.filter((l) => l.varianteId !== varianteId)), []);
  const vider = useCallback(() => setLignes([]), []);

  const valeur = useMemo(
    () => ({ lignes, nombreArticles: lignes.reduce((s, l) => s + l.quantite, 0), ajouter, changerQuantite, retirer, vider }),
    [lignes, ajouter, changerQuantite, retirer, vider],
  );

  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>;
}

export function usePanier() {
  const c = useContext(Contexte);
  if (!c) throw new Error('usePanier doit être utilisé dans PanierProvider');
  return c;
}
