export interface LienNav {
  libelle: string;
  chemin: string;
}

export const navigationPrincipale: LienNav[] = [
  { libelle: 'Accueil', chemin: '/' },
  { libelle: 'Boutique', chemin: '/boutique' },
  { libelle: 'Collections', chemin: '/collections' },
  { libelle: 'La Maison', chemin: '/a-propos' },
  { libelle: 'Lookbook', chemin: '/lookbook' },
  { libelle: 'Contact', chemin: '/contact' },
];

export const navigationBoutique: LienNav[] = [
  { libelle: 'Femme', chemin: '/boutique?genre=femme' },
  { libelle: 'Homme', chemin: '/boutique?genre=homme' },
  { libelle: 'Nouveautés', chemin: '/boutique?tri=nouveautes' },
  { libelle: 'Collections', chemin: '/collections' },
];

export const navigationAide: LienNav[] = [
  { libelle: 'FAQ', chemin: '/faq' },
  { libelle: 'Livraison', chemin: '/faq#livraison' },
  { libelle: 'Retours et échanges', chemin: '/faq#retours' },
  { libelle: 'Contact', chemin: '/contact' },
];

export const navigationLegale: LienNav[] = [
  { libelle: 'Mentions légales', chemin: '/mentions-legales' },
  { libelle: 'Confidentialité', chemin: '/confidentialite' },
  { libelle: 'Crédits photos', chemin: '/credits-photos' },
];
