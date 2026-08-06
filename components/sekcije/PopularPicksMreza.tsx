"use client"

import { useState } from "react"

import type { Lang, Lokal, MenuStavka } from "@/lib/domain"
import { ProductCard } from "@/components/ProductCard"
import { ProductModal } from "@/components/ProductModal"

/**
 * Mreža izdvojenih jela + modal.
 *
 * Stanje modala živi ovdje, a ne u stranici — tako naslovna ostaje
 * serverska komponenta.
 */
export function PopularPicksMreza({
  stavke,
  lokal,
  lang,
}: {
  stavke: MenuStavka[]
  lokal: Lokal
  lang: Lang
}) {
  const [odabrano, setOdabrano] = useState<MenuStavka | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {stavke.map((stavka, i) => (
          <ProductCard
            key={stavka.jelo.id}
            stavka={stavka}
            lang={lang}
            onClick={setOdabrano}
            context="popular"
            odmah={i < 4}
          />
        ))}
      </div>

      <ProductModal
        stavka={odabrano}
        lokal={lokal}
        lang={lang}
        onClose={() => setOdabrano(null)}
      />
    </>
  )
}
