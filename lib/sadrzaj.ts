/**
 * Tekst stranica — odvojen od `messages/*.json` s razlogom.
 *
 * `lib/i18n.ts` uvozi `ui()` katalog, a njega uvozi i navbar, koji je
 * klijentski. Sve što uđe tamo završi u paketu koji se šalje pregledniku.
 * Kratki natpisi to podnose; priča lokala, halal objašnjenja i pravni
 * tekstovi na sedam jezika ne — to je nekoliko stotina kilobajta koje
 * gost preuzme, a nikad ne pročita na šest jezika.
 *
 * Zato dva kataloga:
 *   messages/<jezik>.json          — natpisi, smiju u preglednik
 *   messages/sadrzaj/<jezik>.json  — proza, ostaje na serveru
 *
 * Ovaj modul smiju uvoziti SAMO serverske komponente.
 */

import "server-only"

import { FALLBACK, type Lang } from "./domain"

import sl from "../messages/sadrzaj/sl.json" with { type: "json" }
import en from "../messages/sadrzaj/en.json" with { type: "json" }
import de from "../messages/sadrzaj/de.json" with { type: "json" }
import bs from "../messages/sadrzaj/bs.json" with { type: "json" }
import tr from "../messages/sadrzaj/tr.json" with { type: "json" }
import ar from "../messages/sadrzaj/ar.json" with { type: "json" }
import zh from "../messages/sadrzaj/zh.json" with { type: "json" }

type Tekstovi = Record<string, string>

const SADRZAJ: Record<Lang, Tekstovi> = {
  sl: sl as Tekstovi,
  en: en as Tekstovi,
  de: de as Tekstovi,
  bs: bs as Tekstovi,
  tr: tr as Tekstovi,
  ar: ar as Tekstovi,
  zh: zh as Tekstovi,
}

/**
 * Tekst stranice na traženom jeziku.
 *
 * Vraća ključ ako prijevoda nema — propust se tako VIDI na stranici.
 * Prazna niska bi ostavila rupu koju niko ne primijeti do produkcije.
 */
export function s(kljuc: string, lang: Lang): string {
  const naJeziku = SADRZAJ[lang]?.[kljuc]
  if (naJeziku) return naJeziku

  for (const rezervni of FALLBACK) {
    const vrijednost = SADRZAJ[rezervni]?.[kljuc]
    if (vrijednost) return vrijednost
  }

  return kljuc
}

/**
 * `s()` s popunjavanjem `{oznaka}` rupa.
 *
 * Naslovi i uvodi nose ulicu i adresu lokala. Umetanje kroz rupu, a ne
 * kroz sastavljanje niski, jer red riječi nije isti u svim jezicima —
 * u turskom i arapskom adresa ne stoji na mjestu na kojem stoji u
 * slovenskom, pa prevodilac mora moći pomjeriti rupu.
 */
export function s2(
  kljuc: string,
  lang: Lang,
  rupe: Record<string, string | number>,
): string {
  return Object.entries(rupe).reduce(
    (tekst, [ime, vrijednost]) =>
      tekst.replaceAll(`{${ime}}`, String(vrijednost)),
    s(kljuc, lang),
  )
}
