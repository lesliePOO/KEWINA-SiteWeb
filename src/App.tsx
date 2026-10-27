import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Accueil } from './pages/Accueil';
import { EnPreparation, PageIntrouvable } from './pages/EnPreparation';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Accueil />} />
        <Route path="boutique" element={<EnPreparation titre="La boutique" surtitre="Catalogue" />} />
        <Route path="collections" element={<EnPreparation titre="Les collections" />} />
        <Route path="produit/:slug" element={<EnPreparation titre="Fiche produit" />} />
        <Route path="panier" element={<EnPreparation titre="Votre panier" />} />
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
