import { Link } from 'react-router-dom';
import { ArrowRight, Gem, HandHeart, Leaf, Sparkles } from 'lucide-react';
import { site } from '../config/site';
import { visuels } from '../config/visuels';
import { DrapeEtoffe } from '../components/3d/DrapeEtoffe';
import { EnteteNuit } from '../components/ui/EnteteNuit';
import { Photo } from '../components/ui/Photo';

const VALEURS = [
  { Icone: Sparkles, titre: 'Authenticité', texte: 'Des imprimés et des coupes qui puisent dans nos héritages, sans les caricaturer.' },
  { Icone: Gem, titre: 'Élégance', texte: 'Des lignes nettes, des finitions soignées, une allure qui se remarque sans crier.' },
  { Icone: Leaf, titre: 'Durabilité', texte: 'Des pièces faites pour durer, être portées souvent et transmises.' },
  { Icone: HandHeart, titre: 'Transmission', texte: "Faire vivre les savoir-faire textiles africains auprès d'une nouvelle génération." },
];

export function LaMaison() {
  return (
    <>
      <EnteteNuit
        surtitre="La Maison"
        titre="Notre histoire"
        texte="KEWINA est née d'une passion pour la mode africaine et d'une volonté : valoriser notre héritage culturel à travers des créations modernes, élégantes et intemporelles."
        photo={visuels.hero[0].src}
        position="center 35%"
      />

      <section className="mx-auto grid max-w-[1440px] gap-10 px-4 py-16 lg:grid-cols-12 lg:gap-6 lg:px-12 lg:py-28">
        <div className="lg:col-span-5 lg:col-start-2">
          <span className="surtitre text-encre-douce">Depuis le {site.dateCreation}</span>
          <h2 className="mt-4 font-display text-[34px] font-medium leading-tight lg:text-5xl">Une marque née au {site.pays}, pensée pour le monde</h2>
        </div>
        <div className="flex flex-col gap-5 text-[15px] leading-relaxed text-encre-douce lg:col-span-5 lg:col-start-8">
          <p>
            KEWINA a été fondée le {site.dateCreation} par <strong className="font-medium text-brun">{site.fondatrice}</strong>. Le nom est
            devenu une signature : celle d'une vision née entre les étals de pagnes des marchés, les ateliers de couture et l'univers
            des grandes maisons de mode.
          </p>
          <p>
            Son idée est simple : prouver que l'élégance africaine contemporaine n'a rien à envier à personne. Chaque pièce associe un
            tissu choisi pour son caractère, une coupe actuelle et une finition qui se voit de près.
          </p>
          <p>
            Aujourd'hui, KEWINA habille les femmes et les hommes qui portent leur culture avec fierté, du {site.pays} jusqu'à la diaspora,
            pour les grands jours comme pour le quotidien.
          </p>
        </div>
      </section>

      <section className="zone-nuit bg-noir text-creme">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
          <DrapeEtoffe className="h-[360px] lg:h-auto lg:min-h-[520px]" />
          <div className="flex flex-col justify-center gap-6 px-4 py-14 lg:px-16">
            <span className="surtitre text-bronze">Notre inspiration</span>
            <h2 className="font-display text-[34px] font-medium leading-tight lg:text-[44px]">La lumière sur l'étoffe</h2>
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
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-16 lg:px-12 lg:py-28">
        <h2 className="font-display text-[34px] font-medium lg:text-5xl">Nos valeurs</h2>
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALEURS.map(({ Icone, titre, texte }) => (
            <li key={titre} className="flex flex-col gap-3 border-t border-ligne pt-6">
              <Icone size={28} strokeWidth={1.2} className="text-terracotta-encre" />
              <h3 className="font-display text-2xl">{titre}</h3>
              <p className="text-sm leading-relaxed text-encre-douce">{texte}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="zone-nuit bg-noir text-creme">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col justify-center gap-6 px-4 py-14 lg:order-1 lg:px-12">
            <span className="surtitre text-bronze">Le savoir-faire</span>
            <h2 className="font-display text-[34px] font-medium leading-tight lg:text-[44px]">Des mains, du temps, des détails</h2>
            <p className="text-sm leading-relaxed text-sable">
              Sélection des tissus, patronage, coupe, montage, finitions : chaque étape compte. Nos pièces sont pensées pour tomber juste,
              avec des coutures nettes, des doublures soignées et des tailles claires pour commander sans hésiter.
            </p>
            <Link to="/boutique" className="btn btn-plein self-start">
              Découvrir la boutique <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          </div>
          <Photo src={visuels.savoirFaire.src} alt={visuels.savoirFaire.alt} ton="wax" className="min-h-[320px] lg:min-h-[480px]" />
        </div>
      </section>
    </>
  );
}
