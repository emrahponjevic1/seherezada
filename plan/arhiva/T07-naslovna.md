# T07 · Naslovna — sve sekcije

**Faza:** 2 · **Preduslov:** T04 · **Paralelno sa:** T08, T09
**Vlasnik fajlova:** `Hero.tsx` · `AboutUs.tsx` · `PopularPicks.tsx` · `Reviews.tsx` · `components/sekcije/Halal.tsx` · `components/sekcije/FaqIzvod.tsx` · `components/sekcije/KarticeLokala.tsx`

---

## Cilj

Naslovna ima svih **devet sekcija**, čita podatke iz `repo`, i **tekst joj je u serverskom HTML-u**.

## Zašto je ovo najosjetljiviji zadatak

`Hero` i `AboutUs` su prepuni framer-motion i GSAP-a. Ako ostanu klijentske u cijelosti, tekst ne stiže u HTML — što poništava cijelu migraciju. Ovdje se **animirani omotač odvaja od teksta**.

---

## Redoslijed sekcija

| # | Sekcija | Stanje | Prati lokal |
|---|---|---|---|
| 1 | Hero | postoji | da — radno vrijeme, telefon |
| 2 | Kartice lokala | postoje 3 kartice, novi sadržaj | da |
| 3 | Priljubljene izbire | postoji | da — cijene |
| 4 | Naša zgodba → *Preberi več* | skraćuje se | ne |
| 5 | Naš meni → *Poglej cel meni* | postoji | da |
| 6 | **Halal** → *Preberi več* | **novo** | ne |
| 7 | Recenzije → *Vse recenzije* | postoji, + naslov | da |
| 8 | **Pogosta vprašanja** | **novo** | djelimično |
| 9 | Podnožje | T04 | da |

---

## Šta se radi

### 1 · Odvajanje animacije od teksta *(najvažnije)*

Obrazac za `Hero` i `AboutUs`:

```
Sekcija.tsx            server — sav tekst, naslovi, cijene, linkovi
  └ Animacija.tsx      'use client' — omotač koji prima {children}
```

Klijentska komponenta drži `motion.div`, GSAP i praćenje miša; **djeca su serverski HTML**. Tekst tako stiže u izvorni kod, a animacije rade isto.

Primjenjuje se na: naslov heroja, opis, traku kartica, parallax u `AboutUs`.

**Ostaje klijentsko u cjelini** *(stvarna interaktivnost)*: 3D naginjanje tanjira za mišem, kružeće emoji značke, karusel recenzija, accordion pitanja.

### 2 · Sekcija 1 — Hero

| Šta | Kako |
|---|---|
| Crveni red pod naslovom | `Kebab · Pizza · Falafel` → **`Halal kebab in fast food v Ljubljani`**. Isto mjesto, veličina, boja, font |
| Značka „Odprto zdaj" | Sada ukucano `09:00 - 05:00` — koristiti `jeOtvoren()` i `formatRadnoVrijeme()` iz T02 nad **trenutnim lokalom** |
| Dugme telefon | Broj iz `repo`, ne ukucan |
| Dugme „Prikaži meni" | `href()` na meni trenutnog lokala, ne `#menu` |
| Ocjena 4,5 / 1.914 | Iz podataka lokala. Dok T21 ne poveže API — iz demo podataka |
| Traka od 3 kartice pri dnu | **Uklanja se odavde** — postaje sekcija 2 |
| `<h1>` | Ostaje ovdje. Ovo je **jedini** `<h1>` na stranici |

### 3 · Sekcija 2 — Kartice lokala

Nova komponenta `KarticeLokala.tsx`, ali **preuzima izgled postojeće trake** iz `Hero.tsx:300-335`: ikona u crvenoj, podebljan naslov, siva rečenica ispod.

Po lokalu iz `repo.getLokali()`:
```
📍  Šeherezada {ulica}
    {adresa}
    {radno vrijeme danas}  ·  {zelena tačka ako je otvoreno}
    Navodila →              ← link na Google Maps
```

- Trenutni lokal je **istaknut** *(crveni rub, kao aktivna pilula u navbaru)*
- Lokal `uskoro` → kartica sa oznakom **Kmalu**, bez linka
- Broj kartica prati bazu — raspored `grid` koji podnosi 2, 3 i 4
- Dugme **Poišči najbližjega** ispod kartica — dio je T20, ovdje ostaviti mjesto i komentar

