# AGENT_PLAN — Šeherezada

Izvršni plan za AI agenta. Cilj: od sadašnjeg Vite SPA sajta do Next.js sistema sa **više lokala**, **admin panelom** i **7 jezika**.

**Demo podaci su prihvatljivi.** Slike, tekstovi i cijene mogu biti placeholder. Prioritet je da sistem **funkcioniše** i da arhitektura bude tačna.

---

## 0. Tvrda pravila — ne kršiti

1. **Vizualni dizajn se ne mijenja.** Nijedna nova boja, font, oblik, razmak ni animacija. Nove sekcije se sklapaju isključivo od postojećih Tailwind klasa i obrazaca.
2. **Svaki tekst mora biti u serverskom HTML-u.** `'use client'` samo tamo gdje postoji stvarna interaktivnost (prekidači, modal, drag-scroll, animacije).
3. **Navigacija su pravi `<Link>`/`<a href>`.** Nikad `onClick` + programsko preusmjeravanje.
4. **Nema automatskog preusmjeravanja** po IP-u, geolokaciji ili `Accept-Language`.
5. **Adrese se ne prevode.** `/en/meni`, nikad `/en/menu`.
6. **Tačno jedan `<h1>` po stranici.**
7. **Sva jela u DOM-u odjednom** na stranici menija; filteri kategorija su vizuelni (CSS), ne uklanjaju elemente.
8. **Cijene su tekst**, nikad dio slike.

### Dizajn tokeni koji se koriste (iz `tailwind.config.js` i `index.css`)

```
boje        shere-red #E63946 · shere-darkred #D62828
            shere-gold #E9C46A · shere-yellow #F4A261 · shere-charcoal #0f172a
fontovi     font-poppins (naslovi, font-black) · font-inter (tekst)
naslov h2   text-4xl md:text-5xl font-black font-poppins tracking-tight
kontejner   max-w-[1440px] mx-auto px-4 md:px-8
sekcija     py-20
zaobljenje  rounded-2xl
staklo      bg-black/40 backdrop-blur-xl border border-white/20
            bg-white/5 border border-white/5 backdrop-blur-sm
sjaj        shadow-[0_0_40px_-10px_rgba(230,57,70,0.6)]
hover       hover:scale-105 active:scale-95
animacija   framer-motion: opacity 0→1, y 20→0, delay kaskadno 0.1s
tema        dark podrazumijevano (class strategija)
```

---

## 1. Trenutno stanje

| | |
|---|---|
| Stack | React 19 · Vite 8 · TS · Tailwind 3 · framer-motion · GSAP · lucide-react |
| Renderovanje | CSR — `<body>` sadrži samo `<div id="root">` |
| Rute | nema routera; hash anchori `#home #popular #about #menu #reviews` |
| Podaci | `src/data.ts` — 23 jela, 8 kategorija, 3 recenzije |
| Jezici | `src/providers/LanguageProvider.tsx` — `useState<"sl"|"en">`, nije u URL-u |
| Lokali | 1, ukucan |
| Admin / baza | ne postoje |

### Fajlovi koji se brišu
```
src/components/SplashScreen.tsx        neimportovan
src/components/MobileFAB.tsx           neimportovan
src/components/DevViewportSwitcher.tsx neimportovan
src/App.css                            Vite starter, neimportovan
src/assets/react.svg  src/assets/vite.svg  src/assets/hero.png
public/hero_kebab.png                  808 KB, nekorišten
public/rotisserie_hero_bg.png          936 KB, postoji .webp
public/fast_food_pattern.png           713 KB, postoji .webp
public/icons.svg                       nekorišten
```

### Popravke u Fazi 1
| Problem | Lokacija | Akcija |
|---|---|---|
| Favicon 404 | `index.html` → `/vite.svg` | pokazati na `/favicon.svg` (postoji u `public/`) |
| Zumiranje blokirano | `index.html` viewport | ukloniti `maximum-scale=1.0` |
| 3× `<h1>` | `Navbar.tsx:100`, `Hero.tsx:112`, `AboutUs.tsx:62` | zadržati samo Hero; ostala dva → `<div>`/`<p>` sa istim klasama |
| Podnožje 2× u DOM-u | `App.tsx:50-55` + inline | jedna instanca, CSS rješava desktop/mobile |
| Reviews bez naslova | `Reviews.tsx` | dodati `<h2>` u stilu ostalih sekcija |
| `loading="eager"` na svim karticama | `ProductCard.tsx:61,208` | `lazy` osim prve 4 |
| Slika bez dimenzija | sve `<img>` | dodati `width`/`height` |
| Halal iz kategorije | `ProductCard.tsx:152-177`, `ProductModal.tsx:172` | čitati iz podatka `jelo.halal` |
| Bosanski umjesto slovenskog | `index.html` meta, `Hero.tsx:318,319,329`, `AboutUs.tsx:112`, `Navbar.tsx:14-20` | prevesti na slovenski |

