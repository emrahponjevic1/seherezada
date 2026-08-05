# T21 · Recenzije preko Places API

**Faza:** 4 · **Preduslov:** T18 · **Paralelno sa:** T19, T20
**Vlasnik fajlova:** `lib/places.ts` · stranica recenzija · sekcija 7 naslovne

---

## Cilj

Recenzije i ocjena dolaze **automatski sa Google-a, po lokalu**. Nema ručnog prepisivanja.

---

## Šta se radi

### 1 · Koji API

**Places API — Place Details.** Vraća ocjenu, ukupan broj recenzija i **do pet recenzija**. Treba samo ključ.

Business Profile API vraća sve recenzije i omogućava odgovaranje, ali traži OAuth kao vlasnik i odobrenje Google-a. **Ne u ovom zadatku** — pet recenzija je tačno onoliko koliko sekcija prikazuje.

Polja koja se traže: `rating`, `userRatingCount`, `reviews`. Tražiti **samo njih** — naplata ide po polju.

### 2 · Po lokalu

Svaki lokal ima svoj `google_place_id` *(polje iz T10, unosi se u T14)*.

```
lokal 1  →  ocjena 4,5 · ~2000 recenzija
lokal 2  →  ocjena 4,3 · 59 recenzija
```

**Ocjene se nikad ne miješaju i nikad ne zbrajaju.** Svaki lokal prikazuje svoju. Lokal bez `google_place_id` prikazuje prazno stanje iz T05.

> Ovo usput ispravlja postojeću grešku: sadašnja ocjena `4,5 / 1914` je ukucana u `index.html` i prikazuje se kao ocjena cijelog brenda.

### 3 · Osvježavanje i keš

Jednom dnevno, preko oznake keša iz T12.

Uslovi Places API-ja ograničavaju trajno skladištenje sadržaja recenzija. Zato: **povlačiti redovno, ne graditi arhivu.** Čuva se samo posljednji odgovor kao keš.

Trošak je zanemariv — dva lokala, jedan poziv dnevno.

### 4 · Kad API ne odgovori

Vanjski servis pada, ključ istekne, kvota se potroši. **Stranica ne smije pasti.**

```
API radi        →  svježe recenzije
API ne radi     →  posljednje uspješno povučene
nikad povučeno  →  prazno stanje iz T05
```

Greška se bilježi u dnevnik, gostu se **ne prikazuje**. Ocjena i broj recenzija se čuvaju i u bazi lokala kao rezerva, osvježeni pri svakom uspješnom pozivu.

### 5 · Gdje se prikazuje

**Sekcija 7 naslovne** — postojeći karusel, sada sa pravim recenzijama tog lokala. Iznad ocjena i broj. Ispod link *Vse recenzije*.

**`/{lokal}/recenzije`** — ocjena, broj, svih pet recenzija, dugme **Ocenite nas na Google** *(vodi na profil lokala)*, i QR kod za štampanje.

Po recenziji: ime, ocjena zvjezdicama, tekst, koliko davno. **Obavezno „Vir: Google"** — uslovi traže naznaku porijekla.

### 6 · Ne u strukturirane podatke

Google traži da `Review` i `aggregateRating` u strukturiranim podacima budu recenzije **prikupljene na vlastitom sajtu**. Google recenzije označene kao vlastite su čest uzrok ručne kazne i gubitka zvjezdica iz rezultata.

**Pravilo:**
- recenzije se **prikazuju gostima** — potpuno u redu
- **ne stavljaju se** u `Review` ni `aggregateRating` schemu
- zvjezdice u pretrazi ionako dolaze iz Business profila, ne sa sajta

Postojeći `aggregateRating` u `index.html` *(4.5 / 1914)* se **uklanja**.

> Ovo odstupa od ranijeg SEO plana, gdje je `aggregateRating` bio predložen. Rizik je veći od koristi.

### 7 · Ključ

Server-side ključ u env varijabli, **nikad u klijentskom kodu**. Ograničiti na Places API i po potrebi na IP servera. Popis vodi T24.

---

## Ne raditi u ovom zadatku

- Ne uvoditi Business Profile API ni odgovaranje na recenzije
- Ne praviti vlastiti sistem recenzija na sajtu
- Ne skladištiti recenzije trajno
- Ne pisati strukturirane podatke

---

## Verifikacija

- [ ] Naslovna prikazuje prave recenzije **trenutnog** lokala
- [ ] `/seherezada2/recenzije` prikazuje **4,3 i 59**, ne 4,5
- [ ] Ocjene se nigdje ne zbrajaju ni miješaju
- [ ] Lokal bez `google_place_id` prikazuje prazno stanje, ne pada
- [ ] Pogrešan ključ: stranica radi, prikazuje rezervu, greška u dnevniku, **gost ne vidi grešku**
- [ ] Recenzije se osvježavaju jednom dnevno, ne pri svakoj posjeti
- [ ] Uz recenzije stoji **„Vir: Google"**
- [ ] Dugme „Ocenite nas" vodi na profil **tog** lokala
- [ ] `view-source:` **ne sadrži** `aggregateRating` ni `Review` schemu
- [ ] Stari `aggregateRating` iz `index.html` uklonjen
- [ ] API ključ **nije** u klijentskom snopu *(pretraga po `.next/static`)*
- [ ] Karusel izgleda i radi kao prije

## Gotovo kad

Svaki lokal prikazuje svoju pravu ocjenu i recenzije, pad API-ja ne ruši stranicu, a ništa od toga ne ide u strukturirane podatke.
