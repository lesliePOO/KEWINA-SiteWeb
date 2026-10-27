import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { useCatalogue } from '../context/CatalogueContext';
import { CarteProduit } from '../components/produit/CarteProduit';
import { couleursDe, stockTotal, taillesDe, trierTailles } from '../components/produit/outils';
import { Photo } from '../components/ui/Photo';
import { visuels } from '../config/visuels';
import { Revele } from '../components/ui/Mouvement';
import { ChargementGrille, ErreurCatalogue, EtatVide } from '../components/ui/Etats';
import type { Genre, Produit } from '../types/catalogue';

const TRANCHES_PRIX = [
  { cle: '0-25000', libelle: '0 – 25 000', min: 0, max: 25000 },
  { cle: '25000-50000', libelle: '25 000 – 50 000', min: 25000, max: 50000 },
  { cle: '50000-100000', libelle: '50 000 – 100 000', min: 50000, max: 100000 },
  { cle: '100000-150000', libelle: '100 000 – 150 000', min: 100000, max: 150000 },
  { cle: '150000+', libelle: '150 000 +', min: 150000, max: Infinity },
];

const TRIS = [
  { cle: 'recents', libelle: 'Plus récents' },
  { cle: 'nouveautes', libelle: 'Nouveautés' },
  { cle: 'prix-asc', libelle: 'Prix croissant' },
  { cle: 'prix-desc', libelle: 'Prix décroissant' },
  { cle: 'pertinence', libelle: 'Pertinence' },
];

const GENRES: { cle: Genre | ''; libelle: string }[] = [
  { cle: '', libelle: 'Tout' },
  { cle: 'femme', libelle: 'Femme' },
  { cle: 'homme', libelle: 'Homme' },
  { cle: 'unisexe', libelle: 'Unisexe' },
];

