import { useState, useRef, useEffect } from "react"
import { ThemeProvider } from "./providers/ThemeProvider"
import { LanguageProvider } from "./providers/LanguageProvider"

import { BackgroundPattern } from "./components/BackgroundPattern"
import { Navbar } from "./components/layout/Navbar"
import { Hero } from "./components/Hero"
import { PopularPicks } from "./components/PopularPicks"
import { AboutUs } from "./components/AboutUs"
import { Menu } from "./components/Menu"
import { Reviews } from "./components/Reviews"
import { Footer } from "./components/layout/Footer"
import { MobileCTA } from "./components/layout/MobileCTA"

import { ProductModal } from "./components/ProductModal"
import type { MenuItem } from "./data"

function App() {
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const [footerHeight, setFooterHeight] = useState(0)

  useEffect(() => {
    if (!footerRef.current) return
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setFooterHeight(entry.contentRect.height)
      }
    })
    resizeObserver.observe(footerRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="shere-theme">
      <LanguageProvider>
        <div className="min-h-screen flex flex-col relative w-full overflow-x-hidden selection:bg-shere-red selection:text-white bg-background">
            
            {/* Fixed Footer (z-10, behind content but above background) */}
            <div 
              ref={footerRef}
              className="fixed bottom-0 left-0 w-full z-10 pointer-events-auto"
            >
              <Footer />
            </div>

            {/* Layout Content Wrapper (z-20, covers footer and rounds at bottom) */}
            <div className="relative z-20 flex flex-col w-full bg-background rounded-b-[2.5rem] md:rounded-b-[4rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden transition-all">
              
              {/* Global Animated Background Pattern (moved inside wrapper to be visible above wrapper's background) */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <BackgroundPattern />
              </div>
              
              {/* Global Noise Overlay */}
              <div className="absolute inset-0 z-0 pointer-events-none bg-noise mix-blend-overlay opacity-50"></div>

              <Navbar />
              
              <main className="w-full relative z-10">
                <Hero />
                <PopularPicks onItemClick={setSelectedProduct} />
                <AboutUs />
                <Menu onItemClick={setSelectedProduct} />
                <Reviews />
              </main>
            </div>
            
            {/* Spacer to allow scrolling past the main content to reveal the fixed footer */}
            <div style={{ height: footerHeight }} className="relative z-0 pointer-events-none w-full"></div>

            {/* Mobile Only Overlays */}
            <div className="relative z-50">
              <MobileCTA />
            </div>
            
            {/* Product Details Modal */}
            <ProductModal 
              item={selectedProduct} 
              onClose={() => setSelectedProduct(null)} 
            />
            
        </div>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
