"use client"

import Link from "next/link"
import { useEffect } from "react"

import { ui } from "@/lib/i18n"
import { DEFAULT_LANG } from "@/lib/domain"

/**
 * Neuhvaćena greška unutar okvira.
 *
 * Gostu se NIKAD ne prikazuje tehnički detalj — ni poruka ni stack.
 * U razvoju se ispisuje u konzolu, da programer ne ostane bez traga.
 */
export default function Greska({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const lang = DEFAULT_LANG

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error)
    }
  }, [error])

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl md:text-5xl font-black font-poppins tracking-tight">
        {ui("napaka.naslov", lang)}
      </h1>

      <p className="mt-4 text-lg text-muted-foreground font-inter max-w-xl">
        {ui("napaka.opis", lang)}
      </p>

      <div className="mt-10 flex flex-wrap gap-4 justify-center">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-2xl bg-shere-red text-white font-bold shadow-[0_0_40px_-10px_rgba(230,57,70,0.6)] hover:scale-105 active:scale-95 transition-transform"
        >
          {ui("akcija.poskusiZnova", lang)}
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm font-bold hover:scale-105 active:scale-95 transition-transform"
        >
          {ui("akcija.domov", lang)}
        </Link>
      </div>
    </section>
  )
}
