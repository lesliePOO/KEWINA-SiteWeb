# KEWINA

Boutique e-commerce de mode africaine contemporaine pour femmes et hommes — projet CampiTech.

## Stack

React 18, TypeScript, Vite, Tailwind CSS, React Router, Lucide. Base de données et administration (Supabase) et scène 3D (Three.js) arrivent aux étapes suivantes.

## Démarrer

```bash
npm install
cp .env.example .env   # puis renseigner VITE_WHATSAPP_NUMBER
npm run dev            # http://localhost:5173
npm run build          # vérification des types + build de production dans dist/
```

## Déploiement

Le dépôt est relié à Vercel (équipe CampiTech) : chaque envoi sur `main` déclenche un déploiement de production, chaque autre branche un déploiement de prévisualisation. Les variables d'environnement (`VITE_WHATSAPP_NUMBER`) se renseignent dans les réglages du projet Vercel.

## Structure

```
public/brand/        logos (recadrages provisoires du logo fourni)
src/config/          réglages de la boutique (WhatsApp, devise) et navigation
src/components/      composants (layout, puis catalogue, panier…)
src/pages/           pages routées
src/styles/          styles globaux et composants Tailwind
tailwind.config.js   tokens du design system KEWINA
```

## Règles de contenu

- Toute donnée fictive (produit, prix, stock) porte l'étiquette « Démo ».
- Frais de livraison non configurés : « À confirmer », jamais de montant inventé.
- Une demande envoyée sur WhatsApp n'est pas une commande confirmée.
