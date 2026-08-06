import { ui } from "@/lib/i18n"
import type { Lang, Lokal, MenuStavka } from "@/lib/domain"

import { PopularPicksMreza } from "./sekcije/PopularPicksMreza"

/**
 * Sekcija 3 — Priljubljene izbire.
 *
 * SERVERSKA: nazivi, opisi i cijene su u izvornom HTML-u. Podaci dolaze
 * iz `repo.getIzdvojena()`, ne iz filtriranja `menuItems`.
 */
export function PopularPicks({
  stavke,
  lokal,
  lang,
}: {
  stavke: MenuStavka[]
  lokal: Lokal
  lang: Lang
}) {
  if (stavke.length === 0) return null

  return (
    <section id="popular" className="py-20 w-full overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-black font-poppins mb-3 tracking-tight">
            {ui("recenzije.priljubljeneIzbire", lang)}
          </h2>
          <p className="text-muted-foreground text-lg">
            {ui("recenzije.najboljeOcenjene", lang)}
          </p>
        </div>

        <PopularPicksMreza stavke={stavke} lokal={lokal} lang={lang} />
      </div>
    </section>
  )
}
