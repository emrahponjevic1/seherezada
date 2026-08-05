# T05 · Stanja — učitavanje, greška, 404

**Faza:** 1 · **Preduslov:** T03 · **Paralelno sa:** T04, T06
**Vlasnik fajlova:** `app/loading.tsx` · `app/error.tsx` · `app/not-found.tsx` · `app/global-error.tsx` · `components/stanja/`

---

## Cilj

Sajt se ponaša pristojno kad nešto nedostaje ili pukne — umjesto praznog ekrana ili neuhvaćene greške.

## Zašto sada, a ne kasnije

`resolveRoute` iz T03 već vraća `notfound`, ali ne postoji stranica koja bi se prikazala. Uz to, čim T11 uvede bazu, upiti mogu otkazati — a tada je kasno smišljati kako izgleda greška. Ove komponente se pišu jednom i koriste kroz cijeli projekat.

---

## Šta se radi

### 1 · `not-found.tsx` — 404

Puna stranica u postojećem dizajnu: veliki naslov u `font-poppins font-black`, jedna rečenica, pa dva dugmeta — **Domov** i **Poglej meni** — u stilu heroja (bijelo puno + stakleno).

Ne izmišljati ilustraciju. Koristiti `BackgroundPattern` koji već postoji.

Prikazuje se za: nepostojeće adrese, lokal koji ne postoji, lokal u stanju `uskoro` ili `zatvoren`, jelo koje je uklonjeno.

### 2 · `error.tsx` — neuhvaćena greška

Klijentska komponenta *(Next to zahtijeva)*. Prima `error` i `reset`.

Sadrži: neutralnu poruku *(nikad tehnički detalj ni stack)*, dugme **Poskusi znova** koje zove `reset()`, i link na naslovnu. U razvoju smije ispisati `error.message`; u produkciji ne.

### 3 · `global-error.tsx`

Rezerva za slučaj da pukne sam korijenski okvir. Mora imati vlastite `<html>` i `<body>`. Minimalan, bez zavisnosti od provajdera.

### 4 · `loading.tsx` i kosturi

Stranice su statički generisane, pa se `loading.tsx` rijetko vidi — ali je obavezan za rute koje kasnije postanu dinamične *(recenzije iz API-ja, T21)*.

Napraviti komponente kostura u `components/stanja/`:

| Komponenta | Za šta |
|---|---|
| `KosturKartice` | mjesto kartice jela — isti razmaci i `rounded-2xl` |
| `KosturSekcije` | naslov + mreža kartica |
| `KosturRecenzija` | mjesto karusela |

Bez animiranog sjaja i novih boja — `bg-muted/40` i `animate-pulse` koji već postoje.

### 5 · Prazna stanja

Nisu greške; sistem radi ispravno, samo nema šta prikazati.

| Slučaj | Šta se prikaže |
|---|---|
| Lokal bez ijednog jela | „Meni za ta lokal se pripravlja." + link na drugi lokal |
| Kategorija bez jela | Kategorija se **ne prikazuje uopšte** *(ni tab ni naslov)* |
| Lokal bez recenzija | „Še ni mnenj." + dugme za ostavljanje recenzije |
| Jelo bez slike | Rezervni okvir u boji brenda sa ikonom pribora, **isti odnos stranica** kao slika |
| Lokal `uskoro` | Kartica sa oznakom *Kmalu*, **bez linka** |

> Prazne kategorije se izostavljaju, ne prikazuju prazne. Lokal 2 nema neka jela — inače bi mu meni bio pun praznih naslova.

### 6 · Rezervna slika

Sada sva jela imaju sliku iz `data.ts`. Kad T15 dozvoli jela bez slike, treba mjesto. Napraviti `<SlikaJela>` koja prima `slikaUrl` i pada na rezervni okvir. Sve kartice je koriste od početka.

---

## Ne raditi u ovom zadatku

- Ne dirati postojeće sekcije ni stranice
- Ne uvoditi biblioteku za obavještenja ni animacije
- Ne pisati logiku ponovnog pokušaja za mrežu — T21 rješava svoj slučaj

---

## Verifikacija

- [ ] `/nepostoji` prikazuje 404 stranicu u dizajnu sajta, ne Next.js zadanu
- [ ] `/lokal-koji-ne-postoji/meni` → 404
- [ ] Lokal u stanju `uskoro` → 404 na svojoj adresi
- [ ] Namjerno bacanje greške u stranici prikazuje `error.tsx`, a „Poskusi znova" ponovo učitava
- [ ] U produkcijskoj verziji poruka greške **ne sadrži** tehnički detalj
- [ ] Lokal bez jela prikazuje poruku, ne prazan ekran
- [ ] Prazna kategorija se ne pojavljuje ni kao tab ni kao naslov
- [ ] Jelo bez slike prikazuje rezervni okvir **bez pomjeranja rasporeda**
- [ ] Kosturi imaju iste dimenzije kao sadržaj koji zamjenjuju *(nema skoka)*
- [ ] Nijedna nova boja ni animacija

## Gotovo kad

Svaki predviđeni slučaj — nema stranice, nema podataka, nema slike, puklo je — ima svoj prikaz u postojećem dizajnu.
