# T13 · Prijava i zaštita `/chef`

**Faza:** 3 · **Preduslov:** T11 · **Blokira:** T14, T15, T16, T17
**Vlasnik fajlova:** `app/chef/layout.tsx` · `app/chef/prijava/page.tsx` · `middleware.ts` · `lib/auth.ts`

---

## Cilj

`/chef` je dostupan **samo prijavljenom korisniku**, nevidljiv pretraživačima, i ima okvir u koji kasniji zadaci ubacuju svoje ekrane.

## Zašto prije admin ekrana

Ekrani se ne prave pa naknadno zaključavaju — tako se lako zaboravi jedna ruta. Zaštita se postavlja **na okvir**, pa je sve unutar njega automatski pokriveno.

---

## Šta se radi

### 1 · Middleware

`middleware.ts` presreće sve pod `/chef/*` osim same stranice za prijavu:
- nema sesije → preusmjerenje na `/chef/prijava?next={odakle}`
- ima sesije → propušta

Uz to osvježava Supabase sesiju pri svakom zahtjevu, da ne istekne usred rada.

`matcher` mora obuhvatiti `/chef/:path*`, a **izuzeti** `/chef/prijava`.

### 2 · Stranica za prijavu

`/chef/prijava` — e-mail i lozinka, u postojećem dizajnu sajta *(iste boje, `rounded-2xl`, crveno dugme)*. Bez registracije — nalozi se prave ručno u Supabase konzoli.

Sadrži: polja, dugme **Prijava**, poruku o grešci *(„Napačen e-poštni naslov ali geslo" — nikad koje od dvoje je pogrešno)*, i link **Pozabljeno geslo** koji šalje Supabase e-mail za obnovu.

Nakon prijave: povratak na `next` adresu ili `/chef`.

### 3 · Okvir `/chef`

`app/chef/layout.tsx`:
- provjera sesije i na serveru *(pojas i tregeri uz middleware)*
- `metadata`: `robots: { index:false, follow:false }`
- bočna navigacija: **Lokali · Jela · Meni in cene · Nastavitve**
- gore desno: e-mail prijavljenog i dugme **Odjava**
- `<html lang="sl">`, uvijek svijetla tema *(admin ne prati temu sajta)*

Bočna navigacija sadrži stavke za ekrane koje prave T14–T17. Dok ne postoje, vode na stranicu „u pripravi".

### 4 · Kad sesija istekne

Serverske radnje moraju provjeriti sesiju i vratiti jasnu grešku, a ne pasti. Ako korisnik snimi obrazac nakon isteka: poruka **„Seja je potekla, prijavite se znova"** i link, uz **čuvanje unesenih podataka** gdje je izvodljivo.

### 5 · Zabrana indeksiranja

Tri sloja, sva tri obavezna:
1. `robots: { index:false }` u okviru
2. `Disallow: /chef` u `robots.ts` *(već traženo u T06)*
3. `/chef` se **ne pojavljuje** u `sitemap.ts`

### 6 · Nalozi

Vlasnik i menadžer. Prave se ručno u Supabase konzoli. Dvofaktorska prijava ako je dostupna na planu.

**Service role ključ smije postojati samo u serverskom kodu** — nikad u komponenti koja stiže u preglednik.

---

## Ne raditi u ovom zadatku

- Ne graditi ekrane za lokale, jela ni cijene — T14, T15, T16
- Ne praviti otpremanje slika — T17
- Ne praviti registraciju ni upravljanje korisnicima kroz sučelje
- Ne uvoditi uloge i dozvole — svi prijavljeni imaju ista prava

---

## Verifikacija

- [ ] `/chef` bez prijave → preusmjerenje na `/chef/prijava`
- [ ] `/chef/lokali` bez prijave → isto *(provjeriti da middleware hvata i podrute)*
- [ ] Pogrešni podaci → poruka koja **ne otkriva** je li e-mail postojeći
- [ ] Uspješna prijava vraća na traženu adresu, ne na naslovnu
- [ ] Odjava briše sesiju; povratak unazad ne otkriva admin
- [ ] `view-source:` na `/chef` sadrži `noindex`
- [ ] `/robots.txt` zabranjuje `/chef`
- [ ] `/sitemap.xml` **ne sadrži** `/chef`
- [ ] Sesija se osvježava — nakon 30 min rada korisnik nije izbačen
- [ ] Snimanje sa isteklom sesijom daje jasnu poruku, ne bijeli ekran
- [ ] Service role ključ **nije** u klijentskom snopu *(pretraga po `.next/static`)*

## Gotovo kad

`/chef` traži prijavu, nevidljiv je pretraživačima, okvir sa navigacijom postoji, istek sesije je obrađen.
