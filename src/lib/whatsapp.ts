import { formaterPrix, site } from '../config/site';
import type { LigneDemande } from '../types/catalogue';

export interface DemandePrete {
  reference: string;
  total: number;
  lignes: LigneDemande[];
  nom: string;
  ville: string;
  contientDemo: boolean;
}

/** Message lisible envoyé à l'équipe KEWINA. Ce n'est qu'une demande : l'équipe confirme ensuite. */
export function messageWhatsApp(d: DemandePrete): string {
  const lignes = d.lignes.map((l) => {
    const variantes = [l.taille && `Taille ${l.taille}`, l.couleur].filter(Boolean).join(', ');
    return `• ${l.produit_nom}${variantes ? ` — ${variantes}` : ''} — ${l.quantite} × ${formaterPrix(l.prix_unitaire)}`;
  });
  return [
    `Bonjour KEWINA, je souhaite passer commande (réf. ${d.reference}) :`,
    ...lignes,
    `Total estimé : ${formaterPrix(d.total)} (livraison à confirmer)`,
    d.nom ? `Nom : ${d.nom}` : null,
    d.ville ? `Ville / quartier : ${d.ville}` : null,
    d.contientDemo ? '(Articles de démonstration — site en cours de préparation)' : null,
    'Merci de me confirmer la disponibilité et les frais de livraison.',
  ]
    .filter(Boolean)
    .join('\n');
}

export function lienWhatsApp(message?: string): string | null {
  if (!site.whatsapp) return null;
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** « +237 6 51 22 41 08 » pour l'affichage. */
export function numeroAffiche(): string | null {
  const n = site.whatsapp;
  if (!n) return null;
  if (n.startsWith('237') && n.length === 12) {
    const l = n.slice(3);
    return `+237 ${l[0]} ${l.slice(1, 3)} ${l.slice(3, 5)} ${l.slice(5, 7)} ${l.slice(7)}`;
  }
  return `+${n}`;
}
