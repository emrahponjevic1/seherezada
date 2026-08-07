# PLAN 2 — od koraka 24 do objave

Nastavak `ZAVRSNI-PLAN.html`. Koraci 1–23 su gotovi; ovaj dokument pokriva
ostatak i **ispravlja tri rupe** koje ZAVRŠNI plan nije imao kao korake:
strukturirane podatke, brzinu i mjerenje.

Ista pravila i dalje važe — svih deset iz §4 ZAVRŠNOG plana. Isti ritual
poslije koraka: `npm run build` → pogled na 390 px → lista provjere → jedan
commit po koraku.

---

## Gdje smo

| | |
|---|---|
| Gotovo | koraci 1–20, 22, 23, **24, 25** |
| **Preskočeno** | **korak 21 — recenzije** (nema commita); radi se kao korak 26 |
| Sljedeće | korak 26 — recenzije bez obaveznog troška |
| Stack | Next 16 · React 19 · Tailwind 3 · **čisti PostgreSQL** (`pg`), ne Supabase |
| Prijava | vlastita (`lib/auth.ts`, `lib/sesija.ts`) |
| Slike | vlastita obrada (`sharp`), `podaci/slike/` + `/api/slike` |
| Gradnja | 145 statičkih stranica, bez grešaka |
| Lokali | 2 rade + 1 „uskoro"; broj **raste** — ništa se ne smije ukucati |

### Odstupanja od plana koja su se pokazala ispravnim

Supabase je zamijenjen sa tri vlastita rješenja i to je **bolje** nego što je
plan tražio: nema vanjske zavisnosti, nema mjesečnog troška, podaci su kod
nas. Ono što se izgubilo, a mora se nadoknaditi u koraku 27:

- **RLS ne postoji.** Zaštitu drži samo aplikacija. Ako negdje procuri upit
  bez provjere sesije, nema drugog sloja koji hvata.
- **Automatske sigurnosne kopije ne postoje.** Supabase ih je imao ugrađene.
- **Oporavak lozinke ne postoji** — nema servisa koji šalje e-mail.

---

## Odluke koje su pale

| Odluka | Rezultat |
|---|---|
| Recenzije | Google **samo ako je besplatno**; inače ručni unos. Rješava korak 26 — radi u oba slučaja |
| Navigacija | Naslovna · Meni · Galerija · O nama ▾ · Blog ▾ · Kontakt |
| SEO stranice | Idu **pod „Blog"**, ali adrese ostaju u korijenu. Dodaje se `/doner-ljubljana` — `burger-ljubljana` **ostaje** |
| Naslovna | 7 sekcija + lokali/podnožje; „Priljubljene izbire" i „Meni" postaju **vodoravni karuseli** |
| Kartice lokala | Sele sa pozicije 2 dolje, uz podnožje |
| Jezici | Ostaje `{kod:'bs', prefiks:'ba'}` — **već je tačno u kodu**, ne dira se |

### Dvije nove stranice

`/kontakt` i `/blog` ne postoje. Obje su `SHARED_PAGES`, pa ih sitemap i
`hreflang` pokupe sami — ali **traže migraciju baze**, jer triger za
rezervisane slugove ima svoj spisak (`baza/migracije/`). Ako se to zaboravi,
neko kasnije napravi lokal sa slugom `kontakt` i otme stranicu.

---

# BLOK A — struktura

## Korak 24 · Navigacija, `/kontakt`, `/blog`

**Cilj.** Navigacija po novom rasporedu, sa dvije stranice koje su nedostajale.

**Vlasnik fajlova.** `lib/route.ts` · `components/layout/NavbarKlijent.tsx` ·
`components/stranice/ZajednickeStranice.tsx` · `messages/sadrzaj/*.json` ·
`baza/migracije/004_nove_stranice.sql`

**Zašto `/kontakt` nije sitnica.** To je stranica koju Google najpažljivije
upoređuje sa Business profilom. Adresa, telefon i radno vrijeme **kao tekst**,
znak po znak isti kao na profilu — to je potvrda da su podaci sa profila
tačni. Trenutno tu ulogu niko ne nosi.

**Šta se radi.**

1. `SHARED_PAGES` dobija `kontakt` i `blog`. `REZERVISANI` se puni sam iz
   toga — ne dirati.
