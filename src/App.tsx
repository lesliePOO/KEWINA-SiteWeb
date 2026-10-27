import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Accueil } from './pages/Accueil';
import { Boutique } from './pages/Boutique';
import { Collections } from './pages/Collections';
import { CommandePrete } from './pages/CommandePrete';
import { EnPreparation, PageIntrouvable } from './pages/EnPreparation';
import { Favoris } from './pages/Favoris';
import { Panier } from './pages/Panier';
import { Produit } from './pages/Produit';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Accueil />} />
        <Route path="boutique" element={<Boutique />} />
        <Route path="collections" element={<Collections />} />
        <Route path="produit/:slug" element={<Produit />} />
        <Route path="panier" element={<Panier />} />
        <Route path="commande/prete" element={<CommandePrete />} />
        <Route path="favoris" element={<Favoris />} />
        <Route path="lookbook" element={<EnPreparation titre="Lookbook" surtitre="Inspirations" />} />
        <Route path="a-propos" element={<EnPreparation titre="La Maison KEWINA" surtitre="À propos" />} />
        <Route path="contact" element={<EnPreparation titre="Contact" />} />
        <Route path="faq" element={<EnPreparation titre="FAQ et livraison" />} />
        <Route path="mentions-legales" element={<EnPreparation titre="Mentions légales" />} />
        <Route path="confidentialite" element={<EnPreparation titre="Confidentialité" />} />
        <Route path="*" element={<PageIntrouvable />} />
      </Route>
    </Routes>
  );
}
