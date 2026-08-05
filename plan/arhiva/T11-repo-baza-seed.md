# T11 · Repozitorij nad bazom i seed

**Faza:** 3 · **Preduslov:** T10 *(i Faza 2 gotova)* · **Blokira:** T12, T13, T18
**Vlasnik fajlova:** `lib/repo.supabase.ts` · `lib/supabase.ts` · `scripts/seed.ts` · jedna linija u `lib/repo.ts`

---

## Cilj

Sajt čita iz baze umjesto iz `data.ts`. **Nijedna komponenta se ne mijenja.**

## Zašto je ovo mali zadatak

Zbog T02. Sve ide preko `Repo` ugovora, pa je prelazak zamjena jedne implementacije:

```ts
// lib/repo.ts — jedina izmjena u cijelom projektu
export const repo: Repo = supabaseRepo;   // bilo: staticRepo
```

**Ako ovaj zadatak traži izmjene u komponentama, T02 je pogrešno urađen** — vratiti se i popraviti ugovor umjesto zaobilaziti ga.

---

## Šta se radi

### 1 · Klijent

`lib/supabase.ts` — dva klijenta:
- **javni** *(anon ključ)* za čitanje na sajtu
- **serverski** *(service role)* samo za `/chef` i seed, nikad u kodu koji stiže u preglednik

Ključevi iz env varijabli. Popis vodi T24.

### 2 · `lib/repo.supabase.ts`

Implementira `Repo` iz T02, metodu po metodu. Mapiranje redova baze u domenske tipove — `snake_case` → `camelCase`, `numeric` → `number`.

**Upiti moraju biti pisani da izbjegnu N+1.** `getMeni` je jedan upit sa spojem, ne petlja po kategorijama:

```
lokal_jela  ⋈ jela ⋈ kategorije
  where lokal_id = ? and dostupno
  order by kategorije.redoslijed, lokal_jela.redoslijed
```
Grupisanje u `MenuSekcija[]` u kodu, nakon jednog upita.

**Prazne kategorije se izostavljaju** — pravilo iz T02 i T05.

### 3 · Seed — `scripts/seed.ts`

Prenosi postojeće podatke u bazu. Idempotentan *(ponovno pokretanje ne duplira)*.

```
1  kategorije   8 iz Category unije, sa redoslijedom
2  jela         23 iz data.ts
                cijena "8,50 €" → 8.50 pada u lokal_jela, ne u jela
                halal = true za sva (ispravka sadašnje greške)
                popular → izdvojeno
3  lokali       3 iz demo podataka u MASTER-u
                trubarjeva glavni = true
                seherezada2
                treći: stanje 'uskoro'
4  lokal_jela   trubarjeva  → sva 23 jela, cijene iz data.ts
                seherezada2 → sva 23 jela, cijene +0,50 €
                treći       → ništa
5  uvodni_tekst obavezno RAZLIČIT po lokalu
```

> `uvodni_tekst` ne smije ostati prazan ni isti. Ako su naslovne lokala identične osim cijena, Google ih čita kao prazan sadržaj. Demo tekst je u redu, kopiran nije.

Pokretanje: `npm run seed`.

### 4 · Prebacivanje

Zamijeniti jednu liniju u `lib/repo.ts`. `repo.static.ts` **ostaje u projektu** — koristan je za lokalni rad bez baze i kao živa dokumentacija ugovora.

Prekidač po env varijabli je prihvatljiv: `REPO=static` za razvoj bez baze.

---

## Ne raditi u ovom zadatku

- Ne dirati komponente, rute ni stranice — ako moraš, problem je u T02
- Ne pisati `/chef` — T13 i dalje
- Ne postavljati keširanje — T12
- Ne brisati `data.ts` — ostaje izvor za seed

---

## Verifikacija

- [ ] `npm run seed` prolazi na praznoj bazi
- [ ] Ponovno pokretanje **ne duplira** podatke
- [ ] Sajt radi identično kao prije prebacivanja — **nijedna vizuelna razlika**
- [ ] `git diff` pokazuje izmjene **samo** u `lib/` i `scripts/`, nigdje u `components/` ni `app/`
- [ ] `/meni` prikazuje 23 jela sa cijenama iz baze
- [ ] `/seherezada2/meni` prikazuje cijene veće za 0,50 €
- [ ] Izmjena cijene direktno u bazi vidi se nakon ponovnog učitavanja
- [ ] Lokal `uskoro` se ne pojavljuje u rutama ni sitemapu
- [ ] Nijedan lokal nema isti `uvodni_tekst`
- [ ] `getMeni` izvršava **jedan** upit, ne po jedan za kategoriju *(provjeriti u dnevniku baze)*
- [ ] Anon ključ nigdje ne dobija pravo pisanja; service role ključ **nije** u klijentskom snopu

## Gotovo kad

Sajt čita iz baze, komponente netaknute, seed idempotentan.
