"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { smjer, ui } from "@/lib/i18n"
import type { Lang } from "@/lib/domain"

/**
 * Vodoravna traka kartica sa strelicama u zaglavlju.
 *
 * PRAVILO KOJE SE OVDJE NE SMIJE PREKRŠITI: traka smije SKROLATI, ne
 * smije UKLANJATI. Sve kartice ostaju u dokumentu — one van ekrana su
 * pomjerene, ne izostavljene. Zato ovdje nema `slice()` ni uslovnog
 * iscrtavanja; kartica koja se ne prikazuje dobija `hidden`, što je
 * `display:none` i ostaje u izvornom HTML-u.
 *
 * ZAŠTO `pt-10 -mt-10`: tanjir na kartici viri 48 px IZNAD nje, a na
 * prelazak mišem se digne još 18 i uveća. Kartica sama rezerviše 64 px,
 * što je taman premalo. A `overflow-x: auto` po CSS-u povlači i
 * `overflow-y: auto` — vertikalno se ne može ostaviti „visible" —
 * pa se tanjir odsijecao na vrhu. Padding daje prostor, negativna
 * margina ga oduzima iz toka, tako da razmak između sekcija ostaje isti.
 */
export function Traka({
  lang,
  zaglavlje,
  izmedju,
  children,
}: {
  lang: Lang
  /** Naslov sekcije — stoji lijevo od strelica, u istom redu. */
  zaglavlje?: React.ReactNode
  /** Između naslova i trake, npr. tabovi kategorija. */
  izmedju?: React.ReactNode
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const pocetak = useRef({ x: 0, scrollLeft: 0 })
  const [naPocetku, setNaPocetku] = useState(true)
  const [naKraju, setNaKraju] = useState(false)

  // U RTL-u `scrollLeft` raste u suprotnom smjeru; predznak to izjednačava.
  const predznak = smjer(lang) === "rtl" ? -1 : 1

  const osvjeziStrelice = useCallback(() => {
    const el = ref.current
    if (!el) return
    const pomak = Math.abs(el.scrollLeft)
    const najvise = el.scrollWidth - el.clientWidth
    setNaPocetku(pomak < 8)
    setNaKraju(pomak >= najvise - 8)
  }, [])

  useEffect(() => {
    osvjeziStrelice()
    const el = ref.current
    if (!el) return
    // Broj kartica se mijenja kad gost odabere kategoriju — tada se
    // mijenja i to ima li se kuda skrolati.
    const posmatrac = new ResizeObserver(osvjeziStrelice)
    posmatrac.observe(el)
    return () => posmatrac.disconnect()
  }, [osvjeziStrelice, children])

  const pomjeri = (smjerKlika: 1 | -1) => {
    const el = ref.current
    if (!el) return
    el.scrollBy({
      left: predznak * smjerKlika * el.clientWidth * 0.8,
      behavior: "smooth",
    })
  }

  const naPritisak = (e: React.MouseEvent) => {
    if (!ref.current) return
    pocetak.current = { x: e.pageX, scrollLeft: ref.current.scrollLeft }
  }

  const naPomjeraj = (e: React.MouseEvent) => {
    if (e.buttons !== 1 || !ref.current) return
    ref.current.scrollLeft =
      pocetak.current.scrollLeft - (e.pageX - pocetak.current.x)
  }

  const dugme =
    "w-11 h-11 rounded-2xl flex items-center justify-center border transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed bg-white/5 border-white/10 text-foreground/80 hover:bg-shere-red hover:text-white hover:border-transparent disabled:hover:bg-white/5 disabled:hover:text-foreground/80"

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-6">
        <div className="min-w-0">{zaglavlje}</div>

        {/* Strelice su ukras uz prst i točkić — zato `aria-hidden` ne
            dolazi u obzir, ali ni fokus im nije potreban prije nego se
            ima kuda pomjeriti. */}
        <div className="hidden sm:flex items-center gap-2 shrink-0 pb-1">
          <button
            type="button"
            onClick={() => pomjeri(-1)}
            disabled={naPocetku}
            aria-label={ui("akcija.nazaj", lang)}
            className={dugme}
          >
            <ChevronLeft size={20} strokeWidth={2.5} className="rtl:rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => pomjeri(1)}
            disabled={naKraju}
            aria-label={ui("akcija.naprej", lang)}
            className={dugme}
          >
            <ChevronRight size={20} strokeWidth={2.5} className="rtl:rotate-180" />
          </button>
        </div>
      </div>

      {izmedju}

      <div
        ref={ref}
        onMouseDown={naPritisak}
        onMouseMove={naPomjeraj}
        onScroll={osvjeziStrelice}
        className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-6 md:gap-8 pt-10 -mt-10 pb-10 -mb-4 -mx-4 px-4 md:-mx-8 md:px-8 cursor-grab active:cursor-grabbing"
      >
        {children}
      </div>
    </div>
  )
}

/**
 * Jedna ćelija trake. Fiksna širina je nužna: unutar `flex` kontejnera
 * bi se kartice inače stisnule da stanu, i traka se ne bi imala kuda
 * skrolati.
 *
 * `skriveno` je `display:none` — kartica nestaje iz rasporeda, ali
 * ostaje u izvornom HTML-u.
 */
export function Celija({
  children,
  skriveno = false,
}: {
  children: React.ReactNode
  skriveno?: boolean
}) {
  return (
    <div
      className={`snap-start shrink-0 w-[72vw] sm:w-[45vw] lg:w-[22rem] ${
        skriveno ? "hidden" : ""
      }`}
    >
      {children}
    </div>
  )
}
