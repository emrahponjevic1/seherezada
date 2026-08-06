// Serverski omotač — podnožje čita lokale iz repozitorija.
// Renderuje se JEDNOM, u toku dokumenta (vidi app/layout.tsx).

import { repo } from "@/lib/repo"
import { FooterKlijent } from "./FooterKlijent"

export async function Footer() {
  const [lokali, glavni] = await Promise.all([
    repo.getLokali(),
    repo.getGlavniLokal(),
  ])

  return <FooterKlijent lokali={lokali} glavniSlug={glavni.slug} />
}
