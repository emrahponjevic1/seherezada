import Link from "next/link"

import { svaJela, sveKategorije } from "@/lib/chef/upiti"
import { SpisakJela } from "@/components/chef/SpisakJela"

export default async function Jela() {
  const [jela, kategorije] = await Promise.all([svaJela(), sveKategorije()])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black font-poppins tracking-tight">
            Jedi
          </h1>
          <p className="text-zinc-500 mt-1">
            Katalog celotne znamke. Jed obstaja <strong>enkrat</strong>, prodaja
            pa se lahko v več lokalih po različnih cenah.
          </p>
        </div>
        <Link
          href="/chef/jela/novo"
          className="px-5 py-2.5 rounded-xl bg-shere-red text-white font-bold hover:bg-shere-darkred active:scale-95 transition-all"
        >
          + Dodaj jed
        </Link>
      </div>

      <SpisakJela jela={jela} kategorije={kategorije} />
    </div>
  )
}
