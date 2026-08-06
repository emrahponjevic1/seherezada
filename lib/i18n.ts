/**
 * Pomoćnici za jezik, cijene i radno vrijeme.
 *
 * Prelazak ponoći i izuzeci se rješavaju OVDJE, jednom. Sadašnji kod u
 * Hero.tsx i Footer.tsx to ne rješava, pa lokal koji petkom radi do 05:00
 * u subotu u 03:00 prikazuje „zatvoreno" — baš kad ima najviše gostiju.
 */

import {
  DANI_PO_GETDAY,
  FALLBACK,
  JEZICI,
  type Dan,
  type Lang,
  type Prevod,
  type PrevodLista,
  type RadnoVrijeme,
  type Termin,
} from "./domain"

// Relativna putanja + atribut tipa: tako se isti fajl može pokrenuti i
// izvan Nexta (seed skripta u koraku 11 radi u čistom Node-u).
import sl from "../messages/sl.json" with { type: "json" }
import en from "../messages/en.json" with { type: "json" }
import de from "../messages/de.json" with { type: "json" }
import bs from "../messages/bs.json" with { type: "json" }
import tr from "../messages/tr.json" with { type: "json" }
import ar from "../messages/ar.json" with { type: "json" }
import zh from "../messages/zh.json" with { type: "json" }

// ─────────────────────────────────────────────────────────────
//  Prijevodi sadržaja
// ─────────────────────────────────────────────────────────────

/** Traženi jezik → en → sl → prvi neprazan → "". Nikad ne baca grešku. */
export function t(polje: Prevod | undefined, lang: Lang): string {
  if (!polje) return ""

  const trazeni = polje[lang]
  if (trazeni) return trazeni

  for (const rezervni of FALLBACK) {
    const vrijednost = polje[rezervni]
    if (vrijednost) return vrijednost
  }

  for (const kljuc of Object.keys(polje) as Lang[]) {
    const vrijednost = polje[kljuc]
    if (vrijednost) return vrijednost
  }

  return ""
}

/** Isto kao `t()`, ali za liste (sastojci). */
export function tList(polje: PrevodLista | undefined, lang: Lang): string[] {
  if (!polje) return []

  const trazeni = polje[lang]
  if (trazeni && trazeni.length) return trazeni

  for (const rezervni of FALLBACK) {
    const vrijednost = polje[rezervni]
    if (vrijednost && vrijednost.length) return vrijednost
  }

  for (const kljuc of Object.keys(polje) as Lang[]) {
    const vrijednost = polje[kljuc]
    if (vrijednost && vrijednost.length) return vrijednost
  }

  return []
}

// ─────────────────────────────────────────────────────────────
//  Tekst sučelja
// ─────────────────────────────────────────────────────────────

type Poruke = Record<string, string>

/**
 * Svih sedam jezika (korak 22). Fali li ključ u nekom, `ui()` pada na
 * engleski pa na slovenski — nikad na praznu nisku.
 */
const PORUKE: Record<Lang, Poruke> = {
  sl: sl as Poruke,
  en: en as Poruke,
  de: de as Poruke,
  bs: bs as Poruke,
  tr: tr as Poruke,
  ar: ar as Poruke,
  zh: zh as Poruke,
}

/** Vraća ključ ako prijevoda nema — tako se propust vidi, a ne pravi praznina. */
export function ui(kljuc: string, lang: Lang): string {
  const naJeziku = PORUKE[lang]?.[kljuc]
  if (naJeziku) return naJeziku

  for (const rezervni of FALLBACK) {
    const vrijednost = PORUKE[rezervni]?.[kljuc]
    if (vrijednost) return vrijednost
  }

  return kljuc
}

/** `ui()` s popunjavanjem `{oznaka}` rupa: ui2("stanje.odprtoDo", lang, {ura: "23:00"}) */
export function ui2(
  kljuc: string,
  lang: Lang,
  rupe: Record<string, string | number>,
): string {
  return Object.entries(rupe).reduce(
    (tekst, [ime, vrijednost]) =>
      tekst.replaceAll(`{${ime}}`, String(vrijednost)),
    ui(kljuc, lang),
  )
}

// ─────────────────────────────────────────────────────────────
//  Svojstva jezika
// ─────────────────────────────────────────────────────────────

/**
 * Smjer pisma. Samo arapski je zdesna nalijevo — vraća se kao vrijednost
 * `dir` atributa, pa ga i `<html>` i pojedini blokovi mogu koristiti.
 */
export function smjer(lang: Lang): "rtl" | "ltr" {
  const jezik = JEZICI.find((j) => j.kod === lang) as
    | { smjer?: string }
    | undefined
  return jezik?.smjer === "rtl" ? "rtl" : "ltr"
}

