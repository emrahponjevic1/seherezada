"use client"

import { useState, useRef, useEffect } from "react"
import { menuItems, type Category, type MenuItem } from "@/src/data"
import { ProductCard } from "./ProductCard"
import { useLanguage } from "../providers/LanguageProvider"

const CATEGORIES: Category[] = ['Kebab', 'Pice', 'Burgeri', 'Falafel', 'Meni', 'Ostalo', 'Dodatki', 'Pijača']

const CATEGORY_EMOJIS: Record<Category, string> = {
  Kebab: "🌯",
  Pice: "🍕",
  Burgeri: "🍔",
  Falafel: "🧆",
  Meni: "🍱",
  Ostalo: "🍲",
  Dodatki: "🍟",
  Pijača: "🥤"
}

interface MenuProps {
  onItemClick: (item: MenuItem) => void
}

export function Menu({ onItemClick }: MenuProps) {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<Category>('Kebab')
  const navRef = useRef<HTMLDivElement>(null)

  // Listen to custom event from MobileFAB
  useEffect(() => {
    const handleSetCategory = (e: Event) => {
      const customEvent = e as CustomEvent<Category>
      if (customEvent.detail) {
        setActiveCategory(customEvent.detail)
      }
    }
    window.addEventListener("set-menu-category", handleSetCategory)
    return () => {
      window.removeEventListener("set-menu-category", handleSetCategory)
    }
  }, [])

  // Filter items
  const filteredItems = menuItems.filter(item => item.category === activeCategory)

  // Drag to scroll logic
  const isDragging = useRef(false)
  const startPos = useRef({ x: 0, scrollLeft: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!navRef.current) return
    isDragging.current = false
    startPos.current = {
      x: e.pageX,
      scrollLeft: navRef.current.scrollLeft
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons !== 1 || !navRef.current) return // Only left click drag
    const walk = e.pageX - startPos.current.x
    if (Math.abs(walk) > 5) {
      isDragging.current = true
    }
    navRef.current.scrollLeft = startPos.current.scrollLeft - walk
  }

  // Handle category click (scroll tab into view on mobile)
  const handleCategoryClick = (cat: Category, e?: React.MouseEvent<HTMLButtonElement>) => {
    if (isDragging.current) {
      e?.preventDefault()
      return
    }
    setActiveCategory(cat)
    if (e && navRef.current) {
      const target = e.currentTarget
      const scrollLeft = target.offsetLeft - (navRef.current.offsetWidth / 2) + (target.offsetWidth / 2)
      navRef.current.scrollTo({ left: scrollLeft, behavior: "smooth" })
    }
  }



  return (
    <section id="menu" className="py-16 md:py-24 px-4 md:px-8 lg:px-12 w-full relative">
      {/* Background radial glow */}
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-shere-red/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-orange-500/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto w-full flex flex-col gap-8 md:gap-12 relative z-10">
        
        {/* Category Header & Horizontal Scrollable Tabs */}
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-black font-poppins mb-3 tracking-tight">{t("Naš Meni", "Our Menu")}</h2>
              <p className="text-muted-foreground text-lg">{t("Izberi svojo najljubšo jed iz naše ponudbe", "Choose your favorite dish from our offering")}</p>
            </div>
            <div className="text-sm font-black text-shere-red bg-shere-red/10 px-5 py-2.5 rounded-2xl border border-shere-red/20 w-fit flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-shere-red animate-pulse"></span>
              {filteredItems.length} {t("jedi", "dishes")}
            </div>
          </div>

          {/* Universal Horizontal Category Scroll */}
          <div className="relative">
            <div 
              ref={navRef} 
              className="flex overflow-x-auto hide-scrollbar gap-3 md:gap-4 py-8 px-4 -mx-4 items-center cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => { isDragging.current = false }}
            >
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={(e) => handleCategoryClick(cat, e)}
                  className={`relative whitespace-nowrap px-6 md:px-8 py-3.5 md:py-4 rounded-2xl text-base md:text-lg font-black transition-all duration-300 flex items-center gap-3 flex-shrink-0 group border select-none
                    ${activeCategory === cat 
                      ? "text-white shadow-[0_8px_20px_-4px_rgba(230,57,70,0.45)] border-transparent scale-105" 
                      : "bg-white/5 hover:bg-white/10 border-white/10 text-foreground/80 hover:text-white hover:scale-[1.02]"
                    }`}
                >
                  {activeCategory === cat && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-shere-red to-orange-500 z-0"></div>
                  )}
                  <span className="relative z-10 text-2xl group-hover:scale-110 transition-transform duration-300">{CATEGORY_EMOJIS[cat]}</span>
                  <span className="relative z-10 tracking-wide">{cat}</span>
                  {activeCategory === cat && (
                    <span className="relative z-10 w-1.5 h-1.5 rounded-full bg-white ml-1 shadow-[0_0_8px_rgba(255,255,255,0.9)]"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PRODUCTS GRID (Adaptive columns per device size)                          */}
        {/* ========================================================================= */}
        <div className="flex-1 min-h-[400px]">
          {/* Grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredItems.map(item => (
              <ProductCard key={item.id} item={item} onClick={onItemClick} context="menu" />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="w-full h-[40vh] flex flex-col items-center justify-center text-center space-y-4">
              <div className="text-6xl mb-2 opacity-50">🍽️</div>
              <p className="text-xl text-zinc-400 font-bold max-w-md">
                {t("Trenutno ni jedi v tej kategoriji.", "Currently no dishes in this category.")}
              </p>
              <button 
                onClick={() => setActiveCategory('Kebab')}
                className="mt-4 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all text-shere-red"
              >
                {t("Nazaj na Kebab", "Back to Kebab")}
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}