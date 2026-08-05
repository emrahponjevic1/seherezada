# T06 · Metapodaci, sitemap, robots

**Faza:** 1 · **Preduslov:** T03 · **Paralelno sa:** T04, T05
**Vlasnik fajlova:** `generateMetadata` u `app/[[...slug]]/page.tsx` · `app/sitemap.ts` · `app/robots.ts` · `lib/meta.ts`

---

## Cilj

Svaka ruta ima **svoj naslov i opis**, a sitemap i robots se generišu iz istog izvora kao rute — pa rade i kad lokali postanu dinamični.

## Zašto sada

Sitemap mora čitati iz `repo`, ne iz ukucane liste. Ako se sada napiše kao ukucana lista, T18 ga prepravlja. Napisan nad `repo`, radi i kad novi lokal dođe iz `/chef` — bez izmjene koda.

> Ovo nije SEO zadatak. Naslov kartice preglednika i pregled pri dijeljenju linka su dio toga kako sajt radi.

---

## Šta se radi

### 1 · `lib/meta.ts` — naslovi po tipu rute

Jedna funkcija koja iz `Route` i podataka vraća naslov i opis:

```ts
export function metaZaRutu(route: Route, ctx: { lokal?: Lokal; lang: Lang }):
  { title: string; description: string }
```

Obrazac po tipu:

| Tip rute | Naslov |
|---|---|
| `lokal-home`, glavni | `Šeherezada — Halal kebab & fast food Ljubljana` |
| `lokal-home`, ostali | `Šeherezada {ulica} — Halal kebab & fast food` |
| `lokal-page` meni | `Meni in cene — Šeherezada {ulica}` |
| `lokal-page` recenzije | `Mnenja gostov — Šeherezada {ulica}` |
| `shared` | `{naziv stranice} — Šeherezada` |
| `seo` | `{fraza} — Šeherezada` |

Naslovi i opisi su **prevodivi** — drže se kao `Prevod` i idu kroz `t()` iz T02.

**Nijedna dvije rute ne smiju imati isti naslov.** Zato ulica ulazi u naslov lokala.

### 2 · `generateMetadata`

Za svaku rutu postavlja:
- `title`, `description` iz `metaZaRutu`
- `alternates.canonical` — puna adresa iz `href()`
- `openGraph`: `title`, `description`, `url`, `type: 'website'`, `siteName`, `locale`, `images`
- `twitter`: `card: 'summary_large_image'`, `title`, `description`, `images`

`alternates.languages` *(hreflang)* se **ne popunjava sada** — to je T22. Ostaviti mjesto sa komentarom.

### 3 · Slika za dijeljenje

Sadašnji `og:image` pokazuje na Unsplash adresu. Zamijeniti **lokalnom slikom** iz `public/` — `rotisserie_hero_bg.webp` je dovoljna dok ne stignu prave.

Dodati `og:image:width`, `og:image:height`, `og:image:alt`. Bez dimenzija se pregled na Facebooku i WhatsAppu često ne prikaže.

### 4 · `app/sitemap.ts`

Gradi se iz `repo` — **nikad ukucana lista**:

```
za svaki lokal (stanje 'radi'):
    naslovna · meni · recenzije
za zajedničke i SEO stranice:
    po jedan unos
za svaki jezik:
    ponoviti gornje sa prefiksom
```

Pravila:
- glavni lokal **samo bez prefiksa** — ne dodavati `/{glavniSlug}`
- slovenski **bez prefiksa**
- lokali `uskoro` i `zatvoren` se **ne uključuju**
- `/chef` i `/api` se **ne uključuju**
- `lastModified` iz podataka gdje postoji

U Fazi 1 postoje samo `sl` i `en`; petlja po jezicima ide odmah, pa T22 ne dira ovaj fajl.

### 5 · `app/robots.ts`

```
Allow: /
Disallow: /chef
Disallow: /api
Sitemap: {BASE_URL}/sitemap.xml
```

`BASE_URL` iz env varijable — vlasnik je T24.

### 6 · `/chef` van indeksa

U `app/chef/layout.tsx` *(pravi ga T13)* ide `robots: { index:false, follow:false }`. Ovdje samo zabilježiti kao zahtjev prema T13.

---

## Ne raditi u ovom zadatku

- Ne pisati `hreflang` — T22
- Ne pisati schema.org strukturirane podatke — poslije Faze 5
- Ne dirati sadržaj stranica
- Ne optimizovati slike — poslije Faze 5

---

## Verifikacija

- [ ] Svaka ruta ima **svoj** `<title>` — provjeriti u izvornom kodu, ne u dev alatima
- [ ] Nijedne dvije rute nemaju isti naslov *(uporediti `/meni` i `/seherezada2/meni`)*
- [ ] Svaka ruta ima `<meta name="description">`
- [ ] `canonical` na svakoj stranici pokazuje na sebe, punom adresom
- [ ] `og:image` pokazuje na **lokalnu** sliku i ima dimenzije
- [ ] `/sitemap.xml` se otvara i sadrži sve rute obje lokacije
- [ ] Sitemap **ne sadrži** `/{glavniSlug}`, `/sl/...`, `/chef`, lokal `uskoro`
- [ ] `/robots.txt` zabranjuje `/chef` i navodi sitemap
- [ ] Dodavanje lokala u podatke pojavi ga u sitemapu **bez izmjene koda**

## Gotovo kad

Svaka ruta ima jedinstven naslov i opis, sitemap se gradi iz repozitorija, robots zabranjuje admin.
