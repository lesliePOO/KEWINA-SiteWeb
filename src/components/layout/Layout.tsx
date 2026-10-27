import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BarreAnnonce } from './BarreAnnonce';
import { Header } from './Header';
import { Footer } from './Footer';
import { NavMobileBas } from './NavMobileBas';

export function Layout() {
  const { pathname, hash } = useLocation();

  // Retour en haut à chaque page, sauf lien vers une ancre (#livraison…) gérée par la page.
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col pb-16 lg:pb-0">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-creme focus:px-4 focus:py-2">
        Aller au contenu
      </a>
      <BarreAnnonce />
      <Header />
      <main id="contenu" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <NavMobileBas />
    </div>
  );
}
