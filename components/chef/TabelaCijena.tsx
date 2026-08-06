"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import type { Kategorija, Prevod } from "@/lib/domain"
import { t } from "@/lib/i18n"
import { dodajUMeni, postaviCijenu, postaviCijenuSvugdje } from "@/lib/chef/meni"
import { PoljeCijene } from "./PoljeCijene"

interface Red {
  jeloId: string
  jeloSlug: string
  naziv: Prevod
  kategorijaId: string
  cijene: Record<string, number | null>
}

/**
 * Sve cijene, svi lokali, jedan ekran.
 *
 * `—` znači da jelo NIJE u meniju tog lokala. To je podatak, ne greška:
 * klik nudi dodavanje. Broj kolona prati broj lokala, pa tabela ima
 * vodoravno skrolanje kad ih bude više.
 */
export function TabelaCijena({
  lokali,
  redovi,
  kategorije,
}: {
  lokali: { slug: string; naziv: string }[]
  redovi: Red[]
  kategorije: Kategorija[]
}) {
  const router = useRouter()
  const [pretraga, setPretraga] = useState("")
  const [kategorija, setKategorija] = useState("")
  const [svugdje, setSvugdje] = useState<Record<string, string>>({})
  const [ceka, prenesi] = useTransition()

  const vidljivi = useMemo(() => {
    const trazi = pretraga.trim().toLowerCase()
    return redovi.filter((r) => {
      if (kategorija && r.kategorijaId !== kategorija) return false
      if (!trazi) return true
      return (
        r.jeloSlug.includes(trazi) ||
        t(r.naziv, "sl").toLowerCase().includes(trazi)
      )
    })
  }, [redovi, pretraga, kategorija])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input
          value={pretraga}
          onChange={(e) => setPretraga(e.target.value)}
          placeholder="Iskanje po jedi…"
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

      <div className="bg-white border border-zinc-200 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-zinc-100 text-zinc-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="text-left px-4 py-3 font-bold sticky left-0 bg-zinc-100">
                Jed
              </th>
              {lokali.map((l) => (
                <th key={l.slug} className="text-left px-4 py-3 font-bold whitespace-nowrap">
                  {l.naziv}
                </th>
              ))}
              <th className="text-left px-4 py-3 font-bold whitespace-nowrap">
                Vsi lokali
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {vidljivi.map((r) => (
              <tr key={r.jeloId} className="hover:bg-zinc-50">
                <td className="px-4 py-2 font-semibold sticky left-0 bg-white">
                  {t(r.naziv, "sl")}
                </td>

                {lokali.map((l) => (
                  <td key={l.slug} className="px-4 py-2">
                    {r.cijene[l.slug] === null ? (
                      /* Jelo nije u meniju tog lokala — klik nudi dodavanje. */
                      <button
                        disabled={ceka}
                        onClick={() =>
                          prenesi(async () => {
                            const cijena = prompt(
                              `Cena za „${t(r.naziv, "sl")}" v lokalu ${l.naziv}:`,
                            )
                            if (!cijena) return
                            const ishod = await dodajUMeni(l.slug, [
                              { jeloId: r.jeloId, cijena },
                            ])
                            if (ishod.ok) router.refresh()
                            else alert(ishod.poruka)
                          })
                        }
                        title="Jed ni v meniju tega lokala. Kliknite za dodajanje."
                        className="px-3 py-1 rounded-lg border border-dashed border-zinc-300 text-zinc-400 hover:border-shere-red hover:text-shere-red"
                      >
                        —
                      </button>
                    ) : (
                      <PoljeCijene
                        pocetna={r.cijene[l.slug]}
                        sirina="w-20"
                        snimi={(unos) => postaviCijenu(l.slug, r.jeloId, unos)}
                      />
                    )}
                  </td>
                ))}

                <td className="px-4 py-2">
                  <div className="flex items-center gap-1.5">
                    <input
                      value={svugdje[r.jeloId] ?? ""}
                      onChange={(e) =>
                        setSvugdje((s) => ({ ...s, [r.jeloId]: e.target.value }))
                      }
                      placeholder="cena"
                      inputMode="decimal"
                      aria-label={`Cena za vse lokale — ${t(r.naziv, "sl")}`}
                      className="w-20 px-2 py-1 rounded-lg border border-zinc-300 text-right"
                    />
                    <button
                      disabled={!svugdje[r.jeloId] || ceka}
                      onClick={() =>
                        prenesi(async () => {
                          const ishod = await postaviCijenuSvugdje(
                            r.jeloId,
                            svugdje[r.jeloId],
                          )
                          if (ishod.ok) {
                            setSvugdje((s) => ({ ...s, [r.jeloId]: "" }))
                            router.refresh()
                          } else alert(ishod.poruka)
                        })
                      }
                      title="Nastavi to ceno v vseh lokalih, kjer jed obstaja. Nikamor je ne doda."
                      className="px-2.5 py-1 rounded-lg border border-zinc-300 font-semibold text-xs hover:bg-zinc-100 disabled:opacity-40"
                    >
                      uporabi
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-zinc-500">
        Prikazanih {vidljivi.length} od {redovi.length} jedi. „Uporabi" spremeni
        ceno samo tam, kjer jed <strong>že obstaja</strong> — nikamor je ne doda.
      </p>
    </div>
  )
}