### 4 · Sekcija 3 — Priljubljene izbire

Podaci iz `repo.getIzdvojena(lokalSlug)` umjesto `menuItems.filter(popular)`. Cijene kroz `formatCijena()`. Izgled nepromijenjen.

### 5 · Sekcija 4 — Naša zgodba

- Tekst se skraćuje na **3–4 rečenice**
- Dodaje se dugme **Preberi več** → `/o-nas`
- **Dekorativni natpis „TRADICIJA & KVALITETA" prestaje biti `<h1>`** (`AboutUs.tsx:62`) → `<div>` sa istim klasama
- Postojeći tekst je bosanski (`AboutUs.tsx:112`) — prevesti na slovenski
- Parallax i GSAP ostaju, po obrascu iz koraka 1

### 6 · Sekcija 5 — Naš meni

Ostaje na naslovnoj u sadašnjem obliku. Dodaje se dugme **Poglej cel meni** → meni lokala.
Sama komponenta `Menu.tsx` je vlasništvo **T08** — ovdje se samo ugrađuje.

### 7 · Sekcija 6 — Halal *(novo)*

Raspored **identičan sekciji „Naša zgodba"**: slika s jedne strane, tekst s druge.
- `<h2>` u stilu `PopularPicks` — `text-4xl md:text-5xl font-black font-poppins`
- 3–4 rečenice: odakle meso, priprema, bez svinjetine i alkohola *(demo tekst prihvatljiv)*
- Crveno dugme **Preberi več** → `/halal`
- Slika: postojeća iz `public/`

Serverska komponenta — nema interaktivnosti.

### 8 · Sekcija 7 — Recenzije

- **Dodaje se `<h2>`** — sada ga uopšte nema
- Ispod karusela link **Vse recenzije** → recenzije lokala
- Karusel ostaje klijentski, nepromijenjen

### 9 · Sekcija 8 — Pogosta vprašanja *(novo)*

Četiri pitanja, accordion. Svako je pločica `rounded-2xl border border-white/10` u postojećem stilu.

```
Je meso res halal?
Do kdaj ste odprti?          ← odgovor iz radnog vremena trenutnog lokala
Imate vegetarijansko?
Dostavljate?
```

Ispod link **Vsa vprašanja** → `/faq`.
Accordion je klijentski, ali **sva pitanja i odgovori moraju biti u HTML-u** *(sakriveni CSS-om, ne izostavljeni)*.

---

## Ne raditi u ovom zadatku

- Ne dirati `Navbar` ni `Footer` — T04
- Ne dirati unutrašnjost `Menu.tsx`, `ProductCard`, `ProductModal` — T08
- Ne pisati stranice `/o-nas`, `/halal`, `/faq` — T09
- Ne dodavati geolokaciju — T20
- Ne povezivati Places API — T21

---

## Verifikacija

- [ ] `view-source:` na `/` sadrži: naslov heroja, sve adrese lokala, nazive i **cijene** izdvojenih jela, tekst halal sekcije, **sva četiri pitanja i odgovora**
- [ ] Stranica ima **tačno jedan `<h1>`** — u heroju
- [ ] Redoslijed naslova je H1 → H2 bez preskakanja
- [ ] Značka „Odprto zdaj" tačna za lokal 1 u subotu u 03:00 → **da**
- [ ] Značka tačna za lokal 2 u subotu u 03:00 → **ne**
- [ ] Telefon u heroju i mobilnoj traci je broj **trenutnog** lokala
- [ ] Sve kartice lokala prikazane; trenutni istaknut; `uskoro` bez linka
- [ ] Sva dugmad „Preberi več" i „Poglej cel meni" vode na postojeće adrese
- [ ] Sa isključenim JavaScriptom: sav tekst čitljiv, accordion pitanja vidljiva
- [ ] Animacije rade isto kao prije *(hero, parallax, karusel)*
- [ ] Izgled identičan na desktopu i 390 px, osim namjerno dodanih sekcija
- [ ] Nijedna nova boja, font ni oblik

## Gotovo kad

Devet sekcija radi, tekst je u izvornom kodu, jedan `<h1>`, podaci iz repozitorija, animacije nepromijenjene.
