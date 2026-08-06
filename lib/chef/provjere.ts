import { JEZICI, type Lang, type Prevod, type PrevodLista } from "../domain"
import { jeRezervisan } from "../route"

/**
 * Provjere obrazaca.
 *
 * SERVERSKA PROVJERA JE JEDINA KOJA SE RAČUNA. Ona u pregledniku je
 * udobnost — korisnik vidi grešku prije slanja — ali se lako zaobiđe.
 */

export type Greske = Record<string, string>

/**
 * Alergeni stoje ovdje, a ne u `jela.ts`, jer je taj modul `"use server"` —
 * takav smije izvoziti samo async funkcije, ne i konstante.
 */
export const ALERGENI = [
  "gluten",
  "laktoza",
  "sezam",
  "orasasti",
  "jaja",
  "riba",
  "soja",
  "gorusica",
] as const

export function jeValjanSlug(slug: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)
}

/** Prijedlog sluga iz naziva: šumnici se prevode, ostalo pada. */
export function predloziSlug(tekst: string): string {
  return tekst
    .toLowerCase()
    .replace(/č|ć/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/đ/g, "d")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/** Zajedničke provjere sluga. Rezervisane brani i baza, ovdje je poruka ljepša. */
export function provjeriSlug(
  slug: string,
  { rezervisani = true }: { rezervisani?: boolean } = {},
): string | null {
  if (!slug) return "Naslov je obvezen."
  if (!jeValjanSlug(slug)) {
    return "Samo male črke, številke in vezaji — brez šumnikov in presledkov."
  }
  if (rezervisani && jeRezervisan(slug)) {
    return `Naslov „${slug}" je rezerviran za stran na spletišču.`
  }
  return null
}

export function obavezno(vrijednost: string, poruka: string): string | null {
  return vrijednost.trim() ? null : poruka
}

/**
 * Prevodivo polje iz obrasca: `polje.sl`, `polje.en`, …
 * Prazni jezici se izostavljaju, da `t()` može pasti na sljedeći.
 */
export function prevodIzObrasca(podaci: FormData, prefiks: string): Prevod {
  const prevod: Prevod = {}
  for (const jezik of JEZICI) {
    const v = String(podaci.get(`${prefiks}.${jezik.kod}`) ?? "").trim()
    if (v) prevod[jezik.kod as Lang] = v
  }
  return prevod
}

/** Lista po jeziku — jedna stavka po redu. */
export function prevodListeIzObrasca(
  podaci: FormData,
  prefiks: string,
): PrevodLista {
  const lista: PrevodLista = {}
  for (const jezik of JEZICI) {
    const v = String(podaci.get(`${prefiks}.${jezik.kod}`) ?? "")
    const stavke = v
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
    if (stavke.length) lista[jezik.kod as Lang] = stavke
  }
  return lista
}

/** Slovenski je obavezan — on je izvor za sve ostale jezike. */
export function provjeriPrevod(prevod: Prevod, poruka: string): string | null {
  return prevod.sl?.trim() ? null : poruka
}

export function brojIliNull(vrijednost: FormDataEntryValue | null): number | null {
  const s = String(vrijednost ?? "").trim().replace(",", ".")
  if (!s) return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

/** Cijena: prihvata i zarez i tačku, odbija negativnu. */
export function cijenaIzTeksta(vrijednost: FormDataEntryValue | null): number | null {
  const n = brojIliNull(vrijednost)
  if (n === null || n < 0) return null
  return Math.round(n * 100) / 100
}
