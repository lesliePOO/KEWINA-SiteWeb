export interface LienNav {
  libelle: string;
  chemin: string;
}

export const navigationPrincipale: LienNav[] = [
  { libelle: 'Accueil', chemin: '/' },
  { libelle: 'Boutique', chemin: '/boutique' },
  { libelle: 'Collections', chemin: '/collections' },
  { libelle: 'La Maison', chemin: '/a-propos' },
  { libelle: 'Contact', chemin: '/contact' },
];

export const navigationAide: LienNav[] = [
  { libelle: 'FAQ et livraison', chemin: '/faq' },
  { libelle: 'Contact', chemin: '/contact' },
  { libelle: 'À propos', chemin: '/a-propos' },
];

export const navigationLegale: LienNav[] = [
  { libelle: 'Mentions légales', chemin: '/mentions-legales' },
  { libelle: 'Confidentialité', chemin: '/confidentialite' },
];
