import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCatalogue } from '../context/CatalogueContext';
import { CarteProduit } from '../components/produit/CarteProduit';
import { Etoffe, type TonEtoffe } from '../components/ui/Etoffe';
import { Photo } from '../components/ui/Photo';
import { Parallaxe, Revele } from '../components/ui/Mouvement';
import { visuels } from '../config/visuels';
import { ChargementGrille, ErreurCatalogue, EtatVide } from '../components/ui/Etats';
import type { Collection } from '../types/catalogue';

const TONS: TonEtoffe[] = ['wax', 'bordeaux', 'terre', 'nuit'];
const ROMAINS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

/** Récit éditorial propre à chaque collection (texte de la maison, en complément de la description). */
const RECITS: Record<string, { accroche: string; recit: string; cadrage?: string }> = {
  heritage: {
    accroche: 'Ce que nos mères nous ont transmis',
    recit:
      "Héritage part du pagne plié dans l'armoire familiale : ses motifs, ses couleurs franches, sa façon de raconter une famille. Nous l'avons recoupé pour aujourd'hui, avec des lignes nettes et des volumes simples, sans rien perdre de sa mémoire.",
  },
  ceremonie: {
    cadrage: '96% center',
    accroche: 'Pour les jours dont on se souvient',
    recit:
      "Mariages, dots, baptêmes, fins d'année : Cérémonie habille les grands moments. Broderies ton sur ton, tissus qui accrochent la lumière, tombés amples. Des pièces qu'on porte une fois pour l'événement et qu'on garde pour toujours.",
  },
};

/** La mention « démonstration » est affichée en étiquette, la description reste lisible. */
const sansPrefixeDemo = (texte: string | null) => {
  const t = texte?.replace(/^Collection de démonstration\s*:\s*/i, '').trim();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : null;
};

export function Collections() {
  const { collections, produits, chargement, erreur } = useCatalogue();

  return (
    <>
      <section className="zone-nuit relative isolate overflow-hidden bg-noir text-creme">
        <div className="absolute inset-0 -z-10">
          <div className="zoom-lent h-full w-full">
            <Photo src={visuels.hero[2].src} alt="" ton="bordeaux" prioritaire position="72% center" className="h-full w-full" />
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-noir via-noir/70 to-noir/0" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-noir/80 to-transparent" />
        <div className="mx-auto flex min-h-[380px] max-w-[1440px] flex-col justify-end px-4 pb-10 pt-24 lg:min-h-[520px] lg:px-12 lg:pb-16">
          <span className="surtitre text-bronze">Les collections</span>
          <h1 className="mt-4 font-display text-[46px] font-medium leading-[0.95] lg:text-[84px]">
            <span className="ligne-masque"><span>Des pièces</span></span>
            <span className="ligne-masque"><span className="italic text-or-lumiere" style={{ animationDelay: '140ms' }}>pensées ensemble</span></span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-sable lg:text-base">
            Chaque collection est un chapitre : une étoffe, une occasion, une histoire. Choisissez la vôtre.
          </p>
          {collections.length > 1 && (
            <nav aria-label="Chapitres" className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
              {collections.map((c, i) => (
                <a key={c.slug} href={`#${c.slug}`} className="group flex items-baseline gap-2 text-creme">
                  <span className="font-display text-sm italic text-bronze">{ROMAINS[i] ?? i + 1}.</span>
                  <span className="lien-souligne">{c.titre}</span>
                </a>
              ))}
            </nav>
          )}
        </div>
      </section>

      {erreur ? (
        <div className="mx-auto max-w-[1440px] px-4 py-16 lg:px-12"><ErreurCatalogue /></div>
      ) : chargement ? (
        <div className="mx-auto max-w-[1440px] px-4 py-16 lg:px-12"><ChargementGrille nombre={2} colonnes="grid-cols-1 sm:grid-cols-2" /></div>
      ) : collections.length === 0 ? (
        <div className="mx-auto max-w-[1440px] px-4 py-16 lg:px-12"><EtatVide titre="Collections à venir" texte="Les collections KEWINA seront présentées ici." /></div>
      ) : (
        collections.map((c, i) => (
          <Chapitre key={c.slug} collection={c} index={i} pieces={produits.filter((p) => p.collection?.slug === c.slug)} />
        ))
      )}

      <section className="zone-nuit bg-noir text-creme">
        <Revele className="mx-auto flex max-w-[1440px] flex-col items-start gap-6 px-4 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-20">
          <p className="max-w-xl font-display text-[30px] font-medium italic leading-tight lg:text-[44px]">Vous préférez tout voir d'un seul regard&nbsp;?</p>
          <Link to="/boutique" className="btn btn-plein">
            Toute la boutique <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </Revele>
      </section>
    </>
  );
}

