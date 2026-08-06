import { formatCijena, t, tList } from "@/lib/i18n"
import type { Kategorija, Lang, MenuStavka } from "@/lib/domain"
import type { Category, MenuItem } from "@/src/data"

import { PopularPicksMreza } from "./sekcije/PopularPicksMreza"

/**
 * Sekcija 3 — Priljubljene izbire.
 *
 * SERVERSKA: nazivi, opisi i CIJENE su u izvornom HTML-u. Podaci dolaze
 * iz `repo.getIzdvojena()`, ne iz filtriranja `menuItems`.
 */

/** Slug kategorije → naziv koji ProductCard još očekuje (vlasnik: korak 8). */
const KATEGORIJA_LABELA: Record<string, Category> = {
  kebab: "Kebab",
  pice: "Pice",
  burgeri: "Burgeri",
  falafel: "Falafel",
  ostalo: "Ostalo",
  dodatki: "Dodatki",
  pijaca: "Pijača",
  meniji: "Meni",
}

/**
 * Privremeni prevodilac iz domenskog tipa u oblik koji ProductCard traži.
 * Korak 8 preuzima ProductCard i ovo nestaje.
 */
function uStaruKarticu(
  stavka: MenuStavka,
  kategorije: Kategorija[],
  lang: Lang,
): MenuItem {
  const kategorija = kategorije.find((k) => k.id === stavka.jelo.kategorijaId)

  return {
    id: stavka.jelo.slug,
    title: { sl: t(stavka.jelo.naziv, "sl"), en: t(stavka.jelo.naziv, "en") },
    desc: { sl: t(stavka.jelo.opis, "sl"), en: t(stavka.jelo.opis, "en") },
    price: formatCijena(stavka.cijena, lang),
    category: KATEGORIJA_LABELA[kategorija?.slug ?? ""] ?? "Ostalo",
    ingredients: {
      sl: tList(stavka.jelo.sastojci, "sl"),
      en: tList(stavka.jelo.sastojci, "en"),
    },
    allergens: stavka.jelo.alergeni,
    img: stavka.jelo.slikaUrl ?? "",
    popular: stavka.izdvojeno,
  }
}

export function PopularPicks({
  stavke,
  kategorije,
  lang,
}: {
  stavke: MenuStavka[]
  kategorije: Kategorija[]
  lang: Lang
}) {
  if (stavke.length === 0) return null

  const items = stavke.map((s) => uStaruKarticu(s, kategorije, lang))

  return (
    <section id="popular" className="py-20 w-full overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-black font-poppins mb-3 tracking-tight">
            {t({ sl: "Priljubljene izbire", en: "Popular picks" }, lang)}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t(
              {
                sl: "Najbolje ocenjene jedi naših gostov.",
                en: "Best rated dishes of our guests.",
              },
              lang,
            )}
          </p>
        </div>

        <PopularPicksMreza items={items} />
      </div>
    </section>
  )
}
