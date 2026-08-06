"use server"

import { redirect } from "next/navigation"

import { zahtijevajSesiju } from "../auth"
import { bazaAdmin, upitAdmin } from "../baza"
import type { Dan, RadnoVrijeme, Termin } from "../domain"
import { revalidirajLokal, revalidirajSkupLokala } from "../revalidate"
import {
  brojIliNull,
  obavezno,
  prevodIzObrasca,
  provjeriPrevod,
  provjeriSlug,
  type Greske,
} from "./provjere"

/**
 * Serverske akcije nad lokalima.
 *
 * Svaka radi tri stvari, uvijek istim redom:
 *   1. provjeri sesiju — istekla daje jasnu poruku, ne bijeli ekran
 *   2. provjeri podatke NA SERVERU — provjera u pregledniku se zaobilazi
 *   3. poništi keš kroz `lib/revalidate.ts`, nikad direktno
 */

export interface StanjeObrasca {
  greske?: Greske
  poruka?: string
}

const DANI: Dan[] = ["pon", "uto", "sri", "cet", "pet", "sub", "ned"]

function radnoVrijemeIzObrasca(podaci: FormData): RadnoVrijeme {
  const redovno = {} as Record<Dan, Termin>

  for (const dan of DANI) {
    const zatvoreno = podaci.get(`rv.${dan}.zatvoreno`) === "on"
    const od = String(podaci.get(`rv.${dan}.od`) ?? "").trim()
    const doo = String(podaci.get(`rv.${dan}.do`) ?? "").trim()
    redovno[dan] = zatvoreno || !od || !doo ? null : { od, do: doo }
  }

  const izuzeci: RadnoVrijeme["izuzeci"] = []
  for (let i = 0; i < 20; i++) {
    const datum = String(podaci.get(`izuzetak.${i}.datum`) ?? "").trim()
    if (!datum) continue

    const zatvoreno = podaci.get(`izuzetak.${i}.zatvoreno`) === "on"
    const od = String(podaci.get(`izuzetak.${i}.od`) ?? "").trim()
    const doo = String(podaci.get(`izuzetak.${i}.do`) ?? "").trim()
    const napomena = String(podaci.get(`izuzetak.${i}.napomena`) ?? "").trim()

    izuzeci.push({
      datum,
      termin: zatvoreno || !od || !doo ? null : { od, do: doo },
      napomena: napomena ? { sl: napomena } : undefined,
    })
  }

  return { redovno, izuzeci }
}

function porukaGreske(greska: unknown): string {
  const tekst = greska instanceof Error ? greska.message : String(greska)
  if (tekst.includes("rezerviran")) return tekst
  if (tekst.includes("lokali_slug_key") || tekst.includes("duplicate key")) {
    return "Ta naslov že uporablja drug lokal."
  }
  if (tekst.includes("lokali_slug_chk")) {
    return "Samo male črke, številke in vezaji."
  }
  return "Shranjevanje ni uspelo. Poskusite znova."
}

// ─────────────────────────────────────────────────────────────

