# T22 · Jezički sloj i prekidač

**Faza:** 5 · **Preduslov:** T19 · **Blokira:** T23
**Vlasnik fajlova:** `lib/i18n.ts` *(dopuna)* · `components/layout/PrekidacJezika.tsx` · `messages/` · `hreflang` u `generateMetadata`

---

## Cilj

Sedam jezika rade kroz adrese, prekidač ostaje na istoj stranici, a prijevodi jela se unose kroz `/chef`.

## Zašto tek sada

Struktura adresa podržava jezike **od T03**, a polja za prijevode postoje **od T02**. Da se radilo ranije, prevodilo bi se sedam puta nešto što se još mijenja.

---

## Šta se radi

### 1 · Sedam jezika

| Jezik | Kod | Prefiks | | Jezik | Kod | Prefiks |
|---|---|---|---|---|---|---|
| Slovenski | `sl` | *nema* | | Turski | `tr` | `/tr/` |
| Engleski | `en` | `/en/` | | Arapski | `ar` | `/ar/` |
| Njemački | `de` | `/de/` | | Kineski | `zh` | `/zh/` |
| BHS | `bs` | `/ba/` | | | | |

> Kod jezika je `bs`, ali prefiks je `/ba/`. `LANGS` iz T02 mora imati oba — jedno za `hreflang`, drugo za adresu.

**Adrese se ne prevode.** `/en/meni`, nikad `/en/menu`.

### 2 · Dva izvora prijevoda

| Šta | Odakle | Ko unosi |
|---|---|---|
| Sadržaj — jela, kategorije, uvodni tekstovi lokala | **baza**, `jsonb` polja | vlasnik kroz `/chef` |
| Sučelje — dugmad, naslovi sekcija, poruke | **datoteke** `messages/{lang}.json` | programer |

Sučelje ne treba u bazi — ne mijenja se često i ne tiče se vlasnika.

`messages/sl.json` je izvor. Nedostajući ključ u drugom jeziku pada na engleski, pa na slovenski *(lanac iz T02)*.

### 3 · Šta se prevodi, a šta nikad

| Prevodi se | Ne prevodi se |
|---|---|
| Naslovi, opisi, sav tekst | **Naziv „Šeherezada"** |
| Nazivi kategorija *(Prilozi → Beilagen)* | **Nazivi jela** — döner ostaje döner |
| Opisi jela i sastojci | **Adrese ulica** |
| FAQ pitanja i odgovori | **Adrese stranica** |
| Opisi slika | **Broj telefona** |
| Dugmad i navigacija | Slugovi lokala |

### 4 · Nivoi prevođenja

Ne prevodi se sve — 23 stranice × 7 jezika je 161, od čega bi pola bilo prazno.

| Nivo | Stranice | Jezici |
|---|---|---|
| 1 | naslovne i meniji svih lokala, `/halal`, `/faq` | **svih 7** |
| 2 | 8 SEO stranica, `/o-nas`, recenzije | sl, en, de |
| 3 | `/galerija`, pravne | sl, en |

`generateStaticParams` generiše **samo dozvoljene kombinacije**. Adresa van nivoa → 404, ne prazna stranica.

Redoslijed uvođenja: **sl + en** → **de** → **bs + tr** → **ar + zh**

### 5 · Prekidač jezika

T04 je ostavio mjesto; postojeći prekidač je dugme koje mijenja između dva jezika. Sa sedam postaje **spisak**.

**Desktop** — isto dugme, klik otvara spisak:
```
[🌐 SL ▾]
   ├ Slovenščina
   ├ English
   ├ Deutsch
   ├ Bosanski
   ├ Türkçe
   ├ العربية
   └ 中文
```

**Mobitel** — red *JEZIK APLIKACIJE* postaje spisak umjesto dugmeta. Raspored bloka ostaje isti.

