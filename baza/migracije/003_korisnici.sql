-- ============================================================
--  003 — Korisnici /chef
--
--  Plan je ovdje računao na Supabase Auth. Pošto bazu vodimo sami,
--  prijavu pišemo sami: lozinka se čuva kao scrypt heš sa vlastitom
--  soli, nikad kao čist tekst.
--
--  Nalozi se prave naredbom `npm run korisnik`, ne kroz sučelje —
--  registracije namjerno nema.
-- ============================================================

begin;

create table korisnici (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  -- Oblik: scrypt$<sol u heksu>$<heš u heksu>
  lozinka_hash text not null,
  ime text,
  aktivan boolean not null default true,
  zadnja_prijava timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint korisnici_email_chk check (position('@' in email) > 1)
);

create trigger korisnici_updated_at
  before update on korisnici
  for each row execute function osvjezi_updated_at();

-- Javna uloga NE SMIJE ni čitati ovu tabelu — u njoj su hešovi lozinki.
revoke all on korisnici from seherezada_web;
grant select, insert, update, delete on korisnici to seherezada_admin;

commit;
