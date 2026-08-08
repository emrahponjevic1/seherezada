import Link from "next/link"
import { s } from "@/lib/sadrzaj"
import { ArrowRight, Ban, BadgeCheck, ShieldCheck } from "lucide-react"

import { ui } from "@/lib/i18n"
import type { Lang } from "@/lib/domain"
import { href } from "@/lib/route"
import { KONTEJNER, SEKCIJA } from "@/lib/stil"

/**
 * Sekcija Halal.
 *
 * Halal je najjača razlikovna crta u Ljubljani i sekcija to sada i
 * pokazuje: značka na slici, natpis iznad naslova i tri konkretne
 * tvrdnje umjesto samo dva pasusa. Gost koji traži halal donosi odluku
 * na osnovu tri pitanja — je li meso certificirano, ima li svinjetine,
 * ima li alkohola — i sva tri odgovora su sada vidljiva bez čitanja.
 *
 * Nijedna nova boja, font ni oblik: značka koristi stakleni obrazac iz
 * heroja (`bg-black/40 backdrop-blur-xl border-white/20`), a pločice
 * ikonu u crvenom kvadratu kakvu već imaju kartice lokala.
 *
 * Potpuno serverska, bez ijedne interakcije. Puna stranica je /halal.
 */

const TACKE = [
  { ikona: BadgeCheck, kljuc: "halal.tocka1" },
  { ikona: Ban, kljuc: "halal.tocka2" },
  { ikona: Ban, kljuc: "halal.tocka3" },
]

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

            <div className="absolute top-6 start-6 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20">
              <ShieldCheck size={20} className="text-shere-gold shrink-0" />
              <span className="text-sm font-black tracking-wide text-white">
                {ui("halal.znacka", lang)}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <span className="inline-block text-xs font-black tracking-[0.18em] uppercase text-shere-gold bg-shere-gold/10 px-4 py-2 rounded-xl">
              {ui("halal.znacka", lang)}
            </span>

            <h2 className="text-4xl md:text-5xl font-black font-poppins tracking-tight">
              {ui("halal.svePriNas", lang)}
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {s("halal.izvod.p1", lang)}
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {s("halal.izvod.p2", lang)}
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TACKE.map(({ ikona: Ikona, kljuc }) => (
                <li
                  key={kljuc}
                  className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm p-4"
                >
                  <span className="w-10 h-10 rounded-2xl bg-shere-red/10 text-shere-red flex items-center justify-center shrink-0">
                    <Ikona size={20} />
                  </span>
                  <span className="font-bold leading-tight">
                    {ui(kljuc, lang)}
                  </span>
                </li>
              ))}
            </ul>

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
