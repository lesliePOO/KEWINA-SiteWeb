import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { navigationAide, navigationLegale, navigationPrincipale } from '../../config/navigation';
import { site } from '../../config/site';

export function Footer() {
  return (
    <footer className="zone-nuit bg-noir text-sable">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 pb-10 pt-16 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:px-12 lg:pt-20">
        <div className="flex flex-col gap-5">
          <img src="/brand/kewina-wordmark.png" alt="KEWINA" className="h-7 w-auto self-start" width={640} height={120} loading="lazy" />
          <p className="max-w-xs text-sm leading-relaxed">Mode africaine contemporaine pour femmes et hommes.</p>
          <p className="font-display text-lg italic text-or-lumiere">Élégance · Culture · Vous</p>
        </div>

        <FooterColonne titre="Boutique">
          {navigationPrincipale.slice(1, 3).map((l) => (
            <Link key={l.chemin} to={l.chemin} className="hover:text-creme">
              {l.libelle}
            </Link>
          ))}
        </FooterColonne>

        <FooterColonne titre="Aide">
          {navigationAide.map((l) => (
            <Link key={l.chemin} to={l.chemin} className="hover:text-creme">
              {l.libelle}
            </Link>
          ))}
        </FooterColonne>

        <FooterColonne titre="WhatsApp">
          <span>{site.whatsapp ? `+${site.whatsapp}` : 'Numéro à communiquer prochainement'}</span>
        </FooterColonne>
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-wrap justify-between gap-4 border-t border-ligne-nuit px-4 py-6 text-xs lg:px-12">
        <span>© {new Date().getFullYear()} KEWINA</span>
        <span className="flex gap-6">
          {navigationLegale.map((l) => (
            <Link key={l.chemin} to={l.chemin} className="hover:text-creme">
              {l.libelle}
            </Link>
          ))}
        </span>
      </div>
    </footer>
  );
}

function FooterColonne({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3.5 text-sm">
      <span className="font-ui text-xs font-medium uppercase tracking-label text-bronze">{titre}</span>
      {children}
    </div>
  );
}
