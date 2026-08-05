"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { Pizza, Flame, Utensils, Coffee, Beef, Star } from "lucide-react"

const icons = [Pizza, Flame, Utensils, Coffee, Beef, Star]

interface FloatingIcon {
  id: number
  Icon: React.ElementType
  x: number
  y: number
  scale: number
  opacity: number
  rotation: number
  speed: number
}

export function BackgroundPattern() {
  const [elements, setElements] = useState<FloatingIcon[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const { scrollY } = useScroll()
  const ySpring = useSpring(scrollY, { stiffness: 100, damping: 30, restDelta: 0.001 })
  const yOffset = useTransform(ySpring, [0, 2000], [0, -400])

  // Mouse parallax
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mobileCheck = window.innerWidth < 768
    setIsMobile(mobileCheck)
    // Generate evenly distributed icons using a Jittered Grid
    const cols = mobileCheck ? 4 : 8
    const rows = mobileCheck ? 6 : 12
    const newElements: FloatingIcon[] = []
    let idCounter = 0

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cellWidth = 100 / cols
        const cellHeight = 150 / rows
        
        const baseX = (col * cellWidth) + (cellWidth / 2)
        const baseY = (row * cellHeight) + (cellHeight / 2)
        
        // Random jitter within the cell to make it look natural, not perfectly aligned
        const jitterX = (Math.random() - 0.5) * (cellWidth * 0.8)
        const jitterY = (Math.random() - 0.5) * (cellHeight * 0.8)

        newElements.push({
          id: idCounter++,
          Icon: icons[Math.floor(Math.random() * icons.length)],
          x: baseX + jitterX,
          y: baseY + jitterY,
          scale: 0.5 + Math.random() * 1.5,
          opacity: 0.02 + Math.random() * 0.03, // strictly low opacity
          rotation: Math.random() * 360,
          speed: 0.2 + Math.random() * 0.8
        })
      }
    }
    
    setElements(newElements)

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth - 0.5) * 40
      const y = (e.clientY / innerHeight - 0.5) * 40
      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div style={{ y: yOffset }} className="absolute inset-0 w-full h-[150vh]">
        {elements.map((el) => {
          const Icon = el.Icon
          return (
            <motion.div
              key={el.id}
              className="absolute text-foreground"
              style={{
                left: `${el.x}vw`,
                top: `${el.y}vh`,
                opacity: el.opacity,
                scale: el.scale,
                rotate: el.rotation,
              }}
              {...(isMobile ? {} : {
                animate: {
                  x: mousePosition.x * el.speed,
                  y: mousePosition.y * el.speed,
                  rotate: el.rotation + (mousePosition.x * 0.1),
                },
                transition: {
                  type: "spring",
                  stiffness: 50,
                  damping: 20,
                }
              })}
            >
              <Icon size={48} strokeWidth={1} />
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}