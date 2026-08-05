# Uputa za agenta — Šeherezada

Ovo pročitaj prije nego išta dodirneš. Korisnik ti je rekao broj koraka; sve ostalo je ovdje.

---

## 1 · Šta radiš

Radiš **jedan korak** iz `plan/ZAVRSNI-PLAN.html` — onaj čiji si broj dobio. Ne dva. Ne „pa da odmah i sljedeći".

Prije prvog poteza pročitaj iz tog dokumenta:

- **§4 Nepromjenjiva pravila** — deset pravila koja važe uvijek
- **§5 Adrese i resolver** i **§6 Model podataka** — ako tvoj korak dira rute ili podatke
- **§8 Česte greške** — devet grešaka pri prelasku na Next.js i njihovi uzroci
- **karticu svog koraka** u cijelosti: *Cilj · Zašto sada · Šta se radi · Vlasnik fajlova · Ne raditi · Provjera*

Plan je pisan tako da svaki korak ostavlja **sajt koji radi**. Ako tvoja izmjena to ruši, izmjena je pogrešna — ne plan.

## 2 · Vlasništvo nad fajlovima je tvrdo pravilo

Svaki korak ima popis **Vlasnik fajlova**. Diraš **samo te fajlove**.

Ako ti se čini da moraš dirati tuđi fajl:

1. **Stani.**
2. Provjeri jesi li pogrešno razumio korak.
3. Ako i dalje misliš da moraš — **pitaj korisnika**, ne uradi pa javi.

Razlog: `Navbar.tsx` pripada koraku 4, sekcije naslovne koraku 7, `Menu.tsx` koraku 8. Ako svaki korak dira sve, koraci se međusobno gaze i niko poslije ne zna šta je šta pokvarilo.

## 3 · Ritual na kraju koraka — sve četiri stavke

```
1. npm run build          mora proći bez grešaka i bez TS upozorenja
2. npm run dev            i sam provjeri šta možeš provjeriti
3. lista "Provjera"       stavku po stavku, bez preskakanja
4. git commit -m "korak-07: naslovna"
```

Ako build ne prolazi — korak **nije gotov**. Ne javljaj „gotovo je, ostala je samo jedna greška".

## 4 · Kako označavaš napredak

Kućice u dokumentu se označavaju naredbom, iz korijena projekta:

```
powershell -File plan/oznaci.ps1 k7c1 k7c2 k7c5
powershell -File plan/oznaci.ps1 -Stanje         ispis napretka
powershell -File plan/oznaci.ps1 -Odznaci k7c3   skidanje oznake
```

Oznaka je oblika `k7c3` = korak 7, treća provjera po redu. `zz5` = peta stavka završne liste. Skripta sama javi ako oznaka ne postoji i ispiše novo stanje.

**Nikad ne uređuj `ZAVRSNI-PLAN.html` ručno** — samo kroz ovu skriptu. Dokument je evidencija, ne radni fajl.

## 5 · Šta smiješ označiti, a šta ne

| | |
|---|---|
| **Smiješ sam** | Sve što možeš dokazati: build prolazi, `curl` vraća 404, tekst postoji u izvornom HTML-u, `grep` ne nalazi ukucan slug, upit vraća očekivane podatke, jedan `<h1>` u dokumentu. |
| **Ne smiješ** | Kućice sa oznakom **tvoje oko** — traže čovjeka: izgleda li isto kao prije, rade li animacije, treperi li nešto, kako se ponaša na pravom telefonu, je li prijevod razuman. |

Kućica sa oznakom *tvoje oko* nosi atribut `data-oko="1"` u HTML-u — možeš ih izlistati ako nisi siguran. Njih **nabroji korisniku na kraju** i traži da ih on potvrdi.

Označiti kućicu koju nisi stvarno provjerio je **gora greška od nedovršenog koraka**. Nedovršen korak se vidi; lažno označen se otkrije tri koraka kasnije, kad je već sve na njemu izgrađeno.

## 6 · Kada moraš stati i pitati

- Provjera pada, a popravka bi tražila izmjenu izvan tvojih fajlova
- Korak traži pristup koji nemaš — Supabase projekat (korak 10), nalozi (13), prave fotografije (17), Google Places ključ (21), Vercel i domena (24)
- Plan i stvarno stanje koda se ne slažu
- Nešto u planu je dvosmisleno, a dvije razumne izvedbe daju bitno različit rezultat

U sva četiri slučaja: **opiši šta si našao, predloži rješenje, sačekaj odgovor.** Ne nagađaj i ne biraj tiho.

## 7 · Kako izvještavaš na kraju

```
KORAK 7 — naslovna

Urađeno:
  - odvojen animirani omotač od teksta u Hero i AboutUs
  - dodane sekcije 6 (Halal) i 8 (FAQ izvod)
  - ...

Provjera — sam potvrdio (označeno):
  k7c1 ✓ view-source sadrži sve cijene i sva četiri pitanja
  k7c2 ✓ tačno jedan <h1>
  ...

Provjera — traži tvoje oko (NISAM označio):
  k7c5  značka "Odprto zdaj" — pomjeri sat na uređaju i reci šta piše
  k7c10 animacije rade isto kao prije
  k7c11 izgled na desktopu i na 390 px
  k7c12 nijedna nova boja, font ni oblik

Nije urađeno / zapelo:
  - (ništa)  ili  opis problema i šta predlažeš

Commit: korak-07: naslovna
```

## 8 · Šta nikad ne radiš

- Ne mijenjaš izgled: nijedna nova boja, font, oblik, razmak ni animacija
- Ne dodaješ biblioteke koje korak ne traži
- Ne „usput popravljaš" nešto van svog koraka — zapiši i javi
- Ne preskačeš provjere uz „to je očigledno u redu"
- Ne javljaš da je gotovo dok build ne prolazi i dok lista nije prošla
- Ne diraš `plan/` osim skriptom `oznaci.ps1`

---

Kratka verzija: **jedan korak, samo svoji fajlovi, build mora proći, označi samo ono što si stvarno dokazao, ostalo pitaj.**
