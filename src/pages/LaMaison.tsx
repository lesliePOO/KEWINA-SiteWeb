import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { site } from '../config/site';
import { visuels } from '../config/visuels';
import { DrapeEtoffe } from '../components/3d/DrapeEtoffe';
import { Photo } from '../components/ui/Photo';
import { Parallaxe, Revele } from '../components/ui/Mouvement';

const VALEURS = [
  { titre: 'Authenticité', texte: 'Des imprimés et des coupes qui puisent dans nos héritages, sans les caricaturer.' },
  { titre: 'Élégance', texte: 'Des lignes nettes, des finitions soignées, une allure qui se remarque sans crier.' },
  { titre: 'Durabilité', texte: 'Des pièces faites pour durer, être portées souvent et transmises.' },
  { titre: 'Transmission', texte: "Faire vivre les savoir-faire textiles africains auprès d'une nouvelle génération." },
];

/** Les étapes de fabrication d'une pièce (le « geste » KEWINA). */
const GESTES = [
  { titre: "Choisir l'étoffe", texte: 'Un wax, un pagne, un lin : chaque tissu est retenu pour son motif, son tombé et sa tenue au lavage.' },
  { titre: 'Dessiner la coupe', texte: 'Le patron est pensé pour le corps en mouvement : aisance, longueur juste, épaules nettes.' },
  { titre: 'Couper et assembler', texte: "Les motifs sont alignés aux coutures, les doublures choisies pour que l'intérieur soit aussi soigné que l'extérieur." },
  { titre: 'Finir à la main', texte: 'Ourlets, boutons, broderies : les derniers détails, ceux qu’on remarque de près, sont faits avec patience.' },
];

const annee = site.dateCreation.match(/\d{4}/)?.[0] ?? '';

