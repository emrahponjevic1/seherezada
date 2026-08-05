# T17 · Slike — otpremanje i obrada

**Faza:** 3 · **Preduslov:** T13 · **Paralelno sa:** T16
**Vlasnik fajlova:** `lib/slike.ts` · `components/chef/OtpremiSliku.tsx` · Supabase Storage

---

## Cilj

Vlasnik otprema fotografiju telefonom, a sistem je sam pretvori u **WebP u tri veličine ispod 300 KB**. Bez alata i bez znanja o formatima.

## Zašto sistem obrađuje, a ne korisnik

Fotografija sa telefona ima 3–8 MB. Ako se postavi kakva jeste, jedna stranica menija sa 23 jela vuče preko 100 MB — sajt postaje neupotrebljiv na mobilnim podacima, baš tamo gdje se najviše koristi.

Tražiti od vlasnika da sam smanjuje slike ne radi. Sistem to mora raditi sam, tiho.

---

## Šta se radi

### 1 · Tok

```
Vlasnik odabere sliku
      ↓ provjera u pregledniku: tip i veličina
      ↓ slanje na server
Server:  obreži na odnos 4:3
         napravi 3 veličine, sve WebP
         400px  (kartica na mobitelu)
         800px  (kartica na desktopu)
        1600px  (modal i galerija)
         svaka ispod 300 KB
      ↓ Supabase Storage
Vrati osnovnu adresu → upiše se u jelo
```

Obrada **na serveru**, ne u pregledniku — telefon bi se zagušio na velikoj slici.

### 2 · Provjere pri otpremanju

| Provjera | Pravilo | Gdje |
|---|---|---|
| Tip | `image/jpeg`, `png`, `webp`, `heic` | preglednik **i** server |
| Veličina prije obrade | najviše 12 MB | preglednik **i** server |
| Stvarni sadržaj | provjeriti zaglavlje, ne samo nastavak imena | **server** |
| Najmanje dimenzije | 600×450 px | server |

> Provjera u pregledniku je udobnost. **Serverska je jedina koja se računa** — nastavak imena se lako lažira.

`heic` sa iPhonea mora proći — inače pola fotografija ne radi.

### 3 · Komponenta za otpremanje

Koristi se u obrascu jela *(T15)* i za slike lokala.

```
┌─────────────────────────────┐
│   [pregled slike]           │
│                             │
│   Povuci sliku ovdje        │
│   ali klikni za izbor       │
│                             │
│   JPG, PNG, HEIC · do 12 MB │
└─────────────────────────────┘
   [Zamijeni]  [Ukloni]
```

Stanja: prazno · odabrano *(pregled prije slanja)* · šalje se *(traka napretka)* · gotovo · greška sa razlogom.

Pregled se pravi lokalno prije slanja — vlasnik odmah vidi šta je odabrao.

### 4 · Imenovanje i pohrana

```
jela/{slug}/400.webp
jela/{slug}/800.webp
jela/{slug}/1600.webp
lokali/{slug}/naslovna.webp
```

Nova slika istog jela **prepisuje staru** — bez gomilanja. U bazi se čuva osnovna adresa, veličina se dodaje pri prikazu.

Pravila Storage-a: čitanje javno, pisanje samo prijavljenim.

### 5 · Prikaz na sajtu

Komponenta `<SlikaJela>` iz T05 dobija `srcset`:

```
srcset="…/400.webp 400w, …/800.webp 800w, …/1600.webp 1600w"
sizes="(max-width: 768px) 45vw, 300px"
```

Uvijek `width` i `height` — bez njih sadržaj poskakuje pri učitavanju.
Jelo bez slike → rezervni okvir iz T05, **istog odnosa stranica**.

### 6 · Postojeće slike

23 jela sada koriste **četiri Unsplash fotografije** — piće i pomfrit prikazuju kebab.

Ostaju dok ne stignu prave. Ali `rotisserie_hero.png` je **899 KB PNG i najveći element na naslovnoj**; pretvoriti ga u WebP uz zadržavanje PNG-a kao rezerve. To je jedna slika i vrijedi odmah.

U spisku jela u `/chef` prikazati oznaku **„zastupna slika"** za jela koja još koriste kupljenu — da se vidi šta treba fotografisati.

---

## Ne raditi u ovom zadatku

- Ne uređivati sliku u pregledniku *(rotacija, filteri)*
- Ne praviti biblioteku slika sa višestrukom upotrebom — jedno jelo, jedna slika
- Ne dirati javni sajt osim `<SlikaJela>`
- Ne mijenjati ostale slike u `public/`

---

## Verifikacija

- [ ] Fotografija sa telefona *(5 MB, HEIC)* prolazi i pretvara se u WebP
- [ ] Nastaju tri veličine, **svaka ispod 300 KB**
- [ ] Datoteka od 15 MB odbijena uz jasnu poruku
- [ ] PDF preimenovan u `.jpg` odbijen **na serveru**
- [ ] Slika 200×150 px odbijena kao premala
- [ ] Pregled se vidi prije slanja
- [ ] Traka napretka se pomjera; greška ima razlog
- [ ] Nova slika istog jela prepisuje staru
- [ ] Anonimni korisnik može čitati, ne može pisati u Storage
- [ ] Kartice na sajtu učitavaju verziju od 400 px na mobitelu
- [ ] Sve slike imaju `width` i `height`; **nema poskakivanja** pri učitavanju
- [ ] Jelo bez slike prikazuje rezervni okvir bez pomjeranja rasporeda
- [ ] `rotisserie_hero.png` ima WebP verziju i naslovna se učitava vidno brže

## Gotovo kad

Otpremljena fotografija sama postaje WebP u tri veličine ispod 300 KB, prikazuje se u pravoj veličini, a nevaljane datoteke se odbijaju na serveru.
