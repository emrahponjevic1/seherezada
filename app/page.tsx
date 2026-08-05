"use client"

// PRIVREMENO — korak 3 briše ovaj fajl i zamjenjuje ga sa app/[[...slug]]/page.tsx.
// Ovdje samo drži postojeće sekcije istim redom kao dosadašnji App.tsx,
// da se poslije migracije ništa vizuelno ne promijeni.

import { useState } from "react"

import { Hero } from "@/components/Hero"
import { PopularPicks } from "@/components/PopularPicks"
import { AboutUs } from "@/components/AboutUs"
import { Menu } from "@/components/Menu"
import { Reviews } from "@/components/Reviews"
import { ProductModal } from "@/components/ProductModal"
import type { MenuItem } from "@/src/data"

export default function Page() {
  // Stanje modala je ovdje privremeno — korak 8 ga seli u Menu/PopularPicks.
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null)

  return (
    <>
      <Hero />
      <PopularPicks onItemClick={setSelectedProduct} />
      <AboutUs />
      <Menu onItemClick={setSelectedProduct} />
      <Reviews />

      <ProductModal
        item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  )
}
