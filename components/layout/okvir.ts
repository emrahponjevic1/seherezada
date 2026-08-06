/**
 * Zajedničko za navbar, podnožje i mobilnu traku.
 *
 * Sva tri su klijentska (animacije, hamburger, sat), a podaci im dolaze iz
 * repozitorija koji je serverski. Zato svaki ima serverski omotač koji
 * dohvati podatke i proslijedi ih kao propse — tako app/layout.tsx ostaje
 * netaknut, a pravilo 4 ostaje na snazi: jezik i lokal se čitaju IZ ADRESE.
 */

import type { Lokal } from "@/lib/domain"
import { resolveRoute, type RouteKontekst } from "@/lib/route"
import type { Lang } from "@/lib/domain"

/** Ono što serverski omotač proslijedi klijentskom tijelu. */
export interface OkvirPodaci {
  lokali: Lokal[]
  glavniSlug: string
}

/** Lokali koji stvarno imaju adrese. */
export function lokaliUPogonu(lokali: Lokal[]): Lokal[] {
  return lokali.filter((l) => l.stanje === "radi")
}

/**
 * Jezik i lokal iz trenutne adrese. Nikad iz kolačića ni iz stanja —
 * inače prekidači gube kontekst, a hidracija se razilazi.
 */
export function izPutanje(
  pathname: string,
  { lokali, glavniSlug }: OkvirPodaci,
): { lang: Lang; lokalSlug: string } {
  const ctx: RouteKontekst = {
    lokalSlugi: lokaliUPogonu(lokali).map((l) => l.slug),
    glavniSlug,
  }

  const ruta = resolveRoute(pathname.split("/").filter(Boolean), ctx)

  switch (ruta.kind) {
    case "lokal-home":
    case "lokal-page":
      return { lang: ruta.lang, lokalSlug: ruta.lokal }
    case "shared":
    case "seo":
      // Zajedničke i SEO stranice nemaju lokal u adresi → glavni.
      return { lang: ruta.lang, lokalSlug: glavniSlug }
    default:
      return { lang: "sl", lokalSlug: glavniSlug }
  }
}

/** Lokal na kojem se gost trenutno nalazi. */
export function trenutniLokal(
  lokali: Lokal[],
  lokalSlug: string,
  glavniSlug: string,
): Lokal | undefined {
  return (
    lokali.find((l) => l.slug === lokalSlug) ??
    lokali.find((l) => l.slug === glavniSlug)
  )
}
