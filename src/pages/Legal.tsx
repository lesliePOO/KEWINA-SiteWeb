import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../config/site';

function PageTexte({ titre, maj, children }: { titre: string; maj: string; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-4 pb-20 pt-10 lg:pt-16">
      <h1 className="font-display text-[38px] font-medium lg:text-5xl">{titre}</h1>
      <p className="mt-2 text-xs text-encre-douce">Dernière mise à jour : {maj}</p>
      <div className="mt-8 flex flex-col gap-8 text-[15px] leading-relaxed text-encre-douce [&_h2]:mb-2 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-brun [&_strong]:font-medium [&_strong]:text-brun">
        {children}
      </div>
    </article>
  );
}

export function MentionsLegales() {
  return (
    <PageTexte titre="Mentions légales" maj="27 octobre 2026">
      <section>
        <h2>Éditeur du site</h2>
        <p>
          <strong>KEWINA</strong> — marque de mode africaine contemporaine créée le {site.dateCreation} par <strong>{site.fondatrice}</strong>, {site.pays}.
          <br />
          Contact : <a href={`mailto:${site.email}`} className="underline underline-offset-4">{site.email}</a>
        </p>
      </section>
      <section>
        <h2>Nature du site</h2>
        <p>
          Ce site est une <strong>boutique vitrine de démonstration</strong> conçue et réalisée par {site.agence}. Les produits, prix et stocks
          présentés sont des exemples, signalés par la mention « Démo ». Les photos sont des photos d'illustration libres de droits (voir les{' '}
          <Link to="/credits-photos" className="underline underline-offset-4">crédits photos</Link>).
        </p>
      </section>
      <section>
        <h2>Hébergement</h2>
        <p>
          Site hébergé par <strong>Vercel Inc.</strong>, 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com.
          <br />
          Données de la boutique hébergées par <strong>Supabase</strong> (serveurs situés dans l'Union européenne, région Paris) — supabase.com.
        </p>
      </section>
      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          Le nom KEWINA, le logo et le monogramme sont la propriété de leur titulaire. Toute reproduction sans autorisation est interdite.
        </p>
      </section>
    </PageTexte>
  );
}

export function Confidentialite() {
  return (
    <PageTexte titre="Politique de confidentialité" maj="27 octobre 2026">
      <section>
        <h2>Quelles données ?</h2>
        <ul className="list-disc pl-5">
          <li><strong>Demande de commande</strong> : articles choisis et, si vous les indiquez, votre nom et votre ville.</li>
          <li><strong>Formulaire de contact</strong> : nom, e-mail et/ou téléphone, message.</li>
          <li><strong>Lettre d'information</strong> : votre adresse e-mail.</li>
          <li><strong>Sur votre appareil</strong> : votre panier et vos favoris, enregistrés dans votre navigateur. Ils ne nous sont pas transmis.</li>
        </ul>
      </section>
      <section>
        <h2>Pourquoi ?</h2>
        <p>Uniquement pour traiter votre demande, vous répondre et, si vous l'avez demandé, vous envoyer nos nouveautés. Vos données ne sont jamais vendues ni cédées.</p>
      </section>
      <section>
        <h2>WhatsApp</h2>
        <p>En envoyant votre commande sur WhatsApp, vous communiquez avec nous via ce service, soumis à sa propre politique de confidentialité.</p>
      </section>
      <section>
        <h2>Cookies et mesure d'audience</h2>
        <p>Ce site n'utilise aucun cookie publicitaire ni outil de pistage.</p>
      </section>
      <section>
        <h2>Durée de conservation</h2>
        <p>Les demandes et messages sont conservés le temps nécessaire à leur traitement, puis au maximum trois ans. Vous pouvez vous désinscrire de la lettre d'information à tout moment.</p>
      </section>
      <section>
        <h2>Vos droits</h2>
        <p>
          Vous pouvez demander l'accès, la rectification ou la suppression de vos données en écrivant à{' '}
          <a href={`mailto:${site.email}`} className="underline underline-offset-4">{site.email}</a>.
        </p>
      </section>
    </PageTexte>
  );
}
