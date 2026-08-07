"use client"

import { useRef, useState } from "react"

import type { Lang, Lokal, MenuSekcija, MenuStavka } from "@/lib/domain"
import { t, ui } from "@/lib/i18n"
import { ProductCard } from "@/components/ProductCard"
import { ProductModal } from "@/components/ProductModal"

import { Celija, Traka } from "./Traka"

/**
 * Tabovi i kartice menija.
 *
 * NAJVAŽNIJE U KORAKU: sve kategorije se renderuju UVIJEK. Tabovi mijenjaju
 * samo vidljivost, klasom `hidden`, nikad uslovnim renderovanjem.
 *
 * Dosad je u DOM-u bila samo otvorena kategorija — ostalih sedam nije
 * postojalo. Za posjetioca nevidljivo; za Google, čitače ekrana i Ctrl+F
 * ostatak menija nije postojao.
 *
 * Podrazumijevani tab je „Vse", ne „Kebab" — inače posjetilac bez
 * JavaScripta vidi samo jednu kategoriju.
 */

const EMOJI: Record<string, string> = {
  kebab: "🌯",
  pice: "🍕",
  burgeri: "🍔",
  falafel: "🧆",
  meniji: "🍱",
  ostalo: "🍲",
  dodatki: "🍟",
  pijaca: "🥤",
}

const SVE = "vse"

