import type { Produit } from '../../types/catalogue';
import { Etoffe, tonPourProduit, type TonEtoffe } from '../ui/Etoffe';

interface Props {
  produit: Produit;
  index?: number;
  couleur?: string | null;
  className?: string;
  mention?: boolean;
}

const TONS_SECONDAIRES: TonEtoffe[] = ['wax', 'sable', 'bordeaux', 'nuit'];

/** Photo du produit si elle existe, sinon l'étoffe de remplacement avec « Photo à fournir ». */
export function VisuelProduit({ produit, index = 0, couleur, className = '', mention = true }: Props) {
  const image = produit.images[index];
  if (image) {
    return (
      <img
        src={image.url}
        alt={image.alt || produit.nom}
        loading="lazy"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  const ton = index === 0 ? tonPourProduit(produit.slug, couleur ?? produit.variantes[0]?.couleur) : TONS_SECONDAIRES[index % TONS_SECONDAIRES.length];
  return <Etoffe ton={ton} echelle={index === 0 ? 1 : 0.7} mention={mention ? 'Photo à fournir' : undefined} className={`h-full w-full ${className}`} />;
}
