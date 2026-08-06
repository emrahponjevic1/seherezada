import Link from "next/link"

import { sviLokali } from "@/lib/chef/upiti"
import {
  pomjeriLokal,
  postaviGlavni,
  promijeniStanje,
} from "@/lib/chef/lokali"

const ZNACKA: Record<string, string> = {
  radi: "bg-green-100 text-green-800 border-green-200",
  uskoro: "bg-amber-100 text-amber-800 border-amber-200",
  zatvoren: "bg-zinc-200 text-zinc-600 border-zinc-300",
}

const NAZIV_STANJA: Record<string, string> = {
  radi: "deluje",
  uskoro: "kmalu",
  zatvoren: "zaprt",
}

export default async function SpisakLokala() {
  const lokali = await sviLokali()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black font-poppins tracking-tight">
            Lokali
          </h1>
          <p className="text-zinc-500 mt-1">
            Nov lokal sam ustvari svoje naslove in se pojavi na spletišču.
          </p>
        </div>
        <Link
          href="/chef/lokali/novi"
          className="px-5 py-2.5 rounded-xl bg-shere-red text-white font-bold hover:bg-shere-darkred active:scale-95 transition-all"
        >
          + Dodaj lokal
        </Link>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-100 text-zinc-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="text-left px-4 py-3 font-bold">Ime</th>
                <th className="text-left px-4 py-3 font-bold">Naslov</th>
                <th className="text-left px-4 py-3 font-bold">Telefon</th>
                <th className="text-left px-4 py-3 font-bold">Stanje</th>
                <th className="text-right px-4 py-3 font-bold">Jedi</th>
                <th className="text-right px-4 py-3 font-bold">Dejanja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {lokali.map((l, i) => (
                <tr key={l.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {l.glavni && (
                        <span title="Glavni lokal — nima predpone v naslovu">
                          ⭐
                        </span>
                      )}
                      <span className="font-bold">{l.naziv}</span>
                    </div>
                    <span className="font-mono text-xs text-zinc-500">
                      /{l.slug}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{l.adresa}</td>
                  <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">
                    {l.telefon}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg border text-xs font-bold ${ZNACKA[l.stanje]}`}
                    >
                      {NAZIV_STANJA[l.stanje]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {l.brojJela}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      <Link
                        href={`/chef/lokali/${l.slug}`}
                        className="px-3 py-1.5 rounded-lg border border-zinc-300 font-semibold hover:bg-zinc-100"
                      >
                        Uredi
                      </Link>

                      {!l.glavni && l.stanje === "radi" && (
                        <form action={postaviGlavni}>
                          <input type="hidden" name="slug" value={l.slug} />
                          <button
                            type="submit"
                            title="Ta lokal bo prestavljen na seherezada.net/, trenutni glavni pa na svoj naslov."
                            className="px-3 py-1.5 rounded-lg border border-zinc-300 font-semibold hover:bg-zinc-100"
                          >
                            Glavni
                          </button>
                        </form>
                      )}

                      <form action={promijeniStanje} className="flex">
                        <input type="hidden" name="slug" value={l.slug} />
                        <input
                          type="hidden"
                          name="stanje"
                          value={l.stanje === "radi" ? "zatvoren" : "radi"}
                        />
                        <button
                          type="submit"
                          disabled={l.glavni && l.stanje === "radi"}
                          title={
                            l.glavni && l.stanje === "radi"
                              ? "Glavnega lokala ni mogoče skriti."
                              : undefined
                          }
                          className="px-3 py-1.5 rounded-lg border border-zinc-300 font-semibold hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {l.stanje === "radi" ? "Skrij" : "Prikaži"}
                        </button>
                      </form>

                      <form action={pomjeriLokal} className="flex">
                        <input type="hidden" name="slug" value={l.slug} />
                        <input type="hidden" name="smjer" value="gore" />
                        <button
                          type="submit"
                          disabled={i === 0}
                          aria-label="Premakni navzgor"
                          className="px-2 py-1.5 rounded-lg border border-zinc-300 hover:bg-zinc-100 disabled:opacity-30"
                        >
                          ↑
                        </button>
                      </form>
                      <form action={pomjeriLokal} className="flex">
                        <input type="hidden" name="slug" value={l.slug} />
                        <input type="hidden" name="smjer" value="dolje" />
                        <button
                          type="submit"
                          disabled={i === lokali.length - 1}
                          aria-label="Premakni navzdol"
                          className="px-2 py-1.5 rounded-lg border border-zinc-300 hover:bg-zinc-100 disabled:opacity-30"
                        >
                          ↓
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
        Spremembe so na spletišču vidne v nekaj sekundah.
      </p>
    </div>
  )
}