2. **Migracija** `004_nove_stranice.sql` dopunjava triger sa `kontakt`,
   `blog` i `doner-ljubljana`. Bez nje baza i kod imaju različit spisak.
3. `SEO_PAGES` dobija `doner-ljubljana`. Sadržaj u `sadrzajSeo.ts`, po
   kosturu od devet blokova — **stvarno svoj tekst**, ne kopija kebaba.
4. **Navbar:**

   ```
   Šeherezada │ Naslovna  Meni  Galerija  O nama ▾  Blog ▾  Kontakt │ [📍][🌐][☀]
                                          ↑                  ↑
                       O nama             Blog
                       Pogosta vprašanja  9 SEO stranica
                       Zasebnost          ─────────────
                       Pogoji             Vsi članki → /blog
   ```

   Podmeni koji je sada na „Meni" **se uklanja** — „Meni" postaje običan link
   na meni trenutnog lokala. Sve stavke idu kroz `href()`. Zadržati bez
   izmjena: traku napretka, `layoutId` pilulu, prekidač teme, hamburger.
5. **Mobilni meni** — isti spisak, `O nama` i `Blog` kao preklopne grupe.
   Blok sa prekidačima lokala i jezika ostaje netaknut.
6. **`/kontakt`:** H1 · po lokalu: puna adresa kao tekst, telefon kao
   `tel:` link, radno vrijeme po danima, „Odprto zdaj", **Navodila** na
   Google Maps · kako doći (pješke, autobus, parking) · Wolt i Glovo · mapa
   se učitava **tek kad se doskrola do nje**.
7. **`/blog`:** kartice svih devet SEO stranica sa naslovom i uvodnom
   rečenicom. Ovo usput vraća **blok internih linkova** koji je u ZAVRŠNOM
   planu ispao — odavde snaga teče na SEO stranice.

**Ne raditi.** Ne mijenjati adrese postojećih stranica · ne dirati naslovnu
(korak 25) · ne dirati prekidače.

**Provjera.**
- [ ] `/kontakt` i `/blog` se otvaraju na svih 7 jezika, `/doner-ljubljana` na sl/en/de
- [ ] Lokal sa slugom `kontakt` odbijen **u obrascu i u bazi**
- [ ] Nijedan `href="#"` u navigaciji; desni klik → nova kartica radi svuda
- [ ] `/sitemap.xml` sadrži tri nove adrese, `hreflang` obostran
- [ ] `/kontakt`: adresa i telefon u `view-source:`, ne samo u mapi
- [ ] Mapa se ne učitava dok se ne doskrola
- [ ] `/doner-ljubljana` nema isti tekst kao `/kebab-ljubljana` u blokovima 3, 4 i 7
- [ ] Nijedna stranica nije siroče

---

## Korak 25 · Naslovna po novom rasporedu

**Cilj.** Sedam sekcija tvojim redom, sa dva karusela.

**Vlasnik fajlova.** `components/sekcije/Naslovna.tsx` ·
`PopularPicksMreza.tsx` · `Menu.tsx` (varijanta `izvod`) · `KarticeLokala.tsx`

**Novi redoslijed.**

| # | Sekcija | Izmjena |
|---|---|---|
| 1 | Hero | nepromijenjen |
| 2 | Priljubljene izbire | **mreža → vodoravni karusel** |
| 3 | Naša zgodba | nepromijenjena |
| 4 | Meni | **vodoravni karusel** |
| 5 | Halal | nepromijenjena |
| 6 | Recenzije | nepromijenjena |
| 7 | Pogosta vprašanja | nepromijenjena |
| 8 | Lokali + podnožje | kartice sele ovdje, sređuje se raspored |

**Karusel bez gubitka sadržaja — jedino pravilo koje se ovdje ne smije
prekršiti.** Karusel smije **skrolati**, ne smije **uklanjati**. Sve kartice
ostaju u HTML-u; van ekrana su, ne izostavljene:

```
✔  <div class="flex overflow-x-auto snap-x">  … sve kartice …
✗  {stavke.slice(0, 4)}
✗  {stavke.map(s => aktivna === s.id && <Kartica/>)}
```

Ako se prekrši, `/meni` i naslovna gube pola sadržaja iz izvornog koda, a to
je greška zbog koje je cijela migracija na Next i rađena.

**Šta se radi.**

