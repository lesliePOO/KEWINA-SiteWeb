export type Genre = 'femme' | 'homme' | 'unisexe';

export interface Categorie {
  slug: string;
  nom: string;
  ordre: number;
}

export interface Collection {
  slug: string;
  titre: string;
  description: string | null;
  image_url: string | null;
  image_credit: string | null;
  est_demo: boolean;
  ordre: number;
}

export interface ImageProduit {
  url: string;
  alt: string;
  ordre: number;
  credit: string | null;
}

export interface Variante {
  id: string;
  taille: string | null;
  couleur: string | null;
  couleur_hex: string | null;
  stock: number;
  actif: boolean;
}

export interface Produit {
  id: string;
  slug: string;
  nom: string;
  description: string | null;
  matieres: string | null;
  confection: string | null;
  entretien: string | null;
  genre: Genre;
  prix: number;
  nouveaute: boolean;
  est_demo: boolean;
  created_at: string;
  categorie: { slug: string; nom: string } | null;
  collection: { slug: string; titre: string } | null;
  images: ImageProduit[];
  variantes: Variante[];
}

export interface LignePanier {
  varianteId: string;
  quantite: number;
}

export interface ProblemeDemande {
  variante_id: string;
  probleme: 'indisponible' | 'quantite_invalide' | 'stock_insuffisant';
  stock?: number;
}

export interface LigneDemande {
  variante_id: string;
  produit_nom: string;
  taille: string | null;
  couleur: string | null;
  quantite: number;
  prix_unitaire: number;
}

export type ResultatDemande =
  | { ok: true; reference: string; total_estime: number; lignes: LigneDemande[] }
  | { ok: false; problemes: ProblemeDemande[] };
