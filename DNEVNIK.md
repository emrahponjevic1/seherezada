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

## Korak 13 — prijava i zaštita /chef

Plan je računao na Supabase Auth. Bez njega je prijava napisana od nule.

**Lozinke** — `scrypt` iz `node:crypto`, sa vlastitom soli po korisniku, zapis
`scrypt$<sol>$<heš>`. Poređenje ide kroz `timingSafeEqual`, jer obično `===` odaje koliko se
znakova poklopilo. Kad e-mail ne postoji, heš se **svejedno računa** — inače trajanje odgovora
odaje koji nalozi postoje.

**Sesija** — potpisan kolačić, bez tabele sesija. Nosi `{id, email, exp}` i HMAC potpis.
Namjerno koristi **Web Crypto, ne `node:crypto`**, jer isti kod mora raditi i u `proxy.ts`
koji se izvršava na Edge okruženju.

**Odstupanje: `middleware.ts` → `proxy.ts`.** Next 16 je konvenciju preimenovao i na
`middleware` javlja upozorenje o zastarjelosti.

**Prijava je izvan zaštićene grupe ruta.** `app/chef/(zasticeno)/` traži sesiju, a
`app/chef/prijava/` je van te grupe — da nije, i prijava bi tražila prijavu i nastao bi krug
bez izlaza.

**Nalozi se prave naredbom**, `npm run korisnik -- <email> <lozinka> [ime]`. Registracije kroz
sučelje namjerno nema. To je ujedno i način da se promijeni zaboravljena lozinka — bez
Supabasea nema slanja e-pošte, pa je link „Pozabljeno geslo" zamijenjen napomenom.

**Odstupanje: admin nije primoran na svijetlu temu kroz `dark:` varijante** nego kroz izričite
boje (`bg-zinc-50 text-zinc-900`). Klasa teme stoji na `<html>` u korijenskom okviru i odatle
se ne može poništiti.

**Provjera:** sve pod `/chef/*` bez sesije vraća 307 na prijavu, uz sačuvan `next`; prijava
ostaje dostupna; važeća sesija otvara `/chef` i prikazuje e-mail i dugme Odjava; **pokvaren
potpis, izmijenjen sadržaj sa tuđim potpisom i istekla sesija — sve troje odbijeno**; lozinka
u bazi nije u čistom tekstu, tačna prolazi a pogrešna i prazna ne; `noindex, nofollow` na
stranici; robots zabranjuje `/chef`, sitemap ga ne sadrži; **nijedna tajna se ne pojavljuje u
`.next/static`** (provjereno osam uzoraka).

---

## Korak 14 — /chef → lokali

Prvi ekran na kojem vlasnik stvarno radi i prvi koji piše u bazu.

`lib/chef/upiti.ts` čita **bez keša** — admin mora vidjeti trenutno stanje, ne ono od prije
poništavanja. Javni sajt i dalje čita kroz keširani `repo`.

Svaka akcija radi tri stvari istim redom: provjeri sesiju, provjeri podatke **na serveru**,
poništi keš kroz `lib/revalidate.ts`.

**Promjena sluga upisuje preusmjerenje** i uz to prepisuje postojeći lanac
(`update preusmjerenja set novi_slug=... where novi_slug=stari`), da stara adresa ne pokazuje
na međukorak koji više ne postoji.

**Zamjena glavnog lokala ide u jednoj transakciji** — baza dozvoljava tačno jedan glavni, pa bi
međustanje sa dva palo. Novi glavni od tada živi na „/", pa njegov stari slug preusmjerava, a
stari glavni dobija svoj slug natrag i njegovo preusmjerenje se briše.

**Odstupanje: povuci-i-pusti za redoslijed zamijenjen je strelicama gore/dolje.** Ista funkcija,
bez nove biblioteke. Redoslijed se pritom prepisuje po položaju, jer vrijednosti u bazi mogu
imati rupe pa zamjena samo dva broja nije pouzdana.

**Nađeno usput i popravljeno:** `updateTag` radi samo iz serverskih akcija. Da se ove funkcije
ikad pozovu odnekud drugdje, poziv bi puknuo **poslije uspješnog upisa** — podaci snimljeni, a
korisnik vidi grešku. Zato `lib/revalidate.ts` sad pada na `revalidateTag` kad `updateTag` nije
dostupan. Poništavanje keša ne smije oboriti upis koji je već prošao.

