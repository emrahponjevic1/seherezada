# T15 · `/chef` — jela i katalog

**Faza:** 3 · **Preduslov:** T13 · **Paralelno sa:** T14
**Vlasnik fajlova:** `app/chef/jela/` · `app/chef/kategorije/`

---

## Cilj

Katalog jela cijelog brenda — dodavanje, uređivanje, kopiranje i prijevodi. **Bez cijena** — one pripadaju lokalu i rješava ih T16.

## Zašto je katalog odvojen od cijena

Jelo postoji **jednom**: jedan opis, jedna slika, jedan spisak alergena, jedan prijevod. Isto jelo se prodaje u više lokala po različitim cijenama.

Promjena opisa mijenja jelo **svugdje**. Promjena cijene mijenja **samo jedan lokal**. Ako bi cijena bila dio jela, isto jelo bi se moralo unijeti onoliko puta koliko ima lokala — i svaki opis bi se održavao posebno.

```
JELA         katalog — šta je jelo         ← ovaj zadatak
LOKAL_JELA   gdje se prodaje i po koliko   ← T16
```

---

## Ekrani

### 1 · Spisak `/chef/jela`

Tabela: **slika · naziv · kategorija · oznake · u koliko lokala**, sa filtriranjem po kategoriji i pretragom po nazivu.

Kolona *u koliko lokala* je važna — odmah se vidi jelo koje nije ni u jednom meniju.

Radnje: **Uredi · Kopiraj · Deaktiviraj**
Gore: **Dodaj jelo**.

### 2 · Obrazac jela

| Polje | Pravilo |
|---|---|
| Slug | mala slova i crtice, jedinstven, predlaže se iz slovenskog naziva |
| Kategorija | padajući spisak |
| **Naziv** | po jeziku, slovenski obavezan |
| **Opis** | po jeziku, jedna do dvije rečenice |
| **Sastojci** | po jeziku, spisak |
| Alergeni | višestruki izbor iz zadatih *(gluten, laktoza, sezam, orašasti, jaja, riba, soja, gorušica)* |
| Slika | otpremanje — T17. Do tada polje za adresu |
| Opis slike | po jeziku |
| Oznake | halal · vegetarijansko · vegansko · ljuto 0–3 |
| Kalorije | neobavezno |

**Halal je podrazumijevano `true`.** Sadašnji sajt izvodi oznaku iz kategorije, pa burgeri ostaju bez nje iako jesu halal — ovdje je to podatak, ne pretpostavka.

### 3 · Kartice po jeziku

Prevodiva polja se uređuju u karticama:
```
[SL*] [EN] [DE] [BA] [TR] [AR] [ZH]
   ↑ obavezan
```
- Jezik bez prijevoda ima **sivu tačku** na kartici
- Ispod polja napomena: *„Prazno → prikazat će se engleski, pa slovenski"*
- Arapska polja se prikazuju zdesna nalijevo i u obrascu

U Fazi 3 popunjavaju se `sl` i `en`; ostale kartice postoje i čekaju T22.

### 4 · Kopiraj jelo

Za varijante — Doner → Doner XL, ili jelo koje ima samo jedan lokal.

Otvara obrazac popunjen podacima izvornog jela, sa praznim slugom i nazivom `{naziv} (kopija)`.
**Ne kopira** veze sa lokalima — novo jelo nije ni u jednom meniju dok se ne doda kroz T16.

### 5 · Deaktiviranje

Meko. `aktivno = false` uklanja jelo sa sajta i iz svih menija, podaci ostaju. Prikazati u koliko lokala je bilo prije potvrde.

### 6 · Kategorije `/chef/kategorije`

Jednostavan ekran: spisak, dodaj, uredi, redoslijed povuci-i-pusti, aktivna/neaktivna.
Polja: slug, naziv po jeziku, opis po jeziku, redoslijed.

Brisanje kategorije koja ima jela **nije moguće** — baza to odbija *(T10)*. Prikazati koliko jela je sprječava.

---

## Ponašanje obrasca

- Validacija u pregledniku i na serveru
- Nakon snimanja: poništiti keš `jela` i **menije svih lokala** *(promjena opisa pogađa sve)*
- Napuštanje sa nesačuvanim izmjenama → upozorenje
- Greške polje po polje

---

## Ne raditi u ovom zadatku

- **Ne unositi cijene** — nisu svojstvo jela
- Ne dodavati jela u menije lokala — T16
- Ne graditi obradu slika — T17, ovdje samo polje za adresu
- Ne prevoditi sadržaj na de/ba/tr/ar/zh — kartice postoje, sadržaj dolazi u T22

---

## Verifikacija

- [ ] Novo jelo se pojavi u katalogu, ali **ni u jednom meniju**
- [ ] Izmjena opisa mijenja jelo u **svim** lokalima
- [ ] Kopiranje otvara popunjen obrazac sa praznim slugom
- [ ] Kopirano jelo **nije** ni u jednom meniju
- [ ] Postojeći slug odbijen
- [ ] Snimanje bez slovenskog naziva odbijeno
- [ ] Kartica jezika bez prijevoda ima sivu tačku
- [ ] Arapsko polje se prikazuje zdesna nalijevo
- [ ] Deaktivirano jelo nestaje sa sajta iz svih lokala
- [ ] Kolona *u koliko lokala* tačna
- [ ] Brisanje kategorije sa jelima odbijeno uz broj jela
- [ ] Promjena redoslijeda kategorija mijenja redoslijed na sajtu
- [ ] Izmjena jela vidljiva na sajtu ≤ 20 s, na **svim** lokalima gdje se prodaje
- [ ] Nijedno polje za cijenu ne postoji na ovim ekranima

## Gotovo kad

Katalog se uređuje u cjelini, prijevodi imaju svoje kartice, kopiranje radi, a cijene se ovdje ne spominju.
