-- Retour de 20261112000001_achats_et_file_emails.sql
drop function if exists public.marquer_email(bigint, boolean);
drop function if exists public.reserver_emails(integer, integer);
drop function if exists public.traiter_evenement_stripe(text, text, jsonb);
drop table if exists public.email_log;
drop table if exists public.credits;
drop table if exists public.purchases;
drop table if exists public.stripe_events;
drop type if exists public.statut_email;
drop type if exists public.type_email;
drop type if exists public.statut_achat;
drop type if exists public.origine_credit;
drop type if exists public.formule;
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant execute on functions to public, anon, authenticated;
