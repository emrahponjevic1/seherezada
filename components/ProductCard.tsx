"use client"

import { useState } from "react"
import type { MouseEvent } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ArrowRight } from "lucide-react"

import type { Lang, MenuStavka } from "@/lib/domain"
import { formatCijena, t, ui } from "@/lib/i18n"
import { SlikaJela } from "@/components/stanja/SlikaJela"

import { OznakeJela } from "./sekcije/OznakeJela"

interface ProductCardProps {
  stavka: MenuStavka
  lang: Lang
  onClick: (stavka: MenuStavka) => void
  context?: string
  /** Prve četiri kartice se učitavaju odmah, ostale tek kad zatrebaju. */
  odmah?: boolean
}

export function ProductCard({
  stavka,
  lang,
  onClick,
  context = "default",
  odmah = false,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { jelo } = stavka

  const naziv = t(jelo.naziv, lang)
  const opis = t(jelo.opis, lang)
  const cijena = formatCijena(stavka.cijena, lang)
  const opisSlike = t(jelo.slikaAlt, lang) || naziv
  const ucitavanje = odmah ? "eager" : "lazy"

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <>
      {/* 📱 Mobitel: vodoravni red */}
      <div
        onClick={() => onClick(stavka)}
        className="block md:hidden w-full relative cursor-pointer"
      >
        <div className="flex items-center gap-4 bg-card dark:bg-zinc-900 border border-white/5 dark:border-white/10 p-4 rounded-[2.2rem] hover:border-shere-red/30 transition-all active:scale-[0.98] duration-300 shadow-md">
          <div className="w-24 h-24 rounded-[1.75rem] overflow-hidden shrink-0 border border-white/10 bg-zinc-800 flex items-center justify-center relative shadow-lg">
            <SlikaJela
              slikaUrl={jelo.slikaUrl}
              alt={opisSlike}
              width={96}
              height={96}
              loading={ucitavanje}
              className="w-full h-full object-cover"
            />
            {stavka.izdvojeno && (
              <div className="absolute top-1 left-1 bg-shere-red text-[8px] font-black uppercase text-white px-2 py-0.5 rounded-lg shadow-md">
                HOT
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center pr-8 space-y-1">
            <h3 className="text-xl font-black font-poppins text-foreground line-clamp-2 leading-tight">
              {naziv}
            </h3>

            <p className="text-[17px] text-muted-foreground line-clamp-2 leading-relaxed font-medium">
              {opis}
            </p>

            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="font-extrabold text-shere-red text-base bg-shere-red/10 px-2 py-0.5 rounded-lg">
                {cijena}
              </span>
              <OznakeJela jelo={jelo} lang={lang} velicina="mala" najvise={2} />
            </div>
          </div>

          <div className="absolute right-4 bottom-4 w-9 h-9 bg-muted/80 text-foreground hover:bg-shere-red hover:text-white rounded-xl flex items-center justify-center border border-white/5 active:scale-90 transition-all">
            <ArrowRight size={16} strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* 🖥️ Desktop: 3D kartica */}
      <motion.div
        layoutId={`card-container-${jelo.slug}-desktop-${context}`}
        className="hidden md:block relative w-full h-[435px] mt-16 cursor-pointer group perspective-[1200px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onClick(stavka)}
        style={{ zIndex: isHovered ? 30 : 1 }}
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="w-full h-full relative"
        >
          <motion.div
            className={`absolute inset-x-0 bottom-0 h-[385px] rounded-[2.5rem] p-6 flex flex-col justify-between
                       shadow-2xl border backdrop-blur-md transition-all duration-500 pt-[78px]
                       ${
                         isHovered
                           ? "bg-card/95 dark:bg-zinc-900/95 border-shere-red/50 shadow-[0_30px_60px_-15px_rgba(230,57,70,0.3)]"
                           : "bg-card/45 dark:bg-zinc-900/40 border-white/5 dark:border-white/10"
                       }`}
            style={{ transform: "translateZ(0px)" }}
          >
            <div className="absolute top-6 left-5 sm:left-6 z-20">
              <span className="font-black text-shere-red text-lg sm:text-xl bg-shere-red/10 px-3.5 py-1.5 rounded-2xl border border-shere-red/10 shadow-sm backdrop-blur-md">
                {cijena}
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="h-[62px] sm:h-[78px] flex flex-col justify-end pb-1">
                <h3 className="text-2xl sm:text-3xl font-black font-poppins line-clamp-2 text-foreground leading-[1.15] tracking-tight">
                  {naziv}
                </h3>
              </div>

              <p className="text-lg text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                {opis}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              <OznakeJela jelo={jelo} lang={lang} />
            </div>

            <button
              className={`w-full py-3.5 rounded-2xl font-extrabold text-lg transition-all duration-300 active:scale-95 mt-4 border border-white/5
              ${
                isHovered
                  ? "bg-gradient-to-r from-shere-red to-red-500 text-white shadow-[0_8px_20px_rgba(230,57,70,0.45)] border-transparent"
                  : "bg-muted text-foreground hover:bg-shere-red hover:text-white"
              }`}
            >
              {ui("akcija.prikaziPodrobnosti", lang)}
            </button>
          </motion.div>

          <motion.div
            className="absolute -top-12 left-1/2 -translate-x-1/2 w-[190px] h-[190px] z-10 drop-shadow-[0_25px_30px_rgba(0,0,0,0.55)] pointer-events-none"
            animate={{
              y: isHovered ? -18 : 0,
              scale: isHovered ? 1.08 : 1,
              rotate: isHovered ? 6 : 0,
            }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            style={{ transform: "translateZ(80px)" }}
          >
            <div className="w-full h-full relative">
              <SlikaJela
                slikaUrl={jelo.slikaUrl}
                alt={opisSlike}
                width={190}
                height={190}
                loading={ucitavanje}
                className={`w-full h-full object-cover rounded-full border-[6px] transition-all duration-500
                  ${isHovered ? "border-shere-red shadow-[0_0_30px_rgba(230,57,70,0.4)]" : "border-background"}`}
              />

              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.8 }}
              />

              {stavka.izdvojeno && (
                <span className="absolute top-2 right-2 bg-shere-red text-white text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full shadow-lg border border-white/10 animate-float-slow">
                  HOT
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  )
}
