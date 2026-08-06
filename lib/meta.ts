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

import type { Lokal, Prevod } from "./domain"
import { t } from "./i18n"
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

export interface Meta {
  naslov: string
  opis: string
}

// ─────────────────────────────────────────────────────────────
//  Nazivi stranica
// ─────────────────────────────────────────────────────────────

const ZAJEDNICKA: Record<SharedPage, { naziv: Prevod; opis: Prevod }> = {
  "o-nas": {
    naziv: { sl: "O nas", en: "About us" },
    opis: {
      sl: "Kako se je začela Šeherezada, kaj nas loči od drugih in kdo stoji za pultom.",
      en: "How Šeherezada started, what sets us apart and who stands behind the counter.",
    },
  },
  halal: {
    naziv: { sl: "Halal", en: "Halal" },
    opis: {
      sl: "Kaj pri nas pomeni halal: od kod meso, kako ga pripravljamo in zakaj brez alkohola.",
      en: "What halal means here: where the meat comes from, how we prepare it and why no alcohol.",
    },
  },
  galerija: {
    naziv: { sl: "Galerija", en: "Gallery" },
    opis: {
      sl: "Fotografije jedi, lokalov in ekipe Šeherezade.",
      en: "Photos of the food, the locations and the Šeherezada team.",
    },
  },
  "pogosta-vprasanja": {
    naziv: { sl: "Pogosta vprašanja", en: "Frequently asked questions" },
    opis: {
      sl: "Odgovori na vprašanja o halalu, sestavinah, delovnem času in naročanju.",
      en: "Answers about halal, ingredients, opening hours and ordering.",
    },
  },
  zasebnost: {
    naziv: { sl: "Zasebnost", en: "Privacy" },
    opis: {
      sl: "Kako ravnamo z osebnimi podatki in piškotki.",
      en: "How we handle personal data and cookies.",
    },
  },
  pogoji: {
    naziv: { sl: "Pogoji uporabe", en: "Terms of use" },
    opis: {
      sl: "Pogoji naročanja in dostave.",
      en: "Terms of ordering and delivery.",
    },
  },
}

const SEO: Record<SeoPage, { naziv: Prevod; opis: Prevod }> = {
  "kebab-ljubljana": {
    naziv: { sl: "Kebab v Ljubljani", en: "Kebab in Ljubljana" },
    opis: {
      sl: "Halal döner kebab v Ljubljani — sveže meso, ročno rezano, odprto pozno v noč.",
      en: "Halal döner kebab in Ljubljana — fresh meat, hand-carved, open late.",
    },
  },
  "pizza-ljubljana": {
    naziv: { sl: "Pizza v Ljubljani", en: "Pizza in Ljubljana" },
    opis: {
      sl: "Pice iz testa, ki vzhaja 24 ur, pečene na kamniti plošči. Halal sestavine.",
      en: "Pizzas from 24-hour proofed dough, baked on stone. Halal ingredients.",
    },
  },
  "burger-ljubljana": {
    naziv: { sl: "Burger v Ljubljani", en: "Burger in Ljubljana" },
    opis: {
      sl: "Halal burgerji iz sveže mletega mesa in doma pečenih žemelj.",
      en: "Halal burgers from freshly ground meat and house-baked buns.",
    },
  },
  "falafel-ljubljana": {
    naziv: { sl: "Falafel v Ljubljani", en: "Falafel in Ljubljana" },
    opis: {
      sl: "Veganski falafel iz čičerike in svežih zelišč, s tahini prelivom.",
      en: "Vegan falafel from chickpeas and fresh herbs, with tahini sauce.",
    },
  },
  "halal-hrana-ljubljana": {
    naziv: { sl: "Halal hrana v Ljubljani", en: "Halal food in Ljubljana" },
    opis: {
      sl: "Vsa jedi so halal: brez svinjine in alkohola, z ločeno pripravo.",
      en: "Every dish is halal: no pork, no alcohol, prepared separately.",
    },
  },
  "nocna-hrana-ljubljana": {
    naziv: { sl: "Nočna hrana v Ljubljani", en: "Late-night food in Ljubljana" },
    opis: {
      sl: "Odprto do petih zjutraj ob koncu tedna na Trubarjevi.",
      en: "Open until five in the morning at weekends on Trubarjeva.",
    },
  },
  "dostava-ljubljana": {
    naziv: { sl: "Dostava v Ljubljani", en: "Delivery in Ljubljana" },
    opis: {
      sl: "Naročite prek Wolta ali Glova, ali pridite po jed s seboj.",
      en: "Order via Wolt or Glovo, or come and pick it up.",
    },
  },
  "studentski-meni-ljubljana": {
    naziv: { sl: "Študentski meni v Ljubljani", en: "Student menu in Ljubljana" },
    opis: {
      sl: "Bon za študentsko prehrano: glavna jed, juha, solata, jabolko in pijača.",
      en: "Student meal voucher: main course, soup, salad, apple and a drink.",
    },
  },
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
        naslov: t(
          {
            sl: `Šeherezada ${lokal?.ulica ?? ""} — Halal kebab & fast food`,
            en: `Šeherezada ${lokal?.ulica ?? ""} — Halal kebab & fast food`,
          },
          route.lang,
        ),
        opis: t(lokal?.uvodniTekst, route.lang),
      }
    }

    case "lokal-page": {
      const ulica = lokal?.ulica ?? ""
      if (route.page === "meni") {
        return {
          naslov: t(
            {
              sl: `Meni in cene — Šeherezada ${ulica}`,
              en: `Menu and prices — Šeherezada ${ulica}`,
            },
            route.lang,
          ),
          opis: t(
            {
              sl: `Celoten meni in cene za Šeherezado na ${ulica}. Kebab, pice, burgerji, falafel — vse halal.`,
              en: `Full menu and prices for Šeherezada on ${ulica}. Kebab, pizza, burgers, falafel — all halal.`,
            },
            route.lang,
          ),
        }
      }
      return {
        naslov: t(
          {
            sl: `Mnenja gostov — Šeherezada ${ulica}`,
            en: `Guest reviews — Šeherezada ${ulica}`,
          },
          route.lang,
        ),
        opis: t(
          {
            sl: `Kaj pravijo gostje o Šeherezadi na ${ulica}.`,
            en: `What guests say about Šeherezada on ${ulica}.`,
          },
          route.lang,
        ),
      }
    }

    case "shared": {
      const s = ZAJEDNICKA[route.page]
      return {
        naslov: `${t(s.naziv, route.lang)} — Šeherezada`,
        opis: t(s.opis, route.lang),
      }
    }

    case "seo": {
      const s = SEO[route.page]
      return {
        naslov: `${t(s.naziv, route.lang)} — Šeherezada`,
        opis: t(s.opis, route.lang),
      }
    }
  }
}
