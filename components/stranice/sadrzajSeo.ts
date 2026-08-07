import type { SeoPage } from "@/lib/route"
import type { PitanjeOdgovor } from "./dijelovi"

/**
 * Sadržaj osam SEO stranica.
 *
 * Ovdje stoje KLJUČEVI, a tekstovi u katalozima — inače bi gost na `/de`
 * dobio engleski tekst u njemačkom okviru. Naslov pokazuje na ključ u
 * `messages/` (isti koji koristi `lib/meta.ts` za `<title>`, da naslov
 * stranice i naslov kartice preglednika ne mogu razići), a sve ostalo na
 * `messages/sadrzaj/`.
 *
 * Blokovi 3, 4 i 7 imaju STVARNO svoj tekst na svakoj stranici — nisu
 * nastali zamjenom jedne riječi. Blok 5 (ponuda i cijene) se ne piše
 * ovdje nego se čita iz repozitorija, da se cijena nikad ne prepisuje
 * u tekst i ne zastari.
 */

export interface SadrzajSeo {
  /** Ključ u `messages/` — dijeli ga sa `<title>` iste rute. */
  naslov: string
  /** Ključevi u `messages/sadrzaj/`. */
  uvod: string
  blok3: { naslov: string; tekst: string }
  blok4: { naslov: string; tekst: string }
  /** Kategorija čija se ponuda prikazuje u bloku 5; `null` = cijeli meni. */
  kategorija: string | null
  /** Ako stranica upućuje na tačno određen lokal (npr. noćna hrana). */
  samoLokal?: string
  pitanja: PitanjeOdgovor[]
  srodne: SeoPage[]
}

