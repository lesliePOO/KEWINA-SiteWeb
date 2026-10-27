/**
 * Visuels de campagne KEWINA : shooting généré par IA pour cette boutique de démonstration
 * (fichiers dans public/shooting, en deux tailles chacun). Même lumière dorée, même univers wax.
 */
export interface Visuel {
  src: string;
  alt: string;
  credit: string;
  page?: string;
}

const ia = (nom: string, largeur: number, alt: string): Visuel => ({ src: `/shooting/${nom}-${largeur}.webp`, alt, credit: 'Visuel généré par IA — KEWINA' });

export const visuels = {
  hero: [
    ia('campagne-femme', 1376, 'Femme en robe longue wax et foulard de tête, lumière dorée'),
    ia('campagne-homme', 1376, 'Homme en ensemble brodé noir et or'),
    ia('campagne-duo', 1376, 'Femme et homme en tenues wax coordonnées'),
  ],
  femme: ia('portrait-femme', 928, 'Femme en robe wax à épaules dénudées et foulard de tête'),
  homme: ia('portrait-homme', 928, 'Homme en kaftan wax noir et or avec kufi'),
  savoirFaire: ia('atelier', 1200, "Couturière coupant un tissu wax dans l'atelier"),
  tissus: ia('tissus', 1376, 'Tissus wax pliés et drapés sous une lumière dorée'),
} satisfies Record<string, Visuel | Visuel[]>;

export const tousLesVisuels: Visuel[] = [...visuels.hero, visuels.femme, visuels.homme, visuels.savoirFaire, visuels.tissus];
