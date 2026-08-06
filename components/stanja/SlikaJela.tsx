/**
 * Slika jela sa rezervnim okvirom.
 *
 * Jelo bez slike mora zauzeti TAČNO isti prostor kao jelo sa slikom —
 * inače raspored poskakuje pri učitavanju. Zato su `width` i `height`
 * obavezni, a rezervni okvir drži isti odnos stranica.
 *
 * Sve kartice je koriste od početka, da korak 15 smije dozvoliti unos
 * jela bez fotografije.
 */

import { UtensilsCrossed } from "lucide-react"

export function SlikaJela({
  slikaUrl,
  alt,
  width,
  height,
  className = "",
  loading = "lazy",
}: {
  slikaUrl?: string
  alt: string
  width: number
  height: number
  className?: string
  loading?: "eager" | "lazy"
}) {
  if (!slikaUrl) {
    return (
      <div
        role="img"
        aria-label={alt}
        style={{ aspectRatio: `${width} / ${height}` }}
        className={`w-full flex items-center justify-center bg-shere-red/10 border border-shere-red/10 text-shere-red/40 ${className}`}
      >
        <UtensilsCrossed size={32} strokeWidth={1.5} />
      </div>
    )
  }

  // Naše otpremljene slike postoje u tri veličine — preglednik bira
  // najmanju koja mu treba. Vanjske adrese (zastupne fotografije) nemaju
  // varijante, pa idu kakve jesu.
  const nase = slikaUrl.startsWith("/api/slike/")

  return (
    // Obični <img>: dio slika su vanjske adrese, a next/image bi tražio
    // upis svakog domena u konfiguraciju.
    <img
      src={nase ? `${slikaUrl}/800.webp` : slikaUrl}
      srcSet={
        nase
          ? `${slikaUrl}/400.webp 400w, ${slikaUrl}/800.webp 800w, ${slikaUrl}/1600.webp 1600w`
          : undefined
      }
      sizes={nase ? "(max-width: 768px) 45vw, 300px" : undefined}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className={className}
    />
  )
}
