"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import type { Prevod } from "@/lib/domain"
import { t } from "@/lib/i18n"
import { dodajUMeni } from "@/lib/chef/meni"

export interface JeloZaDodavanje {
  id: string
  slug: string
  naziv: Prevod
  kategorijaId: string
  kategorijaNaziv: Prevod
  cijeneDrugdje: Record<string, number>
}

/**
 * Dodavanje jela iz kataloga — najčešća radnja u cijelom adminu.
 *
 * Jela koja su već u meniju se ovdje uopšte ne pojavljuju, pa se isto
 * jelo ne može dodati dvaput. Cijena se upisuje odmah i obavezna je:
 * jelo bez cijene u meniju nema smisla.
 */
export function DodajJela({
  lokal,
  ponuda,
  drugiLokali,
}: {
  lokal: string
  ponuda: JeloZaDodavanje[]
  drugiLokali: { slug: string; naziv: string }[]
}) {
  const router = useRouter()
  const [otvoreno, setOtvoreno] = useState(false)
  const [pretraga, setPretraga] = useState("")
  const [kategorija, setKategorija] = useState("")
  const [izabrana, setIzabrana] = useState<Record<string, string>>({})
  const [greska, setGreska] = useState<string>()
  const [ceka, prenesi] = useTransition()

  const kategorije = useMemo(() => {
    const m = new Map<string, string>()
    for (const j of ponuda) m.set(j.kategorijaId, t(j.kategorijaNaziv, "sl"))
    return [...m.entries()]
  }, [ponuda])

  const vidljiva = useMemo(() => {
    const trazi = pretraga.trim().toLowerCase()
    return ponuda.filter((j) => {
      if (kategorija && j.kategorijaId !== kategorija) return false
      if (!trazi) return true
      return (
        j.slug.includes(trazi) || t(j.naziv, "sl").toLowerCase().includes(trazi)
      )
    })
  }, [ponuda, pretraga, kategorija])

  const brojIzabranih = Object.keys(izabrana).length

  /** Prečica: prepiše cijene odabranog lokala u polja, pa se dotjeraju. */
  const predloziIz = (izvor: string) => {
    const novo = { ...izabrana }
    for (const j of vidljiva) {
      const c = j.cijeneDrugdje[izvor]
      if (c !== undefined) novo[j.id] = c.toFixed(2).replace(".", ",")
    }
    setIzabrana(novo)
  }

  if (!otvoreno) {
    return (
      <button
        onClick={() => setOtvoreno(true)}
        disabled={ponuda.length === 0}
        className="px-5 py-2.5 rounded-xl bg-shere-red text-white font-bold hover:bg-shere-darkred active:scale-95 transition-all disabled:opacity-50"
      >
        + Dodaj jed{ponuda.length === 0 && " (vse so že v meniju)"}
      </button>
    )
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="font-black font-poppins text-lg">Dodaj jed v meni</h2>
        <button
          onClick={() => setOtvoreno(false)}
          className="text-sm font-semibold px-3 py-1.5 rounded-lg border border-zinc-300 hover:bg-zinc-100"
        >
          Zapri
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          value={pretraga}
          onChange={(e) => setPretraga(e.target.value)}
          placeholder="Iskanje…"
          className="px-3 py-2 rounded-xl border border-zinc-300 flex-1 min-w-40"
        />
        <select
          value={kategorija}
          onChange={(e) => setKategorija(e.target.value)}
          className="px-3 py-2 rounded-xl border border-zinc-300"
        >
          <option value="">Vse kategorije</option>
          {kategorije.map(([id, naziv]) => (
            <option key={id} value={id}>
              {naziv}
            </option>
          ))}
        </select>
      </div>

      {drugiLokali.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-zinc-500">Predlagaj cene iz:</span>
          {drugiLokali.map((l) => (
            <button
              key={l.slug}
              onClick={() => predloziIz(l.slug)}
              className="px-3 py-1.5 rounded-lg border border-zinc-300 font-semibold hover:bg-zinc-100"
            >
              {l.naziv}
            </button>
          ))}
        </div>
      )}

      <div className="max-h-96 overflow-y-auto border border-zinc-200 rounded-xl divide-y divide-zinc-200">
        {vidljiva.map((j) => {
          const izabrano = j.id in izabrana
          return (
            <label
              key={j.id}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={izabrano}
                onChange={(e) =>
                  setIzabrana((s) => {
                    const novo = { ...s }
                    if (e.target.checked) novo[j.id] = s[j.id] ?? ""
                    else delete novo[j.id]
                    return novo
                  })
                }
                className="w-4 h-4 accent-shere-red"
              />
              <span className="flex-1 font-semibold">{t(j.naziv, "sl")}</span>
              <span className="text-xs text-zinc-500 w-24">
                {t(j.kategorijaNaziv, "sl")}
              </span>
              <input
                value={izabrana[j.id] ?? ""}
                onChange={(e) =>
                  setIzabrana((s) => ({ ...s, [j.id]: e.target.value }))
                }
                onClick={(e) => e.preventDefault()}
                placeholder="cena"
                inputMode="decimal"
                aria-label={`Cena za ${t(j.naziv, "sl")}`}
                className="w-24 px-2 py-1 rounded-lg border border-zinc-300 text-right"
              />
              <span className="text-zinc-400 text-sm">€</span>
            </label>
          )
        })}
        {vidljiva.length === 0 && (
          <p className="px-4 py-6 text-center text-zinc-500">Ni zadetkov.</p>
        )}
      </div>

      {greska && (
        <p role="alert" className="text-sm font-semibold text-red-600">
          {greska}
        </p>
      )}

      <button
        disabled={brojIzabranih === 0 || ceka}
        onClick={() =>
          prenesi(async () => {
            setGreska(undefined)
            const ishod = await dodajUMeni(
              lokal,
              Object.entries(izabrana).map(([jeloId, cijena]) => ({
                jeloId,
                cijena,
              })),
            )
            if (ishod.ok) {
              setIzabrana({})
              setOtvoreno(false)
              router.refresh()
            } else {
              setGreska(ishod.poruka)
            }
          })
        }
        className="px-6 py-2.5 rounded-xl bg-shere-red text-white font-bold hover:bg-shere-darkred active:scale-95 transition-all disabled:opacity-50"
      >
        {ceka
          ? "Dodajam…"
          : `Dodaj ${brojIzabranih} ${brojIzabranih === 1 ? "jed" : "jedi"}`}
      </button>
    </div>
  )
}
