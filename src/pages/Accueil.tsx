import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Gem, Scissors, Sparkles } from 'lucide-react';
import { useCatalogue } from '../context/CatalogueContext';
import { CarteProduit } from '../components/produit/CarteProduit';
import { Etoffe, type TonEtoffe } from '../components/ui/Etoffe';
import { ChargementGrille, ErreurCatalogue } from '../components/ui/Etats';
import { useMouvementReduit } from '../lib/mouvement';

interface Diapo {
  titre: [string, string];
  texte: string;
  action: { libelle: string; vers: string };
  ton: TonEtoffe;
}

const DIAPOS: Diapo[] = [
  {
    titre: ["L'élégance africaine", 'contemporaine'],
    texte: "Des créations inspirées de nos racines, pensées pour la femme et l'homme d'aujourd'hui.",
    action: { libelle: 'Découvrir la collection', vers: '/boutique' },
    ton: 'wax',
  },
  {
    titre: ["L'élégance", 'a du caractère'],
    texte: 'Des silhouettes affirmées, coupées dans des tissus choisis pour durer.',
    action: { libelle: 'Collection Femme', vers: '/boutique?genre=femme' },
    ton: 'terre',
  },
  {
    titre: ['Des matières,', 'un héritage vivant'],
    texte: 'Pagne, wax, lin : chaque pièce raconte un savoir-faire transmis.',
    action: { libelle: 'Voir les collections', vers: '/collections' },
    ton: 'bordeaux',
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
          className={`absolute inset-y-0 right-0 -z-10 w-full transition-all duration-scene ease-etoffe lg:w-[72%] ${
            i === actif ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'
          }`}
          aria-hidden="true"
        >
          <Etoffe ton={d.ton} echelle={1.3} className="h-full w-full" />
        </div>
      ))}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(90deg, #0b0b0b 0%, rgba(11,11,11,0.92) 28%, rgba(11,11,11,0.35) 62%, rgba(11,11,11,0.15) 100%), linear-gradient(0deg, rgba(11,11,11,0.9) 0%, rgba(11,11,11,0) 40%)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto grid min-h-[620px] max-w-[1440px] grid-cols-1 px-4 pb-10 pt-24 lg:min-h-[680px] lg:grid-cols-[1fr_auto] lg:px-12 lg:pb-12 lg:pt-28">
        <div className="flex max-w-xl flex-col justify-end gap-6" aria-live="polite">
          <span className="font-display text-sm uppercase tracking-surtitre text-bronze">KEWINA</span>
          <h1 key={actif} className="animate-apparition font-display text-[46px] font-medium leading-[0.98] sm:text-[60px] lg:text-[76px]">
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
      <span className="absolute bottom-3 right-4 text-[10px] uppercase tracking-bouton text-sable/70 lg:right-12">Photo de campagne à fournir</span>
    </section>
  );
}

function BlocGenre({ titre, sousTitre, vers, ton }: { titre: string; sousTitre: string; vers: string; ton: TonEtoffe }) {
  return (
    <Link to={vers} className="group relative block aspect-[4/5] overflow-hidden sm:aspect-[16/11]">
      <div className="absolute inset-0 transition-transform duration-lente ease-etoffe group-hover:scale-[1.04]">
        <Etoffe ton={ton} echelle={1.1} className="h-full w-full" />
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
        <BlocGenre titre="Femme" sousTitre="Élégance & caractère" vers="/boutique?genre=femme" ton="terre" />
        <BlocGenre titre="Homme" sousTitre="Allure & authenticité" vers="/boutique?genre=homme" ton="nuit" />
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

      <section className="zone-nuit bg-noir text-creme">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[1.1fr_1fr]">
          <div className="relative min-h-[300px] lg:min-h-[420px]">
            <Etoffe ton="wax" echelle={0.9} mention="Photo d'atelier à fournir" className="absolute inset-0" />
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
              Chaque pièce KEWINA est le fruit d'un savoir-faire artisanal et d'une passion profonde pour nos racines. Texte à valider
              par la marque.
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