const liste = (v: string | null) => (v ? v.split(',').filter(Boolean) : []);
const normaliser = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function Boutique() {
  const { produits, categories, collections, chargement, erreur } = useCatalogue();
  const [params, setParams] = useSearchParams();
  const [panneauOuvert, setPanneauOuvert] = useState(false);
  const champRecherche = useRef<HTMLInputElement>(null);

  const genre = (params.get('genre') ?? '') as Genre | '';
  const q = params.get('q') ?? '';
  const choix = {
    categorie: liste(params.get('categorie')),
    taille: liste(params.get('taille')),
    couleur: liste(params.get('couleur')),
    prix: liste(params.get('prix')),
    collection: liste(params.get('collection')),
  };
  const dispo = params.get('dispo') === '1';
  const tri = params.get('tri') ?? 'recents';

  useEffect(() => {
    if (params.get('recherche') === '1') champRecherche.current?.focus();
  }, [params]);

  // Panneau de filtres ouvert : la page derrière ne défile plus ; Échap le ferme.
  useEffect(() => {
    if (!panneauOuvert) return;
    const ancien = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const touche = (e: KeyboardEvent) => e.key === 'Escape' && setPanneauOuvert(false);
    window.addEventListener('keydown', touche);
    return () => {
      document.body.style.overflow = ancien;
      window.removeEventListener('keydown', touche);
    };
  }, [panneauOuvert]);

  const maj = (cle: string, valeur: string | null) => {
    const suivant = new URLSearchParams(params);
    suivant.delete('recherche');
    if (valeur) suivant.set(cle, valeur);
    else suivant.delete(cle);
    setParams(suivant, { replace: true });
  };
  const basculer = (cle: keyof typeof choix, valeur: string) => {
    const actuel = choix[cle];
    const suivant = actuel.includes(valeur) ? actuel.filter((v) => v !== valeur) : [...actuel, valeur];
    maj(cle, suivant.join(',') || null);
  };
  const toutEffacer = () => setParams(genre ? { genre } : {}, { replace: true });

  const duGenre = useMemo(() => (genre ? produits.filter((p) => p.genre === genre) : produits), [produits, genre]);

  const resultats = useMemo(() => {
    const motif = normaliser(q.trim());
    const filtres = duGenre.filter((p) => {
      if (motif && !normaliser(`${p.nom} ${p.description ?? ''} ${p.categorie?.nom ?? ''} ${p.matieres ?? ''}`).includes(motif)) return false;
      if (choix.categorie.length && !choix.categorie.includes(p.categorie?.slug ?? '')) return false;
      if (choix.collection.length && !choix.collection.includes(p.collection?.slug ?? '')) return false;
      if (choix.taille.length && !p.variantes.some((v) => v.taille && choix.taille.includes(v.taille) && (!dispo || v.stock > 0))) return false;
      if (choix.couleur.length && !p.variantes.some((v) => v.couleur && choix.couleur.includes(v.couleur) && (!dispo || v.stock > 0))) return false;
      if (choix.prix.length && !choix.prix.some((c) => {
        const t = TRANCHES_PRIX.find((x) => x.cle === c);
        return t ? p.prix >= t.min && p.prix < t.max : false;
      })) return false;
      if (dispo && stockTotal(p) <= 0) return false;
      return true;
    });
    const tries = [...filtres];
    if (tri === 'prix-asc') tries.sort((a, b) => a.prix - b.prix);
    else if (tri === 'prix-desc') tries.sort((a, b) => b.prix - a.prix);
    else if (tri === 'nouveautes') tries.sort((a, b) => Number(b.nouveaute) - Number(a.nouveaute) || b.created_at.localeCompare(a.created_at));
    else if (tri === 'pertinence' && motif) tries.sort((a, b) => Number(normaliser(b.nom).includes(motif)) - Number(normaliser(a.nom).includes(motif)));
    else tries.sort((a, b) => b.created_at.localeCompare(a.created_at));
    return tries;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duGenre, params]);

  const compter = (test: (p: Produit) => boolean) => duGenre.filter(test).length;
  const tailles = trierTailles([...new Set<string>(duGenre.flatMap((p: Produit) => taillesDe(p)))]);
  const couleurs = [
    ...new Map<string, { nom: string; hex: string }>(duGenre.flatMap((p: Produit) => couleursDe(p)).map((c) => [c.nom, c] as const)).values(),
  ];
  const nbFiltres = Object.values(choix).reduce((s, l) => s + l.length, 0) + (dispo ? 1 : 0);
  const titre = genre === 'femme' ? 'Femme' : genre === 'homme' ? 'Homme' : genre === 'unisexe' ? 'Unisexe' : 'Toute la boutique';
  const entete =
    genre === 'femme'
      ? { lignes: ['La collection', 'Femme'], texte: 'Robes, ensembles et pièces fortes, coupés dans des étoffes choisies.', visuel: visuels.femme, position: 'center 20%' }
      : genre === 'homme'
        ? { lignes: ['La collection', 'Homme'], texte: 'Chemises, kaftans et ensembles : une allure nette, un héritage assumé.', visuel: visuels.homme, position: 'center 20%' }
        : { lignes: ['Toute', 'la boutique'], texte: 'Nos pièces, entre tradition et modernité. Chaque étoffe a son histoire.', visuel: visuels.tissus, position: 'center 40%' };

  // Filtres actifs, affichés en pastilles qu'on retire d'un geste.
  const actifs: { libelle: string; retirer: () => void }[] = [
    ...choix.categorie.map((v) => ({ libelle: categories.find((c) => c.slug === v)?.nom ?? v, retirer: () => basculer('categorie', v) })),
    ...choix.collection.map((v) => ({ libelle: collections.find((c) => c.slug === v)?.titre ?? v, retirer: () => basculer('collection', v) })),
    ...choix.taille.map((v) => ({ libelle: `Taille ${v}`, retirer: () => basculer('taille', v) })),
    ...choix.couleur.map((v) => ({ libelle: v, retirer: () => basculer('couleur', v) })),
    ...choix.prix.map((v) => ({ libelle: `${TRANCHES_PRIX.find((t) => t.cle === v)?.libelle ?? v} FCFA`, retirer: () => basculer('prix', v) })),
    ...(dispo ? [{ libelle: 'En stock', retirer: () => maj('dispo', null) }] : []),
    ...(q ? [{ libelle: `« ${q} »`, retirer: () => maj('q', null) }] : []),
  ];
  const vueLibre = actifs.length === 0 && tri === 'recents';

  const filtres = (
    <div className="flex flex-col">
      <Groupe titre="Catégories">
        {categories.map((c) => {
          const n = compter((p) => p.categorie?.slug === c.slug);
          if (!n) return null;
          return <Case key={c.slug} libelle={c.nom} n={n} coche={choix.categorie.includes(c.slug)} onChange={() => basculer('categorie', c.slug)} />;
        })}
      </Groupe>
      {collections.length > 0 && (
        <Groupe titre="Collections">
          {collections.map((c) => (
            <Case key={c.slug} libelle={c.titre} n={compter((p) => p.collection?.slug === c.slug)} coche={choix.collection.includes(c.slug)} onChange={() => basculer('collection', c.slug)} />
          ))}
        </Groupe>
      )}
      {tailles.length > 0 && (
        <Groupe titre="Tailles">
          {tailles.map((t) => (
            <Case key={t} libelle={t} n={compter((p) => p.variantes.some((v) => v.taille === t))} coche={choix.taille.includes(t)} onChange={() => basculer('taille', t)} />
          ))}
        </Groupe>
      )}
      {couleurs.length > 0 && (
        <Groupe titre="Couleurs">
          <div className="flex flex-wrap gap-3">
            {couleurs.map((c) => {
              const actif = choix.couleur.includes(c.nom);
              return (
                <button
                  key={c.nom}
                  type="button"
                  aria-pressed={actif}
                  aria-label={c.nom}
                  title={c.nom}
                  onClick={() => basculer('couleur', c.nom)}
                  className={`h-7 w-7 rounded-full ring-1 ring-bord-controle transition-shadow ${actif ? 'ring-2 ring-brun ring-offset-2 ring-offset-creme' : ''}`}
                  style={{ backgroundColor: c.hex }}
                />
              );
            })}
          </div>
        </Groupe>
      )}
      <Groupe titre="Prix (FCFA)">
        {TRANCHES_PRIX.map((t) => (
          <Case key={t.cle} libelle={t.libelle} n={compter((p) => p.prix >= t.min && p.prix < t.max)} coche={choix.prix.includes(t.cle)} onChange={() => basculer('prix', t.cle)} />
        ))}
      </Groupe>
      <Groupe titre="Disponibilité">
        <Case libelle="En stock uniquement" coche={dispo} onChange={() => maj('dispo', dispo ? null : '1')} />
      </Groupe>
    </div>
  );

  return (
    <>
      <section className="zone-nuit relative isolate overflow-hidden bg-noir text-creme">
        <div key={genre} className="absolute inset-0 -z-10 animate-apparition">
          <div className="zoom-lent h-full w-full">
            <Photo src={entete.visuel.src} alt="" ton="terre" prioritaire position={entete.position} className="h-full w-full" />
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-noir via-noir/70 to-noir/0" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-noir/70 to-transparent" />
        <div className="mx-auto flex min-h-[340px] max-w-[1440px] flex-col justify-end px-4 pb-10 pt-24 lg:min-h-[460px] lg:px-12 lg:pb-16">
          <span className="surtitre text-bronze">Boutique KEWINA</span>
          <h1 key={`t-${genre}`} className="mt-4 font-display text-[46px] font-medium leading-[0.95] lg:text-[84px]">
            <span className="ligne-masque"><span>{entete.lignes[0]}</span></span>
            <span className="ligne-masque"><span className="italic text-or-lumiere" style={{ animationDelay: '140ms' }}>{entete.lignes[1]}</span></span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-sable lg:text-base">{entete.texte}</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 lg:px-12">
        <nav aria-label="Fil d'Ariane" className="py-4 text-xs text-encre-douce">
          <Link to="/" className="hover:text-brun">Accueil</Link> <span aria-hidden="true">/</span> <span className="text-brun">Boutique</span>
        </nav>

        {/* Genres en onglets (mobile) */}
        <div className="-mx-4 mb-4 grid grid-cols-4 border-b border-ligne lg:hidden" role="tablist">
          {GENRES.map((g) => (
            <button
              key={g.cle}
              type="button"
              role="tab"
              aria-selected={genre === g.cle}
              onClick={() => maj('genre', g.cle || null)}
              className={`py-3 font-display text-lg ${genre === g.cle ? 'border-b-2 border-brun text-brun' : 'text-encre-douce'}`}
            >
              {g.libelle}
            </button>
          ))}
        </div>

        <div className="flex gap-12 pb-20 lg:pb-28">
          <aside className="hidden w-60 shrink-0 lg:block" aria-label="Filtres">
            <div className="flex items-center justify-between border-b border-ligne pb-3">
              <h2 className="font-display text-xl">Filtres</h2>
              {nbFiltres > 0 && (
                <button type="button" onClick={toutEffacer} className="text-xs text-encre-douce underline underline-offset-4">Tout effacer</button>
              )}
            </div>
            {filtres}
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-medium lg:text-4xl">{titre}</h2>
                <p className="mt-1 text-sm text-encre-douce" aria-live="polite">
                  {resultats.length} produit{resultats.length > 1 ? 's' : ''}
                </p>
              </div>
              <div className="hidden items-center gap-8 lg:flex">
                {GENRES.map((g) => (
                  <button
                    key={g.cle}
                    type="button"
                    onClick={() => maj('genre', g.cle || null)}
                    aria-pressed={genre === g.cle}
                    className={`relative pb-1.5 font-display text-xl transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-brun after:transition-transform after:duration-base ${
                      genre === g.cle ? 'text-brun after:scale-x-100' : 'text-encre-douce after:scale-x-0 hover:text-brun hover:after:scale-x-100'
                    }`}
                  >
                    {g.libelle}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <label className="flex min-w-0 flex-1 items-center gap-2 border-b border-brun py-2 sm:max-w-sm">
                <Search size={18} strokeWidth={1.5} aria-hidden="true" />
                <input
                  ref={champRecherche}
                  type="search"
                  value={q}
                  onChange={(e) => maj('q', e.target.value || null)}
                  placeholder="Rechercher une pièce, un tissu…"
                  aria-label="Rechercher un produit"
                  className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-encre-douce"
                />
              </label>
              <button
                type="button"
                onClick={() => setPanneauOuvert(true)}
                className="flex h-10 items-center gap-2 border border-bord-controle px-4 text-xs uppercase tracking-label lg:hidden"
              >
                <SlidersHorizontal size={16} strokeWidth={1.5} /> Filtres{nbFiltres ? ` (${nbFiltres})` : ''}
              </button>
              <label className="ml-auto flex items-center gap-2 text-xs">
                <span className="text-encre-douce">Trier par :</span>
                <span className="relative">
                  <select
                    value={tri}
                    onChange={(e) => maj('tri', e.target.value === 'recents' ? null : e.target.value)}
                    className="h-10 appearance-none border border-bord-controle bg-blanc-casse pl-3 pr-9 text-sm"
                  >
                    {TRIS.map((t) => <option key={t.cle} value={t.cle}>{t.libelle}</option>)}
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                </span>
              </label>
            </div>

            {/* Catégories en pastilles (mobile) */}
            <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 lg:hidden">
              <Puce actif={!choix.categorie.length} onClick={() => maj('categorie', null)}>Toutes</Puce>
              {categories.filter((c) => duGenre.some((p) => p.categorie?.slug === c.slug)).map((c) => (
                <Puce key={c.slug} actif={choix.categorie.includes(c.slug)} onClick={() => basculer('categorie', c.slug)}>{c.nom}</Puce>
              ))}
            </div>

            {actifs.length > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-2" aria-label="Filtres actifs">
                {actifs.map((a) => (
                  <button key={a.libelle} type="button" onClick={a.retirer} className="flex h-8 items-center gap-1.5 rounded-full bg-brun px-3 text-xs text-creme hover:bg-terracotta-encre" aria-label={`Retirer le filtre ${a.libelle}`}>
                    {a.libelle} <X size={13} strokeWidth={1.8} />
                  </button>
                ))}
                <button type="button" onClick={toutEffacer} className="ml-1 text-xs text-encre-douce underline underline-offset-4">Tout effacer</button>
              </div>
            )}

            {erreur ? (
              <ErreurCatalogue />
            ) : chargement ? (
              <ChargementGrille />
            ) : resultats.length === 0 ? (
              <EtatVide titre="Aucune pièce ne correspond" texte="Essayez une autre taille, une autre couleur ou retirez un filtre." />
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-14">
                {resultats.map((p, i) => (
                  <Fragment key={p.id}>
                    {/* Respiration éditoriale au milieu du catalogue, quand aucun filtre n'est actif */}
                    {vueLibre && i === 6 && resultats.length > 7 && <Interlude />}
                    <Revele delai={(i % 3) * 90}>
                      <CarteProduit produit={p} />
                    </Revele>
                  </Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filtres mobile : panneau qui glisse depuis le bas */}
      <div className={`fixed inset-0 z-50 lg:hidden ${panneauOuvert ? '' : 'pointer-events-none'}`} aria-hidden={!panneauOuvert}>
        <div
          className={`absolute inset-0 bg-noir/50 transition-opacity duration-base ${panneauOuvert ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setPanneauOuvert(false)}
        />
        <div
          className={`absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-2xl bg-creme shadow-2xl transition-transform duration-base ease-etoffe ${
            panneauOuvert ? 'translate-y-0' : 'translate-y-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Filtres"
        >
          <span className="mx-auto mt-3 h-1 w-10 rounded-full bg-ligne" aria-hidden="true" />
          <div className="flex items-center justify-between border-b border-ligne px-4 pb-3 pt-2">
            <h2 className="font-display text-2xl">Filtres</h2>
            <button type="button" onClick={() => setPanneauOuvert(false)} className="grid h-11 w-11 place-items-center" aria-label="Fermer les filtres" tabIndex={panneauOuvert ? 0 : -1}>
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain px-4">{panneauOuvert && filtres}</div>
          <div className="grid grid-cols-2 gap-3 border-t border-ligne p-4" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
            <button type="button" onClick={toutEffacer} className="btn px-4" tabIndex={panneauOuvert ? 0 : -1}>Effacer</button>
            <button type="button" onClick={() => setPanneauOuvert(false)} className="btn btn-plein px-4" tabIndex={panneauOuvert ? 0 : -1}>
              Voir {resultats.length} pièce{resultats.length > 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function Groupe({ titre, children }: { titre: string; children: ReactNode }) {
  const [ouvert, setOuvert] = useState(true);
  return (
    <fieldset className="border-b border-ligne py-5">
      <legend className="sr-only">{titre}</legend>
      <button type="button" onClick={() => setOuvert(!ouvert)} aria-expanded={ouvert} className="flex w-full items-center justify-between text-sm font-medium">
        {titre}
        <ChevronDown size={16} strokeWidth={1.5} className={`transition-transform ${ouvert ? 'rotate-180' : ''}`} />
      </button>
      {ouvert && <div className="mt-4 flex flex-col gap-3">{children}</div>}
    </fieldset>
  );
}

function Case({ libelle, n, coche, onChange }: { libelle: string; n?: number; coche: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <input type="checkbox" checked={coche} onChange={onChange} className="h-4 w-4 accent-brun" />
      <span className="flex-1">{libelle}</span>
      {n !== undefined && <span className="text-xs text-encre-douce">({n})</span>}
    </label>
  );
}

function Puce({ actif, onClick, children }: { actif: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actif}
      className={`h-9 shrink-0 rounded-full border px-4 text-xs ${actif ? 'border-brun bg-brun text-creme' : 'border-bord-controle text-brun'}`}
    >
      {children}
    </button>
  );
}

/** Pause éditoriale glissée dans la grille : le savoir-faire derrière les pièces. */
function Interlude() {
  return (
    <Revele effet="rideau" className="col-span-2 lg:col-span-3">
      <Link to="/a-propos" className="zone-nuit group relative isolate grid min-h-[260px] overflow-hidden bg-noir text-creme sm:grid-cols-2 lg:min-h-[340px]">
        <div className="relative min-h-[200px] overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-lente ease-etoffe group-hover:scale-[1.04]">
            <Photo src={visuels.savoirFaire.src} alt={visuels.savoirFaire.alt} ton="wax" sizes="(min-width: 640px) 40vw, 100vw" className="h-full w-full" />
          </div>
        </div>
        <div className="flex flex-col justify-center gap-4 p-6 lg:p-12">
          <span className="surtitre text-bronze">L'atelier</span>
          <p className="font-display text-[28px] font-medium italic leading-tight lg:text-[40px]">Chaque pièce passe par des mains, pas par une chaîne.</p>
          <span className="lien-souligne inline-flex items-center gap-2 self-start text-creme">
            Découvrir la maison <ArrowRight size={14} strokeWidth={1.5} />
          </span>
        </div>
      </Link>
    </Revele>
  );
}
