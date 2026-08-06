"use client"

import { useState } from "react"

/**
 * Filter galerije.
 *
 * Kao i kod menija: sve slike ostaju u dokumentu, filter mijenja samo
 * vidljivost klasom `hidden`. Bez JavaScripta se vidi cijela galerija.
 */
export function GalerijaFilter({
  grupe,
  svi,
  children,
}: {
  grupe: { kljuc: string; naziv: string }[]
  svi: string
  children: React.ReactNode
}) {
  const [aktivna, setAktivna] = useState<string>("vse")

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-8">
        {[{ kljuc: "vse", naziv: svi }, ...grupe].map((g) => (
          <button
            key={g.kljuc}
            onClick={() => setAktivna(g.kljuc)}
            aria-pressed={aktivna === g.kljuc}
            className={`px-5 py-2.5 rounded-2xl font-bold border transition-all ${
              aktivna === g.kljuc
                ? "bg-shere-red text-white border-transparent shadow-[0_8px_20px_-4px_rgba(230,57,70,0.45)]"
                : "bg-white/5 border-white/10 text-foreground/80 hover:bg-white/10"
            }`}
          >
            {g.naziv}
          </button>
        ))}
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        data-aktivna={aktivna}
      >
        {children}
      </div>

      {/* Skrivanje po grupi — sadržaj ostaje u dokumentu. */}
      <style>{`
        [data-aktivna="hrana"] [data-grupa]:not([data-grupa="hrana"]),
        [data-aktivna="lokal"] [data-grupa]:not([data-grupa="lokal"]),
        [data-aktivna="ekipa"] [data-grupa]:not([data-grupa="ekipa"]) {
          display: none;
        }
      `}</style>
    </>
  )
}
