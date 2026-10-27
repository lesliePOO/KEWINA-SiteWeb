import { Link } from 'react-router-dom';

/** Version compacte de l'en-tête : monogramme K + nom, tirés du logo fourni (non redessinés). */
export function Logo({ taille = 'normal' }: { taille?: 'normal' | 'petit' }) {
  const hauteurMono = taille === 'petit' ? 'h-8' : 'h-10 lg:h-12';
  const hauteurNom = taille === 'petit' ? 'h-4' : 'h-[18px] lg:h-[22px]';
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="KEWINA, accueil">
      <img src="/brand/kewina-monogramme.webp" alt="" className={`${hauteurMono} w-auto`} width={480} height={394} />
      <img src="/brand/kewina-wordmark.png" alt="KEWINA" className={`${hauteurNom} w-auto`} width={640} height={120} />
    </Link>
  );
}
