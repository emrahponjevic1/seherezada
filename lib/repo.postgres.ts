import { unstable_cache } from "next/cache"

import { upit } from "./baza"
import type {
  Jelo,
  Kategorija,
  Lokal,
  MenuSekcija,
  MenuStavka,
  Prevod,
  PrevodLista,
  RadnoVrijeme,
  StanjeLokala,
} from "./domain"

/**
 * Repozitorij nad PostgreSQL bazom.
 *
 * Dvije stvari koje su ovdje namjerne:
 *
 *  1. `getMeni` je JEDAN upit sa spojem, ne upit po kategoriji. Grupisanje
 *     u `MenuSekcija[]` radi kod. Bez toga bi meni sa osam kategorija
 *     pravio devet odlazaka u bazu.
 *
 *  2. Svaki upit je umotan u `unstable_cache` sa oznakama ODMAH, a ne
 *     naknadno. Kad bi se to ostavilo za korak 12, svaki poziv bi se
 *     prepravljao.
 */

// ─────────────────────────────────────────────────────────────
//  Oznake keša — korak 12 gradi poništavanje nad njima
// ─────────────────────────────────────────────────────────────

export const TAG = {
  lokali: "lokali",
  jela: "jela",
  kategorije: "kategorije",
  preusmjerenja: "preusmjerenja",
  /** Meni jednog lokala. Cijena se mijenja po lokalu, opis jela svugdje. */
  meni: (lokalSlug: string) => `meni:${lokalSlug}`,
} as const

// ─────────────────────────────────────────────────────────────
//  Redovi iz baze → domenski tipovi
// ─────────────────────────────────────────────────────────────

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
  radno_vrijeme: RadnoVrijeme
  wolt_url: string | null
  glovo_url: string | null
  google_place_id: string | null
  uvodni_tekst: Prevod
  ocjena: string | null
  broj_recenzija: number | null
  recenzije_azurirano: Date | null
  glavni: boolean
  stanje: string
  redoslijed: number
}

/** `numeric` stiže iz drajvera kao string — pretvara se ovdje, jednom. */
function broj(v: string | null): number | undefined {
  return v === null ? undefined : Number(v)
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
    lat: broj(r.lat),
    lng: broj(r.lng),
    radnoVrijeme: r.radno_vrijeme,
    woltUrl: r.wolt_url ?? undefined,
    glovoUrl: r.glovo_url ?? undefined,
    googlePlaceId: r.google_place_id ?? undefined,
    uvodniTekst: r.uvodni_tekst,
    ocjena: broj(r.ocjena),
    brojRecenzija: r.broj_recenzija ?? undefined,
    recenzijeAzurirano: r.recenzije_azurirano?.toISOString(),
    glavni: r.glavni,
    stanje: r.stanje as StanjeLokala,
    redoslijed: r.redoslijed,
  }
}

type RedKategorija = {
  id: string
  slug: string
  naziv: Prevod
  opis: Prevod | null
  redoslijed: number
  aktivna: boolean
}

function uKategoriju(r: RedKategorija): Kategorija {
  return {
    id: r.id,
    slug: r.slug,
    naziv: r.naziv,
    opis: r.opis ?? undefined,
    redoslijed: r.redoslijed,
    aktivna: r.aktivna,
  }
}

