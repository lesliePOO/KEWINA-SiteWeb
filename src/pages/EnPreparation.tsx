import { Link } from 'react-router-dom';

interface Props {
  titre: string;
  surtitre?: string;
}

/** Page provisoire pour les rubriques qui seront construites aux étapes suivantes. */
export function EnPreparation({ titre, surtitre = 'KEWINA' }: Props) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[1440px] flex-col justify-center gap-6 px-4 py-20 lg:px-12">
      <span className="surtitre text-encre-douce">{surtitre}</span>
      <h1 className="font-display text-5xl font-medium lg:text-6xl">{titre}</h1>
      <p className="max-w-md text-encre-douce">Cette page est en préparation.</p>
      <Link to="/" className="lien-souligne self-start">
        Retour à l'accueil
      </Link>
    </section>
  );
}

export function PageIntrouvable() {
  return <EnPreparation titre="Page introuvable" surtitre="Erreur 404" />;
}
