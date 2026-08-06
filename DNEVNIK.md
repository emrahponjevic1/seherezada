# Dnevnik izrade — Šeherezada

Šta je urađeno, kojim redom, i **zašto** tamo gdje odluka nije očigledna.
Plan je u [plan/ZAVRSNI-PLAN.html](plan/ZAVRSNI-PLAN.html); ovo je zapis izvođenja.

Pravilo pisanja: bilježe se **odstupanja od plana i razlozi**, ne prepričavanje
plana. Ako nešto nije urađeno kako plan kaže, ovdje piše zašto.

---

## Gdje smo

| | |
|---|---|
| **Gotovo** | koraci 1–10 od 24 |
| **Faze** | 0 (temelj), 1 (rute), 2 (stranice) — završene |
| **Sljedeće** | korak 11 — repozitorij nad bazom i seed |
| **Build** | prolazi čist kroz sve korake |
| **Lint** | 2 zatečene greške, nula novih |

---

## Okruženje

Stvari koje su usput zapele, da se ne traže dvaput.

**Node** — v24.19.0, npm 11.17.0. Instaliran u `C:\Program Files\nodejs`, i **jeste** u
sistemskom PATH-u. Ako `npm` „ne postoji", VS Code je pokrenut prije instalacije Node-a i
naslijedio staro okruženje — pomaže samo potpuni restart VS Code-a, ne novi tab terminala.

**PowerShell ExecutionPolicy** — bila je `Restricted`, pa je `npm` (koji je `.ps1`) bio blokiran.
Riješeno sa `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`.
Zaobilaznica bez izmjene politike: `npm.cmd` umjesto `npm`.

**PostgreSQL** — 18.4, `localhost:5432`. `psql` je na
`C:\Program Files\PostgreSQL\18\bin\psql.exe` i **nije** u PATH-u.

**Zamka u kodu** — slovenski navodnik `„…"` sa ASCII zatvaranjem prekida JavaScript string
i ruši build. Koristiti `„…“`.

---

## Odluke koje su pale

| Odluka | Kada | Šta je odlučeno |
|---|---|---|
| **Demo podaci** | prije koraka 1 | Ne mapiraju se postojeći podaci iz `src/data.ts` nego se pišu potpuno novi demo podaci. Bitno je da sistem bude **pun**, ne vjeran stvarnom restoranu. |
| **Označavanje napretka** | prije koraka 1 | Agent **ne** označava kućice. Na kraju koraka javlja koje da se označe, korisnik to radi sam da prati napredak. |
| **Jezik adresa** | prije koraka 3 | **Dosljedno slovenski**: `/pogosta-vprasanja`, `/zasebnost`, `/pogoji`. Po pravilu 8 se više ne mijenjaju. |
| **Baza** | prije koraka 10 | **Vlastiti PostgreSQL, ne Supabase.** Postgres a ne SQLite, jer sajt mora raditi i na serveru — SQLite na Vercelu gubi izmjene. |

---

## Korak 1 — migracija na Next.js

Vite → Next.js 16.3 App Router, u postojećem repozitoriju da se sačuva git historija.
Obrisan mrtav kod: `SplashScreen`, `MobileFAB`, `DevViewportSwitcher`, `App.css`,
`lib/utils.ts`, `src/assets/*`, četiri nekorištene slike (~2,4 MB).

**Odstupanja:**

- **`tailwind.config.js` je bio na „ne dirati" listi, ali je morao biti izmijenjen.**
  `content` glob je pokazivao na `./src/**`; poslije premještanja Tailwind ne bi našao
  nijednu klasu i sajt bi ostao potpuno neoblikovan. Uz to je `fontFamily` tražio fontove
  po imenu `"Poppins"`, što se ne poklapa sa načinom na koji ih `next/font` učitava.
  Izmijenjeni samo `content` i `fontFamily`; tema i boje netaknute.
- **`'use client'` je morao na *sve* komponente**, ne na devet iz plana. Plan izostavlja
  `Footer` i `PopularPicks`, a obje koriste `useLanguage`. Bitno: u Next.js-u `'use client'`
  **ne** znači da teksta nema u HTML-u — klijentske komponente se i dalje iscrtavaju na serveru.
- **`eslint-plugin-react-refresh` uklonjen** — Vite plugin koji zabranjuje izvoz
  `metadata`/`viewport`, a to App Router zahtijeva.

**Tema bez treperenja:** blokirajuća skripta u `<head>` postavlja klasu prije prvog iscrtavanja;
`ThemeProvider` prešao na `useSyncExternalStore` i **ne** postavlja klasu pri montiranju.

**Zatečeno stanje koje je potvrđeno:** tri `<h1>`, podnožje se renderovalo dvaput,
`Menu.tsx` je držao samo jednu kategoriju u DOM-u, ukucana ocjena `4,5 / 1914`.

