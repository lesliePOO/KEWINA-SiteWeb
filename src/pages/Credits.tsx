import { useCatalogue } from '../context/CatalogueContext';
import { tousLesVisuels } from '../config/visuels';

/** Crédits des photos d'illustration (licence Unsplash), en attendant les photos KEWINA. */
export function Credits() {
  const { produits, collections } = useCatalogue();
  const credits = new Set<string>(tousLesVisuels.map((v) => v.credit));
  produits.forEach((p) => p.images.forEach((i) => i.credit && credits.add(i.credit)));
  collections.forEach((c) => c.image_credit && credits.add(c.image_credit));

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-10 lg:pt-16">
      <h1 className="font-display text-[38px] font-medium lg:text-5xl">Crédits photos</h1>
      <p className="mt-4 text-sm leading-relaxed text-encre-douce">
        Les photos actuellement visibles sur le site sont des <strong className="text-brun">photos d'illustration</strong>, issues de{' '}
        <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Unsplash</a> et utilisées selon la{' '}
        <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">licence Unsplash</a>.
        Elles ne représentent pas les créations KEWINA et seront remplacées par les photos de la marque.
      </p>
      <h2 className="mt-10 font-display text-2xl">Photographes</h2>
      <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        {[...credits].sort((a, b) => a.localeCompare(b)).map((c) => (
          <li key={c} className="border-b border-ligne py-2">{c}</li>
        ))}
      </ul>
    </div>
  );
}
