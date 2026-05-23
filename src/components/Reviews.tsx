import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { reviews } from "../data"
import { Star } from "lucide-react"

export function Reviews() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="reviews" className="py-24 bg-shere-red text-white overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="flex justify-center mb-8 gap-1 text-shere-gold">
          {[1,2,3,4,5].map(i => (
            <Star key={i} fill="currentColor" size={32} />
          ))}
        </div>
        
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
                "{reviews[index].text}"
              </p>
              <p className="text-xl opacity-80 font-medium">
                — {reviews[index].author}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicators */}
        <div className="flex justify-center mt-8 gap-3">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${i === index ? "bg-white scale-125" : "bg-white/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
