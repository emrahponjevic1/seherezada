"use client"

import { useState, useTransition } from "react"

import type { Ishod } from "@/lib/chef/meni"

/**
 * Cijena koja se uređuje u samom redu.
 *
 * Snima se pri izlasku iz polja. Ako snimanje ne uspije, polje se VRAĆA
 * na staru vrijednost — inače bi u njemu ostao broj koji u bazi ne
 * postoji, a vlasnik bi mislio da je snimljen.
 */
export function PoljeCijene({
  pocetna,
  snimi,
  sirina = "w-24",
}: {
  pocetna: number | null
  snimi: (unos: string) => Promise<Ishod>
  sirina?: string
}) {
  const [vrijednost, setVrijednost] = useState(
    pocetna === null ? "" : pocetna.toFixed(2).replace(".", ","),
  )
  const [stanje, setStanje] = useState<"mirno" | "sprema" | "ok" | "greska">(
    "mirno",
  )
  const [poruka, setPoruka] = useState<string>()
  const [ceka, prenesi] = useTransition()

  const naIzlaz = () => {
    const upisano = vrijednost.trim()
    const staraTekst =
      pocetna === null ? "" : pocetna.toFixed(2).replace(".", ",")
    if (upisano === staraTekst) return

    setStanje("sprema")
    setPoruka(undefined)

    prenesi(async () => {
      const ishod = await snimi(upisano)
      if (ishod.ok) {
        setStanje("ok")
        setTimeout(() => setStanje("mirno"), 1500)
      } else {
        setStanje("greska")
        setPoruka(ishod.poruka)
        if (ishod.vrati !== undefined) {
          setVrijednost(ishod.vrati.toFixed(2).replace(".", ","))
        }
      }
    })
  }

  const okvir =
    stanje === "greska"
      ? "border-red-400 bg-red-50"
      : stanje === "ok"
        ? "border-green-400 bg-green-50"
        : "border-zinc-300"

  return (
    <span className="inline-flex items-center gap-1.5">
      <input
        value={vrijednost}
        onChange={(e) => setVrijednost(e.target.value)}
        onBlur={naIzlaz}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur()
        }}
        inputMode="decimal"
        aria-label="Cena"
        className={`${sirina} px-2 py-1 rounded-lg border text-right font-semibold ${okvir}`}
      />
      <span className="text-zinc-400 text-sm">€</span>

      <span className="text-xs w-16" aria-live="polite">
        {(stanje === "sprema" || ceka) && (
          <span className="text-zinc-500">shranjujem…</span>
        )}
        {stanje === "ok" && <span className="text-green-700">shranjeno</span>}
        {stanje === "greska" && (
          <span className="text-red-700" title={poruka}>
            napaka
          </span>
        )}
      </span>
    </span>
  )
}
