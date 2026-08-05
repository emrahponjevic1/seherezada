/**
 * Domenski model — jedini izvor tipova za cijeli projekat.
 *
 * Sve što dolazi poslije (rute, stranice, admin, baza) uvozi odavde.
 * Zato model od prvog dana podržava više lokala i sedam jezika, iako
 * se za sada koristi jedan lokal i dva jezika.
 */

// ─────────────────────────────────────────────────────────────
//  Jezici
// ─────────────────────────────────────────────────────────────

/**
 * Kod i prefiks su NAMJERNO razdvojeni.
 *
 * Bosanski ima adresu /ba/, ali `hreflang` mora biti `bs` — `ba` nije
 * važeći jezički kod nego kod države. Da je jezik samo jedan string,
 * korak 22 bi morao prepravljati ovaj fajl, a na njemu sve ostalo stoji.
 */
export const JEZICI = [
  { kod: "sl", prefiks: null, naziv: "Slovenščina" },
  { kod: "en", prefiks: "en", naziv: "English" },
  { kod: "de", prefiks: "de", naziv: "Deutsch" },
  { kod: "bs", prefiks: "ba", naziv: "Bosanski", alias: ["hr", "sr"] },
  { kod: "tr", prefiks: "tr", naziv: "Türkçe" },
  { kod: "ar", prefiks: "ar", naziv: "العربية", smjer: "rtl" },
  { kod: "zh", prefiks: "zh", naziv: "中文" },
] as const

export type Lang = (typeof JEZICI)[number]["kod"]

export const DEFAULT_LANG: Lang = "sl"

/** Lanac popune: traženi → en → sl → prvi neprazan → "" */
export const FALLBACK: Lang[] = ["en", "sl"]

export function jezikPoPrefiksu(prefiks: string): Lang | null {
  const nadjen = JEZICI.find((j) => j.prefiks === prefiks)
  return nadjen ? nadjen.kod : null
}

export function jezikPoKodu(kod: string): (typeof JEZICI)[number] | null {
  return JEZICI.find((j) => j.kod === kod) ?? null
}

/** Prevodivo polje. Nijedan jezik nije obavezan — popunu rješava `t()`. */
export type Prevod = Partial<Record<Lang, string>>
export type PrevodLista = Partial<Record<Lang, string[]>>

// ─────────────────────────────────────────────────────────────
//  Radno vrijeme
// ─────────────────────────────────────────────────────────────

export type Dan = "pon" | "uto" | "sri" | "cet" | "pet" | "sub" | "ned"

/** Redoslijed odgovara `Date.getDay()`: 0 = nedjelja. */
export const DANI_PO_GETDAY: Dan[] = [
  "ned",
  "pon",
  "uto",
  "sri",
  "cet",
  "pet",
  "sub",
]

/**
 * `null` znači zatvoreno.
 * Ako je `do` manje od `od`, termin prelazi ponoć (09:00–05:00).
 */
export type Termin = { od: string; do: string } | null

/**
 * Izuzetak za konkretan datum — praznik, kolektivni godišnji, Ramazan.
 * Ima prednost nad redovnim vremenom tog dana.
 */
export type Izuzetak = {
  datum: string // YYYY-MM-DD
  termin: Termin
  napomena?: Prevod
}

export type RadnoVrijeme = {
  redovno: Record<Dan, Termin>
  izuzeci: Izuzetak[]
}

// ─────────────────────────────────────────────────────────────
//  Lokal
// ─────────────────────────────────────────────────────────────

export type StanjeLokala = "radi" | "uskoro" | "zatvoren"

export interface Lokal {
  id: string
  slug: string
  naziv: string
  /** Ulica ulazi u naslove stranica, da dva lokala nemaju isti `<title>`. */
  ulica: string
  adresa: string
  telefon: string
  email?: string
  lat?: number
  lng?: number
  radnoVrijeme: RadnoVrijeme
  woltUrl?: string
  glovoUrl?: string
  googlePlaceId?: string
  /** Obavezan i RAZLIČIT po lokalu — inače su naslovne gotovo identične. */
  uvodniTekst: Prevod
  /** Rezerva kad Places API ne odgovori (korak 21). */
  ocjena?: number
  brojRecenzija?: number
  recenzijeAzurirano?: string
  /** Tačno jedan lokal je glavni — on nema prefiks u adresi. */
  glavni: boolean
  stanje: StanjeLokala
  redoslijed: number
}

// ─────────────────────────────────────────────────────────────
//  Katalog: kategorije i jela
// ─────────────────────────────────────────────────────────────

export interface Kategorija {
  id: string
  slug: string
  naziv: Prevod
  opis?: Prevod
  redoslijed: number
  aktivna: boolean
}

/**
 * Jelo je biblioteka cijelog brenda — BEZ cijene.
 * Jedan opis, jedna slika, jedan prijevod, koliko god lokala ga prodaje.
 */
export interface Jelo {
  id: string
  slug: string
  kategorijaId: string
  naziv: Prevod
  opis: Prevod
  sastojci: PrevodLista
  alergeni: string[]
  slikaUrl?: string
  slikaAlt: Prevod
  halal: boolean
  vegetarijansko: boolean
  vegansko: boolean
  ljuto: 0 | 1 | 2 | 3
  kalorije?: number
  /** Meko deaktiviranje (korak 15) — uklanja jelo sa sajta, podaci ostaju. */
  aktivno: boolean
}

// ─────────────────────────────────────────────────────────────
//  Meni jednog lokala
// ─────────────────────────────────────────────────────────────

/** Jelo u meniju jednog lokala — ovdje živi cijena i dostupnost. */
export interface MenuStavka {
  jelo: Jelo
  /** Broj, ne string. Formatiranje radi `formatCijena()`. */
  cijena: number
  dostupno: boolean
  izdvojeno: boolean
  redoslijed: number
}

export interface MenuSekcija {
  kategorija: Kategorija
  stavke: MenuStavka[]
}

// ─────────────────────────────────────────────────────────────
//  Preusmjerenja
// ─────────────────────────────────────────────────────────────

/** Stari slug → novi slug. Puni ga /chef pri promjeni sluga (korak 14). */
export interface Preusmjerenje {
  stariSlug: string
  noviSlug: string
}
