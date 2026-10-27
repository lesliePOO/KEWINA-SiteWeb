import { useId } from 'react';

export type TonEtoffe = 'wax' | 'terre' | 'nuit' | 'bordeaux' | 'sable';

const PALETTES: Record<TonEtoffe, { fond: string; trait: string; coeur: string; coin: string; eclat: string }> = {
  wax: { fond: '#2a120c', trait: '#c9943a', coeur: '#8a2a1f', coin: '#b66a3c', eclat: '#e6b36a' },
  terre: { fond: '#7a3a1c', trait: '#e6b36a', coeur: '#2a120c', coin: '#c9943a', eclat: '#f5d7a8' },
  nuit: { fond: '#14100d', trait: '#8f6a33', coeur: '#3a2a20', coin: '#5c3a1f', eclat: '#c9943a' },
  bordeaux: { fond: '#4a1712', trait: '#c9943a', coeur: '#1a0a07', coin: '#8a2a1f', eclat: '#e6b36a' },
  sable: { fond: '#cdb594', trait: '#7a4a24', coeur: '#b66a3c', coin: '#8f4a26', eclat: '#fff3df' },
};

interface Props {
  ton?: TonEtoffe;
  /** Ajoute les plis du drapé (ombres et lumière rasante). */
  drape?: boolean;
  /** Échelle du motif. */
  echelle?: number;
  mention?: string;
  className?: string;
}

/**
 * Étoffe à motif wax dessinée en SVG : visuel de remplacement tant que les photos KEWINA
 * ne sont pas fournies. Toujours accompagnée d'une mention honnête (« Photo à fournir »).
 */
export function Etoffe({ ton = 'wax', drape = true, echelle = 1, mention, className = '' }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const p = PALETTES[ton];
  const t = 44 * echelle;

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ backgroundColor: p.fond }}>
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 500" aria-hidden="true">
        <defs>
          <pattern id={`m${id}`} width={t} height={t} patternUnits="userSpaceOnUse" patternTransform="rotate(-12)">
            <rect width={t} height={t} fill={p.fond} />
            <path d={`M${t / 2} ${t * 0.09} L${t * 0.91} ${t / 2} L${t / 2} ${t * 0.91} L${t * 0.09} ${t / 2}Z`} fill="none" stroke={p.trait} strokeWidth={1.6} />
            <path d={`M${t / 2} ${t * 0.3} L${t * 0.7} ${t / 2} L${t / 2} ${t * 0.7} L${t * 0.3} ${t / 2}Z`} fill={p.coeur} />
            <path d={`M0 0 L${t * 0.18} 0 L0 ${t * 0.18}Z M${t} ${t} L${t * 0.82} ${t} L${t} ${t * 0.82}Z`} fill={p.coin} />
            <circle cx={t / 2} cy={t / 2} r={t * 0.045} fill={p.eclat} />
          </pattern>
          <linearGradient id={`p${id}`} x1="0" y1="0" x2="1" y2="0.35">
            <stop offset="0" stopColor="#000" stopOpacity=".7" />
            <stop offset=".18" stopColor="#000" stopOpacity=".08" />
            <stop offset=".34" stopColor="#000" stopOpacity=".62" />
            <stop offset=".5" stopColor="#000" stopOpacity=".05" />
            <stop offset=".66" stopColor="#000" stopOpacity=".58" />
            <stop offset=".82" stopColor="#000" stopOpacity=".12" />
            <stop offset="1" stopColor="#000" stopOpacity=".75" />
          </linearGradient>
          <radialGradient id={`l${id}`} cx=".62" cy=".22" r=".7">
            <stop offset="0" stopColor="#e6b36a" stopOpacity=".42" />
            <stop offset=".55" stopColor="#c9943a" stopOpacity=".08" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="500" fill={`url(#m${id})`} />
        {drape && <rect width="400" height="500" fill={`url(#p${id})`} />}
        <rect width="400" height="500" fill={`url(#l${id})`} />
      </svg>
      {mention && (
        <span className="absolute bottom-3 left-3 font-ui text-[10px] font-medium uppercase tracking-bouton text-blanc-casse/80">{mention}</span>
      )}
    </div>
  );
}

/** Ton d'étoffe stable pour un produit (tant qu'il n'a pas de photo). */
export function tonPourProduit(slug: string, couleur?: string | null): TonEtoffe {
  const c = (couleur ?? '').toLowerCase();
  if (c.includes('terracotta')) return 'terre';
  if (c.includes('noir')) return 'nuit';
  if (c.includes('bordeaux')) return 'bordeaux';
  const tons: TonEtoffe[] = ['wax', 'terre', 'bordeaux', 'nuit', 'sable'];
  let h = 0;
  for (const ch of slug) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return tons[h % tons.length];
}

/** Bande de motif wax (bas du pied de page, menu mobile). */
export function BandeWax({ className = '' }: { className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <svg className={`block h-10 w-full ${className}`} aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <pattern id={`b${id}`} width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#1a0b07" />
          <path d="M20 4 L36 20 L20 36 L4 20Z" fill="none" stroke="#c9943a" strokeWidth="1.4" />
          <path d="M20 12 L28 20 L20 28 L12 20Z" fill="#8a2a1f" />
          <path d="M0 0 L8 0 L0 8Z M40 40 L32 40 L40 32Z M40 0 L32 0 L40 8Z M0 40 L8 40 L0 32Z" fill="#b66a3c" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#b${id})`} />
    </svg>
  );
}
