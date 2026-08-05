# T10 · Baza — šema i migracije

**Faza:** 3 · **Preduslov:** T02 · **Paralelno sa:** T07, T08, T09
**Vlasnik fajlova:** `supabase/migrations/*.sql`

---

## Cilj

Šema baze koja **tačno odgovara tipovima iz T02**, sa ograničenjima koja onemogućavaju nevaljano stanje.

## Zašto može paralelno sa Fazom 2

Šema zavisi samo od domenskog modela (T02), ne od ruta ni stranica. Agent koji piše SQL ne dira nijedan fajl koji dira Faza 2.

---

## Šta se radi

### 1 · Tabele

```sql
create table lokali (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  naziv          text not null,
  ulica          text not null,
  adresa         text not null,
  telefon        text not null,
  email          text,
  lat            numeric(9,6),
  lng            numeric(9,6),
  radno_vrijeme  jsonb not null,
  wolt_url       text,
  glovo_url      text,
  google_place_id text,
  uvodni_tekst   jsonb not null default '{}'::jsonb,
  glavni         boolean not null default false,
  stanje         text not null default 'radi',
  redoslijed     int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint lokali_stanje_chk check (stanje in ('radi','uskoro','zatvoren')),
  constraint lokali_slug_chk   check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

create table kategorije (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  naziv jsonb not null,
  opis  jsonb not null default '{}'::jsonb,
  redoslijed int not null default 0,
  aktivna boolean not null default true
);

create table jela (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  kategorija_id uuid not null references kategorije(id) on delete restrict,
  naziv jsonb not null,
  opis  jsonb not null default '{}'::jsonb,
  sastojci jsonb not null default '{}'::jsonb,
  alergeni text[] not null default '{}',
  slika_url text,
  slika_alt jsonb not null default '{}'::jsonb,
  halal boolean not null default true,
  vegetarijansko boolean not null default false,
  vegansko boolean not null default false,
  ljuto int not null default 0,
  kalorije int,
  aktivno boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint jela_ljuto_chk check (ljuto between 0 and 3)
);

create table lokal_jela (
  lokal_id uuid not null references lokali(id) on delete cascade,
  jelo_id  uuid not null references jela(id)   on delete cascade,
  cijena numeric(6,2) not null,
  dostupno boolean not null default true,
  izdvojeno boolean not null default false,
  redoslijed int not null default 0,
  primary key (lokal_id, jelo_id),
  constraint lokal_jela_cijena_chk check (cijena >= 0)
);
```

### 2 · Ograničenja koja čuvaju sistem

```sql
-- Tačno jedan glavni lokal
create unique index lokali_jedan_glavni on lokali(glavni) where glavni;

-- Slug lokala ne smije biti rezervisan (lista iz T03)
create or replace function provjeri_slug_lokala() returns trigger as $$
begin
  if new.slug = any (array[
    'sl','en','de','ba','tr','ar','zh',
    'meni','recenzije','o-nas','halal','galerija','faq','privatnost','uslovi',
    'kebab-ljubljana','pizza-ljubljana','burger-ljubljana','falafel-ljubljana',
    'halal-hrana-ljubljana','nocna-hrana-ljubljana','dostava-ljubljana',
    'studentski-meni-ljubljana',
    'chef','api','sitemap.xml','robots.txt','_next','favicon.ico','favicon.svg'
  ]) then
    raise exception 'Slug "%" je rezervisan', new.slug;
  end if;
  return new;
end $$ language plpgsql;

create trigger lokali_slug_bi before insert or update of slug on lokali
  for each row execute function provjeri_slug_lokala();
```

> Ova provjera **mora biti u bazi**, ne samo u obrascu. Lokal nazvan `meni` oteo bi stranicu menija — a to je greška koja se otkrije tek kad neko otvori sajt.

Uz to: trigger koji održava `updated_at` na `lokali` i `jela`.

### 3 · Indeksi

```sql
create index lokal_jela_lokal_idx  on lokal_jela(lokal_id) where dostupno;
create index lokal_jela_izdvojeno_idx on lokal_jela(lokal_id) where izdvojeno;
create index jela_kategorija_idx   on jela(kategorija_id) where aktivno;
create index lokali_stanje_idx     on lokali(stanje, redoslijed);
```

### 4 · Pristup podacima (RLS)

```
lokali, kategorije, jela, lokal_jela
  čitanje    → dozvoljeno svima (anon)
  pisanje    → samo prijavljeni (authenticated)
```

Javni sajt čita anonimnim ključem; `/chef` piše prijavljenim.

### 5 · Oblik `radno_vrijeme`

```json
{
  "pon": {"od":"09:00","do":"02:00"},
  "uto": {"od":"09:00","do":"02:00"},
  "sri": {"od":"09:00","do":"02:00"},
  "cet": {"od":"09:00","do":"02:00"},
  "pet": {"od":"09:00","do":"05:00"},
  "sub": {"od":"09:00","do":"05:00"},
  "ned": {"od":"10:00","do":"05:00"}
}
```
`null` za dan kad je zatvoreno. `do` manje od `od` znači prelazak ponoći — tumačenje je u `jeOtvoren()` iz T02.

---

## Ne raditi u ovom zadatku

- Ne pisati TypeScript — T11
- Ne unositi podatke — seed je T11
- Ne praviti tabele za prijavu — Supabase Auth ih ima
- Ne dodavati tabelu recenzija — dolaze iz API-ja (T21)

---

## Verifikacija

- [ ] Migracije prolaze na praznoj bazi
- [ ] Unos drugog lokala sa `glavni = true` **pada**
- [ ] Unos lokala sa slugom `meni` **pada** uz jasnu poruku
- [ ] Unos lokala sa slugom `Bežigrad` **pada** *(velika slova i šumnici)*
- [ ] Unos `stanje = 'nesto'` pada
- [ ] Negativna cijena pada
- [ ] Brisanje lokala briše njegove redove u `lokal_jela`, ali **ne briše jela**
- [ ] Brisanje kategorije koja ima jela **pada**
- [ ] Anonimni ključ može čitati, ne može pisati
- [ ] `updated_at` se sam mijenja pri izmjeni

## Gotovo kad

Šema odgovara tipovima iz T02, a baza sama odbija nevaljano stanje.
