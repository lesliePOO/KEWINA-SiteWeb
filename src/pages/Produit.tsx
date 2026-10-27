import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowRight, Check, MessageCircle, Minus, PackageCheck, Plus, Ruler, Truck } from 'lucide-react';
import { formaterPrix } from '../config/site';
import { useCatalogue } from '../context/CatalogueContext';
import { usePanier } from '../context/PanierContext';
import { BoutonFavori } from '../components/produit/BoutonFavori';
import { CarteProduit } from '../components/produit/CarteProduit';
import { VisuelProduit } from '../components/produit/VisuelProduit';
import { couleursDe, etatStock, taillesDe, varianteDe } from '../components/produit/outils';
import { ErreurCatalogue } from '../components/ui/Etats';
import { useEnvoiDemande } from '../lib/useEnvoiDemande';
import { EnPreparation } from './EnPreparation';

const ONGLETS = ['Description', 'Détails', 'Livraison & retours'] as const;

export function Produit() {
  const { slug = '' } = useParams();
  const { produitParSlug, produits, chargement, erreur, seuilStockFaible } = useCatalogue();
  const { ajouter } = usePanier();
  const navigate = useNavigate();
  const { envoyer, envoiEnCours, erreurEnvoi } = useEnvoiDemande();
  const produit = produitParSlug(slug);

  const [couleur, setCouleur] = useState<string | null>(null);
  const [taille, setTaille] = useState<string | null>(null);
  const [quantite, setQuantite] = useState(1);
  const [vue, setVue] = useState(0);
  const [onglet, setOnglet] = useState<(typeof ONGLETS)[number]>('Description');
  const [erreurChoix, setErreurChoix] = useState(false);
  const [ajoute, setAjoute] = useState(false);

  const couleurs = useMemo(() => (produit ? couleursDe(produit) : []), [produit]);
  const tailles = useMemo(() => (produit ? taillesDe(produit) : []), [produit]);

  // Couleur présélectionnée s'il n'y en a qu'une ; taille présélectionnée si taille unique.
  useEffect(() => {
    setCouleur(couleurs.length === 1 ? couleurs[0].nom : null);
    setTaille(tailles.length === 1 ? tailles[0] : null);
    setQuantite(1);
    setVue(0);
    setAjoute(false);
    setErreurChoix(false);
  }, [produit?.id, couleurs, tailles]);

  if (erreur) return <div className="mx-auto max-w-[1440px] px-4 py-16 lg:px-12"><ErreurCatalogue /></div>;
  if (chargement) return <div className="mx-auto h-[70vh] max-w-[1440px] animate-pulse px-4 py-16 lg:px-12"><div className="h-full bg-ligne" /></div>;
  if (!produit) return <EnPreparation titre="Ce produit n'existe pas ou n'est plus en vente" surtitre="Produit introuvable" />;

  const NB_VUES = Math.max(produit.images.length, 1);
  const besoinCouleur = couleurs.length > 0;
  const besoinTaille = tailles.length > 0;
  const variante = varianteDe(produit, besoinTaille ? taille : null, besoinCouleur ? couleur : null);
  const stockVariante = variante?.stock ?? 0;
  const tailleEpuisee = (t: string) => {
    const v = varianteDe(produit, t, besoinCouleur ? couleur : null);
    return couleur || !besoinCouleur ? !v || v.stock <= 0 : produit.variantes.filter((x) => x.taille === t).every((x) => x.stock <= 0);
  };
  const manque = besoinCouleur && !couleur ? 'une couleur' : besoinTaille && !taille ? 'une taille' : null;
  const etat = variante ? etatStock(stockVariante, seuilStockFaible) : null;
  const similaires = produits.filter((p) => p.id !== produit.id && (p.categorie?.slug === produit.categorie?.slug || p.genre === produit.genre)).slice(0, 5);

  const verifier = () => {
    if (manque || !variante) {
      setErreurChoix(true);
      return false;
    }
    if (stockVariante <= 0) return false;
    return true;
  };

  const surAjout = () => {
    if (!verifier() || !variante) return;
    ajouter(variante.id, Math.min(quantite, stockVariante));
    setAjoute(true);
  };

  const surWhatsApp = async () => {
    if (!verifier() || !variante) return;
    const demande = await envoyer([{ varianteId: variante.id, quantite: Math.min(quantite, stockVariante) }], '', '');
    if (demande) navigate('/commande/prete', { state: demande });
  };

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-4 lg:px-12">
        <nav aria-label="Fil d'Ariane" className="py-4 text-xs text-encre-douce">
          <Link to="/" className="hover:text-brun">Accueil</Link> / <Link to="/boutique" className="hover:text-brun">Boutique</Link> /{' '}
          <Link to={`/boutique?genre=${produit.genre}`} className="capitalize hover:text-brun">{produit.genre}</Link> /{' '}
          <span className="text-brun">{produit.nom}</span>
        </nav>

        <div className="grid gap-8 pb-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14 lg:pb-24">
          {/* Galerie */}
          <div className="flex flex-col-reverse gap-3 lg:flex-row">
            <div className="flex gap-3 lg:w-20 lg:flex-col" role="tablist" aria-label="Vues du produit">
              {Array.from({ length: NB_VUES }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={vue === i}
                  aria-label={`Vue ${i + 1}`}
                  onClick={() => setVue(i)}
                  className={`aspect-[4/5] w-16 overflow-hidden border lg:w-full ${vue === i ? 'border-brun' : 'border-transparent opacity-80 hover:opacity-100'}`}
                >
                  <VisuelProduit produit={produit} index={i} couleur={couleur} mention={false} sizes="96px" />
                </button>
              ))}
            </div>
            <div className="group relative aspect-[4/5] flex-1 overflow-hidden bg-brun">
              <div key={`${vue}-${couleur}`} className="absolute inset-0 animate-apparition">
                <VisuelProduit produit={produit} index={vue} couleur={couleur} sizes="(min-width: 1024px) 50vw, 100vw" prioritaire />
              </div>
              <BoutonFavori slug={produit.slug} nom={produit.nom} className="absolute right-4 top-4" />
              {produit.est_demo && <span className="etiquette-demo absolute left-4 top-4 bg-blanc-casse/90 text-encre-douce">Produit de démonstration</span>}
              <button type="button" onClick={() => setVue((vue + NB_VUES - 1) % NB_VUES)} className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-blanc-casse/90" aria-label="Vue précédente">
                <ArrowLeft size={18} strokeWidth={1.5} />
              </button>
              <button type="button" onClick={() => setVue((vue + 1) % NB_VUES)} className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-blanc-casse/90" aria-label="Vue suivante">
                <ArrowRight size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Achat */}
          <div className="flex flex-col gap-7 lg:sticky lg:top-28 lg:self-start">
            <div>
              <h1 className="font-display text-[34px] font-medium leading-tight lg:text-[42px]">{produit.nom}</h1>
              <p className="mt-2 text-xl font-medium tabular-nums">{formaterPrix(produit.prix)}</p>
            </div>

            {besoinCouleur && (
              <fieldset>
                <legend className="mb-3 text-sm">Couleur : <span className="text-encre-douce">{couleur ?? 'à choisir'}</span></legend>
                <div className="flex flex-wrap gap-3">
                  {couleurs.map((c) => (
                    <button
                      key={c.nom}
                      type="button"
                      aria-pressed={couleur === c.nom}
                      aria-label={c.nom}
                      title={c.nom}
                      onClick={() => {
                        setCouleur(c.nom);
                        setErreurChoix(false);
                        setAjoute(false);
                        if (taille && (varianteDe(produit, taille, c.nom)?.stock ?? 0) <= 0) setTaille(null);
                      }}
                      className={`h-9 w-9 rounded-full ring-1 ring-bord-controle transition-shadow ${couleur === c.nom ? 'ring-2 ring-brun ring-offset-[3px] ring-offset-creme' : ''}`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </fieldset>
            )}

            {besoinTaille && (
              <fieldset>
                <div className="mb-3 flex items-center justify-between">
                  <legend className="text-sm">Taille : <span className="text-encre-douce">{taille ?? 'à choisir'}</span></legend>
                  <Link to="/faq#tailles" className="flex items-center gap-1.5 text-xs underline underline-offset-4"><Ruler size={14} strokeWidth={1.5} /> Guide des tailles</Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tailles.map((t) => {
                    const epuise = tailleEpuisee(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        disabled={epuise}
                        aria-pressed={taille === t}
                        aria-label={epuise ? `${t}, épuisé` : t}
                        onClick={() => {
                          setTaille(t);
                          setErreurChoix(false);
                          setAjoute(false);
                        }}
                        className={`h-11 min-w-[52px] border px-3 text-sm transition-colors ${
                          taille === t
                            ? 'border-brun bg-brun text-creme'
                            : epuise
                              ? 'taille-epuisee cursor-not-allowed border-ligne text-encre-douce'
                              : 'border-bord-controle bg-blanc-casse hover:border-brun'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            <div className="flex flex-col gap-2 text-sm">
              {erreurChoix && manque && (
                <p className="flex items-center gap-2 text-carmin" role="alert"><AlertCircle size={16} /> Choisissez {manque} pour continuer.</p>
              )}
              {variante && etat === 'epuise' && <p className="text-carmin">Épuisé dans cette combinaison.</p>}
              {variante && etat === 'faible' && <p className="text-stock-faible">Plus que {stockVariante} pièce{stockVariante > 1 ? 's' : ''} disponible{stockVariante > 1 ? 's' : ''}.</p>}
              {variante && etat === 'disponible' && <p className="flex items-center gap-2 text-dispo"><Check size={16} /> Disponible</p>}
              {produit.est_demo && <p className="text-xs text-encre-douce">Prix et stock de démonstration.</p>}
            </div>

            <div className="flex gap-3">
              <div className="flex h-[52px] items-center border border-bord-controle bg-blanc-casse">
                <button type="button" className="grid h-full w-11 place-items-center" aria-label="Retirer un" onClick={() => setQuantite(Math.max(1, quantite - 1))}><Minus size={16} /></button>
                <output className="w-8 text-center tabular-nums" aria-live="polite">{quantite}</output>
                <button
                  type="button"
                  className="grid h-full w-11 place-items-center disabled:opacity-30"
                  aria-label="Ajouter un"
                  disabled={!!variante && quantite >= stockVariante}
                  onClick={() => setQuantite(Math.min(variante ? stockVariante : 10, quantite + 1))}
                >
                  <Plus size={16} />
                </button>
              </div>
              <button type="button" onClick={surAjout} disabled={etat === 'epuise'} className="btn btn-plein flex-1 px-4 disabled:cursor-not-allowed disabled:opacity-50">
                {manque ? `Choisissez ${manque}` : etat === 'epuise' ? 'Épuisé' : 'Ajouter au panier'}
              </button>
            </div>
            {ajoute && (
              <div className="-mt-3 flex items-center justify-between border border-ligne bg-blanc-casse px-4 py-3 text-sm" role="status">
                <span>Ajouté au panier — {[couleur, taille && `taille ${taille}`].filter(Boolean).join(', ')}</span>
                <Link to="/panier" className="font-medium underline underline-offset-4">Voir le panier</Link>
              </div>
            )}
            <button type="button" onClick={() => void surWhatsApp()} disabled={envoiEnCours || etat === 'epuise'} className="btn -mt-3 disabled:opacity-50">
              <MessageCircle size={18} strokeWidth={1.5} /> {envoiEnCours ? 'Préparation…' : 'Commander via WhatsApp'}
            </button>
            {erreurEnvoi && <p className="-mt-3 text-sm text-carmin" role="alert">{erreurEnvoi}</p>}

            <ul className="grid grid-cols-3 gap-2 border-y border-ligne py-5 text-center text-[11px] leading-snug text-encre-douce">
              <li className="flex flex-col items-center gap-2"><MessageCircle size={20} strokeWidth={1.3} className="text-brun" />Confirmation avec l'équipe sur WhatsApp</li>
              <li className="flex flex-col items-center gap-2"><Truck size={20} strokeWidth={1.3} className="text-brun" />Frais de livraison confirmés avant validation</li>
              <li className="flex flex-col items-center gap-2"><PackageCheck size={20} strokeWidth={1.3} className="text-brun" />Disponibilité vérifiée à chaque demande</li>
            </ul>

            <div>
              <div className="flex gap-6 border-b border-ligne" role="tablist">
                {ONGLETS.map((o) => (
                  <button key={o} type="button" role="tab" aria-selected={onglet === o} onClick={() => setOnglet(o)} className={`-mb-px pb-3 text-sm ${onglet === o ? 'border-b border-brun text-brun' : 'text-encre-douce'}`}>
                    {o}
                  </button>
                ))}
              </div>
              <div className="pt-5 text-sm leading-relaxed text-encre-douce" role="tabpanel">
                {onglet === 'Description' && <p>{produit.description ?? 'Description à venir.'}</p>}
                {onglet === 'Détails' && (
                  <dl className="grid grid-cols-[110px_1fr] gap-y-2">
                    <dt className="text-brun">Matière</dt><dd>{produit.matieres ?? 'À préciser'}</dd>
                    <dt className="text-brun">Confection</dt><dd>{produit.confection ?? 'À préciser'}</dd>
                    <dt className="text-brun">Entretien</dt><dd>{produit.entretien ?? 'À préciser'}</dd>
                    {produit.collection && (<><dt className="text-brun">Collection</dt><dd>{produit.collection.titre}</dd></>)}
                  </dl>
                )}
                {onglet === 'Livraison & retours' && (
                  <p>
                    Les zones, délais et frais de livraison sont confirmés par l'équipe KEWINA sur WhatsApp avant toute validation. Les conditions de
                    retour et d'échange seront publiées dans la <Link to="/faq" className="underline underline-offset-4">FAQ</Link>.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {similaires.length > 0 && (
        <section className="mx-auto max-w-[1440px] border-t border-ligne px-4 py-14 lg:px-12 lg:py-20">
          <h2 className="mb-6 font-display text-3xl font-medium">Produits similaires</h2>
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-6 lg:px-0">
            {similaires.map((p) => (
              <div key={p.id} className="w-[46%] shrink-0 sm:w-[31%] lg:w-auto"><CarteProduit produit={p} compacte /></div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
