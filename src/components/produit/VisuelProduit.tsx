import type { Produit } from '../../types/catalogue';
import { Etoffe, tonPourProduit, type TonEtoffe } from '../ui/Etoffe';
import { Photo } from '../ui/Photo';

interface Props {
  produit: Produit;
  index?: number;
  couleur?: string | null;
  className?: string;
  mention?: boolean;
  sizes?: string;
  prioritaire?: boolean;
}

const TONS_SECONDAIRES: TonEtoffe[] = ['wax', 'sable', 'bordeaux', 'nuit'];

/**
 * Photo du produit (format 4:5). Sans photo à cet index : étoffe de remplacement.
 * Les photos de démonstration sont des illustrations libres de droits, signalées comme telles.
 */
export function VisuelProduit({ produit, index = 0, couleur, className = '', mention = true, sizes = '(min-width: 1024px) 25vw, 50vw', prioritaire }: Props) {
  const ton = index === 0 ? tonPourProduit(produit.slug, couleur ?? produit.variantes[0]?.couleur) : TONS_SECONDAIRES[index % TONS_SECONDAIRES.length];
  const image = produit.images[index];

  if (image) {
    return (
      <div className={`relative h-full w-full ${className}`}>
        <Photo src={image.url} alt={image.alt || produit.nom} ratio={1.25} sizes={sizes} ton={ton} prioritaire={prioritaire} className="h-full w-full" />
        {mention && produit.est_demo && (
          <span className="absolute bottom-2 left-2 bg-noir/55 px-1.5 py-0.5 text-[9px] uppercase tracking-bouton text-creme/90">Photo d'illustration</span>
        )}
      </div>
    );
  }
  return <Etoffe ton={ton} echelle={index === 0 ? 1 : 0.7} mention={mention ? 'Photo à fournir' : undefined} className={`h-full w-full ${className}`} />;
}
