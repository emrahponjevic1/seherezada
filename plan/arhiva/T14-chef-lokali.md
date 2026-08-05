# T14 · `/chef` — lokali

**Faza:** 3 · **Preduslov:** T13 · **Paralelno sa:** T15
**Vlasnik fajlova:** `app/chef/lokali/`

---

## Cilj

Vlasnik sam dodaje, uređuje i kopira lokale. **Novi lokal sam stvara svoje adrese** i pojavljuje se na sajtu — bez programera.

---

## Ekrani

### 1 · Spisak `/chef/lokali`

Tabela: **naziv · slug · adresa · telefon · stanje · broj jela u meniju**, poredana po `redoslijed`.
Glavni lokal ima oznaku ⭐. Stanje kao značka: `radi` zeleno · `uskoro` žuto · `zatvoren` sivo.

Radnje po redu: **Uredi · Kopiraj · Meni** *(vodi u T16)* · **Postavi kao glavni** · **Promijeni stanje**
Gore: dugme **Dodaj lokal** i povuci-i-pusti za redoslijed.

### 2 · Obrazac — dodavanje i uređivanje

| Polje | Pravilo |
|---|---|
| Slug | mala slova, crtice, bez šumnika · **jedinstven** · **ne smije biti rezervisan** · uz polje prikazati adresu koja nastaje: `seherezada.net/{slug}` |
| Naziv | obavezno |
| Ulica | obavezno — ulazi u naslove stranica |
| Puna adresa | obavezno |
| Telefon | obavezno, međunarodni format `+386...` |
| E-mail, koordinate | neobavezno |
| Radno vrijeme | sedam redova; svaki „zatvoreno" ili od–do. **Ako je `do` manje od `od`, prikazati napomenu „prelazi ponoć"** — da vlasnik vidi da je namjerno |
| Wolt / Glovo | neobavezno, provjera da je adresa |
| Google Place ID | neobavezno, koristi ga T21 |
| **Uvodni tekst** | **obavezno**, po jeziku. Kartice po jeziku; slovenski obavezan |
| Stanje | radi · uskoro · zatvoren |

**Zašto je uvodni tekst obavezan:** bez njega su naslovne lokala gotovo identične i Google ih čita kao prazan sadržaj. Obrazac ne smije dozvoliti snimanje bez njega.

**Zašto se slug ne mijenja olako:** promjena mijenja javne adrese. Pri izmjeni postojećeg lokala prikazati upozorenje: *„Spreminjanje naslova bo pokvarilo obstoječe povezave."* i tražiti potvrdu.

### 3 · Kopiraj lokal ⭐

Dijalog: novi slug, novi naziv, pa **kopira sve redove iz `lokal_jela`** izvornog lokala.

```
Kopiraj "Trubarjeva" →  novi slug:  [__________]
                        novi naziv: [__________]
                        ☑ kopiraj meni (23 jela sa cijenama)
                        ☐ kopiraj radno vrijeme
```

Ne kopira se: `glavni`, `googlePlaceId`, `woltUrl`, `glovoUrl`, `uvodniTekst` — to je po lokalu jedinstveno.
Novi lokal nastaje u stanju **`uskoro`**, da se ne pojavi na sajtu prije nego se dovrši.

### 4 · Postavi kao glavni

Potvrda koja objašnjava posljedicu:
> *„Lokal bo prestavljen na `seherezada.net/`, trenutni glavni pa na `seherezada.net/{slug}`."*

U jednoj transakciji: stari `glavni = false`, novi `glavni = true`. Baza ionako brani dva glavna *(indeks iz T10)*.
Poslije: poništiti keš `lokali` **i putanje** — mijenja se skup adresa.

### 5 · Brisanje

**Meko** — nema pravog brisanja. Stanje `zatvoren` uklanja lokal sa sajta, podaci ostaju.
Ako neko ipak traži trajno brisanje: zabraniti za glavni lokal, i tražiti upisivanje sluga kao potvrdu.

---

## Ponašanje obrasca

- Validacija **i u pregledniku i na serveru**. Serverska je jedina koja se računa
- Greške polje po polje, ne jedna zbirna poruka
- Dugme za snimanje onemogućeno dok traje snimanje
- Nakon snimanja: poruka o uspjehu i **poništavanje keša** preko funkcija iz T12
- Napuštanje sa nesačuvanim izmjenama → upozorenje

---

## Ne raditi u ovom zadatku

- Ne uređivati meni ni cijene — T16
- Ne uređivati katalog jela — T15
- Ne praviti otpremanje slika — T17
- Ne dirati javni sajt

---

## Verifikacija

- [ ] Novi lokal se pojavi u spisku i u bazi
- [ ] Lokal u stanju `radi` **sam stvara** `/{slug}`, `/{slug}/meni`, `/{slug}/recenzije`
- [ ] Novi lokal se pojavi u `/sitemap.xml` bez izmjene koda
- [ ] Slug `meni` odbijen uz jasnu poruku
- [ ] Slug `Bežigrad` odbijen *(velika slova, šumnik)*
- [ ] Postojeći slug odbijen
- [ ] Snimanje bez uvodnog teksta **odbijeno**
- [ ] Kopiranje prenosi svih 23 jela sa cijenama; novi lokal u stanju `uskoro`
- [ ] Kopirani lokal **nema** Wolt, Glovo, Place ID ni uvodni tekst
- [ ] „Postavi kao glavni" prebacuje adrese; stari glavni dobija svoj slug; **stare adrese preusmjeravaju**
- [ ] Lokal `zatvoren` nestaje sa sajta, iz sitemapa i iz prekidača
- [ ] Radno vrijeme sa prelaskom ponoći prikazuje napomenu i ispravno se snima
- [ ] Izmjena lokala osvježava podnožje na sajtu ≤ 20 s
- [ ] Promjena sluga prikazuje upozorenje prije snimanja

## Gotovo kad

Lokali se dodaju, uređuju, kopiraju i gase kroz sučelje; novi lokal sam stvara adrese i ulazi u sitemap.
