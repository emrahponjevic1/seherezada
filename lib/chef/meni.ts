"use server"

import { zahtijevajSesiju } from "../auth"
import { bazaAdmin, upitAdmin } from "../baza"
import { revalidirajMeni } from "../revalidate"
import { cijenaIzTeksta } from "./provjere"

/**
 * Meni jednog lokala — ovdje se spajaju lokali i katalog.
 *
 * Novi lokal počinje PRAZNOG menija: katalog je biblioteka, meni je
 * izbor iz nje. Zato dodavanje jela traži cijenu odmah — jelo bez cijene
 * u meniju nema smisla.
 */

export interface Ishod {
  ok: boolean
  poruka?: string
  /** Vrijednost koju sučelje treba vratiti kad snimanje ne uspije. */
  vrati?: number
}

async function idLokala(slug: string): Promise<string | null> {
  const r = await upitAdmin<{ id: string }>(
    `select id from lokali where slug = $1`,
    [slug],
  )
  return r[0]?.id ?? null
}

/**
 * Cijena se uređuje u samom redu, bez otvaranja jela.
 *
 * Kad snimanje ne uspije, vraća se STARA vrijednost — inače bi u polju
 * ostao broj koji u bazi ne postoji, a vlasnik bi mislio da je snimljen.
 */
export async function postaviCijenu(
  lokalSlug: string,
  jeloId: string,
  unos: string,
): Promise<Ishod> {
  try {
    await zahtijevajSesiju()
  } catch {
    return { ok: false, poruka: "Seja je potekla, prijavite se znova." }
  }

  const stara = await upitAdmin<{ cijena: string }>(
    `select lj.cijena from lokal_jela lj join lokali l on l.id = lj.lokal_id
     where l.slug = $1 and lj.jelo_id = $2`,
    [lokalSlug, jeloId],
  )
  const prethodna = stara[0] ? Number(stara[0].cijena) : undefined

  // Prihvata i zarez i tačku; negativna se odbija.
  const cijena = cijenaIzTeksta(unos)
  if (cijena === null) {
    return {
      ok: false,
      poruka: "Neveljavna cena. Vpišite število, npr. 9,50.",
      vrati: prethodna,
    }
  }

  try {
    await upitAdmin(
      `update lokal_jela set cijena = $1
       where jelo_id = $2 and lokal_id = (select id from lokali where slug = $3)`,
      [cijena, jeloId, lokalSlug],
    )
  } catch {
    return { ok: false, poruka: "Shranjevanje ni uspelo.", vrati: prethodna }
  }

  revalidirajMeni(lokalSlug)
  return { ok: true }
}

/** „Primijeni na sve lokale" — isti red u zbirnoj tabeli. */
export async function postaviCijenuSvugdje(
  jeloId: string,
  unos: string,
): Promise<Ishod> {
  try {
    await zahtijevajSesiju()
  } catch {
    return { ok: false, poruka: "Seja je potekla, prijavite se znova." }
  }

  const cijena = cijenaIzTeksta(unos)
  if (cijena === null) return { ok: false, poruka: "Neveljavna cena." }

  const lokali = await upitAdmin<{ slug: string }>(
    `update lokal_jela set cijena = $1 where jelo_id = $2
     returning (select slug from lokali where id = lokal_id) as slug`,
    [cijena, jeloId],
  )

  // Mijenja red samo tamo gdje jelo POSTOJI — ne dodaje ga nigdje.
  for (const l of lokali) revalidirajMeni(l.slug)
  return { ok: true }
}

/**
 * Dodavanje iz kataloga — najčešća radnja u cijelom adminu.
 * Isto jelo se ne može dodati dvaput; to brani i primarni ključ u bazi.
 */