1. `PopularPicksMreza` → traka `flex overflow-x-auto snap-x snap-mandatory`
   sa `scroll-padding` i skrivenom trakom. Kartice zadržavaju izgled, samo im
   se doda `snap-start` i fiksna širina.
2. Ista promjena za `Menu` u varijanti `izvod`. Varijanta `puna` na `/meni`
   **ostaje mreža** — tamo se pregleda cijeli meni, ne prelistava.
3. Povlačenje mišem na desktopu — isti obrazac kakav već ima traka kategorija
   u `MeniInteraktivni`, ne novi kod.
4. `KarticeLokala` sele iznad podnožja. Raspored `auto-fit` — mora podnijeti
   **2, 3, 4 i više** lokala, jer broj raste.
5. Dugmad na kraju svakog karusela: **Poglej cel meni** i **Vse jedi**.

**Ne raditi.** Ne uvoditi biblioteku za karusel · ne dodavati nove boje ni
animacije · ne dirati Hero, Halal, Recenzije i FAQ.

**Provjera.**
- [ ] `view-source:` na `/` sadrži **sve** izdvojene stavke i sva jela iz izvoda
- [ ] Sa isključenim JavaScriptom karusel se skrola prstom i sve se vidi
- [ ] `Ctrl+F` nalazi jelo koje trenutno nije u vidnom polju
- [ ] Redoslijed sekcija tačno kao u tabeli
- [ ] Kartice lokala rade za 2, 3 i 4 lokala; na 390 px jedna ispod druge
- [ ] Karusel se skrola prstom na telefonu i mišem na desktopu
- [ ] Nema vodoravnog skrolanja **cijele stranice** ni na jednoj širini
- [ ] `/ar` — karusel se skrola u suprotnom smjeru
- [ ] Tačno jedan `<h1>`

---

## Korak 26 · Recenzije — besplatno

**Cilj.** Prava ocjena i recenzije po lokalu, **bez obaveznog troška**.

**Vlasnik fajlova.** `lib/recenzije.ts` · `components/sekcije/ReviewsKarusel.tsx` ·
`components/stranice/StranicaRecenzija.tsx` · `app/chef/(zasticeno)/recenzije/`

**Stanje.** Sekcija recenzija još čita **tri ukucane recenzije** iz
`src/data.ts`. Ocjena `4,5 / 1914` je izmišljena i prikazuje se kao ocjena
cijelog brenda, iako Trubarjeva i Slovenska imaju **različite** ocjene.

**O trošku, iskreno.** Google Places API ima besplatnu mjesečnu kvotu i dva
lokala × jedan poziv dnevno je ~60 poziva mjesečno — duboko unutar nje. Ali
Google **traži karticu na računu** da bi uopšte izdao ključ. Zato se pravi
prekidač, ne jedan put:

```
lib/recenzije.ts
  ├── izvor "rucno"   ← podrazumijevano, radi bez ijednog naloga
  └── izvor "google"  ← upali se samo ako GOOGLE_PLACES_API_KEY postoji
```

Sajt ne zna koji je izvor. Ako ključa nema, uzima ručno unesene; ako ima,
povlači sa Google-a i ručne drži kao rezervu.

**Šta se radi.**

1. **Ručni izvor.** Novi ekran `/chef/recenzije`: po lokalu — ocjena, broj
   recenzija, i do pet recenzija (ime, zvjezdice, tekst, datum). Kolone
   `ocjena` i `broj_recenzija` **već postoje** u tabeli `lokali`.
2. **Google izvor.** Place Details, tražiti **samo** polja `rating`,
   `userRatingCount`, `reviews` — naplata ide po polju. Osvježavanje jednom
   dnevno preko oznake keša. Ključ serverski, nikad u pregledniku.
3. **Pad API-ja ne ruši stranicu:** svježe → posljednje uspješno → prazno
   stanje. Greška u dnevnik, gostu se ne prikazuje.
4. **Ocjene se nikad ne miješaju ni zbrajaju.** Svaki lokal svoju.
5. Uz svaku recenziju **„Vir: Google"** kad dolazi odande.
6. **Ne u strukturirane podatke.** Ni `Review` ni `aggregateRating`. Tuđe
   recenzije označene kao svoje su čest uzrok ručne kazne — a zvjezdice u
   pretrazi ionako dolaze iz Business profila. *Ovo je jedina tačka gdje SEO
   strategija iz PDF-a griješi i namjerno je ne slušamo.*