---

## Korak 2 — domenski model i ugovori

`lib/domain.ts`, `lib/repo.ts`, `lib/repo.static.ts`, `lib/i18n.ts`, `messages/{sl,en}.json`.
Svih šest ispravki iz §6 ugrađeno odmah, pa se kasniji koraci ne vraćaju na model.

**Demo podaci:** 3 lokala (`trubarjeva` glavni, `seherezada2` +0,50 €, `bezigrad` u stanju
`uskoro`), 8 kategorija, **23 jela**. Broj 23 je namjerno izabran da se poklopi sa provjerama
`k2c2`, `k8c1`, `k11c5` i `k14c7` — u zatečenom `data.ts` ih je bilo 24, što je bilo neslaganje
sa planom.

**`jeOtvoren()`** rješava prelazak ponoći i izuzetke po datumu na jednom mjestu. Time je
ispravljena greška koju su pravili `Hero.tsx` i `Footer.tsx`: lokal koji petkom radi do 05:00
u subotu u 03:00 prikazivao je „zatvoreno" — baš u sate kad ima najviše gostiju.

**`k2c14` ostaje otvoren i to je očekivano.** Traži da samo `repo.static.ts` uvozi `data.ts`,
ali plan istovremeno zabranjuje diranje komponenti u ovom koraku. Zatvara se kroz korake 7–9.

**Provjera:** 28 tvrdnji kroz privremenu rutu, sve prolaze; nijedan `any`.

---

## Korak 3 — rute i resolver

`lib/route.ts` i jedan catch-all `app/[[...slug]]/page.tsx`. **140 statičnih adresa**
generisanih iz `repo` — nijedan slug nije ukucan.

`resolveRoute` ide redoslijedom iz §5; ključno je da se **stranice lokala provjeravaju prije
slugova lokala**, da lokal nazvan „meni" ne otme stranicu menija.

**Odstupanje:** plan dozvoljava da stranice budu kosturi, ali bi time naslovna ostala prazna
kroz korake 4–6. Umjesto toga je sadržaj privremeno prenesen u `NaslovnaPrivremeno.tsx`
(obrisan u koraku 7). Ostale stranice jesu bile kosturi.

`resolveRoute` već prima tabelu preusmjerenja kao argument, pa je korak 18 samo dopuna.

**Provjera:** 27 adresa kroz stvarne HTTP zahtjeve (200/308/404) + kružni test
`href()` ↔ `resolveRoute` nad svih 140 kombinacija.

---

## Korak 4 — okvir: navbar i podnožje

**Obrazac uveden ovdje i korišten dalje:** serverski omotač dohvata iz `repo`, klijentsko
tijelo nosi animacije i hookove. Time `app/layout.tsx` (vlasnik: korak 1) ostaje netaknut.

Kotvice `#home`/`#menu` postale prave stranice, logo prestao biti `<h1>`, scroll-spy uklonjen
(aktivnu stavku sad određuje `usePathname()`), podnožje dobilo četiri kolone i čita lokale iz
repozitorija.

**Uhvaćeno usput:** podmeni „Meni ⌄" je prvo bio pisan kroz `AnimatePresence`, pa mu linkovi
nisu bili u izvornom HTML-u — ista greška zbog koje postoji korak 8. Sad se uvijek renderuje
a skriva stilom.

**Posljedica za kasnije:** labele idu kroz `t()` iz `LanguageProvider` (da SL/EN prekidač
nastavi raditi), a `href()` koristi jezik iz adrese. Ta dva su odvojena do koraka 22.

---

## Korak 5 — stanja: 404, greška, kosturi

`app/not-found.tsx`, `app/error.tsx`, `app/global-error.tsx`, `components/stanja/`.

**Odstupanje: `app/loading.tsx` NIJE dodan iako ga plan navodi.** Kad je dodan, sve nepostojeće
adrese počele su vraćati **200 umjesto 404** — Suspense granica na korijenu pošalje status prije
nego `notFound()` stigne. Ispravan status je važniji od kostura koji se na statičnim stranicama
ionako ne vidi. **Ako ga neko kasnije doda, 404 se ponovo lomi** — provjeriti sa
`curl -o NUL -w "%{http_code}" /nepostoji`.

**Poznato ograničenje koje nije riješeno:** u Next 16 `notFound()` renderuje 404 u praznom
`__next_error__` dokumentu — bez korijenskog okvira (nema navigacije ni podnožja) i bez
serverskog HTML-a. Status je ispravan, dugmad rade. Bezuspješno probano: sinhroni not-found,
ugniježđeni `not-found.tsx`, prolazni layout, uklanjanje `error.tsx` i `global-error.tsx`.

---

## Korak 6 — metapodaci, sitemap, robots

