-- Remplacement des photos d'illustration qui ne correspondaient pas aux produits (vérifiées visuellement).
update public.produit_images pi set url = n.url, alt = n.alt, credit = n.credit
from (values
  ('robe-longue-en-pagne', 0, 'https://images.unsplash.com/photo-1529245019870-59b249281fd3', 'Femme en robe longue à motifs dans un champ', 'Ian Kiragu'),
  ('robe-longue-en-pagne', 1, 'https://images.unsplash.com/photo-1709809081557-78f803ce93a0', 'Femme en robe longue colorée', 'LOLA AZIZADA'),
  ('ensemble-tailleur', 0, 'https://images.unsplash.com/photo-1620932934088-fbdb2920e484', 'Homme en ensemble blanc brodé', 'Shedrack Salami'),
  ('ensemble-tailleur', 1, 'https://images.unsplash.com/photo-1776880471112-708c211e6a4b', 'Homme en ensemble long rose et pantalon blanc', 'Olumide Adekunle'),
  ('chemise-en-lin', 0, 'https://images.unsplash.com/photo-1533108344127-a586d2b02479', 'Homme en chemise blanche', 'Prince Akachi'),
  ('chemise-en-lin', 1, 'https://images.unsplash.com/photo-1612214070442-3c806a722f0b', 'Homme en chemise blanche ouverte', 'Kingsley Osei-Abrah'),
  ('robe-midi-africaine', 0, 'https://images.unsplash.com/photo-1625646741211-711bdd65c570', 'Femme en tenue à motifs rouges et chapeau', 'Rohan Odhiambo'),
  ('robe-midi-africaine', 1, 'https://images.unsplash.com/photo-1708170236215-b6edcad7f49a', 'Femme en tenue jaune avec éventail', 'Shedrack Salami'),
  ('veste-en-tissu-wax', 0, 'https://images.unsplash.com/photo-1556136412-3813d7367e4b', 'Homme en chemise dashiki orange et verte', 'Tânia Mousinho'),
  ('veste-en-tissu-wax', 1, 'https://images.unsplash.com/photo-1767929820360-9f6e62ad6a55', 'Homme en tenue traditionnelle devant un mur ocre', 'Samuel Adeleke'),
  ('pantalon-large', 0, 'https://images.unsplash.com/photo-1485570661444-73b3f0ff9d2f', 'Femmes en ensembles pantalon à motifs', 'Clem Onojeghuo'),
  ('pantalon-large', 1, 'https://images.unsplash.com/photo-1775036760841-6c1854634646', 'Jeunes adultes en vêtements à motifs', 'Danial Dezfouli'),
  ('top-en-wax', 0, 'https://images.unsplash.com/photo-1628144029346-8a98676311b6', 'Femme en top wax noué', 'Amani Nation'),
  ('top-en-wax', 1, 'https://images.unsplash.com/photo-1708170236295-20ab8fbadcef', 'Femme en haut orange', 'Shedrack Salami')
) as n(slug, ordre, url, alt, credit)
join public.produits p on p.slug = n.slug
where pi.produit_id = p.id and pi.ordre = n.ordre;