---

## 2. Ciljna struktura adresa

```
seherezada.net / [jezik] / [lokal] / [stranica]
                  ↑ sl bez prefiksa   ↑ glavni lokal bez prefiksa
```

| Javna adresa | Razrješava se u |
|---|---|
| `/` | sl · glavni lokal · naslovna |
| `/meni` | sl · glavni lokal · meni |
| `/recenzije` | sl · glavni lokal · recenzije |
| `/seherezada2` | sl · lokal `seherezada2` · naslovna |
| `/seherezada2/meni` | sl · lokal `seherezada2` · meni |
| `/o-nas` | sl · zajednička |
| `/kebab-ljubljana` | sl · SEO |
| `/en/` | en · glavni lokal · naslovna |
| `/en/seherezada2/meni` | en · lokal · meni |
| `/en/o-nas` | en · zajednička |

### Implementacija: jedan catch-all + resolver

Segmenti su dvosmisleni (`/meni` je stranica, `/seherezada2` je lokal, `/o-nas` je zajednička). **Ne praviti odvojene rute** — nastaju sudari.

```
app/
  [[...slug]]/page.tsx      sve javne stranice
  chef/                     admin (izuzet iz catch-all)
  api/
  sitemap.ts
  robots.ts
  layout.tsx
```

```ts
// lib/route.ts
export type Lang = 'sl'|'en'|'de'|'ba'|'tr'|'ar'|'zh';
export const LANGS: Lang[] = ['sl','en','de','ba','tr','ar','zh'];
export const DEFAULT_LANG: Lang = 'sl';

export const LOKAL_PAGES = ['meni','recenzije'] as const;
export const SHARED_PAGES = ['o-nas','halal','galerija','faq','privatnost','uslovi'] as const;
export const SEO_PAGES = [
  'kebab-ljubljana','pizza-ljubljana','burger-ljubljana','falafel-ljubljana',
  'halal-hrana-ljubljana','nocna-hrana-ljubljana','dostava-ljubljana',
  'studentski-meni-ljubljana',
] as const;

export type Route =
  | { kind:'lokal-home';  lang:Lang; lokalSlug:string }
  | { kind:'lokal-page';  lang:Lang; lokalSlug:string; page:'meni'|'recenzije' }
  | { kind:'shared';      lang:Lang; page:string }
  | { kind:'seo';         lang:Lang; page:string }
  | { kind:'notfound' };

// lokalSlugs i glavniSlug dolaze iz baze (Faza 2+), iz konstante u Fazi 1
export function resolveRoute(
  slug: string[] = [],
  lokalSlugs: string[],
  glavniSlug: string,
): Route { /* redoslijed razrješavanja ispod */ }
```

**Redoslijed razrješavanja — obavezan:**

1. Ako je `slug[0]` u `LANGS` → `lang = slug[0]`, ukloni ga. Inače `lang = 'sl'`.
2. Na ostatku:
   - `[]` → `lokal-home` sa `glavniSlug`
   - `[p]` gdje `p ∈ LOKAL_PAGES` → `lokal-page` sa `glavniSlug`
   - `[l]` gdje `l ∈ lokalSlugs` → `lokal-home`
   - `[p]` gdje `p ∈ SHARED_PAGES` → `shared`
   - `[p]` gdje `p ∈ SEO_PAGES` → `seo`
   - `[l, p]` gdje `l ∈ lokalSlugs` i `p ∈ LOKAL_PAGES` → `lokal-page`
   - inače → `notfound`

**Rezervisani slugovi** — admin mora odbiti lokal sa ovim slugom:
```
sl en de ba tr ar zh
meni recenzije o-nas halal galerija faq privatnost uslovi
kebab-ljubljana pizza-ljubljana burger-ljubljana falafel-ljubljana
halal-hrana-ljubljana nocna-hrana-ljubljana dostava-ljubljana studentski-meni-ljubljana
chef api sitemap.xml robots.txt _next favicon.ico
```

