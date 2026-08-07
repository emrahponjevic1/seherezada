"use client"

import { useState } from "react"
import Link from "next/link"
import { Languages, Check } from "lucide-react"

import { JEZICI, type Lang } from "@/lib/domain"
import { ui } from "@/lib/i18n"
import { sveAdrese, segmenti, type RouteKontekst } from "@/lib/route"

/**
 * Prekidač jezika.
 *
 * Tri pravila, sva tri naučena na greškama:
 *
 *  1. PREKIDAČ NAVIGIRA, NE MIJENJA STANJE. Stari `LanguageProvider` je
 *     držao jezik u `useState`, pa se adresa nije mijenjala — gost je
 *     prevodio pola stranice i nije mogao podijeliti link ni osvježiti
 *     stranicu a da ne izgubi jezik.
 *
 *  2. STAVKE SU `<Link>`, NE DUGMAD. Tako svih sedam adresa stoji u
 *     izvornom HTML-u: Google ih pronađe, a `hreflang` ima šta potvrditi.
 *     Sa dugmadima je na cijelom sajtu bilo NULA linkova na /en.
 *
 *  3. ADRESE GRADI `sveAdrese()`, nikad ručno lijepljenje prefiksa.
 *     Gost sa `/seherezada2/meni` mora završiti na `/en/seherezada2/meni`,
 *     ne na `/en`.
 *
 * Naziv jezika je UVIJEK na tom jeziku (Deutsch, العربية, 中文) — nikad
 * preveden, jer ga traži baš onaj ko trenutni jezik ne razumije.
 */
export function PrekidacJezika({
  lang,
  pathname,
  ctx,
  varijanta = "desktop",
  onOdabir,
}: {
  lang: Lang
  pathname: string
  ctx: RouteKontekst
  varijanta?: "desktop" | "mobitel"
  /** Zatvara mobilni meni: navigacija je klijentska, pa se sam ne zatvori. */
  onOdabir?: () => void
}) {
  const [otvoren, setOtvoren] = useState(false)

  const adrese = sveAdrese(segmenti(pathname), ctx)
  const trenutni = JEZICI.find((j) => j.kod === lang)

  // Oznaka na dugmetu: prefiks je ono što gost vidi u adresi, osim za
  // slovenski koji prefiks nema.
  const oznaka = (trenutni?.prefiks ?? trenutni?.kod ?? "sl").toUpperCase()

  if (varijanta === "mobitel") {
    return (
      <div className="mb-8">
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest mb-3">
          {ui("nav.jezik", lang)}
        </p>
        <div className="flex flex-wrap gap-2">
          {JEZICI.map((j) => (
            <Link
              key={j.kod}
              href={adrese[j.kod]}
              hrefLang={j.kod}
              lang={j.kod}
              aria-current={j.kod === lang ? "true" : undefined}
              onClick={onOdabir}
              className={`px-4 py-2.5 rounded-xl font-black text-sm tracking-wider active:scale-95 transition-transform ${
                j.kod === lang
                  ? "bg-shere-red text-white shadow-lg shadow-shere-red/25"
                  : "bg-muted/60 text-foreground"
              }`}
            >
              {j.naziv}
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOtvoren((s) => !s)}
        aria-expanded={otvoren}
        aria-haspopup="true"
        className="flex px-3 py-2.5 rounded-xl bg-muted/40 hover:bg-muted/80 border border-white/5 transition-all items-center gap-2 text-xs font-black tracking-wider text-foreground/80"
        title={ui("nav.jezik", lang)}
      >
        <Languages size={16} />
        <span>{oznaka}</span>
      </button>

      {/* Zastor hvata klik izvan menija — nije sadržaj, pa smije uslovno. */}
      {otvoren && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOtvoren(false)}
          aria-hidden
        />
      )}

      {/*
        Spisak je UVIJEK u dokumentu, skriva ga samo stil — isto pravilo po
        kojem se i podmeni menija drži u HTML-u. Dok se iscrtavao uslovno,
        na cijelom sajtu nije bilo NIJEDNOG linka na drugi jezik: prekidač
        je radio na klik, ali Google nije imao šta da pronađe, a `hreflang`
        je pokazivao na adrese do kojih se ne može doći klikom.
      */}
      <div
        className={`absolute end-0 top-full mt-2 w-56 z-50 bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-opacity duration-150 ${
          otvoren ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!otvoren}
      >
        {JEZICI.map((j) => (
          <Link
            key={j.kod}
            href={adrese[j.kod]}
            hrefLang={j.kod}
            lang={j.kod}
            dir={j.kod === "ar" ? "rtl" : undefined}
            aria-current={j.kod === lang ? "true" : undefined}
            tabIndex={otvoren ? undefined : -1}
            onClick={() => {
              setOtvoren(false)
              onOdabir?.()
            }}
            className="w-full text-start px-4 py-2.5 rounded-xl transition-colors flex items-center justify-between gap-3 hover:bg-muted/40"
          >
            <span className="font-bold">{j.naziv}</span>
            {j.kod === lang && (
              <Check size={14} className="text-shere-red flex-shrink-0" />
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