/**
 * Prefiks u adresi, ili `null` za slovenski.
 *
 * PAŽNJA: prefiks ≠ kod jezika. Bosanski ima kod `bs` (to ide u `lang` i
 * `hreflang`, jer je to ISO oznaka) ali prefiks `ba` (to ide u adresu).
 * Miješanje to dvoje je najlakša greška u ovom fajlu.
 */
export function prefiks(lang: Lang): string | null {
  return JEZICI.find((j) => j.kod === lang)?.prefiks ?? null
}

// ─────────────────────────────────────────────────────────────
//  Cijene
// ─────────────────────────────────────────────────────────────

/** Jezici koji kao decimalni znak koriste tačku. */
const DECIMALNA_TACKA: Lang[] = ["en", "zh"]

/** 8.5 → "8,50 €" (sl) · "8.50 €" (en). Cijena je uvijek tekst, nikad slika. */
export function formatCijena(cijena: number, lang: Lang): string {
  const fiksno = cijena.toFixed(2)
  const broj = DECIMALNA_TACKA.includes(lang) ? fiksno : fiksno.replace(".", ",")
  return `${broj} €`
}

// ─────────────────────────────────────────────────────────────
//  Radno vrijeme
// ─────────────────────────────────────────────────────────────

/** "09:00" → 540 minuta od ponoći. */
function uMinute(hhmm: string): number {
  const [sati, minuti] = hhmm.split(":").map(Number)
  return sati * 60 + minuti
}

/** Lokalni datum u obliku YYYY-MM-DD (ne UTC — radno vrijeme je lokalno). */
function datumKljuc(kada: Date): string {
  const godina = kada.getFullYear()
  const mjesec = String(kada.getMonth() + 1).padStart(2, "0")
  const dan = String(kada.getDate()).padStart(2, "0")
  return `${godina}-${mjesec}-${dan}`
}

/** Izuzetak za taj datum ima prednost nad redovnim vremenom. */
function terminZaDatum(rv: RadnoVrijeme, kada: Date): Termin {
  const izuzetak = rv.izuzeci.find((i) => i.datum === datumKljuc(kada))
  if (izuzetak) return izuzetak.termin
  return rv.redovno[DANI_PO_GETDAY[kada.getDay()]]
}

/** Termin prelazi ponoć ako je `do` manje ili jednako `od` (09:00–05:00). */
function prelaziPonoc(termin: { od: string; do: string }): boolean {
  return uMinute(termin.do) <= uMinute(termin.od)
}

/**
 * Da li je lokal otvoren u datom trenutku.
 *
 * Barata sa dvije stvari koje se lako promaše:
 *  1. prelazak ponoći — subota 03:00 pripada petkovom terminu 09:00–05:00
 *  2. izuzetke po datumu — praznik zatvara lokal bez obzira na redovno vrijeme
 */
export function jeOtvoren(rv: RadnoVrijeme, kada: Date): boolean {
  const sada = kada.getHours() * 60 + kada.getMinutes()

  // 1) Današnji termin
  const danasnji = terminZaDatum(rv, kada)
  if (danasnji) {
    const od = uMinute(danasnji.od)
    const doo = uMinute(danasnji.do)

    if (prelaziPonoc(danasnji)) {
      // Otvoreno od 'od' do kraja dana; ostatak pokriva korak 2 ispod.
      if (sada >= od) return true
    } else if (sada >= od && sada < doo) {
      return true
    }
  }

  // 2) Jučerašnji termin koji je prešao ponoć i još traje
  const juce = new Date(kada)
  juce.setDate(juce.getDate() - 1)

  const jucerasnji = terminZaDatum(rv, juce)
  if (jucerasnji && prelaziPonoc(jucerasnji)) {
    if (sada < uMinute(jucerasnji.do)) return true
  }

  return false
}

/**
 * Termin dana kao tekst: "09:00 – 05:00" ili "Zaprto".
 * Uvijek za REDOVNO vrijeme — izuzetke prikazuje pozivalac posebno.
 */
export function formatRadnoVrijeme(
  rv: RadnoVrijeme,
  dan: Dan,
  lang: Lang,
): string {
  const termin = rv.redovno[dan]
  if (!termin) return ui("stanje.zaprto", lang)
  return `${termin.od} – ${termin.do}`
}

/** Do kada je otvoreno danas — za značku „Odprto do 05:00". */
export function zatvaraSeU(rv: RadnoVrijeme, kada: Date): string | null {
  const danasnji = terminZaDatum(rv, kada)
  if (danasnji && jeOtvoren(rv, kada)) return danasnji.do

  const juce = new Date(kada)
  juce.setDate(juce.getDate() - 1)
  const jucerasnji = terminZaDatum(rv, juce)
  if (jucerasnji && prelaziPonoc(jucerasnji) && jeOtvoren(rv, kada)) {
    return jucerasnji.do
  }

  return null
}
