import Link from "next/link"
import { Flame, Clock, ChefHat, ArrowRight } from "lucide-react"

import { t } from "@/lib/i18n"
import type { Lang } from "@/lib/domain"
import { href } from "@/lib/route"

import { AboutUsAnimacija } from "./sekcije/AboutUsAnimacija"

/**
 * Sekcija 4 — Naša zgodba.
 *
 * SERVERSKA: sav tekst je u izvornom HTML-u. GSAP i parallax su u
 * klijentskom omotaču koji prima ovu djecu.
 *
 * Tekst je skraćen na tri rečenice i dobija dugme „Preberi več" — puna
 * priča ide na /o-nas (korak 9). Dosad je bio na bosanskom; sada je
 * slovenski, kao i ostatak sajta.
 *
 * Ukrasni natpis „TRADICIJA & KVALITETA" više NIJE <h1> nego <div> sa
 * istim klasama — naslov pripada sadržaju, ne ukrasu.
 */
export function AboutUs({
  lang,
  glavniSlug,
}: {
  lang: Lang
  glavniSlug: string
}) {
  const oNama = href({ kind: "shared", lang, page: "o-nas" }, glavniSlug)

  return (
    <AboutUsAnimacija
      id="about"
      className="relative w-full py-24 md:py-32 overflow-hidden bg-background border-y border-shere-red/25 mt-12 md:mt-24"
    >
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[200vw] z-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none overflow-hidden flex items-center">
        <div className="bg-text text-[20vw] font-black whitespace-nowrap text-foreground uppercase leading-none font-poppins">
          TRADICIJA &amp; KVALITETA
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[700px] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 dark:border-white/10 group">
            <div className="parallax-img absolute w-full h-[130%] -top-[15%] left-0">
              <img
                src="/rotisserie_hero.png"
                alt={t(
                  {
                    sl: "Meso na vertikalnem žaru v Šeherezadi",
                    en: "Meat on the vertical grill at Šeherezada",
                  },
                  lang,
                )}
                width={1024}
                height={1024}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>

            <div className="absolute bottom-8 left-8 bg-black/60 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-3xl reveal-item">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-shere-red/20 flex items-center justify-center text-shere-red">
                  <ChefHat size={24} />
                </div>
                <div>
                  <p className="text-white font-black text-xl">
                    {t({ sl: "Od 1998", en: "Since 1998" }, lang)}
                  </p>
                  <p className="text-zinc-400 text-sm">
                    {t({ sl: "Mojstri kebaba", en: "Kebab masters" }, lang)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-content space-y-8">
            <div className="space-y-4 reveal-item">
              <h2 className="text-shere-red font-black tracking-widest uppercase text-sm lg:text-base">
                {t({ sl: "Naša zgodba", en: "Our story" }, lang)}
              </h2>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black font-poppins text-foreground leading-[1.1]">
                {t({ sl: "Okus prave ", en: "The taste of real " }, lang)}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-shere-red to-orange-500">
                  {t({ sl: "tradicije.", en: "tradition." }, lang)}
                </span>
              </h3>
            </div>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed reveal-item font-medium">
              {t(
                {
                  sl: "Vsak grižljaj v Šeherezadi prinese duh Istanbula v središče Ljubljane. Uporabljamo samo sveže halal meso, pečeno na pravem ognju, in kruh, ki ga pečemo vsak dan. Od leta 1998 delamo po istem receptu.",
                  en: "Every bite at Šeherezada brings the spirit of Istanbul to the heart of Ljubljana. We use only fresh halal meat, grilled over an open fire, and bread we bake every day. The same recipe since 1998.",
                },
                lang,
              )}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 reveal-item">
              <div className="bg-card/40 border border-white/5 dark:border-white/10 p-6 rounded-3xl backdrop-blur-sm group hover:border-shere-red/30 transition-colors">
                <Flame
                  className="text-shere-red mb-4 group-hover:scale-110 transition-transform"
                  size={32}
                />
                <h4 className="font-bold text-xl mb-2">
                  {t({ sl: "Domač kruh", en: "Homemade bread" }, lang)}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {t(
                    {
                      sl: "Sveže pečen vsak dan po našem družinskem receptu.",
                      en: "Freshly baked every day using our family recipe.",
                    },
                    lang,
                  )}
                </p>
              </div>
              <div className="bg-card/40 border border-white/5 dark:border-white/10 p-6 rounded-3xl backdrop-blur-sm group hover:border-shere-red/30 transition-colors">
                <Clock
                  className="text-shere-red mb-4 group-hover:scale-110 transition-transform"
                  size={32}
                />
                <h4 className="font-bold text-xl mb-2">
                  {t({ sl: "Odprto pozno", en: "Open late" }, lang)}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {t(
                    {
                      sl: "Ob koncu tedna smo tu vse do petih zjutraj.",
                      en: "At weekends we are here until five in the morning.",
                    },
                    lang,
                  )}
                </p>
              </div>
            </div>

            <div className="reveal-item">
              <Link
                href={oNama}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-shere-red text-white font-bold shadow-[0_0_40px_-10px_rgba(230,57,70,0.6)] hover:scale-105 active:scale-95 transition-transform"
              >
                {t({ sl: "Preberi več", en: "Read more" }, lang)}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AboutUsAnimacija>
  )
}
