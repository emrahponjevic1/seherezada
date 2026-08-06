"use client"

import { useSyncExternalStore } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"
import { Flame, Star } from "lucide-react"

import { useLanguage } from "@/providers/LanguageProvider"

/**
 * Tanjir sa značkama — ostaje klijentski U CJELINI, jer je stvarno
 * interaktivan: naginje se za mišem i značke kruže u 3D prostoru.
 *
 * Ovdje nema teksta koji bi morao biti u serverskom HTML-u — same značke
 * su ukras, a sav sadržaj heroja stoji u serverskoj komponenti.
 */

/**
 * Mobilni raspored se čita kroz matchMedia, ne mjerenjem `window.innerWidth`.
 * Animacije se razlikuju toliko da ih CSS ne može izraziti; sve ostalo
 * rješavaju `lg:` prefiksi. `useSyncExternalStore` čuva od razmimoilaženja
 * pri hidraciji.
 */
const UPIT = "(max-width: 1023px)"

function pretplati(javi: () => void) {
  const mq = window.matchMedia(UPIT)
  mq.addEventListener("change", javi)
  return () => mq.removeEventListener("change", javi)
}

function useJeMobilni() {
  return useSyncExternalStore(
    pretplati,
    () => window.matchMedia(UPIT).matches,
    () => false,
  )
}

