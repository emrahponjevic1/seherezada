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

// ─────────────────────────────────────────────────────────────
//  Meni jednog lokala i zbirna tabela cijena
// ─────────────────────────────────────────────────────────────

export interface StavkaMenija {
  jeloId: string
  jeloSlug: string
  naziv: Prevod
  kategorijaId: string
  kategorijaNaziv: Prevod
  cijena: number
  dostupno: boolean
  izdvojeno: boolean
  redoslijed: number
  aktivno: boolean
}

/**
 * Meni jednog lokala za uređivanje — i jela koja su deaktivirana, jer
 * admin mora vidjeti da su tu, samo skrivena.
 */
export async function meniZaUredjivanje(
  lokalSlug: string,
): Promise<StavkaMenija[]> {
  return (
    await upitAdmin<{
      jelo_id: string
      jelo_slug: string
      naziv: Prevod
      kategorija_id: string
      kategorija_naziv: Prevod
      cijena: string
      dostupno: boolean
      izdvojeno: boolean
      redoslijed: number
      aktivno: boolean
    }>(
      `select j.id as jelo_id, j.slug as jelo_slug, j.naziv, j.aktivno,
              k.id as kategorija_id, k.naziv as kategorija_naziv,
              lj.cijena, lj.dostupno, lj.izdvojeno, lj.redoslijed
       from lokal_jela lj
       join lokali l     on l.id = lj.lokal_id
       join jela j       on j.id = lj.jelo_id
       join kategorije k on k.id = j.kategorija_id
       where l.slug = $1
       order by k.redoslijed, lj.redoslijed, j.slug`,
      [lokalSlug],
    )
  ).map((r) => ({
    jeloId: r.jelo_id,
    jeloSlug: r.jelo_slug,
    naziv: r.naziv,
    kategorijaId: r.kategorija_id,
    kategorijaNaziv: r.kategorija_naziv,
    cijena: Number(r.cijena),
    dostupno: r.dostupno,
    izdvojeno: r.izdvojeno,
    redoslijed: r.redoslijed,
    aktivno: r.aktivno,
  }))
}

/**
 * Zbirna tabela: sva jela × svi lokali. `null` znači da jelo nije u
 * meniju tog lokala — to je podatak, ne greška.
 */
export async function tabelaCijena(): Promise<{
  lokali: { slug: string; naziv: string }[]
  redovi: {
    jeloId: string
    jeloSlug: string
    naziv: Prevod
    kategorijaId: string
    cijene: Record<string, number | null>
  }[]
}> {
  const lokali = await upitAdmin<{ slug: string; naziv: string }>(
    `select slug, naziv from lokali where stanje <> 'zatvoren' order by redoslijed`,
  )

  const redovi = await upitAdmin<{
    jelo_id: string
    jelo_slug: string
    naziv: Prevod
    kategorija_id: string
    lokal_slug: string | null
    cijena: string | null
  }>(
    `select j.id as jelo_id, j.slug as jelo_slug, j.naziv, j.kategorija_id,
            l.slug as lokal_slug, lj.cijena
     from jela j
     join kategorije k on k.id = j.kategorija_id
     left join lokal_jela lj on lj.jelo_id = j.id
     left join lokali l on l.id = lj.lokal_id and l.stanje <> 'zatvoren'
     where j.aktivno
     order by k.redoslijed, j.slug`,
  )

  const poJelu = new Map<string, (typeof izlaz)[number]>()
  const izlaz: {
    jeloId: string
    jeloSlug: string
    naziv: Prevod
    kategorijaId: string
    cijene: Record<string, number | null>
  }[] = []

  for (const r of redovi) {
    let red = poJelu.get(r.jelo_id)
    if (!red) {
      red = {
        jeloId: r.jelo_id,
        jeloSlug: r.jelo_slug,
        naziv: r.naziv,
        kategorijaId: r.kategorija_id,
        cijene: Object.fromEntries(lokali.map((l) => [l.slug, null])),
      }
      poJelu.set(r.jelo_id, red)
      izlaz.push(red)
    }
    if (r.lokal_slug && r.cijena !== null) {
      red.cijene[r.lokal_slug] = Number(r.cijena)
    }
  }

  return { lokali, redovi: izlaz }
}

/** Jela koja NISU u meniju datog lokala — ponuda za dodavanje. */
export async function jelaVanMenija(lokalSlug: string): Promise<
  {
    id: string
    slug: string
    naziv: Prevod
    kategorijaId: string
    kategorijaNaziv: Prevod
    cijeneDrugdje: Record<string, number>
  }[]
> {
  const redovi = await upitAdmin<{
    id: string
    slug: string
    naziv: Prevod
    kategorija_id: string
    kategorija_naziv: Prevod
    cijene: Record<string, number> | null
  }>(
    `select j.id, j.slug, j.naziv, k.id as kategorija_id,
            k.naziv as kategorija_naziv,
            (select jsonb_object_agg(l2.slug, lj2.cijena)
             from lokal_jela lj2 join lokali l2 on l2.id = lj2.lokal_id
             where lj2.jelo_id = j.id) as cijene
     from jela j
     join kategorije k on k.id = j.kategorija_id
     where j.aktivno
       and not exists (
         select 1 from lokal_jela lj join lokali l on l.id = lj.lokal_id
         where lj.jelo_id = j.id and l.slug = $1
       )
     order by k.redoslijed, j.slug`,
    [lokalSlug],
  )

  return redovi.map((r) => ({
    id: r.id,
    slug: r.slug,
    naziv: r.naziv,
    kategorijaId: r.kategorija_id,
    kategorijaNaziv: r.kategorija_naziv,
    cijeneDrugdje: Object.fromEntries(
      Object.entries(r.cijene ?? {}).map(([k, v]) => [k, Number(v)]),
    ),
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
