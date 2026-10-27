/** Largeurs disponibles pour les photos du shooting KEWINA (dossier public/shooting). */
function largeursShooting(nom: string): number[] {
  if (nom.startsWith('campagne') || nom.startsWith('tissus')) return [700, 1376];
  if (nom.startsWith('atelier')) return [640, 1200];
  return [480, 928];
}

const SHOOTING = /^\/shooting\/(.+)-(\d+)\.webp$/;

/** URL d'image redimensionnée. Les photos Unsplash sont servies par leur CDN à la bonne taille. */
export function urlImage(url: string, largeur: number, hauteur?: number): string {
  const m = SHOOTING.exec(url);
  if (m) {
    const tailles = largeursShooting(m[1]);
    const choisie = tailles.find((t) => t >= largeur) ?? tailles[tailles.length - 1];
    return `/shooting/${m[1]}-${choisie}.webp`;
  }
  if (!url.includes('images.unsplash.com')) return url;
  const p = new URLSearchParams({ auto: 'format', fit: 'crop', q: '75', w: String(largeur) });
  if (hauteur) {
    p.set('h', String(hauteur));
    p.set('crop', 'faces,entropy');
  }
  return `${url.split('?')[0]}?${p.toString()}`;
}

/** srcset pour plusieurs largeurs, en gardant le même rapport hauteur/largeur. */
export function srcSet(url: string, largeurs: number[], ratio?: number): string | undefined {
  const m = SHOOTING.exec(url);
  if (m) return largeursShooting(m[1]).map((w) => `/shooting/${m[1]}-${w}.webp ${w}w`).join(', ');
  if (!url.includes('images.unsplash.com')) return undefined;
  return largeurs.map((w) => `${urlImage(url, w, ratio ? Math.round(w * ratio) : undefined)} ${w}w`).join(', ');
}

/** Vrai pour les photos libres de droits encore utilisées en attendant le shooting complet. */
export const estPhotoExterne = (url: string) => url.includes('images.unsplash.com');
