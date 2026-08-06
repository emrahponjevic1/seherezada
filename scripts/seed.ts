/**
 * Seed — prvi put napuni bazu demo podacima.
 *
 * Pokreće se sa `npm run seed`. IDEMPOTENTAN je: ponovno pokretanje ne
 * duplira ništa, nego osvježi postojeće redove.
 *
 * Izvor podataka je `lib/repo.static.ts` — isti demo podaci koje je sajt
 * koristio prije baze. Tako se poslije prebacivanja ništa ne mijenja.
 *
 * Pokreće se u čistom Node-u, ne kroz Next, pa uvozi nose `.ts` nastavak.
 */

import { Pool } from "pg"

import { staticRepo } from "../lib/repo.static.ts"

const url = process.env.DATABASE_URL_ADMIN
if (!url) {
  console.error("✗ Nedostaje DATABASE_URL_ADMIN.")
  console.error("  Kopiraj .env.example u .env.local i popuni ga.")
  process.exit(1)
}

const pool = new Pool({ connectionString: url })

async function seed() {
  const klijent = await pool.connect()

  try {
    await klijent.query("begin")

    // ── Kategorije ───────────────────────────────────────────
    const kategorije = await staticRepo.getKategorije()
    const idKategorije = new Map<string, string>()

    for (const k of kategorije) {
      const { rows } = await klijent.query<{ id: string }>(
        `insert into kategorije (slug, naziv, opis, redoslijed, aktivna)
         values ($1, $2, $3, $4, $5)
         on conflict (slug) do update set
           naziv = excluded.naziv, opis = excluded.opis,
           redoslijed = excluded.redoslijed, aktivna = excluded.aktivna
         returning id`,
        [k.slug, k.naziv, k.opis ?? null, k.redoslijed, k.aktivna],
      )
      idKategorije.set(k.slug, rows[0].id)
    }
    console.log(`  kategorije   ${kategorije.length}`)

    // ── Jela ─────────────────────────────────────────────────
    // Katalog se izvodi iz menija glavnog lokala — tamo su sva jela.
    const meniGlavnog = await staticRepo.getMeni("trubarjeva")
    const idJela = new Map<string, string>()
    let brojJela = 0

    for (const sekcija of meniGlavnog) {
      const katId = idKategorije.get(sekcija.kategorija.slug)
      if (!katId) throw new Error(`Nepoznata kategorija: ${sekcija.kategorija.slug}`)

      for (const stavka of sekcija.stavke) {
        const j = stavka.jelo
        const { rows } = await klijent.query<{ id: string }>(
          `insert into jela (slug, kategorija_id, naziv, opis, sastojci,
                             alergeni, slika_url, slika_alt, halal,
                             vegetarijansko, vegansko, ljuto, kalorije, aktivno)
           values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
           on conflict (slug) do update set
             kategorija_id = excluded.kategorija_id,
             naziv = excluded.naziv, opis = excluded.opis,
             sastojci = excluded.sastojci, alergeni = excluded.alergeni,
             slika_url = excluded.slika_url, slika_alt = excluded.slika_alt,
             halal = excluded.halal,
             vegetarijansko = excluded.vegetarijansko,
             vegansko = excluded.vegansko, ljuto = excluded.ljuto,
             kalorije = excluded.kalorije, aktivno = excluded.aktivno
           returning id`,
          [
            j.slug, katId, j.naziv, j.opis, j.sastojci, j.alergeni,
            j.slikaUrl ?? null, j.slikaAlt, j.halal, j.vegetarijansko,
            j.vegansko, j.ljuto, j.kalorije ?? null, j.aktivno,
          ],
        )
        idJela.set(j.slug, rows[0].id)
        brojJela++
      }
    }
    console.log(`  jela         ${brojJela}`)

    // ── Lokali ───────────────────────────────────────────────
    // Glavni se postavlja tek na kraju: parcijalni indeks dozvoljava
    // tačno jedan, pa bi usput moglo doći do sudara.
    const lokali = await staticRepo.getLokali()
    const idLokala = new Map<string, string>()

    await klijent.query(`update lokali set glavni = false where glavni`)

    for (const l of lokali) {
      const { rows } = await klijent.query<{ id: string }>(
        `insert into lokali (slug, naziv, ulica, adresa, telefon, email,
                             lat, lng, radno_vrijeme, wolt_url, glovo_url,
                             google_place_id, uvodni_tekst, ocjena,
                             broj_recenzija, recenzije_azurirano,
                             glavni, stanje, redoslijed)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,false,$17,$18)
         on conflict (slug) do update set
           naziv = excluded.naziv, ulica = excluded.ulica,
           adresa = excluded.adresa, telefon = excluded.telefon,
           email = excluded.email, lat = excluded.lat, lng = excluded.lng,
           radno_vrijeme = excluded.radno_vrijeme,
           wolt_url = excluded.wolt_url, glovo_url = excluded.glovo_url,
           google_place_id = excluded.google_place_id,
           uvodni_tekst = excluded.uvodni_tekst, ocjena = excluded.ocjena,
           broj_recenzija = excluded.broj_recenzija,
           recenzije_azurirano = excluded.recenzije_azurirano,
           stanje = excluded.stanje, redoslijed = excluded.redoslijed
         returning id`,
        [
          l.slug, l.naziv, l.ulica, l.adresa, l.telefon, l.email ?? null,
          l.lat ?? null, l.lng ?? null, l.radnoVrijeme, l.woltUrl ?? null,
          l.glovoUrl ?? null, l.googlePlaceId ?? null, l.uvodniTekst,
          l.ocjena ?? null, l.brojRecenzija ?? null,
          l.recenzijeAzurirano ?? null, l.stanje, l.redoslijed,
        ],
      )
      idLokala.set(l.slug, rows[0].id)
    }

    const glavni = lokali.find((l) => l.glavni)
    if (!glavni) throw new Error("Demo podaci nemaju glavni lokal")
    await klijent.query(`update lokali set glavni = true where slug = $1`, [
      glavni.slug,
    ])
    console.log(`  lokali       ${lokali.length}  (glavni: ${glavni.slug})`)

    // ── Meni po lokalu ───────────────────────────────────────
    let veza = 0
    for (const l of lokali) {
      const meni = await staticRepo.getMeni(l.slug)
      const lokalId = idLokala.get(l.slug)!

      for (const sekcija of meni) {
        for (const stavka of sekcija.stavke) {
          const jeloId = idJela.get(stavka.jelo.slug)
          if (!jeloId) continue

          await klijent.query(
            `insert into lokal_jela (lokal_id, jelo_id, cijena, dostupno, izdvojeno, redoslijed)
             values ($1,$2,$3,$4,$5,$6)
             on conflict (lokal_id, jelo_id) do update set
               cijena = excluded.cijena, dostupno = excluded.dostupno,
               izdvojeno = excluded.izdvojeno, redoslijed = excluded.redoslijed`,
            [
              lokalId, jeloId, stavka.cijena, stavka.dostupno,
              stavka.izdvojeno, stavka.redoslijed,
            ],
          )
          veza++
        }
      }
      const koliko = meni.reduce((z, s) => z + s.stavke.length, 0)
      console.log(`  meni         ${l.slug.padEnd(14)} ${koliko} jela`)
    }
    console.log(`  lokal_jela   ${veza}`)

    await klijent.query("commit")
    console.log("\n✓ Seed gotov.")
  } catch (greska) {
    await klijent.query("rollback")
    throw greska
  } finally {
    klijent.release()
    await pool.end()
  }
}

seed().catch((g) => {
  console.error("\n✗ Seed nije uspio:", g instanceof Error ? g.message : g)
  process.exit(1)
})