export async function spremiLokal(
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
  const naziv = String(podaci.get("naziv") ?? "").trim()
  const ulica = String(podaci.get("ulica") ?? "").trim()
  const adresa = String(podaci.get("adresa") ?? "").trim()
  const telefon = String(podaci.get("telefon") ?? "").trim()
  const stanje = String(podaci.get("stanje") ?? "radi")
  const uvodniTekst = prevodIzObrasca(podaci, "uvodniTekst")

  const greske: Greske = {}
  const gSlug = provjeriSlug(slug)
  if (gSlug) greske.slug = gSlug

  const gNaziv = obavezno(naziv, "Ime lokala je obvezno.")
  if (gNaziv) greske.naziv = gNaziv

  const gUlica = obavezno(
    ulica,
    "Ulica je obvezna — uporabljena je v naslovih strani.",
  )
  if (gUlica) greske.ulica = gUlica

  const gAdresa = obavezno(adresa, "Polni naslov je obvezen.")
  if (gAdresa) greske.adresa = gAdresa

  const gTelefon = obavezno(telefon, "Telefon je obvezen.")
  if (gTelefon) greske.telefon = gTelefon

  // Bez uvodnog teksta su naslovne lokala gotovo identične i Google ih
  // čita kao prazan sadržaj. Zato je obavezan.
  const gUvod = provjeriPrevod(
    uvodniTekst,
    "Uvodno besedilo v slovenščini je obvezno — brez njega so naslovnice lokalov skoraj enake.",
  )
  if (gUvod) greske["uvodniTekst.sl"] = gUvod

  if (!["radi", "uskoro", "zatvoren"].includes(stanje)) {
    greske.stanje = "Neveljavno stanje."
  }

  if (Object.keys(greske).length) return { greske }

  const radnoVrijeme = radnoVrijemeIzObrasca(podaci)
  const vrijednosti = [
    slug,
    naziv,
    ulica,
    adresa,
    telefon,
    String(podaci.get("email") ?? "").trim() || null,
    brojIliNull(podaci.get("lat")),
    brojIliNull(podaci.get("lng")),
    JSON.stringify(radnoVrijeme),
    String(podaci.get("woltUrl") ?? "").trim() || null,
    String(podaci.get("glovoUrl") ?? "").trim() || null,
    String(podaci.get("googlePlaceId") ?? "").trim() || null,
    JSON.stringify(uvodniTekst),
    stanje,
    Number(podaci.get("redoslijed") ?? 0) || 0,
  ]

  const klijent = await bazaAdmin().connect()
  try {
    await klijent.query("begin")

    if (stariSlug) {
      await klijent.query(
        `update lokali set slug=$1, naziv=$2, ulica=$3, adresa=$4, telefon=$5,
           email=$6, lat=$7, lng=$8, radno_vrijeme=$9, wolt_url=$10,
           glovo_url=$11, google_place_id=$12, uvodni_tekst=$13, stanje=$14,
           redoslijed=$15
         where slug=$16`,
        [...vrijednosti, stariSlug],
      )

      // Promjena sluga lomi postojeće linkove i QR kodove — zato se
      // stara adresa trajno pamti i preusmjerava.
      if (stariSlug !== slug) {
        await klijent.query(
          `insert into preusmjerenja (stari_slug, novi_slug) values ($1,$2)
           on conflict (stari_slug) do update set novi_slug = excluded.novi_slug`,
          [stariSlug, slug],
        )
        // Lanac starih adresa mora pokazivati na novu, ne na međukorak.
        await klijent.query(
          `update preusmjerenja set novi_slug=$1 where novi_slug=$2`,
          [slug, stariSlug],
        )
      }
    } else {
      await klijent.query(
        `insert into lokali (slug, naziv, ulica, adresa, telefon, email, lat,
           lng, radno_vrijeme, wolt_url, glovo_url, google_place_id,
           uvodni_tekst, stanje, redoslijed, glavni)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,false)`,
        vrijednosti,
      )
    }

    await klijent.query("commit")
  } catch (greska) {
    await klijent.query("rollback")
    return { greske: { slug: porukaGreske(greska) } }
  } finally {
    klijent.release()
  }

  revalidirajSkupLokala()
  revalidirajLokal(slug)
  if (stariSlug && stariSlug !== slug) revalidirajLokal(stariSlug)

  redirect("/chef/lokali")
}

// ─────────────────────────────────────────────────────────────

export async function kopirajLokal(
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
  const naziv = String(podaci.get("naziv") ?? "").trim()
  const sMenijem = podaci.get("sMenijem") === "on"
  const sVremenom = podaci.get("sVremenom") === "on"

  const greske: Greske = {}
  const gSlug = provjeriSlug(slug)
  if (gSlug) greske.slug = gSlug
  const gNaziv = obavezno(naziv, "Ime je obvezno.")
  if (gNaziv) greske.naziv = gNaziv
  if (Object.keys(greske).length) return { greske }

  const klijent = await bazaAdmin().connect()
  try {
    await klijent.query("begin")

    // Ne kopira se: glavni, Place ID, Wolt, Glovo, uvodni tekst — to je
    // po lokalu jedinstveno. Novi nastaje kao 'uskoro', da se ne pojavi
    // na sajtu prije nego se dovrši.
    const { rows } = await klijent.query<{ id: string }>(
      `insert into lokali (slug, naziv, ulica, adresa, telefon, email, lat, lng,
         radno_vrijeme, uvodni_tekst, stanje, redoslijed, glavni)
       select $1, $2, ulica, adresa, telefon, email, lat, lng,
         case when $3 then radno_vrijeme else '{"redovno":{},"izuzeci":[]}'::jsonb end,
         '{}'::jsonb, 'uskoro',
         (select coalesce(max(redoslijed),0)+1 from lokali), false
       from lokali where slug = $4
       returning id`,
      [slug, naziv, sVremenom, izvor],
    )

    if (!rows[0]) throw new Error("Izvorni lokal ne obstaja.")

    if (sMenijem) {
      await klijent.query(
        `insert into lokal_jela (lokal_id, jelo_id, cijena, dostupno, izdvojeno, redoslijed)
         select $1, lj.jelo_id, lj.cijena, lj.dostupno, lj.izdvojeno, lj.redoslijed
         from lokal_jela lj join lokali l on l.id = lj.lokal_id
         where l.slug = $2`,
        [rows[0].id, izvor],
      )
    }

    await klijent.query("commit")
  } catch (greska) {
    await klijent.query("rollback")
    return { greske: { slug: porukaGreske(greska) } }
  } finally {
    klijent.release()
  }

  revalidirajSkupLokala()
  redirect(`/chef/lokali/${slug}`)
}

