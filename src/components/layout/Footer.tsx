import { useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { navigationAide, navigationBoutique, navigationLegale } from '../../config/navigation';
import { site } from '../../config/site';
import { inscrireLettre } from '../../services/catalogue';
import { lienWhatsApp, numeroAffiche } from '../../lib/whatsapp';
import { BandeWax } from '../ui/Etoffe';
import { Reseaux } from '../ui/Reseaux';

function LettreInformation() {
  const [email, setEmail] = useState('');
  const [etat, setEtat] = useState<'saisie' | 'envoi' | 'ok' | 'invalide' | 'echec'>('saisie');

  const soumettre = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setEtat('invalide');
      return;
    }
    setEtat('envoi');
    try {
      await inscrireLettre(email);
      setEtat('ok');
      setEmail('');
    } catch {
      setEtat('echec');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="font-ui text-xs font-medium uppercase tracking-label text-bronze">Restez informé(e) de nos nouveautés</span>
      {etat === 'ok' ? (
        <p className="flex items-center gap-2 text-sm text-creme" role="status"><Check size={16} className="text-or-lumiere" /> Merci, votre inscription est enregistrée.</p>
      ) : (
        <form onSubmit={(e) => void soumettre(e)} noValidate className="flex max-w-sm">
          <label className="sr-only" htmlFor="lettre-email">Votre adresse e-mail</label>
          <input
            id="lettre-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (etat !== 'saisie') setEtat('saisie'); }}
            placeholder="Votre adresse e-mail"
            autoComplete="email"
            aria-invalid={etat === 'invalide'}
            className="h-11 min-w-0 flex-1 border border-ligne-nuit bg-transparent px-3 text-sm text-creme outline-none placeholder:text-sable/70 focus:border-bronze"
          />
          <button type="submit" disabled={etat === 'envoi'} aria-label="S'inscrire" className="grid h-11 w-11 shrink-0 place-items-center bg-bronze text-noir hover:bg-or-lumiere disabled:opacity-60">
            <ArrowRight size={18} />
          </button>
        </form>
      )}
      {etat === 'invalide' && <p className="text-xs text-or-lumiere">Indiquez une adresse e-mail valide.</p>}
      {etat === 'echec' && <p className="text-xs text-or-lumiere">L'inscription n'a pas abouti. Réessayez dans un instant.</p>}
    </div>
  );
}

export function Footer() {
  const numero = numeroAffiche();
  const lien = lienWhatsApp();

  return (
    <footer className="zone-nuit bg-noir text-sable">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 pb-10 pt-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1.4fr_1fr_1fr_1fr] lg:gap-10 lg:px-12 lg:pt-20">
        <div className="flex flex-col gap-5">
          <Link to="/" aria-label="KEWINA, accueil" className="flex items-center gap-3 self-start">
            <img src="/brand/kewina-monogramme.webp" alt="" className="h-14 w-auto" width={480} height={394} loading="lazy" />
            <img src="/brand/kewina-wordmark.png" alt="KEWINA" className="h-6 w-auto" width={640} height={120} loading="lazy" />
          </Link>
          <p className="text-sm">Élégance africaine contemporaine</p>
          <Reseaux />
        </div>

        <LettreInformation />

        <Colonne titre="Navigation">
          {navigationBoutique.map((l) => (
            <Link key={l.chemin} to={l.chemin} className="hover:text-creme">{l.libelle}</Link>
          ))}
          <Link to="/a-propos" className="hover:text-creme">La Maison</Link>
          <Link to="/lookbook" className="hover:text-creme">Lookbook</Link>
        </Colonne>

        <Colonne titre="Service client">
          {navigationAide.map((l) => (
            <Link key={l.chemin} to={l.chemin} className="hover:text-creme">{l.libelle}</Link>
          ))}
        </Colonne>

        <Colonne titre="Nous joindre">
          {numero && lien && <a href={lien} target="_blank" rel="noopener noreferrer" className="hover:text-creme">WhatsApp : {numero}</a>}
          <a href={`mailto:${site.email}`} className="break-all hover:text-creme">{site.email}</a>
          <span>Livraison au {site.pays} et à l'international</span>
        </Colonne>
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-wrap justify-between gap-4 border-t border-ligne-nuit px-4 py-6 text-xs lg:px-12">
        <span>© {new Date().getFullYear()} KEWINA. Tous droits réservés. · Boutique de démonstration réalisée par {site.agence}.</span>
        <span className="flex flex-wrap gap-x-6 gap-y-2">
          {navigationLegale.map((l) => (
            <Link key={l.chemin} to={l.chemin} className="hover:text-creme">{l.libelle}</Link>
          ))}
        </span>
      </div>
      <BandeWax />
    </footer>
  );
}

function Colonne({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <span className="mb-1 font-ui text-xs font-medium uppercase tracking-label text-bronze">{titre}</span>
      {children}
    </div>
  );
}
