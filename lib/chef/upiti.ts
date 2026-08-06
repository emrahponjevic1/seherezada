import "server-only"

import { upitAdmin } from "../baza"
import type { Jelo, Kategorija, Lokal, Prevod, PrevodLista } from "../domain"

/**
 * Čitanja za /chef — NAMJERNO BEZ KEŠA.
 *
 * Javni sajt čita kroz `repo`, koji je keširan. Admin mora vidjeti
 * trenutno stanje: kad vlasnik snimi cijenu i vrati se na spisak, tamo
 * mora pisati nova, ne ona od prije poništavanja keša.
 */

type RedLokal = {
  id: string
  slug: string
  naziv: string
  ulica: string
  adresa: string
  telefon: string
  email: string | null
  lat: string | null
  lng: string | null
  radno_vrijeme: Lokal["radnoVrijeme"]
  wolt_url: string | null
  glovo_url: string | null
  google_place_id: string | null
  uvodni_tekst: Prevod
  ocjena: string | null
  broj_recenzija: number | null
  glavni: boolean
  stanje: string
  redoslijed: number
}

function uLokal(r: RedLokal): Lokal {
  return {
    id: r.id,
    slug: r.slug,
    naziv: r.naziv,
    ulica: r.ulica,
    adresa: r.adresa,
    telefon: r.telefon,
    email: r.email ?? undefined,
    lat: r.lat === null ? undefined : Number(r.lat),
    lng: r.lng === null ? undefined : Number(r.lng),
    radnoVrijeme: r.radno_vrijeme,
    woltUrl: r.wolt_url ?? undefined,
    glovoUrl: r.glovo_url ?? undefined,
    googlePlaceId: r.google_place_id ?? undefined,
    uvodniTekst: r.uvodni_tekst,
    ocjena: r.ocjena === null ? undefined : Number(r.ocjena),
    brojRecenzija: r.broj_recenzija ?? undefined,
    glavni: r.glavni,
    stanje: r.stanje as Lokal["stanje"],
    redoslijed: r.redoslijed,
  }
}

const POLJA = `
  id, slug, naziv, ulica, adresa, telefon, email, lat, lng, radno_vrijeme,
  wolt_url, glovo_url, google_place_id, uvodni_tekst, ocjena,
  broj_recenzija, glavni, stanje, redoslijed
`

/** Svi lokali, i zatvoreni — admin mora vidjeti i njih. */
export async function sviLokali(): Promise<(Lokal & { brojJela: number })[]> {
  const redovi = await upitAdmin<RedLokal & { broj_jela: string }>(
    `select ${POLJA},
            (select count(*) from lokal_jela lj where lj.lokal_id = l.id) as broj_jela
     from lokali l order by redoslijed, naziv`,
  )
  return redovi.map((r) => ({ ...uLokal(r), brojJela: Number(r.broj_jela) }))
}

export async function lokalPoSlugu(slug: string): Promise<Lokal | null> {
  const redovi = await upitAdmin<RedLokal>(
    `select ${POLJA} from lokali l where slug = $1`,
    [slug],
  )
  return redovi[0] ? uLokal(redovi[0]) : null
}

// ─────────────────────────────────────────────────────────────

type RedJelo = {
  id: string
  slug: string
  kategorija_id: string
  naziv: Prevod
  opis: Prevod
  sastojci: PrevodLista
  alergeni: string[]
  slika_url: string | null
  slika_alt: Prevod
  halal: boolean
  vegetarijansko: boolean
  vegansko: boolean
  ljuto: number
  kalorije: number | null
  aktivno: boolean
}

function uJelo(r: RedJelo): Jelo {
  return {
    id: r.id,
    slug: r.slug,
    kategorijaId: r.kategorija_id,
    naziv: r.naziv,
    opis: r.opis,
    sastojci: r.sastojci,
    alergeni: r.alergeni,
    slikaUrl: r.slika_url ?? undefined,
    slikaAlt: r.slika_alt,
    halal: r.halal,
    vegetarijansko: r.vegetarijansko,
    vegansko: r.vegansko,
    ljuto: Math.min(3, Math.max(0, r.ljuto)) as 0 | 1 | 2 | 3,
    kalorije: r.kalorije ?? undefined,
    aktivno: r.aktivno,
  }
}

const POLJA_JELA = `
  id, slug, kategorija_id, naziv, opis, sastojci, alergeni, slika_url,
  slika_alt, halal, vegetarijansko, vegansko, ljuto, kalorije, aktivno
`

/**
 * Sva jela, i deaktivirana. Kolona „u koliko lokala" odmah pokazuje jelo
 * koje nije ni u jednom meniju.
 */
export async function svaJela(): Promise<(Jelo & { uLokala: number })[]> {
  const redovi = await upitAdmin<RedJelo & { u_lokala: string }>(
    `select ${POLJA_JELA},
            (select count(*) from lokal_jela lj where lj.jelo_id = j.id) as u_lokala
     from jela j order by slug`,
  )
  return redovi.map((r) => ({ ...uJelo(r), uLokala: Number(r.u_lokala) }))
}

export async function jeloPoSlugu(slug: string): Promise<Jelo | null> {
  const redovi = await upitAdmin<RedJelo>(
    `select ${POLJA_JELA} from jela j where slug = $1`,
    [slug],
  )
  return redovi[0] ? uJelo(redovi[0]) : null
}

// ─────────────────────────────────────────────────────────────

export async function sveKategorije(): Promise<
  (Kategorija & { brojJela: number })[]
> {
  const redovi = await upitAdmin<{
    id: string
    slug: string
    naziv: Prevod
    opis: Prevod | null
    redoslijed: number
    aktivna: boolean
    broj_jela: string
  }>(
    `select k.id, k.slug, k.naziv, k.opis, k.redoslijed, k.aktivna,
            (select count(*) from jela j where j.kategorija_id = k.id) as broj_jela
     from kategorije k order by k.redoslijed, k.slug`,
  )

  return redovi.map((r) => ({
    id: r.id,
    slug: r.slug,
    naziv: r.naziv,
    opis: r.opis ?? undefined,
    redoslijed: r.redoslijed,
    aktivna: r.aktivna,
    brojJela: Number(r.broj_jela),
  }))
}

export async function kategorijaPoSlugu(
  slug: string,
): Promise<Kategorija | null> {
  const redovi = await upitAdmin<{
    id: string
    slug: string
    naziv: Prevod
    opis: Prevod | null
    redoslijed: number
    aktivna: boolean
  }>(
    `select id, slug, naziv, opis, redoslijed, aktivna
     from kategorije where slug = $1`,
    [slug],
  )
  const r = redovi[0]
  return r
    ? {
        id: r.id,
        slug: r.slug,
        naziv: r.naziv,
        opis: r.opis ?? undefined,
        redoslijed: r.redoslijed,
        aktivna: r.aktivna,
      }
    : null
}
