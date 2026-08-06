import type { Jelo, Lang } from "@/lib/domain"
import { ui } from "@/lib/i18n"

/**
 * Oznake jela — čitaju se IZ PODATKA, nikad iz kategorije.
 *
 * Dosad su se izvodile iz kategorije, pa su burgeri ostajali bez halal
 * oznake iako jesu halal, a pice su je dobijale samo ako im je slug bio
 * baš `kebab-pizza`. Sada svako jelo nosi svoje oznake.
 */

type Velicina = "mala" | "velika"

const OSNOVA: Record<Velicina, string> = {
  mala: "text-xs font-black px-1.5 py-0.5 rounded-md border",
  velika: "text-xs font-black px-2 py-0.5 rounded-lg border",
}

export function oznakeZaJelo(
  jelo: Jelo,
  lang: Lang,
): { kljuc: string; tekst: string; klasa: string }[] {
  const oznake: { kljuc: string; tekst: string; klasa: string }[] = []

  if (jelo.halal) {
    oznake.push({
      kljuc: "halal",
      tekst: `🕌 ${ui("oznakaVelika.halal", lang)}`,
      klasa:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10",
    })
  }

  if (jelo.vegansko) {
    oznake.push({
      kljuc: "vegansko",
      tekst: `🌱 ${ui("oznakaVelika.vegansko", lang)}`,
      klasa:
        "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/10",
    })
  } else if (jelo.vegetarijansko) {
    oznake.push({
      kljuc: "vegetarijansko",
      tekst: `🥗 ${ui("oznakaVelika.vegetarijansko", lang)}`,
      klasa:
        "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/10",
    })
  }

  if (jelo.ljuto > 0) {
    oznake.push({
      kljuc: "ljuto",
      tekst: `${"🌶️".repeat(jelo.ljuto)} ${ui("oznakaVelika.pikantno", lang)}`,
      klasa:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/10",
    })
  }

  return oznake
}

export function OznakeJela({
  jelo,
  lang,
  velicina = "velika",
  najvise,
}: {
  jelo: Jelo
  lang: Lang
  velicina?: Velicina
  najvise?: number
}) {
  const sve = oznakeZaJelo(jelo, lang)
  const prikazane = najvise ? sve.slice(0, najvise) : sve

  if (prikazane.length === 0) return null

  return (
    <>
      {prikazane.map((o) => (
        <span key={o.kljuc} className={`${OSNOVA[velicina]} ${o.klasa}`}>
          {o.tekst}
        </span>
      ))}
    </>
  )
}
