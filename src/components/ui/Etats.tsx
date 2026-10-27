import { Link } from 'react-router-dom';
import { useCatalogue } from '../../context/CatalogueContext';

export function ChargementGrille({ nombre = 6, colonnes = 'grid-cols-2 lg:grid-cols-3' }: { nombre?: number; colonnes?: string }) {
  return (
    <div className={`grid gap-x-4 gap-y-8 lg:gap-x-6 ${colonnes}`} aria-busy="true" aria-label="Chargement des produits">
      {Array.from({ length: nombre }, (_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/5] bg-ligne" />
          <div className="mt-3 h-4 w-3/4 bg-ligne" />
          <div className="mt-2 h-3 w-1/3 bg-ligne" />
        </div>
      ))}
    </div>
  );
}

export function ErreurCatalogue() {
  const { erreur, recharger } = useCatalogue();
  return (
    <div className="flex flex-col items-start gap-4 border border-ligne bg-blanc-casse p-8" role="alert">
      <h2 className="font-display text-2xl">Le catalogue n'a pas pu être chargé</h2>
      <p className="text-sm text-encre-douce">Vérifiez votre connexion puis réessayez.{erreur ? ` (${erreur})` : ''}</p>
      <button type="button" className="btn" onClick={() => void recharger()}>
        Réessayer
      </button>
    </div>
  );
}

export function EtatVide({ titre, texte, action }: { titre: string; texte: string; action?: { libelle: string; vers: string } }) {
  return (
    <div className="flex flex-col items-center gap-4 border border-ligne bg-blanc-casse px-6 py-14 text-center">
      <h2 className="font-display text-2xl">{titre}</h2>
      <p className="max-w-sm text-sm text-encre-douce">{texte}</p>
      {action && (
        <Link to={action.vers} className="btn mt-2">
          {action.libelle}
        </Link>
      )}
    </div>
  );
}
