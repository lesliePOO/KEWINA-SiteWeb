import { useState } from 'react';
import { X } from 'lucide-react';
import { lienWhatsApp, numeroAffiche } from '../../lib/whatsapp';

export function BarreAnnonce() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  const numero = numeroAffiche();
  const lien = lienWhatsApp();

  return (
    <div className="relative hidden border-b border-ligne-nuit bg-noir text-sable md:block">
      <div className="mx-auto flex max-w-[1440px] items-center justify-center gap-4 px-12 py-2 text-[11px] tracking-wide">
        <span>Commande assistée via WhatsApp</span>
        {numero && lien && (
          <>
            <span className="text-bronze" aria-hidden="true">|</span>
            <a href={lien} target="_blank" rel="noopener noreferrer" className="hover:text-creme">
              {numero}
            </a>
          </>
        )}
      </div>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="absolute right-6 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center text-sable hover:text-creme"
        aria-label="Fermer le bandeau"
      >
        <X size={14} />
      </button>
    </div>
  );
}
