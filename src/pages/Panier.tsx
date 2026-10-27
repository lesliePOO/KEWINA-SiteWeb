import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Minus, Plus, Trash2 } from 'lucide-react';
import { formaterPrix } from '../config/site';
import { useCatalogue } from '../context/CatalogueContext';
import { usePanier } from '../context/PanierContext';
import { VisuelProduit } from '../components/produit/VisuelProduit';
import { ErreurCatalogue, EtatVide } from '../components/ui/Etats';
import { useEnvoiDemande } from '../lib/useEnvoiDemande';

export function Panier() {
  const { lignes, changerQuantite, retirer, vider } = usePanier();
  const { trouverVariante, chargement, erreur } = useCatalogue();
  const { envoyer, envoiEnCours, erreurEnvoi, problemes } = useEnvoiDemande();
  const navigate = useNavigate();
  const [nom, setNom] = useState('');
  const [ville, setVille] = useState('');
  const [ajustees, setAjustees] = useState<string[]>([]);

  // Quantités ramenées au stock réellement disponible.
  useEffect(() => {
    if (chargement) return;
    const modifiees: string[] = [];
    lignes.forEach((l) => {
      const v = trouverVariante(l.varianteId)?.variante;
      if (v && v.stock > 0 && l.quantite > v.stock) {
        changerQuantite(l.varianteId, v.stock);
        modifiees.push(l.varianteId);
      }
    });
    if (modifiees.length) setAjustees((a) => [...new Set([...a, ...modifiees])]);
  }, [chargement, lignes, trouverVariante, changerQuantite]);

  if (erreur) return <div className="mx-auto max-w-[1440px] px-4 py-16 lg:px-12"><ErreurCatalogue /></div>;

  const details = lignes.map((l) => ({ ligne: l, trouve: trouverVariante(l.varianteId) }));
  const indisponibles = details.filter(({ trouve }) => !trouve || trouve.variante.stock <= 0);
  const sousTotal = details.reduce((s, { ligne, trouve }) => s + (trouve && trouve.variante.stock > 0 ? trouve.produit.prix * ligne.quantite : 0), 0);
  const nbArticles = lignes.reduce((s, l) => s + l.quantite, 0);

  const commander = async () => {
    const demande = await envoyer(lignes, nom, ville);
    if (demande) {
      vider();
      navigate('/commande/prete', { state: demande });
    }
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-20 pt-8 lg:px-12 lg:pb-28 lg:pt-14">
      <h1 className="font-display text-[38px] font-medium lg:text-5xl">
        Votre panier {nbArticles > 0 && <span className="text-2xl text-encre-douce">({nbArticles})</span>}
      </h1>

      {lignes.length === 0 ? (
        <div className="mt-8">
          <EtatVide titre="Votre panier est vide" texte="Parcourez la boutique et ajoutez les pièces qui vous plaisent." action={{ libelle: 'Découvrir la boutique', vers: '/boutique' }} />
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14">
          <div>
            <ul className="border-t border-brun">
              {details.map(({ ligne, trouve }) => {
                const probleme = problemes.find((p) => p.variante_id === ligne.varianteId);
                if (!trouve) {
                  return (
                    <li key={ligne.varianteId} className="flex items-center justify-between gap-4 border-b border-ligne py-6">
                      <p className="text-sm text-carmin">Cet article n'est plus disponible.</p>
                      <button type="button" onClick={() => retirer(ligne.varianteId)} className="text-sm underline underline-offset-4">Retirer</button>
                    </li>
                  );
                }
                const { produit, variante } = trouve;
                const epuise = variante.stock <= 0;
                return (
                  <li key={ligne.varianteId} className="grid grid-cols-[88px_1fr] gap-4 border-b border-ligne py-6 sm:grid-cols-[110px_1fr_auto] sm:gap-6">
                    <Link to={`/produit/${produit.slug}`} className="aspect-[4/5] overflow-hidden bg-brun">
                      <VisuelProduit produit={produit} couleur={variante.couleur} mention={false} />
                    </Link>
                    <div className="flex flex-col gap-1">
                      <Link to={`/produit/${produit.slug}`} className="font-display text-xl leading-tight hover:text-terracotta-encre">{produit.nom}</Link>
                      <p className="text-sm tabular-nums">{formaterPrix(produit.prix)}</p>
                      <p className="text-xs text-encre-douce">
                        {[variante.taille && `Taille : ${variante.taille}`, variante.couleur && `Couleur : ${variante.couleur}`].filter(Boolean).join(' · ')}
                      </p>
                      {epuise && <p className="text-sm text-carmin">Épuisé — retirez cet article pour continuer.</p>}
                      {!epuise && ajustees.includes(variante.id) && <p className="text-sm text-stock-faible">Quantité ajustée au stock disponible ({variante.stock}).</p>}
                      {probleme && !epuise && <p className="text-sm text-carmin">Stock insuffisant{probleme.stock !== undefined ? ` (${probleme.stock} disponible${probleme.stock > 1 ? 's' : ''})` : ''}.</p>}
                      <div className="mt-3 flex items-center gap-5">
                        <div className="flex h-10 items-center border border-bord-controle bg-blanc-casse">
                          <button type="button" className="grid h-full w-10 place-items-center disabled:opacity-30" aria-label="Retirer un" disabled={ligne.quantite <= 1} onClick={() => changerQuantite(ligne.varianteId, ligne.quantite - 1)}><Minus size={14} /></button>
                          <output className="w-7 text-center text-sm tabular-nums">{ligne.quantite}</output>
                          <button type="button" className="grid h-full w-10 place-items-center disabled:opacity-30" aria-label="Ajouter un" disabled={ligne.quantite >= variante.stock} onClick={() => changerQuantite(ligne.varianteId, ligne.quantite + 1)}><Plus size={14} /></button>
                        </div>
                        <button type="button" onClick={() => retirer(ligne.varianteId)} className="grid h-10 w-10 place-items-center text-encre-douce hover:text-carmin" aria-label={`Retirer ${produit.nom}`}>
                          <Trash2 size={18} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                    <p className="col-span-2 text-right text-sm font-medium tabular-nums sm:col-span-1">{formaterPrix(produit.prix * ligne.quantite)}</p>
                  </li>
                );
              })}
            </ul>
            <Link to="/boutique" className="lien-souligne mt-8 inline-block">Continuer mes achats</Link>
          </div>

          <aside className="flex flex-col gap-5 self-start border border-ligne bg-blanc-casse p-6 lg:sticky lg:top-28 lg:p-8" aria-label="Récapitulatif">
            <h2 className="font-display text-2xl">Récapitulatif</h2>
            <dl className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between"><dt>Sous-total</dt><dd className="tabular-nums">{formaterPrix(sousTotal)}</dd></div>
              <div className="flex justify-between"><dt>Livraison</dt><dd className="text-encre-douce">À confirmer avec l'équipe</dd></div>
              <div className="flex justify-between border-t border-brun pt-4 text-base font-medium"><dt>Total estimé</dt><dd className="tabular-nums">{formaterPrix(sousTotal)}</dd></div>
            </dl>

            <fieldset className="flex flex-col gap-3 border-t border-ligne pt-5">
              <legend className="mb-3 text-xs uppercase tracking-label text-encre-douce">Pour vous répondre (facultatif)</legend>
              <label className="flex flex-col gap-1.5 text-sm">
                Votre nom
                <input value={nom} onChange={(e) => setNom(e.target.value)} maxLength={120} autoComplete="name" className="h-12 border border-bord-controle bg-creme px-3 text-base" />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                Ville ou quartier de livraison
                <input value={ville} onChange={(e) => setVille(e.target.value)} maxLength={120} autoComplete="address-level2" className="h-12 border border-bord-controle bg-creme px-3 text-base" />
              </label>
            </fieldset>

            <button
              type="button"
              onClick={() => void commander()}
              disabled={envoiEnCours || chargement || indisponibles.length > 0}
              className="btn btn-plein w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MessageCircle size={18} strokeWidth={1.5} /> {envoiEnCours ? 'Vérification du stock…' : 'Commander via WhatsApp'}
            </button>
            {indisponibles.length > 0 && <p className="text-sm text-carmin">Retirez les articles épuisés pour continuer.</p>}
            {erreurEnvoi && <p className="text-sm text-carmin" role="alert">{erreurEnvoi}</p>}
            <p className="text-xs leading-relaxed text-encre-douce">
              Cette demande n'est pas encore une commande. L'équipe KEWINA vérifie la disponibilité et vous confirme les frais de livraison sur WhatsApp.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}