import type { MetadataRoute } from "next"

import { repo } from "@/lib/repo"
import { JEZICI } from "@/lib/domain"
import { BASE_URL } from "@/lib/meta"
import { LOKAL_PAGES, SEO_PAGES, SHARED_PAGES, href } from "@/lib/route"

/**
 * Sitemap se gradi IZ REPOZITORIJA, nikad iz ukucane liste.
 *
 * Napisan tako, novi lokal dodan kroz /chef ulazi u sitemap bez ijedne
 * izmjene koda. Petlja po jezicima ide odmah, pa korak 22 ne dira ovaj fajl.
 *
 * Van sitemapa: glavni lokal pod svojim slugom (ima adresu bez prefiksa),
 * slovenski prefiks /sl/, lokali 'uskoro' i 'zatvoren', /chef i /api.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [lokali, glavni] = await Promise.all([
    repo.getLokali(),
    repo.getGlavniLokal(),
  ])

  const uPogonu = lokali.filter((l) => l.stanje === "radi")
  const unosi: MetadataRoute.Sitemap = []
  const sada = new Date()

  const dodaj = (putanja: string, prioritet: number) => {
    unosi.push({
      url: BASE_URL + putanja,
      lastModified: sada,
      changeFrequency: "weekly",
      priority: prioritet,
    })
  }

  for (const jezik of JEZICI) {
    const lang = jezik.kod

    for (const lokal of uPogonu) {
      dodaj(
        href({ kind: "lokal-home", lang, lokal: lokal.slug }, glavni.slug),
        lokal.glavni ? 1 : 0.9,
      )

      for (const stranica of LOKAL_PAGES) {
        dodaj(
          href(
            { kind: "lokal-page", lang, lokal: lokal.slug, page: stranica },
            glavni.slug,
          ),
          stranica === "meni" ? 0.9 : 0.6,
        )
      }
    }

    for (const stranica of SHARED_PAGES) {
      dodaj(href({ kind: "shared", lang, page: stranica }, glavni.slug), 0.5)
    }

    for (const stranica of SEO_PAGES) {
      dodaj(href({ kind: "seo", lang, page: stranica }, glavni.slug), 0.8)
    }
  }

  return unosi
}
