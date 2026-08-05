# MASTER — Šeherezada web

Glavni plan. Prati **šta se radi, kojim redom i zašto tim redom**. Kako se radi je u mini-planovima `T01`–`T24`.

**Cilj:** od sadašnjeg Vite SPA sajta do potpuno funkcionalnog Next.js sistema sa više lokala, admin panelom i 7 jezika.
**Demo podaci su prihvatljivi** — prioritet je da sistem radi, ne da su tekstovi i slike konačni.
**SEO se sada ne razmatra** — gledamo samo kako sajt izgleda i kako radi.

---

## Zašto je redoslijed baš ovakav

Pet pravila određuju raspored. Nisu proizvoljna — svako rješava konkretan način na koji ovakav projekat propadne.

**1 · Ugovori prije implementacije**
Prvi pravi zadatak nakon migracije je **domenski model i TS tipovi** (T02), ne rute i ne baza. Sve ostalo uvozi te tipove. Napisati rute prije modela znači pisati ih dvaput.

**2 · Sajt mora raditi prije nego uvedemo bazu**
Faze 0–2 daju **potpuno funkcionalan sajt sa jednim lokalom i podacima iz koda**. Tek onda dolazi baza. Ako se baza uvede ranije, svaki kvar je dvosmislen — je li problem u upitu ili u komponenti. Ovako se otklanja jedno po jedno.

**3 · Baza mijenja jedan fajl**
Zbog pravila 1, prelazak sa `data.ts` na Supabase je zamjena **jedne implementacije repozitorija** (T11). Komponente, rute i admin ne znaju odakle podaci dolaze. Bez toga bi se prepravljalo dvadesetak fajlova.

**4 · Svaki fajl ima jednog vlasnika**
`Navbar.tsx` i `Footer.tsx` u cijelosti pripadaju zadatku **T04**. Nijedan drugi zadatak ih ne prepravlja — prekidač lokala (T19) i jezika (T22) samo **dodaju** komponentu u već stabilizovan okvir. Isto važi za sekcije naslovne: vlasnik je T07, a T20 samo mijenja sadržaj kartica. Tako dva agenta nikad ne diraju isti fajl.

**5 · Čišćenje ide uz vlasnika, ne kao zaseban zadatak**
Nema zadatka „popravi sve". Tri suvišna `<h1>` popravlja onaj ko ionako dira te komponente: logo u T04, dekorativni naslov u T07. Mrtvi fajlovi i favicon idu uz migraciju (T01). Zaseban zadatak za popravke bi se sudarao sa svima.

### Milestone-i

| Nakon | Sajt je |
|---|---|
| **Faze 0** | Next.js radi, izgleda identično kao sada, ništa nije regresiralo |
| **Faze 1** | prave adrese, prava navigacija, 404 i stanja rade |
| **Faze 2** | **potpuno funkcionalan sa jednim lokalom** — sve stranice, sav sadržaj |
| **Faze 3** | vlasnik sam uređuje meni kroz `/chef` |
| **Faze 4** | više lokala, svaki sa svojim cijenama |
| **Faze 5** | sedam jezika |

---

## Kako se koristi

**Jedan agent:** idi redom po registru. Ne kreći na zadatak dok mu preduslovi nisu `✅`.
**Više agenata:** kolona *Paralelno sa* kaže šta se smije raditi uporedo — ti zadaci ne dijele nijedan fajl.
**Nakon zadatka:** upiši stanje u registar i prođi *Verifikaciju* iz mini-plana.

Stanja: `☐` nije početo · `🔄` u toku · `✅` gotovo · `⛔` blokirano

---

## Tvrda pravila — važe za svaki zadatak

1. **Vizualni dizajn se ne mijenja.** Nijedna nova boja, font, oblik, razmak ni animacija.
2. **Tekst mora biti u serverskom HTML-u.** `'use client'` samo gdje postoji stvarna interaktivnost.
3. **Navigacija su pravi linkovi**, nikad `onClick` + programsko preusmjeravanje.
4. **URL je jedini izvor istine** za jezik i lokal. Ništa se ne renderuje na osnovu kolačića.
5. **Nema automatskog preusmjeravanja** po IP-u, geolokaciji ili jeziku pregledika.
6. **Tačno jedan `<h1>` po stranici.**
7. **Cijene su tekst**, nikad dio slike.
8. **Javne adrese se ne mijenjaju** nakon što su postavljene.

