import type { Metadata } from "next"

/**
 * Vanjski okvir /chef — obuhvata i prijavu.
 *
 * Tri sloja zabrane indeksiranja, sva tri obavezna:
 *   1. `noindex` ovdje
 *   2. `Disallow: /chef` u robots.txt (korak 6)
 *   3. /chef se ne pojavljuje u sitemapu (korak 6)
 *
 * Admin je uvijek svijetao i ne prati temu sajta. Boje su navedene
 * izričito, a ne kroz `dark:` varijante, jer korijenski okvir drži klasu
 * teme na <html> i nju odavde nije moguće poništiti.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

/** Admin uvijek prikazuje trenutno stanje, nikad keširano. */
export const dynamic = "force-dynamic"

export default function ChefLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-inter">
      {children}
    </div>
  )
}
