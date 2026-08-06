import { repo } from "@/lib/repo"
import type { Lang } from "@/lib/domain"
import type { SeoPage, SharedPage } from "@/lib/route"

import { ZajednickaStranica } from "./ZajednickeStranice"
import { SeoStranica } from "./SeoStranica"
import { StranicaRecenzija } from "./StranicaRecenzija"

/** Tanki serverski omotači — dohvat podataka, prikaz radi komponenta stranice. */

export async function PrikazZajednicke({
  stranica,
  lang,
}: {
  stranica: SharedPage
  lang: Lang
}) {
  const [lokali, glavni] = await Promise.all([
    repo.getLokali(),
    repo.getGlavniLokal(),
  ])

  return (
    <ZajednickaStranica
      stranica={stranica}
      lokali={lokali}
      lang={lang}
      glavniSlug={glavni.slug}
    />
  )
}

export async function PrikazSeo({
  stranica,
  lang,
}: {
  stranica: SeoPage
  lang: Lang
}) {
  const [lokali, glavni] = await Promise.all([
    repo.getLokali(),
    repo.getGlavniLokal(),
  ])

  // Cijene se prikazuju za glavni lokal — nikad prepisane u tekst.
  const sekcije = await repo.getMeni(glavni.slug)

  return (
    <SeoStranica
      stranica={stranica}
      lokali={lokali}
      sekcije={sekcije}
      lang={lang}
      glavniSlug={glavni.slug}
    />
  )
}

export async function PrikazRecenzija({
  lokalSlug,
  lang,
}: {
  lokalSlug: string
  lang: Lang
}) {
  const [lokali, glavni] = await Promise.all([
    repo.getLokali(),
    repo.getGlavniLokal(),
  ])

  const lokal = lokali.find((l) => l.slug === lokalSlug) ?? glavni

  return (
    <StranicaRecenzija lokal={lokal} lang={lang} glavniSlug={glavni.slug} />
  )
}
