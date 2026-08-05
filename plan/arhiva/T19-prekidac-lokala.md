# T19 · Prekidač lokala

**Faza:** 4 · **Preduslov:** T18 · **Paralelno sa:** T20, T21
**Vlasnik fajlova:** `components/layout/PrekidacLokala.tsx` · dva označena mjesta u `Navbar.tsx`

---

## Cilj

Gost bira lokal iz navigacije i **ostaje na istoj vrsti stranice**. Cijeli sajt prati taj izbor.

## Zašto je ovo aditivan zadatak

T04 je stabilizovao `Navbar.tsx` i ostavio dva označena mjesta:
```
{/* T19: prekidač lokala */}
```
Ovdje se ubacuje **gotova komponenta** — struktura navbara se ne prepravlja.

---

## Šta se radi

### 1 · Ponašanje

Prekidač **navigira**, ne mijenja stanje. Sa `/en/seherezada2/meni` odabir drugog lokala vodi na `/en/{drugi}/meni` — isti jezik, ista vrsta stranice.

Adresa se gradi **isključivo funkcijom `href()`** iz T03. Nikad ručno spajanje segmenata.

| Gdje je gost | Bira lokal | Ide na |
|---|---|---|
| `/meni` | Slovenska | `/seherezada2/meni` |
| `/seherezada2/recenzije` | Trubarjeva | `/recenzije` |
| `/en/seherezada2` | Trubarjeva | `/en/` |
| `/halal` *(zajednička)* | bilo koji | **ostaje `/halal`**, mijenja se podnožje i telefon |

Na zajedničkim i SEO stranicama nema lokala u adresi. Prekidač tada mijenja samo **kontekst** — podnožje, telefon, Wolt i Glovo — a stranica ostaje ista.

### 2 · Kako se kontekst pamti na zajedničkim stranicama

Ovdje je jedina stvarna zamka.

**URL je izvor istine** *(tvrdo pravilo iz MASTER-a)*. Na `/halal` nema lokala u adresi, pa se serverski renderuje **glavni lokal**.

Rješenje bez razmimoilaženja pri hidraciji:
- serverski HTML uvijek prikazuje **glavni lokal**
- klijentska komponenta nakon montiranja pročita kolačić i **osvježi samo telefon, adresu u podnožju i linkove za dostavu**
- to je mala, ograničena izmjena — ne dira sadržaj stranice

**Ne renderovati cijelo podnožje uslovno prema kolačiću** — to izaziva razmimoilaženje i treperenje. Mijenjaju se samo ta polja, nakon montiranja.

### 3 · Kolačić

```
ime      shere-lokal
trajanje 1 godina
sadržaj  slug lokala
```

Postavlja se: pri odabiru u prekidaču **i** pri otvaranju bilo koje stranice lokala *(gost koji otvori `/seherezada2/meni` očigledno gleda taj lokal)*.

Kolačić **nikad ne preusmjerava**. Ne mijenja šta se renderuje na stranicama koje imaju lokal u adresi.

### 4 · Izgled — desktop

U grupi kontrola, **lijevo od jezika**:

```
[📍 TRUBARJEVA]  [🌐 SL]  [☀]  [☰]
```

Dugme identično postojećem prekidaču jezika *(`Navbar.tsx:132-139`)* — `px-3 py-2.5 rounded-xl bg-muted/40 hover:bg-muted/80 border border-white/5`, ikona `MapPin` plus tekst.

Klik otvara spisak: naziv lokala, ulica, radno vrijeme danas, zelena tačka ako je otvoren. Trenutni označen. Lokal `uskoro` prikazan sivo, **bez mogućnosti odabira**.

### 5 · Izgled — mobitel

U donjem bloku preklopnog menija, **iznad reda za jezik**:

```
──────────────────────────────
LOKAL              [ TRUBARJEVA ]
JEZIK APLIKACIJE   [ ENGLISH    ]
📍  Trubarjeva cesta 31, Ljubljana
──────────────────────────────
```

Isto crveno dugme kakvo već ima jezik. Red sa 📍 **prestaje biti fiksni tekst** i prikazuje adresu odabranog lokala.

Prekidač postoji **samo tu** — ne gura se u gornju traku pored hamburgera.

### 6 · Šta prati lokal

| Element | Odakle |
|---|---|
| Cijene i dostupnost jela | ruta |
| Telefon *(hero, mobilna traka, podnožje)* | trenutni lokal |
| Adresa u podnožju i karticama | trenutni lokal |
| Radno vrijeme i „Odprto zdaj" | trenutni lokal |
| Wolt i Glovo dugmad | trenutni lokal |
| Recenzije i ocjena | trenutni lokal |

---

## Ne raditi u ovom zadatku

- Ne prepravljati strukturu `Navbar.tsx` — samo popuniti označena mjesta
- Ne dirati kartice lokala na naslovnoj — T20
- Ne dodavati geolokaciju — T20
- Ne dirati prekidač jezika — T22

---

## Verifikacija

- [ ] Sa `/meni` odabir drugog lokala vodi na `/seherezada2/meni`, **ne** na naslovnu
- [ ] Sa `/en/seherezada2/recenzije` odabir vodi na `/en/recenzije` — jezik sačuvan
- [ ] Sa `/halal` odabir **ostaje** na `/halal`, mijenja se telefon i podnožje
- [ ] Prekidač prikazuje samo lokale `radi` kao odabirljive; `uskoro` sivo
- [ ] Kolačić se postavlja pri odabiru **i** pri otvaranju stranice lokala
- [ ] Kolačić **nikad** ne preusmjerava
- [ ] **Nema upozorenja o razmimoilaženju** u konzoli ni na jednoj stranici
- [ ] Nema treperenja telefona ili adrese pri učitavanju
- [ ] Sa isključenim JavaScriptom prekidač je vidljiv i **linkovi rade** *(pravi `<a>`)*
- [ ] Izgled dugmeta identičan prekidaču jezika
- [ ] Na mobitelu prekidač postoji **samo** u preklopnom meniju
- [ ] Red sa 📍 prikazuje adresu odabranog lokala
- [ ] Nijedna adresa se ne gradi ručno — sve kroz `href()`

## Gotovo kad

Prekidač navigira na istu vrstu stranice, čuva jezik, ne izaziva razmimoilaženje, i izgleda kao da je oduvijek bio tu.
