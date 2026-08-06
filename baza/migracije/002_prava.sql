-- ============================================================
--  002 — Pristupna prava
--
--  Plan je ovdje predviđao Supabase RLS sa anonimnim ključem. Pošto
--  bazu vodimo sami, istu namjeru postižemo običnim PostgreSQL ulogama:
--
--    seherezada_web    — SAMO ČITANJE. Njome radi javni sajt.
--    seherezada_admin  — čitanje i pisanje. Njome radi /chef i seed.
--
--  Zašto dvije: ako aplikacija negdje pogriješi i pokuša pisati iz
--  javnog dijela, baza to odbije. Zaštita ostaje i kad kod zataji.
--
--  Lozinke se NE postavljaju ovdje — ovaj fajl ide u git. Postavljaju
--  se zasebno, a upisuju u .env.local.
-- ============================================================

begin;

-- Uloge se prave samo ako ne postoje, da se migracija može ponoviti.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'seherezada_web') then
    create role seherezada_web login;
  end if;

  if not exists (select 1 from pg_roles where rolname = 'seherezada_admin') then
    create role seherezada_admin login;
  end if;
end $$;

-- ── Čitanje za oboje ────────────────────────────────────────

grant connect on database seherezada to seherezada_web, seherezada_admin;
grant usage on schema public to seherezada_web, seherezada_admin;

grant select on all tables in schema public to seherezada_web, seherezada_admin;

-- ── Pisanje samo za admina ──────────────────────────────────

grant insert, update, delete on all tables in schema public to seherezada_admin;
grant usage, select on all sequences in schema public to seherezada_admin;

-- ── Isto važi i za tabele koje tek nastanu ──────────────────

alter default privileges in schema public
  grant select on tables to seherezada_web, seherezada_admin;

alter default privileges in schema public
  grant insert, update, delete on tables to seherezada_admin;

alter default privileges in schema public
  grant usage, select on sequences to seherezada_admin;

-- Javna uloga ne smije praviti ništa u shemi.
revoke create on schema public from public;

commit;
