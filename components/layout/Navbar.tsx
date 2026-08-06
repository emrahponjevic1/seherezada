// Serverski omotač — dohvati lokale iz repozitorija i proslijedi ih.
// Tijelo je klijentsko jer nosi animacije, hamburger i prekidač teme.

import { repo } from "@/lib/repo"
import { NavbarKlijent } from "./NavbarKlijent"

export async function Navbar() {
  const [lokali, glavni] = await Promise.all([
    repo.getLokali(),
    repo.getGlavniLokal(),
  ])

  return <NavbarKlijent lokali={lokali} glavniSlug={glavni.slug} />
}
