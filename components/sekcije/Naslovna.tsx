import { repo } from "@/lib/repo"
import type { Lang } from "@/lib/domain"

import { Hero } from "@/components/Hero"
import { PopularPicks } from "@/components/PopularPicks"
import { AboutUs } from "@/components/AboutUs"
import { Reviews } from "@/components/Reviews"

import { Menu } from "@/components/Menu"

import { KarticeLokala } from "./KarticeLokala"
import { Halal } from "./Halal"
import { FaqIzvod } from "./FaqIzvod"

/**
 * Naslovna — devet sekcija, tim redom:
 *
 *   1 Hero                 2 Kartice lokala        3 Priljubljene izbire
 *   4 Naša zgodba          5 Naš meni              6 Halal
 *   7 Recenzije            8 Pogosta vprašanja     9 Podnožje (korak 4)
 *
 * SERVERSKA u cjelini. Klijentski su samo animirani omotači i ono što
 * stvarno zavisi od trenutka ili od klika.
 */
export async function Naslovna({
  lokalSlug,
  lang,
}: {
  lokalSlug: string
  lang: Lang
}) {
  const [lokali, glavni, sekcije, izdvojena] = await Promise.all([
    repo.getLokali(),
    repo.getGlavniLokal(),
    repo.getMeni(lokalSlug),
    repo.getIzdvojena(lokalSlug),
  ])

  const lokal = lokali.find((l) => l.slug === lokalSlug) ?? glavni
  const glavniSlug = glavni.slug

  return (
    <>
      <Hero lokal={lokal} lang={lang} glavniSlug={glavniSlug} />

      <KarticeLokala
        lokali={lokali}
        trenutniSlug={lokalSlug}
        lang={lang}
        glavniSlug={glavniSlug}
      />

      <PopularPicks stavke={izdvojena} lokal={lokal} lang={lang} />

      <AboutUs lang={lang} glavniSlug={glavniSlug} />

      {/* Sekcija 5 — ista komponenta kao stranica menija, u varijanti 'izvod' */}
      <Menu
        sekcije={sekcije}
        lokal={lokal}
        lang={lang}
        glavniSlug={glavniSlug}
        varijanta="izvod"
      />

      <Halal lang={lang} glavniSlug={glavniSlug} />

      <Reviews lokal={lokal} lang={lang} glavniSlug={glavniSlug} />

      <FaqIzvod lokali={lokali} lang={lang} glavniSlug={glavniSlug} />
    </>
  )
}
