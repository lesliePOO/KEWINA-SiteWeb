import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { chargerCatalogue, type DonneesCatalogue } from '../services/catalogue';
import type { Produit, Variante } from '../types/catalogue';

interface EtatCatalogue extends DonneesCatalogue {
  chargement: boolean;
  erreur: string | null;
  recharger: () => Promise<void>;
  produitParSlug: (slug: string) => Produit | undefined;
  trouverVariante: (id: string) => { produit: Produit; variante: Variante } | undefined;
}

const vide: DonneesCatalogue = { produits: [], categories: [], collections: [], seuilStockFaible: 3 };
const Contexte = createContext<EtatCatalogue | null>(null);

export function CatalogueProvider({ children }: { children: ReactNode }) {
  const [donnees, setDonnees] = useState<DonneesCatalogue>(vide);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  const recharger = useCallback(async () => {
    setChargement(true);
    setErreur(null);
    try {
      setDonnees(await chargerCatalogue());
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    void recharger();
  }, [recharger]);

  const valeur = useMemo<EtatCatalogue>(() => {
    const parSlug = new Map(donnees.produits.map((p) => [p.slug, p]));
    const parVariante = new Map<string, { produit: Produit; variante: Variante }>();
    donnees.produits.forEach((produit) => produit.variantes.forEach((variante) => parVariante.set(variante.id, { produit, variante })));
    return {
      ...donnees,
      chargement,
      erreur,
      recharger,
      produitParSlug: (slug) => parSlug.get(slug),
      trouverVariante: (id) => parVariante.get(id),
    };
  }, [donnees, chargement, erreur, recharger]);

  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>;
}

export function useCatalogue() {
  const c = useContext(Contexte);
  if (!c) throw new Error('useCatalogue doit être utilisé dans CatalogueProvider');
  return c;
}
