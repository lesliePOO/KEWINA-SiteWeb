import { NavLink } from 'react-router-dom';
import { Heart, House, MessageCircle, ShoppingBag, Store } from 'lucide-react';
import { usePanier } from '../../context/PanierContext';
import { useFavoris } from '../../context/FavorisContext';

/** Barre de navigation fixe en bas de l'écran sur mobile (comme sur les maquettes). */
export function NavMobileBas() {
  const { nombreArticles } = usePanier();
  const { favoris } = useFavoris();

  const elements = [
    { to: '/', libelle: 'Accueil', Icone: House, n: 0 },
    { to: '/boutique', libelle: 'Boutique', Icone: Store, n: 0 },
    { to: '/favoris', libelle: 'Favoris', Icone: Heart, n: favoris.length },
    { to: '/panier', libelle: 'Panier', Icone: ShoppingBag, n: nombreArticles },
    { to: '/contact', libelle: 'Contact', Icone: MessageCircle, n: 0 },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-ligne bg-blanc-casse/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Navigation rapide"
    >
      <ul className="grid grid-cols-5">
        {elements.map(({ to, libelle, Icone, n }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `relative flex h-16 flex-col items-center justify-center gap-1 text-[10px] ${isActive ? 'text-terracotta-encre' : 'text-encre-douce'}`
              }
            >
              <Icone size={20} strokeWidth={1.5} />
              {libelle}
              {n > 0 && (
                <span className="absolute left-1/2 top-2 ml-2 grid h-4 min-w-4 place-items-center rounded-full bg-brun px-1 text-[9px] text-creme">{n}</span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