`generateStaticParams` generiše sve validne kombinacije iz baze. Glavni lokal se generiše **samo** bez prefiksa; `/{glavniSlug}` vraća trajno preusmjeravanje na `/`.

---

## 3. Model podataka

```sql
create table lokali (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,          -- "seherezada2"
  naziv         text not null,                 -- "Šeherezada Trubarjeva"
  ulica         text not null,
  adresa        text not null,                 -- puna, za NAP
  telefon       text not null,
  email         text,
  lat           numeric, lng numeric,
  radno_vrijeme jsonb not null,                -- {"mon":{"od":"09:00","do":"02:00"},...,"sun":null}
  wolt_url      text, glovo_url text,
  google_place_id text,
  uvodni_tekst  jsonb not null default '{}',   -- {"sl":"...","en":"..."} OBAVEZNO popuniti
  glavni        boolean not null default false,
  stanje        text not null default 'radi',  -- radi | uskoro | zatvoren
  redoslijed    int not null default 0,
  created_at    timestamptz default now()
);
create unique index lokali_jedan_glavni on lokali(glavni) where glavni;

create table kategorije (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  naziv jsonb not null, opis jsonb default '{}',
  redoslijed int default 0, aktivna boolean default true
);

create table jela (                            -- katalog cijelog brenda
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  kategorija_id uuid references kategorije(id),
  naziv jsonb not null, opis jsonb default '{}', sastojci jsonb default '{}',
  alergeni text[] default '{}',
  slika_url text, slika_alt jsonb default '{}',
  halal boolean default true,
  vegetarijansko boolean default false, vegansko boolean default false,
  ljuto int default 0, kalorije int,
  azurirano timestamptz default now()
);

create table lokal_jela (                      -- meni jednog lokala
  lokal_id uuid references lokali(id) on delete cascade,
  jelo_id  uuid references jela(id)   on delete cascade,
  cijena numeric(6,2) not null,
  dostupno boolean default true,
  izdvojeno boolean default false,
  redoslijed int default 0,
  primary key (lokal_id, jelo_id)
);
```

**Princip:** `jela` je biblioteka, `lokal_jela` je meni lokala. Novi lokal počinje **praznog menija**. Opis/slika/alergeni su zajednički; **cijena i dostupnost su po lokalu**.

Prijevodi su `jsonb`: `{"sl":"Pileći kebab","en":"Chicken kebab"}`. Pomoćnik `t(field, lang)` pada na `en`, pa na `sl`.

### Baza
**Supabase** (Postgres + Auth + Storage u jednom). Alternativa: Neon/Turso + Vercel Blob + zaseban auth. Lokalni Postgres u razvoju je u redu.

---

## 4. Faze

### FAZA 1 — Next.js temelj i rute
Sajt radi, Google vidi tekst. Podaci još iz `data.ts`.

- [ ] `create-next-app` (App Router, TS, Tailwind) ili migracija u mjestu; prenijeti `tailwind.config.js`, `index.css`, `public/`
- [ ] Prenijeti komponente iz `src/components/` u `components/`
- [ ] `'use client'` **samo** na: `Navbar`, `MobileCTA`, `ProductModal`, `Menu` (tabovi), `Reviews` (karusel), `AboutUs` (GSAP omotač), `BackgroundPattern`, `ThemeProvider`, `LanguageProvider`
- [ ] U `Hero` i `AboutUs` **odvojiti animirani omotač od teksta** — tekst ostaje serverski
- [ ] `lib/route.ts` sa `resolveRoute` (Dio 2); `lokalSlugs` i `glavniSlug` za sada konstante
- [ ] `app/[[...slug]]/page.tsx` + `generateStaticParams` + `generateMetadata` (svaka stranica svoj `title` i `description`)
- [ ] `app/sitemap.ts`, `app/robots.ts`
- [ ] Navbar: hash anchori → `<Link href>`; dodati podmeni „Meni ▾"
- [ ] Sve popravke iz tabele u Dijelu 1
- [ ] Uskladiti radno vrijeme na **jedan** izvor istine (`data.ts`), uklonite hardkodovano u `Hero` i `Footer`

