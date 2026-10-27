/**
 * Photos d'illustration libres de droits (licence Unsplash : usage commercial autorisé, sans attribution obligatoire).
 * Elles ne montrent PAS des produits KEWINA : à remplacer par les photos de campagne de la marque.
 */
export interface Visuel {
  src: string;
  alt: string;
  credit: string;
  page: string;
}

const u = (id: string) => `https://images.unsplash.com/${id}`;

export const visuels = {
  hero: [
    { src: u('photo-1681545303529-b6beb2e19f02'), alt: 'Femmes en tenues africaines contemporaines', credit: 'Graca Assane', page: 'https://unsplash.com/photos/eyT2DnV5HhI' },
    { src: u('photo-1531123414780-f74242c2b052'), alt: 'Portrait de femme devant un mur rouge', credit: 'Prince Akachi', page: 'https://unsplash.com/photos/LWkFHEGpleE' },
    { src: u('photo-1661332517932-2d441bfb2994'), alt: 'Homme et femme en tenue traditionnelle', credit: 'Tope. A Asokere', page: 'https://unsplash.com/photos/nRrFmCS6vTE' },
  ],
  femme: { src: u('photo-1696962678565-bee84e6b9cb6'), alt: 'Femme en robe et chapeau devant un mur jaune', credit: 'Eduardo Espinoza', page: 'https://unsplash.com/photos/rl7jMcSUnSg' },
  homme: { src: u('photo-1788035963223-06abb95a1289'), alt: 'Homme en agbada à motifs', credit: 'McFollis', page: 'https://unsplash.com/photos/ssj4bLDQ_m0' },
  savoirFaire: { src: u('photo-1790943780822-9918073fe9f1'), alt: 'Couturières au travail dans un atelier', credit: 'Unsplash', page: 'https://unsplash.com/photos/KK1SKkRfk1c' },
  tissus: { src: u('photo-1768212566108-4ce4f329e4d2'), alt: 'Tissus africains à motifs suspendus', credit: 'WyteShot', page: 'https://unsplash.com/photos/Q43GOm-D06k' },
} satisfies Record<string, Visuel | Visuel[]>;

/** Liste pour la page « Crédits photos ». */
export const tousLesVisuels: Visuel[] = [...visuels.hero, visuels.femme, visuels.homme, visuels.savoirFaire, visuels.tissus];
