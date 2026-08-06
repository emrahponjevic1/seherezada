import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { repo } from "@/lib/repo"
import { t } from "@/lib/i18n"
import type { Lang } from "@/lib/domain"
import { href } from "@/lib/route"

import { Hero } from "@/components/Hero"
import { PopularPicks } from "@/components/PopularPicks"
import { AboutUs } from "@/components/AboutUs"
import { Reviews } from "@/components/Reviews"

import { KarticeLokala } from "./KarticeLokala"
import { Halal } from "./Halal"
import { FaqIzvod } from "./FaqIzvod"
import { MeniIzvod } from "./MeniIzvod"

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
  const [lokali, glavni, kategorije, izdvojena] = await Promise.all([
    repo.getLokali(),
    repo.getGlavniLokal(),
    repo.getKategorije(),
    repo.getIzdvojena(lokalSlug),
  ])

  const lokal = lokali.find((l) => l.slug === lokalSlug) ?? glavni
  const glavniSlug = glavni.slug

  const meniAdresa = href(
    { kind: "lokal-page", lang, lokal: lokalSlug, page: "meni" },
    glavniSlug,
  )

  return (
    <>
      <Hero lokal={lokal} lang={lang} glavniSlug={glavniSlug} />

      <KarticeLokala
        lokali={lokali}
        trenutniSlug={lokalSlug}
        lang={lang}
        glavniSlug={glavniSlug}
      />

      <PopularPicks stavke={izdvojena} kategorije={kategorije} lang={lang} />

      <AboutUs lang={lang} glavniSlug={glavniSlug} />

      {/* Sekcija 5 — meni; puna stranica je /meni (korak 8) */}
      <MeniIzvod />

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 -mt-10 mb-4">
        <Link
          href={meniAdresa}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-shere-red text-white font-bold shadow-[0_0_40px_-10px_rgba(230,57,70,0.6)] hover:scale-105 active:scale-95 transition-transform"
        >
          {t({ sl: "Poglej cel meni", en: "See full menu" }, lang)}
          <ArrowRight size={18} />
        </Link>
      </div>

      <Halal lang={lang} glavniSlug={glavniSlug} />

      <Reviews lokal={lokal} lang={lang} glavniSlug={glavniSlug} />

      <FaqIzvod lokali={lokali} lang={lang} glavniSlug={glavniSlug} />
    </>
  )
}