function Chapitre({ collection: c, index: i, pieces }: { collection: Collection; index: number; pieces: ReturnType<typeof useCatalogue>['produits'] }) {
  const inverse = i % 2 === 1;
  const recit = RECITS[c.slug];
  const description = sansPrefixeDemo(c.description);
  const lien = `/boutique?collection=${c.slug}`;

  return (
    <section id={c.slug} className={`scroll-mt-24 ${inverse ? 'bg-blanc-casse' : 'bg-creme'}`} aria-labelledby={`titre-${c.slug}`}>
      <div className="mx-auto max-w-[1440px] px-4 py-16 lg:px-12 lg:py-28">
        <div className={`grid items-center gap-8 lg:grid-cols-12 lg:gap-16 ${inverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
          <Revele effet="rideau" className="lg:col-span-7">
            <Link to={lien} className="group relative block aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]" aria-label={`Voir la collection ${c.titre}`}>
              <div className="absolute inset-0 transition-transform duration-lente ease-etoffe group-hover:scale-[1.03]">
                <Parallaxe intensite={0.07}>
                  {c.image_url ? (
                    <Photo src={c.image_url} alt={c.titre} ton={TONS[i % TONS.length]} sizes="(min-width: 1024px) 58vw, 100vw" position={recit?.cadrage ?? 'center'} className="h-full w-full" />
                  ) : (
                    <Etoffe ton={TONS[i % TONS.length]} echelle={1.1} className="h-full w-full" />
                  )}
                </Parallaxe>
              </div>
              <span className="absolute left-5 top-4 font-display text-[88px] font-medium italic leading-none text-creme/85 lg:left-8 lg:text-[140px]" aria-hidden="true">
                {ROMAINS[i] ?? i + 1}
              </span>
            </Link>
          </Revele>

          <Revele delai={120} className="lg:col-span-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="surtitre text-terracotta-encre">Chapitre {ROMAINS[i] ?? i + 1}</span>
              {c.est_demo && <span className="etiquette-demo text-encre-douce">Démonstration</span>}
            </div>
            <h2 id={`titre-${c.slug}`} className="mt-4 font-display text-[52px] font-medium leading-none lg:text-[88px]">{c.titre}</h2>
            {recit && <p className="mt-4 font-display text-xl italic text-terracotta-encre lg:text-2xl">{recit.accroche}</p>}
            {description && <p className="mt-6 text-[15px] leading-relaxed text-brun">{description}</p>}
            {recit && <p className="mt-4 text-sm leading-relaxed text-encre-douce">{recit.recit}</p>}
            <div className="mt-8 flex items-center gap-6">
              <Link to={lien} className="btn btn-plein">
                {pieces.length > 0 ? `Voir les ${pieces.length} pièce${pieces.length > 1 ? 's' : ''}` : 'Voir la collection'} <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
            </div>
          </Revele>
        </div>

        {pieces.length > 0 && (
          <div className="mt-14 lg:mt-20">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h3 className="font-display text-2xl font-medium lg:text-3xl">Dans cette collection</h3>
              <Link to={lien} className="inline-flex items-center gap-2 text-sm hover:text-terracotta-encre">
                Tout voir <ArrowRight size={15} strokeWidth={1.5} />
              </Link>
            </div>
            <div className="sans-barre -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0">
              {pieces.slice(0, 4).map((p, j) => (
                <Revele key={p.id} delai={j * 90} className="w-[62%] shrink-0 snap-start sm:w-[38%] lg:w-auto">
                  <CarteProduit produit={p} compacte />
                </Revele>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
