/**
 * Réglages de la boutique — seule source de vérité pour ces valeurs.
 * Le numéro WhatsApp vient de la variable d'environnement VITE_WHATSAPP_NUMBER
 * (voir .env.example). Tant qu'il est vide, le site l'indique honnêtement.
 */
const numeroBrut = (import.meta.env.VITE_WHATSAPP_NUMBER ?? '').replace(/\D/g, '');

export const site = {
  nom: 'KEWINA',
  devise: 'FCFA',
  whatsapp: numeroBrut.length >= 8 ? numeroBrut : null,
  /** Frais de livraison non configurés : jamais de montant inventé. */
  livraison: null as null | { montant: number },
} as const;

/** Formate un prix en FCFA : « 45 000 FCFA » (espace insécable fine entre milliers). */
export function formaterPrix(montant: number): string {
  const nombre = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(montant);
  return `${nombre} ${site.devise}`;
}
