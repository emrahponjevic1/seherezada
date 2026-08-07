import Link from "next/link"
import { Star, ArrowRight } from "lucide-react"

import { ui } from "@/lib/i18n"
import type { Lang, Lokal } from "@/lib/domain"
import { href } from "@/lib/route"

import { ReviewsKarusel } from "./sekcije/ReviewsKarusel"
import { KONTEJNER, SEKCIJA } from "@/lib/stil"

/**
 * Sekcija 7 — recenzije.
 *
 * DODAJE SE <h2> — dosad ga sekcija uopšte nije imala, pa je hijerarhija
 * naslova preskakala nivo. Karusel ostaje klijentski i nepromijenjen.
 */
export function Reviews({
  lokal,
  lang,
  glavniSlug,
}: {
  lokal: Lokal
  lang: Lang
  glavniSlug: string
}) {
  const sveRecenzije = href(
    { kind: "lokal-page", lang, lokal: lokal.slug, page: "recenzije" },
    glavniSlug,
  )

  return (
    <section
      id="reviews"
      className={`${SEKCIJA} bg-shere-red text-white overflow-hidden relative`}
    >
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />

      <div className={`${KONTEJNER} text-center relative z-10`}>
        <h2 className="text-4xl md:text-5xl font-black font-poppins tracking-tight mb-8">
          {ui("recenzije.naslov", lang)}
        </h2>

        <div className="flex justify-center mb-8 gap-1 text-shere-gold">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} fill="currentColor" size={32} />
          ))}
        </div>

        <ReviewsKarusel />

        <div className="mt-10">
          <Link
            href={sveRecenzije}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm font-bold hover:scale-105 active:scale-95 transition-transform"
          >
            {ui("akcija.vseRecenzije", lang)}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
