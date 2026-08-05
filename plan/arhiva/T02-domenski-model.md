# T02 · Domenski model i ugovori

**Faza:** 0 · **Preduslov:** T01 · **Blokira:** sve ostalo
**Vlasnik fajlova:** `lib/domain.ts` · `lib/repo.ts` · `lib/repo.static.ts` · `lib/i18n.ts`

---

## Cilj

Definisati **tipove i potpise repozitorija** koje uvozi cijeli ostatak projekta. Implementacija je za sada nad postojećim `src/data.ts`, ali ugovor **od prvog dana podržava više lokala i sedam jezika**.

## Zašto je ovo najvažniji zadatak

Sve što dolazi poslije — rute, stranice, admin — uvozi ove tipove. Ako se ovo napiše za jedan lokal i dva jezika, svaki od tih fajlova se prepravlja kad dođu lokali i jezici.

Uz to, ovaj sloj je razlog zašto je prelazak na bazu (T11) **zamjena jednog fajla**. Komponente pozivaju `repo.getMeni(...)` i ne znaju odakle podaci dolaze.

```
komponente ─┐
rute       ─┼─→  lib/repo.ts (ugovor)  ─→  repo.static.ts   ← sada, nad data.ts
admin      ─┘                           └─→ repo.supabase.ts ← T11, zamjena
```

---

## Šta se radi

### 1 · `lib/domain.ts` — tipovi

```ts
export const LANGS = ['sl','en','de','ba','tr','ar','zh'] as const;
export type Lang = typeof LANGS[number];
export const DEFAULT_LANG: Lang = 'sl';
export const FALLBACK_CHAIN: Lang[] = ['en','sl'];

/** Prevodivo polje. Nijedan jezik nije obavezan osim kroz fallback. */
export type Prevod = Partial<Record<Lang, string>>;
export type PrevodLista = Partial<Record<Lang, string[]>>;

export type Dan = 'pon'|'uto'|'sri'|'cet'|'pet'|'sub'|'ned';
/** null = zatvoreno tog dana. `do` manje od `od` znači prelazak ponoći. */
export type RadnoVrijeme = Record<Dan, { od: string; do: string } | null>;

export type StanjeLokala = 'radi' | 'uskoro' | 'zatvoren';

export interface Lokal {
  id: string;
  slug: string;                 // "trubarjeva" | "seherezada2"
  naziv: string;                // ne prevodi se
  ulica: string;
  adresa: string;               // puna, jedan izvor istine za NAP
  telefon: string;              // međunarodni format
  email?: string;
  lat?: number; lng?: number;
  radnoVrijeme: RadnoVrijeme;
  woltUrl?: string; glovoUrl?: string;
  googlePlaceId?: string;
  uvodniTekst: Prevod;          // OBAVEZNO različit po lokalu
  glavni: boolean;              // tačno jedan
  stanje: StanjeLokala;
  redoslijed: number;
}

export interface Kategorija {
  id: string; slug: string;
  naziv: Prevod; opis?: Prevod;
  redoslijed: number; aktivna: boolean;
}

/** Jelo iz kataloga — bez cijene. Cijena pripada lokalu. */
export interface Jelo {
  id: string; slug: string; kategorijaId: string;
  naziv: Prevod; opis: Prevod; sastojci: PrevodLista;
  alergeni: string[];
  slikaUrl?: string; slikaAlt: Prevod;
  halal: boolean; vegetarijansko: boolean; vegansko: boolean;
  ljuto: 0|1|2|3; kalorije?: number;
}

/** Jelo u meniju konkretnog lokala. */
export interface MenuStavka {
  jelo: Jelo;
  cijena: number;               // broj, ne string — formatiranje je stvar prikaza
  dostupno: boolean;
  izdvojeno: boolean;
  redoslijed: number;
}

export interface MenuSekcija {
  kategorija: Kategorija;
  stavke: MenuStavka[];
}
```

> **Cijena je `number`, ne string.** Sada je u `data.ts` `"8,50 €"`. Formatiranje ide u `formatCijena()` u `lib/i18n.ts` — inače se ne može ni sortirati ni računati, a svaki jezik ima svoj zapis.

### 2 · `lib/i18n.ts` — prijevodi i formatiranje

