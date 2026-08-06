"use client"

import { createContext, useContext, useState } from "react"
import { Navigation } from "lucide-react"

import type { Lang } from "@/lib/domain"
import { ui } from "@/lib/i18n"

/**
 * „Poišči najbližjega" — tri pravila koja se lako prekrše.
 *
 *  1. LOKACIJA SE TRAŽI SAMO NA KLIK. Nikad pri otvaranju stranice —
 *     traka sa dozvolom odmah pri učitavanju tjera posjetioce.
 *  2. NEMA PREUSMJERAVANJA. Rezultat je isticanje najbližeg i udaljenost.
 *     Poredak kartica se NE mijenja. Gost i dalje bira sam.
 *  3. ODBIJANJE DOZVOLE NIJE GREŠKA. Dugme se vrati u početno stanje,
 *     bez poruke. Kartice ostaju upotrebljive.
 *
 * Lokacija se koristi i odbacuje — nigdje se ne pamti.
 */

interface Stanje {
  najblizi: string | null
  udaljenosti: Record<string, number>
}

const Kontekst = createContext<Stanje>({ najblizi: null, udaljenosti: {} })

export function useNajblizi() {
  return useContext(Kontekst)
}

/** Zračna linija u kilometrima. Dovoljno za „koji mi je bliži". */
function udaljenostKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

export function GeoNajblizi({
  tacke,
  lang,
  children,
}: {
  tacke: { slug: string; lat?: number; lng?: number }[]
  lang: Lang
  children: React.ReactNode
}) {
  const [stanje, setStanje] = useState<Stanje>({
    najblizi: null,
    udaljenosti: {},
  })
  const [trazi, setTrazi] = useState(false)

  const nadji = () => {
    if (!navigator.geolocation) return
    setTrazi(true)

    navigator.geolocation.getCurrentPosition(
      (pozicija) => {
        const { latitude, longitude } = pozicija.coords
        const udaljenosti: Record<string, number> = {}
        let najblizi: string | null = null
        let najmanja = Infinity

        for (const tacka of tacke) {
          if (tacka.lat === undefined || tacka.lng === undefined) continue
          const d = udaljenostKm(latitude, longitude, tacka.lat, tacka.lng)
          udaljenosti[tacka.slug] = d
          if (d < najmanja) {
            najmanja = d
            najblizi = tacka.slug
          }
        }

        setStanje({ najblizi, udaljenosti })
        setTrazi(false)
      },
      () => {
        // Odbijena dozvola nije greška — dugme se samo vrati u početno
        // stanje, bez poruke.
        setTrazi(false)
      },
      { timeout: 10000, maximumAge: 300000 },
    )
  }

  return (
    <Kontekst.Provider value={stanje}>
      {children}

      <div className="mt-6 flex justify-center">
        <button
          onClick={nadji}
          disabled={trazi}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 text-foreground font-bold hover:border-shere-red hover:scale-105 active:scale-95 transition-all disabled:opacity-60"
        >
          <Navigation size={18} className="text-shere-red" />
          {trazi
            ? ui("stanje.iscem", lang)
            : ui("akcija.poisciNajblizjega", lang)}
        </button>
      </div>
    </Kontekst.Provider>
  )
}

/** Udaljenost i oznaka „najbližji" — pojavljuju se tek poslije dozvole. */
export function OznakaUdaljenosti({
  slug,
  lang,
}: {
  slug: string
  lang: Lang
}) {
  const { najblizi, udaljenosti } = useNajblizi()
  const d = udaljenosti[slug]
  if (d === undefined) return null

  return (
    <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold">
      <span className="text-shere-red">
        ~{d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`}
      </span>
      {najblizi === slug && (
        <span className="px-2 py-0.5 rounded-lg bg-shere-red/10 text-shere-red">
          {ui("oznaka.najblizji", lang)}
        </span>
      )}
    </span>
  )
}
