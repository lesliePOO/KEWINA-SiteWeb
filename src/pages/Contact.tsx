import { useState, type FormEvent } from 'react';
import { Check, Mail, MapPin, MessageCircle } from 'lucide-react';
import { site } from '../config/site';
import { visuels } from '../config/visuels';
import { envoyerMessage } from '../services/catalogue';
import { lienWhatsApp, numeroAffiche } from '../lib/whatsapp';
import { EnteteNuit } from '../components/ui/EnteteNuit';
import { Reseaux } from '../components/ui/Reseaux';

const SUJETS = ['Question sur un produit', 'Suivi de ma demande de commande', 'Tailles et conseils', 'Collaboration / presse', 'Autre'];

interface Champs {
  nom: string;
  email: string;
  telephone: string;
  sujet: string;
  message: string;
}

const vide: Champs = { nom: '', email: '', telephone: '', sujet: SUJETS[0], message: '' };

function valider(c: Champs): Partial<Record<keyof Champs, string>> {
  const e: Partial<Record<keyof Champs, string>> = {};
  if (c.nom.trim().length < 2) e.nom = 'Indiquez votre nom.';
  if (!c.email.trim() && !c.telephone.trim()) e.email = 'Indiquez un e-mail ou un numéro de téléphone pour que nous puissions vous répondre.';
  if (c.email.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email.trim())) e.email = "Cette adresse e-mail n'est pas valide.";
  if (c.telephone.trim() && c.telephone.replace(/\D/g, '').length < 6) e.telephone = "Ce numéro semble incomplet.";
  if (c.message.trim().length < 10) e.message = 'Votre message doit contenir au moins 10 caractères.';
  return e;
}

export function Contact() {
  const [champs, setChamps] = useState<Champs>(vide);
  const [erreurs, setErreurs] = useState<Partial<Record<keyof Champs, string>>>({});
  const [etat, setEtat] = useState<'saisie' | 'envoi' | 'envoye' | 'echec'>('saisie');
  const wa = lienWhatsApp();
  const numero = numeroAffiche();

  const maj = (cle: keyof Champs) => (e: { target: { value: string } }) => {
    setChamps((c) => ({ ...c, [cle]: e.target.value }));
    if (erreurs[cle]) setErreurs((x) => ({ ...x, [cle]: undefined }));
  };

  const soumettre = async (e: FormEvent) => {
    e.preventDefault();
    const err = valider(champs);
    setErreurs(err);
    if (Object.keys(err).length) return;
    setEtat('envoi');
    try {
      await envoyerMessage(champs);
      setEtat('envoye');
      setChamps(vide);
    } catch {
      setEtat('echec');
    }
  };

  const champ = 'h-12 w-full border bg-blanc-casse px-3 text-base outline-none focus:border-brun';
  const bord = (cle: keyof Champs) => (erreurs[cle] ? 'border-carmin' : 'border-bord-controle');
  const msgErreur = (cle: keyof Champs) =>
    erreurs[cle] ? <span id={`err-${cle}`} className="text-sm text-carmin">{erreurs[cle]}</span> : null;

  return (
    <>
      <EnteteNuit surtitre="Contact" titre="Une question ? Nous sommes là pour vous aider." photo={visuels.tissus.src} position="center 40%" ton="terre" />

      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20 lg:px-12 lg:py-24">
        <aside className="flex flex-col gap-8">
          <div>
            <h2 className="font-display text-3xl">Contactez-nous</h2>
            <p className="mt-2 text-sm leading-relaxed text-encre-douce">La réponse la plus rapide passe par WhatsApp. Nous répondons aussi à tous les messages envoyés par e-mail ou par ce formulaire.</p>
          </div>
          <ul className="flex flex-col gap-5">
            {wa && numero && (
              <li>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-[#1a7a43] text-white"><MessageCircle size={20} /></span>
                  <span><span className="block text-sm font-medium">WhatsApp</span><span className="text-sm text-encre-douce">{numero}</span></span>
                </a>
              </li>
            )}
            <li>
              <a href={`mailto:${site.email}`} className="flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-brun text-creme"><Mail size={20} /></span>
                <span><span className="block text-sm font-medium">E-mail</span><span className="text-sm text-encre-douce">{site.email}</span></span>
              </a>
            </li>
            <li className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-terracotta-encre text-creme"><MapPin size={20} /></span>
              <span><span className="block text-sm font-medium">Livraison</span><span className="text-sm text-encre-douce">Partout au {site.pays} et à l'international</span></span>
            </li>
          </ul>
          <div>
            <p className="mb-3 text-xs uppercase tracking-label text-encre-douce">Suivez-nous</p>
            <div className="zone-nuit inline-block bg-noir p-3"><Reseaux /></div>
          </div>
        </aside>

        <div>
          {etat === 'envoye' ? (
            <div className="flex flex-col items-start gap-4 border border-ligne bg-blanc-casse p-8" role="status">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-dispo text-creme"><Check size={22} /></span>
              <h2 className="font-display text-3xl">Message envoyé</h2>
              <p className="text-sm text-encre-douce">Merci ! L'équipe KEWINA vous répondra très vite.</p>
              <button type="button" className="btn" onClick={() => setEtat('saisie')}>Envoyer un autre message</button>
            </div>
          ) : (
            <form onSubmit={(e) => void soumettre(e)} noValidate className="flex flex-col gap-5">
              <h2 className="font-display text-3xl">Écrivez-nous</h2>
              <label className="flex flex-col gap-1.5 text-sm">
                Nom complet *
                <input value={champs.nom} onChange={maj('nom')} autoComplete="name" maxLength={120} aria-invalid={!!erreurs.nom} aria-describedby="err-nom" className={`${champ} ${bord('nom')}`} />
                {msgErreur('nom')}
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-sm">
                  E-mail
                  <input type="email" value={champs.email} onChange={maj('email')} autoComplete="email" maxLength={200} aria-invalid={!!erreurs.email} aria-describedby="err-email" className={`${champ} ${bord('email')}`} />
                  {msgErreur('email')}
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                  Téléphone / WhatsApp
                  <input type="tel" value={champs.telephone} onChange={maj('telephone')} autoComplete="tel" maxLength={30} aria-invalid={!!erreurs.telephone} aria-describedby="err-telephone" className={`${champ} ${bord('telephone')}`} />
                  {msgErreur('telephone')}
                </label>
              </div>
              <label className="flex flex-col gap-1.5 text-sm">
                Sujet
                <select value={champs.sujet} onChange={maj('sujet')} className={`${champ} border-bord-controle`}>
                  {SUJETS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                Message *
                <textarea value={champs.message} onChange={maj('message')} rows={6} maxLength={3000} aria-invalid={!!erreurs.message} aria-describedby="err-message" className={`w-full border bg-blanc-casse p-3 text-base outline-none focus:border-brun ${bord('message')}`} />
                {msgErreur('message')}
              </label>
              {etat === 'echec' && <p className="text-sm text-carmin" role="alert">Le message n'a pas pu être envoyé. Vérifiez votre connexion ou écrivez-nous sur WhatsApp.</p>}
              <button type="submit" disabled={etat === 'envoi'} className="btn btn-plein self-start disabled:opacity-60">
                {etat === 'envoi' ? 'Envoi…' : 'Envoyer le message'}
              </button>
              <p className="text-xs text-encre-douce">Vos informations servent uniquement à vous répondre. Voir notre politique de confidentialité.</p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