export const SADRZAJ_SEO: Record<SeoPage, SadrzajSeo> = {
  // ───────────────────────────────────────────────────────────
  "kebab-ljubljana": {
    naslov: "seo.kebabLjubljana",
    uvod: "seoK.uvod",
    blok3: { naslov: "seoK.b3n", tekst: "seoK.b3t" },
    blok4: { naslov: "seoK.b4n", tekst: "seoK.b4t" },
    kategorija: "kebab",
    pitanja: [
      { pitanje: "seoK.q1p", odgovor: "seoK.q1o" },
      { pitanje: "seoK.q2p", odgovor: "seoK.q2o" },
      { pitanje: "seoK.q3p", odgovor: "seoK.q3o" },
    ],
    srodne: ["doner-ljubljana", "halal-hrana-ljubljana", "nocna-hrana-ljubljana"],
  },

  // ───────────────────────────────────────────────────────────
  //  Döner je zasebna pretraga od „kebab", iako oba jela stoje u istoj
  //  kategoriji. Ko traži „döner Ljubljana" traži baš pripremu s
  //  vertikalnog ražnja — zato stranica govori o razlici, a ne ponavlja
  //  tekst sa /kebab-ljubljana.
  "doner-ljubljana": {
    naslov: "seo.donerLjubljana",
    uvod: "seoDo.uvod",
    blok3: { naslov: "seoDo.b3n", tekst: "seoDo.b3t" },
    blok4: { naslov: "seoDo.b4n", tekst: "seoDo.b4t" },
    kategorija: "kebab",
    pitanja: [
      { pitanje: "seoDo.q1p", odgovor: "seoDo.q1o" },
      { pitanje: "seoDo.q2p", odgovor: "seoDo.q2o" },
      { pitanje: "seoDo.q3p", odgovor: "seoDo.q3o" },
    ],
    srodne: ["kebab-ljubljana", "halal-hrana-ljubljana", "nocna-hrana-ljubljana"],
  },

  // ───────────────────────────────────────────────────────────
  "pizza-ljubljana": {
    naslov: "seo.pizzaLjubljana",
    uvod: "seoP.uvod",
    blok3: { naslov: "seoP.b3n", tekst: "seoP.b3t" },
    blok4: { naslov: "seoP.b4n", tekst: "seoP.b4t" },
    kategorija: "pice",
    pitanja: [
      { pitanje: "seoP.q1p", odgovor: "seoP.q1o" },
      { pitanje: "seoP.q2p", odgovor: "seoP.q2o" },
      { pitanje: "seoP.q3p", odgovor: "seoP.q3o" },
    ],
    srodne: ["burger-ljubljana", "dostava-ljubljana", "halal-hrana-ljubljana"],
  },

  // ───────────────────────────────────────────────────────────
  "burger-ljubljana": {
    naslov: "seo.burgerLjubljana",
    uvod: "seoB.uvod",
    blok3: { naslov: "seoB.b3n", tekst: "seoB.b3t" },
    blok4: { naslov: "seoB.b4n", tekst: "seoB.b4t" },
    kategorija: "burgeri",
    pitanja: [
      { pitanje: "seoB.q1p", odgovor: "seoB.q1o" },
      { pitanje: "seoB.q2p", odgovor: "seoB.q2o" },
      { pitanje: "seoB.q3p", odgovor: "seoB.q3o" },
    ],
    srodne: ["pizza-ljubljana", "studentski-meni-ljubljana", "halal-hrana-ljubljana"],
  },

  // ───────────────────────────────────────────────────────────
  "falafel-ljubljana": {
    naslov: "seo.falafelLjubljana",
    uvod: "seoF.uvod",
    blok3: { naslov: "seoF.b3n", tekst: "seoF.b3t" },
    blok4: { naslov: "seoF.b4n", tekst: "seoF.b4t" },
    kategorija: "falafel",
    pitanja: [
      { pitanje: "seoF.q1p", odgovor: "seoF.q1o" },
      { pitanje: "seoF.q2p", odgovor: "seoF.q2o" },
      { pitanje: "seoF.q3p", odgovor: "seoF.q3o" },
    ],
    srodne: ["halal-hrana-ljubljana", "kebab-ljubljana", "studentski-meni-ljubljana"],
  },

  // ───────────────────────────────────────────────────────────
  "halal-hrana-ljubljana": {
    naslov: "seo.halalHranaLjubljana",
    uvod: "seoH.uvod",
    blok3: { naslov: "seoH.b3n", tekst: "seoH.b3t" },
    blok4: { naslov: "seoH.b4n", tekst: "seoH.b4t" },
    kategorija: null,
    pitanja: [
      { pitanje: "seoH.q1p", odgovor: "seoH.q1o" },
      { pitanje: "seoH.q2p", odgovor: "seoH.q2o" },
      { pitanje: "seoH.q3p", odgovor: "seoH.q3o" },
    ],
    srodne: ["kebab-ljubljana", "falafel-ljubljana", "burger-ljubljana"],
  },

  // ───────────────────────────────────────────────────────────
  "nocna-hrana-ljubljana": {
    naslov: "seo.nocnaHranaLjubljana",
    uvod: "seoN.uvod",
    blok3: { naslov: "seoN.b3n", tekst: "seoN.b3t" },
    blok4: { naslov: "seoN.b4n", tekst: "seoN.b4t" },
    kategorija: null,
    samoLokal: "trubarjeva",
    pitanja: [
      { pitanje: "seoN.q1p", odgovor: "seoN.q1o" },
      { pitanje: "seoN.q2p", odgovor: "seoN.q2o" },
      { pitanje: "seoN.q3p", odgovor: "seoN.q3o" },
    ],
    srodne: ["kebab-ljubljana", "dostava-ljubljana", "halal-hrana-ljubljana"],
  },

  // ───────────────────────────────────────────────────────────
  "dostava-ljubljana": {
    naslov: "seo.dostavaLjubljana",
    uvod: "seoD.uvod",
    blok3: { naslov: "seoD.b3n", tekst: "seoD.b3t" },
    blok4: { naslov: "seoD.b4n", tekst: "seoD.b4t" },
    kategorija: null,
    pitanja: [
      { pitanje: "seoD.q1p", odgovor: "seoD.q1o" },
      { pitanje: "seoD.q2p", odgovor: "seoD.q2o" },
      { pitanje: "seoD.q3p", odgovor: "seoD.q3o" },
    ],
    srodne: ["nocna-hrana-ljubljana", "pizza-ljubljana", "kebab-ljubljana"],
  },

  // ───────────────────────────────────────────────────────────
  "studentski-meni-ljubljana": {
    naslov: "seo.studentskiMeniLjubljana",
    uvod: "seoS.uvod",
    blok3: { naslov: "seoS.b3n", tekst: "seoS.b3t" },
    blok4: { naslov: "seoS.b4n", tekst: "seoS.b4t" },
    kategorija: "meniji",
    pitanja: [
      { pitanje: "seoS.q1p", odgovor: "seoS.q1o" },
      { pitanje: "seoS.q2p", odgovor: "seoS.q2o" },
      { pitanje: "seoS.q3p", odgovor: "seoS.q3o" },
    ],
    srodne: ["burger-ljubljana", "falafel-ljubljana", "kebab-ljubljana"],
  },
}
