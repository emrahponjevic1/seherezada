/**
 * Naslov i opis po vrsti rute.
 *
 * Pravilo koje se lako promaši: NIJEDNE DVIJE RUTE NE SMIJU IMATI ISTI
 * NASLOV. Zato ulica ulazi u naslov lokala — inače bi /meni i
 * /seherezada2/meni bili „Meni in cene — Šeherezada" oba.
 *
 * Ovo nije samo SEO: naslov kartice preglednika i pregled pri dijeljenju
 * linka su dio toga kako sajt radi.
 */

import type { Lang, Lokal } from "./domain"
import { t, ui } from "./i18n"
import { s, s2 } from "./sadrzaj"
import type { Route, SeoPage, SharedPage } from "./route"

/** Puna adresa sajta. Korak 24 je formalizuje kroz lib/env.ts. */
export const BASE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://seherezada.net"
).replace(/\/$/, "")

/** Lokalna slika za dijeljenje — bez dimenzija se pregled često ne prikaže. */
export const OG_SLIKA = {
  url: "/rotisserie_hero.png",
  width: 1024,
  height: 1024,
  alt: "Šeherezada — halal kebab in fast food v Ljubljani",
}

/**
 * Open Graph traži pun lokalitet (`sl_SI`), ne goli kod jezika (`sl`).
 * Zemlja je izabrana po tržištu koje sajt gađa — gosti u Ljubljani —
 * osim za jezike gdje to nema smisla, pa se uzima matična zemlja.
 */
export const OG_LOKALI: Record<Lang, string> = {
  sl: "sl_SI",
  en: "en_GB",
  de: "de_DE",
  bs: "bs_BA",
  tr: "tr_TR",
  ar: "ar_AR",
  zh: "zh_CN",
}

export interface Meta {
  naslov: string
  opis: string
}

// ─────────────────────────────────────────────────────────────
//  Nazivi stranica
// ─────────────────────────────────────────────────────────────

/**
 * Naziv i opis stranice — KLJUČEVI, ne tekstovi.
 *
 * Naslovi kartice preglednika i Google opisi za svih sedam jezika; sami
 * tekstovi stoje u messages/ i messages/sadrzaj/.
 */
const ZAJEDNICKA: Record<SharedPage, { naziv: string; opis: string }> = {
  "o-nas": { naziv: "nav.oNas", opis: "meta.oNasOpis" },
  halal: { naziv: "nav.halal", opis: "meta.halalOpis" },
  galerija: { naziv: "nav.galerija", opis: "meta.galerijaOpis" },
  "pogosta-vprasanja": { naziv: "nav.faq", opis: "meta.faqOpis" },
  zasebnost: { naziv: "stranica.zasebnost", opis: "meta.zasebnostOpis" },
  pogoji: { naziv: "stranica.pogojiUporabe", opis: "meta.pogojiOpis" },
}

const SEO: Record<SeoPage, { naziv: string; opis: string }> = {
  "kebab-ljubljana": { naziv: "seo.kebabLjubljana", opis: "meta.kebabOpis" },
  "pizza-ljubljana": { naziv: "seo.pizzaLjubljana", opis: "meta.pizzaOpis" },
  "burger-ljubljana": { naziv: "seo.burgerLjubljana", opis: "meta.burgerOpis" },
  "falafel-ljubljana": { naziv: "seo.falafelLjubljana", opis: "meta.falafelOpis" },
  "halal-hrana-ljubljana": { naziv: "seo.halalHranaLjubljana", opis: "meta.halalHranaOpis" },
  "nocna-hrana-ljubljana": { naziv: "seo.nocnaHranaLjubljana", opis: "meta.nocnaOpis" },
  "dostava-ljubljana": { naziv: "seo.dostavaLjubljana", opis: "meta.dostavaOpis" },
  "studentski-meni-ljubljana": { naziv: "seo.studentskiMeniLjubljana", opis: "meta.studentskiOpis" },
}

// ─────────────────────────────────────────────────────────────

export function metaZaRutu(route: Route, lokal?: Lokal | null): Meta | null {
  if (route.kind === "redirect" || route.kind === "notfound") return null

  switch (route.kind) {
    case "lokal-home": {
      if (lokal?.glavni) {
        return {
          naslov: "Šeherezada — Halal kebab & fast food Ljubljana",
          opis: t(lokal.uvodniTekst, route.lang),
        }
      }
      return {
        naslov: s2("meta.naslovLokala", route.lang, {
          ulica: lokal?.ulica ?? "",
        }),
        opis: t(lokal?.uvodniTekst, route.lang),
      }
    }

    case "lokal-page": {
      const ulica = lokal?.ulica ?? ""
      if (route.page === "meni") {
        return {
          naslov: s2("meta.meniNaslov", route.lang, { ulica }),
          opis: s2("meta.meniOpis", route.lang, { ulica }),
        }
      }
      return {
        naslov: s2("meta.recenzijeNaslov", route.lang, { ulica }),
        opis: s2("meta.recenzijeOpis", route.lang, { ulica }),
      }
    }

    case "shared": {
      const stranica = ZAJEDNICKA[route.page]
      return {
        naslov: `${ui(stranica.naziv, route.lang)} — Šeherezada`,
        opis: s(stranica.opis, route.lang),
      }
    }

    case "seo": {
      const stranica = SEO[route.page]
      return {
        naslov: `${ui(stranica.naziv, route.lang)} — Šeherezada`,
        opis: s(stranica.opis, route.lang),
      }
    }
  }
}