**Provjera:** `view-source:` na `/` i `/meni` pokazuje pun tekst i cijene · sajt čitljiv sa isključenim JS-om · svaka ruta svoj `<title>` · desni klik na stavku menija → „Otvori u novoj kartici" radi · `npm run build` prolazi

---

### FAZA 2 — Baza i `/chef`

- [ ] Supabase projekat, migracije iz Dijela 3
- [ ] Seed: 23 jela iz `data.ts` → `jela` + `kategorije`; jedan lokal (Trubarjeva) → `lokali`; sve cijene → `lokal_jela`
- [ ] Sloj podataka `lib/db.ts`: `getLokali()`, `getLokal(slug)`, `getMeni(lokalId, lang)`, `getKategorije()`
- [ ] Sajt čita iz baze umjesto iz `data.ts`; `data.ts` ostaje samo kao seed
- [ ] `app/chef/` — prijava (Supabase Auth), `noindex`, `Disallow: /chef` u `robots.ts`
- [ ] **Lokali:** lista · dodaj · uredi · **kopiraj lokal** (duplicira `lokal_jela`) · postavi kao glavni · stanje · redoslijed (drag) · validacija sluga protiv rezervisanih
- [ ] **Jela:** CRUD · **A: dodaj iz kataloga u lokal** (multi-select + unos cijene) · **B: kopiraj kao novo jelo** · ukloni iz lokala · kartice po jeziku za prijevode
- [ ] **Tabela cijena:** jela × lokali, inline uređivanje, `—` = nema reda u `lokal_jela`, dugme „primijeni na sve lokale"
- [ ] Otpremanje slike → Supabase Storage, auto WebP, 3 veličine, max 300 KB
- [ ] Revalidacija na snimanje: `revalidateTag('meni')`, `revalidateTag('lokali')`, `revalidateTag('sitemap')`

**Provjera:** promjena cijene vidljiva ≤20 s bez rebuilda · `/chef` traži prijavu · `/chef` nije u sitemapu · kopiranje lokala prenosi cijeli meni

---

### FAZA 3 — Više lokala

