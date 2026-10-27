-- KEWINA — réglages et données de DÉMONSTRATION (toutes marquées est_demo = true).
-- À remplacer par les produits réels fournis par KEWINA avant la mise en production.

insert into public.reglages (cle, valeur) values
  ('whatsapp', '"237651224108"'),
  ('livraison', 'null'),
  ('seuil_stock_faible', '3');

insert into public.categories (slug, nom, ordre) values
  ('robes', 'Robes', 1), ('ensembles', 'Ensembles', 2), ('chemises', 'Chemises', 3),
  ('vestes', 'Vestes', 4), ('pantalons', 'Pantalons', 5), ('tops', 'Tops', 6), ('accessoires', 'Accessoires', 7);

insert into public.collections (slug, titre, description, est_demo, ordre) values
  ('heritage', 'Héritage', 'Collection de démonstration : pièces inspirées des pagnes traditionnels, coupes contemporaines.', true, 1),
  ('ceremonie', 'Cérémonie', 'Collection de démonstration : tenues pour les grands jours.', true, 2);

with p as (
  insert into public.produits (slug, nom, description, matieres, entretien, genre, categorie_id, collection_id, prix, statut, nouveaute, est_demo)
  values
    ('robe-longue-en-pagne', 'Robe longue en pagne', 'Produit de démonstration. Robe longue en pagne, coupe fluide et évasée.', 'Pagne africain (démo)', 'Lavage à la main recommandé (démo)', 'femme', (select id from public.categories where slug='robes'), (select id from public.collections where slug='heritage'), 125000, 'actif', true, true),
    ('ensemble-tailleur', 'Ensemble tailleur', 'Produit de démonstration. Ensemble veste et pantalon brodé.', 'Coton (démo)', null, 'homme', (select id from public.categories where slug='ensembles'), (select id from public.collections where slug='ceremonie'), 98000, 'actif', true, true),
    ('chemise-en-lin', 'Chemise en lin', 'Produit de démonstration. Chemise en lin à broderies au col.', 'Lin (démo)', null, 'homme', (select id from public.categories where slug='chemises'), (select id from public.collections where slug='heritage'), 75000, 'actif', true, true),
    ('robe-midi-africaine', 'Robe midi africaine', 'Produit de démonstration. Robe midi ceinturée.', 'Wax (démo)', null, 'femme', (select id from public.categories where slug='robes'), (select id from public.collections where slug='ceremonie'), 110000, 'actif', true, true),
    ('veste-en-tissu-wax', 'Veste en tissu wax', 'Produit de démonstration. Veste droite en wax doublée.', 'Wax (démo)', null, 'homme', (select id from public.categories where slug='vestes'), (select id from public.collections where slug='heritage'), 95000, 'actif', true, true),
    ('pantalon-large', 'Pantalon large', 'Produit de démonstration. Pantalon large taille haute.', 'Coton (démo)', null, 'femme', (select id from public.categories where slug='pantalons'), (select id from public.collections where slug='heritage'), 65000, 'actif', false, true),
    ('top-en-wax', 'Top en wax', 'Produit de démonstration. Top ajusté à manches longues.', 'Wax (démo)', null, 'femme', (select id from public.categories where slug='tops'), (select id from public.collections where slug='heritage'), 55000, 'actif', false, true),
    ('foulard-de-tete', 'Foulard de tête', 'Produit de démonstration. Foulard en pagne à nouer.', 'Pagne (démo)', null, 'unisexe', (select id from public.categories where slug='accessoires'), (select id from public.collections where slug='ceremonie'), 18000, 'actif', false, true)
  returning id, slug
)
insert into public.variantes (produit_id, taille, couleur, couleur_hex, stock)
select p.id, t.taille, c.couleur, c.hex,
  case
    when p.slug = 'robe-longue-en-pagne' and t.taille = 'L' and c.couleur = 'Terracotta' then 0
    when p.slug = 'ensemble-tailleur' and t.taille = 'XL' then 1
    else 4 + (abs(hashtext(p.slug || t.taille || c.couleur)) % 6)
  end
from p
cross join lateral (
  select unnest(case when p.slug = 'foulard-de-tete' then array['Unique'] else array['S','M','L','XL'] end) as taille
) t
cross join lateral (
  select * from (values
    ('Terracotta', '#b66a3c'), ('Noir', '#0b0b0b'), ('Bordeaux', '#8a2a1f')
  ) as v(couleur, hex)
  where case
    when p.slug in ('chemise-en-lin') then v.couleur in ('Noir')
    when p.slug in ('ensemble-tailleur','veste-en-tissu-wax') then v.couleur in ('Noir','Bordeaux')
    else true end
) c;
