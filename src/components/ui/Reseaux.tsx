import type { ReactNode } from 'react';
import { reseaux } from '../../config/site';
import { lienWhatsApp } from '../../lib/whatsapp';

const ICONES: Record<string, ReactNode> = {
  WhatsApp: (
    <path d="M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.4 5 5.2-1.4A9.8 9.8 0 1 0 12 2.2Zm0 17.9a8.1 8.1 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.1 8.1 0 1 1 12 20.1Zm4.5-6c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.9 2.3 1 2.5c.1.2 1.7 2.6 4.2 3.7 1.6.7 2.2.7 3 .6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z" fill="currentColor" />
  ),
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
    </>
  ),
  TikTok: (
    <path d="M16.6 3c.3 2.2 1.6 3.6 3.8 3.8v3a7 7 0 0 1-3.8-1.2v6.2a5.9 5.9 0 1 1-5.9-5.9h.6v3.1a2.9 2.9 0 1 0 2.2 2.8V3h3.1Z" fill="currentColor" />
  ),
  Facebook: <path d="M13.6 21v-7.7h2.6l.4-3h-3V8.4c0-.9.3-1.5 1.5-1.5h1.6V4.2a21 21 0 0 0-2.4-.1c-2.4 0-4 1.4-4 4.1v2.2H7.7v3h2.6V21h3.3Z" fill="currentColor" />,
  YouTube: (
    <path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.6 2.6 0 0 0-1.8 1.8A27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" fill="currentColor" />
  ),
  Pinterest: (
    <path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.6 1.3 1.4 0 .9-.5 2.2-.8 3.4-.2 1 .5 1.9 1.6 1.9 1.9 0 3.3-2 3.3-4.9 0-2.6-1.8-4.4-4.5-4.4a4.6 4.6 0 0 0-4.8 4.6c0 .9.4 1.9.8 2.4l.1.4-.3 1.2c0 .2-.2.3-.4.2-1.4-.6-2.2-2.6-2.2-4.2 0-3.4 2.5-6.6 7.2-6.6 3.8 0 6.7 2.7 6.7 6.3 0 3.8-2.4 6.8-5.7 6.8-1.1 0-2.2-.6-2.5-1.3l-.7 2.6c-.2 1-.9 2.2-1.4 2.9A10 10 0 1 0 12 2Z" fill="currentColor" />
  ),
};

/** Icônes des réseaux sociaux, WhatsApp en premier (lien réel vers le numéro de la boutique). */
export function Reseaux({ className = '' }: { className?: string }) {
  const whatsapp = lienWhatsApp();
  const liens = [...(whatsapp ? [{ nom: 'WhatsApp', url: whatsapp }] : []), ...reseaux];
  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
      {liens.map((r) => (
        <li key={r.nom}>
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={r.nom}
            title={r.nom}
            className="grid h-10 w-10 place-items-center rounded-full border border-ligne-nuit text-sable transition-colors duration-rapide hover:border-bronze hover:text-or-lumiere"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">{ICONES[r.nom]}</svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
