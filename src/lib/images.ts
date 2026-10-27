/** URL d'image redimensionnée. Les photos Unsplash sont servies par leur CDN à la bonne taille. */
export function urlImage(url: string, largeur: number, hauteur?: number): string {
  if (!url.includes('images.unsplash.com')) return url;
  const p = new URLSearchParams({ auto: 'format', fit: 'crop', q: '75', w: String(largeur) });
  if (hauteur) {
    p.set('h', String(hauteur));
    p.set('crop', 'faces,center');
  }
  return `${url.split('?')[0]}?${p.toString()}`;
}

/** srcset pour plusieurs largeurs, en gardant le même rapport hauteur/largeur. */
export function srcSet(url: string, largeurs: number[], ratio?: number): string | undefined {
  if (!url.includes('images.unsplash.com')) return undefined;
  return largeurs.map((w) => `${urlImage(url, w, ratio ? Math.round(w * ratio) : undefined)} ${w}w`).join(', ');
}
