"use server"

import { redirect } from "next/navigation"

import { zahtijevajSesiju } from "../auth"
import { bazaAdmin, upitAdmin } from "../baza"
import { revalidirajJela, revalidirajKategorije } from "../revalidate"
import {
  ALERGENI,
  obavezno,
  prevodIzObrasca,
  prevodListeIzObrasca,
  provjeriPrevod,
  provjeriSlug,
  type Greske,
} from "./provjere"

/**
 * Akcije nad katalogom jela i kategorijama.
 *
 * KATALOG JE ODVOJEN OD CIJENA. Jelo postoji jednom: jedan opis, jedna
 * slika, jedan spisak alergena, jedan prijevod. Isto jelo se prodaje u
 * više lokala po različitim cijenama, a cijena pripada vezi lokal↔jelo
 * i uređuje se u koraku 16.
 *
 * Zato ovdje NEMA nijednog polja za cijenu.
 */

export interface StanjeObrasca {
  greske?: Greske
  poruka?: string
}

function porukaGreske(greska: unknown): string {
  const tekst = greska instanceof Error ? greska.message : String(greska)
  if (tekst.includes("duplicate key") || tekst.includes("_slug_key")) {
    return "Ta naslov že uporablja drug zapis."
  }
  if (tekst.includes("jela_ljuto_chk")) return "Pikantnost mora biti med 0 in 3."
  if (tekst.includes("jela_vegan_chk")) {
    return "Vegansko jed je nujno tudi vegetarijanska."
  }
  if (tekst.includes("_slug_chk")) return "Samo male črke, številke in vezaji."
  return "Shranjevanje ni uspelo. Poskusite znova."
}

// ─────────────────────────────────────────────────────────────
//  Jela
// ─────────────────────────────────────────────────────────────

