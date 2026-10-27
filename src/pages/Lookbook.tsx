import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalogue } from '../context/CatalogueContext';
import { visuels } from '../config/visuels';
import { EnteteNuit } from '../components/ui/EnteteNuit';
import { Photo } from '../components/ui/Photo';
import type { Genre } from '../types/catalogue';

interface Vue {
  src: string;
  alt: string;
  legende: string;
  genre: Genre | 'tous';
  vers: string;
}

const FILTRES: { cle: 'tous' | Genre; libelle: string }[] = [
  { cle: 'tous', libelle: 'Toutes' },
  { cle: 'femme', libelle: 'Femme' },
  { cle: 'homme', libelle: 'Homme' },
];

/** Formats variés pour un rendu « magazine ». */
const FORMATS = ['aspect-[4/5]', 'aspect-[3/4]', 'aspect-square', 'aspect-[4/5]', 'aspect-[2/3]', 'aspect-[3/4]'];

export function Lookbook() {
  const { produits } = useCatalogue();
  const [filtre, setFiltre] = useState<'tous' | Genre>('tous');

  const vues = useMemo<Vue[]>(() => {
    const campagne: Vue[] = [
      { src: visuels.hero[0].src, alt: visuels.hero[0].alt, legende: 'Héritage', genre: 'femme', vers: '/collections' },
      { src: visuels.homme.src, alt: visuels.homme.alt, legende: 'Cérémonie', genre: 'homme', vers: '/boutique?genre=homme' },
      { src: visuels.femme.src, alt: visuels.femme.alt, legende: 'Lumière', genre: 'femme', vers: '/boutique?genre=femme' },
    ];
    const pieces: Vue[] = produits.flatMap((p) =>
      p.images.map((im) => ({ src: im.url, alt: im.alt || p.nom, legende: p.nom, genre: p.genre, vers: `/produit/${p.slug}` })),
    );
    const toutes = [...campagne, ...pieces];
    return filtre === 'tous' ? toutes : toutes.filter((v) => v.genre === filtre || v.genre === 'unisexe');
  }, [produits, filtre]);

  return (
    <>
      <EnteteNuit
        surtitre="Lookbook"
        titre="Une histoire de style et d'inspiration"
        texte="Silhouettes, matières, attitudes : laissez-vous inspirer, puis retrouvez chaque pièce en boutique."
        photo={visuels.hero[2].src}
        position="center 30%"
        ton="bordeaux"
      />

      <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-12 lg:py-16">
        <div className="mb-8 flex gap-2" role="tablist" aria-label="Filtrer le lookbook">
          {FILTRES.map((f) => (
            <button
              key={f.cle}
              type="button"
              role="tab"
              aria-selected={filtre === f.cle}
              onClick={() => setFiltre(f.cle)}
              className={`h-10 rounded-full border px-5 text-sm ${filtre === f.cle ? 'border-brun bg-brun text-creme' : 'border-bord-controle'}`}
            >
              {f.libelle}
            </button>
          ))}
        </div>

        <div className="columns-2 gap-3 sm:gap-4 lg:columns-3 lg:gap-6">
          {vues.map((v, i) => (
            <Link key={`${v.src}-${i}`} to={v.vers} className="group relative mb-3 block break-inside-avoid overflow-hidden sm:mb-4 lg:mb-6">
              <div className={`${FORMATS[i % FORMATS.length]} transition-transform duration-lente ease-etoffe group-hover:scale-[1.03]`}>
                <Photo src={v.src} alt={v.alt} ton="wax" sizes="(min-width: 1024px) 33vw, 50vw" className="h-full w-full" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-noir/70 via-transparent to-transparent opacity-90" />
              <span className="absolute bottom-3 left-3 right-3 font-display text-lg text-creme lg:bottom-5 lg:left-5 lg:text-2xl">{v.legende}</span>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-xs text-encre-douce">
          Photos d'illustration — voir les <Link to="/credits-photos" className="underline underline-offset-4">crédits photos</Link>.
        </p>
      </div>
    </>
  );
}
