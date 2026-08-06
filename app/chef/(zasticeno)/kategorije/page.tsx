import { sveKategorije } from "@/lib/chef/upiti"
import { t } from "@/lib/i18n"
import { pomjeriKategoriju } from "@/lib/chef/jela"
import {
  DodajKategoriju,
  ObrisiKategoriju,
} from "@/components/chef/ObrazacKategorije"

export default async function Kategorije() {
  const kategorije = await sveKategorije()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black font-poppins tracking-tight">
            Kategorije
          </h1>
          <p className="text-zinc-500 mt-1">
            Vrstni red tukaj določa vrstni red na spletišču.
          </p>
        </div>
        <DodajKategoriju />
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-100 text-zinc-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="text-left px-4 py-3 font-bold">Ime</th>
              <th className="text-left px-4 py-3 font-bold">Stanje</th>
              <th className="text-right px-4 py-3 font-bold">Jedi</th>
              <th className="text-right px-4 py-3 font-bold">Dejanja</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {kategorije.map((k, i) => (
              <tr key={k.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3">
                  <div className="font-bold">{t(k.naziv, "sl")}</div>
                  <span className="font-mono text-xs text-zinc-500">
                    {k.slug}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${
                      k.aktivna
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-zinc-200 text-zinc-600 border-zinc-300"
                    }`}
                  >
                    {k.aktivna ? "aktivna" : "skrita"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  {k.brojJela}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <form action={pomjeriKategoriju} className="flex">
                      <input type="hidden" name="slug" value={k.slug} />
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
                    <form action={pomjeriKategoriju} className="flex">
                      <input type="hidden" name="slug" value={k.slug} />
                      <input type="hidden" name="smjer" value="dolje" />
                      <button
                        type="submit"
                        disabled={i === kategorije.length - 1}
                        aria-label="Premakni navzdol"
                        className="px-2 py-1.5 rounded-lg border border-zinc-300 hover:bg-zinc-100 disabled:opacity-30"
                      >
                        ↓
                      </button>
                    </form>
                    <ObrisiKategoriju slug={k.slug} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-zinc-500">
        Kategorije z jedmi ni mogoče izbrisati — to prepreči že baza.
      </p>
    </div>
  )
}
