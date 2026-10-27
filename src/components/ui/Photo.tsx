import { useState } from 'react';
import { srcSet, urlImage } from '../../lib/images';
import { Etoffe, type TonEtoffe } from './Etoffe';

interface Props {
  src: string;
  alt: string;
  /** Hauteur / largeur souhaitée (1.25 = format 4:5). Sans valeur : image libre recadrée par CSS. */
  ratio?: number;
  sizes?: string;
  /** Teinte chaude « KEWINA » appliquée aux photos d'illustration pour les accorder au design. */
  harmoniser?: boolean;
  prioritaire?: boolean;
  /** Étoffe affichée tant que la photo charge ou si elle ne charge pas. */
  ton?: TonEtoffe;
  className?: string;
  position?: string;
}

export function Photo({ src, alt, ratio, sizes = '100vw', harmoniser = true, prioritaire = false, ton = 'nuit', className = '', position = 'center' }: Props) {
  const [chargee, setChargee] = useState(false);
  const [echec, setEchec] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!chargee && <Etoffe ton={ton} className="absolute inset-0" />}
      {!echec && (
        <img
          src={urlImage(src, 1200, ratio ? Math.round(1200 * ratio) : undefined)}
          srcSet={srcSet(src, [480, 800, 1200, 1800], ratio)}
          sizes={sizes}
          alt={alt}
          loading={prioritaire ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setChargee(true)}
          onError={() => setEchec(true)}
          style={{ objectPosition: position }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-lente ease-etoffe ${chargee ? 'opacity-100' : 'opacity-0'} ${
            harmoniser ? 'photo-harmonisee' : ''
          }`}
        />
      )}
      {harmoniser && <div className="pointer-events-none absolute inset-0 bg-brun/15 mix-blend-multiply" aria-hidden="true" />}
    </div>
  );
}
