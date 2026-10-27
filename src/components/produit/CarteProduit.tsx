import { Link } from 'react-router-dom';
import { formaterPrix } from '../../config/site';
import { useCatalogue } from '../../context/CatalogueContext';
import type { Produit } from '../../types/catalogue';
import { BoutonFavori } from './BoutonFavori';
import { VisuelProduit } from './VisuelProduit';
import { couleursDe, etatStock, stockTotal } from './outils';

export function CarteProduit({ produit, compacte = false }: { produit: Produit; compacte?: boolean }) {
  const { seuilStockFaible } = useCatalogue();
  const etat = etatStock(stockTotal(produit), seuilStockFaible);
  const couleurs = couleursDe(produit);

  return (
    <Link to={`/produit/${produit.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-brun">
        <div className="absolute inset-0 transition-transform duration-lente ease-etoffe group-hover:scale-[1.04]">
          <VisuelProduit produit={produit} mention={!compacte} />
        </div>
        <div className="absolute inset-0 opacity-0 transition-opacity duration-base ease-etoffe group-hover:opacity-100">
          <VisuelProduit produit={produit} index={1} mention={false} />
        </div>
        <BoutonFavori slug={produit.slug} nom={produit.nom} className="absolute right-2.5 top-2.5" />
        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {produit.est_demo && <span className="etiquette-demo bg-blanc-casse/90 text-encre-douce">Démo</span>}
          {etat === 'epuise' && <span className="bg-carmin px-2 py-0.5 text-[10px] uppercase tracking-bouton text-creme">Épuisé</span>}
        </div>
      </div>
      <div className="flex flex-col gap-1 pt-3">
        <h3 className={`font-display font-medium leading-tight ${compacte ? 'text-[17px]' : 'text-[19px] lg:text-xl'}`}>{produit.nom}</h3>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium tabular-nums">{formaterPrix(produit.prix)}</span>
          {couleurs.length > 1 && (
            <span className="flex gap-1" aria-label={`${couleurs.length} couleurs`}>
              {couleurs.slice(0, 4).map((c) => (
                <span key={c.nom} className="h-2.5 w-2.5 rounded-full ring-1 ring-bord-controle" style={{ backgroundColor: c.hex }} />
              ))}
            </span>
          )}
        </div>
        {etat === 'faible' && <span className="text-xs text-stock-faible">Plus que quelques pièces</span>}
      </div>
    </Link>
  );
}
