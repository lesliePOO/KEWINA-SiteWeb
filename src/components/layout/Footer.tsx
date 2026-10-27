import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { navigationAide, navigationBoutique, navigationLegale } from '../../config/navigation';
import { lienWhatsApp, numeroAffiche } from '../../lib/whatsapp';
import { BandeWax } from '../ui/Etoffe';

export function Footer() {
  const numero = numeroAffiche();
  const lien = lienWhatsApp();

  return (
    <footer className="zone-nuit bg-noir text-sable">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 pb-10 pt-16 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:px-12 lg:pt-20">
        <div className="flex flex-col gap-5">
          <Link to="/" aria-label="KEWINA, accueil" className="flex items-center gap-3 self-start">
            <img src="/brand/kewina-monogramme.webp" alt="" className="h-14 w-auto" width={480} height={394} loading="lazy" />
            <img src="/brand/kewina-wordmark.png" alt="KEWINA" className="h-6 w-auto" width={640} height={120} loading="lazy" />
          </Link>
          <p className="text-sm">Élégance africaine contemporaine</p>
          <p className="font-display text-lg italic text-or-lumiere">Élégance · Culture · Vous</p>
        </div>

        <Colonne titre="Navigation">
          {navigationBoutique.map((l) => (
            <Link key={l.chemin} to={l.chemin} className="hover:text-creme">{l.libelle}</Link>
          ))}
          <Link to="/a-propos" className="hover:text-creme">La Maison</Link>
        </Colonne>

        <Colonne titre="Service client">
          {navigationAide.map((l) => (
            <Link key={l.chemin} to={l.chemin} className="hover:text-creme">{l.libelle}</Link>
          ))}
        </Colonne>

        <Colonne titre="WhatsApp">
          {numero && lien ? (
            <a href={lien} target="_blank" rel="noopener noreferrer" className="hover:text-creme">{numero}</a>
          ) : (
            <span>Numéro à communiquer</span>
          )}
          <span className="text-xs leading-relaxed">Les commandes sont confirmées avec l'équipe sur WhatsApp.</span>
        </Colonne>
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-wrap justify-between gap-4 border-t border-ligne-nuit px-4 py-6 text-xs lg:px-12">
        <span>© {new Date().getFullYear()} KEWINA. Tous droits réservés.</span>
        <span className="flex gap-6">
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
