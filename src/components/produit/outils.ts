import type { Produit, Variante } from '../../types/catalogue';

export const ORDRE_TAILLES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Unique'];

export function trierTailles(tailles: string[]): string[] {
  return [...tailles].sort((a, b) => {
    const ia = ORDRE_TAILLES.indexOf(a);
    const ib = ORDRE_TAILLES.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
  });
}

export function taillesDe(p: Produit): string[] {
  return trierTailles([...new Set(p.variantes.map((v) => v.taille).filter((t): t is string => !!t))]);
}

export function couleursDe(p: Produit): { nom: string; hex: string }[] {
  const vues = new Map<string, string>();
  p.variantes.forEach((v) => {
    if (v.couleur && !vues.has(v.couleur)) vues.set(v.couleur, v.couleur_hex ?? '#9a8574');
  });
  return [...vues].map(([nom, hex]) => ({ nom, hex }));
}

export function stockTotal(p: Produit): number {
  return p.variantes.reduce((s, v) => s + v.stock, 0);
}

export type EtatStock = 'disponible' | 'faible' | 'epuise';

export function etatStock(stock: number, seuil: number): EtatStock {
  if (stock <= 0) return 'epuise';
  if (stock <= seuil) return 'faible';
  return 'disponible';
}

export function varianteDe(p: Produit, taille: string | null, couleur: string | null): Variante | undefined {
  return p.variantes.find((v) => (v.taille ?? null) === taille && (v.couleur ?? null) === couleur);
}
