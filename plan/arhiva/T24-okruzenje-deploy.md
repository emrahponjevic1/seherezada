# T24 · Okruženje i objavljivanje

**Faza:** poprečno · **Preduslov:** T01 · **Dopunjava se kroz cijeli projekat**
**Vlasnik fajlova:** `.env.example` · `vercel.json` · `README.md` · `lib/env.ts`

---

## Cilj

Projekat se pokreće na novom računaru u nekoliko koraka, a objavljivanje je predvidivo.

## Zašto poprečno

Svaka faza dodaje po neku varijablu okruženja — baza u T11, ključ za slike u T17, Places u T21. Ovaj zadatak se **otvara u Fazi 0 i dopunjava usput**, umjesto da se sve traži na kraju kad se već zaboravilo.

---

## Šta se radi

### 1 · Varijable okruženja

`.env.example` sa **svim** varijablama i praznim vrijednostima. Prava `.env.local` **nikad u git**.

| Varijabla | Uvodi | Klijent? |
|---|---|---|
| `NEXT_PUBLIC_BASE_URL` | T01 | da |
| `NEXT_PUBLIC_SUPABASE_URL` | T11 | da |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | T11 | da |
| `SUPABASE_SERVICE_ROLE_KEY` | T11 | **ne** |
| `GOOGLE_PLACES_API_KEY` | T21 | **ne** |
| `REPO` *(`static` ili `supabase`)* | T11 | ne |

**Pravilo:** samo `NEXT_PUBLIC_` varijable smiju u preglednik. Service role i Places ključ tamo **nikad** — service role zaobilazi sva prava pristupa.

### 2 · Provjera pri pokretanju

`lib/env.ts` provjerava obavezne varijable **pri pokretanju** i pada sa jasnom porukom:

```
✗ Nedostaje NEXT_PUBLIC_SUPABASE_URL
  Kopiraj .env.example u .env.local i popuni.
```

Bolje pasti odmah nego dobiti `undefined` na pola upita.

### 3 · `.gitignore`

Dopuniti: `.env*.local` · `.next/` · `dist/` *(ostatak Vite verzije)* · `.vercel`
Provjeriti da nijedan ključ **nikad nije ušao u historiju**. Ako jeste — poništiti ga i izdati novi.

### 4 · Objavljivanje

**Vercel** — projekat je već tamo.

| Okruženje | Grana | Adresa |
|---|---|---|
| Produkcija | `main` | `seherezada.net` |
| Pregled | ostale grane | privremena adresa |

Varijable se postavljaju **odvojeno** za produkciju i pregled. Pregledna okruženja koriste odvojenu bazu ili barem odvojenu shemu — da probna izmjena ne dirne prave cijene.

`vercel.json` samo ako zatreba *(zaglavlja, regija)*. Next.js na Vercelu radi bez toga.

### 5 · Domena — kad se prelazi

Vrijedi za trenutak prelaska sa `seherezada.vercel.app` na `seherezada.net`:

- Odabrati **jednu** verziju: `https://seherezada.net` bez `www`
- `www` i `http://` → trajno preusmjerenje na odabranu
- **`seherezada.vercel.app` mora prestati postojati za pretraživače** — trajno preusmjerenje na pravu domenu
- `NEXT_PUBLIC_BASE_URL` postaviti na konačnu domenu *(koristi je sitemap, canonical, hreflang)*

> Ako demo adresa ostane živa i indeksirana, Google vidi dva ista sajta i rangira slabije oba.

### 6 · README

Zamijeniti Vite starter tekst:

```
Šeherezada — web

Postavljanje
  1. npm install
  2. kopiraj .env.example u .env.local i popuni
  3. npm run seed        (jednom, puni bazu)
  4. npm run dev

Naredbe
  dev · build · start · lint · seed

Struktura
  app/         rute i stranice
  components/  komponente
  lib/         domena, repozitorij, pomoćnici
  plan/        planovi zadataka
```

### 7 · Sigurnosna kopija baze

Supabase pravi automatske kopije. Provjeriti da su uključene i zabilježiti kako se vraća.
Prije svake migracije šeme — ručna kopija.

---

## Ne raditi u ovom zadatku

- Ne postavljati CI ni automatske testove
- Ne uvoditi praćenje grešaka ni analitiku
- Ne mijenjati domenu prije nego je sve gotovo

---

## Verifikacija

- [ ] `.env.example` sadrži **sve** varijable, bez ijedne prave vrijednosti
- [ ] Nedostajuća obavezna varijabla ruši pokretanje sa **jasnom porukom**
- [ ] `SUPABASE_SERVICE_ROLE_KEY` i `GOOGLE_PLACES_API_KEY` **nisu** u klijentskom snopu *(pretraga po `.next/static`)*
- [ ] `.env.local` nije praćen u gitu
- [ ] Nijedan ključ nije u historiji commitova
- [ ] Svjež `git clone` + `npm install` + `.env.local` + `npm run dev` **radi**
- [ ] Pregledna okruženja ne pišu u produkcijsku bazu
- [ ] `npm run build` prolazi bez grešaka i TS upozorenja
- [ ] Nakon prelaska: `www` i `http://` preusmjeravaju
- [ ] Nakon prelaska: `seherezada.vercel.app` preusmjerava na pravu domenu
- [ ] `NEXT_PUBLIC_BASE_URL` tačan — provjeriti canonical u izvornom kodu
- [ ] README opisuje projekat, ne Vite starter

## Gotovo kad

Novi računar pokreće projekat u četiri koraka, tajni ključevi nisu izloženi, a objavljivanje ne traži ručne zahvate.
