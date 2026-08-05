# T04 · Okvir — navbar i podnožje

**Faza:** 1 · **Preduslov:** T03 · **Blokira:** T07, T08, T09
**Vlasnik fajlova:** `components/layout/Navbar.tsx` · `Footer.tsx` · `MobileCTA.tsx`

---

## Cilj

Navigacija i podnožje rade sa **pravim linkovima** umjesto hash anchora, podnožje se renderuje **jednom**, i okvir je pripremljen da kasniji zadaci samo **dodaju** prekidače bez prepravljanja.

## Zašto ovaj zadatak ima isključivo vlasništvo

`Navbar.tsx` je fajl koji bi inače dirali T03 *(linkovi)*, T19 *(prekidač lokala)*, T22 *(prekidač jezika)* i popravka `<h1>`. Četiri zadatka, jedan fajl, sigurni sudari.

Zato se **sve izmjene okvira rade ovdje**, a T19 i T22 kasnije samo ubacuju gotovu komponentu u pripremljeno mjesto.

---

## Šta se radi

### 1 · Navbar — anchori postaju linkovi

Sadašnje stavke (`Navbar.tsx:14-20`) su hash anchori na sekcije jedne stranice:
```
#home  #popular  #about  #menu  #reviews
```

Postaju prave stranice, sve preko `href()` iz T03:

| Stavka | Vodi na |
|---|---|
| Logo | naslovna **trenutnog** lokala i jezika |
| **Meni ▾** | `meni` trenutnog lokala; podmeni na SEO stranice |
| Halal | `/halal` |
| O nas | `/o-nas` |
| Galerija | `/galerija` |
| FAQ | `/faq` |

Podmeni „Meni ▾": Kebab · Pizza · Burgeri · Falafel · **Cel meni**. Prve četiri vode na SEO stranice, zadnja na meni lokala.

**Nijedan link se ne sastavlja ručno** — uvijek `href()`.

### 2 · Tri stvari koje se popravljaju ovdje

| Šta | Gdje | Kako |
|---|---|---|
| Logo je `<h1>` | `Navbar.tsx:100` | → `<div>` ili `<span>` sa **istim klasama**. Stranica smije imati jedan `<h1>`, a on pripada sadržaju |
| Scroll-spy IntersectionObserver | `Navbar.tsx` | Ukloniti — pratio je sekcije jedne stranice. Aktivnu stavku sad određuje `usePathname()` |
| Fiksno podnožje + `ResizeObserver` | bivši `App.tsx` | Već uklonjeno u T01. Ovdje se potvrđuje da podnožje ide **jednom**, u toku dokumenta |

Zadržati bez izmjena: traku napretka skrolanja, `layoutId` animiranu pilulu aktivne stavke, prekidač teme, hamburger i preklopni mobilni meni.

### 3 · Mjesta za prekidače — pripremiti, ne popuniti

**Desktop**, u grupi kontrola (`Navbar.tsx:130-157`), redoslijed:
```
[ mjesto za lokal ]  [🌐 SL]  [☀]  [☰]
        ↑ T19            ↑ T22
```
Prekidač lokala ide **lijevo od jezika**, u dugmetu identičnog stila kao postojeći prekidač jezika (`Navbar.tsx:132-139`) — `px-3 py-2.5 rounded-xl bg-muted/40 border border-white/5`, ikona plus tekst.

**Mobitel**, u donjem bloku preklopnog menija (`Navbar.tsx:188-213`):
```
──────────────────────────────
[ mjesto za LOKAL ]        ← T19
JEZIK APLIKACIJE  [ ENGLISH ]  ← postoji, T22 ga širi na spisak
📍  {adresa}               ← sada fiksni tekst, postaje dinamičan u T19
──────────────────────────────
```

U ovom zadatku: ostaviti komentar `{/* T19: prekidač lokala */}` na oba mjesta i **ne dodavati ništa drugo**.

### 4 · Podnožje — četiri kolone, jedna instanca

| Kolona | Sadržaj |
|---|---|
| **Lokali** | Svi lokali `stanje: 'radi'` — naziv, adresa, telefon, radno vrijeme. Sve **kao tekst**, ne u slici |
| **Naša ponuda** | Linkovi na 8 SEO stranica |
| **Informacije** | O nas · Halal · Galerija · FAQ · Privatnost · Uslovi |
| **Pratite nas** | Facebook · Instagram · Wolt · Glovo *(Wolt i Glovo trenutnog lokala)* |

Podaci iz `repo.getLokali()`. Radno vrijeme i status „otvoreno sada" preko `formatRadnoVrijeme()` i `jeOtvoren()` iz T02 — **ne prepisivati logiku**, sadašnja u `Footer.tsx:120-135` ne barata prelaskom ponoći.

Sačuvati postojeći izgled: naslovi kolona, isticanje današnjeg dana, dugme za kopiranje adrese, zelena tačka „otvoreno".

### 5 · MobileCTA

Traka pri dnu ekrana ostaje. Dugme „Pozovi" koristi telefon **trenutnog lokala** iz `repo`, ne ukucan broj. Dugme „Meni" postaje link na meni lokala umjesto skrolanja.

Preklopnu ploču kategorija zadržati; njene stavke vode na SEO stranice.

---

## Ne raditi u ovom zadatku

- Ne dodavati prekidače lokala ni jezika — samo mjesta i komentare
- Ne dirati sekcije naslovne — T07
- Ne dirati `Menu.tsx` ni kartice jela — T08
- Ne pisati sadržaj stranica — T09
- Ne mijenjati izgled, razmake ni animacije

---

## Verifikacija

- [ ] Nijedan `href="#..."` nije ostao u navigaciji
- [ ] Desni klik na svaku stavku → „Otvori u novoj kartici" radi
- [ ] Podmeni „Meni ▾" se otvara i sve stavke vode na postojeće adrese
- [ ] Logo vodi na naslovnu **istog** jezika i lokala
- [ ] Aktivna stavka se ističe prema trenutnoj adresi, ne prema skrolanju
- [ ] **Nijedan `<h1>` u navbaru** *(pretraga u dev alatima)*
- [ ] Podnožje se pojavljuje **jednom** u DOM-u
- [ ] Podnožje prikazuje sve lokale `stanje: 'radi'`, adrese kao tekst
- [ ] „Otvoreno sada" tačno za lokal 1 u subotu u 03:00 → **da**
- [ ] „Otvoreno sada" tačno za lokal 2 u subotu u 03:00 → **ne**
- [ ] Dugme „Pozovi" u mobilnoj traci zove broj trenutnog lokala
- [ ] Mobilni meni se otvara, zatvara i zaključava skrolanje kao prije
- [ ] Izgled identičan sadašnjem na desktopu i 390 px
- [ ] `view-source:` sadrži sve linkove navigacije i podnožja

## Gotovo kad

Navigacija su pravi linkovi, podnožje je jedno i čita iz repozitorija, mjesta za prekidače su označena, izgled nepromijenjen.
