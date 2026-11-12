-- J1 : achats, crédits, journal Stripe, file d'attente des e-mails.
-- Retour : supabase/retours/20261112000001_achats_et_file_emails.sql

create type public.formule as enum ('une_reception', 'grande_reception');
create type public.origine_credit as enum ('achat', 'parrainage', 'geste_commercial');
create type public.statut_achat as enum ('paye', 'rembourse_partiel', 'rembourse');
create type public.type_email as enum ('confirmation_achat', 'invitation', 'relance', 'rappel', 'remerciement');
create type public.statut_email as enum ('en_attente', 'envoye', 'echec');

-- Chaque événement Stripe reçu, une seule fois : la clé primaire garantit l'idempotence.
create table public.stripe_events (
  id text primary key,
  type text not null,
  recu_le timestamptz not null default now()
);

create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  host_id uuid references auth.users (id) on delete set null,
  email text not null,
  offre text not null,
  stripe_session_id text not null unique,
  stripe_payment_intent text,
  montant_centimes integer not null check (montant_centimes >= 0),
  devise text not null default 'eur',
  statut public.statut_achat not null default 'paye',
  renoncement_retractation_le timestamptz,
  rattachement_utilise_le timestamptz,
  rembourse_le timestamptz,
  cree_le timestamptz not null default now()
);
create index purchases_host_id_idx on public.purchases (host_id);
create index purchases_email_idx on public.purchases (lower(email));

create table public.credits (
  id uuid primary key default gen_random_uuid(),
  host_id uuid references auth.users (id) on delete cascade,
  purchase_id uuid references public.purchases (id) on delete set null,
  formule public.formule not null,
  origine public.origine_credit not null,
  utilise_le timestamptz,
  event_id uuid,
  expire_le timestamptz,
  cree_le timestamptz not null default now()
);
create index credits_host_id_idx on public.credits (host_id);
create index credits_purchase_id_idx on public.credits (purchase_id);

-- Journal et file d'attente des e-mails. Aucun contenu, aucune adresse :
-- le message est reconstruit au moment de l'envoi à partir des lignes liées.
create table public.email_log (
  id bigint generated always as identity primary key,
  type public.type_email not null,
  statut public.statut_email not null default 'en_attente',
  priorite smallint not null,
  essais integer not null default 0,
  purchase_id uuid references public.purchases (id) on delete set null,
  cree_le timestamptz not null default now(),
  prochain_essai_le timestamptz not null default now(),
  verrou_jusqu_a timestamptz,
  envoye_le timestamptz
);
create index email_log_file_idx on public.email_log (priorite, cree_le) where statut = 'en_attente';
create index email_log_envoye_idx on public.email_log (envoye_le) where statut = 'envoye';

-- Accès : RLS partout. Le rôle anonyme n'a accès à rien.
alter table public.stripe_events enable row level security;
alter table public.purchases enable row level security;
alter table public.credits enable row level security;
alter table public.email_log enable row level security;

revoke all on public.stripe_events, public.purchases, public.credits, public.email_log from anon, authenticated;
grant select on public.purchases, public.credits to authenticated;

create policy purchases_lecture_proprietaire on public.purchases
  for select to authenticated using (host_id = (select auth.uid()));
create policy credits_lecture_proprietaire on public.credits
  for select to authenticated using (host_id = (select auth.uid()));

-- Les tables et fonctions créées plus tard ne sont pas ouvertes par défaut.
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke execute on functions from public, anon, authenticated;

-- Webhook Stripe : journalise l'événement et, pour un achat, crée l'achat, ses crédits
-- et l'e-mail de confirmation dans une seule transaction.
create function public.traiter_evenement_stripe(p_event_id text, p_type text, p_achat jsonb default null)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_achat_id uuid;
begin
  insert into public.stripe_events (id, type) values (p_event_id, p_type)
  on conflict (id) do nothing;
  if not found then
    return 'deja_recu';
  end if;

  if p_achat is null then
    return 'journalise';
  end if;

  insert into public.purchases (
    email, offre, stripe_session_id, stripe_payment_intent, montant_centimes, devise,
    renoncement_retractation_le
  ) values (
    p_achat->>'email',
    p_achat->>'offre',
    p_achat->>'session_id',
    p_achat->>'payment_intent',
    (p_achat->>'montant_centimes')::integer,
    coalesce(p_achat->>'devise', 'eur'),
    (p_achat->>'renoncement_retractation_le')::timestamptz
  )
  on conflict (stripe_session_id) do nothing
  returning id into v_achat_id;

  if v_achat_id is null then
    return 'deja_recu';
  end if;

  insert into public.credits (purchase_id, formule, origine, expire_le)
  select v_achat_id, (p_achat->>'credits_formule')::public.formule, 'achat',
         (p_achat->>'expire_le')::timestamptz
  from generate_series(1, (p_achat->>'credits_nombre')::integer);

  insert into public.email_log (type, priorite, purchase_id)
  values ('confirmation_achat', 1, v_achat_id);

  return 'achat_enregistre';
end;
$$;

-- File d'attente : réserve au plus p_lot e-mails, sans dépasser le quota du jour (jour de Paris).
create function public.reserver_emails(p_quota integer, p_lot integer)
returns setof public.email_log
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_debut timestamptz := date_trunc('day', now() at time zone 'Europe/Paris') at time zone 'Europe/Paris';
  v_pris integer;
  v_reste integer;
begin
  perform pg_advisory_xact_lock(hashtext('file_emails'));

  select count(*) into v_pris from public.email_log
  where (statut = 'envoye' and envoye_le >= v_debut)
     or (statut = 'en_attente' and verrou_jusqu_a > now());

  v_reste := least(p_lot, p_quota - v_pris);
  if v_reste <= 0 then
    return;
  end if;

  return query
  update public.email_log e
  set verrou_jusqu_a = now() + interval '10 minutes', essais = e.essais + 1
  where e.id in (
    select f.id from public.email_log f
    where f.statut = 'en_attente'
      and f.prochain_essai_le <= now()
      and (f.verrou_jusqu_a is null or f.verrou_jusqu_a <= now())
    order by f.priorite, f.cree_le
    limit v_reste
    for update skip locked
  )
  returning e.*;
end;
$$;

-- Résultat d'un envoi : envoyé, ou nouvel essai plus tard, ou échec après 5 essais.
create function public.marquer_email(p_id bigint, p_succes boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_succes then
    update public.email_log
    set statut = 'envoye', envoye_le = now(), verrou_jusqu_a = null
    where id = p_id and statut = 'en_attente';
  else
    update public.email_log
    set statut = case when essais >= 5 then 'echec'::public.statut_email else statut end,
        prochain_essai_le = now() + (essais * interval '15 minutes'),
        verrou_jusqu_a = null
    where id = p_id and statut = 'en_attente';
  end if;
end;
$$;

revoke execute on function public.traiter_evenement_stripe(text, text, jsonb) from public, anon, authenticated;
revoke execute on function public.reserver_emails(integer, integer) from public, anon, authenticated;
revoke execute on function public.marquer_email(bigint, boolean) from public, anon, authenticated;
grant execute on function public.traiter_evenement_stripe(text, text, jsonb) to service_role;
grant execute on function public.reserver_emails(integer, integer) to service_role;
grant execute on function public.marquer_email(bigint, boolean) to service_role;
grant select, insert, update, delete on public.stripe_events, public.purchases, public.credits, public.email_log to service_role;