- [ ] `resolveRoute` čita `lokalSlugs`/`glavniSlug` iz baze; `generateStaticParams` iz baze
- [ ] **Prekidač lokala.** Desktop: u `Navbar` kontrolama, **lijevo od jezika**, isti stil kao dugme jezika (`Navbar.tsx:132-139`), ikona `MapPin`. Mobitel: u overlay bloku (`Navbar.tsx:188-213`), red **LOKAL** iznad **JEZIK APLIKACIJE**, isto crveno dugme; red sa 📍 postaje dinamičan.
- [ ] Prekidač **skače na istu vrstu stranice**: `/meni` → `/seherezada2/meni`. Kolačić `lokal` pamti izbor. Otvaranje stranice lokala postavlja izbor.
- [ ] Naslovna sekcija 2: tri kartice iz `Hero` (`Hero.tsx:300-335`) → kartice lokala (ikona, naziv, adresa, radno vrijeme, „Navodila"). Broj prati bazu. Dugme „Poišči najbližjega" traži geolokaciju **samo na klik**.
- [ ] Lokal 2 unijeti kroz `/chef`; lokal 3 u stanju `uskoro` (kartica sa oznakom *Kmalu*, bez ruta, van sitemapa)
- [ ] `uvodni_tekst` obavezan i **različit** po lokalu
- [ ] Recenzije: Google Places API po `google_place_id`, revalidacija dnevno. **Ne stavljati u `Review`/`aggregateRating` schemu.**

**Provjera:** `/seherezada2/meni` u izvoru pokazuje cijene lokala 2 · novi lokal kroz `/chef` sam stvara rute i ulazi u sitemap · `/{glavniSlug}` → 301 na `/`

---

### FAZA 4 — Stranice i sadržaj

Naslovna, redoslijed sekcija:

| # | Sekcija | Prati lokal |
|---|---|---|
| 1 | Hero | da |
| 2 | Kartice lokala | da |
| 3 | Priljubljene izbire | da |
| 4 | Naša zgodba → *Preberi več* → `/o-nas` | ne |
| 5 | Naš meni → *Poglej cel meni* | da |
| 6 | **Halal** → *Preberi več* → `/halal` | ne |
| 7 | Recenzije → *Vse recenzije* | da |
| 8 | **Pogosta vprašanja** → *Vsa vprašanja* → `/faq` | djelimično |
| 9 | Podnožje | da |

- [ ] Sekcija 6 (nova): raspored kao `AboutUs` — slika/tekst, `<h2>` u stilu `PopularPicks`, dugme `bg-shere-red rounded-2xl`
- [ ] Sekcija 8 (nova): 4 pitanja, accordion, pločice `rounded-2xl border border-white/10`
- [ ] Sekcija 1: crveni red `Kebab · Pizza · Falafel` → `Halal kebab in fast food v Ljubljani`
- [ ] Sekcija 4: skratiti na 3–4 rečenice + dugme
- [ ] Zajedničke stranice: `/o-nas` `/halal` `/galerija` `/faq` `/privatnost` `/uslovi` (demo tekst prihvatljiv)
- [ ] 8 SEO stranica, kostur od 9 blokova; **min 70% jedinstvenog teksta** — ne generisati zamjenom riječi
- [ ] Podnožje: 4 kolone, svi lokali kao tekst, **jedna instanca**
- [ ] Mrvice na podstranicama; interno linkovanje

**Provjera:** nijedna stranica nije siroče · mrvice svuda · nijedan lokal nema isti `uvodni_tekst`

---

### FAZA 5 — Jezici

- [ ] `[lang]` se puni; `t(field, lang)` sa fallbackom
- [ ] `hreflang` u `generateMetadata` za sve verzije + `x-default` → `/en/`; **obostrano**, apsolutne adrese
- [ ] `bs`/`hr`/`sr` → isti `/ba/`
- [ ] Prekidač jezika ostaje na istoj stranici; nikad na naslovnu; bez auto-detekcije
- [ ] Nazivi jezika na svom jeziku: Deutsch, Türkçe, العربية, 中文
- [ ] Arapski: `<html lang="ar" dir="rtl">`, CSS logička svojstva (`margin-inline-start`, `padding-inline-end`, `text-align:start`)
- [ ] Nivoi prevođenja: **7 jezika** — naslovne i meniji lokala, `/halal`, `/faq` · **sl/en/de** — SEO stranice, `/o-nas`, recenzije · **sl/en** — `/galerija`, pravne
- [ ] Redoslijed: SL+EN → DE → BHS+TR → AR+ZH

**Provjera:** prekidač sa `/de/seherezada2` → `/en/seherezada2` · hreflang obostran · `/ar/` RTL, brojevi LTR

---

## 5. Demo podaci

Placeholder je u redu dok ne stignu pravi. Označiti komentarom `// DEMO`.

```
LOKAL 1 (glavni)   slug: trubarjeva
  Šeherezada · Trubarjeva cesta 31, 1000 Ljubljana · +386 69 444 812
  Pon–Čet 09:00–02:00 · Pet–Sob 09:00–05:00 · Ned 10:00–05:00

LOKAL 2            slug: seherezada2
  Šeherezada 2 · Slovenska cesta 55, 1000 Ljubljana · +386 64 183 155
  Pon–Pet 08:00–23:59 · Sub–Ned 09:00–23:59

LOKAL 3            stanje: uskoro
```

Slike: zadržati postojeće dok ne stignu prave. Cijene lokala 2: uzeti cijene lokala 1 +0,50 € kao demo.

---

## 6. Nakon arhitekture

Ne raditi dok Faze 1–5 ne stoje: `Restaurant` schema **po lokalu** (adresa, radno vrijeme, `Menu`) · `FAQPage`, `BreadcrumbList` · WebP i `srcset` za `rotisserie_hero.png` (899 KB, LCP) · Google Business profili (3) · Apple Business · Search Console, GA4.

---

## 7. Kontrolna lista prije zatvaranja

- [ ] `view-source:` pokazuje sav tekst i sve cijene na svakoj ruti
- [ ] Sajt upotrebljiv sa isključenim JavaScriptom
- [ ] Tačno jedan `<h1>` po stranici
- [ ] Sve stavke navigacije su pravi linkovi
- [ ] Prekidači lokala i jezika ne vraćaju na naslovnu
- [ ] Nema auto-preusmjeravanja po jeziku ni lokaciji
- [ ] `/chef` zaključan, `noindex`, van sitemapa
- [ ] Novi lokal iz `/chef` sam stvara rute i ulazi u sitemap
- [ ] Nijedna nova boja, font, oblik ni animacija
- [ ] Radi na 390 px prije nego na desktopu
- [ ] `npm run build` bez grešaka i TS upozorenja
