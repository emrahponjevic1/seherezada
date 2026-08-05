# T08 · Stranica menija

**Faza:** 2 · **Preduslov:** T04 · **Paralelno sa:** T07, T09
**Vlasnik fajlova:** `Menu.tsx` · `ProductCard.tsx` · `ProductModal.tsx` · `app` stranica menija

---

## Cilj

Stranica `/{lokal}/meni` prikazuje **cijeli meni tog lokala** — sve kategorije, sva jela, sve cijene — i **sve to je u serverskom HTML-u**.

## Zašto je ovo najveća tiha greška u sadašnjem sajtu

`Menu.tsx` drži `activeCategory` u stanju i renderuje **samo jednu kategoriju**. Ostalih sedam ne postoji u DOM-u. Za posjetioca je to nevidljivo; za sve ostalo — Google, čitače ekrana, pretragu unutar stranice `Ctrl+F` — ostatak menija ne postoji.

Zato: **sva jela u DOM-u, filtriranje isključivo vizuelno.**

---

## Šta se radi

### 1 · Filtriranje bez uklanjanja

Sadašnje: `menuItems.filter(i => i.category === activeCategory)` → renderuje se samo to.
Novo: **sve sekcije se renderuju uvijek**, a tabovi mijenjaju samo vidljivost.

```
[Vse][Kebab][Pice][Burgeri][Falafel][Ostalo][Dodatki][Pijača][Meni]

<section data-kat="kebab">   H2 Kebab      … sve kartice …
<section data-kat="pice">    H2 Pice       … sve kartice …
…                                            ← uvijek u HTML-u
```

Sakrivanje ide **CSS-om**, ne uslovnim renderovanjem — `hidden` klasa ili `data` atribut sa CSS pravilom. Podrazumijevano stanje je **Vse** *(sve vidljivo)*, ne „Kebab" kao sada.

> Tab „Vse" mora biti podrazumijevan. Ako je podrazumijevan „Kebab", posjetilac bez JavaScripta vidi jednu kategoriju.

Drag-to-scroll traku tabova zadržati.

### 2 · Struktura stranice

```
H1   Meni in cene — Šeherezada {ulica}
     uvodni pasus, 50–70 riječi                 ← demo tekst prihvatljiv
     [tabovi kategorija]

H2   Kebab            … kartice …
H2   Pice             … kartice …
…

     [Naroči prek Wolta]  [Naroči prek Glova]  [Pokliči]
```

Podaci iz `repo.getMeni(lokalSlug)`. Prazne kategorije se **izostavljaju u cjelini** *(ni tab ni naslov)* — pravilo iz T05.

Dugmad na dnu koriste `woltUrl`, `glovoUrl` i `telefon` **tog** lokala.

### 3 · Kartica jela

Zadržati oba prikaza — vodoravni red na mobitelu, 3D kartica na desktopu.

| Šta se mijenja | Kako |
|---|---|
| **Halal oznaka** | Sada se izvodi iz kategorije (`ProductCard.tsx:152-177`), pa **burgeri ostaju bez nje iako jesu halal**. Čitati iz `jelo.halal` |
| Ostale oznake | `vegetarijansko`, `vegansko`, `ljuto` — iz podatka, ne iz kategorije |
| Cijena | `formatCijena(stavka.cijena, lang)` |
| Slika | `<SlikaJela>` iz T05 — podnosi jelo bez slike |
| `loading` | `eager` samo za prve četiri kartice, ostalo `lazy` *(sada je `eager` na svima)* |
| `width`/`height` | Dodati na svaku sliku *(sada nema — sadržaj poskakuje pri učitavanju)* |
| Naslov | `<h3>` — ostaje |

### 4 · Modal jela

Ostaje kakav jeste — otvara se klikom, drži se u klijentskom stanju, **bez vlastite adrese**.

Razlog: sadržaj modala *(naziv, opis, sastojci, alergeni, cijena)* je **već u kartici u HTML-u**. Modal je udobniji prikaz istog, pa mu adresa ne treba.

Mijenja se samo: halal i ostale oznake iz podatka, cijena kroz `formatCijena`, Wolt i Glovo linkovi trenutnog lokala.

### 5 · Sekcija menija na naslovnoj

Ista komponenta, uži prikaz. Prima `varijanta: 'puna' | 'izvod'`:
- `izvod` — tabovi + kartice, bez `<h1>` i uvodnog pasusa, sa dugmetom **Poglej cel meni**
- `puna` — cijela stranica

Jedna komponenta, dva prikaza — ne dvije kopije.

---

## Ne raditi u ovom zadatku

- Ne dirati `Navbar`, `Footer`, `MobileCTA` — T04
- Ne dirati ostale sekcije naslovne — T07
- Ne dodavati prekidač lokala — T19
- Ne uvoditi filtere po alergenima ni pretragu — nije u dogovorenom obimu
- **Ne praviti adrese sa parametrima** za kategorije *(`?kat=kebab`)* — filter je vizuelan

---

## Verifikacija

- [ ] `view-source:` na `/meni` sadrži **sva 23 jela i svih 23 cijena**, bez obzira koji je tab aktivan
- [ ] `Ctrl+F` po stranici nalazi jelo iz kategorije koja nije otvorena
- [ ] Sa isključenim JavaScriptom vidljive su **sve** kategorije
- [ ] Podrazumijevani tab je **Vse**
- [ ] `/seherezada2/meni` prikazuje cijene lokala 2 *(za 0,50 € više)*
- [ ] Kategorija koju lokal nema se **ne pojavljuje** ni kao tab ni kao naslov
- [ ] **Burgeri imaju halal oznaku** *(sadašnja greška ispravljena)*
- [ ] Svaka slika ima `width` i `height`; nema pomjeranja rasporeda pri učitavanju
- [ ] Samo prve četiri slike su `eager`
- [ ] Wolt, Glovo i telefon vode na podatke **tog** lokala
- [ ] Modal se otvara, zatvara, zaključava skrolanje kao prije
- [ ] Tačno jedan `<h1>`; kategorije su `<h2>`, jela `<h3>`
- [ ] Izgled kartica identičan sadašnjem na desktopu i 390 px

## Gotovo kad

Cijeli meni je u HTML-u, tabovi filtriraju vizuelno, cijene i kontakti prate lokal, halal oznaka je tačna.
