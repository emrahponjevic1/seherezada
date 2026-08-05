# T18 · Dinamički lokali u rutama

**Faza:** 4 · **Preduslov:** T12, T14 · **Blokira:** T19, T20, T21
**Vlasnik fajlova:** `app/[[...slug]]/page.tsx` *(samo `generateStaticParams`)* · `lib/route.ts` *(dopuna)*

---

## Cilj

Lokal dodan kroz `/chef` **sam stvara svoje adrese** i pojavljuje se na sajtu — bez izmjene koda i bez ponovne objave.

## Zašto je ovo mali zadatak

`resolveRoute` iz T03 već prima `lokalSlugs` i `glavniSlug` kao argumente, a `generateStaticParams` već čita iz `repo`. Ako je T03 urađen kako je propisano, ovdje se **potvrđuje da lanac radi** i rješavaju rubni slučajevi.

Ako se ispostavi da su slugovi negdje ukucani — to je greška iz T03; ispraviti tamo.

---

## Šta se radi

### 1 · Provjera lanca

```
/chef doda lokal
      ↓ poništi keš 'lokali' (T12)
generateStaticParams čita repo.getLokali()
      ↓
nastaju /{slug}, /{slug}/meni, /{slug}/recenzije
      ↓
sitemap ih preuzima (T06)
```

Ako bilo koja karika traži izmjenu koda — nije završena.

### 2 · Rubni slučajevi

| Slučaj | Ponašanje |
|---|---|
| Lokal `uskoro` | **Nema ruta.** Kartica na naslovnoj sa oznakom *Kmalu*, bez linka. Van sitemapa |
| Lokal `zatvoren` | Nema ruta. Postojeće adrese → **410** ili 404. Van prekidača i sitemapa |
| Promjena sluga | Stara adresa → **trajno preusmjerenje** na novu |
| Promjena glavnog lokala | Stari glavni dobija `/{slug}`, novi ide na `/`. Obje stare adrese preusmjeravaju |
| Lokal bez ijednog jela | Naslovna i recenzije rade; meni prikazuje prazno stanje *(T05)* |

### 3 · Preusmjerenja pri promjeni sluga

Promjena javne adrese lomi postojeće linkove. Tabela preusmjerenja:

```sql
create table preusmjerenja (
  stari_slug text primary key,
  novi_slug  text not null,
  created_at timestamptz default now()
);
```

Kad `/chef` mijenja slug lokala, upisuje red. `resolveRoute` prije nego vrati `notfound` provjeri tabelu i vrati `redirect`.

> Bez ovoga svaka promjena sluga tiho lomi sve podijeljene linkove i QR kodove.

### 4 · Nema statične stranice → šta onda

Novi lokal dodan nakon gradnje nema pripremljenu stranicu. Postavka mora **generisati je na prvi zahtjev** i zadržati *(`dynamicParams` uključen)*, ne vraćati 404.

Provjeriti izričito: dodati lokal na produkciji i otvoriti njegovu adresu **bez ponovne objave**.

### 5 · Redoslijed provjere u resolveru

Podsjetnik iz T03 — `LOKAL_PAGES` se provjerava **prije** `lokalSlugs`. Sa dinamičnim lokalima to postaje stvarni rizik, jer slugove sad unosi čovjek. Zaštita je trostruka:
1. redoslijed u resolveru
2. lista rezervisanih u obrascu *(T14)*
3. trigger u bazi *(T10)*

---

## Ne raditi u ovom zadatku

- Ne graditi prekidač lokala — T19
- Ne dirati kartice na naslovnoj — T20
- Ne povezivati recenzije — T21
- Ne mijenjati logiku resolvera osim dopune za preusmjerenja

---

## Verifikacija

- [ ] Novi lokal iz `/chef` **bez ponovne objave**: `/{slug}` se otvara
- [ ] Isto za `/{slug}/meni` i `/{slug}/recenzije`
- [ ] Novi lokal se pojavi u `/sitemap.xml`
- [ ] Lokal `uskoro` nema nijednu rutu, ali **ima karticu** na naslovnoj
- [ ] Prebacivanje `uskoro` → `radi` stvara rute u roku od 20 s
- [ ] Prebacivanje `radi` → `zatvoren` uklanja rute, sitemap i prekidač
- [ ] Promjena sluga: stara adresa **trajno preusmjerava** na novu
- [ ] Promjena glavnog lokala: `/` prikazuje novi, stari dostupan na svom slugu, stare adrese preusmjeravaju
- [ ] Lokal bez jela: meni prikazuje prazno stanje, ne pada
- [ ] Pokušaj sluga `meni` odbijen na sva tri mjesta *(obrazac, baza, resolver)*
- [ ] `grep` po projektu ne nalazi nijedan ukucan slug lokala izvan seed skripte

## Gotovo kad

Lokal dodan kroz sučelje sam stvara adrese, promjena sluga ne lomi linkove, a stanja `uskoro` i `zatvoren` se ponašaju kako je opisano.
