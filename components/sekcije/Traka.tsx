"use client"

import { useRef } from "react"

/**
 * Vodoravna traka kartica.
 *
 * PRAVILO KOJE SE OVDJE NE SMIJE PREKRŠITI: traka smije SKROLATI, ne
 * smije UKLANJATI. Sve kartice ostaju u dokumentu — one van ekrana su
 * pomjerene, ne izostavljene. Zato ovdje nema `slice()` ni uslovnog
 * iscrtavanja: da ih ima, naslovna bi izgubila pola sadržaja iz izvornog
 * koda, a to je razlog zbog kojeg je cijela migracija na Next i rađena.
 *
 * Povlačenje mišem je isti obrazac koji već koristi traka kategorija u
 * `MeniInteraktivni` — ne nov kod. Radi u oba smjera pisanja, jer
 * sadržaj prati prst bez obzira na to kako su ose orijentisane.
 */
export function Traka({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const pocetak = useRef({ x: 0, scrollLeft: 0 })

  const naPritisak = (e: React.MouseEvent) => {
    if (!ref.current) return
    pocetak.current = { x: e.pageX, scrollLeft: ref.current.scrollLeft }
  }

  const naPomjeraj = (e: React.MouseEvent) => {
    if (e.buttons !== 1 || !ref.current) return
    ref.current.scrollLeft = pocetak.current.scrollLeft - (e.pageX - pocetak.current.x)
  }

  return (
    <div
      ref={ref}
      onMouseDown={naPritisak}
      onMouseMove={naPomjeraj}
      className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-6 md:gap-8 pb-2 -mx-4 px-4 md:-mx-8 md:px-8 cursor-grab active:cursor-grabbing"
    >
      {children}
    </div>
  )
}

/**
 * Jedna ćelija trake. Fiksna širina je nužna: unutar `flex` kontejnera
 * bi se kartice inače stisnule da stanu, i traka se ne bi imala kuda
 * skrolati.
 */
export function Celija({ children }: { children: React.ReactNode }) {
  return (
    <div className="snap-start shrink-0 w-[72vw] sm:w-[45vw] lg:w-[22rem]">
      {children}
    </div>
  )
}
