import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import { repo } from "@/lib/repo"
import { JEZICI } from "@/lib/domain"
import { BASE_URL, OG_SLIKA, metaZaRutu } from "@/lib/meta"
import {
  LOKAL_PAGES,
  SEO_PAGES,
  SHARED_PAGES,
  href,
  resolveRoute,
  type RouteKontekst,
} from "@/lib/route"

import { Naslovna } from "@/components/sekcije/Naslovna"
import { StranicaMenija } from "@/components/sekcije/StranicaMenija"
import {
  PrikazRecenzija,
  PrikazSeo,
  PrikazZajednicke,
} from "@/components/stranice/prikazi"

/** Lokal dodan poslije gradnje mora dobiti stranicu, ne 404 (korak 18). */
export const dynamicParams = true

// ─────────────────────────────────────────────────────────────
//  Kontekst iz repozitorija — nijedan slug se ne ukucava
// ─────────────────────────────────────────────────────────────

async function kontekst(): Promise<RouteKontekst> {
  const [lokali, glavni] = await Promise.all([
    repo.getLokali(),
    repo.getGlavniLokal(),
  ])

  return {
    // Samo lokali koji rade imaju adrese; 'uskoro' i 'zatvoren' nemaju.
    lokalSlugi: lokali.filter((l) => l.stanje === "radi").map((l) => l.slug),
    glavniSlug: glavni.slug,
  }
}

// ─────────────────────────────────────────────────────────────
//  Statičke adrese
// ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const lokali = await repo.getLokali()
  const glavni = await repo.getGlavniLokal()
  const uPogonu = lokali.filter((l) => l.stanje === "radi")

  const params: { slug: string[] }[] = []

  for (const jezik of JEZICI) {
    const p = jezik.prefiks
    const uvod = p ? [p] : []

    for (const lokal of uPogonu) {
      // Glavni lokal se piše BEZ sluga — inače bi ista stranica imala dvije adrese.
      const osnova = lokal.slug === glavni.slug ? uvod : [...uvod, lokal.slug]

      params.push({ slug: osnova })
      for (const stranica of LOKAL_PAGES) {
        params.push({ slug: [...osnova, stranica] })
      }
    }

    for (const stranica of SHARED_PAGES) params.push({ slug: [...uvod, stranica] })
    for (const stranica of SEO_PAGES) params.push({ slug: [...uvod, stranica] })
  }

  return params
}

// ─────────────────────────────────────────────────────────────
//  Metapodaci
// ─────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const ctx = await kontekst()
  const route = resolveRoute(slug, ctx)

  if (route.kind === "redirect" || route.kind === "notfound") return {}

  const lokal =
    route.kind === "lokal-home" || route.kind === "lokal-page"
      ? await repo.getLokal(route.lokal)
      : null

  const meta = metaZaRutu(route, lokal)
  if (!meta) return {}

  // Kanonska adresa uvijek pokazuje na sebe, punom adresom.
  const kanonska = BASE_URL + href(route, ctx.glavniSlug)

  return {
    title: meta.naslov,
    description: meta.opis,
    alternates: {
      canonical: kanonska,
      // korak 22: alternates.languages — hreflang za sedam jezika
    },
    openGraph: {
      type: "website",
      siteName: "Šeherezada",
      title: meta.naslov,
      description: meta.opis,
      url: kanonska,
      locale: route.lang,
      images: [
        {
          url: BASE_URL + OG_SLIKA.url,
          width: OG_SLIKA.width,
          height: OG_SLIKA.height,
          alt: OG_SLIKA.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.naslov,
      description: meta.opis,
      images: [BASE_URL + OG_SLIKA.url],
    },
  }
}

// ─────────────────────────────────────────────────────────────
//  Stranica
// ─────────────────────────────────────────────────────────────

export default async function Stranica({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  const route = resolveRoute(slug, await kontekst())

  switch (route.kind) {
    case "redirect":
      return permanentRedirect(route.to)

    case "notfound":
      return notFound()

    case "lokal-home": {
      const lokal = await repo.getLokal(route.lokal)
      if (!lokal || lokal.stanje !== "radi") notFound()
      return <Naslovna lokalSlug={route.lokal} lang={route.lang} />
    }

    case "lokal-page": {
      const lokal = await repo.getLokal(route.lokal)
      if (!lokal || lokal.stanje !== "radi") notFound()

      if (route.page === "meni") {
        return <StranicaMenija lokalSlug={route.lokal} lang={route.lang} />
      }

      return <PrikazRecenzija lokalSlug={route.lokal} lang={route.lang} />
    }

    case "shared":
      return <PrikazZajednicke stranica={route.page} lang={route.lang} />

    case "seo":
      return <PrikazSeo stranica={route.page} lang={route.lang} />
  }
}