### Dizajn tokeni

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
animacija   framer-motion: opacity 0→1, y 20→0, kaskadno 0.1s
tema        dark podrazumijevano (class strategija)
```

---

## Registar zadataka

### Faza 0 — Temelj *(ništa se ne mijenja za posjetioca)*

| # | Zadatak | Vlasnik fajlova | Preduslov | Paralelno | Stanje |
|---|---|---|---|---|---|
| **T01** | [Migracija na Next.js](T01-migracija-nextjs.md) | konfiguracija, `app/layout.tsx`, brisanje mrtvog koda, `index.html` → metadata | — | — | ☐ |
| **T02** | [Domenski model i ugovori](T02-domenski-model.md) | `lib/domain.ts`, `lib/repo.ts`, `lib/i18n.ts` | T01 | — | ☐ |

> T02 je najvažniji zadatak u projektu. Definiše tipove i potpise repozitorija **koji od prvog dana podržavaju više lokala i 7 jezika**, iako je implementacija za sada nad `data.ts`.

### Faza 1 — Rute i okvir *(prave adrese)*

| # | Zadatak | Vlasnik fajlova | Preduslov | Paralelno | Stanje |
|---|---|---|---|---|---|
| **T03** | [Rute i resolver](T03-rute-resolver.md) | `lib/route.ts`, `app/[[...slug]]/page.tsx` | T02 | — | ☐ |
| **T04** | [Okvir: navbar i podnožje](T04-okvir-navigacija.md) | `Navbar.tsx`, `Footer.tsx`, `MobileCTA.tsx` | T03 | T05 | ☐ |
| **T05** | [Stanja: učitavanje, greška, 404](T05-stanja-greske.md) | `loading.tsx`, `error.tsx`, `not-found.tsx` | T03 | T04 | ☐ |
| **T06** | [Metapodaci, sitemap, robots](T06-meta-sitemap.md) | `generateMetadata`, `sitemap.ts`, `robots.ts` | T03 | T04, T05 | ☐ |

### Faza 2 — Stranice *(sajt potpuno radi, jedan lokal)*

| # | Zadatak | Vlasnik fajlova | Preduslov | Paralelno | Stanje |
|---|---|---|---|---|---|
| **T07** | [Naslovna: sve sekcije](T07-naslovna.md) | `Hero.tsx`, `AboutUs.tsx`, `PopularPicks.tsx`, `Reviews.tsx`, nove sekcije | T04 | T08, T09 | ☐ |
| **T08** | [Stranica menija](T08-stranica-meni.md) | `Menu.tsx`, `ProductCard.tsx`, `ProductModal.tsx` | T04 | T07, T09 | ☐ |
| **T09** | [Zajedničke i SEO stranice](T09-stranice-ostalo.md) | `app/**/o-nas` i ostalo | T04 | T07, T08 | ☐ |

> **Milestone.** Nakon Faze 2 sajt je potpuno funkcionalan sa jednim lokalom i podacima iz koda.

### Faza 3 — Baza i admin *(vlasnik uređuje sam)*

| # | Zadatak | Vlasnik fajlova | Preduslov | Paralelno | Stanje |
|---|---|---|---|---|---|
| **T10** | [Baza: šema i migracije](T10-baza-sema.md) | `supabase/migrations/` | T02 | T07–T09 | ☐ |
| **T11** | [Repozitorij nad bazom + seed](T11-repo-baza-seed.md) | `lib/repo.supabase.ts`, `scripts/seed.ts` | T10 | — | ☐ |
| **T12** | [Keširanje i revalidacija](T12-kesiranje.md) | oznake keša u repo sloju | T11 | T13 | ☐ |
| **T13** | [Prijava i zaštita `/chef`](T13-prijava-zastita.md) | `app/chef/layout.tsx`, middleware | T11 | T12 | ☐ |
| **T14** | [`/chef`: lokali](T14-chef-lokali.md) | `app/chef/lokali/` | T13 | T15 | ☐ |
| **T15** | [`/chef`: jela i katalog](T15-chef-jela.md) | `app/chef/jela/` | T13 | T14 | ☐ |
| **T16** | [`/chef`: meni lokala i cijene](T16-chef-meni-cijene.md) | `app/chef/meni/` | T14, T15 | T17 | ☐ |
| **T17** | [Slike: otpremanje i obrada](T17-slike.md) | `lib/slike.ts`, komponenta za otpremanje | T13 | T16 | ☐ |

### Faza 4 — Više lokala

| # | Zadatak | Vlasnik fajlova | Preduslov | Paralelno | Stanje |
|---|---|---|---|---|---|
| **T18** | [Dinamički lokali u rutama](T18-dinamicki-lokali.md) | `lib/route.ts`, `generateStaticParams` | T12, T14 | — | ☐ |
| **T19** | [Prekidač lokala](T19-prekidac-lokala.md) | nova komponenta, dodaje se u okvir iz T04 | T18 | T20, T21 | ☐ |
| **T20** | [Kartice lokala na naslovnoj](T20-kartice-lokala.md) | sekcija 2 iz T07 | T18 | T19, T21 | ☐ |
| **T21** | [Recenzije preko Places API](T21-recenzije-api.md) | `lib/places.ts` | T18 | T19, T20 | ☐ |

### Faza 5 — Jezici

| # | Zadatak | Vlasnik fajlova | Preduslov | Paralelno | Stanje |
|---|---|---|---|---|---|
| **T22** | [Jezički sloj i prekidač](T22-jezici.md) | `lib/i18n.ts`, prekidač u okviru | T19 | — | ☐ |
| **T23** | [Arapski i RTL](T23-rtl-arapski.md) | `index.css`, layout | T22 | — | ☐ |

### Poprečno

| # | Zadatak | Preduslov | Stanje |
|---|---|---|---|
| **T24** | [Okruženje i objavljivanje](T24-okruzenje-deploy.md) | T01 | ☐ |

---

## Redoslijed za jednog agenta

```
Faza 0    T01 → T02
Faza 1    T03 → T04 → T05 → T06
Faza 2    T07 → T08 → T09          ← sajt potpuno radi
Faza 3    T10 → T11 → T12 → T13 → T14 → T15 → T16 → T17
Faza 4    T18 → T19 → T20 → T21
Faza 5    T22 → T23
kad god   T24
```

## Podjela za tri agenta

Zadaci u istom redu ne dijele nijedan fajl.

| Talas | Agent A — jezgro | Agent B — admin | Agent C — prikaz |
|---|---|---|---|
| 1 | T01 → T02 | *čeka* | *čeka* |
| 2 | T03 | T10 *(samo SQL, ne zavisi od ruta)* | *čeka T03* |
| 3 | T04 | T10 | T05 · T06 |
| 4 | T11 → T12 | — | T07 · T08 · T09 |
| 5 | T18 | T13 → T14 → T15 → T16 → T17 | T24 |
| 6 | T19 | — | T20 · T21 |
| 7 | T22 → T23 | — | — |

Agent B može pisati SQL šemu (T10) čim je model iz T02 gotov — ne treba čekati rute.

---

## Ciljna struktura adresa

```
seherezada.net / [jezik] / [lokal] / [stranica]
                  ↑ sl bez prefiksa   ↑ glavni lokal bez prefiksa
