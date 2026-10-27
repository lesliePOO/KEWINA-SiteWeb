-- KEWINA — schéma initial de la boutique (appliqué sur le projet Supabase « kewina »)

-- Types
create type public.genre_produit as enum ('femme', 'homme', 'unisexe');
create type public.statut_produit as enum ('brouillon', 'actif', 'archive');
create type public.statut_demande as enum ('a_confirmer', 'confirmee', 'en_preparation', 'expediee', 'terminee', 'annulee');

-- Administrateurs (liés aux comptes Supabase Auth)
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.est_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins a where a.user_id = (select auth.uid()));
$$;

-- Catalogue
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nom text not null,
  ordre int not null default 0
);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titre text not null,
  description text,
  image_url text,
  actif boolean not null default true,
  est_demo boolean not null default false,
  ordre int not null default 0,
  created_at timestamptz not null default now()
);

create table public.produits (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nom text not null,
  description text,
  matieres text,
  confection text,
  entretien text,
  genre public.genre_produit not null,
  categorie_id uuid references public.categories (id) on delete set null,
  collection_id uuid references public.collections (id) on delete set null,
  prix integer not null check (prix >= 0),
  statut public.statut_produit not null default 'brouillon',
  nouveaute boolean not null default false,
  est_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.produits (categorie_id);
create index on public.produits (collection_id);
create index on public.produits (statut, genre);

create table public.produit_images (
  id uuid primary key default gen_random_uuid(),
  produit_id uuid not null references public.produits (id) on delete cascade,
  url text not null,
  alt text not null default '',
  ordre int not null default 0
);
create index on public.produit_images (produit_id, ordre);

create table public.variantes (
  id uuid primary key default gen_random_uuid(),
  produit_id uuid not null references public.produits (id) on delete cascade,
  taille text,
  couleur text,
  couleur_hex text check (couleur_hex is null or couleur_hex ~ '^#[0-9a-fA-F]{6}$'),
  stock integer not null default 0 check (stock >= 0),
  actif boolean not null default true,
  unique (produit_id, taille, couleur)
);
create index on public.variantes (produit_id);

-- Réglages publics de la boutique (WhatsApp, livraison, seuil de stock faible)
create table public.reglages (
  cle text primary key,
  valeur jsonb not null,
  updated_at timestamptz not null default now()
);

-- Demandes de commande (WhatsApp) : jamais une vente tant que l'équipe ne confirme pas
create table public.demandes_commande (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  statut public.statut_demande not null default 'a_confirmer',
  nom_client text,
  ville text,
  total_estime integer not null check (total_estime >= 0),
  note_interne text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.demandes_commande (statut, created_at desc);

create table public.lignes_demande (
  id uuid primary key default gen_random_uuid(),
  demande_id uuid not null references public.demandes_commande (id) on delete cascade,
  variante_id uuid references public.variantes (id) on delete set null,
  produit_id uuid references public.produits (id) on delete set null,
  produit_nom text not null,
  taille text,
  couleur text,
  quantite integer not null check (quantite between 1 and 20),
  prix_unitaire integer not null check (prix_unitaire >= 0)
);
create index on public.lignes_demande (demande_id);
create index on public.lignes_demande (variante_id);
create index on public.lignes_demande (produit_id);

create table public.historique_statuts (
  id uuid primary key default gen_random_uuid(),
  demande_id uuid not null references public.demandes_commande (id) on delete cascade,
  ancien_statut public.statut_demande,
  nouveau_statut public.statut_demande not null,
  modifie_par uuid references auth.users (id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);
create index on public.historique_statuts (demande_id, created_at);
create index on public.historique_statuts (modifie_par);

-- Horodatage et historique automatiques
create or replace function public.maj_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
create trigger produits_updated_at before update on public.produits for each row execute function public.maj_updated_at();
create trigger demandes_updated_at before update on public.demandes_commande for each row execute function public.maj_updated_at();

create or replace function public.tracer_statut()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    insert into public.historique_statuts (demande_id, ancien_statut, nouveau_statut, modifie_par)
    values (new.id, null, new.statut, (select auth.uid()));
  elsif new.statut is distinct from old.statut then
    insert into public.historique_statuts (demande_id, ancien_statut, nouveau_statut, modifie_par)
    values (new.id, old.statut, new.statut, (select auth.uid()));
  end if;
  return new;
end;
$$;
create trigger demandes_historique after insert or update of statut on public.demandes_commande
  for each row execute function public.tracer_statut();

-- Sécurité par lignes
alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.produits enable row level security;
alter table public.produit_images enable row level security;
alter table public.variantes enable row level security;
alter table public.reglages enable row level security;
alter table public.demandes_commande enable row level security;
alter table public.lignes_demande enable row level security;
alter table public.historique_statuts enable row level security;

-- Lecture publique du catalogue actif
create policy "lecture publique categories" on public.categories for select to anon, authenticated using (true);
create policy "lecture publique collections actives" on public.collections for select to anon, authenticated
  using (actif or (select public.est_admin()));
create policy "lecture publique produits actifs" on public.produits for select to anon, authenticated
  using (statut = 'actif' or (select public.est_admin()));
create policy "lecture publique images" on public.produit_images for select to anon, authenticated
  using (exists (select 1 from public.produits p where p.id = produit_id and (p.statut = 'actif' or (select public.est_admin()))));
create policy "lecture publique variantes" on public.variantes for select to anon, authenticated
  using ((actif and exists (select 1 from public.produits p where p.id = produit_id and p.statut = 'actif')) or (select public.est_admin()));
create policy "lecture publique reglages" on public.reglages for select to anon, authenticated using (true);

-- Écriture réservée aux administrateurs
create policy "admin ecrit categories" on public.categories for insert to authenticated with check ((select public.est_admin()));
create policy "admin modifie categories" on public.categories for update to authenticated using ((select public.est_admin())) with check ((select public.est_admin()));
create policy "admin supprime categories" on public.categories for delete to authenticated using ((select public.est_admin()));

create policy "admin ecrit collections" on public.collections for insert to authenticated with check ((select public.est_admin()));
create policy "admin modifie collections" on public.collections for update to authenticated using ((select public.est_admin())) with check ((select public.est_admin()));
create policy "admin supprime collections" on public.collections for delete to authenticated using ((select public.est_admin()));

create policy "admin ecrit produits" on public.produits for insert to authenticated with check ((select public.est_admin()));
create policy "admin modifie produits" on public.produits for update to authenticated using ((select public.est_admin())) with check ((select public.est_admin()));
create policy "admin supprime produits" on public.produits for delete to authenticated using ((select public.est_admin()));

create policy "admin ecrit images" on public.produit_images for insert to authenticated with check ((select public.est_admin()));
create policy "admin modifie images" on public.produit_images for update to authenticated using ((select public.est_admin())) with check ((select public.est_admin()));
create policy "admin supprime images" on public.produit_images for delete to authenticated using ((select public.est_admin()));

create policy "admin ecrit variantes" on public.variantes for insert to authenticated with check ((select public.est_admin()));
create policy "admin modifie variantes" on public.variantes for update to authenticated using ((select public.est_admin())) with check ((select public.est_admin()));
create policy "admin supprime variantes" on public.variantes for delete to authenticated using ((select public.est_admin()));

create policy "admin ecrit reglages" on public.reglages for insert to authenticated with check ((select public.est_admin()));
create policy "admin modifie reglages" on public.reglages for update to authenticated using ((select public.est_admin())) with check ((select public.est_admin()));

-- Demandes : lecture et suivi réservés aux administrateurs ; création uniquement via la fonction ci-dessous
create policy "admin lit demandes" on public.demandes_commande for select to authenticated using ((select public.est_admin()));
create policy "admin modifie demandes" on public.demandes_commande for update to authenticated using ((select public.est_admin())) with check ((select public.est_admin()));
create policy "admin lit lignes" on public.lignes_demande for select to authenticated using ((select public.est_admin()));
create policy "admin lit historique" on public.historique_statuts for select to authenticated using ((select public.est_admin()));
create policy "admin lit admins" on public.admins for select to authenticated using ((select public.est_admin()));

-- Création d'une demande : prix et stocks relus côté serveur, jamais ceux du navigateur
create or replace function public.creer_demande_commande(p_lignes jsonb, p_nom text default null, p_ville text default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_demande_id uuid;
  v_reference text;
  v_total integer := 0;
  v_ligne jsonb;
  v_var record;
  v_qte integer;
  v_resultat jsonb := '[]'::jsonb;
  v_problemes jsonb := '[]'::jsonb;
begin
  if p_lignes is null or jsonb_typeof(p_lignes) <> 'array' or jsonb_array_length(p_lignes) = 0 then
    raise exception 'Panier vide' using errcode = '22023';
  end if;
  if jsonb_array_length(p_lignes) > 30 then
    raise exception 'Trop d''articles dans le panier' using errcode = '22023';
  end if;

  -- Vérification de chaque ligne
  for v_ligne in select * from jsonb_array_elements(p_lignes) loop
    v_qte := coalesce((v_ligne ->> 'quantite')::int, 0);
    select v.id, v.taille, v.couleur, v.stock, v.actif, p.id as produit_id, p.nom, p.prix, p.statut
      into v_var
      from public.variantes v join public.produits p on p.id = v.produit_id
      where v.id = (v_ligne ->> 'variante_id')::uuid;

    if not found or v_var.statut <> 'actif' or not v_var.actif then
      v_problemes := v_problemes || jsonb_build_object('variante_id', v_ligne ->> 'variante_id', 'probleme', 'indisponible');
    elsif v_qte < 1 or v_qte > 20 then
      v_problemes := v_problemes || jsonb_build_object('variante_id', v_var.id, 'probleme', 'quantite_invalide');
    elsif v_var.stock < v_qte then
      v_problemes := v_problemes || jsonb_build_object('variante_id', v_var.id, 'probleme', 'stock_insuffisant', 'stock', v_var.stock);
    else
      v_total := v_total + v_var.prix * v_qte;
      v_resultat := v_resultat || jsonb_build_object(
        'variante_id', v_var.id, 'produit_id', v_var.produit_id, 'produit_nom', v_var.nom,
        'taille', v_var.taille, 'couleur', v_var.couleur, 'quantite', v_qte, 'prix_unitaire', v_var.prix);
    end if;
  end loop;

  if jsonb_array_length(v_problemes) > 0 then
    return jsonb_build_object('ok', false, 'problemes', v_problemes);
  end if;

  v_reference := 'KW-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  insert into public.demandes_commande (reference, nom_client, ville, total_estime)
  values (v_reference, nullif(left(trim(p_nom), 120), ''), nullif(left(trim(p_ville), 120), ''), v_total)
  returning id into v_demande_id;

  insert into public.lignes_demande (demande_id, variante_id, produit_id, produit_nom, taille, couleur, quantite, prix_unitaire)
  select v_demande_id, (l ->> 'variante_id')::uuid, (l ->> 'produit_id')::uuid, l ->> 'produit_nom',
         l ->> 'taille', l ->> 'couleur', (l ->> 'quantite')::int, (l ->> 'prix_unitaire')::int
  from jsonb_array_elements(v_resultat) l;

  return jsonb_build_object('ok', true, 'reference', v_reference, 'total_estime', v_total, 'lignes', v_resultat);
end;
$$;

revoke all on function public.creer_demande_commande(jsonb, text, text) from public;
grant execute on function public.creer_demande_commande(jsonb, text, text) to anon, authenticated;
revoke all on function public.est_admin() from public;
grant execute on function public.est_admin() to anon, authenticated;
revoke execute on function public.tracer_statut() from public, anon, authenticated;
revoke execute on function public.maj_updated_at() from public, anon, authenticated;
