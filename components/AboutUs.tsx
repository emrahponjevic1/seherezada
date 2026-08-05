"use client"

import { useRef } from "react"
import { useLanguage } from "../providers/LanguageProvider"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { Flame, Clock, ChefHat } from "lucide-react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function AboutUs() {
  const { t } = useLanguage()
  const containerRef = useRef<HTMLElement>(null)
  
  useGSAP(() => {
    // 1. Horizontal Parallax Background Text
    gsap.to(".bg-text", {
      xPercent: -30,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      }
    })

    // 2. Pronounced Image Parallax (moving the oversized wrapper)
    gsap.fromTo(".parallax-img", 
      { y: "-15%" },
      {
        y: "15%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      }
    )

    // 3. Staggered Reveal that plays once smoothly
    gsap.from(".reveal-item", {
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
        once: true,
      }
    })
  }, { scope: containerRef })

  return (
    <section id="about" ref={containerRef} className="relative w-full py-24 md:py-32 overflow-hidden bg-background border-y border-shere-red/25 mt-12 md:mt-24">
      {/* Massive Background Text */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[200vw] z-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none overflow-hidden flex items-center">
        <h1 className="bg-text text-[20vw] font-black whitespace-nowrap text-foreground uppercase leading-none font-poppins">
          TRADICIJA & KVALITETA
        </h1>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* LEFT: Parallax Image */}
          <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[700px] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 dark:border-white/10 group">
            {/* Parallax inner image */}
            <div className="parallax-img absolute w-full h-[130%] -top-[15%] left-0">
              <img 
                src="/rotisserie_hero.png" 
                alt="Šeherezada Tradicija"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Quality Badge */}
            <div className="absolute bottom-8 left-8 bg-black/60 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-3xl reveal-item">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-shere-red/20 flex items-center justify-center text-shere-red">
                  <ChefHat size={24} />
                </div>
                <div>
                  <p className="text-white font-black text-xl">{t("Od 1998", "Since 1998")}</p>
                  <p className="text-zinc-400 text-sm">{t("Majstori kebaba", "Kebab Masters")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Typography & Story */}
          <div className="text-content space-y-8">
            <div className="space-y-4 reveal-item">
              <h2 className="text-shere-red font-black tracking-widest uppercase text-sm lg:text-base">
                {t("Naša Zgodba", "Our Story")}
              </h2>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black font-poppins text-foreground leading-[1.1]">
                {t("Okus prave ", "The taste of real ")}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-shere-red to-orange-500">
                  {t("tradicije.", "tradition.")}
                </span>
              </h3>
            </div>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed reveal-item font-medium">
              {t(
                "Svaki zalogaj u Šeherezadi donosi autentičan duh Istanbula pravo u srce Ljubljane. Koristimo samo 100% svježe halal meso, pečeno na pravoj vatri, kako bismo zadržali sočnost i neodoljiv okus.",
                "Every bite at Šeherezada brings the authentic spirit of Istanbul right to the heart of Ljubljana. We use only 100% fresh halal meat, grilled over an open fire to retain its juiciness and irresistible flavor."
              )}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 reveal-item">
              <div className="bg-card/40 border border-white/5 dark:border-white/10 p-6 rounded-3xl backdrop-blur-sm group hover:border-shere-red/30 transition-colors">
                <Flame className="text-shere-red mb-4 group-hover:scale-110 transition-transform" size={32} />
                <h4 className="font-bold text-xl mb-2">{t("Domač kruh", "Homemade Bread")}</h4>
                <p className="text-muted-foreground text-sm">
                  {t("Svježe pečen svakog dana po našem tajnom porodičnom receptu.", "Freshly baked every day using our secret family recipe.")}
                </p>
              </div>
              <div className="bg-card/40 border border-white/5 dark:border-white/10 p-6 rounded-3xl backdrop-blur-sm group hover:border-shere-red/30 transition-colors">
                <Clock className="text-shere-red mb-4 group-hover:scale-110 transition-transform" size={32} />
                <h4 className="font-bold text-xl mb-2">{t("Noćna dostava", "Night Delivery")}</h4>
                <p className="text-muted-foreground text-sm">
                  {t("Tu smo za tebe sve do ranih jutarnjih sati kada ogladniš.", "We are here for you until the early morning hours when hunger strikes.")}
                </p>
              </div>
            </div>
            
          </div>

        </div>
      </div>
    </section>
  )
}