# T03 · Rute i resolver

**Faza:** 1 · **Preduslov:** T02 · **Blokira:** T04, T05, T06, T09, T18
**Vlasnik fajlova:** `lib/route.ts` · `app/[[...slug]]/page.tsx`

---

## Cilj

Jedna catch-all ruta koja razrješava **sve javne adrese** — jezik, lokal i stranicu — i statički generiše svaku validnu kombinaciju.

## Zašto jedna ruta, a ne odvojene

Segmenti su dvosmisleni. `/meni` je stranica glavnog lokala, `/seherezada2` je lokal, `/o-nas` je zajednička — a sve tri su **jedan segment**. Next.js ne može razlikovati `app/[lokal]/page.tsx` od `app/[stranica]/page.tsx`; nastaje sudar ruta.

Rješenje je jedan `[[...slug]]` i **resolver koji zna redoslijed razrješavanja**.

---

## Šta se radi

### 1 · `lib/route.ts` — konstante

```ts
export const LOKAL_PAGES  = ['meni','recenzije'] as const;
export const SHARED_PAGES = ['o-nas','halal','galerija','faq','privatnost','uslovi'] as const;
export const SEO_PAGES = [
  'kebab-ljubljana','pizza-ljubljana','burger-ljubljana','falafel-ljubljana',
  'halal-hrana-ljubljana','nocna-hrana-ljubljana','dostava-ljubljana',
  'studentski-meni-ljubljana',
] as const;

/** Slug lokala ne smije biti nijedan od ovih. Provjeravaju T14 i seed. */
export const REZERVISANI = [
  ...LANGS, ...LOKAL_PAGES, ...SHARED_PAGES, ...SEO_PAGES,
  'chef','api','sitemap.xml','robots.txt','_next','favicon.ico','favicon.svg',
] as const;
```

### 2 · Tip rezultata

```ts
export type Route =
  | { kind:'lokal-home'; lang:Lang; lokalSlug:string }
  | { kind:'lokal-page'; lang:Lang; lokalSlug:string; page:'meni'|'recenzije' }
  | { kind:'shared';     lang:Lang; page:SharedPage }
  | { kind:'seo';        lang:Lang; page:SeoPage }
  | { kind:'redirect';   to:string }
  | { kind:'notfound' };
```

### 3 · Resolver — redoslijed je obavezan

```ts
export function resolveRoute(
  slug: string[] = [],
  lokalSlugs: string[],     // svi lokali u stanju 'radi'
  glavniSlug: string,
): Route
```

**Korak 1 — jezik.** Ako je `slug[0]` u `LANGS`:
- ako je `sl` → `{kind:'redirect', to:'/' + ostatak}` *(slovenski nema prefiks; `/sl/meni` je duplikat `/meni`)*
- inače `lang = slug[0]`, ukloni ga

Ako nije → `lang = 'sl'`.

**Korak 2 — ostatak, tim redom:**

| Ostatak | Uslov | Rezultat |
|---|---|---|
| `[]` | — | `lokal-home` sa `glavniSlug` |
| `[x]` | `x === glavniSlug` | `redirect` na adresu bez sluga |
| `[x]` | `x ∈ LOKAL_PAGES` | `lokal-page` sa `glavniSlug` |
| `[x]` | `x ∈ lokalSlugs` | `lokal-home` |
| `[x]` | `x ∈ SHARED_PAGES` | `shared` |
| `[x]` | `x ∈ SEO_PAGES` | `seo` |
| `[l,p]` | `l ∈ lokalSlugs` i `p ∈ LOKAL_PAGES` | `lokal-page` |
| `[l,p]` | `l === glavniSlug` | `redirect` na `/p` |
| bilo šta drugo | — | `notfound` |

> **Redoslijed nije proizvoljan.** `LOKAL_PAGES` se provjerava **prije** `lokalSlugs` — da lokal nazvan `meni` ne bi oteo stranicu menija. Zato postoji lista rezervisanih slugova.

