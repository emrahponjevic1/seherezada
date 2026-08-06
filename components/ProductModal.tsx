"use client"

import { useEffect } from "react"
import type { MouseEvent } from "react"
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion"
import { X, Phone, Info } from "lucide-react"

import type { Lang, Lokal, MenuStavka } from "@/lib/domain"
import { formatCijena, t, tList } from "@/lib/i18n"
import { SlikaJela } from "@/components/stanja/SlikaJela"

import { OznakeJela } from "./sekcije/OznakeJela"

interface ProductModalProps {
  stavka: MenuStavka | null
  lokal: Lokal
  lang: Lang
  onClose: () => void
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
}

/** Alergeni se u podacima čuvaju kao slugovi — ovdje dobijaju ime. */
const ALERGEN: Record<string, { sl: string; en: string }> = {
  gluten: { sl: "Gluten", en: "Gluten" },
  laktoza: { sl: "Laktoza", en: "Lactose" },
  sezam: { sl: "Sezam", en: "Sesame" },
  orasasti: { sl: "Oreščki", en: "Nuts" },
  jaja: { sl: "Jajca", en: "Eggs" },
  riba: { sl: "Ribe", en: "Fish" },
  soja: { sl: "Soja", en: "Soy" },
  gorusica: { sl: "Gorčica", en: "Mustard" },
}

