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
  const [isMobileDevice, setIsMobileDevice] = useState(false)

  useEffect(() => {
    setIsMobileDevice(window.innerWidth < 1024)
  }, [])

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
        <div className="min-h-screen flex flex-col relative w-full selection:bg-shere-red selection:text-white bg-background">
            


            {/* Fixed Footer (z-10, behind content but above background) - Desktop Only */}
            <div 
              ref={footerRef}
              className="hidden lg:block fixed bottom-0 left-0 w-full z-10 pointer-events-auto"
            >
              <Footer />
            </div>

            {/* Layout Content Wrapper (z-20, covers footer and rounds at bottom on desktop) */}
            <div className="relative z-20 flex flex-col w-full bg-background rounded-b-none lg:rounded-b-[4rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden">
              
              {/* Global Background: Animated SVG on Desktop / Super-lightweight static repeating image on Mobile */}
              {isMobileDevice ? (
                <div 
                  className="absolute inset-0 z-0 pointer-events-none opacity-10 invert dark:invert-0"
                  style={{ 
                    backgroundImage: "url('/fast_food_pattern.webp')", 
                    backgroundRepeat: "repeat",
                    backgroundSize: "180px 180px"
                  }}
                ></div>
              ) : (
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <BackgroundPattern />
                </div>
              )}
              
              {/* Global Noise Overlay - disabled mix-blend on mobile for GPU perf, kept on desktop */}
              <div className="absolute inset-0 z-0 pointer-events-none bg-noise opacity-[0.03] lg:mix-blend-overlay lg:opacity-50"></div>

              <Navbar />
              
              <main className="w-full relative z-10">
                <Hero />
                <PopularPicks onItemClick={setSelectedProduct} />
                <AboutUs />
                <Menu onItemClick={setSelectedProduct} />
                <Reviews />
                
                {/* Inline Footer for Mobile/Tablet (Standard scrolling) */}
                <div className="block lg:hidden w-full pb-5">
                  <Footer />
                </div>
              </main>
            </div>
            
            {/* Spacer to allow scrolling past the main content to reveal the fixed footer - Desktop Only */}
            <div style={{ height: footerHeight }} className="hidden lg:block relative z-0 pointer-events-none w-full"></div>

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
