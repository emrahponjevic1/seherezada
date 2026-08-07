/**
 * Slug stranice → ključ u katalogu poruka.
 *
 * Navbar, podnožje i mrvice imenuju iste stranice. Dok je svaki nosio svoj
 * spisak `{ sl, en }`, „Pogosta vprašanja" je na tri mjesta bilo napisano
 * na tri načina, a dodavanje jezika značilo je tri izmjene umjesto jedne.
 *
 * Ključevi su ovdje, tekstovi u `messages/*.json`.
 */

import type { LokalPage, SeoPage, SharedPage } from "./route"

export const KLJUC_LOKAL_STRANICE: Record<LokalPage, string> = {
  meni: "nav.meni",
  recenzije: "nav.recenzije",
}

export const KLJUC_ZAJEDNICKE: Record<SharedPage, string> = {
  "o-nas": "nav.oNas",
  halal: "nav.halal",
  galerija: "nav.galerija",
  blog: "nav.blog",
  kontakt: "nav.kontakt",
  "pogosta-vprasanja": "nav.faq",
  zasebnost: "stranica.zasebnost",
  pogoji: "stranica.pogoji",
}

export const KLJUC_SEO: Record<SeoPage, string> = {
  "kebab-ljubljana": "jelo.kebab",
  "doner-ljubljana": "jelo.doner",
  "pizza-ljubljana": "jelo.pizza",
  "burger-ljubljana": "jelo.burgeri",
  "falafel-ljubljana": "jelo.falafel",
  "halal-hrana-ljubljana": "seo.halalHrana",
  "nocna-hrana-ljubljana": "seo.nocnaHrana",
  "dostava-ljubljana": "seo.dostava",
  "studentski-meni-ljubljana": "seo.studentskiMeni",
}
