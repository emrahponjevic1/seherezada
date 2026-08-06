import { repo } from "@/lib/repo"
import type { Lang } from "@/lib/domain"
import { Menu } from "@/components/Menu"

/** Stranica /{lokal}/meni — dohvat podataka, prikaz radi `Menu` u varijanti 'puna'. */
export async function StranicaMenija({
  lokalSlug,
  lang,
}: {
  lokalSlug: string
  lang: Lang
}) {
  const [sekcije, lokali, glavni] = await Promise.all([
    repo.getMeni(lokalSlug),
    repo.getLokali(),
    repo.getGlavniLokal(),
  ])

  const lokal = lokali.find((l) => l.slug === lokalSlug) ?? glavni

  // Ako ovaj lokal nema meni, ponudi prvi drugi koji radi i ima jela.
  const drugiLokal = lokali.find(
    (l) => l.slug !== lokalSlug && l.stanje === "radi",
  )

  return (
    <Menu
      sekcije={sekcije}
      lokal={lokal}
      lang={lang}
      glavniSlug={glavni.slug}
      varijanta="puna"
      drugiLokal={drugiLokal}
    />
  )
}
