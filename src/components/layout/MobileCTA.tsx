import { useState } from "react"
import { Phone, UtensilsCrossed, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "../../providers/LanguageProvider"
import type { Category } from "../../data"

const CATEGORY_DETAILS: Record<Category, { emoji: string, bg: string, desc: { sl: string, en: string } }> = {
  Kebab: { emoji: "🌯", bg: "from-orange-500/20 to-amber-500/10", desc: { sl: "Sočni donerji in jufke", en: "Juicy doners and yufkas" } },
  Pice: { emoji: "🍕", bg: "from-red-500/20 to-orange-500/10", desc: { sl: "Hrustljave italijanske pice", en: "Crispy Italian pizzas" } },
  Burgeri: { emoji: "🍔", bg: "from-amber-500/20 to-yellow-500/10", desc: { sl: "Goveji in piščančji burgerji", en: "Beef and chicken burgers" } },
  Falafel: { emoji: "🧆", bg: "from-green-500/20 to-emerald-500/10", desc: { sl: "Veganske falafel kroglice", en: "Vegan falafel balls" } },
  Meni: { emoji: "🍱", bg: "from-purple-500/20 to-indigo-500/10", desc: { sl: "Izgodni študentski meniji", en: "Great student menu deals" } },
  Ostalo: { emoji: "🍲", bg: "from-blue-500/20 to-cyan-500/10", desc: { sl: "Čevapčiči in ostale jedi", en: "Cevapcici and other meals" } },
  Dodatki: { emoji: "🍟", bg: "from-yellow-500/20 to-amber-500/10", desc: { sl: "Ocvrt krompirček in omake", en: "French fries and sauces" } },
  Pijača: { emoji: "🥤", bg: "from-cyan-500/20 to-blue-500/10", desc: { sl: "Osvežilni hladni napitki", en: "Refreshing cold drinks" } }
}

const CATEGORIES: Category[] = ['Kebab', 'Pice', 'Burgeri', 'Falafel', 'Meni', 'Ostalo', 'Dodatki', 'Pijača']

export function MobileCTA() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const scrollToCategory = (cat: Category) => {
    setIsOpen(false)
    const menuSection = document.getElementById("menu")
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth" })
      // Dispatch custom event to select the category in Menu.tsx
      window.dispatchEvent(new CustomEvent("set-menu-category", { detail: cat }))
    }
  }

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 w-full z-40 pb-4 px-4 bg-gradient-to-t from-background via-background/90 to-transparent pt-12 pointer-events-none">
        <div className="flex gap-4 pointer-events-auto">
          <a 
            href="tel:+38669444812"
            className="flex-1 bg-zinc-900 dark:bg-zinc-800 text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg border border-white/5 active:scale-95 transition-transform"
          >
            <Phone size={20} />
            {t("Pokliči", "Call")}
          </a>
          <button 
            onClick={() => setIsOpen(true)}
            className="flex-1 bg-shere-red text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-[0_10px_20px_-10px_rgba(230,57,70,0.6)] active:scale-95 transition-transform"
          >
            <UtensilsCrossed size={20} />
            {t("Meni", "Menu")}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="md:hidden fixed inset-x-0 bottom-0 z-[100] h-[85vh] bg-background/95 backdrop-blur-xl border-t border-white/10 rounded-t-[3rem] flex flex-col shadow-[0_-15px_40px_rgba(0,0,0,0.5)]"
          >
            {/* Header / Drag Bar */}
            <div className="pt-3 pb-5 flex flex-col items-center border-b border-white/5">
              <div className="w-12 h-1.5 bg-zinc-700 rounded-full mb-4"></div>
              <div className="px-6 w-full flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black font-poppins">{t("Izberi Kategorijo", "Select Category")}</h2>
                  <p className="text-xs text-muted-foreground">{t("Skoči direktno na želeno hrano", "Jump directly to your choice")}</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 bg-muted/80 rounded-full flex items-center justify-center text-foreground hover:bg-muted active:scale-90 transition-all"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>
            </div>
            
            {/* Categories List */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 gap-3.5 pb-20">
              {CATEGORIES.map(cat => {
                const details = CATEGORY_DETAILS[cat]
                return (
                  <button
                    key={cat}
                    onClick={() => scrollToCategory(cat)}
                    className={`w-full py-4.5 px-5 rounded-[1.8rem] bg-gradient-to-r ${details.bg} border border-white/5 dark:border-white/10 text-left font-black text-lg shadow-md active:scale-[0.98] transition-all flex items-center gap-4 relative overflow-hidden group`}
                  >
                    {/* Big background blur emoji details */}
                    <div className="w-14 h-14 rounded-2xl bg-black/30 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                      {details.emoji}
                    </div>
                    <div className="flex-1">
                      <span className="block text-foreground text-lg">{cat}</span>
                      <span className="block text-xs font-semibold text-muted-foreground mt-0.5">
                        {t(details.desc.sl, details.desc.en)}
                      </span>
                    </div>
                    <span className="text-shere-red text-xl font-bold bg-shere-red/10 w-9 h-9 rounded-full flex items-center justify-center shadow-inner group-active:translate-x-1 transition-transform">→</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
