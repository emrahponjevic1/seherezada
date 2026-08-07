"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"

/**
 * Ugrađena mapa koja se učitava TEK NA KLIK.
 *
 * Google mapa sama po sebi vuče nekoliko stotina kilobajta i nekoliko
 * zahtjeva prema tuđem serveru. Na stranici kontakta bi to bio najteži
 * element, a većini gostiju uopšte ne treba — oni traže adresu i broj
 * telefona, oboje je već u tekstu iznad.
 *
 * Zato do klika stoji samo dugme. Adresa je u serverskom HTML-u bez
 * obzira na to hoće li mapa ikad biti učitana, pa Google i čitači ekrana
 * imaju sve što im treba.
 */
export function Zemljevid({
  naziv,
  adresa,
  lat,
  lng,
  natpis,
}: {
  naziv: string
  adresa: string
  lat?: number
  lng?: number
  natpis: string
}) {
  const [ucitaj, setUcitaj] = useState(false)

  const upit = lat && lng ? `${lat},${lng}` : adresa
  const izvor = `https://www.google.com/maps?q=${encodeURIComponent(upit)}&output=embed`

  if (!ucitaj) {
    return (
      <button
        type="button"
        onClick={() => setUcitaj(true)}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm font-bold hover:scale-105 active:scale-95 transition-transform"
      >
        <MapPin size={18} />
        {natpis}
      </button>
    )
  }

  return (
    <iframe
      src={izvor}
      title={`${natpis} — ${naziv}`}
      width={800}
      height={450}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="w-full aspect-[16/9] rounded-2xl border border-white/10"
    />
  )
}
