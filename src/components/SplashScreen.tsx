import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flame, Utensils, Pizza } from "lucide-react"
import { useLanguage } from "../providers/LanguageProvider"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const { t } = useLanguage()
  const [progress, setProgress] = useState(0)
  const [textIndex, setTextIndex] = useState(0)

  const loadingTexts = [
    t("Prižigamo ogenj...", "Lighting the fire..."),
    t("Pečemo meso...", "Grilling the meat..."),
    t("Pripravljamo mizo...", "Preparing the table..."),
    t("Skoraj končano...", "Almost ready...")
  ]

  useEffect(() => {
    // Lock body scrolling while splash screen is active
    document.body.style.overflow = "hidden"

    // 1. Text cycle interval
    const textInterval = setInterval(() => {
      setTextIndex(prev => (prev + 1) % loadingTexts.length)
    }, 800)

    // 2. Minimum loading time & Image Preload logic
    const MIN_LOAD_TIME = 2500 // 2.5 seconds minimum
    
    let isImageLoaded = false
    let isMinTimeElapsed = false

    const checkCompletion = () => {
      if (isImageLoaded && isMinTimeElapsed) {
        setProgress(100)
        setTimeout(() => {
          document.body.style.overflow = "unset"
          onComplete()
        }, 400) // slight delay after reaching 100%
      }
    }

    // Preload heavy hero image
    const img = new Image()
    img.src = "/rotisserie_hero.png"
    img.onload = () => {
      isImageLoaded = true
      checkCompletion()
    }
    img.onerror = () => {
      // If it fails, we still want to let them in eventually
      isImageLoaded = true 
      checkCompletion()
    }

    // Minimum time timer
    const minTimer = setTimeout(() => {
      isMinTimeElapsed = true
      checkCompletion()
    }, MIN_LOAD_TIME)

    // Progress bar fake animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev // hold at 90% until fully loaded
        return prev + Math.random() * 15
      })
    }, 200)

    return () => {
      document.body.style.overflow = "unset"
      clearInterval(textInterval)
      clearInterval(progressInterval)
      clearTimeout(minTimer)
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[999] bg-zinc-950 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-shere-red/20 blur-[100px] rounded-full animate-pulse-subtle pointer-events-none"></div>

      {/* Main Icon Container */}
      <div className="relative mb-8">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="relative z-10 w-24 h-24 bg-shere-red/10 rounded-3xl border border-shere-red/20 flex items-center justify-center backdrop-blur-md shadow-[0_0_40px_rgba(230,57,70,0.3)]"
        >
          <Flame size={48} className="text-shere-red fill-shere-red/20 drop-shadow-[0_0_15px_rgba(230,57,70,0.6)]" />
        </motion.div>
        
        {/* Orbiting elements */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="absolute inset-[-30px] z-0 rounded-full border border-dashed border-white/5"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 p-2 rounded-full border border-white/10 shadow-lg">
            <Utensils size={14} className="text-zinc-400" />
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-zinc-900 p-2 rounded-full border border-white/10 shadow-lg">
            <Pizza size={14} className="text-zinc-400" />
          </div>
        </motion.div>
      </div>

      {/* Brand & Loading Text */}
      <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 font-poppins">
        Šeherezada
      </h1>
      
      <div className="h-6 overflow-hidden relative w-full flex justify-center mb-12">
        <AnimatePresence mode="wait">
          <motion.p
            key={textIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-zinc-400 font-medium absolute text-sm tracking-wide"
          >
            {loadingTexts[textIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="w-64 max-w-[80vw] h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner relative">
        <motion.div 
          className="h-full bg-gradient-to-r from-orange-500 to-shere-red relative overflow-hidden"
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ ease: "easeOut", duration: 0.3 }}
        >
          {/* Shine effect inside progress bar */}
          <motion.div 
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