**Provjera:** 15 tvrdnji kroz stvarne pozive akcija — slug `meni` i `Bežigrad` odbijeni, postojeći
slug odbijen, snimanje bez uvodnog teksta odbijeno, nov lokal nije glavni, kopiranje prenijelo
**23 jela** i nastalo u stanju `uskoro` **bez** Wolta, Glova, Place ID-a i uvodnog teksta, promjena
sluga upisala preusmjerenje, **glavni lokal se ne može sakriti**, zamjena glavnog ostavlja tačno
jedan i upisuje preusmjerenje. Uz to: nov lokal `radi` digao sitemap sa 140 na 161 unos i sve tri
njegove adrese vraćaju 200 — **bez ponovne gradnje**.

---

## Korak 15 — /chef → jela i katalog

**Katalog je odvojen od cijena, i to je cijela poenta koraka.** Jelo postoji jednom: jedan opis,
jedna slika, jedan spisak alergena, jedan prijevod. Isto jelo se prodaje u više lokala po
različitim cijenama, a cijena pripada vezi lokal↔jelo. Zato na ovim ekranima **nema nijednog
polja za cijenu** — da ga ima, isto jelo bi se unosilo onoliko puta koliko ima lokala.

**Oznake se čitaju iz podatka, ne iz kategorije** — `halal` je podrazumijevano uključen jer je
to podatak, a ne pretpostavka izvedena iz toga u kojoj je kategoriji jelo.

Prevodiva polja imaju karticu po jeziku, sa **sivom tačkom** za jezik bez prijevoda i arapskim
zdesna nalijevo. Sva polja su **uvijek u dokumentu**, samo skrivena — inače bi se pri snimanju
slali samo oni jezici koji su bili otvoreni.

**Naišao sam na pravilo koje se lako promaši:** modul sa `"use server"` smije izvoziti **samo
async funkcije**. Konstanta `ALERGENI` je zbog toga preseljena u `provjere.ts`; dok je bila u
`jela.ts`, build je padao sa „Failed to collect page data".

**Odstupanje:** povuci-i-pusti za redoslijed kategorija zamijenjen strelicama, isto kao kod lokala.

**Provjera:** 11 tvrdnji kroz stvarne pozive akcija — snimanje bez slovenskog naziva odbijeno,
postojeći slug odbijen, novo jelo se pojavi u katalogu ali **ni u jednom meniju**, izmjena opisa
vrijedi u **oba** lokala, kopija dobija „(kopija)" i nije ni u jednom meniju, deaktivirano jelo
nestaje iz **oba** menija, brisanje kategorije sa jelima odbijeno **uz broj jela**, prazna
kategorija se briše. Uz to provjereno da na ekranima jela i kategorija **nema nijednog polja za
cijenu** — jedina tri pogotka na „cijenu" su rečenice koje objašnjavaju zašto ga nema.

---

## Korak 16 — /chef → meni lokala i cijene

Ovdje se spajaju lokali i katalog. Sve dosad je bilo pripremanje — ovo je ekran na kojem vlasnik
radi svaki dan.

**Novi lokal počinje praznog menija.** Katalog je biblioteka, meni je izbor iz nje. Zato
dodavanje traži cijenu odmah: jelo bez cijene u meniju nema smisla.

**Cijena se uređuje u samom redu**, bez otvaranja jela, i snima pri izlasku iz polja. Polje
pokazuje stanje — *shranjujem / shranjeno / napaka*. Kad snimanje ne uspije, polje se **vraća na
staru vrijednost**; inače bi u njemu ostao broj koji u bazi ne postoji, a vlasnik bi mislio da je
snimljen.

Tri radnje se lako pobrkaju, pa svaka ima svoj opis pri prelasku mišem:
- **skrito** — privremeno sakriveno sa sajta, red i cijena ostaju
- **izpostavljeno** — jelo ulazi u „Priljubljene izbire" na naslovnoj
- **Odstrani** — briše red iz `lokal_jela`; **jelo ostaje u katalogu**

**Zbirna tabela `/chef/cijene`** pokazuje sva jela × sve lokale. `—` znači da jelo nije u meniju
tog lokala — to je podatak, ne greška, i klik nudi dodavanje. „Uporabi" mijenja cijenu **samo tamo
gdje jelo već postoji**, nikad je ne dodaje.

**Prečica koja štedi sate:** pri dodavanju iz kataloga postoji „Predlagaj cene iz…", koja prepiše
cijene odabranog lokala u polja, pa se dotjeraju. Otvaranje novog lokala tako traje minute.

