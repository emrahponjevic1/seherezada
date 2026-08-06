/**
 * Razrješavanje adresa — jedno mjesto koje zna šta koja adresa znači.
 *
 * Adresa ima tri dijela: jezik / lokal / stranica. Dva se izostavljaju kad
 * su podrazumijevana — slovenski nema prefiks, glavni lokal nema prefiks.
 * Zato `/meni` znači „slovenski, glavni lokal, meni".
 *
 * `/meni`, `/seherezada2` i `/o-nas` su svi JEDAN segment, a znače tri
 * različite stvari. Next.js ne može razlikovati app/[lokal] od
 * app/[stranica] — to je sudar ruta. Zato postoji jedan catch-all i ova
 * funkcija, koja zna redoslijed razrješavanja.
 */

import {
  DEFAULT_LANG,
  JEZICI,
  type Lang,
} from "./domain"

// ─────────────────────────────────────────────────────────────
//  Konstante
// ─────────────────────────────────────────────────────────────

/** Stranice koje pripadaju jednom lokalu: /meni, /seherezada2/meni */
export const LOKAL_PAGES = ["meni", "recenzije"] as const
export type LokalPage = (typeof LOKAL_PAGES)[number]

/** Zajedničke stranice — iste za sve lokale, bez lokala u adresi. */
export const SHARED_PAGES = [
  "o-nas",
  "halal",
  "galerija",
  "pogosta-vprasanja",
  "zasebnost",
  "pogoji",
] as const
export type SharedPage = (typeof SHARED_PAGES)[number]

/** Ciljane stranice za pretragu. */
export const SEO_PAGES = [
  "kebab-ljubljana",
  "pizza-ljubljana",
  "burger-ljubljana",
  "falafel-ljubljana",
  "halal-hrana-ljubljana",
  "nocna-hrana-ljubljana",
  "dostava-ljubljana",
  "studentski-meni-ljubljana",
] as const
export type SeoPage = (typeof SEO_PAGES)[number]

/**
 * Lokal se NE SMIJE ovako zvati — inače bi oteo postojeću adresu.
 *
 * Isti spisak stoji i u trigeru baze (korak 10). Kad se doda nova stranica,
 * mora i nova migracija koja dopunjava triger.
 */
export const REZERVISANI: readonly string[] = [
  // jezici — i kodovi i prefiksi
  ...JEZICI.map((j) => j.kod),
  ...JEZICI.map((j) => j.prefiks).filter((p): p is string => p !== null),
  ...LOKAL_PAGES,
  ...SHARED_PAGES,
  ...SEO_PAGES,
  // tehničke adrese
  "chef",
  "api",
  "sitemap.xml",
  "robots.txt",
  "_next",
  "favicon.ico",
  "favicon.svg",
]

export function jeRezervisan(slug: string): boolean {
  return REZERVISANI.includes(slug)
}

// ─────────────────────────────────────────────────────────────
//  Tip rezultata
// ─────────────────────────────────────────────────────────────

export type Route =
  | { kind: "lokal-home"; lang: Lang; lokal: string }
  | { kind: "lokal-page"; lang: Lang; lokal: string; page: LokalPage }
  | { kind: "shared"; lang: Lang; page: SharedPage }
  | { kind: "seo"; lang: Lang; page: SeoPage }
  | { kind: "redirect"; to: string; trajno: boolean }
  | { kind: "notfound" }

/** Sve što resolver treba, a dolazi iz repozitorija — nikad iz konstante. */
export interface RouteKontekst {
  lokalSlugi: string[]
  glavniSlug: string
  /** Stari slug → novi slug. Puni ga korak 14, koristi korak 18. */
  preusmjerenja?: Record<string, string>
}

// ─────────────────────────────────────────────────────────────
//  Pomoćnici
// ─────────────────────────────────────────────────────────────

function jePrefiksJezika(segment: string): Lang | null {
  const nadjen = JEZICI.find((j) => j.prefiks === segment)
  return nadjen ? nadjen.kod : null
}

/** `sl` u adresi je suvišan — postoji samo da bi se preusmjerio. */
function jeSuvisniJezik(segment: string): boolean {
  return JEZICI.some((j) => j.kod === segment && j.prefiks === null)
}

function jeLokalPage(x: string): x is LokalPage {
  return (LOKAL_PAGES as readonly string[]).includes(x)
}

function jeSharedPage(x: string): x is SharedPage {
  return (SHARED_PAGES as readonly string[]).includes(x)
}

function jeSeoPage(x: string): x is SeoPage {
  return (SEO_PAGES as readonly string[]).includes(x)
}

/** Sastavlja putanju bez kose crte na kraju. */
function putanja(dijelovi: (string | null | undefined)[]): string {
  const cisti = dijelovi.filter((d): d is string => !!d)
  return cisti.length ? "/" + cisti.join("/") : "/"
}