`lib/meta.ts` sa `metaZaRutu()`. Ulica ulazi u naslov lokala baš zato da `/meni` i
`/seherezada2/meni` nemaju isti `<title>`.

Sitemap i robots se grade **iz `repo`**, nikad iz ukucane liste. Dokazano: prebacivanje trećeg
lokala na `radi` dodalo je 21 unos u sitemap i stvorilo mu rute **bez ijedne izmjene koda**.

`og:image` prebačen sa Unsplasha na lokalnu sliku, sa `width`, `height` i `alt` — bez dimenzija
se pregled na Facebooku i WhatsAppu često ne prikaže.

---

## Korak 7 — naslovna, devet sekcija

Najosjetljiviji korak u planu. Obrazac: **sekcija serverska (sav tekst) + klijentski omotač za
animaciju**. Klijentsko je ostalo samo stvarno interaktivno: 3D tanjir, karusel recenzija,
značka „Odprto zdaj", današnje radno vrijeme, stanje modala.

Nove sekcije: **Kartice lokala** (preuzele izgled trake iz heroja), **Halal**, **Pogosta vprašanja**.
`Reviews` dobio `<h2>` kojeg dotad uopšte nije imao. Tekst u `AboutUs` bio je bosanski —
preveden na slovenski. Ukrasni „TRADICIJA & KVALITETA" prestao biti `<h1>`.

**FAQ koristi native `<details>`** umjesto JS accordiona — sva pitanja i odgovori su u HTML-u
i rade i bez JavaScripta, što je jače od onoga što plan traži.

**Posljedica:** sekcije su sad serverske i čitaju jezik iz adrese, pa **prekidač SL/EN više ne
mijenja tekst sekcija**. Rute `/en/...` rade ispravno. Rješava korak 22.

**Provjera:** tačno jedan `<h1>`; hijerarhija bez preskakanja; u izvoru su naslov heroja,
adrese sva tri lokala, cijene izdvojenih jela i sva četiri pitanja.

---

## Korak 8 — stranica menija

Popravljena **najveća tiha greška sajta**: `Menu.tsx` je držao `activeCategory` u stanju i
renderovao samo jednu kategoriju — ostalih sedam nije postojalo u DOM-u.

Sad se sve kategorije renderuju uvijek, tabovi mijenjaju vidljivost klasom `hidden`,
podrazumijevani tab je **„Vse"**.

`Menu` je postao **jedna komponenta sa varijantama** `'puna'` i `'izvod'`, ne dvije kopije.
`ProductCard` i `ProductModal` prešli na `MenuStavka`.

**Oznake se čitaju iz podatka, ne iz kategorije.** Dotad je pica dobijala halal oznaku samo ako
joj je slug bio baš `kebab-pizza`, a burgeri je nisu imali iako jesu halal.

**Provjera:** svih 23 jela i 8 kategorija u izvoru; 46 slika, sve sa `width`/`height`;
nijedna sekcija nije skrivena u početnom HTML-u pa bez JS-a rade sve kategorije.

---

## Korak 9 — zajedničke, SEO i recenzije

Šest zajedničkih stranica, osam SEO stranica, stranica recenzija po lokalu. Sve u
`components/stranice/`.

FAQ ima tačno 24 pitanja u tri grupe; odgovor na „Do kdaj ste odprti?" se **izvodi iz radnog
vremena** i sam nabraja lokale. Blok 5 SEO stranica **čita cijene iz `repo`**, pa se cijena
nikad ne prepisuje u tekst i ne može zastariti.

`/nocna-hrana-ljubljana` u bloku 6 navodi **samo Trubarjevu**, jer Slovenska zatvara u 23:59.

**Nije urađeno:** QR kod na stranici recenzija — traži pravi `google_place_id`, a demo vrijednost
bi dala QR koji vodi nikuda. Mjesto označeno komentarom, stiže u koraku 21.

**Provjera:** svih 16 adresa vraća 200 sa tačno jednim `<h1>`; nula duplikata teksta među SEO
stranicama (provjereno programski nad svih 28 parova); obilazak sa naslovne dosegne svih 20
javnih adresa — **nijedna stranica nije siroče**.

---

## Korak 10 — šema baze

**Odstupanje od plana: bez Supabasea.** Cijeli projekat ide na PostgreSQL koji vodimo sami.
SQLite je razmatran i odbačen — na Vercelu/Netlifyju gubi izmjene pri svakom osvježavanju,
a sajt mora raditi i kad ode na server.

Migracije su u `baza/migracije/`, ne u `supabase/migrations/`.

**Umjesto Supabase RLS-a, dvije PostgreSQL uloge:** `seherezada_web` **samo čita**,
`seherezada_admin` i piše. Ako javni dio sajta ikad pokuša pisati, baza to odbije.

