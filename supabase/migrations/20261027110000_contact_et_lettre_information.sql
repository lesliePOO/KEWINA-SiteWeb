-- Messages du formulaire de contact : les visiteurs peuvent écrire, jamais relire.
create table public.messages_contact (
  id uuid primary key default gen_random_uuid(),
  nom text not null check (char_length(trim(nom)) between 2 and 120),
  email text check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  telephone text check (telephone is null or char_length(telephone) between 6 and 30),
  sujet text not null check (char_length(sujet) between 2 and 120),
  message text not null check (char_length(trim(message)) between 10 and 3000),
  traite boolean not null default false,
  created_at timestamptz not null default now(),
  constraint contact_joignable check (email is not null or telephone is not null)
);
alter table public.messages_contact enable row level security;
create policy "visiteurs envoient un message" on public.messages_contact for insert to anon, authenticated
  with check (traite = false);
create policy "admin lit messages" on public.messages_contact for select to authenticated using ((select public.est_admin()));
create policy "admin modifie messages" on public.messages_contact for update to authenticated using ((select public.est_admin())) with check ((select public.est_admin()));

-- Inscriptions à la lettre d'information.
create table public.inscriptions_lettre (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 200),
  created_at timestamptz not null default now()
);
create unique index inscriptions_lettre_email_unique on public.inscriptions_lettre (lower(email));
alter table public.inscriptions_lettre enable row level security;
create policy "visiteurs s inscrivent" on public.inscriptions_lettre for insert to anon, authenticated with check (true);
create policy "admin lit inscriptions" on public.inscriptions_lettre for select to authenticated using ((select public.est_admin()));
