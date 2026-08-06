// Serverski omotač — telefon i kategorije dolaze iz repozitorija,
// nikad ukucani u komponentu.

import { repo } from "@/lib/repo"
import { MobileCTAKlijent } from "./MobileCTAKlijent"

export async function MobileCTA() {
  const [lokali, glavni, kategorije] = await Promise.all([
    repo.getLokali(),
    repo.getGlavniLokal(),
    repo.getKategorije(),
  ])

  return (
    <MobileCTAKlijent
      lokali={lokali}
      glavniSlug={glavni.slug}
      kategorije={kategorije}
    />
  )
}
