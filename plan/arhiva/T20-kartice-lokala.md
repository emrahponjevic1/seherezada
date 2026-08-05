# T20 · Kartice lokala na naslovnoj

**Faza:** 4 · **Preduslov:** T18 · **Paralelno sa:** T19, T21
**Vlasnik fajlova:** `components/sekcije/KarticeLokala.tsx` *(nastala u T07)*

---

## Cilj

Sekcija 2 naslovne prikazuje **sve lokale iz baze** sa adresom, radnim vremenom i uputstvom, plus dugme za pronalaženje najbližeg.

## Zašto je ovo dopuna, a ne novi zadatak

T07 je već napravio komponentu i sekciju. Ovdje se dodaje ono što bez baze i više lokala nije imalo smisla: dinamičan broj kartica, isticanje trenutnog i geolokacija.

---

## Šta se radi

### 1 · Kartice iz baze

Sada je broj kartica bio tri, ukucan. Postaje `repo.getLokali()`.

Po lokalu:
```
┌──────────────────────┐
│  📍                  │
│  Šeherezada          │
│  Trubarjeva          │
│  Trubarjeva cesta 31 │
│  ● Odprto do 05:00   │
│  Navodila →          │
└──────────────────────┘
```

- Ikona `MapPin` u crvenoj — isti stil kao postojeća traka iz `Hero.tsx:300-335`
- Naziv podebljan, adresa siva — ista tipografija
- Zelena tačka ako je otvoren *(preko `jeOtvoren()` iz T02, računa se u pregledniku — pravilo iz T12)*
- **Navodila →** otvara Google Maps sa koordinatama lokala

### 2 · Raspored za promjenljiv broj

Broj lokala se mijenja kroz `/chef`. Mreža mora raditi za 1 do 5+:

```
1 lokal    jedna kartica, centrirana, ne razvučena
2          dvije u redu
3          tri u redu (sadašnji izgled)
4+         prelamanje u novi red
mobitel    uvijek jedna ispod druge
```

Koristiti `grid` sa `auto-fit`, ne fiksni broj kolona.

### 3 · Isticanje trenutnog lokala

Kartica lokala na čijoj se stranici gost nalazi ima **crveni rub** — isti stil kao aktivna pilula u navbaru. Na zajedničkim stranicama ističe se glavni lokal.

Ostale kartice su **linkovi** na naslovnu tog lokala.

### 4 · Lokal u stanju „uskoro"

```
┌──────────────────────┐
│  📍                  │
│  Šeherezada          │
│  Tretja lokacija     │
│  ── Kmalu ──         │  ← značka, ne adresa
│                      │  ← bez linka
└──────────────────────┘
```

Prigušena, bez linka, bez radnog vremena. Značka u stilu postojećih oznaka *(`bg-shere-gold/10`, `rounded-xl`)*.

### 5 · Dugme „Poišči najbližjega"

Ispod kartica, centrirano, u stilu staklenog dugmeta iz heroja.

```
Klik  →  traži dozvolu za lokaciju
      →  računa udaljenost do svakog lokala
      →  ističe najbliži i dodaje "1,2 km"
      →  poredak kartica se NE mijenja
```

**Tri obavezna pravila:**

1. **Lokacija se traži samo na klik.** Nikad pri otvaranju stranice — traka sa dozvolom odmah pri učitavanju tjera posjetioce.
2. **Nema preusmjeravanja.** Rezultat je isticanje i udaljenost, ništa više. Gost i dalje bira sam.
3. **Odbijanje dozvole nije greška.** Dugme se vrati u početno stanje, bez poruke o grešci. Kartice ostaju upotrebljive.

Stanja dugmeta: mirno · traži se dozvola · računa · gotovo *(prikaži „Najbližji: Trubarjeva")* · odbijeno *(nazad na mirno)*.

Udaljenost zračnom linijom iz koordinata — dovoljno za „koji mi je bliži". Ne koristiti vanjski servis.

### 6 · Serverski dio

Kartice su **serverski HTML** — nazivi, adrese i radno vrijeme u izvornom kodu.
Klijentski su samo: zelena tačka „otvoreno sada" i dugme za geolokaciju.

---

## Ne raditi u ovom zadatku

- Ne dirati prekidač lokala u navigaciji — T19
- Ne dirati ostale sekcije naslovne — T07
- Ne dodavati mapu u sekciju — kartice vode na Google Maps
- Ne pamtiti lokaciju gosta — koristi se i odbacuje

---

## Verifikacija

- [ ] Broj kartica prati broj lokala u bazi
- [ ] Dodavanje lokala kroz `/chef` dodaje karticu bez izmjene koda
- [ ] Raspored uredan za 1, 2, 3 i 4 lokala
- [ ] Na mobitelu kartice idu jedna ispod druge
- [ ] Kartica trenutnog lokala istaknuta; na zajedničkim stranicama istaknut glavni
- [ ] Ostale kartice su pravi linkovi *(desni klik → nova kartica radi)*
- [ ] Lokal `uskoro`: značka *Kmalu*, prigušen, **bez linka**
- [ ] „Navodila" otvara Google Maps na tačnoj lokaciji
- [ ] Zelena tačka tačna za lokal 1 u subotu u 03:00 → **da**
- [ ] Zelena tačka tačna za lokal 2 u subotu u 03:00 → **ne**
- [ ] **Dozvola za lokaciju se ne traži pri učitavanju stranice**
- [ ] Odbijanje dozvole ne prikazuje grešku i ne kvari sekciju
- [ ] Nakon dozvole najbliži je istaknut sa udaljenošću; poredak nepromijenjen
- [ ] `view-source:` sadrži nazive, adrese i radno vrijeme svih lokala
- [ ] Nijedna nova boja, font ni oblik

## Gotovo kad

Kartice dolaze iz baze, podnose bilo koji broj lokala, „uskoro" se ponaša ispravno, a geolokacija predlaže bez prisile.