**Pravila:**
- Nazivi **na svom jeziku** — Deutsch, ne German
- **Bez zastavica** — zastavica označava državu, ne jezik; arapski se govori u dvadesetak zemalja
- Jezik koji stranica nema *(npr. `/ar/kebab-ljubljana`)* prikazan sivo, bez odabira
- Prekidač **navigira**, adresu gradi `href()` iz T03

### 6 · Prekidač ostaje na istoj stranici

Sa `/de/seherezada2/meni` odabir engleskog vodi na `/en/seherezada2/meni` — **isti lokal, ista stranica**.

Vraćanje na naslovnu pri promjeni jezika je najčešći uzrok napuštanja sajta.

**Nema automatskog prebacivanja** po `Accept-Language` ni po IP-u. Google robot pretražuje iz inostranstva; automatsko prebacivanje bi značilo da ostale verzije nikad ne budu indeksirane.

Dozvoljena je nenametljiva traka na vrhu: *„This page is available in English"* sa linkom — **prijedlog, ne preusmjerenje**.

### 7 · hreflang

U `generateMetadata` *(mjesto ostavljeno u T06)*, na svakoj stranici spisak svih njenih verzija:

```
sl  → https://seherezada.net/seherezada2/meni
en  → https://seherezada.net/en/seherezada2/meni
de  → https://seherezada.net/de/seherezada2/meni
bs  → https://seherezada.net/ba/seherezada2/meni
hr  → https://seherezada.net/ba/seherezada2/meni
sr  → https://seherezada.net/ba/seherezada2/meni
tr  → https://seherezada.net/tr/seherezada2/meni
ar  → https://seherezada.net/ar/seherezada2/meni
zh  → https://seherezada.net/zh/seherezada2/meni
x-default → https://seherezada.net/en/seherezada2/meni
```

Tri pravila koja se najčešće prekrše:
1. **Veze moraju biti obostrane** — jednosmjerne Google ignoriše u cjelini
2. **Svaka stranica pokazuje na svoj prijevod**, ne na naslovnu
3. **Pune adrese sa `https://`**, nikad `/en/meni`

`bs`, `hr` i `sr` pokazuju na istu stranicu — jezik je isti, a pokrivaju se pretrage iz tri zemlje.
Navode se **samo jezici koje ta stranica stvarno ima** *(nivoi iz koraka 4)*.

### 8 · `/chef` — kartice po jeziku

Već postoje iz T15. Ovdje se popunjavaju: siva tačka na kartici bez prijevoda, i pregled koliko je jela neprevedeno po jeziku.

---

## Ne raditi u ovom zadatku

- Ne raditi RTL za arapski — T23
- Ne prevoditi adrese stranica
- Ne uvoditi automatsko prevođenje bez provjere
- Ne dirati prekidač lokala — T19

---

## Verifikacija

- [ ] `/en/`, `/de/`, `/ba/`, `/tr/`, `/ar/`, `/zh/` se otvaraju
- [ ] `/sl/meni` → trajno preusmjerenje na `/meni`
- [ ] Sa `/de/seherezada2/meni` prekidač na engleski → `/en/seherezada2/meni`, **ne naslovna**
- [ ] Prekidač lokala **čuva jezik**
- [ ] Nazivi jezika na svom jeziku; **nema zastavica**
- [ ] Jezik van nivoa stranice prikazan sivo; adresa daje 404
- [ ] **Nema automatskog prebacivanja** po jeziku pregledika
- [ ] `hreflang` na svakoj stranici, **obostran**, pune adrese
- [ ] `x-default` pokazuje na engleski
- [ ] `bs`, `hr`, `sr` pokazuju na `/ba/`
- [ ] Nedostajući prijevod pada na engleski, pa slovenski — **nikad prazno polje**
- [ ] Naziv „Šeherezada" i nazivi jela nisu prevedeni
- [ ] Sitemap sadrži samo dozvoljene kombinacije
- [ ] Svaki jezik pregledao izvorni govornik prije objave

## Gotovo kad

Sedam jezika radi kroz adrese, prekidač ostaje na istoj stranici, hreflang je obostran, a prijevodi se unose kroz `/chef`.