type RedJelo = {
  jelo_id: string
  jelo_slug: string
  kategorija_id: string
  jelo_naziv: Prevod
  jelo_opis: Prevod
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
    id: r.jelo_id,
    slug: r.jelo_slug,
    kategorijaId: r.kategorija_id,
    naziv: r.jelo_naziv,
    opis: r.jelo_opis,
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

// ─────────────────────────────────────────────────────────────
//  Upiti
// ─────────────────────────────────────────────────────────────

const POLJA_LOKALA = `
  id, slug, naziv, ulica, adresa, telefon, email, lat, lng,
  radno_vrijeme, wolt_url, glovo_url, google_place_id, uvodni_tekst,
  ocjena, broj_recenzija, recenzije_azurirano, glavni, stanje, redoslijed
`

const dohvatiLokale = unstable_cache(
  async (): Promise<Lokal[]> => {
    const redovi = await upit<RedLokal>(
      `select ${POLJA_LOKALA} from lokali
       where stanje <> 'zatvoren'
       order by redoslijed, naziv`,
    )
    return redovi.map(uLokal)
  },
  ["lokali:svi"],
  { tags: [TAG.lokali] },
)

const dohvatiLokal = unstable_cache(
  async (slug: string): Promise<Lokal | null> => {
    const redovi = await upit<RedLokal>(
      `select ${POLJA_LOKALA} from lokali where slug = $1`,
      [slug],
    )
    return redovi[0] ? uLokal(redovi[0]) : null
  },
  ["lokali:jedan"],
  { tags: [TAG.lokali] },
)

const dohvatiGlavni = unstable_cache(
  async (): Promise<Lokal> => {
    const redovi = await upit<RedLokal>(
      `select ${POLJA_LOKALA} from lokali where glavni limit 1`,
    )
    if (!redovi[0]) throw new Error("Nijedan lokal nije označen kao glavni")
    return uLokal(redovi[0])
  },
  ["lokali:glavni"],
  { tags: [TAG.lokali] },
)

const dohvatiKategorije = unstable_cache(
  async (): Promise<Kategorija[]> => {
    const redovi = await upit<RedKategorija>(
      `select id, slug, naziv, opis, redoslijed, aktivna
       from kategorije where aktivna order by redoslijed`,
    )
    return redovi.map(uKategoriju)
  },
  ["kategorije:sve"],
  { tags: [TAG.kategorije] },
)

/** Jedan upit sa spojem — bez N+1. */
const UPIT_MENIJA = `
  select
    k.id as kat_id, k.slug as kat_slug, k.naziv as kat_naziv,
    k.opis as kat_opis, k.redoslijed as kat_redoslijed, k.aktivna as kat_aktivna,
    j.id as jelo_id, j.slug as jelo_slug, j.kategorija_id,
    j.naziv as jelo_naziv, j.opis as jelo_opis, j.sastojci, j.alergeni,
    j.slika_url, j.slika_alt, j.halal, j.vegetarijansko, j.vegansko,
    j.ljuto, j.kalorije, j.aktivno,
    lj.cijena, lj.dostupno, lj.izdvojeno, lj.redoslijed as stavka_redoslijed
  from lokal_jela lj
  join lokali l     on l.id = lj.lokal_id
  join jela j       on j.id = lj.jelo_id
  join kategorije k on k.id = j.kategorija_id
  where l.slug = $1 and lj.dostupno and j.aktivno and k.aktivna
  order by k.redoslijed, lj.redoslijed, j.slug
`

type RedMenija = RedJelo & {
  kat_id: string
  kat_slug: string
  kat_naziv: Prevod
  kat_opis: Prevod | null
  kat_redoslijed: number
  kat_aktivna: boolean
  cijena: string
  dostupno: boolean
  izdvojeno: boolean
  stavka_redoslijed: number
}

function uStavku(r: RedMenija): MenuStavka {
  return {
    jelo: uJelo(r),
    cijena: Number(r.cijena),
    dostupno: r.dostupno,
    izdvojeno: r.izdvojeno,
    redoslijed: r.stavka_redoslijed,
  }
}

/**
 * Oznake se vežu ZA LOKAL, pa promjena cijene u jednom lokalu ne obara
 * keš drugom. Zato se `unstable_cache` pravi po slugu — oznake su
 * statične po omotaču, pa se drugačije ne može dobiti `meni:{lokal}`.
 *
 * Meni nosi TRI oznake: svoju, `jela` i `kategorije`. Promjena cijene
 * pogađa jedan lokal, a promjena opisa jela sve.
 */
const dohvatiMeni = (lokalSlug: string): Promise<MenuSekcija[]> =>
  unstable_cache(
    async (): Promise<MenuSekcija[]> => {
      const redovi = await upit<RedMenija>(UPIT_MENIJA, [lokalSlug])

      // Grupisanje po kategoriji radi kod, ne baza — jedan odlazak umjesto devet.
      const sekcije: MenuSekcija[] = []
      const poKategoriji = new Map<string, MenuSekcija>()

      for (const r of redovi) {
        let sekcija = poKategoriji.get(r.kat_id)
        if (!sekcija) {
          sekcija = {
            kategorija: uKategoriju({
              id: r.kat_id,
              slug: r.kat_slug,
              naziv: r.kat_naziv,
              opis: r.kat_opis,
              redoslijed: r.kat_redoslijed,
              aktivna: r.kat_aktivna,
            }),
            stavke: [],
          }
          poKategoriji.set(r.kat_id, sekcija)
          sekcije.push(sekcija)
        }
        sekcija.stavke.push(uStavku(r))
      }

      // Prazne kategorije ne postoje u rezultatu — spoj ih je već izostavio.
      return sekcije
    },
    ["meni", lokalSlug],
    { tags: [TAG.meni(lokalSlug), TAG.jela, TAG.kategorije] },
  )()

const dohvatiIzdvojena = (lokalSlug: string): Promise<MenuStavka[]> =>
  unstable_cache(
    async (): Promise<MenuStavka[]> => {
      const redovi = await upit<RedMenija>(
        UPIT_MENIJA.replace("and j.aktivno", "and j.aktivno and lj.izdvojeno"),
        [lokalSlug],
      )
      return redovi.map(uStavku)
    },
    ["izdvojena", lokalSlug],
    { tags: [TAG.meni(lokalSlug), TAG.jela] },
  )()

const dohvatiJelo = unstable_cache(
  async (slug: string): Promise<Jelo | null> => {
    const redovi = await upit<RedJelo>(
      `select id as jelo_id, slug as jelo_slug, kategorija_id,
              naziv as jelo_naziv, opis as jelo_opis, sastojci, alergeni,
              slika_url, slika_alt, halal, vegetarijansko, vegansko,
              ljuto, kalorije, aktivno
       from jela where slug = $1 and aktivno`,
      [slug],
    )
    return redovi[0] ? uJelo(redovi[0]) : null
  },
  ["jelo"],
  { tags: [TAG.jela] },
)

const dohvatiPreusmjerenje = unstable_cache(
  async (stariSlug: string): Promise<string | null> => {
    const redovi = await upit<{ novi_slug: string }>(
      `select novi_slug from preusmjerenja where stari_slug = $1`,
      [stariSlug],
    )
    return redovi[0]?.novi_slug ?? null
  },
  ["preusmjerenje"],
  { tags: [TAG.preusmjerenja] },
)

// ─────────────────────────────────────────────────────────────

export const postgresRepo = {
  getLokali: dohvatiLokale,
  getLokal: dohvatiLokal,
  getGlavniLokal: dohvatiGlavni,
  getKategorije: dohvatiKategorije,
  getMeni: dohvatiMeni,
  getIzdvojena: dohvatiIzdvojena,
  getJelo: dohvatiJelo,
  getPreusmjerenje: dohvatiPreusmjerenje,
}
