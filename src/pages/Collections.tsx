import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCatalogue } from '../context/CatalogueContext';
import { Etoffe, type TonEtoffe } from '../components/ui/Etoffe';
import { Photo } from '../components/ui/Photo';
import { visuels } from '../config/visuels';
import { ChargementGrille, ErreurCatalogue, EtatVide } from '../components/ui/Etats';

const TONS: TonEtoffe[] = ['wax', 'bordeaux', 'terre', 'nuit'];

export function Collections() {
  const { collections, produits, chargement, erreur } = useCatalogue();

  return (
    <>
      <section className="zone-nuit relative isolate overflow-hidden bg-noir text-creme">
        <Photo src={visuels.tissus.src} alt="" ton="bordeaux" prioritaire position="center 60%" className="absolute inset-0 -z-10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-noir via-noir/70 to-noir/10" />
        <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-16 lg:px-12 lg:pb-14 lg:pt-24">
          <h1 className="font-display text-[42px] font-medium leading-none lg:text-6xl">Les collections</h1>
          <p className="mt-3 text-sm text-sable lg:text-base">Des pièces pensées ensemble, pour chaque saison et chaque occasion.</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 py-12 lg:px-12 lg:py-20">
        {erreur ? (
          <ErreurCatalogue />
        ) : chargement ? (
          <ChargementGrille nombre={2} colonnes="grid-cols-1 sm:grid-cols-2" />
        ) : collections.length === 0 ? (
          <EtatVide titre="Collections à venir" texte="Les collections KEWINA seront présentées ici." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {collections.map((c, i) => {
              const n = produits.filter((p) => p.collection?.slug === c.slug).length;
              return (
                <Link key={c.slug} to={`/boutique?collection=${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden sm:aspect-[5/6]">
                  <div className="absolute inset-0 transition-transform duration-lente ease-etoffe group-hover:scale-[1.04]">
                    {c.image_url ? (
                      <Photo src={c.image_url} alt={c.titre} ton={TONS[i % TONS.length]} sizes="(min-width: 640px) 50vw, 100vw" className="h-full w-full" />
                    ) : (
                      <Etoffe ton={TONS[i % TONS.length]} echelle={1.1} className="h-full w-full" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-noir/90 via-noir/25 to-transparent" />
                  <div className="absolute inset-x-6 bottom-6 text-creme lg:inset-x-10 lg:bottom-10">
                    <p className="text-xs uppercase tracking-surtitre text-or-lumiere">{n} pièce{n > 1 ? 's' : ''}</p>
                    <h2 className="mt-2 font-display text-4xl font-medium lg:text-5xl">{c.titre}</h2>
                    {c.description && <p className="mt-2 max-w-md text-sm text-sable">{c.description}</p>}
                    <span className="lien-souligne mt-5 inline-flex items-center gap-2">Voir la collection <ArrowRight size={14} /></span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
