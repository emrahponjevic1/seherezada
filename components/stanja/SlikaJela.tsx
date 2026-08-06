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

  return (
    // Obični <img>: jela koriste vanjske adrese, a next/image bi tražio
    // upis domena u konfiguraciju. Korak 17 uvodi vlastite slike i srcset.
    <img
      src={slikaUrl}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className={className}
    />
  )
}