7. Ukloniti ukucanu ocjenu; **`src/data.ts` i mapa `src/` se brišu** — ovo je
   njihov posljednji korisnik.

**Provjera.**
- [ ] Bez ključa: ručne recenzije rade, ništa ne puca
- [ ] Sa ključem: prave recenzije, po lokalu
- [ ] `/seherezada2/recenzije` prikazuje **svoju** ocjenu
- [ ] Pogrešan ključ → rezerva, gost ne vidi grešku
- [ ] `view-source:` **ne sadrži** `aggregateRating` ni `Review`
- [ ] Ključ nije u klijentskom snopu
- [ ] `src/` obrisan, ništa ga ne uvozi
- [ ] Osvježava se dnevno, ne pri svakoj posjeti

---

## Korak 27 · Okruženje, ključevi, objava

**Cilj.** Projekat se pokreće na novom računaru u četiri koraka; ništa tajno
nije izloženo; objava ne traži ručne zahvate.

**Vlasnik fajlova.** `lib/env.ts` · `.env.example` · `README.md` ·
`scripts/kopija.mjs`

**Šta se radi.**

1. `lib/env.ts` — provjera pri pokretanju, pada sa jasnom porukom koja
   varijabla fali umjesto `undefined` na pola upita.
2. `.env.example` sa **svim** varijablama i praznim vrijednostima. Pravilo:
   samo `NEXT_PUBLIC_` smije u preglednik.
3. **Provjeriti da nijedan ključ nikad nije ušao u git historiju.** Ako
   jeste — poništiti ga i izdati novi. `npm run curenje` već postoji za
   prijevode; ovdje treba ista disciplina za tajne.
4. **Sigurnosna kopija baze** — `pg_dump` po rasporedu, plus ručna prije
   svake migracije. Supabase je ovo imao ugrađeno; sada je na nama.
5. **Oporavak lozinke** — makar naredba `npm run korisnik` koja je mijenja iz
   konzole, dokumentovana u README.
6. **Domena, tek na kraju.** Jedna verzija `https://seherezada.net` bez
   `www`; `www` i `http://` trajno preusmjeriti; **`*.vercel.app` mora
   prestati postojati za pretraživače**. `NEXT_PUBLIC_BASE_URL` na konačnu
   domenu — koriste je sitemap, canonical i hreflang.
7. README zamijeniti opisom projekta.

**Provjera.**
- [ ] Nedostajuća varijabla ruši pokretanje sa jasnom porukom
- [ ] Svjež `clone` + `install` + `.env.local` + `dev` radi
- [ ] Nijedan ključ u historiji commitova
- [ ] `pg_dump` napravi kopiju i ona se **vrati** na praznu bazu
- [ ] Poslije prelaska: `www`, `http://` i `*.vercel.app` preusmjeravaju
- [ ] `canonical` u izvornom kodu pokazuje na pravu domenu

---

# BLOK B — ono što je u planu falilo

## Korak 28 · Strukturirani podaci

**Cilj.** Reći Google-u izričito ono što sada mora nagađati iz teksta.

**Vlasnik fajlova.** `lib/schema.ts` · ubacivanje u `app/[[...slug]]/page.tsx`

**Zašto ovo nije bilo u planu, a mora biti.** ZAVRŠNI plan na tri mjesta kaže
„ne pisati schema.org — poslije faze 5", a korak koji to radi nikad nije
napisan. Bez toga sve cijene koje su ušle u HTML ostaju nevidljive AI alatima
i proširenim rezultatima — a to je bio razlog cijele migracije.

**Šta se radi.**

| Schema | Gdje | Šta donosi |
|---|---|---|
| `Restaurant` | naslovna **svakog lokala**, `/kontakt` | adresa, radno vrijeme, koordinate, Wolt/Glovo u `sameAs` |
| `Menu` + `MenuItem` | `/{lokal}/meni` | jela i cijene, **generisano iz `repo`** |
| `FAQPage` | `/pogosta-vprasanja` + SEO stranice | proširena lista pitanja u rezultatu |
| `BreadcrumbList` | sve podstranice | putanja umjesto gole adrese |
| `WebSite` | naslovna | ime sajta |

1. **Sve iz `repo`, ništa ukucano.** Promjena cijene u `/chef` mijenja i
   schemu. Ako se prepisuje ručno, razići će se za mjesec dana.