// ─────────────────────────────────────────────────────────────
//  Razrješavanje
// ─────────────────────────────────────────────────────────────

/**
 * Redoslijed je OBAVEZAN, ne proizvoljan. Ključno: stranice lokala se
 * provjeravaju PRIJE slugova lokala, da lokal nazvan „meni" ne bi oteo
 * stranicu menija. Ista zaštita stoji i u obrascu na /chef i u bazi.
 */
export function resolveRoute(
  slug: string[] | undefined,
  ctx: RouteKontekst,
): Route {
  const segmenti = (slug ?? []).filter((s) => s.length > 0)
  const { lokalSlugi, glavniSlug, preusmjerenja = {} } = ctx

  // ── 1. Jezik ───────────────────────────────────────────────
  let lang: Lang = DEFAULT_LANG
  let ostatak = segmenti

  if (segmenti.length > 0) {
    const prvi = segmenti[0]

    // /sl/... je suvišno — trajno na adresu bez prefiksa
    if (jeSuvisniJezik(prvi)) {
      return {
        kind: "redirect",
        to: putanja(segmenti.slice(1)),
        trajno: true,
      }
    }

    const izPrefiksa = jePrefiksJezika(prvi)
    if (izPrefiksa) {
      lang = izPrefiksa
      ostatak = segmenti.slice(1)
    }
  }

  const prefiks = JEZICI.find((j) => j.kod === lang)?.prefiks ?? null

  // ── 2. Ostatak ─────────────────────────────────────────────

  // [] → naslovna glavnog lokala
  if (ostatak.length === 0) {
    return { kind: "lokal-home", lang, lokal: glavniSlug }
  }

  if (ostatak.length === 1) {
    const x = ostatak[0]

    // Glavni lokal se ne piše u adresi
    if (x === glavniSlug) {
      return { kind: "redirect", to: putanja([prefiks]), trajno: true }
    }

    // Stranice lokala PRIJE slugova lokala
    if (jeLokalPage(x)) {
      return { kind: "lokal-page", lang, lokal: glavniSlug, page: x }
    }

    if (lokalSlugi.includes(x)) {
      return { kind: "lokal-home", lang, lokal: x }
    }

    if (jeSharedPage(x)) {
      return { kind: "shared", lang, page: x }
    }

    if (jeSeoPage(x)) {
      return { kind: "seo", lang, page: x }
    }

    // Preimenovan lokal — stara adresa i dalje mora voditi negdje
    const novi = preusmjerenja[x]
    if (novi) {
      return { kind: "redirect", to: putanja([prefiks, novi]), trajno: true }
    }

    return { kind: "notfound" }
  }

  if (ostatak.length === 2) {
    const [l, p] = ostatak

    if (!jeLokalPage(p)) return { kind: "notfound" }

    // Glavni lokal nema prefiks — /trubarjeva/meni ide na /meni
    if (l === glavniSlug) {
      return { kind: "redirect", to: putanja([prefiks, p]), trajno: true }
    }

    if (lokalSlugi.includes(l)) {
      return { kind: "lokal-page", lang, lokal: l, page: p }
    }

    const novi = preusmjerenja[l]
    if (novi) {
      return {
        kind: "redirect",
        to: putanja([prefiks, novi, p]),
        trajno: true,
      }
    }

    return { kind: "notfound" }
  }

  return { kind: "notfound" }
}

// ─────────────────────────────────────────────────────────────
//  Obrnuti smjer — gradnja adresa
// ─────────────────────────────────────────────────────────────

/**
 * Jedini način gradnje adresa. Nikad ih ne sastavljati ručno — bez ovoga
 * prekidač lokala i prekidač jezika gube kontekst, jer bi svaki gradio
 * adresu po svome.
 *
 * Pravila: `sl` se izostavlja · glavni lokal se izostavlja ·
 * nikad kosa crta na kraju.
 */
export function href(r: Route, glavniSlug: string): string {
  if (r.kind === "redirect") return r.to
  if (r.kind === "notfound") return "/"

  const prefiks = JEZICI.find((j) => j.kod === r.lang)?.prefiks ?? null

  switch (r.kind) {
    case "lokal-home":
      return putanja([prefiks, r.lokal === glavniSlug ? null : r.lokal])

    case "lokal-page":
      return putanja([
        prefiks,
        r.lokal === glavniSlug ? null : r.lokal,
        r.page,
      ])

    case "shared":
    case "seo":
      return putanja([prefiks, r.page])
  }
}

/**
 * Vezana verzija — komponente dobiju `href(route)` bez nošenja glavnog
 * sluga kroz svaki poziv.
 */
export function napraviHref(glavniSlug: string) {
  return (r: Route): string => href(r, glavniSlug)
}