export function ProductModal({
  stavka,
  lokal,
  lang,
  onClose,
}: ProductModalProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"])

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  useEffect(() => {
    document.body.style.overflow = stavka ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [stavka])

  if (!stavka) return null

  const { jelo } = stavka
  const naziv = t(jelo.naziv, lang)
  const opisSlike = t(jelo.slikaAlt, lang) || naziv
  const sastojci = tList(jelo.sastojci, lang)

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 lg:p-12 perspective-[2000px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          layoutId={`card-container-${jelo.slug}`}
          className="relative w-full h-full lg:h-auto lg:max-h-[90vh] lg:max-w-5xl rounded-none lg:rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl z-10 bg-background/40 border border-white/5"
        >
          <button
            onClick={onClose}
            aria-label={t({ sl: "Zapri", en: "Close" }, lang)}
            className="absolute top-4 right-4 z-50 p-3 bg-black/40 backdrop-blur-xl text-white rounded-full lg:bg-white/10 lg:text-white lg:hover:bg-red-500 transition-all hover:scale-110 active:scale-95 border border-white/10"
          >
            <X size={24} strokeWidth={3} />
          </button>

          <div
            className="w-full flex-shrink-0 lg:h-auto lg:w-1/2 relative flex items-center justify-center py-12 px-6 lg:p-8 bg-zinc-950 overflow-visible lg:overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <SlikaJela
                slikaUrl={jelo.slikaUrl}
                alt=""
                width={800}
                height={800}
                className="w-full h-full object-cover blur-[80px] opacity-60 scale-150 saturate-200"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/95 lg:bg-gradient-to-r lg:from-transparent lg:to-background/95 z-10"></div>
            </div>

            <motion.div
              layoutId={`image-${jelo.slug}`}
              className="w-56 h-56 lg:w-[26rem] lg:h-[26rem] relative z-20 perspective-[1000px] cursor-grab active:cursor-grabbing"
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            >
              <SlikaJela
                slikaUrl={jelo.slikaUrl}
                alt={opisSlike}
                width={416}
                height={416}
                className="w-full h-full object-cover rounded-full shadow-[0_30px_60px_rgba(0,0,0,0.6)] border-[8px] border-white/10"
              />

              <div
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"
                style={{ transform: "translateZ(51px)" }}
              ></div>

              <motion.div
                initial={{ scale: 0, rotate: -45, opacity: 0 }}
                animate={{ scale: 1, rotate: -15, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                  delay: 0.2,
                }}
                className="absolute -top-6 -left-1 lg:-top-12 lg:left-2 z-50 bg-gradient-to-br from-orange-400 to-shere-red text-white font-black text-2xl lg:text-5xl px-5 py-2 lg:px-9 lg:py-4 rounded-3xl shadow-[0_15px_30px_rgba(230,57,70,0.6)] border-2 border-white/20"
              >
                {formatCijena(stavka.cijena, lang)}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none"></div>
              </motion.div>
            </motion.div>
          </div>

          <div className="flex-1 flex flex-col p-6 lg:p-12 overflow-y-auto hide-scrollbar bg-background/95 lg:bg-background/80 backdrop-blur-2xl relative z-20 mt-0 shadow-none border-t border-white/5">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="flex-1 flex flex-col max-w-lg mx-auto lg:mx-0 w-full"
            >
              <motion.div variants={staggerItem} className="mb-6 pt-2 lg:pt-0">
                <motion.h2
                  layoutId={`title-${jelo.slug}`}
                  className="text-4xl lg:text-5xl font-black font-poppins mb-4 tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent"
                >
                  {naziv}
                </motion.h2>

                <div className="flex flex-wrap gap-2">
                  {stavka.izdvojeno && (
                    <span className="bg-orange-500/10 text-orange-500 border border-orange-500/20 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                      🔥 {t({ sl: "Priljubljeno", en: "Popular" }, lang)}
                    </span>
                  )}
                  <OznakeJela jelo={jelo} lang={lang} />
                </div>
              </motion.div>

              <motion.div
                variants={staggerItem}
                className="mb-8 bg-muted/30 p-4 lg:p-5 rounded-2xl border border-white/5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Info size={16} className="text-shere-red" />
                  <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">
                    {t({ sl: "Opis jedi", en: "Dish description" }, lang)}
                  </h4>
                </div>
                <p className="text-lg lg:text-xl leading-relaxed text-foreground/90 font-medium">
                  {t(jelo.opis, lang)}
                </p>
              </motion.div>

              {sastojci.length > 0 && (
                <motion.div variants={staggerItem} className="mb-8">
                  <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground mb-4 flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-border"></span>
                    {t({ sl: "Sestavine", en: "Ingredients" }, lang)}
                    <span className="flex-1 h-[1px] bg-border"></span>
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {sastojci.map((ing) => (
                      <span
                        key={ing}
                        className="bg-secondary/60 hover:bg-secondary border border-border px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm text-foreground/80 hover:text-foreground cursor-default"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {jelo.alergeni.length > 0 && (
                <motion.div variants={staggerItem} className="mb-8">
                  <h4 className="font-bold uppercase tracking-widest text-xs text-red-500/80 mb-4 flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-red-500/10"></span>
                    ⚠️ {t({ sl: "Alergeni", en: "Allergens" }, lang)}
                    <span className="flex-1 h-[1px] bg-red-500/10"></span>
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {jelo.alergeni.map((a) => (
                      <span
                        key={a}
                        className="bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-default"
                      >
                        {ALERGEN[a] ? t(ALERGEN[a], lang) : a}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="mt-auto"></div>

              {/* Kontakti i dostava — podaci TOG lokala, ne ukucani */}
              <motion.div variants={staggerItem} className="pt-6 mt-4">
                <a
                  href={`tel:${lokal.telefon.replace(/\s/g, "")}`}
                  className="group relative overflow-hidden w-full bg-gradient-to-r from-shere-red to-orange-500 text-white py-4 lg:py-5 rounded-2xl font-black text-lg lg:text-xl shadow-[0_15px_30px_-5px_rgba(230,57,70,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 border border-shere-red/50"
                >
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.5,
                      ease: "linear",
                      repeatDelay: 1,
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2 pointer-events-none skew-x-12"
                  />
                  <Phone
                    size={22}
                    className="group-hover:rotate-12 transition-transform"
                  />
                  {t({ sl: "Pokliči in naroči", en: "Call & order" }, lang)}
                </a>

                {(lokal.woltUrl || lokal.glovoUrl) && (
                  <div className="text-center mt-6">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-3">
                      {t(
                        {
                          sl: "Ali pa naroči prek dostave",
                          en: "Or order via delivery",
                        },
                        lang,
                      )}
                    </p>
                    <div className="flex gap-3 justify-center">
                      {lokal.woltUrl && (
                        <a
                          href={lokal.woltUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-black bg-secondary/50 hover:bg-secondary border border-border px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg text-foreground/80 hover:text-foreground w-full lg:w-auto"
                        >
                          Wolt
                        </a>
                      )}
                      {lokal.glovoUrl && (
                        <a
                          href={lokal.glovoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-black bg-secondary/50 hover:bg-secondary border border-border px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg text-foreground/80 hover:text-foreground w-full lg:w-auto"
                        >
                          Glovo
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
