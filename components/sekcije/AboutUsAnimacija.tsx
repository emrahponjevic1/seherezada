"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Klijentski omotač koji drži GSAP i parallax.
 *
 * Djeca stižu kao gotov serverski HTML — GSAP samo pokreće elemente koje
 * pronađe po klasama `.bg-text`, `.parallax-img` i `.reveal-item`.
 * Tekst tako ostaje u izvornom kodu.
 */
export function AboutUsAnimacija({
  children,
  className,
  id,
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) {
  const container = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.to(".bg-text", {
        xPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      })

      gsap.fromTo(
        ".parallax-img",
        { y: "-15%" },
        {
          y: "15%",
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      )

      gsap.from(".reveal-item", {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      })
    },
    { scope: container },
  )

  return (
    <section id={id} ref={container} className={className}>
      {children}
    </section>
  )
}