### 4 · Obrnuti smjer — gradnja adresa

Nijedna komponenta ne smije ručno sastavljati adrese. Sve ide kroz:

```ts
export function href(r: Omit<Route,'kind'> & { kind: Route['kind'] }): string;

// primjeri
href({kind:'lokal-page', lang:'sl', lokalSlug:'trubarjeva', page:'meni'})  // "/meni"
href({kind:'lokal-page', lang:'en', lokalSlug:'seherezada2', page:'meni'}) // "/en/seherezada2/meni"
href({kind:'shared', lang:'ar', page:'halal'})                            // "/ar/halal"
```

Pravila: `sl` se izostavlja · glavni lokal se izostavlja · uvijek bez kose crte na kraju.

> Ovo je jedini način da prekidači lokala (T19) i jezika (T22) rade ispravno. Bez toga bi svaki gradio adresu po svome.

### 5 · `app/[[...slug]]/page.tsx`

```ts
export async function generateStaticParams()
export async function generateMetadata({ params })   // detalji: T06
export default async function Page({ params })
```

`generateStaticParams` gradi **sve validne kombinacije** iz `repo`:
- za svaki jezik × svaki lokal → naslovna + `meni` + `recenzije`
- za svaki jezik → zajedničke i SEO stranice
- glavni lokal **samo bez prefiksa**; ne generisati `/{glavniSlug}`
- lokali u stanju `uskoro` ili `zatvoren` se **ne generišu**

`Page` poziva `resolveRoute`, pa u `switch` po `kind` renderuje odgovarajuću stranicu:
- `redirect` → `redirect(to)` iz `next/navigation` *(trajno)*
- `notfound` → `notFound()`
- ostalo → komponenta stranice

**U Fazi 1 stranice mogu biti kosturi** sa naslovom i jednom rečenicom. Puni ih Faza 2.

### 6 · `app/page.tsx` iz T01 se briše

Catch-all pokriva korijen.

---

## Ne raditi u ovom zadatku

- Ne pisati sadržaj stranica — T07, T08, T09
- Ne dirati `Navbar` ni `Footer` — T04
- Ne pisati `loading`/`error`/`not-found` — T05
- Ne pisati sitemap ni metapodatke — T06
- Ne uvoditi prekidače — T19, T22
- `lokalSlugs` i `glavniSlug` **već dolaze iz `repo`**, ne iz konstante — tako T18 ne mijenja ovaj fajl

---

## Verifikacija

Sve provjere na izgrađenoj verziji (`npm run build && npm start`):

- [ ] `/` → naslovna glavnog lokala
- [ ] `/meni` → meni glavnog lokala
- [ ] `/recenzije` → recenzije glavnog lokala
- [ ] `/seherezada2` → naslovna lokala 2
- [ ] `/seherezada2/meni` → meni lokala 2
- [ ] `/o-nas`, `/halal`, `/faq` → zajedničke
- [ ] `/kebab-ljubljana` → SEO stranica
- [ ] `/en/` → naslovna, engleski
- [ ] `/en/seherezada2/meni` → meni lokala 2, engleski
- [ ] `/en/o-nas` → zajednička, engleski
- [ ] **`/sl/meni` → trajno preusmjerenje na `/meni`**
- [ ] **`/trubarjeva` → trajno preusmjerenje na `/`**
- [ ] **`/trubarjeva/meni` → trajno preusmjerenje na `/meni`**
- [ ] `/nepostoji` → 404
- [ ] `/en/nepostoji/meni` → 404
- [ ] `/seherezada2/nepostoji` → 404
- [ ] Lokal 3 (`uskoro`) nema nijednu rutu
- [ ] `href()` za sve kombinacije vraća adresu koju `resolveRoute` vraća nazad na isti rezultat *(kružni test)*

## Gotovo kad

Svaka adresa iz tabele se otvara, preusmjerenja rade, nepostojeće adrese daju 404, a `href()` i `resolveRoute` su međusobno dosljedni.