```ts
/** Uzmi prijevod uz fallback: traženi → en → sl → prvi postojeći → "". */
export function t(polje: Prevod | undefined, lang: Lang): string;
export function tList(polje: PrevodLista | undefined, lang: Lang): string[];

/** "8,50 €" — po jeziku. */
export function formatCijena(cijena: number, lang: Lang): string;

/** "09:00 – 02:00" ili "Zaprto". Barata prelaskom ponoći. */
export function formatRadnoVrijeme(rv: RadnoVrijeme, dan: Dan, lang: Lang): string;

/** Je li lokal otvoren u dati trenutak. Barata prelaskom ponoći. */
export function jeOtvoren(rv: RadnoVrijeme, kada: Date): boolean;
```

> `jeOtvoren` mora ispravno raditi za lokal 1: petkom radi **09:00–05:00**, što znači da je subota u 03:00 još uvijek „petak". Sadašnja logika u `Hero.tsx` i `Footer.tsx` to ne rješava. Napisati **jednom ovdje**, obje komponente je koriste.

### 3 · `lib/repo.ts` — ugovor

```ts
export interface Repo {
  getLokali(): Promise<Lokal[]>;              // samo stanje 'radi' i 'uskoro', po redoslijedu
  getLokal(slug: string): Promise<Lokal|null>;
  getGlavniLokal(): Promise<Lokal>;
  getKategorije(): Promise<Kategorija[]>;
  getMeni(lokalSlug: string): Promise<MenuSekcija[]>;   // prazne kategorije izostavljene
  getIzdvojena(lokalSlug: string): Promise<MenuStavka[]>;
  getJelo(slug: string): Promise<Jelo|null>;
}

export const repo: Repo = staticRepo;   // T11 mijenja SAMO ovu liniju
```

Sve metode su `async` iako statička implementacija ne ide nigdje — inače bi se svaki poziv prepravljao u T11.

### 4 · `lib/repo.static.ts` — implementacija nad `data.ts`

- Čita postojeći `src/data.ts`, mapira u nove tipove
- Cijena `"8,50 €"` → `8.50`
- `title`/`desc`/`ingredients` `{sl,en}` → `Prevod`
- Kategorije iz `Category` unije → objekti `Kategorija` sa redoslijedom
- **Halal iz podatka**, ne iz kategorije *(sada `ProductCard.tsx:152-177` izvodi oznaku iz kategorije, pa burgeri ostaju bez nje iako jesu halal — ovdje se ispravlja: `halal: true` za sve)*
- `popular: true` → `izdvojeno`
- **Dva lokala i cijene lokala 2** iz demo podataka u MASTER-u *(lokal 1 +0,50 €)*
- Lokal 3 — stanje `uskoro`, bez menija

### 5 · Ono što ostaje

`src/data.ts` ostaje kao izvor, ali ga **od sada niko ne uvozi direktno osim `repo.static.ts`**. Sve komponente idu preko `repo`.

---

## Ne raditi u ovom zadatku

- Ne dirati baze, SQL ni Supabase — to je T10/T11
- Ne mijenjati komponente da koriste repo — to rade vlasnici tih komponenti u T07/T08
- Ne pisati rute — T03
- Ne dodavati prijevode za de/ba/tr/ar/zh — tipovi ih podržavaju, sadržaj dolazi u T22

---

## Verifikacija

- [ ] `npm run build` prolazi; nigdje `any`
- [ ] `repo.getMeni('trubarjeva')` vraća svih 8 kategorija sa 23 jela
- [ ] `repo.getMeni('seherezada2')` vraća cijene veće za 0,50 €
- [ ] `repo.getLokali()` vraća 3 lokala, treći sa `stanje: 'uskoro'`
- [ ] `repo.getGlavniLokal()` vraća `trubarjeva`
- [ ] `t({sl:'a'}, 'de')` vraća `'a'` *(fallback lanac radi)*
- [ ] `t(undefined, 'sl')` vraća `''`, ne baca grešku
- [ ] `jeOtvoren` za lokal 1, subota 03:00 → `true` *(prelazak ponoći)*
- [ ] `jeOtvoren` za lokal 2, subota 03:00 → `false`
- [ ] `formatCijena(8.5,'sl')` → `"8,50 €"`
- [ ] Nijedno jelo nema `halal: false`

## Gotovo kad

Tipovi i repo postoje, statička implementacija vraća tačne podatke za sva tri lokala, a nijedan drugi fajl ne uvozi `data.ts` direktno.
