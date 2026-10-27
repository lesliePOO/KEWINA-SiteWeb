import { Link, useLocation } from 'react-router-dom';
import { Check, MessageCircle } from 'lucide-react';
import { formaterPrix } from '../config/site';
import { lienWhatsApp, messageWhatsApp, type DemandePrete } from '../lib/whatsapp';
import { BandeWax } from '../components/ui/Etoffe';
import { EtatVide } from '../components/ui/Etats';

/** « Votre panier est prêt » : la demande est enregistrée, il reste à l'envoyer sur WhatsApp. */
export function CommandePrete() {
  const demande = useLocation().state as DemandePrete | null;

  if (!demande?.reference) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <EtatVide titre="Aucune demande en cours" texte="Préparez votre panier pour envoyer une demande de commande." action={{ libelle: 'Voir mon panier', vers: '/panier' }} />
      </div>
    );
  }

  const lien = lienWhatsApp(messageWhatsApp(demande));

  return (
    <div className="zone-nuit bg-noir text-creme">
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-4 py-16 text-center lg:py-24">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-creme text-noir">
          <Check size={30} strokeWidth={1.5} />
        </span>
        <h1 className="font-display text-4xl font-medium">Votre panier est prêt !</h1>
        <p className="text-sm leading-relaxed text-sable">
          Nous avons préparé un message récapitulatif avec tous les détails de votre demande <strong className="text-creme">{demande.reference}</strong>.
        </p>

        {lien ? (
          <a href={lien} target="_blank" rel="noopener noreferrer" className="btn w-full border-[#1a7a43] bg-[#1a7a43] text-white before:bg-[#146336] hover:text-white">
            <MessageCircle size={19} strokeWidth={1.6} /> Ouvrir WhatsApp
          </a>
        ) : (
          <p className="text-sm text-or-lumiere">Le numéro WhatsApp n'est pas encore configuré. Notez votre référence : {demande.reference}.</p>
        )}

        <div className="w-full border-t border-ligne-nuit pt-6 text-left">
          <p className="mb-3 text-xs uppercase tracking-label text-bronze">Récapitulatif envoyé</p>
          <ul className="flex flex-col gap-2 text-sm text-sable">
            {['Articles sélectionnés', 'Tailles et couleurs', 'Quantités', `Total estimé : ${formaterPrix(demande.total)}`].map((t) => (
              <li key={t} className="flex items-center gap-2"><Check size={15} className="text-[#3fbf72]" /> {t}</li>
            ))}
          </ul>
        </div>

        <p className="text-xs leading-relaxed text-sable">
          Vous pouvez modifier le message avant de l'envoyer. Votre commande sera confirmée par l'équipe KEWINA, avec les frais de livraison.
        </p>
        <Link to="/boutique" className="lien-souligne text-creme">Continuer mes achats</Link>
      </div>
      <BandeWax />
    </div>
  );
}
