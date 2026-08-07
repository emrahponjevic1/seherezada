import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import { repo } from "@/lib/repo"
import { JEZICI } from "@/lib/domain"
import { BASE_URL, OG_LOKALI, OG_SLIKA, metaZaRutu } from "@/lib/meta"
import {
  LOKAL_PAGES,
  SEO_PAGES,
  SHARED_PAGES,
  href,
  resolveRoute,
  sveAdrese,
  type Route,
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

/**
 * Razrješavanje sa preusmjerenjima.
 *
 * Tabela se gleda TEK kad obično razrješavanje da 404 — tako se za svaku
 * ispravnu adresu ne ide u bazu bez potrebe. Bez ovoga bi svaka promjena
 * sluga tiho polomila sve podijeljene linkove i odštampane QR kodove.
 */
async function razrijesi(
  slug: string[] | undefined,
  ctx: RouteKontekst,
): Promise<Route> {
  const ruta = resolveRoute(slug, ctx)
  if (ruta.kind !== "notfound") return ruta

  const segmenti = (slug ?? []).filter(Boolean)
  if (segmenti.length === 0) return ruta

  // Preusmjerava se slug LOKALA, pa se gleda prvi segment poslije jezika.
  const prefiksi = JEZICI.map((j) => j.prefiks).filter(Boolean)
  const imaJezik = prefiksi.includes(segmenti[0])
  const indeks = imaJezik ? 1 : 0
  const stari = segmenti[indeks]
  if (!stari) return ruta

  const novi = await repo.getPreusmjerenje(stari)
  if (!novi) return ruta

  const zamijenjeni = [...segmenti]
  zamijenjeni[indeks] = novi

  // Novi slug se razrješava ponovo — ako je i on glavni lokal, dobija
  // adresu bez prefiksa umjesto da ostane na međukoraku.
  const nova = resolveRoute(zamijenjeni, ctx)
  if (nova.kind === "redirect") return nova
  if (nova.kind === "notfound") return ruta

  return { kind: "redirect", to: href(nova, ctx.glavniSlug), trajno: true }
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
  const route = await razrijesi(slug, ctx)

  if (route.kind === "redirect" || route.kind === "notfound") return {}

  const lokal =
    route.kind === "lokal-home" || route.kind === "lokal-page"
      ? await repo.getLokal(route.lokal)
      : null

  const meta = metaZaRutu(route, lokal)
  if (!meta) return {}

  // Kanonska adresa uvijek pokazuje na sebe, punom adresom.
  const kanonska = BASE_URL + href(route, ctx.glavniSlug)

  /**
   * hreflang za svih sedam jezika.
   *
   * Ključ je KOD jezika (`bs`), a ne prefiks iz adrese (`ba`) — hreflang
   * traži ISO oznaku, pa bi `ba` Google odbacio kao nepoznatu.
   *
   * `x-default` pokazuje na ENGLESKI, ne na slovenski.
   *
   * Ta oznaka ne služi domaćem gostu — njega hvata `hreflang="sl"`. Ona
   * važi za posjetioca čiji jezik nemamo: Španca, Poljaka, Norvežanina.
   * Njemu je engleska verzija upotrebljiva, slovenska nije. Ljubljana je
   * turistički grad i takvih je posjetilaca više nego onih koji govore
   * bilo koji od preostalih šest jezika.
   */
  const jezicne = Object.fromEntries(
    Object.entries(sveAdrese(slug, ctx)).map(([kod, putanja]) => [
      kod,
      BASE_URL + putanja,
    ]),
  )

  return {
    title: meta.naslov,
    description: meta.opis,
    alternates: {
      canonical: kanonska,
      languages: {
        ...jezicne,
        "x-default": jezicne.en,
      },
    },
    openGraph: {
      type: "website",
      siteName: "Šeherezada",
      title: meta.naslov,
      description: meta.opis,
      url: kanonska,
      locale: OG_LOKALI[route.lang],
      alternateLocale: JEZICI.filter((j) => j.kod !== route.lang).map(
        (j) => OG_LOKALI[j.kod],
      ),
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
  const route = await razrijesi(slug, await kontekst())

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
