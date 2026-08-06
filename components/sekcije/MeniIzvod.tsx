"use client"

import { useState } from "react"

import type { MenuItem } from "@/src/data"
import { Menu } from "@/components/Menu"
import { ProductModal } from "@/components/ProductModal"

/**
 * Sekcija 5 — izvod menija na naslovnoj.
 *
 * Menu.tsx je vlasništvo koraka 8 — ovdje se SAMO ugrađuje, ne dira.
 * Korak 8 ga pretvara u jednu komponentu sa varijantama 'puna' i 'izvod'
 * i tada ovaj omotač nestaje.
 */
export function MeniIzvod() {
  const [odabrano, setOdabrano] = useState<MenuItem | null>(null)

  return (
    <>
      <Menu onItemClick={setOdabrano} />
      <ProductModal item={odabrano} onClose={() => setOdabrano(null)} />
    </>
  )
}