2. **Po lokalu, ne po brendu.** Dva lokala = dvije `Restaurant` scheme sa
   svojim `@id`, adresom i radnim vremenom.
3. **Radno vrijeme sa prelaskom ponoći** — `openingHoursSpecification` traži
   `closes: "05:00"` uz `opens: "09:00"`; koristiti `formatRadnoVrijeme`
   izvor, ne novu logiku.
4. **Tekst u schemi mora biti identičan onom na stranici.** Pitanje kojeg
   nema na stranici je prekršaj smjernica.
5. **Bez `aggregateRating` i `Review`** — vidi korak 26.

**Provjera.**
- [ ] `search.google.com/test/rich-results` prepoznaje sve tipove, bez grešaka
- [ ] `Restaurant` na `/seherezada2` ima **adresu lokala 2**
- [ ] `Menu` sadrži sva jela i cijene **tog** lokala
- [ ] Promjena cijene u `/chef` mijenja schemu ≤ 20 s
- [ ] Radno vrijeme u schemi tačno za petak (prelazak ponoći)
- [ ] Nigdje `aggregateRating` ni `Review`
- [ ] Schema radi na svakom jeziku; adresa ista, opisi prevedeni

---

## Korak 29 · Brzina i Core Web Vitals

**Cilj.** LCP ispod 2,5 s na mobitelu.

**Vlasnik fajlova.** `app/layout.tsx` · `components/Hero.tsx` · `next.config`

**Zatečeno.** SEO strategija je izmjerila LCP od ~17 s na staroj Vite verziji.
Prelazak na Next i sređene slike su najveći dio toga riješili, ali **broj
nikad nije izmjeren ponovo**. Prvo mjerenje, pa onda rad — ne obrnuto.

**Šta se radi.**

1. **Izmjeriti prije.** `pagespeed.web.dev`, mobitel, naslovna i `/meni`.
   Zapisati u `DNEVNIK.md`. Bez toga se ne zna je li išta pomoglo.
2. **LCP element** — hero slika dobija `fetchpriority="high"` i **nikad**
   `loading="lazy"`.
3. **`loading="eager"` samo na prve četiri kartice**, ostalo `lazy`.
   Trenutno ih je više.
4. Provjeriti da `next/font` ne blokira iscrtavanje i da se učitavaju
   **najviše dvije težine** po porodici.
5. **framer-motion i GSAP** — obje biblioteke rade isti posao. Pogledati
   koliko donose u snop i može li se GSAP izbaciti sa naslovne.
6. Mapa na `/kontakt` — odgođeno učitavanje (korak 24).
7. **Izmjeriti poslije** i upisati oba broja.

**Provjera.**
- [ ] LCP < 2,5 s · INP < 200 ms · CLS < 0,1 na mobitelu
- [ ] Oba mjerenja zapisana u `DNEVNIK.md`
- [ ] Hero slika `fetchpriority="high"`, bez `lazy`
- [ ] Najviše četiri `eager` slike po stranici
- [ ] Nijedna slika bez `width` i `height`
- [ ] Snop JavaScripta se nije povećao u odnosu na prije koraka

---

## Korak 30 · Pristupačnost

**Cilj.** Sajt upotrebljiv tastaturom i čitačem ekrana.

**Vlasnik fajlova.** poprečno — sve komponente sa ikonicama i fokusom

**Zašto sada, a ne „kad bude vremena".** Evropski akt o pristupačnosti od
juna 2025. pokriva sajtove preko kojih se naručuje. Uz to, isti alati koji
mjere brzinu mjere i ovo, pa jedna loša ocjena vuče drugu.

**Šta se radi.**

1. **`aria-label` na svakoj ikonici bez teksta** — hamburger, tema, telefon,
   prekidači, strelice karusela.
2. **Kontrast najmanje 4,5:1.** Zlatna `#E9C46A` na svijetloj pozadini pada
   test — provjeriti svako mjesto gdje se pojavljuje i potamniti **samo tamo
   gdje pada**, bez uvođenja nove boje u paletu.
3. **Prohodnost tabulatorom** cijelog sajta, sa **vidljivim okvirom fokusa**.
   Karusel mora biti dostupan tastaturom, ne samo prstom.
4. **Redoslijed naslova** H1 → H2 → H3 bez preskakanja, na svakoj stranici.
5. Modal jela — zatvaranje na `Esc`, fokus zarobljen unutra, povratak fokusa
   na karticu poslije zatvaranja.
