# T01 · Migracija na Next.js

**Faza:** 0 · **Preduslov:** — · **Blokira:** sve
**Vlasnik fajlova:** konfiguracija projekta · `app/layout.tsx` · `index.html` → metadata · brisanje mrtvog koda

---

## Cilj

Projekat radi na Next.js App Routeru i **izgleda potpuno identično kao sada**. Nijedna nova funkcija, nijedna izmjena izgleda.

## Zašto ovim redom

Migracija je jedini zadatak koji dira konfiguraciju cijelog projekta. Radi se prva i sama, da se svaka kasnija greška može pripisati funkciji koja se dodaje, a ne alatima. **Ako se poslije ovog zadatka sajt vizuelno razlikuje od sadašnjeg, zadatak nije gotov.**

---

## Šta se radi

### 1 · Alati

Migracija **u postojećem repozitoriju** — čuva se git historija.

```
ukloni    vite  @vitejs/plugin-react  vite.config.ts
dodaj     next
skripte   dev: next dev · build: next build · start: next start · lint: next lint
```

Zadržati bez izmjena: `tailwind.config.js`, `postcss.config.js`, framer-motion, gsap, @gsap/react, lucide-react, clsx, tailwind-merge.

`tsconfig.json` — dodati Next plugin, `paths` alias `@/*` → korijen.

### 2 · Struktura foldera

```
app/
  layout.tsx          korijenski okvir
  page.tsx            PRIVREMENO — renderuje postojeće sekcije; T03 ga zamjenjuje
  globals.css         bivši src/index.css, nepromijenjen
components/           sve iz src/components/, nepromijenjeno
lib/                  prazno, puni ga T02
providers/            iz src/providers/
public/               nepromijenjeno
```

`src/data.ts` privremeno ostaje — **ne prepravljati ga**, T02 preuzima.

### 3 · `app/layout.tsx`

Prenosi ono što je sada u `index.html` i `App.tsx`:

- `<html lang="sl" suppressHydrationWarning>` — atribut `class="dark"` postavlja skripta iz koraka 4
- Fontovi preko `next/font/google`: **Poppins** 600/700/800/900, **Inter** 400/500/600, `display: swap`. Ukloniti `<link>` na Google Fonts.
- `metadata` objekt sa `title` i `description` iz `index.html`
- **Viewport:** `width=device-width, initial-scale=1` — **ukloniti `maximum-scale=1.0`** *(blokira zumiranje, greška pristupačnosti)*
- **Favicon:** `/favicon.svg` *(postoji u `public/`)* — sadašnji `/vite.svg` ne postoji i vraća 404
- Redoslijed omotača: `ThemeProvider` → `LanguageProvider` → `BackgroundPattern` → `Navbar` → `{children}` → `Footer` → `MobileCTA`

### 4 · Tema bez treperenja *(obavezno)*

`ThemeProvider` čita `localStorage` u `useEffect`. Na serveru toga nema, pa se pri prvom učitavanju vidi bljesak pogrešne teme.

U `<head>` ide **blokirajuća inline skripta** koja postavlja klasu prije prvog iscrtavanja:

```html
<script dangerouslySetInnerHTML={{__html:`
(function(){try{
  var t=localStorage.getItem('shere-theme')||'dark';
  if(t==='system')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
  document.documentElement.classList.add(t);
}catch(e){document.documentElement.classList.add('dark')}
})()`}} />
```

`ThemeProvider` se prepravlja da **ne postavlja klasu pri montiranju** — samo pri promjeni.

### 5 · Klijentske komponente

Dodati `'use client'` **samo** na:

```
providers/ThemeProvider.tsx      providers/LanguageProvider.tsx
components/layout/Navbar.tsx     components/layout/MobileCTA.tsx
components/BackgroundPattern.tsx components/Menu.tsx
components/ProductCard.tsx       components/ProductModal.tsx
components/Reviews.tsx
```

`Hero.tsx` i `AboutUs.tsx` **ne dobijaju** oznaku u ovom zadatku — o njima odlučuje T07. Za sada smiju biti klijentske da migracija prođe; T07 odvaja animaciju od teksta.

### 6 · Šta iz `App.tsx` nestaje

Sadašnji `App.tsx` radi tri stvari koje ne rade na serveru:

| Sada | Šta uraditi |
|---|---|
| `footerHeight` + `ResizeObserver` za fiksno podnožje | **Ukloniti.** Podnožje se renderuje jednom, u toku dokumenta. Vizuelni efekat na desktopu, ako je potreban, rješava CSS — vlasnik je T04 |
| `isMobileDevice` iz `window.innerWidth` | Zamijeniti CSS upitima (`lg:` prefiksi). Nema mjerenja u JS-u |
| `selectedProduct` stanje za modal | Seli u `Menu`/`PopularPicks` kao klijentsko stanje — vlasnik je T08 |

> Podnožje se sada renderuje **dvaput** (fiksno na desktopu + inline na mobitelu). Ovdje se svodi na jednu instancu.

### 7 · Brisanje mrtvog koda

```
src/components/SplashScreen.tsx          neimportovan
src/components/MobileFAB.tsx             neimportovan
src/components/DevViewportSwitcher.tsx   neimportovan
src/App.css                              Vite starter, neimportovan
src/lib/utils.ts                         cn() se nigdje ne koristi
src/assets/react.svg  vite.svg  hero.png
public/hero_kebab.png                    808 KB, nekorišten
public/rotisserie_hero_bg.png            936 KB, postoji .webp
public/fast_food_pattern.png             713 KB, postoji .webp
public/icons.svg                         nekorišten
README.md                                Vite starter — prepisati u jednu rečenicu o projektu
```

Prije brisanja potvrditi da nema uvoza: `grep -r "SplashScreen\|MobileFAB\|DevViewportSwitcher\|lib/utils" src/`

### 8 · Privremena `app/page.tsx`

Renderuje postojeće sekcije istim redom kao sada, da se migracija može provjeriti:
`Hero → PopularPicks → AboutUs → Menu → Reviews`

**T03 ovaj fajl briše** i zamjenjuje catch-all rutom.

---

## Ne raditi u ovom zadatku

- Ne uvoditi rute, jezike ni lokale
- Ne dirati `src/data.ts`
- Ne mijenjati `tailwind.config.js` ni `globals.css`
- Ne popravljati tri `<h1>` — vlasnici su T04 *(logo)* i T07 *(dekorativni naslov)*
- Ne dirati `Menu.tsx` filtriranje — vlasnik je T08
- Ne pretvarati slike u WebP

---

## Verifikacija

- [ ] `npm run build` prolazi bez grešaka i TS upozorenja
- [ ] `npm run dev` — sajt izgleda **identično** kao Vite verzija *(uporediti sliku ekrana prije i poslije, desktop i 390 px)*
- [ ] Prebacivanje teme radi i **nema bljeska pogrešne teme** pri osvježavanju
- [ ] Prebacivanje jezika SL/EN i dalje radi
- [ ] Modal jela se otvara i zatvara
- [ ] Favicon se prikazuje, nema 404 u konzoli
- [ ] Zumiranje prstima radi na telefonu
- [ ] Podnožje se pojavljuje **jednom** u DOM-u *(pretraga po adresi u dev alatima)*
- [ ] `view-source:` prikazuje tekst sekcija *(ne samo prazan div)*
- [ ] Nijedan obrisani fajl se nigdje ne uvozi

## Gotovo kad

Sajt radi na Next.js, izgleda identično, tema ne treperi, podnožje je jedno, mrtav kod obrisan, build čist.
