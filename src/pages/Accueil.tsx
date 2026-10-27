import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Gem, Scissors, Sparkles } from 'lucide-react';
import { useCatalogue } from '../context/CatalogueContext';
import { CarteProduit } from '../components/produit/CarteProduit';
import type { TonEtoffe } from '../components/ui/Etoffe';
import { Photo } from '../components/ui/Photo';
import { DrapeEtoffe } from '../components/3d/DrapeEtoffe';
import { visuels, type Visuel } from '../config/visuels';
import { ChargementGrille, ErreurCatalogue } from '../components/ui/Etats';
import { useMouvementReduit } from '../lib/mouvement';

interface Diapo {
  titre: [string, string];
  texte: string;
  action: { libelle: string; vers: string };
  ton: TonEtoffe;
  visuel: Visuel;
  position: string;
}

const DIAPOS: Diapo[] = [
  {
    titre: ["L'élégance africaine", 'contemporaine'],
    texte: "Des créations inspirées de nos racines, pensées pour la femme et l'homme d'aujourd'hui.",
    action: { libelle: 'Découvrir la collection', vers: '/boutique' },
    ton: 'wax',
    visuel: visuels.hero[0],
    position: '75% center',
  },
  {
    titre: ["L'élégance", 'a du caractère'],
    texte: 'Des silhouettes affirmées, coupées dans des tissus choisis pour durer.',
    action: { libelle: 'Collection Femme', vers: '/boutique?genre=femme' },
    ton: 'terre',
    visuel: visuels.hero[1],
    position: '70% center',
  },
  {
    titre: ['Des matières,', 'un héritage vivant'],
    texte: 'Pagne, wax, lin : chaque pièce raconte un savoir-faire transmis.',
    action: { libelle: 'Voir les collections', vers: '/collections' },
    ton: 'bordeaux',
    visuel: visuels.hero[2],
    position: '72% center',
  },
];

const MOTS = ['Élégance', 'Culture', 'Matières', 'Savoir-faire'];

