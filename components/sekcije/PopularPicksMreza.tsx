"use client"

import { useState } from "react"

import type { Lang, Lokal, MenuStavka } from "@/lib/domain"
import { ui } from "@/lib/i18n"
import { ProductCard } from "@/components/ProductCard"
import { ProductModal } from "@/components/ProductModal"

import { Celija, Traka } from "./Traka"

/**
 * Izdvojena jela kao vodoravna traka + modal.
 *
 * Naslov je ovdje, a ne u serverskoj `PopularPicks`, jer strelice moraju
 * stajati u istom redu s njim, a njima treba pristup traci — dakle
 * klijentsko stanje. Tekst i dalje dolazi iz kataloga, pa je u izvornom
 * HTML-u kao i prije.
 *
 * Stanje modala živi ovdje, ne u stranici — tako naslovna ostaje
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
      <Traka
        lang={lang}
        zaglavlje={
          <>
            <h2 className="text-4xl md:text-5xl font-black font-poppins mb-3 tracking-tight">
              {ui("recenzije.priljubljeneIzbire", lang)}
            </h2>
            <p className="text-muted-foreground text-lg">
              {ui("recenzije.najboljeOcenjene", lang)}
            </p>
          </>
        }
      >
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
