"use client"

import { useEffect, useState } from "react"

import { formatRadnoVrijeme, jeOtvoren, ui } from "@/lib/i18n"
import { DANI_PO_GETDAY, type Lang, type RadnoVrijeme } from "@/lib/domain"

/**
 * „Odprto zdaj" MORA biti klijentsko.
 *
 * Da se računa na serveru, statični HTML bi zamrznuo status od trenutka
 * gradnje i u 03:00 pisao ono što je važilo prekjuče. Radno vrijeme kao
 * TEKST ostaje serverski — ovdje je samo status koji zavisi od trenutka.
 */
function useOtvoren(radnoVrijeme: RadnoVrijeme) {
  const [otvoren, setOtvoren] = useState<boolean | null>(null)

  useEffect(() => {
    const provjeri = () => setOtvoren(jeOtvoren(radnoVrijeme, new Date()))
    provjeri()
    const interval = setInterval(provjeri, 60000)
    return () => clearInterval(interval)
  }, [radnoVrijeme])

  return otvoren
}

/** Značka u heroju. */
export function ZnackaOtvoreno({
  radnoVrijeme,
  lang,
  className = "",
}: {
  radnoVrijeme: RadnoVrijeme
  lang: Lang
  className?: string
}) {
  const otvoren = useOtvoren(radnoVrijeme)

  return (
    <div className={className}>
      <span className="relative flex h-3 w-3">
        {otvoren ? (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </>
        ) : (
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        )}
      </span>
      {otvoren === null
        ? " "
        : ui(otvoren ? "stanje.odprtoZdaj" : "stanje.zaprto", lang)}
    </div>
  )
}

/**
 * Današnje radno vrijeme + tačka.
 *
 * Klijentsko iz istog razloga: koji je danas dan zavisi od trenutka, a
 * statični HTML bi zamrznuo dan gradnje. Puno radno vrijeme svih lokala
 * stoji u serverskom HTML-u podnožja.
 */
export function DanasnjeVrijeme({
  radnoVrijeme,
  lang,
}: {
  radnoVrijeme: RadnoVrijeme
  lang: Lang
}) {
  const otvoren = useOtvoren(radnoVrijeme)
  const [danas, setDanas] = useState<string | null>(null)

  useEffect(() => {
    const postavi = () => {
      const sada = new Date()
      const dan = DANI_PO_GETDAY[sada.getDay()]
      setDanas(formatRadnoVrijeme(radnoVrijeme, dan, lang))
    }
    postavi()
    const interval = setInterval(postavi, 60000)
    return () => clearInterval(interval)
  }, [radnoVrijeme, lang])

  if (danas === null) return <span className="text-sm text-muted-foreground">&nbsp;</span>

  return (
    <span className="text-sm text-muted-foreground flex items-center gap-2">
      <TackaOtvoreno radnoVrijeme={radnoVrijeme} lang={lang} />
      {otvoren
        ? `${ui("stanje.odprtoZdaj", lang)} · ${danas}`
        : `${ui("stanje.zaprto", lang)} · ${danas}`}
    </span>
  )
}

/** Sama tačka — za kartice lokala. */
export function TackaOtvoreno({
  radnoVrijeme,
  lang,
}: {
  radnoVrijeme: RadnoVrijeme
  lang: Lang
}) {
  const otvoren = useOtvoren(radnoVrijeme)
  if (otvoren === null) return <span className="inline-flex h-2.5 w-2.5" />

  return (
    <span
      className="relative flex h-2.5 w-2.5"
      title={ui(otvoren ? "stanje.odprtoZdaj" : "stanje.zaprto", lang)}
    >
      {otvoren ? (
        <>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
        </>
      ) : (
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
      )}
    </span>
  )
}
