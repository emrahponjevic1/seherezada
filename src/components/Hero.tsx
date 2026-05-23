import { useEffect, useState } from "react"
import { useLanguage } from "../providers/LanguageProvider"
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"
import { Star, Flame, Clock, MapPin, ArrowRight, Utensils, Phone } from "lucide-react"

export function Hero() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  // Motion values for 3D mouse tilt
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth springs for high fidelity 3D tilts
  const tiltXSpring = useSpring(mouseY, { stiffness: 120, damping: 25 })
  const tiltYSpring = useSpring(mouseX, { stiffness: 120, damping: 25 })

  // Transform angles based on coordinates
  const rotateX = useTransform(tiltXSpring, [-300, 300], [15, -15])
  const rotateY = useTransform(tiltYSpring, [-300, 300], [-15, 15])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const x = e.clientX - rect.left - width / 2
    const y = e.clientY - rect.top - height / 2
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  // Logic to determine if open based on midnight crossover
  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date()
      const hour = now.getHours()
      if (hour >= 9 || hour < 5) {
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }
    checkOpenStatus()
    const interval = setInterval(checkOpenStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section 
      id="home"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[90vh] lg:min-h-screen flex flex-col justify-center overflow-hidden pt-28 pb-12 lg:pt-36 lg:pb-16"
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="hero-curve" clipPathUnits="objectBoundingBox">
            <path d="M0,0 L1,0 L1,0.92 Q0.5,1 0,0.92 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Background Image (Premium Turkish Kebab Grill) */}
      <div className="absolute inset-0 bg-black z-0" style={{ clipPath: "url(#hero-curve)" }}>
        <img 
          src="/rotisserie_hero.png" 
          alt="Šeherezada Kebab Grill Background"
          className={`w-full h-full object-cover ${isMobile ? 'opacity-20 grayscale' : 'opacity-35 mix-blend-luminosity animate-pulse-subtle blur-[3px]'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent"></div>
        <div className="absolute inset-0 bg-shere-charcoal/20 mix-blend-multiply hidden md:block"></div>
      </div>

      {/* Hero Content Wrapper */}
      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* LEFT COLUMN: Typography & Actions */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 md:space-y-8">
          
          {/* Status Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2.5 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl text-white text-sm font-semibold shadow-2xl"
          >
            <span className="relative flex h-3 w-3">
              {isOpen ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              )}
            </span>
            {isOpen ? t("Odprto zdaj (09:00 - 05:00)", "Open Now (09:00 - 05:00)") : t("Zaprto", "Closed")}
          </motion.div>

          {/* Hero Typography */}
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight drop-shadow-2xl font-poppins"
            >
              Šeherezada <br />
              <span className="text-shere-red font-outline-2 drop-shadow-[0_0_35px_rgba(230,57,70,0.4)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl block mt-2 font-black tracking-normal">
                {t("Kebab · Pizza · Falafel", "Kebab · Pizza · Falafel")}
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-zinc-300 text-lg md:text-xl max-w-xl font-medium leading-relaxed"
            >
              {t(
                "Doživi avtentične turške okuse, sočno meso pečeno na pravem ognju in domač kruh, pripravljen po tajnem receptu.",
                "Experience authentic Turkish flavors, juicy flame-grilled meat, and fresh homemade bread baked using our secret recipe."
              )}
            </motion.p>
          </div>

          {/* Rating */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-3 text-white font-medium text-base md:text-lg bg-white/5 border border-white/5 backdrop-blur-sm px-5 py-3 rounded-2xl"
          >
            <div className="flex text-shere-red">
              <Star fill="currentColor" size={20} />
              <Star fill="currentColor" size={20} />
              <Star fill="currentColor" size={20} />
              <Star fill="currentColor" size={20} />
              <Star fill="currentColor" size={20} className="opacity-55" />
            </div>
            <span>4.5 <span className="text-zinc-400">({t("1.914+ Google ocen", "1,914+ Google Reviews")})</span></span>
          </motion.div>

          {/* Actions */}
          <motion.div
            id="hero-actions"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <a 
              href="#menu" 
              className="group relative px-8 py-4 bg-white text-black rounded-2xl font-black text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.8)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,1)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-2.5">
                <Utensils size={20} className="text-shere-red transition-transform group-hover:rotate-12" />
                {t("Prikaži Meni", "View Menu")}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform opacity-70" />
              </span>
            </a>
            <a 
              href="tel:+38669444812" 
              className="group relative px-8 py-4 bg-black/40 backdrop-blur-xl border border-white/20 text-white rounded-2xl font-black text-lg shadow-2xl hover:border-shere-red hover:shadow-[0_0_40px_-10px_rgba(230,57,70,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-shere-red to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-2.5">
                <Phone size={20} className="text-shere-red group-hover:text-white animate-pulse group-hover:scale-110 transition-all duration-300" />
                +386 69 444 812
              </span>
            </a>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: 3D Mouse-tilting Food Plate (Desktop) / Rotating Plate (Mobile/Tablet) */}
        <div className="lg:col-span-5 flex justify-center items-center relative h-[350px] sm:h-[450px] lg:h-[600px] w-full">
          {/* Glowing neon aura behind the plate */}
          <div className="absolute w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] rounded-full bg-shere-red/20 blur-[80px] z-0 animate-pulse-subtle"></div>

          {/* Desktop 3D Interactive Container */}
          <motion.div 
            style={isMobile ? {} : { rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative z-10 w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] flex items-center justify-center cursor-grab active:cursor-grabbing"
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            {/* The circular premium food plate */}
            <div 
              style={isMobile ? {} : { transform: "translateZ(30px)" }}
              className="relative z-10 w-[260px] h-[260px] sm:w-[370px] sm:h-[370px] rounded-full p-2 bg-gradient-to-tr from-shere-red to-orange-500 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border-[6px] border-white/10 dark:border-white/5"
            >
              <motion.img 
                src="/rotisserie_hero.png" 
                alt="Šeherezada premium Turkish Doner Plate" 
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 8, 
                  ease: "easeInOut" 
                }}
                className="w-full h-full object-cover rounded-full shadow-inner"
              />
              
              {/* Hot steam micro-animation details */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/5 to-transparent pointer-events-none hidden md:block mix-blend-screen opacity-60"></div>
            </div>

            {/* 3D Floating Interactive Badges (Orbiting the food plate with mixed front/behind depths and custom filters) */}
            
            {/* 1. Ljubljana #1 [BEHIND -> IN FRONT -> BEHIND] */}
            <motion.div 
              {...(isMobile ? {} : {
                style: { transformStyle: "preserve-3d" },
                animate: { y: [0, 6, 0], z: [-20, 120, -20], scale: [0.95, 1.05, 0.95], filter: ["blur(1px)", "blur(0px)", "blur(1px)"], zIndex: [5, 100, 5] },
                transition: { repeat: Infinity, duration: 6, ease: "easeInOut" }
              })}
              className={`absolute -top-10 left-[20%] sm:left-[25%] ${isMobile ? 'bg-black/40 animate-float-slow' : 'bg-white/10 backdrop-blur-md'} px-4 py-2 rounded-2xl border border-white/10 text-white/80 flex items-center gap-2 shadow-md`}
            >
              <span className="text-xs sm:text-sm font-black tracking-wide">🏆 {t("Ljubljana #1", "Ljubljana #1")}</span>
            </motion.div>

            {/* 2. Premium Quality [BEHIND -> IN FRONT -> BEHIND] */}
            <motion.div 
              {...(isMobile ? {} : {
                style: { transformStyle: "preserve-3d" },
                animate: { y: [0, 8, 0], rotate: [0, -5, 0], z: [-60, 110, -60], scale: [0.9, 1.05, 0.9], filter: ["blur(2px)", "blur(0px)", "blur(2px)"], zIndex: [2, 100, 2] },
                transition: { repeat: Infinity, duration: 7.5, ease: "easeInOut", delay: 0.3 }
              })}
              className={`absolute -top-8 right-[10%] sm:right-[15%] ${isMobile ? 'bg-black/40 animate-float-slow' : 'bg-white/10 backdrop-blur-md'} px-3 sm:px-4 py-2 rounded-2xl border border-white/5 text-white/55 flex items-center gap-1.5 shadow-md`}
            >
              <span className="text-xs sm:text-sm font-black tracking-wide">👑 {t("Premium", "Premium")}</span>
            </motion.div>

            {/* 3. Homemade Bread [BEHIND -> IN FRONT -> BEHIND] */}
            <motion.div 
              {...(isMobile ? {} : {
                style: { transformStyle: "preserve-3d" },
                animate: { y: [0, -10, 0], x: [0, 5, 0], z: [-40, 130, -40], scale: [0.93, 1.06, 0.93], filter: ["blur(1.5px)", "blur(0px)", "blur(1.5px)"], zIndex: [5, 100, 5] },
                transition: { repeat: Infinity, duration: 6.8, ease: "easeInOut", delay: 0.7 }
              })}
              className={`absolute bottom-1/4 -left-12 sm:-left-16 ${isMobile ? 'bg-black/40 animate-float-slow' : 'bg-white/10 backdrop-blur-md'} px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-white/10 text-white/70 flex items-center gap-2 shadow-lg`}
            >
              <span className="text-xs sm:text-sm font-black tracking-wide">🥖 {t("Domač Kruh", "Homemade Bread")}</span>
            </motion.div>

            {/* 4. 100% Spicy [IN FRONT -> BEHIND -> IN FRONT] */}
            <motion.div 
              {...(isMobile ? {} : {
                style: { transformStyle: "preserve-3d" },
                animate: { y: [0, 8, 0], rotate: [0, -10, 0], z: [100, -30, 100], scale: [1.05, 0.93, 1.05], filter: ["blur(0px)", "blur(1.5px)", "blur(0px)"], zIndex: [100, 5, 100] },
                transition: { repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.5 }
              })}
              className={`absolute top-4 -left-4 sm:-left-8 ${isMobile ? 'bg-black/40 animate-float-slow' : 'bg-white/10 backdrop-blur-md'} px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-white/10 text-white/90 flex items-center gap-2 shadow-lg`}
            >
              <Flame size={20} className="text-shere-red fill-current drop-shadow-[0_0_10px_rgba(230,57,70,1)]" />
              <span className="text-sm font-black tracking-wide">{t("100% Pikantno", "100% Spicy")}</span>
            </motion.div>

            {/* 5. Halal Meat [IN FRONT -> BEHIND -> IN FRONT] */}
            <motion.div 
              {...(isMobile ? {} : {
                style: { transformStyle: "preserve-3d" },
                animate: { y: [0, -8, 0], rotate: [0, 10, 0], z: [120, -50, 120], scale: [1.07, 0.9, 1.07], filter: ["blur(0px)", "blur(2px)", "blur(0px)"], zIndex: [100, 2, 100] },
                transition: { repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1.0 }
              })}
              className={`absolute bottom-4 -right-4 sm:-right-8 ${isMobile ? 'bg-black/40 animate-float-slow' : 'bg-white/10 backdrop-blur-md'} px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-white/10 text-white/90 flex items-center gap-2 shadow-lg`}
            >
              <Star size={20} className="text-shere-gold fill-current drop-shadow-[0_0_10px_rgba(251,191,36,1)]" />
              <span className="text-sm font-black tracking-wide">{t("Halal Meso", "Halal Meat")}</span>
            </motion.div>

            {/* 6. 100% Fresh [IN FRONT -> BEHIND -> IN FRONT] */}
            <motion.div 
              {...(isMobile ? {} : {
                style: { transformStyle: "preserve-3d" },
                animate: { x: [0, 6, 0], y: [0, -6, 0], z: [110, -40, 110], scale: [1.06, 0.92, 1.06], filter: ["blur(0px)", "blur(1.8px)", "blur(0px)"], zIndex: [100, 5, 100] },
                transition: { repeat: Infinity, duration: 6.2, ease: "easeInOut", delay: 1.5 }
              })}
              className={`absolute top-1/3 -right-8 sm:-right-12 ${isMobile ? 'bg-black/40 animate-float-slow' : 'bg-white/10 backdrop-blur-md'} px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-white/10 text-white/90 flex items-center gap-2 shadow-lg`}
            >
              <span className="text-sm font-black tracking-wide drop-shadow-md">🌯 {t("100% Sveže", "100% Fresh")}</span>
            </motion.div>

            {/* 7. Fast Delivery [IN FRONT -> BEHIND -> IN FRONT] */}
            <motion.div 
              {...(isMobile ? {} : {
                style: { transformStyle: "preserve-3d" },
                animate: { y: [0, -12, 0], rotate: [0, 5, 0], z: [130, -20, 130], scale: [1.08, 0.95, 1.08], filter: ["blur(0px)", "blur(1.2px)", "blur(0px)"], zIndex: [100, 5, 100] },
                transition: { repeat: Infinity, duration: 5.8, ease: "easeInOut", delay: 0.2 }
              })}
              className={`absolute -bottom-5 left-[10%] sm:left-[15%] ${isMobile ? 'bg-black/40 animate-float-slow' : 'bg-white/10 backdrop-blur-md'} px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-white/10 text-white/90 flex items-center gap-2 shadow-lg`}
            >
              <span className="text-xs sm:text-sm font-black tracking-wide">⚡ {t("Hitra Dostava", "Fast Delivery")}</span>
            </motion.div>
          </motion.div>
        </div>

      </div>

      {/* Trust & Live Stats Bar */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 mt-16 md:mt-24">
        <div className="w-full bg-card/40 border border-white/5 dark:border-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          
          <div className="flex flex-row items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-shere-red/10 flex items-center justify-center text-shere-red group-hover:bg-shere-red group-hover:text-white transition-all duration-300 group-hover:scale-110 flex-shrink-0">
              <Flame size={24} />
            </div>
            <div>
              <h4 className="font-bold text-lg group-hover:text-shere-red transition-colors duration-300">{t("Tradicionalni recepti", "Traditional Recipes")}</h4>
              <p className="text-sm text-muted-foreground">{t("100% halal meso pečeno na pravom žaru.", "100% halal flame-grilled meat.")}</p>
            </div>
          </div>

          <div className="flex flex-row items-center gap-4 border-y border-shere-red/25 lg:border-y-0 lg:border-x lg:px-8 py-6 lg:py-0 group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-shere-red/10 flex items-center justify-center text-shere-red group-hover:bg-shere-red group-hover:text-white transition-all duration-300 group-hover:scale-110 flex-shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <h4 className="font-bold text-lg group-hover:text-shere-red transition-colors duration-300">{t("Otvoreno do kasno", "Open Late Nights")}</h4>
              <p className="text-sm text-muted-foreground">{t("Za tebe pečemo hranu sve do 05:00 ujutro.", "Serving you food until 05:00 AM.")}</p>
            </div>
          </div>

          <div className="flex flex-row items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-shere-red/10 flex items-center justify-center text-shere-red group-hover:bg-shere-red group-hover:text-white transition-all duration-300 group-hover:scale-110 flex-shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <h4 className="font-bold text-lg group-hover:text-shere-red transition-colors duration-300">{t("Trubarjeva cesta 31", "Trubarjeva road 31")}</h4>
              <p className="text-sm text-muted-foreground">{t("U samom srcu Ljubljane, brza dostava.", "In the heart of Ljubljana, fast delivery.")}</p>
            </div>
          </div>

        </div>
      </div>
      
    </section>
  )
}

