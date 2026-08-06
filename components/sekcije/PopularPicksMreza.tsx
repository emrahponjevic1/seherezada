"use client"

import { useState } from "react"

import type { MenuItem } from "@/src/data"
import { ProductCard } from "@/components/ProductCard"
import { ProductModal } from "@/components/ProductModal"

/**
 * Mreža izdvojenih jela + modal.
 *
 * Stanje modala živi OVDJE, a ne u stranici — tako naslovna ostaje
 * serverska. Korak 8 preuzima ProductCard i ProductModal i tada ovaj
 * omotač prelazi na tip `MenuStavka` bez prilagođavanja.
 */
export function PopularPicksMreza({ items }: { items: MenuItem[] }) {
  const [odabrano, setOdabrano] = useState<MenuItem | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {items.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            onClick={setOdabrano}
            context="popular"
          />
        ))}
      </div>

      <ProductModal item={odabrano} onClose={() => setOdabrano(null)} />
    </>
  )
}