```

| Javna adresa | Razrješava se u |
|---|---|
| `/` | sl · glavni lokal · naslovna |
| `/meni` | sl · glavni lokal · meni |
| `/seherezada2/meni` | sl · lokal `seherezada2` · meni |
| `/o-nas` | sl · zajednička |
| `/kebab-ljubljana` | sl · SEO |
| `/en/seherezada2/meni` | en · lokal · meni |

Puna pravila razrješavanja: **T03**.

---

## Stanje projekta

| | |
|---|---|
| Stack sada | React 19 · Vite 8 · TS · Tailwind 3 · framer-motion · GSAP · lucide-react |
| Stack cilj | Next.js App Router · isti Tailwind i biblioteke · Supabase |
| Lokali | 2 rade + 1 uskoro |
| Jezici | sl, en sada → 7 na kraju |
| Jela | 23 u `src/data.ts`, 8 kategorija |

### Demo podaci

```
LOKAL 1 (glavni)   slug: trubarjeva
  Šeherezada · Trubarjeva cesta 31, 1000 Ljubljana · +386 69 444 812
  Pon–Čet 09:00–02:00 · Pet–Sob 09:00–05:00 · Ned 10:00–05:00

LOKAL 2            slug: seherezada2
  Šeherezada 2 · Slovenska cesta 55, 1000 Ljubljana · +386 64 183 155
  Pon–Pet 08:00–23:59 · Sub–Ned 09:00–23:59
  cijene: kao lokal 1 +0,50 €

LOKAL 3            stanje: uskoro (bez podataka)
```

Slike ostaju postojeće dok ne stignu prave.

---

## Kontrolna lista prije zatvaranja projekta

- [ ] `view-source:` pokazuje sav tekst i sve cijene na svakoj ruti
- [ ] Sajt upotrebljiv sa isključenim JavaScriptom
- [ ] Tačno jedan `<h1>` po stranici
- [ ] Sve stavke navigacije su pravi linkovi
- [ ] Prekidači lokala i jezika ne vraćaju na naslovnu
- [ ] Nema auto-preusmjeravanja po jeziku ni lokaciji
- [ ] `/chef` zaključan i van sitemapa
- [ ] Novi lokal iz `/chef` sam stvara rute
- [ ] Promjena cijene vidljiva ≤20 s bez rebuilda
- [ ] Nijedna nova boja, font, oblik ni animacija
- [ ] Radi na 390 px prije nego na desktopu
- [ ] `npm run build` bez grešaka i TS upozorenja
