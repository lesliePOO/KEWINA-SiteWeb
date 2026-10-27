import type { ReactNode } from 'react';
import { Photo } from './Photo';
import type { TonEtoffe } from './Etoffe';

interface Props {
  surtitre?: string;
  titre: string;
  texte?: string;
  photo?: string;
  position?: string;
  ton?: TonEtoffe;
  children?: ReactNode;
}

/** Bandeau sombre d'en-tête de page (registre « campagne »), avec photo d'ambiance. */
export function EnteteNuit({ surtitre, titre, texte, photo, position = 'center', ton = 'nuit', children }: Props) {
  return (
    <section className="zone-nuit relative isolate overflow-hidden bg-noir text-creme">
      {photo && <Photo src={photo} alt="" ton={ton} prioritaire position={position} className="absolute inset-0 -z-10" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-noir via-noir/75 to-noir/20" />
      <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-16 lg:px-12 lg:pb-16 lg:pt-24">
        {surtitre && <span className="surtitre text-bronze">{surtitre}</span>}
        <h1 className="mt-3 max-w-2xl font-display text-[42px] font-medium leading-none lg:text-6xl">{titre}</h1>
        {texte && <p className="mt-4 max-w-lg text-sm leading-relaxed text-sable lg:text-base">{texte}</p>}
        {children}
      </div>
    </section>
  );
}
