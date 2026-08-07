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
 * Naslovna — osam sekcija, tim redom:
 *
 *   1 Hero                 2 Priljubljene izbire   3 Naša zgodba
 *   4 Naš meni             5 Halal                 6 Recenzije
 *   7 Pogosta vprašanja    8 Lokali + podnožje
 *
 * Kartice lokala su sišle sa druge pozicije na dno: gost bira lokal kad
 * se odlučio, a ne prije nego je vidio šta se nudi.
 *
 * Sekcije 2 i 4 su vodoravne trake. Traka SKROLA, ne uklanja — sve
 * kartice ostaju u dokumentu, one van ekrana su samo pomjerene. Vidi
 * `Traka.tsx`.
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

      <PopularPicks stavke={izdvojena} lokal={lokal} lang={lang} />

      <AboutUs lang={lang} glavniSlug={glavniSlug} />

      {/* Ista komponenta kao stranica menija, u varijanti 'izvod' */}
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

      {/* Lokali su na dnu, uz podnožje — gost ih traži kad se odlučio,
          ne prije nego je uopšte vidio šta nudimo. */}
      <KarticeLokala
        lokali={lokali}
        trenutniSlug={lokalSlug}
        lang={lang}
        glavniSlug={glavniSlug}
      />
    </>
  )
}
