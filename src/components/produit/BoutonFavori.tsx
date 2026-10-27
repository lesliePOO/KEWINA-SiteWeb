import { Heart } from 'lucide-react';
import { useFavoris } from '../../context/FavorisContext';

export function BoutonFavori({ slug, nom, className = '' }: { slug: string; nom: string; className?: string }) {
  const { estFavori, basculer } = useFavoris();
  const actif = estFavori(slug);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        basculer(slug);
      }}
      aria-pressed={actif}
      aria-label={actif ? `Retirer ${nom} des favoris` : `Ajouter ${nom} aux favoris`}
      className={`grid h-9 w-9 place-items-center rounded-full bg-blanc-casse/90 text-brun transition-transform duration-rapide hover:scale-105 ${className}`}
    >
      <Heart size={17} strokeWidth={1.5} className={actif ? 'fill-carmin text-carmin' : ''} />
    </button>
  );
}
