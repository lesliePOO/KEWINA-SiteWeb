import { useCatalogue } from '../context/CatalogueContext';
import { useFavoris } from '../context/FavorisContext';
import { CarteProduit } from '../components/produit/CarteProduit';
import { ChargementGrille, EtatVide } from '../components/ui/Etats';

export function Favoris() {
  const { favoris } = useFavoris();
  const { produits, chargement } = useCatalogue();
  const liste = produits.filter((p) => favoris.includes(p.slug));

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-20 pt-8 lg:px-12 lg:pb-28 lg:pt-14">
      <h1 className="font-display text-[38px] font-medium lg:text-5xl">Mes favoris</h1>
      <p className="mb-8 mt-2 text-sm text-encre-douce">Vos favoris sont gardés sur cet appareil.</p>
      {chargement ? (
        <ChargementGrille nombre={4} colonnes="grid-cols-2 lg:grid-cols-4" />
      ) : liste.length === 0 ? (
        <EtatVide titre="Aucun favori pour l'instant" texte="Touchez le cœur sur une pièce pour la retrouver ici." action={{ libelle: 'Découvrir la boutique', vers: '/boutique' }} />
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 lg:grid-cols-4 lg:gap-x-6">
          {liste.map((p) => <CarteProduit key={p.id} produit={p} />)}
        </div>
      )}
    </div>
  );
}