function Hero() {
  const [actif, setActif] = useState(0);
  const [pause, setPause] = useState(false);
  const reduit = useMouvementReduit();
  const aller = useCallback((i: number) => setActif((i + DIAPOS.length) % DIAPOS.length), []);

  useEffect(() => {
    if (reduit || pause) return;
    const t = window.setTimeout(() => aller(actif + 1), 7000);
    return () => window.clearTimeout(t);
  }, [actif, pause, reduit, aller]);

  return (
    <section
      className="zone-nuit relative isolate overflow-hidden bg-noir text-creme"
      aria-roledescription="carrousel"
      aria-label="À la une"
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
    >
      {DIAPOS.map((d, i) => (
        <div
          key={i}
          className={`absolute inset-0 -z-10 transition-all duration-scene ease-etoffe ${
            i === actif ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'
          }`}
          aria-hidden="true"
        >
          <Photo src={d.visuel.src} alt="" ton={d.ton} prioritaire={i === 0} sizes="100vw" position={d.position} className="h-full w-full" />
        </div>
      ))}
      {/* Mobile : la photo reste visible en haut, le texte se lit sur le dégradé du bas. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-noir via-noir/75 to-noir/5 lg:hidden" aria-hidden="true" />
      <div
        className="absolute inset-0 -z-10 hidden lg:block"
        style={{
          background:
            'linear-gradient(90deg, rgba(11,11,11,0.85) 0%, rgba(11,11,11,0.45) 32%, rgba(11,11,11,0) 58%), linear-gradient(0deg, rgba(11,11,11,0.6) 0%, rgba(11,11,11,0) 30%)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto grid min-h-[640px] max-w-[1440px] grid-cols-1 px-4 pb-10 pt-64 lg:min-h-[680px] lg:grid-cols-[1fr_auto] lg:px-12 lg:pb-12 lg:pt-28">
        <div className="flex max-w-xl flex-col justify-end gap-6" aria-live="polite">
          <span className="font-display text-sm uppercase tracking-surtitre text-bronze">KEWINA</span>
          <h1 key={actif} className="animate-apparition font-display text-[48px] font-medium leading-[0.95] sm:text-[64px] lg:text-[92px]">
            {DIAPOS[actif].titre[0]}
            <br />
            {DIAPOS[actif].titre[1]}
          </h1>
          <p className="max-w-md text-[15px] leading-relaxed text-sable lg:text-base">{DIAPOS[actif].texte}</p>
          <Link to={DIAPOS[actif].action.vers} className="btn btn-plein self-start">
            {DIAPOS[actif].action.libelle} <ArrowRight size={16} strokeWidth={1.5} />
          </Link>

          <div className="mt-6 flex items-center gap-6">
            <div className="flex gap-4 font-ui text-xs" role="tablist" aria-label="Choisir une diapositive">
              {DIAPOS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === actif}
                  aria-label={`Diapositive ${i + 1}`}
                  onClick={() => aller(i)}
                  className={`border-b pb-1 transition-colors ${i === actif ? 'border-creme text-creme' : 'border-transparent text-sable hover:text-creme'}`}
                >
                  {String(i + 1).padStart(2, '0')}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => aller(actif - 1)} className="grid h-9 w-9 place-items-center text-sable hover:text-creme" aria-label="Diapositive précédente">
                <ArrowLeft size={18} strokeWidth={1.5} />
              </button>
              <button type="button" onClick={() => aller(actif + 1)} className="grid h-9 w-9 place-items-center text-sable hover:text-creme" aria-label="Diapositive suivante">
                <ArrowRight size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        <div className="hidden flex-col items-end justify-center gap-10 lg:flex" aria-hidden="true">
          <ul className="flex flex-col items-end gap-1.5 font-display text-lg">
            {MOTS.map((m, i) => (
              <li key={m} className={i === 2 ? 'text-sable/60' : 'text-creme'}>{m}</li>
            ))}
          </ul>
          <div className="flex items-center gap-2 text-bronze">
            <span className="h-px w-10 bg-bronze/70" />
            <span className="h-3 w-3 rotate-45 border border-bronze" />
            <span className="h-px w-10 bg-bronze/70" />
          </div>
        </div>
      </div>
    </section>
  );
}

function BlocGenre({ titre, sousTitre, vers, ton, visuel }: { titre: string; sousTitre: string; vers: string; ton: TonEtoffe; visuel: Visuel }) {
  return (
    <Link to={vers} className="group relative block aspect-[4/5] overflow-hidden sm:aspect-[16/11]">
      <div className="absolute inset-0 transition-transform duration-lente ease-etoffe group-hover:scale-[1.04]">
        <Photo src={visuel.src} alt={visuel.alt} ton={ton} sizes="(min-width: 640px) 50vw, 100vw" position="center 15%" className="h-full w-full" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-noir/85 via-noir/20 to-transparent" />
      <div className="absolute bottom-6 left-6 right-6 text-creme lg:bottom-10 lg:left-10">
        <h3 className="font-display text-4xl uppercase tracking-wide lg:text-5xl">{titre}</h3>
        <p className="mt-1 font-display text-lg italic text-sable lg:text-xl">{sousTitre}</p>
        <span className="lien-souligne mt-5 inline-flex items-center gap-2 text-creme">
          Explorer la collection <ArrowRight size={14} strokeWidth={1.5} />
        </span>
      </div>
    </Link>
  );
}

export function Accueil() {
  const { produits, chargement, erreur } = useCatalogue();
  const nouveautes = [...produits].sort((a, b) => Number(b.nouveaute) - Number(a.nouveaute)).slice(0, 5);

  return (
    <>
      <Hero />

      <section className="mx-auto grid max-w-[1440px] gap-4 px-4 py-10 sm:grid-cols-2 lg:gap-6 lg:px-12 lg:py-14">
        <BlocGenre titre="Femme" sousTitre="Élégance & caractère" vers="/boutique?genre=femme" ton="terre" visuel={visuels.femme} />
        <BlocGenre titre="Homme" sousTitre="Allure & authenticité" vers="/boutique?genre=homme" ton="nuit" visuel={visuels.homme} />
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-16 lg:px-12 lg:pb-24">
        <div className="mb-6 flex items-end justify-between gap-4 lg:mb-8">
          <h2 className="font-display text-3xl font-medium lg:text-4xl">Nouveautés</h2>
          <Link to="/boutique?tri=nouveautes" className="inline-flex items-center gap-2 text-sm hover:text-terracotta-encre">
            Voir tout <ArrowRight size={15} strokeWidth={1.5} />
          </Link>
        </div>
        {erreur ? (
          <ErreurCatalogue />
        ) : chargement ? (
          <ChargementGrille nombre={5} colonnes="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" />
        ) : (
          <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-6 lg:overflow-visible lg:px-0">
            {nouveautes.map((p) => (
              <div key={p.id} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-auto">
                <CarteProduit produit={p} compacte />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="zone-nuit relative isolate overflow-hidden bg-noir text-creme" aria-label="Signature KEWINA">
        <DrapeEtoffe className="h-[460px] w-full sm:h-[540px] lg:h-[620px]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-noir via-noir/30 to-noir/60 lg:bg-gradient-to-r lg:from-noir lg:via-noir/50 lg:to-transparent" />
        <div className="pointer-events-none absolute inset-0 mx-auto flex max-w-[1440px] flex-col justify-end gap-5 px-4 pb-12 lg:justify-center lg:px-12 lg:pb-0">
          <span className="surtitre text-bronze">Signature KEWINA</span>
          <h2 className="max-w-md font-display text-[38px] font-medium leading-[1.02] lg:text-[56px]">Le wax, sous la lumière</h2>
          <p className="max-w-sm text-sm leading-relaxed text-sable">
            Nos pièces naissent d'une étoffe : ses motifs, son tombé, sa façon d'attraper la lumière. Approchez-vous, elle réagit à votre geste.
          </p>
          <Link to="/collections" className="lien-souligne pointer-events-auto mt-2 self-start text-creme">Explorer les collections</Link>
        </div>
        <span className="pointer-events-none absolute bottom-3 right-4 hidden text-[10px] uppercase tracking-bouton text-sable/70 lg:right-12 lg:block">Étoffe en 3D interactive</span>
      </section>

      <section className="zone-nuit bg-noir text-creme">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[1.1fr_1fr]">
          <div className="relative min-h-[300px] lg:min-h-[420px]">
            <Photo src={visuels.savoirFaire.src} alt={visuels.savoirFaire.alt} ton="wax" sizes="(min-width: 1024px) 55vw, 100vw" className="absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-noir/70 lg:to-noir" />
          </div>
          <div className="flex flex-col justify-center gap-6 px-4 py-14 lg:px-12">
            <span className="font-ui text-sm text-bronze">Notre savoir-faire</span>
            <h2 className="font-display text-[34px] font-medium leading-tight lg:text-[44px]">
              Des matières authentiques,
              <br />
              un héritage vivant
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-sable">
              Chaque pièce KEWINA est le fruit d'un savoir-faire artisanal et d'une passion profonde pour nos racines.
            </p>
            <Link to="/a-propos" className="btn btn-plein self-start">
              Découvrir notre univers <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
            <ul className="mt-4 grid grid-cols-3 gap-4 border-t border-ligne-nuit pt-8 text-center text-xs text-sable">
              <li className="flex flex-col items-center gap-3"><Sparkles size={26} strokeWidth={1.2} className="text-bronze" />Tissus africains sélectionnés</li>
              <li className="flex flex-col items-center gap-3"><Scissors size={26} strokeWidth={1.2} className="text-bronze" />Finitions soignées</li>
              <li className="flex flex-col items-center gap-3"><Gem size={26} strokeWidth={1.2} className="text-bronze" />Designs uniques</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
