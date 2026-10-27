import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag } from 'lucide-react';
import { navigationPrincipale } from '../../config/navigation';
import { usePanier } from '../../context/PanierContext';
import { useFavoris } from '../../context/FavorisContext';
import { Logo } from '../ui/Logo';
import { MenuMobile } from './MenuMobile';

function Pastille({ n }: { n: number }) {
  if (n <= 0) return null;
  return (
    <span className="absolute -right-0.5 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-bronze px-1 text-[10px] font-medium leading-none text-noir">
      {n}
    </span>
  );
}

export function Header() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const { key } = useLocation();
  const { nombreArticles } = usePanier();
  const { favoris } = useFavoris();

  // Le menu mobile se ferme à chaque navigation, même vers la même page.
  useEffect(() => setMenuOuvert(false), [key]);

  return (
    <header className="zone-nuit sticky top-0 z-40 border-b border-ligne-nuit bg-noir text-creme">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-4 py-2.5 lg:px-12 lg:py-4">
        <Logo />

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Navigation principale">
          {navigationPrincipale.map((l) => (
            <NavLink
              key={l.chemin}
              to={l.chemin}
              end={l.chemin === '/'}
              className={({ isActive }) =>
                `relative py-2 font-ui text-[13px] transition-colors duration-rapide hover:text-or-lumiere ${
                  isActive ? 'text-or-lumiere after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-bronze' : 'text-creme'
                }`
              }
            >
              {l.libelle}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center">
          <Link to="/boutique?recherche=1" aria-label="Rechercher" className="grid h-11 w-11 place-items-center hover:text-or-lumiere">
            <Search size={20} strokeWidth={1.5} />
          </Link>
          <Link to="/favoris" aria-label={`Favoris (${favoris.length})`} className="relative hidden h-11 w-11 place-items-center hover:text-or-lumiere sm:grid">
            <Heart size={20} strokeWidth={1.5} />
            <Pastille n={favoris.length} />
          </Link>
          <Link to="/panier" aria-label={`Panier (${nombreArticles} articles)`} className="relative grid h-11 w-11 place-items-center hover:text-or-lumiere">
            <ShoppingBag size={20} strokeWidth={1.5} />
            <Pastille n={nombreArticles} />
          </Link>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center lg:hidden"
            aria-label="Ouvrir le menu"
            aria-expanded={menuOuvert}
            onClick={() => setMenuOuvert(true)}
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {menuOuvert && <MenuMobile onFermer={() => setMenuOuvert(false)} />}
    </header>
  );
}
