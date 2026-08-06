import Link from "next/link"
import { s } from "@/lib/sadrzaj"
import { Star, ArrowRight, Utensils, Phone } from "lucide-react"

import { ui } from "@/lib/i18n"
import type { Lang, Lokal } from "@/lib/domain"
import { href } from "@/lib/route"

import { Pojava } from "./sekcije/Pojava"
import { HeroTanjir } from "./sekcije/HeroTanjir"
import { ZnackaOtvoreno } from "./sekcije/StanjeOtvorenosti"

/**
 * Sekcija 1 — hero.
 *
 * SERVERSKA: naslov, opis, ocjena, telefon i linkovi su u izvornom HTML-u.
 * Klijentski su samo animirani omotači, tanjir sa značkama i značka
 * „Odprto zdaj" — jedino ona zavisi od trenutka.
 *
 * Ovdje je JEDINI <h1> na stranici.
 */
export function Hero({
  lokal,
  lang,
  glavniSlug,
}: {
  lokal: Lokal
  lang: Lang
  glavniSlug: string
}) {
  const meniAdresa = href(
    { kind: "lokal-page", lang, lokal: lokal.slug, page: "meni" },
    glavniSlug,
  )

  const punihZvjezdica = Math.floor(lokal.ocjena ?? 0)

  return (
    <section
      id="home"
      className="relative min-h-[90vh] lg:min-h-screen flex flex-col justify-center overflow-hidden pt-28 pb-12 lg:pt-36 lg:pb-16"
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="hero-curve" clipPathUnits="objectBoundingBox">
            <path d="M0,0 L1,0 L1,0.92 Q0.5,1 0,0.92 Z" />
          </clipPath>
        </defs>
      </svg>

      <div
        className="absolute inset-0 bg-black z-0"
        style={{ clipPath: "url(#hero-curve)" }}
      >
        {/* Razlika mobitel/desktop je sada CSS upit, ne mjerenje u JS-u */}
        <img
          src="/rotisserie_hero_bg.webp"
          alt="Šeherezada Kebab Grill Background"
          width={1920}
          height={1080}
          className="w-full h-full object-cover opacity-20 lg:opacity-35 lg:mix-blend-luminosity lg:animate-pulse-subtle lg:blur-[3px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent"></div>
        <div className="absolute inset-0 bg-shere-charcoal/20 mix-blend-multiply hidden md:block"></div>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 md:space-y-8">
          <Pojava delay={0.2} y={-20}>
            <ZnackaOtvoreno
              radnoVrijeme={lokal.radnoVrijeme}
              lang={lang}
              className="inline-flex items-center gap-2.5 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl text-white text-sm font-semibold shadow-2xl"
            />
          </Pojava>

          <div className="space-y-4">
            <Pojava delay={0.3} y={30}>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight drop-shadow-2xl font-poppins">
                Šeherezada <br />
                <span className="text-shere-red font-outline-2 drop-shadow-[0_0_35px_rgba(230,57,70,0.4)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl block mt-2 font-black tracking-normal">
                  {s("hero.podnaslov", lang)}
                </span>
              </h1>
            </Pojava>

            <Pojava delay={0.4}>
              <p className="text-zinc-300 text-lg md:text-xl max-w-xl font-medium leading-relaxed">
                {s("hero.opis", lang)}
              </p>
            </Pojava>
          </div>

          {/* Ocjena iz podataka lokala — više nije ukucana */}
          {lokal.ocjena && (
            <Pojava delay={0.5} y={0}>
              <div className="flex items-center gap-3 text-white font-medium text-base md:text-lg bg-white/5 border border-white/5 backdrop-blur-sm px-5 py-3 rounded-2xl">
                <div className="flex text-shere-red">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      fill="currentColor"
                      size={20}
                      className={i < punihZvjezdica ? "" : "opacity-55"}
                    />
                  ))}
                </div>
                <span>
                  {lokal.ocjena.toLocaleString("sl-SI")}{" "}
                  <span className="text-zinc-400">
                    ({lokal.brojRecenzija?.toLocaleString("sl-SI")}+{" "}
                    {ui("hero.googleOcen", lang)})
                  </span>
                </span>
              </div>
            </Pojava>
          )}

          <Pojava
            delay={0.6}
            y={15}
            id="hero-actions"
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link
              href={meniAdresa}
              className="group relative px-8 py-4 bg-white text-black rounded-2xl font-black text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.8)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,1)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-2.5">
                <Utensils
                  size={20}
                  className="text-shere-red transition-transform group-hover:rotate-12"
                />
                {ui("akcija.prikaziMeni", lang)}
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform opacity-70"
                />
              </span>
            </Link>

            <a
              href={`tel:${lokal.telefon.replace(/\s/g, "")}`}
              className="group relative px-8 py-4 bg-black/40 backdrop-blur-xl border border-white/20 text-white rounded-2xl font-black text-lg shadow-2xl hover:border-shere-red hover:shadow-[0_0_40px_-10px_rgba(230,57,70,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-shere-red to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-2.5">
                <Phone
                  size={20}
                  className="text-shere-red group-hover:text-white animate-pulse group-hover:scale-110 transition-all duration-300"
                />
                {lokal.telefon}
              </span>
            </a>
          </Pojava>
        </div>

        <HeroTanjir lang={lang} />
      </div>
    </section>
  )
}
