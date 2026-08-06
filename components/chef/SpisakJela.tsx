"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

import type { Jelo, Kategorija } from "@/lib/domain"
import { t } from "@/lib/i18n"
import { prebaciAktivno } from "@/lib/chef/jela"

/** Spisak jela sa filterom po kategoriji i pretragom. */
export function SpisakJela({
  jela,
  kategorije,
}: {
  jela: (Jelo & { uLokala: number })[]
  kategorije: Kategorija[]
}) {
  const [kategorija, setKategorija] = useState("")
  const [pretraga, setPretraga] = useState("")

  const vidljiva = useMemo(() => {
    const trazi = pretraga.trim().toLowerCase()
    return jela.filter((j) => {
      if (kategorija && j.kategorijaId !== kategorija) return false
      if (!trazi) return true
      return (
        j.slug.includes(trazi) ||
        t(j.naziv, "sl").toLowerCase().includes(trazi) ||
        t(j.naziv, "en").toLowerCase().includes(trazi)
      )
    })
  }, [jela, kategorija, pretraga])

  const imeKategorije = (id: string) => {
    const k = kategorije.find((x) => x.id === id)
    return k ? t(k.naziv, "sl") : "—"
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input
          value={pretraga}
          onChange={(e) => setPretraga(e.target.value)}
          placeholder="Iskanje po imenu…"
          className="px-3 py-2 rounded-xl border border-zinc-300 flex-1 min-w-48"
        />
        <select
          value={kategorija}
          onChange={(e) => setKategorija(e.target.value)}
          className="px-3 py-2 rounded-xl border border-zinc-300"
        >
          <option value="">Vse kategorije</option>
          {kategorije.map((k) => (
            <option key={k.id} value={k.id}>
              {t(k.naziv, "sl")}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-100 text-zinc-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="text-left px-4 py-3 font-bold">Jed</th>
                <th className="text-left px-4 py-3 font-bold">Kategorija</th>
                <th className="text-left px-4 py-3 font-bold">Oznake</th>
                <th className="text-right px-4 py-3 font-bold">V lokalih</th>
                <th className="text-right px-4 py-3 font-bold">Dejanja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {vidljiva.map((j) => (
                <tr
                  key={j.id}
                  className={`hover:bg-zinc-50 ${j.aktivno ? "" : "opacity-50"}`}
                >
                  <td className="px-4 py-3">
                    <div className="font-bold">{t(j.naziv, "sl")}</div>
                    <span className="font-mono text-xs text-zinc-500">
                      {j.slug}
                    </span>
                    {!j.aktivno && (
                      <span className="ml-2 text-xs font-bold text-zinc-500">
                        (neaktivno)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {imeKategorije(j.kategorijaId)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 text-xs font-bold">
                      {j.halal && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          halal
                        </span>
                      )}
                      {j.vegansko && (
                        <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-800">
                          vegan
                        </span>
                      )}
                      {!j.vegansko && j.vegetarijansko && (
                        <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-800">
                          veget.
                        </span>
                      )}
                      {j.ljuto > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                          {"🌶️".repeat(j.ljuto)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {/* Nula odmah pokazuje jelo koje nije ni u jednom meniju. */}
                    <span
                      className={
                        j.uLokala === 0 ? "font-bold text-amber-700" : "font-semibold"
                      }
                    >
                      {j.uLokala}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/chef/jela/${j.slug}`}
                        className="px-3 py-1.5 rounded-lg border border-zinc-300 font-semibold hover:bg-zinc-100"
                      >
                        Uredi
                      </Link>
                      <form action={prebaciAktivno}>
                        <input type="hidden" name="slug" value={j.slug} />
                        <input
                          type="hidden"
                          name="aktivno"
                          value={j.aktivno ? "0" : "1"}
                        />
                        <button
                          type="submit"
                          title={
                            j.aktivno
                              ? `Umakne jed s spletišča iz vseh ${j.uLokala} lokalov. Podatki ostanejo.`
                              : undefined
                          }
                          className="px-3 py-1.5 rounded-lg border border-zinc-300 font-semibold hover:bg-zinc-100"
                        >
                          {j.aktivno ? "Deaktiviraj" : "Aktiviraj"}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-sm text-zinc-500">
        Prikazanih {vidljiva.length} od {jela.length}. Cene se urejajo pri
        meniju posameznega lokala, ne tukaj.
      </p>
    </div>
  )
}
