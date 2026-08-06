"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { reviews } from "@/src/data"

/**
 * Karusel recenzija — ostaje klijentski i nepromijenjen, jer je stvarno
 * interaktivan (sam se pomjera i ima indikatore za klik).
 *
 * Recenzije su za sada demo. Korak 21 ih zamjenjuje pravima sa Google
 * Places API-ja, po lokalu.
 */
export function ReviewsKarusel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <div className="min-h-[220px] md:min-h-[180px] relative max-w-4xl mx-auto flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="absolute w-full"
          >
            <p className="text-3xl md:text-5xl font-bold font-poppins mb-6 leading-tight">
              &ldquo;{reviews[index].text}&rdquo;
            </p>
            <p className="text-xl opacity-80 font-medium">
              — {reviews[index].author}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-8 gap-3">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Recenzija ${i + 1}`}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === index ? "bg-white scale-125" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </>
  )
}