**Već pokriveno ranije:** radno vrijeme i izuzeci po datumu su u obrascu lokala (korak 14), a
prednost izuzetka nad redovnim vremenom dokazana je u koraku 2 (`k2c10`).

**Provjera:** 17 tvrdnji kroz stvarne pozive akcija — nov lokal ima prazan meni a katalog nudi
svih 23 jela; `7,25` i `8.75` se **oboje** prihvataju; isto jelo se ne može dodati dvaput i
postojeća cijena se ne prepisuje; negativna cijena i tekst odbijeni **uz vraćanje stare
vrijednosti**; izmjena u jednom lokalu **ne dira** drugi; isključeno `dostupno` sakriva sa sajta
a red ostaje; `izdvojeno` stavlja jelo u izdvojena; „primijeni na sve" mijenja red svugdje gdje
jelo postoji; jelo van menija ima `null`; **Ukloni** briše iz menija a jelo ostaje u katalogu.

---

## Korak 17 — slike

**Odstupanje: slike idu na disk, ne u Supabase Storage** — kao i baza, vodimo ih sami.

Stoje u `podaci/slike/`, **izvan `public/`**. Razlog: `public/` se kopira pri gradnji, pa se
datoteke dodane kasnije ne bi vidjele u samostalnoj gradnji. Poslužuje ih `/api/slike/[...put]`,
sa kratkim kešom jer nova slika prepisuje staru pod istim imenom.

Server obrađuje, ne preglednik: obreže na 4:3, napravi tri veličine u WebP-u i **spušta kvalitet
dok svaka ne stane ispod 300 KB**. `sharp(...).rotate()` poštuje EXIF orijentaciju, inače bi
fotografije sa telefona stizale okrenute.

**Tip se čita iz zaglavlja, ne iz nastavka imena.** Nastavak laže — PDF preimenovan u `.jpg`
prošao bi provjeru po imenu. Isto vrijedi za ime mape: izvodi se iz sluga i provjerava obrascem,
inače bi `..` u imenu vodilo pisanje izvan predviđene mape.

`<SlikaJela>` dobija `srcset` samo za naše slike; vanjske zastupne fotografije nemaju varijante
pa idu kakve jesu.

**`rotisserie_hero.png` → WebP: 899 KB → 158 KB, 82% manje.** Plan traži PNG kao rezervu kroz
`<picture>`; umjesto toga je PNG zadržan na disku a korištenja prebačena na `.webp`. WebP podržava
svaki preglednik u upotrebi od 2020, pa bi rezervni `<source>` bio dodatna oznaka bez ijednog
stvarnog korisnika.

**Provjera:** velika fotografija daje tri veličine, **sve ispod 300 KB**; premala slika (200×150)
odbijena; **PDF preimenovan u `.jpg` odbijen na serveru**; otpremanje bez prijave vraća 401;
slike se poslužuju kao `image/webp`, nepostojeća daje 404, a `..` u putanji ne izlazi iz mape;
nova slika istog jela **prepisuje staru** i broj datoteka ostaje tri.

---

## Korak 18 — dinamički lokali u rutama

Mali korak, jer je korak 3 urađen kako je propisano: `resolveRoute` već prima slugove kao
argumente, `generateStaticParams` već čita iz `repo`, a `dynamicParams` je uključen od početka.

Dodano je jedino **čitanje tabele preusmjerenja**. Ona se gleda **tek kad obično razrješavanje da
404** — tako se za svaku ispravnu adresu ne ide u bazu bez potrebe. Novi slug se zatim razrješava
ponovo, pa ako je u međuvremenu postao glavni lokal, adresa vodi na „/" a ne na međukorak.

**Naišao sam na nešto što bi u radu lako zbunilo:** Next **keširа i 404 odgovore**. Ako neko
posjeti adresu prije nego preusmjerenje postoji, zapamćeni 404 se servira i poslije upisa u bazu.
Kroz `/chef` se to ne dešava — `spremiLokal` poziva `revalidirajSkupLokala()`, koja poništava
oznaku `preusmjerenja`. Problem nastaje samo pri upisu direktno u bazu, kao u mom prvom testu.

