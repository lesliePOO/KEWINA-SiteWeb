import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Accueil } from './pages/Accueil';
import { Boutique } from './pages/Boutique';
import { Collections } from './pages/Collections';
import { Contact } from './pages/Contact';
import { Faq } from './pages/Faq';
import { LaMaison } from './pages/LaMaison';
import { Confidentialite, MentionsLegales } from './pages/Legal';
import { Lookbook } from './pages/Lookbook';
import { Credits } from './pages/Credits';
import { CommandePrete } from './pages/CommandePrete';
import { PageIntrouvable } from './pages/EnPreparation';
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
        <Route path="lookbook" element={<Lookbook />} />
        <Route path="a-propos" element={<LaMaison />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faq" element={<Faq />} />
        <Route path="mentions-legales" element={<MentionsLegales />} />
        <Route path="confidentialite" element={<Confidentialite />} />
        <Route path="credits-photos" element={<Credits />} />
        <Route path="*" element={<PageIntrouvable />} />
      </Route>
    </Routes>
  );
}
