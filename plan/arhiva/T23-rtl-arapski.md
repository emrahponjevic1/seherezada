# T23 · Arapski i RTL

**Faza:** 5 · **Preduslov:** T22 · **Blokira:** —
**Vlasnik fajlova:** `app/globals.css` · `app/layout.tsx` *(atribut `dir`)* · font za arapski

---

## Cilj

Arapska verzija nije samo prijevod nego **cijela stranica u ogledalu** — logo desno, meni lijevo, tekst zdesna nalijevo.

## Zašto zadnje

RTL prevrće raspored svake komponente. Ako se radi prije nego su komponente gotove, svaka nova sekcija se provjerava dvaput.

---

## Šta se radi

### 1 · Atribut smjera

```html
<html lang="ar" dir="rtl">
```
Za ostale jezike `dir="ltr"`. Postavlja se u korijenskom okviru iz jezika u adresi — jedno mjesto, ne po komponenti.

### 2 · Logička svojstva umjesto lijevo/desno

Ovo je jezgro zadatka. Tailwind ima logičke varijante koje se same prevrću:

| Umjesto | Koristiti |
|---|---|
| `ml-4` | `ms-4` *(margin-inline-start)* |
| `mr-4` | `me-4` |
| `pl-6` | `ps-6` |
| `pr-6` | `pe-6` |
| `text-left` | `text-start` |
| `text-right` | `text-end` |
| `left-0` | `start-0` |
| `right-0` | `end-0` |
| `border-l` | `border-s` |
| `rounded-l-2xl` | `rounded-s-2xl` |

Proći **sve komponente** i zamijeniti. Tako isti kod radi za oba smjera, bez duplog pisanja.

**Izuzeci koji se ne prevrću:**
- Ikone koje nisu strelice *(pribor, pribadača, telefon, sat)*
- Logo firme
- Brojevi i cijene — preglednik ih sam drži slijeva nadesno unutar arapskog teksta
- Vrijeme `09:00 – 05:00`

**Prevrću se:** strelice *(→ postaje ←)*, `ChevronRight` u navigaciji, mrvice, redoslijed kolona.

### 3 · Font

Poppins i Inter **ne podržavaju arapsko pismo**. Bez arapskog fonta slova se ne spajaju i tekst je nečitljiv.

Dodati **Noto Naskh Arabic** ili **Cairo**, samo za `lang="ar"`. Učitavati **samo na arapskim stranicama** — ne opterećivati ostale.

Veličina fonta: arapsko pismo je optički manje. Povećati osnovni razmak redova za arapski *(oko 1,8 umjesto 1,65)* — inače tekst djeluje zbijeno.

### 4 · Šta se prevrće u rasporedu

| Element | U RTL |
|---|---|
| Logo | desno |
| Stavke navigacije | lijevo |
| Kontrole *(lokal, jezik, tema)* | lijevo |
| Hamburger | lijevo |
| Preklopni meni | ulazi s lijeva |
| Kartice jela — slika i tekst | zamjena strana |
| Kolone podnožja | obrnut redoslijed |
| Mrvice | `Kebab ‹ Meni ‹ Domov` |
| Karusel recenzija | listanje u suprotnom smjeru |

### 5 · Animacije

framer-motion animacije koje pomjeraju po `x` idu u **pogrešnom smjeru** u RTL — ulazak zdesna postaje ulazak slijeva.

Za animacije sa `x` pomjerajem: uzeti smjer iz konteksta i pomnožiti sa `-1` kad je RTL. Animacije po `y` i `opacity` ostaju.

Pogađa: ulazak stavki mobilnog menija, `layoutId` pilulu u navbaru, parallax u `AboutUs`.

### 6 · Provjera na pravom uređaju

Alat za razvoj ne pokazuje sve — spajanje slova, prelamanje i mješavina arapskog i latinice *(nazivi jela ostaju latinicom)* vide se tek na pravom uređaju.

**Obavezno:** pregled na fizičkom telefonu i provjera od izvornog govornika prije objave.

---

## Ne raditi u ovom zadatku

- Ne prevoditi sadržaj — T22
- Ne prevrtati logo ni ikone hrane
- Ne mijenjati raspored za ostale jezike
- Ne uvoditi zasebnu RTL tablicu stilova — logička svojstva su dovoljna

---

## Verifikacija

- [ ] `/ar/` ima `dir="rtl"` i `lang="ar"`
- [ ] Ostali jezici imaju `dir="ltr"`
- [ ] Logo desno, navigacija lijevo
- [ ] Kartice jela prevrnute; slika na suprotnoj strani
- [ ] Kolone podnožja obrnutim redoslijedom
- [ ] Mrvice idu zdesna nalijevo
- [ ] **Cijene i vrijeme slijeva nadesno** unutar arapskog teksta
- [ ] Arapska slova **spojena** *(font učitan)*
- [ ] Arapski font se **ne učitava** na `/sl/` i `/en/`
- [ ] Strelice prevrnute; ikone hrane i pribadače nisu
- [ ] Mobilni meni ulazi s lijeva
- [ ] Animacije idu u ispravnom smjeru
- [ ] Nema vodoravnog skrolanja ni na jednoj širini
- [ ] Provjereno na **fizičkom telefonu**
- [ ] Provjerio **izvorni govornik**
- [ ] `/sl/` i `/en/` izgledaju **potpuno nepromijenjeno**

## Gotovo kad

Arapska verzija je prevrnuta u cjelini, slova se spajaju, brojevi ostaju uspravni, a ostali jezici su netaknuti.