Triger `provjeri_slug_lokala()` brani rezervisane slugove u samoj bazi. **Kad se doda nova
stranica, mora i nova migracija** koja dopunjava taj spisak — isti spisak stoji u `lib/route.ts`.

**Provjera:** 13 tvrdnji na svježoj bazi, sve prolaze — drugi glavni lokal pada, slug `meni`
pada uz jasnu poruku, slug `Bežigrad` pada, negativna cijena pada, brisanje kategorije sa jelima
pada, brisanje lokala ne briše jela, web uloga dobija `permission denied` na pisanje.

**Tri koraka plana moraju se preraditi jer su pisani za Supabase:** 13 (prijava),
17 (slike), 24 (objava).

---

## Korak 11 — repozitorij nad bazom i seed

Sajt čita iz PostgreSQL-a. **Nijedna komponenta, ruta ni stranica nije dirana** — to je i bio
test ispravnosti koraka 2, i prošao je.

`lib/baza.ts` drži dvije veze (web čita, admin piše) i čuva bazen na `globalThis` — bez toga bi
razvojni server pravio nov bazen pri svakoj izmjeni dok se baza ne uguši.

**`getMeni` je jedan upit sa tri spoja**, ne upit po kategoriji. Grupisanje radi kod. Bez toga bi
meni sa osam kategorija pravio devet odlazaka u bazu.

**Upiti su umotani u `unstable_cache` sa oznakama odmah**, ne naknadno — da je ostavljeno za
korak 12, svaki poziv bi se prepravljao.

**Nova stvar koje u planu nije bilo:** migracije traže vlasnika baze, a `seherezada_admin` smije
pisati *u* tabele ali ih ne smije *praviti*. Zato postoji treća veza `DATABASE_URL_MIGRACIJE`,
koja se na serveru koristi jednom pri objavi, ne u radu. Uz nju ide `scripts/migriraj.mjs` koji
vodi evidenciju u tabeli `migracije` i preskače već pokrenute.

Seed uvozi demo podatke iz `lib/repo.static.ts` i radi u čistom Node-u — moguće samo zato što
`repo.static.ts` ima isključivo `import type`, koje Node briše pri obradi tipova.

**Provjera:** seed prolazi na praznoj bazi; drugo pokretanje ne duplira (8/23/3/46 prije i
poslije); `/meni` prikazuje 23 jela sa cijenama iz baze; `/seherezada2/meni` +0,50 €; lokal
`uskoro` vraća 404 i nije u sitemapu; sva tri lokala imaju različit uvodni tekst; `EXPLAIN`
pokazuje jedan plan; admin veza se ne pojavljuje u `.next/static`.

---

## Korak 12 — keširanje i revalidacija

`lib/revalidate.ts` sa po jednom funkcijom za svaku vrstu izmjene. **Admin nikad ne poziva
poništavanje direktno** — pravilo „šta se poništava kad" stoji na jednom mjestu.

**Odstupanje: `updateTag` umjesto `revalidateTag`.** U Next 16 je `revalidateTag(tag, profile)`
dobio drugi argument, a za trenutno poništavanje iz serverskih akcija postoji `updateTag`, koji
uz to daje „vidi svoju izmjenu" semantiku. Obrasci na `/chef` su serverske akcije, pa je to
tačan alat.

**Oznake menija morale su se vezati za lokal.** `unstable_cache` ima statične oznake po omotaču,
pa se `meni:{lokal}` dobija samo tako što se omotač pravi po slugu.

**Provjera na živom serveru:** izmjena cijene direktno u bazi se **ne vidi** dok se oznaka ne
poništi — keš stvarno drži. Poništavanje `meni:trubarjeva` osvježilo je `/meni` na novu cijenu,
a `/seherezada2/meni` je **ostao na staroj** iako je i njegova cijena bila promijenjena u bazi:
izolacija po lokalu radi. Oznaka `jela` osvježava oba. Prebacivanje trećeg lokala na `radi` +
poništavanje `lokali` diglo je sitemap sa 140 na 161 unos **bez ponovne gradnje**.

**Zapaženo:** Next servira staro pa osvježava u pozadini, pa prvi zahtjev poslije poništavanja
još vraća prethodnu vrijednost, a drugi novu. To je očekivano ponašanje, ne greška — ali test
koji to ne uzme u obzir daje lažno negativan rezultat.

---

## Otvoreno

- **`k2c14`** — `data.ts` još uvozi samo `ReviewsKarusel.tsx` (demo recenzije). Zatvara korak 21.
- **QR kod** na stranici recenzija — čeka pravi `google_place_id` (korak 21).
- **Prekidač SL/EN** ne mijenja tekst serverskih sekcija — rješava korak 22.
- **404 bez okvira** — ograničenje Next 16, opisano uz korak 5.
- **Provjere „tvoje oko"** iz koraka 1, 4, 5, 7, 8 i 9 čekaju korisnika.
