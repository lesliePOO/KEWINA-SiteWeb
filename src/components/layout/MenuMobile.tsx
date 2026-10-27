import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { usePanier } from '../../context/PanierContext';
import { useFavoris } from '../../context/FavorisContext';
import { useCatalogue } from '../../context/CatalogueContext';
import { BandeWax } from '../ui/Etoffe';
import { Logo } from '../ui/Logo';

export function MenuMobile({ onFermer }: { onFermer: () => void }) {
  const [ouvert, setOuvert] = useState<'boutique' | 'collections' | null>(null);
  const { nombreArticles } = usePanier();
  const { favoris } = useFavoris();
  const { collections } = useCatalogue();

  useEffect(() => {
    const precedent = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const echap = (e: KeyboardEvent) => e.key === 'Escape' && onFermer();
    window.addEventListener('keydown', echap);
    return () => {
      document.body.style.overflow = precedent;
      window.removeEventListener('keydown', echap);
    };
  }, [onFermer]);

  const lien = 'block py-2 font-ui text-[17px] text-creme';
  const sousLien = 'block py-1.5 text-[15px] text-sable';

  const Groupe = ({ cle, titre, children }: { cle: 'boutique' | 'collections'; titre: string; children: ReactNode }) => (
    <li>
      <button type="button" className={`${lien} flex w-full items-center justify-between`} aria-expanded={ouvert === cle} onClick={() => setOuvert(ouvert === cle ? null : cle)}>
        {titre}
        {ouvert === cle ? <Minus size={18} strokeWidth={1.5} /> : <Plus size={18} strokeWidth={1.5} />}
      </button>
      {ouvert === cle && <div className="pb-2 pl-3">{children}</div>}
    </li>
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-noir lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="flex items-center justify-between px-4 py-2.5">
        <Logo />
        <button type="button" onClick={onFermer} className="grid h-11 w-11 place-items-center text-creme" aria-label="Fermer le menu">
          <X size={24} strokeWidth={1.5} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-6 pt-6" aria-label="Navigation mobile">
        <ul className="flex flex-col gap-1">
          <li><Link to="/" className={lien}>Accueil</Link></li>
          <Groupe cle="boutique" titre="Boutique">
            <Link to="/boutique" className={sousLien}>Toute la boutique</Link>
            <Link to="/boutique?tri=nouveautes" className={sousLien}>Nouveautés</Link>
          </Groupe>
          <li><Link to="/boutique?genre=femme" className={lien}>Femme</Link></li>
          <li><Link to="/boutique?genre=homme" className={lien}>Homme</Link></li>
          <Groupe cle="collections" titre="Collections">
            <Link to="/collections" className={sousLien}>Toutes les collections</Link>
            {collections.map((c) => (
              <Link key={c.slug} to={`/boutique?collection=${c.slug}`} className={sousLien}>{c.titre}</Link>
            ))}
          </Groupe>
          <li><Link to="/a-propos" className={lien}>La Maison</Link></li>
          <li><Link to="/lookbook" className={lien}>Lookbook</Link></li>
          <li><Link to="/contact" className={lien}>Contact</Link></li>
        </ul>

        <div className="my-8 h-px bg-ligne-nuit" />

        <ul className="flex flex-col gap-4 pb-8 text-[15px] text-creme">
          <li>
            <Link to="/favoris" className="flex items-center gap-3"><Heart size={18} strokeWidth={1.5} /> Mes favoris ({favoris.length})</Link>
          </li>
          <li>
            <Link to="/panier" className="flex items-center gap-3"><ShoppingBag size={18} strokeWidth={1.5} /> Panier ({nombreArticles})</Link>
          </li>
        </ul>
      </nav>

      <BandeWax className="h-16" />
    </div>
  );
}
