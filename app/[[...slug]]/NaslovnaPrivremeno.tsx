"use client"

// PRIVREMENO — korak 7 preuzima naslovnu i dijeli sekcije na serverski
// tekst + klijentski animirani omotač. Ovdje stoji samo da naslovna ne
// ostane prazna između koraka 3 i 7; sadržaj i redoslijed su nepromijenjeni.

import { useState } from "react"

import { Hero } from "@/components/Hero"
import { PopularPicks } from "@/components/PopularPicks"
import { AboutUs } from "@/components/AboutUs"
import { Menu } from "@/components/Menu"
import { Reviews } from "@/components/Reviews"
import { ProductModal } from "@/components/ProductModal"
import type { MenuItem } from "@/src/data"

export function NaslovnaPrivremeno() {
  // Stanje modala seli u Menu/PopularPicks u koraku 8.
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
