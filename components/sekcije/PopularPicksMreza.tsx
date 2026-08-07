"use client"

import { useState } from "react"

import type { Lang, Lokal, MenuStavka } from "@/lib/domain"
import { ProductCard } from "@/components/ProductCard"
import { ProductModal } from "@/components/ProductModal"

import { Celija, Traka } from "./Traka"

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
      <Traka>
        {stavke.map((stavka, i) => (
          <Celija key={stavka.jelo.id}>
            <ProductCard
              stavka={stavka}
              lang={lang}
              onClick={setOdabrano}
              context="popular"
              odmah={i < 4}
            />
          </Celija>
        ))}
      </Traka>

      <ProductModal
        stavka={odabrano}
        lokal={lokal}
        lang={lang}
        onClose={() => setOdabrano(null)}
      />
    </>
  )
}
