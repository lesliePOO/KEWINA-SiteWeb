-- Espace de stockage des photos (lecture publique, écriture réservée aux administrateurs)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', true, 5242880, array['image/webp','image/jpeg','image/png'])
on conflict (id) do nothing;
create policy "admin depose photos" on storage.objects for insert to authenticated
  with check (bucket_id = 'photos' and (select public.est_admin()));
create policy "admin remplace photos" on storage.objects for update to authenticated
  using (bucket_id = 'photos' and (select public.est_admin())) with check (bucket_id = 'photos' and (select public.est_admin()));
create policy "admin supprime photos" on storage.objects for delete to authenticated
  using (bucket_id = 'photos' and (select public.est_admin()));

-- Shooting KEWINA (visuels générés par IA, servis depuis public/shooting)
update public.produit_images pi set url = v.url, alt = v.alt, credit = 'Visuel généré par IA — KEWINA'
from (values (0, '/shooting/robe-longue-1-928.webp', 'Robe longue en pagne, vue de face'),
             (1, '/shooting/robe-longue-2-928.webp', 'Robe longue en pagne en mouvement')) as v(ordre, url, alt),
     public.produits p
where p.slug = 'robe-longue-en-pagne' and pi.produit_id = p.id and pi.ordre = v.ordre;
insert into public.produit_images (produit_id, url, alt, ordre, credit)
select id, '/shooting/robe-longue-3-928.webp', 'Détail de la ceinture nouée et du tissu', 2, 'Visuel généré par IA — KEWINA'
from public.produits where slug = 'robe-longue-en-pagne';
update public.collections set image_url = '/shooting/tissus-1376.webp', image_credit = 'Visuel généré par IA — KEWINA' where slug = 'heritage';
update public.collections set image_url = '/shooting/campagne-homme-1376.webp', image_credit = 'Visuel généré par IA — KEWINA' where slug = 'ceremonie';