6. Poštovati `prefers-reduced-motion` — animacije se gase, sadržaj ostaje.

**Provjera.**
- [ ] Lighthouse pristupačnost ≥ 95 na naslovnoj, `/meni` i `/kontakt`
- [ ] Cijeli sajt prohodan tabulatorom, fokus **uvijek vidljiv**
- [ ] Nijedno dugme bez dostupnog imena
- [ ] Nijedan par boja ispod 4,5:1
- [ ] Modal: `Esc` zatvara, fokus se vraća
- [ ] Sa `prefers-reduced-motion` nema animacija, sve čitljivo

---

## Korak 31 · Mjerenje

**Cilj.** Prestati nagađati.

**Šta se radi.**

1. **Search Console** — potvrditi vlasništvo, predati `sitemap.xml`,
   provjeriti izvještaj indeksiranja.
2. **Bing Webmaster Tools** — hrani i Copilot.
3. **Analitika koja poštuje privatnost.** GA4 povlači obavezu za pristanak na
   kolačiće i traku koja smeta. Lakša varijanta bez kolačića je pošteniji
   izbor za ovaj sajt; ako ide GA4, onda i **ispravan pristanak**.
4. **Šta se prati:** pozivi i „Navodila" sa Business profila · pozicije za
   glavne fraze · broj indeksiranih stranica · posjete po jezicima · Core Web
   Vitals.
5. **Provjera u AI alatima** — pitati ChatGPT, Gemini i Perplexity „gdje
   jesti halal u Ljubljani" na više jezika, zapisati odgovor. Ponoviti za tri
   mjeseca; to je mjerenje ovog kanala.

**Provjera.**
- [ ] Search Console vidi sitemap, indeksirano ≈ broju iz sitemapa
- [ ] Nema grešaka indeksiranja i `noindex` na `/chef` je potvrđen
- [ ] Ako ima kolačića — traka za pristanak radi i **ne pomjera sadržaj**
- [ ] Prvo mjerenje u AI alatima zapisano

---

# BLOK C — poslije objave

Nije programiranje i **ne smije blokirati izradu**. Redoslijed po dobiti u
odnosu na trud:

1. **Google Business, po lokalu.** Primarna kategorija je najjača pojedinačna
   postavka. **Naziv bez ključnih riječi** — „Šeherezada 2 pizza&falafel"
   nosi rizik suspenzije ako to nije natpis koji stvarno stoji na lokalu.
2. **Jedan NAP zapis** za oba lokala, pa se odatle kopira svuda. Prvo
   utvrditi **stvarno radno vrijeme** — plan, kod i PDF imaju tri različita.
3. **Apple Business** — u Ljubljani gotovo prazan prostor, besplatno.
4. **Recenzije po pravilima iz 2026.** QR kod, bez nagrada, bez filtriranja,
   odgovor u 24 sata. 50 prirodnih vrijedi više od 200 sa tragovima
   navođenja.
5. **Citati:** Bing Places, TripAdvisor, Yelp, HalalTrip, Zabihah. Apple vuče
   recenzije sa Yelpa i TripAdvisora.
6. **Linkovi:** turistički vodiči Ljubljane, blogovi o halal putovanjima,
   studentski portali, islamska zajednica.
7. **Mjesečni ritam:** nove fotografije, odgovori na recenzije, provjera
   radnog vremena, pogled u Search Console.

---

# Šta i dalje čeka tebe

| | |
|---|---|
| **Prave fotografije hrane** | Sada su zastupne, jedna po kategoriji. Otpremaju se kroz `/chef` i prepisuju ih |
| **Stvarno radno vrijeme** | Tri različita podatka u tri dokumenta. Bez ovoga schema, `/kontakt` i „Odprto zdaj" lažu |
| **Slovenski od izvornog govornika** | Dio teksta je pisan bosanskim koji liči na slovenski |
| **Arapski i kineski** | Provjera od izvornog govornika prije objave |
| **Halal certifikat** | Postoji li dokument — mijenja tekst na `/halal` |
| **Podaci za `/kontakt`** | Parking, autobus, koliko minuta od centra, načini plaćanja |
| **Google Place ID** | Po lokalu — za korak 26 i QR kod |
| **Provjere „tvoje oko"** | Iz koraka 1, 4, 5, 7, 8, 9 i 23 |
