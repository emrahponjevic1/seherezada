import Link from "next/link"
import { s } from "@/lib/sadrzaj"
import { ArrowRight } from "lucide-react"

import { ui } from "@/lib/i18n"
import type { Lang } from "@/lib/domain"
import { href } from "@/lib/route"
import { KONTEJNER, SEKCIJA } from "@/lib/stil"

/**
 * Sekcija 6 — Halal. NOVA.
 *
 * Raspored je isti kao „Naša zgodba": slika s jedne strane, tekst s druge.
 * Potpuno serverska, bez ijedne interakcije — pa nema ni klijentskog
 * omotača. Puna stranica je /halal (korak 9).
 */
export function Halal({
  lang,
  glavniSlug,
}: {
  lang: Lang
  glavniSlug: string
}) {
  const halalStranica = href({ kind: "shared", lang, page: "halal" }, glavniSlug)

  return (
    <section className={`w-full ${SEKCIJA} overflow-hidden`}>
      <div className={KONTEJNER}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative w-full h-[320px] sm:h-[420px] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 dark:border-white/10 group order-last lg:order-first">
            <img
              src="/rotisserie_hero.webp"
              alt={s("halal.slikaOpis", lang)}
              width={1024}
              height={1024}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-black font-poppins tracking-tight">
              {ui("halal.svePriNas", lang)}
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {s("halal.izvod.p1", lang)}
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {s("halal.izvod.p2", lang)}
            </p>

            <Link
              href={halalStranica}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-shere-red text-white font-bold shadow-[0_0_40px_-10px_rgba(230,57,70,0.6)] hover:scale-105 active:scale-95 transition-transform"
            >
              {ui("akcija.preberiVec", lang)}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
