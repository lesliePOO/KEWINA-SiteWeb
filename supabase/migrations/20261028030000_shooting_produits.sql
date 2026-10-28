-- Shooting IA (Figma) : photos produits dans le même univers que la campagne KEWINA.
-- Les vues encore manquantes (photos Unsplash d'ordre 1) sont masquées côté site
-- dès qu'un produit possède une photo du shooting ; elles seront remplacées ensuite.
update public.produit_images i set url = v.url, alt = v.alt, credit = 'Visuel généré par IA — KEWINA'
from (values
  ('ensemble-tailleur', 0, '/shooting/ensemble-tailleur-1-928.webp', 'Ensemble tailleur bordeaux, vue de face'),
  ('ensemble-tailleur', 1, '/shooting/ensemble-tailleur-2-928.webp', 'Détail du revers brodé ton sur ton'),
  ('chemise-en-lin', 0, '/shooting/chemise-lin-1-928.webp', 'Chemise en lin noire à col brodé or'),
  ('chemise-en-lin', 1, '/shooting/chemise-lin-2-928.webp', 'Détail du col et de la patte brodés'),
  ('robe-midi-africaine', 0, '/shooting/robe-midi-1-928.webp', 'Robe midi en wax ceinturée, vue de face'),
  ('robe-midi-africaine', 1, '/shooting/robe-midi-2-928.webp', 'Robe midi en mouvement'),
  ('veste-en-tissu-wax', 0, '/shooting/veste-wax-1-928.webp', 'Veste droite en wax portée ouverte'),
  ('pantalon-large', 0, '/shooting/pantalon-large-1-928.webp', 'Pantalon large taille haute en wax'),
  ('top-en-wax', 0, '/shooting/top-wax-1-928.webp', 'Top ajusté en wax à manches longues'),
  ('foulard-de-tete', 0, '/shooting/foulard-1-928.webp', 'Foulard de tête noué en pagne')
) as v(slug, ordre, url, alt)
join public.produits p on p.slug = v.slug
where i.produit_id = p.id and i.ordre = v.ordre;
