# T12 · Keširanje i revalidacija

**Faza:** 3 · **Preduslov:** T11 · **Blokira:** T18
**Vlasnik fajlova:** oznake keša u `lib/repo.supabase.ts` · `lib/revalidate.ts`

---

## Cilj

Stranice su **statične i brze**, ali se izmjena u `/chef` vidi **za dvadesetak sekundi** bez ponovne objave sajta.

## Zašto odmah nakon baze, a ne kasnije

Keširanje se ne dodaje na gotov sistem — ono određuje **kako se piše svaki upit**. Ako se ostavi za kraj, svaki poziv repozitorija se prepravlja. Uz to, admin (T13–T17) mora znati koje oznake da poništi kad snimi izmjenu — a te oznake se definišu ovdje.

---

## Šta se radi

### 1 · Strategija po tipu podataka

| Podatak | Ponašanje | Zašto |
|---|---|---|
| Lokali, kategorije, jela, meni | **statično**, poništava se oznakom | Mijenja se rijetko, čita se stalno |
| Recenzije *(T21)* | osvježavanje na 24 h | Vanjski API, ima ograničenja |
| „Otvoreno sada" | **računa se u pregledniku** | Zavisi od trenutka, ne smije se kеširati |
| `/chef` | **bez keša** | Uvijek svježe stanje |

> Značka „Odprto zdaj" ne smije biti dio statičnog HTML-a — inače bi u 03:00 pisalo ono što je važilo pri gradnji. Radno vrijeme se renderuje serverski, a **status otvoreno/zatvoreno računa klijentska komponenta** iz `jeOtvoren()`.

### 2 · Oznake keša

```ts
export const TAG = {
  lokali:  'lokali',
  meni:    (lokalSlug: string) => `meni:${lokalSlug}`,
  jela:    'jela',
  kategorije: 'kategorije',
} as const;
```

Svaka metoda repozitorija označava svoj rezultat. `getMeni('seherezada2')` nosi `meni:seherezada2` **i** `jela` — jer promjena opisa jela pogađa sve lokale, a promjena cijene samo jedan.

### 3 · Šta se poništava kad

| Izmjena u `/chef` | Poništiti |
|---|---|
| Cijena ili dostupnost jela u lokalu | `meni:{lokal}` |
| Opis, slika ili alergeni jela | `jela` + `meni:*` *(svi lokali)* |
| Dodavanje/uklanjanje jela iz lokala | `meni:{lokal}` |
| Podaci lokala *(adresa, telefon, vrijeme)* | `lokali` + `meni:{lokal}` |
| Novi lokal, brisanje, promjena glavnog | `lokali` + putanje |
| Kategorija | `kategorije` + `meni:*` |

`lib/revalidate.ts` izlaže po jednu funkciju za svaki slučaj. **Admin nikad ne zove `revalidateTag` direktno** — uvijek preko ovih funkcija, da se pravilo drži na jednom mjestu.

### 4 · Poništavanje putanja

Promjena sluga lokala ili glavnog lokala mijenja **skup adresa**, ne samo sadržaj. Tada uz oznake ide i `revalidatePath('/', 'layout')`.

### 5 · Sitemap

Sitemap iz T06 čita `repo`, pa nosi oznaku `lokali`. Novi lokal ga poništava sam.

---

## Ne raditi u ovom zadatku

- Ne graditi admin ekrane — T14–T17, samo im ostaviti funkcije
- Ne uvoditi Redis ni vanjski keš — ugrađeni je dovoljan
- Ne kеširati recenzije — T21 ima svoje pravilo

---

## Verifikacija

- [ ] Prvo učitavanje `/meni` radi jedan upit; drugo učitavanje **nijedan**
- [ ] Poziv `revalidirajMeni('trubarjeva')` osvježava `/meni`, a **ne dira** `/seherezada2/meni`
- [ ] Poziv `revalidirajJela()` osvježava menije **oba** lokala
- [ ] Promjena podataka lokala osvježava podnožje na svim stranicama
- [ ] Značka „Odprto zdaj" tačna **bez ponovne gradnje** — provjeriti pomjeranjem sata na uređaju
- [ ] Nakon dodavanja lokala u bazu, sitemap ga sadrži bez ponovne objave
- [ ] `/chef` uvijek prikazuje trenutno stanje, nikad kеširano
- [ ] Vrijeme od snimanja do vidljivosti na sajtu **≤ 20 s**

## Gotovo kad

Stranice su statične, izmjene stižu za dvadesetak sekundi, a poništavanje pogađa samo ono što se stvarno promijenilo.
