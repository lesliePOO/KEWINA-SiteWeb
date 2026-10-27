/**
 * Réglages de la boutique — seule source de vérité pour ces valeurs.
 * Le numéro WhatsApp vient de la variable d'environnement VITE_WHATSAPP_NUMBER (voir .env.example).
 */
const numeroBrut = (import.meta.env.VITE_WHATSAPP_NUMBER ?? '').replace(/\D/g, '');

export const site = {
  nom: 'KEWINA',
  devise: 'FCFA',
  whatsapp: numeroBrut.length >= 8 ? numeroBrut : null,
  email: 'kewali237@gmail.com',
  fondatrice: 'Moungoue Silatsa Edwige Kersley',
  dateCreation: '2 mars 2025',
  pays: 'Cameroun',
  /** Frais de livraison : calculés selon la destination et confirmés sur WhatsApp. */
  livraison: null as null | { montant: number },
  /** Ce site est une vitrine de démonstration réalisée par l'agence. */
  agence: 'CampiTech',
} as const;

/**
 * Réseaux sociaux. Les comptes KEWINA n'existent pas encore : les liens mènent pour l'instant
 * aux plateformes. Remplacer chaque `url` par l'adresse du compte dès sa création.
 */
export const reseaux = [
  { nom: 'Instagram', url: 'https://www.instagram.com/' },
  { nom: 'TikTok', url: 'https://www.tiktok.com/' },
  { nom: 'Facebook', url: 'https://www.facebook.com/' },
  { nom: 'YouTube', url: 'https://www.youtube.com/' },
  { nom: 'Pinterest', url: 'https://www.pinterest.com/' },
] as const;

/** Formate un prix en FCFA : « 45 000 FCFA » (espace insécable fine entre milliers). */
export function formaterPrix(montant: number): string {
  const nombre = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(montant);
  return `${nombre} ${site.devise}`;
}