export async function spremiJelo(
  _prethodno: StanjeObrasca,
  podaci: FormData,
): Promise<StanjeObrasca> {
  try {
    await zahtijevajSesiju()
  } catch {
    return { poruka: "Seja je potekla, prijavite se znova." }
  }

  const stariSlug = String(podaci.get("stariSlug") ?? "").trim()
  const slug = String(podaci.get("slug") ?? "").trim().toLowerCase()
  const kategorijaId = String(podaci.get("kategorijaId") ?? "").trim()
  const naziv = prevodIzObrasca(podaci, "naziv")
  const opis = prevodIzObrasca(podaci, "opis")
  const sastojci = prevodListeIzObrasca(podaci, "sastojci")
  const slikaAlt = prevodIzObrasca(podaci, "slikaAlt")

  const greske: Greske = {}

  // Slug jela nije adresa lokala, pa rezervisani spisak ne važi za njega.
  const gSlug = provjeriSlug(slug, { rezervisani: false })
  if (gSlug) greske.slug = gSlug

  const gKat = obavezno(kategorijaId, "Kategorija je obvezna.")
  if (gKat) greske.kategorijaId = gKat

  const gNaziv = provjeriPrevod(naziv, "Ime jedi v slovenščini je obvezno.")
  if (gNaziv) greske["naziv.sl"] = gNaziv

  const ljuto = Number(podaci.get("ljuto") ?? 0)
  if (!Number.isInteger(ljuto) || ljuto < 0 || ljuto > 3) {
    greske.ljuto = "Pikantnost je med 0 in 3."
  }

  const vegansko = podaci.get("vegansko") === "on"
  const vegetarijansko = podaci.get("vegetarijansko") === "on" || vegansko

  if (Object.keys(greske).length) return { greske }

  const alergeni = ALERGENI.filter((a) => podaci.get(`alergen.${a}`) === "on")
  const kalorije = String(podaci.get("kalorije") ?? "").trim()

  const vrijednosti = [
    slug,
    kategorijaId,
    JSON.stringify(naziv),
    JSON.stringify(opis),
    JSON.stringify(sastojci),
    alergeni,
    String(podaci.get("slikaUrl") ?? "").trim() || null,
    JSON.stringify(slikaAlt),
    podaci.get("halal") === "on",
    vegetarijansko,
    vegansko,
    ljuto,
    kalorije ? Number(kalorije) : null,
    podaci.get("aktivno") === "on",
  ]

  try {
    if (stariSlug) {
      await upitAdmin(
        `update jela set slug=$1, kategorija_id=$2, naziv=$3, opis=$4,
           sastojci=$5, alergeni=$6, slika_url=$7, slika_alt=$8, halal=$9,
           vegetarijansko=$10, vegansko=$11, ljuto=$12, kalorije=$13, aktivno=$14
         where slug=$15`,
        [...vrijednosti, stariSlug],
      )
    } else {
      await upitAdmin(
        `insert into jela (slug, kategorija_id, naziv, opis, sastojci, alergeni,
           slika_url, slika_alt, halal, vegetarijansko, vegansko, ljuto,
           kalorije, aktivno)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
        vrijednosti,
      )
    }
  } catch (greska) {
    return { greske: { slug: porukaGreske(greska) } }
  }

  // Promjena opisa pogađa jelo u SVIM lokalima.
  revalidirajJela()
  redirect("/chef/jela")
}

/**
 * Kopiranje jela — za varijante (Doner → Doner XL).
 * NE kopira veze sa lokalima: novo jelo nije ni u jednom meniju dok se
 * ne doda u koraku 16.
 */
export async function kopirajJelo(
  _prethodno: StanjeObrasca,
  podaci: FormData,
): Promise<StanjeObrasca> {
  try {
    await zahtijevajSesiju()
  } catch {
    return { poruka: "Seja je potekla, prijavite se znova." }
  }

  const izvor = String(podaci.get("izvor") ?? "").trim()
  const slug = String(podaci.get("slug") ?? "").trim().toLowerCase()

  const gSlug = provjeriSlug(slug, { rezervisani: false })
  if (gSlug) return { greske: { slug: gSlug } }

  try {
    const redovi = await upitAdmin<{ slug: string }>(
      `insert into jela (slug, kategorija_id, naziv, opis, sastojci, alergeni,
         slika_url, slika_alt, halal, vegetarijansko, vegansko, ljuto,
         kalorije, aktivno)
       select $1, kategorija_id,
              naziv || jsonb_build_object('sl', (naziv->>'sl') || ' (kopija)'),
              opis, sastojci, alergeni, slika_url, slika_alt, halal,
              vegetarijansko, vegansko, ljuto, kalorije, aktivno
       from jela where slug = $2
       returning slug`,
      [slug, izvor],
    )
    if (!redovi[0]) return { greske: { slug: "Izvorna jed ne obstaja." } }
  } catch (greska) {
    return { greske: { slug: porukaGreske(greska) } }
  }

  revalidirajJela()
  redirect(`/chef/jela/${slug}`)
}

/** Meko deaktiviranje — uklanja jelo sa sajta i iz svih menija, podaci ostaju. */
export async function prebaciAktivno(podaci: FormData) {
  await zahtijevajSesiju()
  const slug = String(podaci.get("slug") ?? "").trim()
  const aktivno = String(podaci.get("aktivno") ?? "") === "1"

  await upitAdmin(`update jela set aktivno = $1 where slug = $2`, [
    aktivno,
    slug,
  ])
  revalidirajJela()
}

// ─────────────────────────────────────────────────────────────
//  Kategorije
// ─────────────────────────────────────────────────────────────

export async function spremiKategoriju(
  _prethodno: StanjeObrasca,
  podaci: FormData,
): Promise<StanjeObrasca> {
  try {
    await zahtijevajSesiju()
  } catch {
    return { poruka: "Seja je potekla, prijavite se znova." }
  }

  const stariSlug = String(podaci.get("stariSlug") ?? "").trim()
  const slug = String(podaci.get("slug") ?? "").trim().toLowerCase()
  const naziv = prevodIzObrasca(podaci, "naziv")
  const opis = prevodIzObrasca(podaci, "opis")

  const greske: Greske = {}
  const gSlug = provjeriSlug(slug, { rezervisani: false })
  if (gSlug) greske.slug = gSlug
  const gNaziv = provjeriPrevod(naziv, "Ime kategorije v slovenščini je obvezno.")
  if (gNaziv) greske["naziv.sl"] = gNaziv
  if (Object.keys(greske).length) return { greske }

  const aktivna = podaci.get("aktivna") === "on"

  try {
    if (stariSlug) {
      await upitAdmin(
        `update kategorije set slug=$1, naziv=$2, opis=$3, aktivna=$4 where slug=$5`,
        [slug, JSON.stringify(naziv), JSON.stringify(opis), aktivna, stariSlug],
      )
    } else {
      await upitAdmin(
        `insert into kategorije (slug, naziv, opis, aktivna, redoslijed)
         values ($1,$2,$3,$4,(select coalesce(max(redoslijed),0)+1 from kategorije))`,
        [slug, JSON.stringify(naziv), JSON.stringify(opis), aktivna],
      )
    }
  } catch (greska) {
    return { greske: { slug: porukaGreske(greska) } }
  }

  revalidirajKategorije()
  redirect("/chef/kategorije")
}

export async function pomjeriKategoriju(podaci: FormData) {
  await zahtijevajSesiju()
  const slug = String(podaci.get("slug") ?? "").trim()
  const smjer = String(podaci.get("smjer") ?? "")

  const redovi = await upitAdmin<{ slug: string }>(
    `select slug from kategorije order by redoslijed, slug`,
  )
  const i = redovi.findIndex((r) => r.slug === slug)
  const j = smjer === "gore" ? i - 1 : i + 1
  if (i < 0 || j < 0 || j >= redovi.length) return

  const poredak = [...redovi]
  const pom = poredak[i]
  poredak[i] = poredak[j]
  poredak[j] = pom

  const klijent = await bazaAdmin().connect()
  try {
    await klijent.query("begin")
    for (let k = 0; k < poredak.length; k++) {
      await klijent.query(
        `update kategorije set redoslijed = $1 where slug = $2`,
        [k + 1, poredak[k].slug],
      )
    }
    await klijent.query("commit")
  } catch (greska) {
    await klijent.query("rollback")
    throw greska
  } finally {
    klijent.release()
  }

  revalidirajKategorije()
}

/**
 * Brisanje kategorije. Baza to odbija ako ima jela (`on delete restrict`),
 * ali ovdje se poruka pretvara u nešto korisno — koliko jela je sprječava.
 */
export async function obrisiKategoriju(
  _prethodno: StanjeObrasca,
  podaci: FormData,
): Promise<StanjeObrasca> {
  try {
    await zahtijevajSesiju()
  } catch {
    return { poruka: "Seja je potekla, prijavite se znova." }
  }

  const slug = String(podaci.get("slug") ?? "").trim()

  const [broj] = await upitAdmin<{ n: string }>(
    `select count(*)::text as n from jela j
     join kategorije k on k.id = j.kategorija_id where k.slug = $1`,
    [slug],
  )

  if (Number(broj?.n ?? 0) > 0) {
    return {
      greske: {
        brisanje: `Kategorije ni mogoče izbrisati — vsebuje ${broj.n} jedi. Najprej jih premaknite v drugo kategorijo.`,
      },
    }
  }

  await upitAdmin(`delete from kategorije where slug = $1`, [slug])
  revalidirajKategorije()
  redirect("/chef/kategorije")
}
