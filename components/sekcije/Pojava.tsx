"use client"

import { motion } from "framer-motion"

/**
 * Animirani omotač — jezgro obrasca ovog koraka.
 *
 * Klijentska je SAMO animacija. Djeca stižu kao gotov serverski HTML i
 * ostaju u izvornom kodu. Da je cijela sekcija klijentska, tekst ne bi
 * stigao u HTML, čime bi cijela migracija izgubila smisao.
 *
 * Vrijednosti su iste kao dosad: opacity 0→1, y 20→0, kaskadno.
 */
export function Pojava({
  children,
  delay = 0,
  y = 20,
  className = "",
  id,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
  id?: string
}) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
