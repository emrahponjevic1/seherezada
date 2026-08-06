"use client"

import { useEffect, useState } from "react"
import { useFormStatus } from "react-dom"

import { JEZICI, type Lang, type Prevod, type PrevodLista } from "@/lib/domain"
import type { Greske } from "@/lib/chef/provjere"

/** Zajednički dijelovi svih obrazaca na /chef. */

const UNOS =
  "w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-shere-red/40 focus:border-shere-red disabled:bg-zinc-100"

export function Polje({
  ime,
  naslov,
  greske,
  pomoc,
  children,
}: {
  ime: string
  naslov: string
  greske?: Greske
  pomoc?: React.ReactNode
  children: React.ReactNode
}) {
  const greska = greske?.[ime]
  return (
    <div className="space-y-1.5">
      <label htmlFor={ime} className="text-sm font-semibold block">
        {naslov}
      </label>
      {children}
      {pomoc && <p className="text-xs text-zinc-500">{pomoc}</p>}
      {/* Greška stoji uz svoje polje, ne u zbirnoj poruci na vrhu. */}
      {greska && (
        <p role="alert" className="text-xs font-semibold text-red-600">
          {greska}
        </p>
      )}
    </div>
  )
}

export function Tekst({
  ime,
  naslov,
  greske,
  pomoc,
  ...ostalo
}: {
  ime: string
  naslov: string
  greske?: Greske
  pomoc?: React.ReactNode
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Polje ime={ime} naslov={naslov} greske={greske} pomoc={pomoc}>
      <input id={ime} name={ime} className={UNOS} {...ostalo} />
    </Polje>
  )
}

export function Izbor({
  ime,
  naslov,
  greske,
  opcije,
  ...ostalo
}: {
  ime: string
  naslov: string
  greske?: Greske
  opcije: { vrijednost: string; naziv: string }[]
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Polje ime={ime} naslov={naslov} greske={greske}>
      <select id={ime} name={ime} className={UNOS} {...ostalo}>
        {opcije.map((o) => (
          <option key={o.vrijednost} value={o.vrijednost}>
            {o.naziv}
          </option>
        ))}
      </select>
    </Polje>
  )
}

export function Kvacica({
  ime,
  naslov,
  ...ostalo
}: { ime: string; naslov: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-center gap-2.5 text-sm font-semibold cursor-pointer">
      <input
        id={ime}
        name={ime}
        type="checkbox"
        className="w-4 h-4 accent-shere-red"
        {...ostalo}
      />
      {naslov}
    </label>
  )
}

// ─────────────────────────────────────────────────────────────

/**
 * Prevodivo polje sa karticom po jeziku.
 *
 * Jezik bez prijevoda ima sivu tačku. Arapski se prikazuje zdesna
 * nalijevo i u samom obrascu. Slovenski je obavezan — on je izvor.
 *
 * U ovoj fazi se popunjavaju sl i en; ostale kartice postoje i čekaju
 * korak 22. Sva polja su UVIJEK u dokumentu, samo skrivena — inače bi
 * se pri snimanju slali samo oni jezici koji su bili otvoreni.
 */
export function PoJeziku({
  ime,
  naslov,
  vrijednosti,
  greske,
  visina,
  obavezanSl = true,
}: {
  ime: string
  naslov: string
  vrijednosti?: Prevod | PrevodLista
  greske?: Greske
  /** Ako je zadata, polje je višered. */
  visina?: number
  obavezanSl?: boolean
}) {
  const [aktivan, setAktivan] = useState<Lang>("sl")

  const vrijednost = (kod: Lang): string => {
    const v = vrijednosti?.[kod]
    if (Array.isArray(v)) return v.join("\n")
    return v ?? ""
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <span className="text-sm font-semibold">{naslov}</span>
        <div className="flex gap-1 flex-wrap">
          {JEZICI.map((j) => {
            const popunjen = vrijednost(j.kod).trim().length > 0
            return (
              <button
                key={j.kod}
                type="button"
                onClick={() => setAktivan(j.kod)}
                aria-pressed={aktivan === j.kod}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-colors ${
                  aktivan === j.kod
                    ? "bg-shere-red text-white"
                    : "bg-zinc-200 text-zinc-600 hover:bg-zinc-300"
                }`}
              >
                {j.kod}
                {j.kod === "sl" && obavezanSl && <span aria-hidden>*</span>}
                {/* Siva tačka = jezik bez prijevoda */}
                {!popunjen && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      aktivan === j.kod ? "bg-white/60" : "bg-zinc-400"
                    }`}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {JEZICI.map((j) => {
        const skriven = aktivan !== j.kod
        const rtl = "smjer" in j && j.smjer === "rtl"
        const zajednicko = {
          id: `${ime}.${j.kod}`,
          name: `${ime}.${j.kod}`,
          defaultValue: vrijednost(j.kod),
          dir: rtl ? ("rtl" as const) : ("ltr" as const),
          className: UNOS,
        }
        return (
          <div key={j.kod} className={skriven ? "hidden" : ""}>
            {visina ? (
              <textarea rows={visina} {...zajednicko} />
            ) : (
              <input {...zajednicko} />
            )}
          </div>
        )
      })}

      <p className="text-xs text-zinc-500">
        Prazno — prikazala se bo angleška, nato slovenska različica.
      </p>

      {greske?.[`${ime}.sl`] && (
        <p role="alert" className="text-xs font-semibold text-red-600">
          {greske[`${ime}.sl`]}
        </p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────

/** Dugme koje se onemogući dok traje snimanje. */
export function DugmeSnimi({ naziv = "Shrani" }: { naziv?: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2.5 rounded-xl bg-shere-red text-white font-bold hover:bg-shere-darkred active:scale-95 transition-all disabled:opacity-60 disabled:cursor-wait"
    >
      {pending ? "Shranjujem…" : naziv}
    </button>
  )
}

/** Upozorenje pri napuštanju sa nesačuvanim izmjenama. */
export function UpozoriNaIzmjene() {
  const [izmijenjeno, setIzmijenjeno] = useState(false)

  useEffect(() => {
    if (!izmijenjeno) return
    const cuvar = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener("beforeunload", cuvar)
    return () => window.removeEventListener("beforeunload", cuvar)
  }, [izmijenjeno])

  // Prati promjene bilo kojeg polja u obrascu iznad sebe.
  return (
    <span
      hidden
      ref={(el) => {
        const obrazac = el?.closest("form")
        if (!obrazac) return
        const naPromjenu = () => setIzmijenjeno(true)
        obrazac.addEventListener("input", naPromjenu)
        obrazac.addEventListener("submit", () => setIzmijenjeno(false))
        return () => obrazac.removeEventListener("input", naPromjenu)
      }}
    />
  )
}

export function PorukaGreske({ poruka }: { poruka?: string }) {
  if (!poruka) return null
  return (
    <div
      role="alert"
      className="text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
    >
      {poruka}{" "}
      <a href="/chef/prijava" className="underline">
        Prijava
      </a>
    </div>
  )
}
