"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Check } from "lucide-react"

import type { Lang, Lokal } from "@/lib/domain"
import { formatRadnoVrijeme, jeOtvoren, ui } from "@/lib/i18n"
import { DANI_PO_GETDAY } from "@/lib/domain"
import { href, resolveRoute, type RouteKontekst } from "@/lib/route"

/**
 * Prekidač lokala.
 *
 * PREKIDAČ NAVIGIRA, NE MIJENJA STANJE. Adresa se gradi isključivo
 * funkcijom `href()` — nikad ručnim spajanjem segmenata, jer bi svaki
 * prekidač inače gradio adresu po svome i gubio kontekst.
 *
 * Gost ostaje na ISTOJ VRSTI stranice: sa `/meni` ide na
 * `/seherezada2/meni`, ne na naslovnu. Vraćanje na naslovnu pri promjeni
 * je najčešći razlog zbog kojeg ljudi napuste sajt.
 *
 * Na zajedničkim stranicama (`/halal`) lokala nema u adresi, pa prekidač
 * ne navigira nego samo zapamti izbor u kolačiću.
 */

export const KOLACIC_LOKALA = "shere-lokal"

export function zapamtiLokal(slug: string) {
  // Godinu dana. Kolačić NIKAD ne preusmjerava — samo pamti izbor.
  document.cookie = `${KOLACIC_LOKALA}=${slug}; path=/; max-age=${365 * 24 * 60 * 60}; samesite=lax`
}

export function procitajLokal(): string | null {
  const nadjen = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${KOLACIC_LOKALA}=`))
  return nadjen ? nadjen.split("=")[1] : null
}

export function PrekidacLokala({
  lokali,
  glavniSlug,
  trenutni,
  lang,
  pathname,
  varijanta = "desktop",
}: {
  lokali: Lokal[]
  glavniSlug: string
  trenutni: string
  lang: Lang
  pathname: string
  varijanta?: "desktop" | "mobitel"
}) {
  const router = useRouter()
  const [otvoren, setOtvoren] = useState(false)
  const [sada, setSada] = useState<Date | null>(null)

  useEffect(() => {
    setSada(new Date())
    const i = setInterval(() => setSada(new Date()), 60000)
    return () => clearInterval(i)
  }, [])

  const uPogonu = lokali.filter((l) => l.stanje !== "zatvoren")
  const izabrani = lokali.find((l) => l.slug === trenutni)

  const ctx: RouteKontekst = {
    lokalSlugi: lokali.filter((l) => l.stanje === "radi").map((l) => l.slug),
    glavniSlug,
  }

  const odaberi = (slug: string) => {
    zapamtiLokal(slug)
    setOtvoren(false)

    const ruta = resolveRoute(pathname.split("/").filter(Boolean), ctx)

    // Zajedničke i SEO stranice nemaju lokal u adresi — ostajemo gdje jesmo,
    // a kolačić je već zapamćen, pa se osvježe telefon i podnožje.
    if (ruta.kind !== "lokal-home" && ruta.kind !== "lokal-page") {
      router.refresh()
      return
    }

    const cilj =
      ruta.kind === "lokal-page"
        ? href({ ...ruta, lokal: slug }, glavniSlug)
        : href({ kind: "lokal-home", lang: ruta.lang, lokal: slug }, glavniSlug)

    router.push(cilj)
  }

  if (varijanta === "mobitel") {
    return (
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
          {ui("nav.lokal", lang)}
        </p>
        <div className="flex flex-wrap gap-2 justify-end">
          {uPogonu.map((l) => {
            const nedostupan = l.stanje !== "radi"
            return (
              <button
                key={l.id}
                onClick={() => !nedostupan && odaberi(l.slug)}
                disabled={nedostupan}
                className={`px-4 py-2.5 rounded-xl font-black text-sm tracking-wider active:scale-95 transition-transform ${
                  l.slug === trenutni
                    ? "bg-shere-red text-white shadow-lg shadow-shere-red/25"
                    : nedostupan
                      ? "bg-muted/40 text-muted-foreground/50 cursor-not-allowed"
                      : "bg-muted/60 text-foreground"
                }`}
              >
                {l.ulica.toUpperCase()}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOtvoren((s) => !s)}
        aria-expanded={otvoren}
        className="flex px-3 py-2.5 rounded-xl bg-muted/40 hover:bg-muted/80 border border-white/5 transition-all items-center gap-2 text-xs font-black tracking-wider text-foreground/80"
        title={ui("nav.lokal", lang)}
      >
        <MapPin size={16} />
        <span className="hidden xl:inline">
          {(izabrani?.ulica ?? "").toUpperCase()}
        </span>
      </button>

      {otvoren && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOtvoren(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-full mt-2 w-72 z-50 bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
            {uPogonu.map((l) => {
              const nedostupan = l.stanje !== "radi"
              const otvorenLokal = sada ? jeOtvoren(l.radnoVrijeme, sada) : null
              const danas = sada
                ? formatRadnoVrijeme(
                    l.radnoVrijeme,
                    DANI_PO_GETDAY[sada.getDay()],
                    lang,
                  )
                : ""

              return (
                <button
                  key={l.id}
                  onClick={() => !nedostupan && odaberi(l.slug)}
                  disabled={nedostupan}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-start gap-3 ${
                    nedostupan
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-muted/40"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{l.naziv}</span>
                      {l.slug === trenutni && (
                        <Check size={14} className="text-shere-red" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{l.ulica}</p>
                    {nedostupan ? (
                      <span className="text-xs font-bold text-shere-gold">
                        {ui("stanje.kmalu", lang)}
                      </span>
                    ) : (
                      otvorenLokal !== null && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              otvorenLokal ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          {danas}
                        </span>
                      )
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
