-- Kør hele filen i Supabase SQL Editor. Kan køres flere gange.
begin;
alter table public.logops_profiles add column if not exists last_seen_at timestamptz;
alter table public.logops_profiles add column if not exists force_logout_at timestamptz;

-- Kun den indloggede brugers egen profil kan opdateres her.
create or replace function public.cargotools_heartbeat()
returns table(status text, is_admin boolean, force_logout_at timestamptz)
language sql security definer set search_path = pg_catalog
as $$
  update public.logops_profiles as p
  set last_seen_at = now()
  where p.id = auth.uid()
  returning p.status::text, p.is_admin, p.force_logout_at;
$$;
-- Funktioner får ellers automatisk adgang for PUBLIC.
revoke all on function public.cargotools_heartbeat() from public, anon, authenticated;
grant execute on function public.cargotools_heartbeat() to authenticated;
commit;
