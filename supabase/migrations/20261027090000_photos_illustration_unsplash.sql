-- Photos d'illustration libres de droits (licence Unsplash) pour les produits et collections de DÉMONSTRATION.
-- Elles ne représentent pas les créations KEWINA : à remplacer par les photos de la marque.

alter table public.produit_images add column if not exists credit text;
alter table public.collections add column if not exists image_credit text;

insert into public.produit_images (produit_id, url, alt, ordre, credit)
select p.id, i.url, i.alt, i.ordre, i.credit
from (values
  ('robe-longue-en-pagne', 'https://images.unsplash.com/photo-1611853904829-6d0f4034ce2f', 'Femme en robe longue à motifs', 0, 'Jan Canty'),
  ('robe-longue-en-pagne', 'https://images.unsplash.com/photo-1784160053635-424cf07f567c', 'Femme en robe à motifs, assise', 1, 'McFollis'),
  ('ensemble-tailleur', 'https://images.unsplash.com/photo-1630494692744-815ca085732d', 'Homme en veste de costume', 0, 'Bismark Owusu-Yeboah'),
  ('ensemble-tailleur', 'https://images.unsplash.com/photo-1661332517932-2d441bfb2994', 'Tenue traditionnelle', 1, 'Tope. A Asokere'),
  ('chemise-en-lin', 'https://images.unsplash.com/photo-1533108344127-a586d2b02479', 'Homme en chemise blanche', 0, 'Prince Akachi'),
  ('chemise-en-lin', 'https://images.unsplash.com/photo-1562173650-f61426fbe683', 'Homme en chemise, en extérieur', 1, 'nana o.'),
  ('robe-midi-africaine', 'https://images.unsplash.com/photo-1625646741211-711bdd65c570', 'Femme en robe fleurie rouge et blanche', 0, 'Rohan Odhiambo'),
  ('robe-midi-africaine', 'https://images.unsplash.com/photo-1709809081557-78f803ce93a0', 'Femme en robe colorée sur un banc', 1, 'LOLA AZIZADA'),
  ('veste-en-tissu-wax', 'https://images.unsplash.com/photo-1530884698386-d42ad3199b1f', 'Veste de costume à motifs pour homme', 0, 'Prince Akachi'),
  ('veste-en-tissu-wax', 'https://images.unsplash.com/photo-1550051414-003c9007794c', 'Homme en tenue à motifs multicolores', 1, 'naeim jafari'),
  ('pantalon-large', 'https://images.unsplash.com/photo-1485570661444-73b3f0ff9d2f', 'Femmes en pantalon large', 0, 'Clem Onojeghuo'),
  ('pantalon-large', 'https://images.unsplash.com/photo-1493655161922-ef98929de9d8', 'Femmes en pantalon blanc', 1, 'Clarke Sanders'),
  ('top-en-wax', 'https://images.unsplash.com/photo-1628144029346-8a98676311b6', 'Femme en tenue à motifs brun et blanc', 0, 'Amani Nation'),
  ('top-en-wax', 'https://images.unsplash.com/photo-1589156191108-c762ff4b96ab', 'Femme en haut blanc et rouge', 1, 'Jeffery Erhunse'),
  ('foulard-de-tete', 'https://images.unsplash.com/photo-1530785602389-07594beb8b73', 'Femme portant un foulard de tête', 0, 'Prince Akachi'),
  ('foulard-de-tete', 'https://images.unsplash.com/photo-1614291129226-41dae34c2128', 'Femme portant un foulard à motifs', 1, 'fame of God studios')
) as i(slug, url, alt, ordre, credit)
join public.produits p on p.slug = i.slug;

update public.collections set image_url = 'https://images.unsplash.com/photo-1768212565424-efa3a3852b81', image_credit = 'WyteShot' where slug = 'heritage';
update public.collections set image_url = 'https://images.unsplash.com/photo-1788035963223-06abb95a1289', image_credit = 'McFollis' where slug = 'ceremonie';
