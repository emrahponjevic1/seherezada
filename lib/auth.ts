import "server-only"

import { randomBytes, scrypt, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"
import { cookies } from "next/headers"

import { upitAdmin } from "./baza"
import { KOLACIC_SESIJE, procitajSesiju, type Sesija } from "./sesija"

/**
 * Prijava — vlastita, jer bazu vodimo sami.
 *
 * Lozinka se čuva kao scrypt heš sa vlastitom soli. scrypt je namjerno
 * spor i troši memoriju, pa je pogađanje skupo i onda kad baza procuri.
 *
 * `server-only` je tu da ovaj modul nikad ne završi u snopu koji ide u
 * preglednik — build pukne ako ga neko slučajno uveze u klijentsku
 * komponentu.
 */

// promisify bira preopterećenje bez opcija, pa se potpis navodi izričito.
const scryptAsync = promisify(scrypt) as (
  lozinka: string,
  sol: Buffer,
  duzina: number,
  opcije: { N: number },
) => Promise<Buffer>

const N = 16384 // cijena; udvostručenje udvostručuje vrijeme
const DUZINA = 64

export async function hesirajLozinku(lozinka: string): Promise<string> {
  const sol = randomBytes(16)
  const hes = (await scryptAsync(lozinka, sol, DUZINA, { N })) as Buffer
  return `scrypt$${sol.toString("hex")}$${hes.toString("hex")}`
}

export async function provjeriLozinku(
  lozinka: string,
  zapis: string,
): Promise<boolean> {
  const [algoritam, solHex, hesHex] = zapis.split("$")
  if (algoritam !== "scrypt" || !solHex || !hesHex) return false

  const sol = Buffer.from(solHex, "hex")
  const ocekivano = Buffer.from(hesHex, "hex")
  const dobijeno = (await scryptAsync(lozinka, sol, ocekivano.length, {
    N,
  })) as Buffer

  // Poređenje otporno na mjerenje vremena — obično `===` odaje koliko
  // se znakova poklopilo.
  return (
    ocekivano.length === dobijeno.length &&
    timingSafeEqual(ocekivano, dobijeno)
  )
}

// ─────────────────────────────────────────────────────────────

export interface Korisnik {
  id: string
  email: string
  ime: string | null
}

/**
 * Provjera prijave. Poruka pozivaocu NIKAD ne smije otkriti da li je
 * e-mail postojeći — inače je to spisak naloga za pogađanje.
 */
export async function prijaviKorisnika(
  email: string,
  lozinka: string,
): Promise<Korisnik | null> {
  const redovi = await upitAdmin<{
    id: string
    email: string
    ime: string | null
    lozinka_hash: string
    aktivan: boolean
  }>(
    `select id, email, ime, lozinka_hash, aktivan
     from korisnici where lower(email) = lower($1)`,
    [email.trim()],
  )

  const korisnik = redovi[0]
  if (!korisnik || !korisnik.aktivan) {
    // Heš se svejedno računa, da odgovor traje jednako dugo kao za
    // postojeći nalog — inače trajanje odaje koji e-mail postoji.
    await hesirajLozinku(lozinka)
    return null
  }

  if (!(await provjeriLozinku(lozinka, korisnik.lozinka_hash))) return null

  await upitAdmin(`update korisnici set zadnja_prijava = now() where id = $1`, [
    korisnik.id,
  ])

  return { id: korisnik.id, email: korisnik.email, ime: korisnik.ime }
}

/** Trenutna sesija, ili `null`. Koristi je okvir /chef i serverske akcije. */
export async function trenutnaSesija(): Promise<Sesija | null> {
  const kolacici = await cookies()
  return procitajSesiju(kolacici.get(KOLACIC_SESIJE)?.value)
}

/**
 * Za serverske akcije: vrati sesiju ili baci jasnu grešku.
 * Koraci 14–16 je koriste prije svakog upisa.
 */
export async function zahtijevajSesiju(): Promise<Sesija> {
  const sesija = await trenutnaSesija()
  if (!sesija) {
    throw new Error("Seja je potekla, prijavite se znova.")
  }
  return sesija
}