export function MeniInteraktivni({
  sekcije,
  lokal,
  lang,
  varijanta = "puna",
}: {
  sekcije: MenuSekcija[]
  lokal: Lokal
  lang: Lang
  /**
   * `izvod` je sekcija naslovne — jela se prelistavaju vodoravno.
   * `puna` je stranica `/meni`, gdje se meni pregleda, a ne prelistava,
   * pa ostaje mreža.
   */
  varijanta?: "puna" | "izvod"
}) {
  const [aktivna, setAktivna] = useState<string>(SVE)
  const [odabrano, setOdabrano] = useState<MenuStavka | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  // Povlačenje trake tabova mišem — zadržano kako je i bilo.
  const povlaci = useRef(false)
  const pocetak = useRef({ x: 0, scrollLeft: 0 })

  const naPritisak = (e: React.MouseEvent) => {
    if (!navRef.current) return
    povlaci.current = false
    pocetak.current = { x: e.pageX, scrollLeft: navRef.current.scrollLeft }
  }

  const naPomjeraj = (e: React.MouseEvent) => {
    if (e.buttons !== 1 || !navRef.current) return
    const pomak = e.pageX - pocetak.current.x
    if (Math.abs(pomak) > 5) povlaci.current = true
    navRef.current.scrollLeft = pocetak.current.scrollLeft - pomak
  }

  const naKlikTaba = (
    slug: string,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (povlaci.current) {
      e.preventDefault()
      return
    }
    setAktivna(slug)

    /*
     * `scrollIntoView` umjesto ručnog računa preko `offsetLeft` (korak 23).
     *
     * `offsetLeft` je uvijek pozitivan, a `scrollLeft` je u RTL negativan
     * (0 je na desnom kraju). Stari račun je u arapskom davao pozitivan
     * broj koji se sabijao na nulu, pa se traka vraćala na početak umjesto
     * da centrira tab. `inline: "center"` to radi sam i zna za smjer.
     *
     * `block: "nearest"` čuva od pomjeranja cijele stranice po visini.
     */
    e.currentTarget.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    })
  }

  const ukupno = sekcije.reduce((z, s) => z + s.stavke.length, 0)
  const vidljivo =
    aktivna === SVE
      ? ukupno
      : (sekcije.find((s) => s.kategorija.slug === aktivna)?.stavke.length ?? 0)

  const tabovi = [
    { slug: SVE, naziv: ui("meni.vse", lang), emoji: "🍽️" },
    ...sekcije.map((s) => ({
      slug: s.kategorija.slug,
      naziv: t(s.kategorija.naziv, lang),
      emoji: EMOJI[s.kategorija.slug] ?? "🍽️",
    })),
  ]

  // Prve četiri kartice na stranici se učitavaju odmah, ostale tek kad zatrebaju.
  let redniBroj = 0

  return (
    <>
      <div className="w-full">
        <div className="flex justify-end mb-2">
          <div className="text-sm font-black text-shere-red bg-shere-red/10 px-5 py-2.5 rounded-2xl border border-shere-red/20 w-fit flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-shere-red animate-pulse"></span>
            {vidljivo} {ui("meni.jedi", lang)}
          </div>
        </div>

        <div className="relative">
          <div
            ref={navRef}
            className="flex overflow-x-auto hide-scrollbar gap-3 md:gap-4 py-8 px-4 -mx-4 items-center cursor-grab active:cursor-grabbing select-none"
            onMouseDown={naPritisak}
            onMouseMove={naPomjeraj}
            onMouseLeave={() => {
              povlaci.current = false
            }}
          >
            {tabovi.map((tab) => (
              <button
                key={tab.slug}
                onClick={(e) => naKlikTaba(tab.slug, e)}
                aria-pressed={aktivna === tab.slug}
                className={`relative whitespace-nowrap px-6 md:px-8 py-3.5 md:py-4 rounded-2xl text-base md:text-lg font-black transition-all duration-300 flex items-center gap-3 flex-shrink-0 group border select-none
                  ${
                    aktivna === tab.slug
                      ? "text-white shadow-[0_8px_20px_-4px_rgba(230,57,70,0.45)] border-transparent scale-105"
                      : "bg-white/5 hover:bg-white/10 border-white/10 text-foreground/80 hover:text-white hover:scale-[1.02]"
                  }`}
              >
                {aktivna === tab.slug && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-shere-red to-orange-500 z-0"></div>
                )}
                <span className="relative z-10 text-2xl group-hover:scale-110 transition-transform duration-300">
                  {tab.emoji}
                </span>
                <span className="relative z-10 tracking-wide">{tab.naziv}</span>
                {aktivna === tab.slug && (
                  <span className="relative z-10 w-1.5 h-1.5 rounded-full bg-white ms-1 shadow-[0_0_8px_rgba(255,255,255,0.9)]"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-12">
        {sekcije.map((sekcija) => {
          const skriveno = aktivna !== SVE && aktivna !== sekcija.kategorija.slug

          return (
            <section
              key={sekcija.kategorija.id}
              data-kat={sekcija.kategorija.slug}
              // `hidden` je display:none — sadržaj OSTAJE u dokumentu.
              className={skriveno ? "hidden" : ""}
            >
              <h2 className="text-3xl md:text-4xl font-black font-poppins tracking-tight mb-2">
                {t(sekcija.kategorija.naziv, lang)}
              </h2>
              {sekcija.kategorija.opis && (
                <p className="text-muted-foreground mb-6">
                  {t(sekcija.kategorija.opis, lang)}
                </p>
              )}

              {varijanta === "izvod" ? (
                <Traka>
                  {sekcija.stavke.map((stavka) => {
                    const odmah = redniBroj < 4
                    redniBroj++
                    return (
                      <Celija key={stavka.jelo.id}>
                        <ProductCard
                          stavka={stavka}
                          lang={lang}
                          onClick={setOdabrano}
                          context="menu"
                          odmah={odmah}
                        />
                      </Celija>
                    )
                  })}
                </Traka>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {sekcija.stavke.map((stavka) => {
                    const odmah = redniBroj < 4
                    redniBroj++
                    return (
                      <ProductCard
                        key={stavka.jelo.id}
                        stavka={stavka}
                        lang={lang}
                        onClick={setOdabrano}
                        context="menu"
                        odmah={odmah}
                      />
                    )
                  })}
                </div>
              )}
            </section>
          )
        })}
      </div>

      <ProductModal
        stavka={odabrano}
        lokal={lokal}
        lang={lang}
        onClose={() => setOdabrano(null)}
      />
    </>
  )
}
