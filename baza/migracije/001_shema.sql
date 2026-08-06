-- ============================================================
--  001 — Šema baze
--
--  Tabele tačno odgovaraju tipovima iz lib/domain.ts (korak 2).
--  Ograničenja su tu da baza SAMA odbije nevaljano stanje, i onda
--  kad aplikacija pogriješi.
-- ============================================================

begin;

-- ── Lokali ──────────────────────────────────────────────────

create table lokali (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  naziv text not null,
  ulica text not null,                  -- ulazi u naslove stranica
  adresa text not null,
  telefon text not null,
  email text,
  lat numeric(9,6),
  lng numeric(9,6),
  radno_vrijeme jsonb not null,         -- {redovno:{...}, izuzeci:[...]}
  wolt_url text,
  glovo_url text,
  google_place_id text,
  uvodni_tekst jsonb not null default '{}'::jsonb,
  ocjena numeric(2,1),
  broj_recenzija int,
  recenzije_azurirano timestamptz,
  glavni boolean not null default false,
  stanje text not null default 'radi',
  redoslijed int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint lokali_stanje_chk check (stanje in ('radi','uskoro','zatvoren')),
  constraint lokali_slug_chk   check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint lokali_ocjena_chk check (ocjena is null or (ocjena >= 0 and ocjena <= 5))
);

-- Tačno jedan glavni lokal. Parcijalni indeks: ograničenje važi samo
-- za redove gdje je `glavni` istinito, pa ostalih može biti koliko god.
create unique index lokali_jedan_glavni on lokali (glavni) where glavni;

create index lokali_stanje_redoslijed on lokali (stanje, redoslijed);

-- ── Kategorije ──────────────────────────────────────────────

create table kategorije (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  naziv jsonb not null,                 -- {sl:"Kebab", en:"Kebab", ...}
  opis jsonb,
  redoslijed int not null default 0,
  aktivna boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint kategorije_slug_chk check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

-- ── Jela ────────────────────────────────────────────────────
--  Katalog cijelog brenda — BEZ cijene. Cijena pripada lokalu.

create table jela (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  -- `restrict`: kategorija sa jelima se ne može obrisati
  kategorija_id uuid not null references kategorije(id) on delete restrict,
  naziv jsonb not null,
  opis jsonb not null default '{}'::jsonb,
  sastojci jsonb not null default '{}'::jsonb,
  alergeni text[] not null default '{}',
  slika_url text,
  slika_alt jsonb not null default '{}'::jsonb,
  halal boolean not null default true,
  vegetarijansko boolean not null default false,
  vegansko boolean not null default false,
  ljuto smallint not null default 0,
  kalorije int,
  aktivno boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint jela_slug_chk  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint jela_ljuto_chk check (ljuto between 0 and 3),
  -- Vegansko jelo je po definiciji i vegetarijansko.
  constraint jela_vegan_chk check (not vegansko or vegetarijansko)
);

create index jela_kategorija on jela (kategorija_id) where aktivno;

-- ── Lokal ↔ jelo ────────────────────────────────────────────
--  Meni jednog lokala: ovdje živi cijena i dostupnost.

create table lokal_jela (
  lokal_id uuid not null references lokali(id) on delete cascade,
  jelo_id  uuid not null references jela(id)   on delete cascade,
  cijena numeric(6,2) not null,
  dostupno boolean not null default true,
  izdvojeno boolean not null default false,
  redoslijed int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Par je primarni ključ — isto jelo se ne može dodati dvaput u isti lokal.
  primary key (lokal_id, jelo_id),
  constraint lokal_jela_cijena_chk check (cijena >= 0)
);

create index lokal_jela_dostupna  on lokal_jela (lokal_id) where dostupno;
create index lokal_jela_izdvojena on lokal_jela (lokal_id) where izdvojeno;

-- ── Preusmjerenja ───────────────────────────────────────────
--  Stari slug → novi. Puni ga /chef pri promjeni sluga (korak 14).

create table preusmjerenja (
  stari_slug text primary key,
  novi_slug  text not null,
  created_at timestamptz not null default now(),

  constraint preusmjerenja_razliciti_chk check (stari_slug <> novi_slug)
);

-- ── Rezervisani slugovi ─────────────────────────────────────
--
--  Lokal nazvan „meni" oteo bi stranicu menija — greška koja se otkrije
--  tek kad neko otvori sajt. Zato zaštita stoji i U BAZI, ne samo u
--  obrascu na /chef i u resolveru.
--
--  KAD SE DODA NOVA STRANICA, MORA I NOVA MIGRACIJA koja dopunjava
--  ovaj spisak. Isti spisak stoji u lib/route.ts (REZERVISANI).

create or replace function provjeri_slug_lokala() returns trigger as $$
begin
  if new.slug = any (array[
    -- jezici: kodovi i prefiksi
    'sl','en','de','ba','bs','tr','ar','zh',
    -- stranice lokala
    'meni','recenzije',
    -- zajedničke stranice
    'o-nas','halal','galerija','pogosta-vprasanja','zasebnost','pogoji',
    -- SEO stranice
    'kebab-ljubljana','pizza-ljubljana','burger-ljubljana','falafel-ljubljana',
    'halal-hrana-ljubljana','nocna-hrana-ljubljana','dostava-ljubljana',
    'studentski-meni-ljubljana',
    -- tehničke adrese
    'chef','api','sitemap.xml','robots.txt','_next','favicon.ico','favicon.svg'
  ]) then
    raise exception 'Slug "%" je rezerviran in ga lokal ne more uporabiti', new.slug
      using errcode = 'check_violation';
  end if;
  return new;
end $$ language plpgsql;

create trigger lokali_slug_bi
  before insert or update of slug on lokali
  for each row execute function provjeri_slug_lokala();

-- ── updated_at ──────────────────────────────────────────────

create or replace function osvjezi_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end $$ language plpgsql;

create trigger lokali_updated_at      before update on lokali      for each row execute function osvjezi_updated_at();
create trigger kategorije_updated_at  before update on kategorije  for each row execute function osvjezi_updated_at();
create trigger jela_updated_at        before update on jela        for each row execute function osvjezi_updated_at();
create trigger lokal_jela_updated_at  before update on lokal_jela  for each row execute function osvjezi_updated_at();

commit;
