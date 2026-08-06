import Link from "next/link"

import { sveKategorije, tabelaCijena } from "@/lib/chef/upiti"
import { TabelaCijena } from "@/components/chef/TabelaCijena"

export default async function Cijene() {
  const [{ lokali, redovi }, kategorije] = await Promise.all([
    tabelaCijena(),
    sveKategorije(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black font-poppins tracking-tight">
            Cene — vsi lokali
          </h1>
          <p className="text-zinc-500 mt-1">
            Vse cene na enem zaslonu. Klik na polje, vpis, shrani se ob izhodu.
          </p>
        </div>
        <Link
          href="/chef/meni"
          className="px-4 py-2.5 rounded-xl border border-zinc-300 font-semibold hover:bg-zinc-100"
        >
          Meni po lokalih
        </Link>
      </div>

      <TabelaCijena
        lokali={lokali}
        redovi={redovi}
        kategorije={kategorije}
      />
    </div>
  )
}
