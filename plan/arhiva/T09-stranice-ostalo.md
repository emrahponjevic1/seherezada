# T09 · Zajedničke i SEO stranice

**Faza:** 2 · **Preduslov:** T04 · **Paralelno sa:** T07, T08
**Vlasnik fajlova:** `components/stranice/` — sve osim naslovne i menija

---

## Cilj

Svih šest zajedničkih, osam SEO stranica i stranica recenzija postoje, imaju sadržaj i međusobno su povezane. **Demo tekst je prihvatljiv** — bitno je da struktura i linkovi rade.

## Zašto sada

Nakon ovog zadatka nijedna adresa iz T03 nije prazna, i **sajt je potpuno funkcionalan sa jednim lokalom**. To je milestone Faze 2.

---

## Šta se radi

### 1 · Zajedničke stranice — 6

Iste za sve lokale. Prekidač lokala na njima mijenja samo podnožje i telefon.

| Stranica | Struktura | Riječi |
|---|---|---|
| `/o-nas` | H1 · uvod · H2 kako je počelo · H2 šta nas razlikuje · H2 ekipa · H2 halal pristup → link `/halal` · dugmad meni i lokacije | 400–600 |
| `/halal` | H1 · uvod *(sve u ponudi je halal)* · H2 šta halal znači · H2 odakle meso · H2 certifikat · H2 odvojena priprema · H2 bez alkohola · H2 česta pitanja · linkovi na SEO stranice | 500–700 |
| `/galerija` | H1 · uvod · filteri Hrana/Lokal/Ekipa · mreža slika sa opisima | 150 + slike |
| `/faq` | H1 · uvod · tri grupe sa `<h2>`: **Halal i sastojci (8)** · **Radno vrijeme i lokacija (6)** · **Naročanje i cene (10)** | 24 pitanja |
| `/privatnost` | standardni GDPR tekst, kolačići, kontakt | — |
| `/uslovi` | uslovi naročanja i dostave | — |

**FAQ, dvije napomene:**
- Odgovori 40–60 riječi, prva rečenica odgovara direktno
- Odgovor na „Do kdaj ste odprti?" **nabraja sve lokale** sa njihovim vremenima — jedna zajednička stranica, više lokala
- Accordion je klijentski, ali **sva pitanja i odgovori u HTML-u** *(sakriveni CSS-om)*

**Galerija:** koristiti postojeće slike iz `public/` i `data.ts` dok ne stignu prave. Svaka slika opisni `alt`, `width`/`height`, `loading="lazy"` osim prve.

### 2 · SEO stranice — 8

`/kebab-ljubljana` · `/pizza-ljubljana` · `/burger-ljubljana` · `/falafel-ljubljana` · `/halal-hrana-ljubljana` · `/nocna-hrana-ljubljana` · `/dostava-ljubljana` · `/studentski-meni-ljubljana`

Zajednički kostur od devet blokova:

```
1  H1        fraza u prirodnoj rečenici
2  uvod      60–80 riječi, odgovara odmah
3  H2        Šta je to jelo
4  H2        Kako ga pripravljamo
5  H2        Ponudba in cene       ← iz repo, kategorija tog jela
6  H2        Kje smo in kdaj       ← lokali, adrese, radno vrijeme
7  H2        Pogosta vprašanja     ← 3–4 pitanja
8            [Naroči] [Pokliči] [Cel meni]
9            Srodne stranice — 2–3 linka
```

**Dvije stvari koje se ne smiju propustiti:**

**Blok 5 čita iz `repo`.** Cijene se ne prepisuju u tekst — povlače se iz kategorije. Kad se cijena promijeni u `/chef`, mijenja se i ovdje.

**`/nocna-hrana-ljubljana` vodi na lokal 1.** Samo Trubarjeva radi do 05:00; Slovenska zatvara u 23:59. Ta stranica mora upućivati na konkretan lokal, ne na brend uopšteno — inače gost dođe pred zatvorena vrata.

> **Zamka:** ne generisati osam stranica zamjenom jedne riječi. Svaka mora imati **stvarno svoj tekst** u blokovima 3, 4 i 7. Demo tekst je u redu, kopiran nije.

### 3 · Stranica recenzija — po lokalu

`/{lokal}/recenzije`:
```
H1        Mnenja gostov — Šeherezada {ulica}
          ocjena i broj recenzija tog lokala
          spisak recenzija
          [Ocenite nas na Google]  + QR kod
```

U ovom zadatku podaci dolaze iz **demo podataka**; Places API je T21. Prazno stanje po pravilu iz T05.

### 4 · Interno povezivanje

| Odakle | Kuda |
|---|---|
| Naslovna | sve zajedničke, sve SEO, meni, recenzije |
| Svaka SEO stranica | meni · lokacije · 2–3 srodne SEO |
| `/halal` | SEO stranice kebab i falafel |
| `/o-nas` | `/halal`, meni |
| Podnožje | sve *(T04)* |

**Nijedna stranica ne smije biti siroče** — do svake se mora stići klikom sa naslovne.

### 5 · Mrvice

Na svakoj podstranici osim naslovne: `Domov › Meni › Kebab`. Prave `<a>` linkove, u postojećem stilu sivog sitnog teksta.

---

## Ne raditi u ovom zadatku

- Ne dirati naslovnu — T07
- Ne dirati meni ni kartice — T08
- Ne dirati `Navbar` ni `Footer` — T04
- Ne povezivati Places API — T21
- Ne prevoditi na de/ba/tr/ar/zh — T22
- Ne pisati strukturirane podatke — poslije Faze 5

---

## Verifikacija

- [ ] Svih 6 zajedničkih, 8 SEO i stranice recenzija se otvaraju bez 404
- [ ] Svaka ima **tačno jedan `<h1>`** i hijerarhiju bez preskakanja
- [ ] FAQ ima 24 pitanja u tri grupe; **sva u izvornom kodu**, i sa isključenim JavaScriptom
- [ ] Odgovor „Do kdaj ste odprti?" nabraja **oba** lokala
- [ ] Cijene na SEO stranicama dolaze iz `repo` — promjena u podacima mijenja i stranicu
- [ ] `/nocna-hrana-ljubljana` upućuje na lokal 1
- [ ] Nijedne dvije SEO stranice nemaju isti tekst u blokovima 3, 4 i 7
- [ ] Mrvice na svakoj podstranici, pravi linkovi
- [ ] **Nijedna stranica nije siroče** — provjeriti obilaskom sa naslovne
- [ ] Sve slike u galeriji imaju `alt`, `width`, `height`
- [ ] Nijedna nova boja, font ni oblik

## Gotovo kad

Nijedna adresa nije prazna, sve su međusobno povezane, cijene se povlače iz repozitorija. **Sajt je potpuno funkcionalan sa jednim lokalom.**