export function HeroTanjir() {
  const { t } = useLanguage()
  const jeMobilni = useJeMobilni()

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const tiltXSpring = useSpring(mouseY, { stiffness: 120, damping: 25 })
  const tiltYSpring = useSpring(mouseX, { stiffness: 120, damping: 25 })

  const rotateX = useTransform(tiltXSpring, [-300, 300], [15, -15])
  const rotateY = useTransform(tiltYSpring, [-300, 300], [-15, 15])

  const naMis = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }

  const naIzlaz = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div
      onMouseMove={naMis}
      onMouseLeave={naIzlaz}
      className="lg:col-span-5 flex justify-center items-center relative h-[350px] sm:h-[450px] lg:h-[600px] w-full"
    >
      <div className="absolute w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] rounded-full bg-shere-red/20 blur-[80px] z-0 animate-pulse-subtle"></div>

      <motion.div
        style={jeMobilni ? {} : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative z-10 w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        <div
          style={jeMobilni ? {} : { transform: "translateZ(30px)" }}
          className="relative z-10 w-[260px] h-[260px] sm:w-[370px] sm:h-[370px] rounded-full p-2 bg-gradient-to-tr from-shere-red to-orange-500 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border-[6px] border-white/10 dark:border-white/5"
        >
          <motion.img
            src="/rotisserie_hero.webp"
            alt="Šeherezada premium Turkish Doner Plate"
            width={370}
            height={370}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="w-full h-full object-cover rounded-full shadow-inner"
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/5 to-transparent pointer-events-none hidden md:block mix-blend-screen opacity-60"></div>
        </div>

        {/* 1. Ljubljana #1 */}
        <motion.div
          animate={jeMobilni ? { opacity: [0.35, 1, 0.35], rotate: [-5, 5, -5], y: [0, -15, 0] } : { y: [0, 6, 0], z: [-20, 120, -20], scale: [0.95, 1.05, 0.95], filter: ["blur(1px)", "blur(0px)", "blur(1px)"], zIndex: [5, 100, 5] }}
          style={jeMobilni ? {} : { transformStyle: "preserve-3d" }}
          transition={jeMobilni ? { repeat: Infinity, duration: 2.0, delay: 0.1, ease: "easeInOut" } : { repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className={`absolute z-20 -top-10 left-[20%] sm:left-[25%] ${jeMobilni ? "bg-black/40" : "bg-white/10 backdrop-blur-md"} px-4 py-2 rounded-2xl border border-white/10 text-white/80 flex items-center gap-2 shadow-md`}
        >
          <span className="text-xs sm:text-sm font-black tracking-wide">🏆 {t("Ljubljana #1", "Ljubljana #1")}</span>
        </motion.div>

        {/* 2. Premium */}
        <motion.div
          animate={jeMobilni ? { opacity: [0.35, 1, 0.35], rotate: [6, -6, 6], y: [-10, 5, -10] } : { y: [0, 8, 0], rotate: [0, -5, 0], z: [-60, 110, -60], scale: [0.9, 1.05, 0.9], filter: ["blur(2px)", "blur(0px)", "blur(2px)"], zIndex: [2, 100, 2] }}
          style={jeMobilni ? {} : { transformStyle: "preserve-3d" }}
          transition={jeMobilni ? { repeat: Infinity, duration: 2.5, delay: 0.5, ease: "easeInOut" } : { repeat: Infinity, duration: 7.5, ease: "easeInOut", delay: 0.3 }}
          className={`absolute z-20 -top-8 right-[10%] sm:right-[15%] ${jeMobilni ? "bg-black/40" : "bg-white/10 backdrop-blur-md"} px-3 sm:px-4 py-2 rounded-2xl border border-white/5 text-white/55 flex items-center gap-1.5 shadow-md`}
        >
          <span className="text-xs sm:text-sm font-black tracking-wide">👑 {t("Premium", "Premium")}</span>
        </motion.div>

        {/* 3. Domač kruh */}
        <motion.div
          animate={jeMobilni ? { opacity: [0.35, 1, 0.35], rotate: [-5.5, 5.5, -5.5], y: [5, -12, 5] } : { y: [0, -10, 0], x: [0, 5, 0], z: [-40, 130, -40], scale: [0.93, 1.06, 0.93], filter: ["blur(1.5px)", "blur(0px)", "blur(1.5px)"], zIndex: [5, 100, 5] }}
          style={jeMobilni ? {} : { transformStyle: "preserve-3d" }}
          transition={jeMobilni ? { repeat: Infinity, duration: 2.2, delay: 0.2, ease: "easeInOut" } : { repeat: Infinity, duration: 6.8, ease: "easeInOut", delay: 0.7 }}
          className={`absolute z-20 bottom-1/4 -left-12 sm:-left-16 ${jeMobilni ? "bg-black/40" : "bg-white/10 backdrop-blur-md"} px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-white/10 text-white/70 flex items-center gap-2 shadow-lg`}
        >
          <span className="text-xs sm:text-sm font-black tracking-wide">🥖 {t("Domač kruh", "Homemade Bread")}</span>
        </motion.div>

        {/* 4. 100% Pikantno */}
        <motion.div
          animate={jeMobilni ? { opacity: [0.35, 1, 0.35], rotate: [5, -5, 5], y: [-8, 8, -8] } : { y: [0, 8, 0], rotate: [0, -10, 0], z: [100, -30, 100], scale: [1.05, 0.93, 1.05], filter: ["blur(0px)", "blur(1.5px)", "blur(0px)"], zIndex: [100, 5, 100] }}
          style={jeMobilni ? {} : { transformStyle: "preserve-3d" }}
          transition={jeMobilni ? { repeat: Infinity, duration: 2.8, delay: 0.8, ease: "easeInOut" } : { repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.5 }}
          className={`absolute z-20 top-4 -left-4 sm:-left-8 ${jeMobilni ? "bg-black/40" : "bg-white/10 backdrop-blur-md"} px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-white/10 text-white/90 flex items-center gap-2 shadow-lg`}
        >
          <Flame size={20} className="text-shere-red fill-current drop-shadow-[0_0_10px_rgba(230,57,70,1)]" />
          <span className="text-sm font-black tracking-wide">{t("100% Pikantno", "100% Spicy")}</span>
        </motion.div>

        {/* 5. Halal meso */}
        <motion.div
          animate={jeMobilni ? { opacity: [0.35, 1, 0.35], rotate: [5, -5, 5], y: [0, -10, 0] } : { y: [0, -8, 0], rotate: [0, 10, 0], z: [120, -50, 120], scale: [1.07, 0.9, 1.07], filter: ["blur(0px)", "blur(2px)", "blur(0px)"], zIndex: [100, 2, 100] }}
          style={jeMobilni ? {} : { transformStyle: "preserve-3d" }}
          transition={jeMobilni ? { repeat: Infinity, duration: 2.4, delay: 0.3, ease: "easeInOut" } : { repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1.0 }}
          className={`absolute z-20 bottom-4 -right-4 sm:-right-8 ${jeMobilni ? "bg-black/40" : "bg-white/10 backdrop-blur-md"} px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-white/10 text-white/90 flex items-center gap-2 shadow-lg`}
        >
          <Star size={20} className="text-shere-gold fill-current drop-shadow-[0_0_10px_rgba(251,191,36,1)]" />
          <span className="text-sm font-black tracking-wide">{t("Halal meso", "Halal Meat")}</span>
        </motion.div>

        {/* 6. 100% Sveže */}
        <motion.div
          animate={jeMobilni ? { opacity: [0.35, 1, 0.35], rotate: [5, -5, 5], y: [-15, 0, -15] } : { x: [0, 6, 0], y: [0, -6, 0], z: [110, -40, 110], scale: [1.06, 0.92, 1.06], filter: ["blur(0px)", "blur(1.8px)", "blur(0px)"], zIndex: [100, 5, 100] }}
          style={jeMobilni ? {} : { transformStyle: "preserve-3d" }}
          transition={jeMobilni ? { repeat: Infinity, duration: 2.6, delay: 0.9, ease: "easeInOut" } : { repeat: Infinity, duration: 6.2, ease: "easeInOut", delay: 1.5 }}
          className={`absolute z-20 top-1/3 -right-8 sm:-right-12 ${jeMobilni ? "bg-black/40" : "bg-white/10 backdrop-blur-md"} px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-white/10 text-white/90 flex items-center gap-2 shadow-lg`}
        >
          <span className="text-sm font-black tracking-wide drop-shadow-md">🌯 {t("100% Sveže", "100% Fresh")}</span>
        </motion.div>

        {/* 7. Hitra dostava */}
        <motion.div
          animate={jeMobilni ? { opacity: [0.35, 1, 0.35], rotate: [5, -5, 5], y: [8, -8, 8] } : { y: [0, -12, 0], rotate: [0, 5, 0], z: [130, -20, 130], scale: [1.08, 0.95, 1.08], filter: ["blur(0px)", "blur(1.2px)", "blur(0px)"], zIndex: [100, 5, 100] }}
          style={jeMobilni ? {} : { transformStyle: "preserve-3d" }}
          transition={jeMobilni ? { repeat: Infinity, duration: 2.1, delay: 0.6, ease: "easeInOut" } : { repeat: Infinity, duration: 5.8, ease: "easeInOut", delay: 0.2 }}
          className={`absolute z-20 -bottom-5 left-[10%] sm:left-[15%] ${jeMobilni ? "bg-black/40" : "bg-white/10 backdrop-blur-md"} px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-white/10 text-white/90 flex items-center gap-2 shadow-lg`}
        >
          <span className="text-xs sm:text-sm font-black tracking-wide">⚡ {t("Hitra dostava", "Fast Delivery")}</span>
        </motion.div>
      </motion.div>
    </div>
  )
}
