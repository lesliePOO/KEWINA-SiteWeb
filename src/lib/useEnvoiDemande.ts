import { useState } from 'react';
import { creerDemande } from '../services/catalogue';
import { useCatalogue } from '../context/CatalogueContext';
import type { LignePanier, ProblemeDemande } from '../types/catalogue';
import type { DemandePrete } from './whatsapp';

/** Enregistre la demande côté serveur et renvoie ce qu'il faut pour ouvrir WhatsApp. */
export function useEnvoiDemande() {
  const { trouverVariante, recharger } = useCatalogue();
  const [envoiEnCours, setEnvoi] = useState(false);
  const [erreurEnvoi, setErreur] = useState<string | null>(null);
  const [problemes, setProblemes] = useState<ProblemeDemande[]>([]);

  const envoyer = async (lignes: LignePanier[], nom: string, ville: string): Promise<DemandePrete | null> => {
    setEnvoi(true);
    setErreur(null);
    setProblemes([]);
    try {
      const r = await creerDemande(lignes, nom.trim(), ville.trim());
      if (!r.ok) {
        setProblemes(r.problemes);
        setErreur('Certains articles ne sont plus disponibles dans la quantité demandée. Ajustez votre sélection.');
        void recharger();
        return null;
      }
      return {
        reference: r.reference,
        total: r.total_estime,
        lignes: r.lignes,
        nom: nom.trim(),
        ville: ville.trim(),
        contientDemo: r.lignes.some((l) => trouverVariante(l.variante_id)?.produit.est_demo),
      };
    } catch {
      setErreur("La demande n'a pas pu être enregistrée. Vérifiez votre connexion puis réessayez.");
      return null;
    } finally {
      setEnvoi(false);
    }
  };

  return { envoyer, envoiEnCours, erreurEnvoi, problemes };
}