export async function dodajUMeni(
  lokalSlug: string,
  stavke: { jeloId: string; cijena: string }[],
): Promise<Ishod> {
  try {
    await zahtijevajSesiju()
  } catch {
    return { ok: false, poruka: "Seja je potekla, prijavite se znova." }
  }

  const lokalId = await idLokala(lokalSlug)
  if (!lokalId) return { ok: false, poruka: "Lokal ne obstaja." }

  const pripremljene: { jeloId: string; cijena: number }[] = []
  for (const s of stavke) {
    const c = cijenaIzTeksta(s.cijena)
    if (c === null) {
      return { ok: false, poruka: "Vsaka izbrana jed potrebuje veljavno ceno." }
    }
    pripremljene.push({ jeloId: s.jeloId, cijena: c })
  }
  if (!pripremljene.length) return { ok: false, poruka: "Ni izbrane jedi." }

  const klijent = await bazaAdmin().connect()
  try {
    await klijent.query("begin")
    for (const s of pripremljene) {
      await klijent.query(
        `insert into lokal_jela (lokal_id, jelo_id, cijena, redoslijed)
         values ($1,$2,$3,(select coalesce(max(redoslijed),0)+1 from lokal_jela where lokal_id=$1))
         on conflict (lokal_id, jelo_id) do nothing`,
        [lokalId, s.jeloId, s.cijena],
      )
    }
    await klijent.query("commit")
  } catch {
    await klijent.query("rollback")
    return { ok: false, poruka: "Dodajanje ni uspelo." }
  } finally {
    klijent.release()
  }

  revalidirajMeni(lokalSlug)
  return { ok: true }
}

/** Uklanja red iz `lokal_jela`. Jelo OSTAJE u katalogu. */
export async function ukloniIzMenija(podaci: FormData) {
  await zahtijevajSesiju()
  const lokalSlug = String(podaci.get("lokal") ?? "")
  const jeloId = String(podaci.get("jeloId") ?? "")

  await upitAdmin(
    `delete from lokal_jela
     where jelo_id = $1 and lokal_id = (select id from lokali where slug = $2)`,
    [jeloId, lokalSlug],
  )
  revalidirajMeni(lokalSlug)
}

/** `dostupno` = privremeno sakriveno; red i cijena ostaju. */
export async function prebaciZastavicu(podaci: FormData) {
  await zahtijevajSesiju()
  const lokalSlug = String(podaci.get("lokal") ?? "")
  const jeloId = String(podaci.get("jeloId") ?? "")
  const polje = String(podaci.get("polje") ?? "")
  const vrijednost = String(podaci.get("vrijednost") ?? "") === "1"

  if (polje !== "dostupno" && polje !== "izdvojeno") return

  await upitAdmin(
    `update lokal_jela set ${polje} = $1
     where jelo_id = $2 and lokal_id = (select id from lokali where slug = $3)`,
    [vrijednost, jeloId, lokalSlug],
  )
  revalidirajMeni(lokalSlug)
}

export async function pomjeriStavku(podaci: FormData) {
  await zahtijevajSesiju()
  const lokalSlug = String(podaci.get("lokal") ?? "")
  const jeloId = String(podaci.get("jeloId") ?? "")
  const smjer = String(podaci.get("smjer") ?? "")

  // Redoslijed vrijedi UNUTAR kategorije, pa se i pomjeranje drži nje.
  const redovi = await upitAdmin<{ jelo_id: string }>(
    `select lj.jelo_id
     from lokal_jela lj
     join lokali l on l.id = lj.lokal_id
     join jela j on j.id = lj.jelo_id
     where l.slug = $1
       and j.kategorija_id = (select kategorija_id from jela where id = $2)
     order by lj.redoslijed, j.slug`,
    [lokalSlug, jeloId],
  )

  const i = redovi.findIndex((r) => r.jelo_id === jeloId)
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
        `update lokal_jela set redoslijed = $1
         where jelo_id = $2 and lokal_id = (select id from lokali where slug = $3)`,
        [k + 1, poredak[k].jelo_id, lokalSlug],
      )
    }
    await klijent.query("commit")
  } catch (greska) {
    await klijent.query("rollback")
    throw greska
  } finally {
    klijent.release()
  }

  revalidirajMeni(lokalSlug)
}
