# T16 · `/chef` — meni lokala i cijene

**Faza:** 3 · **Preduslov:** T14, T15 · **Paralelno sa:** T17
**Vlasnik fajlova:** `app/chef/meni/`

---

## Cilj

Sastavljanje menija svakog lokala iz kataloga, i uređivanje **svih cijena na jednom ekranu**.

## Zašto je ovo srce admina

Ovdje se spajaju dvije prethodne cjeline: lokali *(T14)* i katalog *(T15)*. Sve dosad je bilo pripremanje — ovdje vlasnik radi ono što radi svaki dan.

**Novi lokal počinje praznog menija.** Katalog je biblioteka; meni je izbor iz nje.

---

## Ekrani

### 1 · Meni lokala `/chef/meni/{lokal}`

Gore prekidač lokala — koji se meni uređuje.

Jela grupisana po kategorijama, svako sa svojim redom:

```
KEBAB                                                   [+ Dodaj jelo]
  ⠿  Doner Kebab        [ 8,50 ] €   ☑ dostupno  ☐ izdvojeno   [Ukloni]
  ⠿  Kebab Jufka        [ 9,50 ] €   ☑ dostupno  ☑ izdvojeno   [Ukloni]

PICE                                                    [+ Dodaj jelo]
  ⠿  Margerita          [ 9,50 ] €   ☑ dostupno  ☐ izdvojeno   [Ukloni]
```

- **Cijena se uređuje u samom redu** — bez otvaranja jela
- `⠿` povuci-i-pusti za redoslijed unutar kategorije
- **dostupno** — privremeno sakriveno *(jelo je nestalo danas)*, red ostaje
- **izdvojeno** — pojavljuje se u „Priljubljene izbire" na naslovnoj
- **Ukloni** — briše red iz `lokal_jela`; jelo ostaje u katalogu

Kategorija bez ijednog jela se prikazuje kao prazna sa dugmetom za dodavanje — na sajtu se ne pojavljuje uopšte *(pravilo iz T05)*.

### 2 · Dodaj jelo iz kataloga ⭐

Ovo je najčešća radnja u cijelom adminu.

```
Dodaj jelo v meni — Šeherezada Slovenska

[ pretraga… ]                    kategorija: [ sve ▾ ]

☐  Doner Kebab       Kebab      već v meniju
☑  Kebab Jufka       Kebab      cijena: [ 10,00 ] €
☑  Margerita         Pice       cijena: [ 10,00 ] €
☐  Pomfrit           Dodatki    cijena: [      ] €

                                    [Prekliči]  [Dodaj 2 jedi]
```

- Spisak **svih jela iz kataloga**, sa pretragom i filterom
- Jela koja su već u meniju su označena i **ne mogu se dodati dvaput**
- Cijena se upisuje odmah pri odabiru — obavezna
- Više jela odjednom

**Prečica:** dugme *„Predlagaj cene iz drugega lokala"* — prepiše cijene odabranog lokala u polja, pa se dotjeraju. Otvaranje novog lokala tako traje minute, ne sate.

### 3 · Tabela cijena `/chef/cijene` ⭐

Svi lokali odjednom — jela u redovima, lokali u kolonama.

```
JELO                 TRUBARJEVA   SLOVENSKA
──────────────────────────────────────────────
Doner Kebab          [ 8,50 ]     [ 9,00 ]
Kebab Jufka          [ 9,50 ]     [10,00 ]
Margerita            [ 9,50 ]     [10,00 ]
Študentski meni      [ 3,00 ]     [   —  ]     ← nije u meniju
```

- Klik na polje, upis, snimanje pri izlasku iz polja
- `—` znači da jelo nije u meniju tog lokala; klik nudi dodavanje
- Filter po kategoriji, pretraga po nazivu
- **„Primijeni na sve lokale"** po redu — za jela koja svuda koštaju isto
- Broj kolona prati broj lokala; vodoravno skrolanje kad ih je više

> Ovo je ekran koji rješava problem održavanja desetina cijena. Bez njega bi promjena cijene jednog jela u tri lokala značila tri odvojena otvaranja.

### 4 · Radno vrijeme i praznici

Na ekranu lokala *(T14)* ili zasebno: sedam dana, plus **izuzeci po datumu** — praznici, kolektivni godišnji, drugačije vrijeme za Ramazan.

Izuzetak: datum, zatvoreno ili drugo vrijeme, napomena. Ima prednost nad redovnim vremenom.

### 5 · Pregled prije objave

Dugme **Predogled** otvara javnu stranicu lokala u novoj kartici sa parametrom koji zaobilazi keš — da vlasnik vidi izmjenu odmah, prije nego stigne do svih posjetilaca.

---

## Ponašanje

- Snimanje pri izlasku iz polja, sa jasnom oznakom stanja *(sprema se / spremljeno / napaka)*
- Neuspjelo snimanje **vraća staru vrijednost** i prikazuje grešku
- Nakon izmjene: poništiti `meni:{lokal}` *(T12)*
- Cijena: broj sa dvije decimale, zarez i tačka se oboje prihvataju, negativna odbijena
- Svaka izmjena bilježi vrijeme

---

## Ne raditi u ovom zadatku

- Ne uređivati opise, slike ni alergene — T15
- Ne uređivati podatke lokala — T14
- Ne praviti otpremanje slika — T17
- Ne praviti historiju izmjena cijena

---

## Verifikacija

- [ ] Novi lokal ima **prazan meni**
- [ ] Dodavanje iz kataloga upisuje red u `lokal_jela` sa unesenom cijenom
- [ ] Isto jelo se **ne može dodati dvaput** u isti lokal
- [ ] „Predlagaj cene iz drugega lokala" popuni polja
- [ ] Izmjena cijene u redu snima se bez otvaranja jela
- [ ] „Ukloni" briše iz menija, ali jelo **ostaje u katalogu**
- [ ] Isključivanje **dostupno** sakriva jelo na sajtu, red ostaje
- [ ] Uključivanje **izdvojeno** pojavljuje jelo u „Priljubljene izbire"
- [ ] Promjena redoslijeda mijenja redoslijed na sajtu
- [ ] Tabela cijena prikazuje sve lokale; `—` za jela van menija
- [ ] „Primijeni na sve lokale" mijenja red u svim lokalima gdje jelo postoji
- [ ] Negativna cijena odbijena
- [ ] `9,50` i `9.50` se oboje prihvataju
- [ ] Neuspjelo snimanje vraća staru vrijednost
- [ ] Izmjena vidljiva na sajtu ≤ 20 s, i **samo** u tom lokalu
- [ ] Izuzetak za praznik ima prednost nad redovnim vremenom

## Gotovo kad

Meni se sastavlja iz kataloga, cijene se uređuju u redu i u zbirnoj tabeli, a izmjene pogađaju samo svoj lokal.
