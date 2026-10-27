import { supabase } from '../lib/supabase';
import type { Categorie, Collection, LignePanier, Produit, ResultatDemande } from '../types/catalogue';

export interface DonneesCatalogue {
  produits: Produit[];
  categories: Categorie[];
  collections: Collection[];
  seuilStockFaible: number;
}

const CHAMPS_PRODUIT =
  'id, slug, nom, description, matieres, confection, entretien, genre, prix, nouveaute, est_demo, created_at,' +
  ' categorie:categories(slug, nom), collection:collections(slug, titre),' +
  ' images:produit_images(url, alt, ordre, credit), variantes(id, taille, couleur, couleur_hex, stock, actif)';

function exigerClient() {
  if (!supabase) throw new Error('La connexion à la boutique n’est pas configurée.');
  return supabase;
}

export async function chargerCatalogue(): Promise<DonneesCatalogue> {
  const client = exigerClient();
  const [produits, categories, collections, reglages] = await Promise.all([
    client.from('produits').select(CHAMPS_PRODUIT).eq('statut', 'actif').order('created_at', { ascending: false }),
    client.from('categories').select('slug, nom, ordre').order('ordre'),
    client.from('collections').select('slug, titre, description, image_url, image_credit, est_demo, ordre').eq('actif', true).order('ordre'),
    client.from('reglages').select('cle, valeur').eq('cle', 'seuil_stock_faible').maybeSingle(),
  ]);

  const erreur = produits.error ?? categories.error ?? collections.error;
  if (erreur) throw new Error(erreur.message);

  const liste = ((produits.data ?? []) as unknown as Produit[]).map((p) => ({
    ...p,
    images: [...(p.images ?? [])].sort((a, b) => a.ordre - b.ordre),
    variantes: (p.variantes ?? []).filter((v) => v.actif),
  }));

  const seuil = Number(reglages.data?.valeur);
  return {
    produits: liste,
    categories: (categories.data ?? []) as Categorie[],
    collections: (collections.data ?? []) as Collection[],
    seuilStockFaible: Number.isFinite(seuil) && seuil > 0 ? seuil : 3,
  };
}

/** Enregistre la demande côté serveur : prix et stocks y sont relus, jamais ceux du navigateur. */
export async function creerDemande(lignes: LignePanier[], nom: string, ville: string): Promise<ResultatDemande> {
  const client = exigerClient();
  const { data, error } = await client.rpc('creer_demande_commande', {
    p_lignes: lignes.map((l) => ({ variante_id: l.varianteId, quantite: l.quantite })),
    p_nom: nom || null,
    p_ville: ville || null,
  });
  if (error) throw new Error(error.message);
  return data as ResultatDemande;
}
