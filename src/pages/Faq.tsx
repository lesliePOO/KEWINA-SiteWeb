import { useEffect, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { site } from '../config/site';
import { visuels } from '../config/visuels';
import { lienWhatsApp, numeroAffiche } from '../lib/whatsapp';
import { EnteteNuit } from '../components/ui/EnteteNuit';

interface Question {
  q: string;
  r: ReactNode;
}

function Bloc({ id, titre, questions }: { id: string; titre: string; questions: Question[] }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-ligne py-10 lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">
      <h2 className="mb-6 font-display text-3xl lg:mb-0">{titre}</h2>
      <div>
        {questions.map((x, i) => (
          <details key={x.q} open={i === 0} className="group border-b border-ligne py-5 first:pt-0">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium [&::-webkit-details-marker]:hidden">
              {x.q}
              <span className="text-xl text-encre-douce transition-transform group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <div className="mt-3 text-sm leading-relaxed text-encre-douce">{x.r}</div>
          </details>
        ))}
      </div>
    </section>
  );
}

const TAILLES_FEMME = [
  ['S', '36–38', '82–86', '64–68', '90–94'],
  ['M', '38–40', '86–90', '68–72', '94–98'],
  ['L', '40–42', '90–96', '72–78', '98–104'],
  ['XL', '42–44', '96–102', '78–84', '104–110'],
];
const TAILLES_HOMME = [
  ['S', '44–46', '88–94', '76–82', '90–96'],
  ['M', '46–48', '94–100', '82–88', '96–102'],
  ['L', '48–50', '100–106', '88–94', '102–108'],
  ['XL', '50–52', '106–112', '94–100', '108–114'],
];

function TableTailles({ titre, lignes }: { titre: string; lignes: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] text-left text-sm">
        <caption className="mb-2 text-left font-medium text-brun">{titre}</caption>
        <thead className="border-b border-brun text-xs uppercase tracking-label">
          <tr><th className="py-2">Taille</th><th>Équiv. FR</th><th>Poitrine (cm)</th><th>Taille (cm)</th><th>Hanches (cm)</th></tr>
        </thead>
        <tbody>
          {lignes.map((l) => (
            <tr key={l[0]} className="border-b border-ligne">{l.map((c, i) => <td key={i} className="py-2">{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Faq() {
  const { hash } = useLocation();
  const wa = lienWhatsApp();
  const numero = numeroAffiche();

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) {
      el.querySelector('details')?.setAttribute('open', '');
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash]);

  return (
    <>
      <EnteteNuit surtitre="Aide" titre="FAQ et livraison" texte="Tout ce qu'il faut savoir pour commander sereinement." photo={visuels.tissus.src} position="center 50%" ton="terre" />

      <div className="mx-auto max-w-[1200px] px-4 py-10 lg:px-12 lg:py-16">
        <nav className="mb-6 flex flex-wrap gap-2 text-sm" aria-label="Rubriques">
          {[['commander', 'Commander'], ['livraison', 'Livraison'], ['paiement', 'Paiement'], ['retours', 'Retours et échanges'], ['tailles', 'Guide des tailles']].map(([id, l]) => (
            <a key={id} href={`#${id}`} className="rounded-full border border-bord-controle px-4 py-2 hover:border-brun">{l}</a>
          ))}
        </nav>

        <Bloc
          id="commander"
          titre="Commander"
          questions={[
            { q: 'Comment passer commande ?', r: <p>Choisissez votre pièce, sa couleur et sa taille, ajoutez-la au panier puis cliquez sur « Commander via WhatsApp ». Un message récapitulatif est préparé avec une référence (KW-XXXXXX) : il ne vous reste qu'à l'envoyer.</p> },
            { q: 'Comment ma commande est-elle confirmée ?', r: <p>À réception de votre message, l'équipe KEWINA vérifie la disponibilité, vous indique les frais et le délai de livraison, puis vous envoie le moyen de paiement. Votre commande est confirmée dès le paiement reçu.</p> },
            { q: 'Dois-je créer un compte ?', r: <p>Non. Aucun compte n'est nécessaire : votre panier et vos favoris sont gardés sur votre appareil.</p> },
          ]}
        />
        <Bloc
          id="livraison"
          titre="Livraison"
          questions={[
            { q: 'Où livrez-vous ?', r: <p>Partout au {site.pays} et à l'international.</p> },
            { q: 'Quels sont les délais ?', r: <ul className="list-disc pl-5"><li>Douala et Yaoundé : 24 à 72 heures</li><li>Reste du {site.pays} : 2 à 5 jours ouvrés</li><li>International : 7 à 15 jours ouvrés selon la destination</li></ul> },
            { q: 'Combien coûte la livraison ?', r: <p>Les frais dépendent de la destination et du poids du colis. Ils vous sont communiqués sur WhatsApp avant toute validation : vous ne payez rien sans les connaître.</p> },
            { q: 'Comment suivre mon colis ?', r: <p>Une fois votre commande expédiée, l'équipe vous transmet les informations de suivi sur WhatsApp.</p> },
          ]}
        />
        <Bloc
          id="paiement"
          titre="Paiement"
          questions={[
            { q: 'Comment payer ?', r: <p>Le paiement se fait en ligne, après confirmation de votre commande : Orange Money, MTN Mobile Money ou carte bancaire. L'équipe vous envoie le moyen de paiement adapté sur WhatsApp.</p> },
            { q: 'En quelle devise sont les prix ?', r: <p>Tous les prix sont affichés en francs CFA (FCFA). Pour l'international, l'équipe vous indique le montant équivalent.</p> },
          ]}
        />
        <Bloc
          id="retours"
          titre="Retours et échanges"
          questions={[
            { q: 'Puis-je retourner ou échanger un article ?', r: <p>Non : les articles ne sont ni repris ni échangés. Pour bien choisir, consultez le <a href="#tailles" className="underline underline-offset-4">guide des tailles</a> et n'hésitez pas à nous demander conseil avant de commander.</p> },
            { q: 'Et si je reçois un article abîmé ?', r: <p>Contactez-nous sur WhatsApp dans les 48 heures suivant la réception, avec une photo de l'article : nous trouverons une solution avec vous.</p> },
          ]}
        />
        <section id="tailles" className="scroll-mt-28 border-t border-ligne py-10 lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">
          <div className="mb-6 lg:mb-0">
            <h2 className="font-display text-3xl">Guide des tailles</h2>
            <p className="mt-3 text-sm text-encre-douce">Mesures du corps, en centimètres. Entre deux tailles, prenez la plus grande ou demandez-nous conseil.</p>
          </div>
          <div className="flex flex-col gap-8">
            <TableTailles titre="Femme" lignes={TAILLES_FEMME} />
            <TableTailles titre="Homme" lignes={TAILLES_HOMME} />
          </div>
        </section>
        <section className="border-t border-ligne py-10 text-sm text-encre-douce">
          Une autre question ? Écrivez-nous {wa && numero ? <>sur <a href={wa} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">WhatsApp ({numero})</a>, </> : null}à{' '}
          <a href={`mailto:${site.email}`} className="underline underline-offset-4">{site.email}</a> ou via la <Link to="/contact" className="underline underline-offset-4">page contact</Link>.
        </section>
      </div>
    </>
  );
}
