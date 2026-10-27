import { Link } from 'react-router-dom';

/**
 * Accueil — version socle. Le hero recevra la scène 3D du drapé (Three.js,
 * chargée en différé) ; ce fond d'étoffe statique en est déjà la solution de repli.
 */
export function Accueil() {
  return (
    <>
      <section className="zone-nuit relative isolate flex min-h-[640px] items-end overflow-hidden bg-noir text-creme lg:min-h-[760px]">
        <div className="etoffe-wax absolute inset-y-0 right-0 -z-10 w-full opacity-90 lg:w-[68%]" aria-hidden="true" />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(90deg, #0b0b0b 0%, rgba(11,11,11,0.85) 35%, rgba(11,11,11,0.1) 75%), linear-gradient(0deg, #0b0b0b 0%, rgba(11,11,11,0) 45%)',
          }}
          aria-hidden="true"
        />
        <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 lg:px-12 lg:pb-24">
          <div className="flex max-w-xl flex-col gap-6 lg:gap-7">
            <span className="surtitre text-bronze">Mode africaine contemporaine · Femme et homme</span>
            <h1 className="font-display text-[52px] font-medium leading-[0.95] lg:text-[88px]">
              L'élégance africaine
              <br />
              contemporaine
            </h1>
            <p className="max-w-md text-[15px] leading-relaxed text-sable lg:text-base">
              Des créations inspirées de nos racines, pensées pour la femme et l'homme d'aujourd'hui.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link to="/boutique" className="btn btn-plein">
                Découvrir la boutique
              </Link>
              <Link to="/collections" className="btn">
                Les collections
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-10 px-4 py-20 lg:grid-cols-12 lg:gap-6 lg:px-12 lg:py-32">
        <div className="lg:col-span-6 lg:col-start-2">
          <span className="surtitre text-encre-douce">La maison</span>
          <p className="mt-5 font-display text-[28px] italic leading-tight lg:text-[40px]">
            « Chaque pièce porte la mémoire d'un tissu et l'allure de celle ou celui qui la porte. »
          </p>
        </div>
        <div className="flex flex-col gap-6 lg:col-span-3 lg:col-start-9 lg:self-end">
          <p className="text-sm leading-relaxed text-encre-douce">
            Le site est en cours de construction. Le catalogue, les collections et la commande via WhatsApp arrivent dans les
            prochaines étapes.
          </p>
          <Link to="/a-propos" className="lien-souligne self-start">
            Notre histoire
          </Link>
        </div>
      </section>
    </>
  );
}
