"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Phone, UtensilsCrossed, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { t as prevedi, ui } from "@/lib/i18n"
import type { Kategorija } from "@/lib/domain"
import { href, type Route, type SeoPage } from "@/lib/route"
import { izPutanje, trenutniLokal, type OkvirPodaci } from "./okvir"

/** Izgled kartice po kategoriji — vezan za slug, ne za ukucanu uniju. */
const IZGLED: Record<string, { emoji: string; bg: string }> = {
  kebab: { emoji: "🌯", bg: "from-orange-500/20 to-amber-500/10" },
  pice: { emoji: "🍕", bg: "from-red-500/20 to-orange-500/10" },
  burgeri: { emoji: "🍔", bg: "from-amber-500/20 to-yellow-500/10" },
  falafel: { emoji: "🧆", bg: "from-green-500/20 to-emerald-500/10" },
  meniji: { emoji: "🍱", bg: "from-purple-500/20 to-indigo-500/10" },
  ostalo: { emoji: "🍲", bg: "from-blue-500/20 to-cyan-500/10" },
  dodatki: { emoji: "🍟", bg: "from-yellow-500/20 to-amber-500/10" },
  pijaca: { emoji: "🥤", bg: "from-cyan-500/20 to-blue-500/10" },
}

/** Kategorije koje imaju svoju SEO stranicu; ostale vode na cijeli meni. */
const SEO_ZA_KATEGORIJU: Record<string, SeoPage> = {
  kebab: "kebab-ljubljana",
  pice: "pizza-ljubljana",
  burgeri: "burger-ljubljana",
  falafel: "falafel-ljubljana",
  meniji: "studentski-meni-ljubljana",
}

export function MobileCTAKlijent({
  lokali,
  glavniSlug,
  kategorije,
}: OkvirPodaci & { kategorije: Kategorija[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHeroActionsVisible, setIsHeroActionsVisible] = useState(true)
  const [isNavOpen, setIsNavOpen] = useState(false)

  const pathname = usePathname()
  const { lang, lokalSlug } = izPutanje(pathname, { lokali, glavniSlug })
  const lokal = trenutniLokal(lokali, lokalSlug, glavniSlug)

  const adresa = (r: Route) => href(r, glavniSlug)
  const meniAdresa = adresa({
    kind: "lokal-page",
    lang,
    lokal: lokalSlug,
    page: "meni",
  })

  useEffect(() => {
    const handleNavToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ isOpen: boolean }>
      setIsNavOpen(customEvent.detail.isOpen)
    }
    window.addEventListener("mobileNavToggle", handleNavToggle)
    return () => window.removeEventListener("mobileNavToggle", handleNavToggle)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const heroActions = document.getElementById("hero-actions")
      if (!heroActions) {
        setIsHeroActionsVisible(false)
        return
      }

      const observer = new IntersectionObserver(
        ([entry]) => setIsHeroActionsVisible(entry.isIntersecting),
        { threshold: 0, rootMargin: "0px 0px -20px 0px" },
      )
      observer.observe(heroActions)

      const rect = heroActions.getBoundingClientRect()
      setIsHeroActionsVisible(rect.top < window.innerHeight && rect.bottom >= 0)

      return () => observer.disconnect()
    }, 150)

    return () => clearTimeout(timer)
  }, [])

  const adresaKategorije = (slug: string) => {
    const seo = SEO_ZA_KATEGORIJU[slug]
    return seo ? adresa({ kind: "seo", lang, page: seo }) : meniAdresa
  }

  return (
    <>
      <AnimatePresence>
        {!isHeroActionsVisible && !isNavOpen && (
          <div className="md:hidden fixed bottom-0 left-0 w-full z-40 pointer-events-none">
            <motion.div
              key="mobile-cta-bar"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full pb-[calc(1rem+env(safe-area-inset-bottom))] px-4 bg-gradient-to-t from-background via-background/90 to-transparent pt-12"
            >
              <div className="flex gap-4 pointer-events-auto">
                {/* Telefon trenutnog lokala, ne ukucan broj */}
                <a
                  href={`tel:${(lokal?.telefon ?? "").replace(/\s/g, "")}`}
                  className="flex-1 bg-zinc-900 dark:bg-zinc-800 text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg border border-white/5 active:scale-95 transition-transform"
                >
                  <Phone size={20} />
                  {ui("akcija.poklici", lang)}
                </a>
                <button
                  onClick={() => setIsOpen(true)}
                  className="flex-1 bg-shere-red text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-[0_10px_20px_-10px_rgba(230,57,70,0.6)] active:scale-95 transition-transform"
                >
                  <UtensilsCrossed size={20} />
                  {ui("nav.meni", lang)}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="md:hidden fixed inset-x-0 bottom-0 z-[100] h-[85vh] bg-background/95 backdrop-blur-xl border-t border-white/10 rounded-t-[3rem] flex flex-col shadow-[0_-15px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="pt-3 pb-5 flex flex-col items-center border-b border-white/5">
              <div className="w-12 h-1.5 bg-zinc-700 rounded-full mb-4"></div>
              <div className="px-6 w-full flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black font-poppins">
                    {ui("cta.izberiKategorijo", lang)}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {ui("cta.skociDirektno", lang)}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 bg-muted/80 rounded-full flex items-center justify-center text-foreground hover:bg-muted active:scale-90 transition-all"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 gap-3.5 pb-20">
              {kategorije.map((kat) => {
                const izgled = IZGLED[kat.slug] ?? {
                  emoji: "🍽️",
                  bg: "from-zinc-500/20 to-zinc-500/10",
                }
                return (
                  <Link
                    key={kat.id}
                    href={adresaKategorije(kat.slug)}
                    onClick={() => setIsOpen(false)}
                    className={`w-full py-4.5 px-5 rounded-[1.8rem] bg-gradient-to-r ${izgled.bg} border border-white/5 dark:border-white/10 text-start font-black text-lg shadow-md active:scale-[0.98] transition-all flex items-center gap-4 relative overflow-hidden group`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-black/30 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                      {izgled.emoji}
                    </div>
                    <div className="flex-1">
                      <span className="block text-foreground text-lg">
                        {prevedi(kat.naziv, lang)}
                      </span>
                      <span className="block text-xs font-semibold text-muted-foreground mt-0.5">
                        {prevedi(kat.opis, lang)}
                      </span>
                    </div>
                    <span className="text-shere-red text-xl font-bold bg-shere-red/10 w-9 h-9 rounded-full flex items-center justify-center shadow-inner group-active:translate-x-1 transition-transform">
                      →
                    </span>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