export function LaMaison() {
  return (
    <>
      {/* Ouverture */}
      <section className="zone-nuit relative isolate overflow-hidden bg-noir text-creme">
        <div className="absolute inset-0 -z-10">
          <div className="zoom-lent h-full w-full">
            <Photo src={visuels.hero[0].src} alt="" ton="wax" prioritaire position="75% center" className="h-full w-full" />
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-noir via-noir/75 to-noir/0" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-noir/80 to-transparent" />
        <div className="mx-auto flex min-h-[420px] max-w-[1440px] flex-col justify-end px-4 pb-12 pt-24 lg:min-h-[600px] lg:px-12 lg:pb-20">
          <span className="surtitre text-bronze">La Maison KEWINA</span>
          <h1 className="mt-4 font-display text-[46px] font-medium leading-[0.95] lg:text-[96px]">
            <span className="ligne-masque"><span>Porter</span></span>
            <span className="ligne-masque"><span className="italic text-or-lumiere" style={{ animationDelay: '140ms' }}>une histoire</span></span>
          </h1>
          <p className="mt-5 max-w-md animate-apparition text-sm leading-relaxed text-sable lg:text-base">
            KEWINA est née d'une passion pour la mode africaine et d'une volonté : valoriser notre héritage à travers des créations
            modernes, élégantes et intemporelles.
          </p>
        </div>
      </section>

      {/* Le récit */}
      <section className="relative overflow-hidden">
        <span
          className="pointer-events-none absolute -right-6 top-6 select-none font-display text-[160px] font-medium leading-none text-ligne/70 lg:-right-10 lg:top-10 lg:text-[340px]"
          aria-hidden="true"
        >
          {annee}
        </span>
        <div className="relative mx-auto grid max-w-[1440px] gap-10 px-4 py-16 lg:grid-cols-12 lg:gap-6 lg:px-12 lg:py-32">
          <Revele className="lg:col-span-4 lg:col-start-2">
            <span className="surtitre text-terracotta-encre">Depuis le {site.dateCreation}</span>
            <h2 className="mt-4 font-display text-[38px] font-medium leading-[1.05] lg:text-[56px]">
              Née au {site.pays}, <span className="italic">pensée pour le monde</span>
            </h2>
          </Revele>
          <Revele delai={120} className="flex flex-col gap-5 text-[15px] leading-relaxed text-encre-douce lg:col-span-5 lg:col-start-7">
            <p className="first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-[76px] first-letter:leading-[0.8] first-letter:text-brun">
              KEWINA a été fondée le {site.dateCreation} par <strong className="font-medium text-brun">{site.fondatrice}</strong>. Le nom
              est devenu une signature : celle d'une vision née entre les étals de pagnes des marchés, les ateliers de couture et
              l'univers des grandes maisons de mode.
            </p>
            <p>
              Son idée est simple : prouver que l'élégance africaine contemporaine n'a rien à envier à personne. Chaque pièce associe un
              tissu choisi pour son caractère, une coupe actuelle et une finition qui se voit de près.
            </p>
            <p>
              Aujourd'hui, KEWINA habille les femmes et les hommes qui portent leur culture avec fierté, du {site.pays} jusqu'à la
              diaspora, pour les grands jours comme pour le quotidien.
            </p>
            <p className="mt-4 border-t border-ligne pt-6 font-display text-2xl italic text-brun">
              {site.fondatrice}
              <span className="mt-1 block font-ui text-xs not-italic uppercase tracking-surtitre text-encre-douce">Fondatrice</span>
            </p>
          </Revele>
        </div>
      </section>

      {/* Diptyque photo */}
      <section className="mx-auto grid max-w-[1440px] grid-cols-2 gap-3 px-4 lg:gap-6 lg:px-12">
        <Revele effet="rideau" className="relative aspect-[4/5] overflow-hidden">
          <Parallaxe intensite={0.06}>
            <Photo src={visuels.femme.src} alt={visuels.femme.alt} ton="terre" sizes="50vw" position="center 15%" className="h-full w-full" />
          </Parallaxe>
        </Revele>
        <Revele effet="rideau" delai={150} className="relative mt-16 aspect-[4/5] overflow-hidden lg:mt-32">
          <Parallaxe intensite={0.06}>
            <Photo src={visuels.homme.src} alt={visuels.homme.alt} ton="nuit" sizes="50vw" position="center 15%" className="h-full w-full" />
          </Parallaxe>
        </Revele>
      </section>

      {/* Inspiration + étoffe 3D */}
      <section className="zone-nuit mt-16 bg-noir text-creme lg:mt-28">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
          <DrapeEtoffe className="h-[360px] lg:h-auto lg:min-h-[560px]" />
          <Revele className="flex flex-col justify-center gap-6 px-4 py-14 lg:px-16">
            <span className="surtitre text-bronze">Notre inspiration</span>
            <h2 className="font-display text-[38px] font-medium leading-tight lg:text-[56px]">
              La lumière <span className="italic text-or-lumiere">sur l'étoffe</span>
            </h2>
            <p className="text-sm leading-relaxed text-sable">
              Tout part du tissu. Le wax et le pagne racontent des histoires : un motif pour une fête, une couleur pour une saison, un
              symbole transmis de génération en génération. KEWINA les regarde comme on regarde une étoffe précieuse, sous une lumière
              dorée qui révèle chaque relief.
            </p>
            <p className="text-sm leading-relaxed text-sable">
              Notre monogramme le dit à sa façon : la lettre K se prolonge en un profil de femme drapé de wax, une boucle d'oreille en
              forme d'Afrique. L'héritage et la modernité, dans un même geste.
            </p>
            <p className="font-display text-xl italic text-or-lumiere">Élégance · Culture · Vous</p>
          </Revele>
        </div>
      </section>

      {/* Le geste */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 lg:px-12 lg:py-28">
        <Revele className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="surtitre text-terracotta-encre">Le savoir-faire</span>
            <h2 className="mt-3 font-display text-[40px] font-medium leading-none lg:text-[64px]">Le geste KEWINA</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-encre-douce">De l'étoffe à la pièce finie, quatre étapes où rien n'est laissé au hasard.</p>
        </Revele>
        <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {GESTES.map((g, i) => (
            <Revele as="li" key={g.titre} delai={i * 110} className="border-t border-brun pt-6">
              <span className="font-display text-5xl italic text-bronze">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-4 font-display text-2xl">{g.titre}</h3>
              <p className="mt-2 text-sm leading-relaxed text-encre-douce">{g.texte}</p>
            </Revele>
          ))}
        </ol>
      </section>

      {/* L'atelier */}
      <section className="zone-nuit bg-noir text-creme">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[1.1fr_1fr]">
          <div className="relative min-h-[340px] overflow-hidden lg:min-h-[560px]">
            <div className="absolute inset-0">
              <Parallaxe intensite={0.08}>
                <Photo src={visuels.savoirFaire.src} alt={visuels.savoirFaire.alt} ton="wax" sizes="(min-width: 1024px) 55vw, 100vw" className="h-full w-full" />
              </Parallaxe>
            </div>
          </div>
          <Revele className="flex flex-col justify-center gap-6 px-4 py-14 lg:px-16">
            <span className="surtitre text-bronze">L'atelier</span>
            <h2 className="font-display text-[38px] font-medium leading-tight lg:text-[52px]">Des mains, du temps, des détails</h2>
            <p className="text-sm leading-relaxed text-sable">
              Nos pièces sont pensées pour tomber juste, avec des coutures nettes, des doublures soignées et des tailles claires pour
              commander sans hésiter.
            </p>
          </Revele>
        </div>
      </section>

      {/* Valeurs */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 lg:px-12 lg:py-28">
        <Revele>
          <span className="surtitre text-terracotta-encre">Ce qui nous guide</span>
          <h2 className="mt-3 font-display text-[40px] font-medium leading-none lg:text-[64px]">Nos valeurs</h2>
        </Revele>
        <ul className="mt-12 divide-y divide-ligne border-y border-ligne">
          {VALEURS.map((v, i) => (
            <Revele as="li" key={v.titre} delai={i * 80} className="group grid gap-2 py-7 lg:grid-cols-[120px_1fr_1.2fr] lg:items-baseline lg:gap-8 lg:py-9">
              <span className="font-display text-lg italic text-bronze">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-display text-[34px] leading-none transition-colors duration-base group-hover:text-terracotta-encre lg:text-[48px]">{v.titre}</h3>
              <p className="max-w-md text-sm leading-relaxed text-encre-douce">{v.texte}</p>
            </Revele>
          ))}
        </ul>
      </section>

      {/* Clôture */}
      <section className="zone-nuit bg-noir text-creme">
        <Revele className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-20 text-center lg:py-28">
          <img src="/brand/kewina-monogramme.webp" alt="" className="h-24 w-auto lg:h-28" width={480} height={394} />
          <p className="font-display text-[30px] font-medium italic leading-tight lg:text-[44px]">À vous d'écrire la suite de l'histoire.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/boutique" className="btn btn-plein">
              Découvrir la boutique <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
            <Link to="/collections" className="btn">Les collections</Link>
          </div>
        </Revele>
      </section>
    </>
  );
}