**Provjera:** preusmjerenje radi za naslovnu, `/meni` i `/recenzije`, i **čuva jezički prefiks**
(`/en/stara/meni` → `/en/seherezada2/meni`), sve sa statusom **308**; lokal `uskoro` i nepostojeći
slug daju 404 i nisu u sitemapu; postojeći lokali rade; slug `meni` odbijen u bazi uz jasnu
poruku, a u obrascu i resolveru dokazano ranije (`k14c4`, `k3c2`).

**`k18c11`:** jedini ukucani slug lokala u cijelom kodu je `samoLokal: "trubarjeva"` u
`sadrzajSeo.ts`, i to je namjerno — plan izričito traži da `/nocna-hrana-ljubljana` upućuje na
lokal 1, jer Slovenska zatvara u 23:59.

---

## Korak 19 — prekidač lokala

Aditivan korak: korak 4 je stabilizovao `Navbar.tsx` i ostavio dva označena mjesta, pa se ovdje
samo ubacila gotova komponenta. Struktura navbara nije prepravljana.

**Prekidač navigira, ne mijenja stanje.** Adresa se gradi isključivo funkcijom `href()` — nikad
ručnim spajanjem segmenata. Gost ostaje na **istoj vrsti stranice**: sa `/meni` ide na
`/seherezada2/meni`, ne na naslovnu. Vraćanje na naslovnu pri promjeni je najčešći razlog zbog
kojeg ljudi napuste sajt.

Na zajedničkim stranicama lokala nema u adresi, pa prekidač ne navigira nego samo zapamti izbor
u kolačiću i osvježi stranicu.

**Kolačić `shere-lokal` nikad ne preusmjerava** i ne mijenja šta se renderuje na stranicama koje
imaju lokal u adresi. Postavlja se i pri odabiru i pri otvaranju bilo koje stranice lokala —
tako je zapamćen i lokal koji je gost otvorio direktno preko adrese.

**Provjera:** prekidač je u izvornom HTML-u; u komponenti **nema nijednog ručnog spajanja
adrese**, a `href()` se poziva tri puta; lokal `uskoro` je onemogućen; `/meni` sa kolačićem
`seherezada2` i dalje vraća **200 i prikazuje Trubarjevu** — kolačić stvarno ne preusmjerava.

---

## Korak 20 — kartice lokala na naslovnoj

Dopuna, ne nov korak: komponenta i sekcija postoje od koraka 7. Ovdje je dodano ono što bez baze
i više lokala nije imalo smisla — geolokacija.

**Tri pravila oko „Poišči najbližjega", i sva tri se lako prekrše:**

1. **Lokacija se traži samo na klik.** Nikad pri otvaranju stranice — traka sa dozvolom odmah pri
   učitavanju tjera posjetioce. U `GeoNajblizi` zato **nema nijednog `useEffect`**.
2. **Nema preusmjeravanja.** Rezultat je isticanje najbližeg i udaljenost; **poredak kartica se
   ne mijenja**. Gost i dalje bira sam.
3. **Odbijanje dozvole nije greška.** Dugme se vrati u početno stanje, bez poruke.

Udaljenost je zračna linija iz koordinata — dovoljno za „koji mi je bliži", bez vanjskog servisa.
Lokacija se koristi i odbacuje, nigdje se ne pamti.

**Popravljeno usput:** „Navodila" je prije bio ugniježđen unutar linka kartice. Ugniježđeni `<a>`
nije dozvoljen i preglednici ga razdvoje na nepredvidiv način. Sad je kartica link na lokal, a
„Navodila" zaseban link na Google Maps **sa tačnim koordinatama**.

**Provjera:** nazivi, adrese i radno vrijeme svih lokala u izvornom HTML-u; „Navodila" vodi na
`maps.google.com/?q=46.0533,14.5122`; lokal `uskoro` ima oznaku *Kmalu* i **nula linkova**;
u `GeoNajblizi` nema `useEffect`, a `getCurrentPosition` se poziva **samo iz rukovaoca klika**.

---

## Otvoreno

- **`k2c14`** — `data.ts` još uvozi samo `ReviewsKarusel.tsx` (demo recenzije). Zatvara korak 21.
- **QR kod** na stranici recenzija — čeka pravi `google_place_id` (korak 21).
- **Prekidač SL/EN** ne mijenja tekst serverskih sekcija — rješava korak 22.
- **404 bez okvira** — ograničenje Next 16, opisano uz korak 5.
- **Provjere „tvoje oko"** iz koraka 1, 4, 5, 7, 8 i 9 čekaju korisnika.
