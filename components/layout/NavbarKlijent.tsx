"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Moon, Sun, Languages, Menu as MenuIcon, X, ChevronDown } from "lucide-react"
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useSpring,
} from "framer-motion"

import { useTheme } from "@/providers/ThemeProvider"
import { useLanguage } from "@/providers/LanguageProvider"
import { href, type Route } from "@/lib/route"
import { izPutanje, trenutniLokal, type OkvirPodaci } from "./okvir"

export function NavbarKlijent({ lokali, glavniSlug }: OkvirPodaci) {
  const { theme, setTheme } = useTheme()
  const { lang: langSucelja, setLang, t } = useLanguage()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [podmeniOtvoren, setPodmeniOtvoren] = useState(false)

  const pathname = usePathname()
  // Jezik i lokal se čitaju IZ ADRESE (pravilo 4), ne iz stanja.
  const { lang, lokalSlug } = izPutanje(pathname, { lokali, glavniSlug })
  const lokal = trenutniLokal(lokali, lokalSlug, glavniSlug)

  const adresa = (r: Route) => href(r, glavniSlug)

  const meniAdresa = adresa({
    kind: "lokal-page",
    lang,
    lokal: lokalSlug,
    page: "meni",
  })

  const podmeni = [
    { adresa: adresa({ kind: "seo", lang, page: "kebab-ljubljana" }), sl: "Kebab", en: "Kebab" },
    { adresa: adresa({ kind: "seo", lang, page: "pizza-ljubljana" }), sl: "Pizza", en: "Pizza" },
    { adresa: adresa({ kind: "seo", lang, page: "burger-ljubljana" }), sl: "Burgerji", en: "Burgers" },
    { adresa: adresa({ kind: "seo", lang, page: "falafel-ljubljana" }), sl: "Falafel", en: "Falafel" },
    { adresa: meniAdresa, sl: "Cel meni", en: "Full menu" },
  ]

  const stavke = [
    { adresa: meniAdresa, sl: "Meni", en: "Menu", imaPodmeni: true },
    { adresa: adresa({ kind: "shared", lang, page: "halal" }), sl: "Halal", en: "Halal", imaPodmeni: false },
    { adresa: adresa({ kind: "shared", lang, page: "o-nas" }), sl: "O nas", en: "About us", imaPodmeni: false },
    { adresa: adresa({ kind: "shared", lang, page: "galerija" }), sl: "Galerija", en: "Gallery", imaPodmeni: false },
    { adresa: adresa({ kind: "shared", lang, page: "pogosta-vprasanja" }), sl: "Vprašanja", en: "FAQ", imaPodmeni: false },
  ]

  const naslovnaAdresa = adresa({ kind: "lokal-home", lang, lokal: lokalSlug })

  const { scrollY, scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  // Aktivnu stavku određuje ADRESA. Scroll-spy je uklonjen — pratio je
  // sekcije jedne stranice, a sekcije su sada zasebne stranice.
  const jeAktivna = (cilj: string) =>
    cilj === "/" ? pathname === "/" : pathname === cilj || pathname.startsWith(cilj + "/")

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    window.dispatchEvent(
      new CustomEvent("mobileNavToggle", { detail: { isOpen: isMobileOpen } }),
    )
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileOpen])

  return (
    <>
      <header
        className={`fixed left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-in-out
          ${isScrolled ? "top-0 px-0" : "top-0 px-0 lg:top-4 lg:px-8"}
        `}
      >
        <div
          className={`w-full bg-background dark:bg-background lg:bg-background/80 lg:dark:bg-background/60 lg:backdrop-blur-3xl flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all duration-500 ease-in-out relative
            ${
              isScrolled
                ? "max-w-full rounded-none border-b border-white/5 dark:border-white/10 px-6 lg:px-12 py-3"
                : "max-w-full lg:max-w-[1440px] rounded-none lg:rounded-2xl border-b lg:border lg:border-white/10 border-white/5 px-6 lg:px-8 py-3 lg:py-3.5"
            }
          `}
        >
          {/* Traka napretka skrolanja */}
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

          {/* Logo — vodi na naslovnu istog jezika i lokala.
              Više nije <h1>: naslov pripada sadržaju, ne zaglavlju. */}
          <Link
            href={naslovnaAdresa}
            className="flex items-center gap-3 cursor-pointer group z-50 relative"
          >
            <div className="w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-tr from-shere-red to-red-500 rounded-2xl flex items-center justify-center text-white font-black text-xl lg:text-2xl shadow-[0_8px_25px_-5px_rgba(230,57,70,0.5)] group-hover:scale-105 transition-transform duration-300 rotate-3">
              Š
            </div>
            <div className="text-xl lg:text-2xl font-poppins font-black tracking-tight bg-gradient-to-r from-foreground via-foreground to-shere-red bg-clip-text text-transparent">
              Šeherezada
            </div>
          </Link>

          {/* Desktop navigacija */}
          <nav className="hidden lg:flex space-x-2 text-sm font-bold tracking-wide">
            {stavke.map((stavka) => (
              <div
                key={stavka.adresa + stavka.sl}
                className="relative"
                onMouseEnter={() => stavka.imaPodmeni && setPodmeniOtvoren(true)}
                onMouseLeave={() => stavka.imaPodmeni && setPodmeniOtvoren(false)}
              >
                <Link
                  href={stavka.adresa}
                  className={`relative px-4 py-2 rounded-xl transition-colors group flex items-center gap-1 ${
                    jeAktivna(stavka.adresa)
                      ? "text-white"
                      : "text-foreground/80 hover:text-foreground"
                  }`}
                >
                  <span className="relative z-10">{t(stavka.sl, stavka.en)}</span>
                  {stavka.imaPodmeni && (
                    <ChevronDown size={14} className="relative z-10" />
                  )}
                  {jeAktivna(stavka.adresa) && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-shere-red rounded-xl shadow-lg shadow-shere-red/25"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>

                {/* Podmeni je UVIJEK u dokumentu, samo se skriva stilom —
                    da mu linkovi ostanu u izvornom HTML-u. */}
                {stavka.imaPodmeni && (
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: podmeniOtvoren ? 1 : 0,
                      y: podmeniOtvoren ? 0 : -8,
                    }}
                    transition={{ duration: 0.2 }}
                    className={`absolute left-0 top-full pt-2 w-52 ${
                      podmeniOtvoren ? "" : "pointer-events-none"
                    }`}
                  >
                    <div className="bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
                      {podmeni.map((p) => (
                        <Link
                          key={p.adresa + p.sl}
                          href={p.adresa}
                          className="block px-4 py-2.5 rounded-xl text-foreground/80 hover:text-foreground hover:bg-muted/40 transition-colors"
                        >
                          {t(p.sl, p.en)}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </nav>

          {/* Kontrole */}
          <div className="flex items-center space-x-2 z-50 relative">
            {/* korak 19: prekidač lokala ide ovdje, lijevo od jezika */}

            <button
              onClick={() => setLang(langSucelja === "sl" ? "en" : "sl")}
              className="flex px-3 py-2.5 rounded-xl bg-muted/40 hover:bg-muted/80 border border-white/5 transition-all items-center gap-2 text-xs font-black tracking-wider text-foreground/80"
              title="Toggle Language"
            >
              <Languages size={16} />
              <span>{langSucelja.toUpperCase()}</span>
            </button>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl bg-muted/40 hover:bg-muted/80 border border-white/5 text-foreground/80 transition-all active:scale-95"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-shere-red/10 text-shere-red hover:bg-shere-red/20 border border-shere-red/10 transition-all active:scale-95"
            >
              {isMobileOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobilni preklopni meni */}
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
              {stavke.map((stavka, i) => (
                <motion.div
                  key={stavka.adresa + stavka.sl}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
                >
                  <Link
                    href={stavka.adresa}
                    onClick={() => setIsMobileOpen(false)}
                    className="text-4xl font-black font-poppins text-foreground tracking-tight hover:text-shere-red transition-colors"
                  >
                    {t(stavka.sl, stavka.en)}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-auto pt-12 border-t border-white/10"
            >
              {/* korak 19: red LOKAL ide ovdje, iznad reda JEZIK APLIKACIJE */}

              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
                  {t("Jezik aplikacije", "App Language")}
                </p>
                <button
                  onClick={() => {
                    setLang(langSucelja === "sl" ? "en" : "sl")
                    setIsMobileOpen(false)
                  }}
                  className="px-4 py-2.5 rounded-xl bg-shere-red text-white font-black text-sm tracking-wider shadow-lg shadow-shere-red/25 active:scale-95 transition-transform"
                >
                  {langSucelja === "sl" ? "ENGLISH" : "SLOVENŠČINA"}
                </button>
              </div>

              <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  📍
                </div>
                <p>{lokal?.adresa}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
