import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import { repo } from "@/lib/repo"
import { t } from "@/lib/i18n"
import { JEZICI } from "@/lib/domain"
import {
  LOKAL_PAGES,
  SEO_PAGES,
  SHARED_PAGES,
  resolveRoute,
  type Route,
  type RouteKontekst,
} from "@/lib/route"

import { NaslovnaPrivremeno } from "./NaslovnaPrivremeno"

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
//  Metapodaci — puni ih korak 6, ovdje samo jedinstven naslov
// ─────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const route = resolveRoute(slug, await kontekst())

  if (route.kind === "redirect" || route.kind === "notfound") return {}

  const naslov = await naslovZaRutu(route)
  return { title: naslov }
}

async function naslovZaRutu(route: Route): Promise<string> {
  switch (route.kind) {
    case "lokal-home": {
      const lokal = await repo.getLokal(route.lokal)
      return lokal?.glavni
        ? "Šeherezada — Halal kebab & fast food Ljubljana"
        : `Šeherezada ${lokal?.ulica ?? ""} — Halal kebab & fast food`
    }
    case "lokal-page": {
      const lokal = await repo.getLokal(route.lokal)
      const ime = lokal?.ulica ?? ""
      return route.page === "meni"
        ? `Meni in cene — Šeherezada ${ime}`
        : `Mnenja gostov — Šeherezada ${ime}`
    }
    case "shared":
      return `${route.page} — Šeherezada`
    case "seo":
      return `${route.page} — Šeherezada`
    default:
      return "Šeherezada"
  }
}

// ─────────────────────────────────────────────────────────────
//  Kostur stranice — punе ih koraci 7, 8 i 9
// ─────────────────────────────────────────────────────────────

function Kostur({ naslov, opis }: { naslov: string; opis: string }) {
  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-20">
      <h1 className="text-4xl md:text-5xl font-black font-poppins tracking-tight">
        {naslov}
      </h1>
      <p className="mt-4 text-muted-foreground font-inter max-w-2xl">{opis}</p>
    </section>
  )
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
      // Korak 7 zamjenjuje ovo sekcijama koje čitaju lokal i jezik iz rute.
      return <NaslovnaPrivremeno />
    }

    case "lokal-page": {
      const lokal = await repo.getLokal(route.lokal)
      if (!lokal || lokal.stanje !== "radi") notFound()

      return (
        <Kostur
          naslov={
            route.page === "meni"
              ? `Meni in cene — Šeherezada ${lokal.ulica}`
              : `Mnenja gostov — Šeherezada ${lokal.ulica}`
          }
          opis={t(lokal.uvodniTekst, route.lang)}
        />
      )
    }

    case "shared":
      return (
        <Kostur
          naslov={route.page}
          opis="Vsebino te strani pripravlja korak 9."
        />
      )

    case "seo":
      return (
        <Kostur
          naslov={route.page}
          opis="Vsebino te strani pripravlja korak 9."
        />
      )
  }
}
