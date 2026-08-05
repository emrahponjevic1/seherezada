"use client"

import { useState, useEffect } from "react"
import { useTheme } from "../../providers/ThemeProvider"
import { useLanguage } from "../../providers/LanguageProvider"
import { Moon, Sun, Languages, Menu as MenuIcon, X } from "lucide-react"
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useSpring } from "framer-motion"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { lang, setLang, t } = useLanguage()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("#home")

  const navLinks = [
    { href: "#home", sl: "Početna", en: "Home" },
    { href: "#popular", sl: "Popularno", en: "Popular Picks" },
    { href: "#about", sl: "O nama", en: "About Us" },
    { href: "#menu", sl: "Meni", en: "Menu" },
    { href: "#reviews", sl: "Recenzije", en: "Reviews" },
  ]

  const { scrollY, scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  // Track active section using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`)
          }
        })
      },
      { rootMargin: "-20% 0px -60% 0px" }
    )
    
    navLinks.forEach((link) => {
      const el = document.querySelector(link.href)
      if (el) observer.observe(el)
    })
    
    return () => observer.disconnect()
  }, [])

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    window.dispatchEvent(new CustomEvent('mobileNavToggle', { detail: { isOpen: isMobileOpen } }))
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileOpen])

  return (
    <>
      {/* Navbar Layout Logic */}
      <header 
        className={`fixed left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-in-out
          ${isScrolled ? "top-0 px-0" : "top-0 px-0 lg:top-4 lg:px-8"}
        `}
      >
        <div 
          className={`w-full bg-background dark:bg-background lg:bg-background/80 lg:dark:bg-background/60 lg:backdrop-blur-3xl flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all duration-500 ease-in-out relative
            ${isScrolled
              ? "max-w-full rounded-none border-b border-white/5 dark:border-white/10 px-6 lg:px-12 py-3" 
              : "max-w-full lg:max-w-[1440px] rounded-none lg:rounded-2xl border-b lg:border lg:border-white/10 border-white/5 px-6 lg:px-8 py-3 lg:py-3.5"
            }
          `}
        >
          
          {/* Scroll Progress Bar at the very bottom of the Navbar */}
          <AnimatePresence>
            {isScrolled && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-shere-red to-orange-500 origin-left z-50"
                style={{ scaleX }}
              />
            )}
          </AnimatePresence>

          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group z-50 relative" onClick={() => window.scrollTo(0,0)}>
            <div className="w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-tr from-shere-red to-red-500 rounded-2xl flex items-center justify-center text-white font-black text-xl lg:text-2xl shadow-[0_8px_25px_-5px_rgba(230,57,70,0.5)] group-hover:scale-105 transition-transform duration-300 rotate-3">Š</div>
            <h1 className="text-xl lg:text-2xl font-poppins font-black tracking-tight bg-gradient-to-r from-foreground via-foreground to-shere-red bg-clip-text text-transparent">
              Šeherezada
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex space-x-2 text-sm font-bold tracking-wide">
            {navLinks.map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                onClick={() => setActiveSection(link.href)}
                className={`relative px-4 py-2 rounded-xl transition-colors group ${
                  activeSection === link.href ? "text-white" : "text-foreground/80 hover:text-foreground"
                }`}
              >
                <span className="relative z-10">{t(link.sl, link.en)}</span>
                {activeSection === link.href && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-shere-red rounded-xl shadow-lg shadow-shere-red/25"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Controls & Hamburger */}
          <div className="flex items-center space-x-2 z-50 relative">
            {/* Language Selector */}
            <button 
              onClick={() => setLang(lang === "sl" ? "en" : "sl")}
              className="flex px-3 py-2.5 rounded-xl bg-muted/40 hover:bg-muted/80 border border-white/5 transition-all items-center gap-2 text-xs font-black tracking-wider text-foreground/80"
              title="Toggle Language"
            >
              <Languages size={16} />
              <span>{lang.toUpperCase()}</span>
            </button>
            
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl bg-muted/40 hover:bg-muted/80 border border-white/5 text-foreground/80 transition-all active:scale-95"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Hamburger (Mobile) */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-shere-red/10 text-shere-red hover:bg-shere-red/20 border border-shere-red/10 transition-all active:scale-95"
            >
              {isMobileOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
          
        </div>
      </header>

      {/* Fullscreen Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl flex flex-col px-8 pt-32 pb-12 lg:hidden overflow-y-auto"
          >
            <nav className="flex flex-col space-y-8 mt-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
                  className="text-4xl font-black font-poppins text-foreground tracking-tight hover:text-shere-red transition-colors"
                >
                  {t(link.sl, link.en)}
                </motion.a>
              ))}
            </nav>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-auto pt-12 border-t border-white/10"
            >
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
                  {t("Jezik aplikacije", "App Language")}
                </p>
                <button 
                  onClick={() => {
                    setLang(lang === "sl" ? "en" : "sl")
                    setIsMobileOpen(false)
                  }}
                  className="px-4 py-2.5 rounded-xl bg-shere-red text-white font-black text-sm tracking-wider shadow-lg shadow-shere-red/25 active:scale-95 transition-transform"
                >
                  {lang === "sl" ? "ENGLISH" : "SLOVENŠČINA"}
                </button>
              </div>
              
              <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">📍</div>
                <p>Trubarjeva cesta 31, Ljubljana</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}