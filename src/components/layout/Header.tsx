import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { navigationPrincipale } from '../../config/navigation';

const classeLien = ({ isActive }: { isActive: boolean }) =>
  `font-ui text-xs font-medium uppercase tracking-bouton transition-colors duration-rapide hover:text-or-lumiere ${
    isActive ? 'text-or-lumiere' : 'text-creme'
  }`;

export function Header() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const { pathname } = useLocation();

  // Le menu mobile se ferme à chaque changement de page.
  useEffect(() => setMenuOuvert(false), [pathname]);

  return (
    <header className="zone-nuit sticky top-0 z-40 border-b border-ligne-nuit bg-noir text-creme">
      <div className="mx-auto grid max-w-[1440px] grid-cols-[44px_1fr_44px] items-center px-3 py-2.5 lg:grid-cols-[auto_1fr_auto] lg:gap-10 lg:px-12 lg:py-5">
        <button
          type="button"
          className="grid h-11 w-11 place-items-center lg:hidden"
          aria-label={menuOuvert ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOuvert}
          aria-controls="menu-mobile"
          onClick={() => setMenuOuvert((v) => !v)}
        >
          {menuOuvert ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>

        <Link to="/" className="justify-self-center lg:justify-self-start" aria-label="KEWINA, accueil">
          <img src="/brand/kewina-wordmark.png" alt="KEWINA" className="block h-5 w-auto lg:h-[26px]" width={640} height={120} />
        </Link>

        <nav className="hidden justify-center gap-9 lg:flex" aria-label="Navigation principale">
          {navigationPrincipale.map((l) => (
            <NavLink key={l.chemin} to={l.chemin} end={l.chemin === '/'} className={classeLien}>
              {l.libelle}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-1 lg:gap-4">
          <Link to="/boutique" aria-label="Rechercher dans la boutique" className="hidden h-11 w-11 place-items-center hover:text-or-lumiere lg:grid">
            <Search size={20} strokeWidth={1.5} />
          </Link>
          <Link to="/panier" aria-label="Panier" className="grid h-11 w-11 place-items-center hover:text-or-lumiere">
            <ShoppingBag size={21} strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      {menuOuvert && (
        <nav id="menu-mobile" className="border-t border-ligne-nuit px-6 pb-10 pt-6 lg:hidden" aria-label="Navigation mobile">
          <ul className="flex flex-col gap-5">
            {navigationPrincipale.map((l) => (
              <li key={l.chemin}>
                <NavLink to={l.chemin} end={l.chemin === '/'} className="font-display text-2xl text-creme">
                  {l.libelle}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink to="/faq" className="font-display text-2xl text-creme">
                FAQ et livraison
              </NavLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
