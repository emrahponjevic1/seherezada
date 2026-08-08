import type { Lang, Lokal, MenuStavka } from "@/lib/domain"

import { PopularPicksMreza } from "./sekcije/PopularPicksMreza"
import { KONTEJNER, SEKCIJA } from "@/lib/stil"

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
    <section id="popular" className={`${SEKCIJA} w-full overflow-hidden`}>
      <div className={KONTEJNER}>
        {/* Naslov je unutar trake: strelice moraju stajati u istom redu
            s njim, a njima treba pristup traci — dakle klijentsko stanje. */}
        <PopularPicksMreza stavke={stavke} lokal={lokal} lang={lang} />
      </div>
    </section>
  )
}