// ─────────────────────────────────────────────────────────────

/**
 * Glavni lokal ima adresu bez prefiksa. Zamjena mijenja adrese OBA
 * lokala, pa se radi u jednoj transakciji — baza dozvoljava tačno jedan
 * glavni, i međustanje sa dva bi palo.
 */
export async function postaviGlavni(podaci: FormData) {
  await zahtijevajSesiju()
  const slug = String(podaci.get("slug") ?? "").trim()

  const klijent = await bazaAdmin().connect()
  try {
    await klijent.query("begin")

    const { rows } = await klijent.query<{ slug: string }>(
      `select slug from lokali where glavni`,
    )
    const stari = rows[0]?.slug

    await klijent.query(`update lokali set glavni = false where glavni`)
    await klijent.query(
      `update lokali set glavni = true where slug = $1 and stanje = 'radi'`,
      [slug],
    )

    if (stari && stari !== slug) {
      // Novi glavni od sada živi na „/", pa njegov stari slug preusmjerava.
      await klijent.query(
        `insert into preusmjerenja (stari_slug, novi_slug) values ($1,$2)
         on conflict (stari_slug) do update set novi_slug = excluded.novi_slug`,
        [slug, stari],
      )
      // Stari glavni dobija svoj slug natrag, pa mu preusmjerenje smeta.
      await klijent.query(`delete from preusmjerenja where stari_slug = $1`, [
        stari,
      ])
    }

    await klijent.query("commit")
  } catch (greska) {
    await klijent.query("rollback")
    throw greska
  } finally {
    klijent.release()
  }

  revalidirajSkupLokala()
}

export async function promijeniStanje(podaci: FormData) {
  await zahtijevajSesiju()
  const slug = String(podaci.get("slug") ?? "").trim()
  const stanje = String(podaci.get("stanje") ?? "").trim()

  if (!["radi", "uskoro", "zatvoren"].includes(stanje)) return

  // Glavni lokal ne smije nestati sa sajta — ostao bi bez naslovne.
  await upitAdmin(
    `update lokali set stanje = $1 where slug = $2 and (not glavni or $1 = 'radi')`,
    [stanje, slug],
  )

  revalidirajSkupLokala()
  revalidirajLokal(slug)
}

export async function pomjeriLokal(podaci: FormData) {
  await zahtijevajSesiju()
  const slug = String(podaci.get("slug") ?? "").trim()
  const smjer = String(podaci.get("smjer") ?? "")

  const redovi = await upitAdmin<{ slug: string; redoslijed: number }>(
    `select slug, redoslijed from lokali order by redoslijed, naziv`,
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
    // Redoslijed se prepisuje po položaju — vrijednosti u bazi mogu imati
    // rupe, pa zamjena samo dva broja nije pouzdana.
    for (let k = 0; k < poredak.length; k++) {
      await klijent.query(`update lokali set redoslijed = $1 where slug = $2`, [
        k + 1,
        poredak[k].slug,
      ])
    }
    await klijent.query("commit")
  } catch (greska) {
    await klijent.query("rollback")
    throw greska
  } finally {
    klijent.release()
  }

  revalidirajSkupLokala()
}

/** Trajno brisanje. Glavni se ne smije obrisati, i traži se upis sluga. */
export async function obrisiLokal(
  _prethodno: StanjeObrasca,
  podaci: FormData,
): Promise<StanjeObrasca> {
  try {
    await zahtijevajSesiju()
  } catch {
    return { poruka: "Seja je potekla, prijavite se znova." }
  }

  const slug = String(podaci.get("slug") ?? "").trim()
  const potvrda = String(podaci.get("potvrda") ?? "").trim()

  if (potvrda !== slug) {
    return { greske: { potvrda: "Za potrditev vpišite točen naslov lokala." } }
  }

  const redovi = await upitAdmin<{ glavni: boolean }>(
    `select glavni from lokali where slug = $1`,
    [slug],
  )
  if (!redovi[0]) return { greske: { potvrda: "Lokal ne obstaja." } }
  if (redovi[0].glavni) {
    return {
      greske: {
        potvrda:
          "Glavnega lokala ni mogoče izbrisati. Najprej določite drugega.",
      },
    }
  }

  // Briše i njegove redove u lokal_jela (cascade), ali NE briše jela.
  await upitAdmin(`delete from lokali where slug = $1`, [slug])

  revalidirajSkupLokala()
  redirect("/chef/lokali")
}
